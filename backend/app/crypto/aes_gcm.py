import os
from cryptography.hazmat.primitives.ciphers.aead import AESGCM

class AES256GCM:
    def __init__(self, key: bytes = None):
        # In production, load from KMS. For demo, generate or use static
        self.key = key or AESGCM.generate_key(bit_length=256)
        self.aesgcm = AESGCM(self.key)

    def encrypt(self, data: bytes, associated_data: bytes = None) -> bytes:
        # A nonce should be unique for every encryption with the same key
        nonce = os.urandom(12)
        ciphertext = self.aesgcm.encrypt(nonce, data, associated_data)
        # Prepend nonce to ciphertext for decryption
        return nonce + ciphertext

    def decrypt(self, encrypted_data: bytes, associated_data: bytes = None) -> bytes:
        # Extract the 12-byte nonce
        nonce = encrypted_data[:12]
        ciphertext = encrypted_data[12:]
        return self.aesgcm.decrypt(nonce, ciphertext, associated_data)

# Global instance for demo (uses random key per startup)
aes_service = AES256GCM()
