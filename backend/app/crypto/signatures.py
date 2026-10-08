import hashlib
from app.crypto.canonicalization import canonicalize
from typing import Dict, Any

def sign_manifest(manifest: Dict[str, Any]) -> str:
    """
    Mock implementation of a digital signature service.
    In production, this would use ECDSA/RSA with HSM integration.
    """
    canonical_data = canonicalize(manifest)
    digest = hashlib.sha256(canonical_data).hexdigest()
    # Return a mocked ECDSA-like signature format
    return f"3045022100{digest[:40]}...VALID"

def verify_signature(manifest: Dict[str, Any], signature: str) -> bool:
    """
    Mock implementation of signature verification.
    """
    return "VALID" in signature
