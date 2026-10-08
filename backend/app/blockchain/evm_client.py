import os
import time
from web3 import Web3

class EvmClient:
    def __init__(self):
        rpc_url = os.getenv("EVM_RPC_URL", "http://localhost:8545")
        self.w3 = Web3(Web3.HTTPProvider(rpc_url))
        
        self.contract = None
        self.account = None
        self.contract_address = None

    def connect_and_deploy(self):
        # Wait for connection
        retries = 10
        while not self.w3.is_connected() and retries > 0:
            print("Waiting for EVM node...")
            time.sleep(2)
            retries -= 1
            
        if not self.w3.is_connected():
            print("Failed to connect to EVM node. Contract deployment skipped.")
            return
            
        # Use first account as the admin
        self.account = self.w3.eth.accounts[0]
        self.w3.eth.default_account = self.account
        
        # Read pre-compiled contract
        import json
        contract_path = os.path.join(os.path.dirname(__file__), "HashGuard.json")
        with open(contract_path, "r") as f:
            compiled = json.load(f)

        bytecode = compiled["bytecode"]
        abi = compiled["abi"]

        HashGuard = self.w3.eth.contract(abi=abi, bytecode=bytecode)
        
        # Deploy
        tx_hash = HashGuard.constructor().transact({'from': self.account})
        tx_receipt = self.w3.eth.wait_for_transaction_receipt(tx_hash)
        
        self.contract_address = tx_receipt.contractAddress
        self.contract = self.w3.eth.contract(address=self.contract_address, abi=abi)
        print(f"Contract deployed at: {self.contract_address}")
        
        # Grant ROLE_COLLECTOR to self so we can mint
        role_collector = self.w3.keccak(text="ROLE_COLLECTOR")
        self.contract.functions.grantRole(role_collector, self.account).transact({'from': self.account})
        
        return self.contract_address

    def get_contract(self):
        if not self.contract:
            self.connect_and_deploy()
        return self.contract
        
    def mint_evidence_nft(self, asset_id: str, content_hash: bytes, metadata_hash: bytes):
        contract = self.get_contract()
        if not contract: return None
        
        # We use the server account as the initial owner since Web3 auth isn't fully wired
        tx_hash = contract.functions.mintEvidenceNFT(
            self.account,
            asset_id,
            content_hash,
            metadata_hash
        ).transact({'from': self.account})
        
        receipt = self.w3.eth.wait_for_transaction_receipt(tx_hash)
        return receipt

    def transfer_custody(self, token_id: int, new_owner: str):
        contract = self.get_contract()
        if not contract: return None
        tx_hash = contract.functions.transferCustody(
            token_id,
            new_owner
        ).transact({'from': self.account})
        receipt = self.w3.eth.wait_for_transaction_receipt(tx_hash)
        return receipt

    def verify_hash(self, token_id: int, observed_hash: bytes):
        contract = self.get_contract()
        if not contract: return False
        
        try:
            tx_hash = contract.functions.verifyHash(
                token_id,
                observed_hash
            ).transact({'from': self.account})
            receipt = self.w3.eth.wait_for_transaction_receipt(tx_hash)
            
            # Parse HashVerified event
            events = contract.events.HashVerified().process_receipt(receipt)
            if events:
                return events[0]['args']['valid']
        except Exception as e:
            print("Verify hash error:", e)
        return False


    def get_token_id_for_asset(self, asset_id: str):
        contract = self.get_contract()
        if not contract: return None
        return contract.functions.assetIdToTokenId(asset_id).call()

    def check_has_access(self, token_id: int, user_address: str):
        contract = self.get_contract()
        if not contract:
            raise Exception("Blockchain contract not connected/deployed.")
            
        # Check 1: Is Legal NFT Owner?
        is_owner = contract.functions.ownerOf(token_id).call() == user_address
        if is_owner:
            return True
            
        # Check 2: Is explicitly granted access in mapping(uint256 => mapping(address => bool))?
        has_access = contract.functions.hasAccess(token_id, user_address).call()
        return has_access
        try:
            # Smart contract serves as the ONLY source of truth
            is_owner = contract.functions.ownerOf(token_id).call() == user_address
            if is_owner:
                return True
            has_access = contract.functions.hasAccess(token_id, user_address).call()
            return has_access
        except Exception as e:
            print("Access check error:", e)
            return False


    def log_retention_event(self, token_id: int, event_type: str):
        contract = self.get_contract()
        if not contract: return None
        try:
            tx_hash = contract.functions.logRetentionEvent(
                token_id,
                event_type
            ).transact({'from': self.account})
            receipt = self.w3.eth.wait_for_transaction_receipt(tx_hash)
            return receipt
        except Exception as e:
            print("Log retention event error:", e)
        return None

evm_client = EvmClient()
