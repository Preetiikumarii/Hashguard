import json
import os
from web3 import Web3, EthereumTesterProvider

def test_contract():
    # Set up web3 and tester
    w3 = Web3(EthereumTesterProvider())
    accounts = w3.eth.accounts
    admin = accounts[0]
    manager = accounts[1]
    auditor = accounts[2]
    user = accounts[3]
    other = accounts[4]

    # Load ABI and Bytecode
    with open("backend/app/blockchain/HashGuard.json", "r") as f:
        contract_data = json.load(f)

    # Deploy contract
    HashGuard = w3.eth.contract(abi=contract_data["abi"], bytecode=contract_data["bytecode"])
    tx_hash = HashGuard.constructor().transact({'from': admin})
    tx_receipt = w3.eth.wait_for_transaction_receipt(tx_hash)
    contract = w3.eth.contract(address=tx_receipt.contractAddress, abi=contract_data["abi"])

    print("--- Test 1: Admin Mint (SUCCESS) ---")
    tx_hash = contract.functions.mintAssetNFT(user, "AST-001", b'\x00'*32, b'\x00'*32).transact({'from': admin})
    w3.eth.wait_for_transaction_receipt(tx_hash)
    print("Admin mint successful. Owner is:", contract.functions.ownerOf(1).call())

    print("--- Test 2: Manager Mint (REVERT) ---")
    try:
        contract.functions.mintAssetNFT(user, "AST-002", b'\x00'*32, b'\x00'*32).transact({'from': manager})
        print("FAIL: Manager should not be able to mint.")
    except Exception as e:
        print("Manager mint rejected successfully.")

    print("--- Test 3: Custody Transfer (Custody changes, Owner unchanged) ---")
    contract.functions.transferCustody(1, manager).transact({'from': admin})
    assert contract.functions.assetCustodian(1).call() == manager, "Custodian mismatch"
    assert contract.functions.ownerOf(1).call() == user, "Owner changed during custody transfer"
    print("Custody transferred to manager. NFT Owner is still user.")

    print("--- Test 4: Access Control ---")
    contract.functions.grantAccess(1, other).transact({'from': admin})
    assert contract.functions.hasAccess(1, other).call() == True, "Access not granted"
    print("Access granted to 'other' by admin.")
    
    try:
        contract.functions.revokeAccess(1, other).transact({'from': other})
        print("FAIL: Other should not be able to revoke their own access.")
    except Exception as e:
        print("Unauthorized revoke rejected successfully.")
    
    contract.functions.revokeAccess(1, other).transact({'from': admin})
    assert contract.functions.hasAccess(1, other).call() == False, "Access not revoked"
    print("Access revoked by admin.")

    print("--- Test 5: Ownership Transfer ---")
    contract.functions.transferOwnership(1, manager).transact({'from': admin})
    assert contract.functions.ownerOf(1).call() == manager, "Ownership did not change"
    assert contract.functions.assetCustodian(1).call() == manager, "Custodian incorrectly changed"
    print("Ownership transferred to manager successfully.")

    print("\nALL SMART CONTRACT TESTS PASSED.")

if __name__ == "__main__":
    test_contract()
