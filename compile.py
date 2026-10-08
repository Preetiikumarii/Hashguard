import solcx
import json
import os

solcx.install_solc("0.8.24")
contract_source = open("contracts/HASHGUARD.sol").read()

compiled_sol = solcx.compile_standard({
    "language": "Solidity",
    "sources": {"HASHGUARD.sol": {"content": contract_source}},
    "settings": {
        "evmVersion": "cancun",
        "remappings": [
            "@openzeppelin/=node_modules/@openzeppelin/"
        ],
        "outputSelection": {
            "*": {
                "*": ["abi", "metadata", "evm.bytecode", "evm.sourceMap"]
            }
        }
    },
}, solc_version="0.8.24")

bytecode = compiled_sol["contracts"]["HASHGUARD.sol"]["HASHGUARD"]["evm"]["bytecode"]["object"]
abi = compiled_sol["contracts"]["HASHGUARD.sol"]["HASHGUARD"]["abi"]

# Save to backend
os.makedirs("backend/app/blockchain", exist_ok=True)
with open("backend/app/blockchain/HashGuard.json", "w") as f:
    json.dump({"abi": abi, "bytecode": bytecode}, f, indent=2)

# Save to frontend
os.makedirs("src/contracts", exist_ok=True)
with open("src/contracts/HashGuard.json", "w") as f:
    json.dump({"abi": abi, "bytecode": bytecode}, f, indent=2)

print("Compilation successful! ABI & Bytecode updated in backend and frontend.")
