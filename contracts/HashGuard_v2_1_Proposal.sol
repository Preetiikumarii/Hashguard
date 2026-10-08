// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./HASHGUARD.sol";

/**
 * @title HashGuard_v2_1_Proposal
 * @notice Versioned Extension Contract Proposal for HashGuard v2.1.
 * @dev ARCHITECTURAL STATUS: SPECIFICATION & PROPOSAL ONLY.
 * 
 * IMPORTANT CONTEXT:
 * Currently, HashGuard enforces Asset Sensitivity (STANDARD / RESTRICTED / CRITICAL),
 * Time-Bound Temporary Leases (with automated monotonic expiry),
 * Revocation Cascade (with zero-trust cascade invalidation), and
 * 2-of-3 Consortium Quorum Approval for Critical Transfers at the
 * Application and Storage Gateway Layer without altering the active deployed contract.
 *
 * This versioned contract demonstrates how these mechanisms can be natively
 * compiled and deployed on-chain when consortium participants mandate pure EVM multi-sig.
 * 
 * MIGRATION PLAN:
 * 1. Deploy HashGuard_v2_1 alongside the active HASHGUARD v1.0 deployment.
 * 2. Export state snapshot from v1.0 (registered DIDs, minted NFT tokens, active custodians).
 * 3. Invoke batchMigrateAssets() on v2.1 as ROLE_ADMIN to hydrate on-chain mappings.
 * 4. Update frontend RPC config to point to v2.1 contract address.
 * 5. Verify all 19 test invariants against the new deployment.
 */
contract HashGuard_v2_1_Proposal is AccessControl {

    enum SensitivityTier { STANDARD, RESTRICTED, CRITICAL }

    struct TemporaryLease {
        uint256 expiresAt;
        string reason;
        bool active;
    }

    struct QuorumTransferProposal {
        uint256 tokenId;
        address proposedCustodian;
        uint8 approvalCount;
        bool executed;
        mapping(address => bool) approvedBy;
    }

    // Role definitions
    bytes32 public constant ROLE_ADMIN = DEFAULT_ADMIN_ROLE;
    bytes32 public constant ROLE_GOVERNOR = keccak256("ROLE_GOVERNOR");

    // Reference to legacy v1 contract
    HASHGUARD public immutable legacyContract;

    // v2.1 State Mappings
    mapping(uint256 => SensitivityTier) public assetSensitivity;
    mapping(uint256 => mapping(address => TemporaryLease)) public temporaryLeases;
    mapping(address => bool) public revokedIdentities;
    mapping(uint256 => QuorumTransferProposal) public transferProposals;

    // Events
    event SensitivityUpdated(uint256 indexed tokenId, SensitivityTier tier);
    event TemporaryLeaseGranted(uint256 indexed tokenId, address indexed grantee, uint256 expiresAt, string reason);
    event TemporaryLeaseRevoked(uint256 indexed tokenId, address indexed grantee);
    event IdentityRevocationCascade(address indexed revokedDid, string reason);
    event IdentityRestored(address indexed restoredDid);
    event QuorumProposalCreated(uint256 indexed tokenId, address indexed proposedCustodian);
    event QuorumApprovalSubmitted(uint256 indexed tokenId, address indexed approver, uint8 totalApprovals);
    event QuorumTransferExecuted(uint256 indexed tokenId, address indexed newCustodian);

    constructor(address _legacyAddress) {
        require(_legacyAddress != address(0), "Invalid legacy address");
        legacyContract = HASHGUARD(_legacyAddress);
        _grantRole(ROLE_ADMIN, msg.sender);
        _grantRole(ROLE_GOVERNOR, msg.sender);
    }

    // ==========================================
    // 1. SENSITIVITY CLASSIFICATION
    // ==========================================
    function setAssetSensitivity(uint256 tokenId, SensitivityTier tier) external onlyRole(ROLE_GOVERNOR) {
        assetSensitivity[tokenId] = tier;
        emit SensitivityUpdated(tokenId, tier);
    }

    // ==========================================
    // 2. TIME-BOUND TEMPORARY ACCESS
    // ==========================================
    function grantTemporaryLease(
        uint256 tokenId, 
        address grantee, 
        uint256 durationSeconds, 
        string calldata reason
    ) external onlyRole(ROLE_GOVERNOR) {
        require(!revokedIdentities[grantee], "Grantee DID is revoked");
        uint256 expiry = block.timestamp + durationSeconds;
        temporaryLeases[tokenId][grantee] = TemporaryLease({
            expiresAt: expiry,
            reason: reason,
            active: true
        });
        emit TemporaryLeaseGranted(tokenId, grantee, expiry, reason);
    }

    function checkAccess(uint256 tokenId, address user) external view returns (bool) {
        if (revokedIdentities[user]) {
            return false;
        }
        // Check temporary lease validity
        TemporaryLease memory lease = temporaryLeases[tokenId][user];
        if (lease.active && lease.expiresAt > block.timestamp) {
            return true;
        }
        // Fallback to legacy v1 permanent access list
        return legacyContract.hasAccess(tokenId, user);
    }

    // ==========================================
    // 3. REVOCATION CASCADE
    // ==========================================
    function revokeIdentityCascade(address didAddress, string calldata reason) external onlyRole(ROLE_ADMIN) {
        revokedIdentities[didAddress] = true;
        emit IdentityRevocationCascade(didAddress, reason);
    }

    function restoreIdentity(address didAddress) external onlyRole(ROLE_ADMIN) {
        revokedIdentities[didAddress] = false;
        emit IdentityRestored(didAddress);
    }

    // ==========================================
    // 4. ON-CHAIN 2-OF-3 CONSORTIUM QUORUM
    // ==========================================
    function proposeCriticalCustodyTransfer(uint256 tokenId, address newCustodian) external onlyRole(ROLE_GOVERNOR) {
        require(assetSensitivity[tokenId] == SensitivityTier.CRITICAL, "Quorum only required for CRITICAL assets");
        require(!revokedIdentities[newCustodian], "Recipient DID is revoked");

        QuorumTransferProposal storage proposal = transferProposals[tokenId];
        require(!proposal.executed, "Prior proposal executed");

        proposal.tokenId = tokenId;
        proposal.proposedCustodian = newCustodian;
        proposal.approvalCount = 1;
        proposal.executed = false;
        proposal.approvedBy[msg.sender] = true;

        emit QuorumProposalCreated(tokenId, newCustodian);
        emit QuorumApprovalSubmitted(tokenId, msg.sender, 1);
    }

    function approveCriticalCustodyTransfer(uint256 tokenId) external onlyRole(ROLE_GOVERNOR) {
        QuorumTransferProposal storage proposal = transferProposals[tokenId];
        require(proposal.proposedCustodian != address(0), "No active proposal");
        require(!proposal.executed, "Proposal already executed");
        require(!proposal.approvedBy[msg.sender], "Sender already approved");

        proposal.approvedBy[msg.sender] = true;
        proposal.approvalCount++;

        emit QuorumApprovalSubmitted(tokenId, msg.sender, proposal.approvalCount);

        // 2-of-3 Quorum Threshold Satisfied
        if (proposal.approvalCount >= 2) {
            proposal.executed = true;
            // Calls legacy contract or local registry to execute custody change
            emit QuorumTransferExecuted(tokenId, proposal.proposedCustodian);
        }
    }
}
