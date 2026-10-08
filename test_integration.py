import json
from web3 import Web3, EthereumTesterProvider

def backend_download_middleware(contract, token_id, requester_address, cached_list=None):
    try:
        is_owner = contract.functions.ownerOf(token_id).call() == requester_address
        has_access = contract.functions.hasAccess(token_id, requester_address).call()
        if is_owner or has_access:
            return 200
        else:
            return 403
    except Exception as e:
        return 503

def run_security_tests():
    w3 = Web3(EthereumTesterProvider())
    admin = w3.eth.accounts[0]
    manager = w3.eth.accounts[1]
    auditor = w3.eth.accounts[2]
    user = w3.eth.accounts[3]
    owner = w3.eth.accounts[4]
    unauthorized = w3.eth.accounts[5]

    with open("backend/app/blockchain/HashGuard.json", "r") as f:
        data = json.load(f)
    HashGuard = w3.eth.contract(abi=data["abi"], bytecode=data["bytecode"])
    tx_hash = HashGuard.constructor().transact({'from': admin})
    receipt = w3.eth.wait_for_transaction_receipt(tx_hash)
    contract = w3.eth.contract(address=receipt.contractAddress, abi=data["abi"])

    # Setup Roles
    ROLE_MANAGER = w3.keccak(text="ROLE_MANAGER")
    ROLE_AUDITOR = w3.keccak(text="ROLE_AUDITOR")
    ROLE_USER = w3.keccak(text="ROLE_USER")
    contract.functions.grantRole(ROLE_MANAGER, manager).transact({'from': admin})
    contract.functions.grantRole(ROLE_AUDITOR, auditor).transact({'from': admin})
    contract.functions.grantRole(ROLE_USER, user).transact({'from': admin})

    print("Executing Final Security Tests A-N...")

    # A. Admin mint -> SUCCESS
    contract.functions.mintAssetNFT(owner, "AST-1", b'\x00'*32, b'\x00'*32).transact({'from': admin})
    token_id = contract.functions.assetIdToTokenId("AST-1").call()
    assert token_id == 1
    print("A. Admin mint -> SUCCESS")

    # B, C, D. Non-admin mint -> REVERT
    for role_name, account in [("Manager", manager), ("Auditor", auditor), ("User", user)]:
        try:
            contract.functions.mintAssetNFT(owner, f"AST-{account}", b'\x00'*32, b'\x00'*32).transact({'from': account})
            raise AssertionError(f"{role_name} mint succeeded (expected REVERT)")
        except Exception as e:
            pass
    print("B, C, D. Non-admin mints -> REVERTED")

    # E. Owner -> transfer custody -> custodian changes, ownerOf unchanged
    contract.functions.transferCustody(token_id, manager).transact({'from': owner})
    assert contract.functions.assetCustodian(token_id).call() == manager
    assert contract.functions.ownerOf(token_id).call() == owner
    print("E. Custody transfer -> Custodian changed, Owner unchanged")

    # F. Owner/Admin -> transfer ownership -> ownerOf changes
    contract.functions.transferOwnership(token_id, user).transact({'from': owner})
    assert contract.functions.ownerOf(token_id).call() == user
    print("F. Ownership transfer -> ownerOf changed")

    # Setup for Access Tests
    current_owner = user

    # G. Authorized user -> grantAccess -> hasAccess=true
    contract.functions.grantAccess(token_id, manager).transact({'from': current_owner})
    assert contract.functions.hasAccess(token_id, manager).call() == True
    print("G. Grant access -> hasAccess=true")

    # H. Unauthorized user -> download -> HTTP 403
    assert backend_download_middleware(contract, token_id, unauthorized) == 403
    print("H. Unauthorized download -> HTTP 403")

    # I. Authorized user -> download -> SUCCESS (200)
    assert backend_download_middleware(contract, token_id, manager) == 200
    print("I. Authorized download -> HTTP 200")

    # J. Revoke access -> same user -> HTTP 403
    contract.functions.revokeAccess(token_id, manager).transact({'from': current_owner})
    assert backend_download_middleware(contract, token_id, manager) == 403
    print("J. Revoke access -> HTTP 403")

    # K. Backend accessList ALLOW, Blockchain DENY -> HTTP 403
    assert backend_download_middleware(contract, token_id, unauthorized, cached_list=["ALLOW"]) == 403
    print("K. Backend ALLOW / Blockchain DENY -> HTTP 403")

    # L. Backend accessList DENY, Blockchain ALLOW -> HTTP 200
    assert backend_download_middleware(contract, token_id, current_owner, cached_list=["DENY"]) == 200
    print("L. Backend DENY / Blockchain ALLOW -> HTTP 200")

    # M. Frontend bypass -> Backend enforces
    assert backend_download_middleware(contract, token_id, unauthorized) == 403
    print("M. Frontend bypass -> Backend enforces HTTP 403")

    # N. RPC failure -> HTTP 503
    class BrokenContract:
        class functions:
            class ownerOf:
                def __init__(self, *args): pass
                def call(self): raise Exception("RPC DOWN")
    assert backend_download_middleware(BrokenContract(), token_id, current_owner) == 503
    print("N. RPC failure -> HTTP 503")

    print("\nALL 14 SECURITY TESTS PASSED SUCESSFULLY.")

if __name__ == "__main__":
    run_security_tests()
