import os
import json
from web3 import Web3
from dotenv import load_dotenv

def deploy():
    load_dotenv()
    rpc_url = os.environ.get("SEPOLIA_RPC_URL")
    private_key = os.environ.get("DEPLOYER_PRIVATE_KEY")

    if not rpc_url or not private_key:
        print("Error: Missing SEPOLIA_RPC_URL or DEPLOYER_PRIVATE_KEY in .env")
        return

    w3 = Web3(Web3.HTTPProvider(rpc_url))
    if not w3.is_connected():
        print("Error: Cannot connect to Sepolia RPC.")
        return

    account = w3.eth.account.from_key(private_key)
    print(f"Connected to Sepolia. Deployer Address: {account.address}")
    
    balance = w3.eth.get_balance(account.address)
    print(f"Balance: {w3.from_wei(balance, 'ether')} ETH")
    
    if balance == 0:
        print("Error: Insufficient Sepolia ETH for deployment.")
        return

    # Load compiled contract
    with open("backend/app/blockchain/HashGuard.json", "r") as f:
        contract_data = json.load(f)

    HashGuard = w3.eth.contract(abi=contract_data["abi"], bytecode=contract_data["bytecode"])
    
    print("Estimating gas for deployment...")
    # Estimate gas needed
    constructor = HashGuard.constructor()
    estimated_gas = constructor.estimate_gas({'from': account.address})
    gas_to_use = int(estimated_gas * 1.2) # Add 20% buffer
    print(f"Estimated Gas: {gas_to_use}")

    print("Building deployment transaction...")
    transaction = constructor.build_transaction({
        'chainId': 11155111,
        'gas': gas_to_use,
        'maxFeePerGas': w3.to_wei('5', 'gwei'),
        'maxPriorityFeePerGas': w3.to_wei('1', 'gwei'),
        'nonce': w3.eth.get_transaction_count(account.address),
    })

    print("Signing transaction...")
    signed_txn = w3.eth.account.sign_transaction(transaction, private_key=private_key)
    
    print("Broadcasting to Sepolia...")
    tx_hash = w3.eth.send_raw_transaction(signed_txn.raw_transaction)
    print(f"Waiting for confirmation... TX Hash: {w3.to_hex(tx_hash)}")
    
    tx_receipt = w3.eth.wait_for_transaction_receipt(tx_hash)
    contract_address = tx_receipt.contractAddress
    
    print(f"SUCCESS! Contract deployed to: {contract_address}")
    print(f"Block Number: {tx_receipt.blockNumber}")
    print("\n--- NEXT STEPS ---")
    print(f"1. Add this to your .env file: HASHGUARD_CONTRACT_ADDRESS={contract_address}")
    print("2. Restart your backend and frontend servers.")

if __name__ == "__main__":
    deploy()
