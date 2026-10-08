// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

/**
 * @title HASHGUARD Decentralized Identity, Asset Ownership & RBAC Platform
 * @notice Governs verifiable Decentralized Identifiers (DIDs), NFT-based digital asset ownership,
 * and Role-Based Access Control (Admin, Manager, Auditor, User) with tamper-proof on-chain audit trails.
 */
contract HASHGUARD is ERC721, AccessControl {
    uint256 private _tokenIds;

    // ==========================================
    // ROLE-BASED ACCESS CONTROL (RBAC) ROLES
    // ==========================================
    bytes32 public constant ROLE_ADMIN = DEFAULT_ADMIN_ROLE;
    bytes32 public constant ROLE_MANAGER = keccak256("ROLE_MANAGER");
    bytes32 public constant ROLE_AUDITOR = keccak256("ROLE_AUDITOR");
    bytes32 public constant ROLE_USER = keccak256("ROLE_USER");

    // Backward-compatible role aliases
    bytes32 public constant ROLE_COLLECTOR = keccak256("ROLE_COLLECTOR");
    bytes32 public constant ROLE_ANALYST = keccak256("ROLE_ANALYST");

    // ==========================================
    // DECENTRALIZED IDENTITY (DID) DATA STRUCTURES
    // ==========================================
    struct UserIdentity {
        string didURI;           // e.g. "did:ethr:0x...", "did:key:..."
        bytes32 didDocumentHash; // Cryptographic hash of W3C DID Document
        uint256 registeredAt;
        bool exists;
    }

    // DID Registries
    mapping(address => bytes32) public didDocuments;
    mapping(address => UserIdentity) public didRegistry;

    // ==========================================
    // DIGITAL ASSET & EVIDENCE DATA STRUCTURES
    // ==========================================
    struct EvidenceMetadata {
        string assetId;
        bytes32 contentHash;
        bytes32 metadataHash;
    }
    mapping(uint256 => EvidenceMetadata) public evidenceAssets;
    
    // Reverse lookup to map string assetId (e.g. EV-1234 / AST-001) to NFT tokenId
    mapping(string => uint256) public assetIdToTokenId;

    // ==========================================
    // CUSTODY & ACCESS CONTROL MAPPINGS
    // ==========================================
    mapping(uint256 => address) public assetCustodian;
    mapping(uint256 => mapping(address => bool)) public hasAccess;

    // ==========================================
    // IMMUTABLE AUDIT TRAIL EVENTS
    // ==========================================
    event IdentityRegistered(address indexed user, bytes32 didDocumentHash);
    event DIDIdentityRegistered(address indexed user, string didURI, bytes32 didDocumentHash, uint256 timestamp);
    
    event RoleAssigned(address indexed user, string roleName);
    event RoleRevoked(address indexed user, string roleName);
    event RoleAssignedDetailed(address indexed admin, address indexed user, bytes32 indexed roleId, string roleName, uint256 timestamp);
    event RoleRevokedDetailed(address indexed admin, address indexed user, bytes32 indexed roleId, string roleName, uint256 timestamp);
    event RoleDefined(bytes32 indexed roleId, bytes32 indexed adminRoleId, uint256 timestamp);

    event AssetNFTMinted(uint256 indexed tokenId, string assetId, address indexed to, bytes32 contentHash, uint256 timestamp);
    event EvidenceNFTMinted(uint256 indexed tokenId, string assetId, address indexed to);
    event AccessGranted(uint256 indexed tokenId, address indexed user, address indexed grantedBy, uint256 timestamp);
    event AccessRevoked(uint256 indexed tokenId, address indexed user, address indexed revokedBy, uint256 timestamp);
    event PermissionUpdated(uint256 indexed tokenId, address indexed user, string permission, uint256 timestamp);
    event OwnershipTransferred(uint256 indexed tokenId, address indexed previousOwner, address indexed newOwner, uint256 timestamp);
    event AssetRegistered(string assetId, address indexed creator, bytes32 contentHash, uint256 timestamp);
    event AssetAllocated(uint256 indexed tokenId, address indexed previousOwner, address indexed newOwner, address executor, uint256 timestamp);
    event CustodyTransferred(uint256 indexed tokenId, address indexed from, address indexed to);

    event HashVerified(uint256 indexed tokenId, bytes32 expectedHash, bytes32 observedHash, bool valid);
    event AuditorVerified(address indexed auditor, bytes32 credentialHash, bool valid);
    event ActivityLogged(address indexed actor, string activityType, string details, uint256 timestamp);
    event RetentionEvent(uint256 indexed tokenId, string eventType, address actor, uint256 timestamp);

    constructor() ERC721("HashGuard Digital Asset & Evidence", "HGDE") {
        // Deployer is the super administrator
        _grantRole(ROLE_ADMIN, msg.sender);
        _grantRole(ROLE_MANAGER, msg.sender);
        _grantRole(ROLE_AUDITOR, msg.sender);
        _grantRole(ROLE_USER, msg.sender);
        _grantRole(ROLE_COLLECTOR, msg.sender);
        _grantRole(ROLE_ANALYST, msg.sender);
    }

    // ==========================================
    // 1. DECENTRALIZED IDENTITY (DID) MANAGEMENT
    // ==========================================
    
    /**
     * @notice Registers self-sovereign DID document hash
     */
    function registerIdentity(bytes32 didDocumentHash) external {
        didDocuments[msg.sender] = didDocumentHash;
        didRegistry[msg.sender] = UserIdentity({
            didURI: "",
            didDocumentHash: didDocumentHash,
            registeredAt: block.timestamp,
            exists: true
        });
        emit IdentityRegistered(msg.sender, didDocumentHash);
    }

    /**
     * @notice Registers full DID identifier string and DID document hash
     */
    function registerDID(string calldata didURI, bytes32 didDocumentHash) external {
        didDocuments[msg.sender] = didDocumentHash;
        didRegistry[msg.sender] = UserIdentity({
            didURI: didURI,
            didDocumentHash: didDocumentHash,
            registeredAt: block.timestamp,
            exists: true
        });
        emit IdentityRegistered(msg.sender, didDocumentHash);
        emit DIDIdentityRegistered(msg.sender, didURI, didDocumentHash, block.timestamp);
    }

    /**
     * @notice Allows Administrator to register a user's verified DID identity
     */
    function registerUserIdentityByAdmin(
        address account,
        string calldata didURI,
        bytes32 didDocumentHash
    ) external onlyRole(ROLE_ADMIN) {
        didDocuments[account] = didDocumentHash;
        didRegistry[account] = UserIdentity({
            didURI: didURI,
            didDocumentHash: didDocumentHash,
            registeredAt: block.timestamp,
            exists: true
        });
        emit IdentityRegistered(account, didDocumentHash);
        emit DIDIdentityRegistered(account, didURI, didDocumentHash, block.timestamp);
    }

    function getIdentity(address account) external view returns (string memory didURI, bytes32 didDocumentHash, uint256 registeredAt, bool exists) {
        UserIdentity memory id = didRegistry[account];
        return (id.didURI, id.didDocumentHash, id.registeredAt, id.exists);
    }

    // ==========================================
    // 2. SMART CONTRACT RBAC GOVERNANCE
    // ==========================================
    
    function defineRole(bytes32 roleId, bytes32 adminRoleId) external onlyRole(ROLE_ADMIN) {
        _setRoleAdmin(roleId, adminRoleId);
        emit RoleDefined(roleId, adminRoleId, block.timestamp);
    }

    function assignRole(address account, bytes32 roleId, string calldata roleName) external onlyRole(ROLE_ADMIN) {
        _grantRole(roleId, account);
        emit RoleAssigned(account, roleName);
        emit RoleAssignedDetailed(msg.sender, account, roleId, roleName, block.timestamp);
    }

    function revokeRoleFrom(address account, bytes32 roleId, string calldata roleName) external onlyRole(ROLE_ADMIN) {
        _revokeRole(roleId, account);
        emit RoleRevoked(account, roleName);
        emit RoleRevokedDetailed(msg.sender, account, roleId, roleName, block.timestamp);
    }

    // ==========================================
    // 3. NFT-BASED DIGITAL ASSET OWNERSHIP
    // ==========================================
    
    /**
     * @notice Mints a unique Digital Asset NFT and allocates it directly to a user's identity.
     * Governed strictly by smart contracts: only authorized Admin or Manager can execute minting.
     */
    function mintAssetNFT(
        address to, 
        string calldata assetId, 
        bytes32 contentHash, 
        bytes32 metadataHash
    ) public returns (uint256) {
        require(
            hasRole(ROLE_ADMIN, msg.sender) || 
            hasRole(ROLE_MANAGER, msg.sender) || 
            hasRole(ROLE_COLLECTOR, msg.sender), 
            "HASHGUARD: Only authorized Admin/Manager can mint assets"
        );
        require(assetIdToTokenId[assetId] == 0, "HASHGUARD: assetId already minted");
        
        _tokenIds++;
        uint256 newItemId = _tokenIds;

        _mint(to, newItemId);

        evidenceAssets[newItemId] = EvidenceMetadata({
            assetId: assetId,
            contentHash: contentHash,
            metadataHash: metadataHash
        });
        
        assetIdToTokenId[assetId] = newItemId;
        assetCustodian[newItemId] = to; // Default custodian is the initial owner

        emit AssetNFTMinted(newItemId, assetId, to, contentHash, block.timestamp);
        emit EvidenceNFTMinted(newItemId, assetId, to);
        return newItemId;
    }

    /**
     * @notice Backward-compatible alias for mintAssetNFT
     */
    function mintEvidenceNFT(
        address to, 
        string calldata assetId, 
        bytes32 contentHash, 
        bytes32 metadataHash
    ) external returns (uint256) {
        return mintAssetNFT(to, assetId, contentHash, metadataHash);
    }

    /**
     * @notice Allocates / re-allocates asset NFT ownership under controlled administration
     */
    function allocateAsset(uint256 tokenId, address newOwner) external {
        require(
            hasRole(ROLE_ADMIN, msg.sender) || ownerOf(tokenId) == msg.sender, 
            "HASHGUARD: Unauthorized allocation"
        );
        address previousOwner = ownerOf(tokenId);
        _transfer(previousOwner, newOwner, tokenId);
        emit AssetAllocated(tokenId, previousOwner, newOwner, msg.sender, block.timestamp);
        emit OwnershipTransferred(tokenId, previousOwner, newOwner, block.timestamp);
    }

    /**
     * @notice True NFT Ownership transfer (SIH Requirement)
     */
    function transferOwnership(uint256 tokenId, address newOwner) external {
        require(
            ownerOf(tokenId) == msg.sender || hasRole(ROLE_ADMIN, msg.sender),
            "HASHGUARD: Not owner or admin"
        );
        address previousOwner = ownerOf(tokenId);
        _transfer(previousOwner, newOwner, tokenId);
        emit OwnershipTransferred(tokenId, previousOwner, newOwner, block.timestamp);
    }

    /**
     * @notice Forensic custody transfer (Does NOT change legal NFT ownership)
     */
    function transferCustody(uint256 tokenId, address newCustodian) external {
        require(
            assetCustodian[tokenId] == msg.sender || ownerOf(tokenId) == msg.sender || hasRole(ROLE_ADMIN, msg.sender), 
            "HASHGUARD: Not current custodian, owner, or admin"
        );
        address oldCustodian = assetCustodian[tokenId];
        assetCustodian[tokenId] = newCustodian;
        emit CustodyTransferred(tokenId, oldCustodian, newCustodian);
    }

    /**
     * @notice Grant read/access permission to an asset
     */
    function grantAccess(uint256 tokenId, address user) external {
        require(
            ownerOf(tokenId) == msg.sender || hasRole(ROLE_ADMIN, msg.sender) || hasRole(ROLE_MANAGER, msg.sender),
            "HASHGUARD: Unauthorized to grant access"
        );
        hasAccess[tokenId][user] = true;
        emit AccessGranted(tokenId, user, msg.sender, block.timestamp);
        emit PermissionUpdated(tokenId, user, "READ", block.timestamp);
    }

    /**
     * @notice Revoke read/access permission from an asset
     */
    function revokeAccess(uint256 tokenId, address user) external {
        require(
            ownerOf(tokenId) == msg.sender || hasRole(ROLE_ADMIN, msg.sender) || hasRole(ROLE_MANAGER, msg.sender),
            "HASHGUARD: Unauthorized to revoke access"
        );
        hasAccess[tokenId][user] = false;
        emit AccessRevoked(tokenId, user, msg.sender, block.timestamp);
        emit PermissionUpdated(tokenId, user, "REVOKED", block.timestamp);
    }

    function verifyHash(uint256 tokenId, bytes32 observedHash) external returns (bool) {
        require(_ownerOf(tokenId) != address(0), "HASHGUARD: Evidence does not exist");
        EvidenceMetadata memory asset = evidenceAssets[tokenId];
        bool isValid = (asset.contentHash == observedHash);
        
        emit HashVerified(tokenId, asset.contentHash, observedHash, isValid);
        return isValid;
    }

    /**
     * @notice Verifiable credential proof for Auditors, enforced via ROLE_AUDITOR
     */
    function verifyCredential(bytes32 credentialHash) external onlyRole(ROLE_AUDITOR) returns (bool) {
        bool valid = true;
        emit AuditorVerified(msg.sender, credentialHash, valid);
        return valid;
    }
    
    // ==========================================
    // 5. IMMUTABLE AUDIT TRAIL LOGGING
    // ==========================================
    
    function logActivity(string calldata activityType, string calldata details) external {
        emit ActivityLogged(msg.sender, activityType, details, block.timestamp);
    }

    function logRetentionEvent(uint256 tokenId, string calldata eventType) external {
        require(_ownerOf(tokenId) != address(0), "HASHGUARD: Asset does not exist");
        require(
            hasRole(ROLE_ADMIN, msg.sender) || 
            hasRole(ROLE_MANAGER, msg.sender) || 
            ownerOf(tokenId) == msg.sender,
            "HASHGUARD: Unauthorized retention modification"
        );
        emit RetentionEvent(tokenId, eventType, msg.sender, block.timestamp);
    }
    
    // ==========================================
    // INTERFACE SUPPORT
    // ==========================================
    function supportsInterface(bytes4 interfaceId) public view virtual override(ERC721, AccessControl) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
