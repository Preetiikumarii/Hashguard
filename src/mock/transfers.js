export const mockTransfers = [
  {
    id: "TR-001",
    evidenceId: "EV-001",
    evidenceTitle: "LockBit 3.0 Ransomware Encryptor Payload",
    evidenceType: "Malware Binary",
    fromOrg: "Organization A (CERT-Alpha)",
    fromActor: "ops-transport@org-a.gov",
    toOrg: "Organization B (Cyber Lab)",
    toActor: "analyst@org-b.lab",
    status: "VERIFIED",
    transferProtocol: "mTLS Encrypted Transport + Signed Manifest",
    manifestHash: "8f3a91bc72f4cd2a4e9b671a5c28e930f1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6",
    initiatedAt: "2026-08-16 09:15:30 UTC",
    completedAt: "2026-08-16 10:42:17 UTC",
    blockchainTx: "0x3e18a94c05f2b7d81a94b2e619c054f281e7d9a3b04c81f2e5a6d7c8b9a0e1f2",
    steps: [
      { step: "MANIFEST_SIGN", org: "Organization A", timestamp: "09:15:30", status: "COMPLETED" },
      { step: "SECURE_DISPATCH", org: "Organization A", timestamp: "09:20:10", status: "COMPLETED" },
      { step: "PAYLOAD_RECEIVE", org: "Organization B", timestamp: "10:40:02", status: "COMPLETED" },
      { step: "INTEGRITY_VERIFY", org: "Organization B", timestamp: "10:42:17", status: "COMPLETED" }
    ],
    notes: "Urgent forensic request from CERT-Alpha for reverse engineering decompilation."
  },
  {
    id: "TR-002",
    evidenceId: "EV-002",
    evidenceTitle: "CobaltStrike C2 Traffic Capture (pcapng)",
    evidenceType: "Network Capture",
    fromOrg: "Organization A (CERT-Alpha)",
    fromActor: "soc-sensor-04@org-a.gov",
    toOrg: "Organization B (Cyber Lab)",
    toActor: "analyst@org-b.lab",
    status: "VERIFIED",
    transferProtocol: "mTLS Encrypted Transport + Signed Manifest",
    manifestHash: "91bd3e81a4b98c37d0421e5f88410291ba4c9d0e1f2a3b4c5d6e7f8a9b0c1d2e",
    initiatedAt: "2026-08-16 09:30:00 UTC",
    completedAt: "2026-08-16 10:55:20 UTC",
    blockchainTx: "0x12a4b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7",
    steps: [
      { step: "MANIFEST_SIGN", org: "Organization A", timestamp: "09:30:00", status: "COMPLETED" },
      { step: "SECURE_DISPATCH", org: "Organization A", timestamp: "09:35:12", status: "COMPLETED" },
      { step: "PAYLOAD_RECEIVE", org: "Organization B", timestamp: "10:50:00", status: "COMPLETED" },
      { step: "INTEGRITY_VERIFY", org: "Organization B", timestamp: "10:55:20", status: "COMPLETED" }
    ],
    notes: "Correlated network dump for timeline synchronization."
  },
  {
    id: "TR-003",
    evidenceId: "EV-003",
    evidenceTitle: "Domain Controller Host Memory Acquisition",
    evidenceType: "Memory Dump",
    fromOrg: "Organization D (Cyber Crime Police LEA)",
    fromActor: "investigator-lead@police.gov",
    toOrg: "Organization B (Cyber Lab)",
    toActor: "analyst-lead@org-b.lab",
    status: "TRANSFERRING",
    transferProtocol: "Encrypted Dedicated Tunnel + S3 Chunking",
    manifestHash: "73af9284cb9183472091ea284918230491820491820394810293840192830192",
    initiatedAt: "2026-08-16 11:30:40 UTC",
    completedAt: null,
    blockchainTx: "0x8924b1029e847c5d6a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f",
    steps: [
      { step: "MANIFEST_SIGN", org: "Organization D", timestamp: "11:30:40", status: "COMPLETED" },
      { step: "SECURE_DISPATCH", org: "Organization D", timestamp: "11:32:00", status: "IN_PROGRESS" },
      { step: "PAYLOAD_RECEIVE", org: "Organization B", timestamp: null, status: "PENDING" },
      { step: "INTEGRITY_VERIFY", org: "Organization B", timestamp: null, status: "PENDING" }
    ],
    notes: "Large 32GB memory capture stream. 68% synchronized off-chain."
  },
  {
    id: "TR-004",
    evidenceId: "EV-004",
    evidenceTitle: "Endpoint WS-104 BitLocker Encrypted Disk Image",
    evidenceType: "Disk Image",
    fromOrg: "Organization A (CERT-Alpha)",
    fromActor: "forensics-unit@org-a.gov",
    toOrg: "Organization B (Cyber Lab)",
    toActor: "analyst@org-b.lab",
    status: "REQUESTED",
    transferProtocol: "Hardware Escrow Courier + Pre-signed Manifest",
    manifestHash: "dff87f31917864f60fc10d7854cfffee24113dd68f0d3d69b22944bf69ed5f64",
    initiatedAt: "2026-08-16 12:10:00 UTC",
    completedAt: null,
    blockchainTx: "0x7a3e81f9b0c24d65891a2bc4e5f67a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f",
    steps: [
      { step: "MANIFEST_SIGN", org: "Organization A", timestamp: "12:10:00", status: "COMPLETED" },
      { step: "SECURE_DISPATCH", org: "Organization A", timestamp: null, status: "PENDING" },
      { step: "PAYLOAD_RECEIVE", org: "Organization B", timestamp: null, status: "PENDING" },
      { step: "INTEGRITY_VERIFY", org: "Organization B", timestamp: null, status: "PENDING" }
    ],
    notes: "Awaiting receiver organization cryptographic authorization approval."
  },
  {
    id: "TR-005",
    evidenceId: "EV-001",
    evidenceTitle: "LockBit 3.0 Trial Dossier & Cryptographic Verification Report",
    evidenceType: "Malware Analysis Report",
    fromOrg: "Organization B (Cyber Lab)",
    fromActor: "analyst-lead@cyberlab.local",
    toOrg: "Organization C (Judicial Court Registry)",
    toActor: "registrar@court.gov.in",
    status: "VERIFIED",
    transferProtocol: "mTLS Encrypted Judicial Channel + Signed Manifest",
    manifestHash: "8f3a91bc72f4cd2a4e9b671a5c28e930f1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6",
    initiatedAt: "2026-08-16 14:00:00 UTC",
    completedAt: "2026-08-16 14:15:30 UTC",
    blockchainTx: "0x4b7c81f3d8a94b2e619c054f281e7d9a3b04c81f2e5a6d7c8b9a0e1f2a3b4c5d",
    steps: [
      { step: "MANIFEST_SIGN", org: "Organization B", timestamp: "14:00:00", status: "COMPLETED" },
      { step: "SECURE_DISPATCH", org: "Organization B", timestamp: "14:05:00", status: "COMPLETED" },
      { step: "PAYLOAD_RECEIVE", org: "Organization C", timestamp: "14:12:10", status: "COMPLETED" },
      { step: "INTEGRITY_VERIFY", org: "Organization C", timestamp: "14:15:30", status: "COMPLETED" }
    ],
    notes: "Official submission of reverse-engineered findings and Cryptographic Verification Report for case trial proceedings."
  },
  {
    id: "TR-009",
    evidenceId: "EV-009",
    evidenceTitle: "Suspicious Ransomware Artifact",
    evidenceType: "Malware Binary",
    fromOrg: "Organization D (Cyber Crime Police LEA)",
    fromActor: "investigator-patel@police.gov",
    toOrg: "Organization B (Cyber Lab)",
    toActor: "qa-auditor@org-b.lab",
    status: "FAILED",
    transferProtocol: "Direct Vault Pull",
    manifestHash: "8f3a91bc72f4cd2a4e9b671a5c28e930f1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6",
    initiatedAt: "2026-08-16 09:35:00 UTC",
    completedAt: "2026-08-16 09:40:11 UTC",
    blockchainTx: "0xc04f6c55b0fa6ffd8c98cfdbb8a199a149887e935fde2d3370846588d5076d3b",
    steps: [
      { step: "MANIFEST_SIGN", org: "Organization D", timestamp: "09:35:00", status: "COMPLETED" },
      { step: "SECURE_DISPATCH", org: "Organization D", timestamp: "09:37:00", status: "COMPLETED" },
      { step: "PAYLOAD_RECEIVE", org: "Organization B", timestamp: "09:39:10", status: "COMPLETED" },
      { step: "INTEGRITY_VERIFY", org: "Organization B", timestamp: "09:40:11", status: "FAILED" }
    ],
    notes: "TRANSFER REJECTED: Hash verification failed upon receipt. Off-chain payload compromised."
  },
  {
    id: "TR-010-CRITICAL",
    evidenceId: "EV-001",
    evidenceTitle: "LockBit 3.0 Ransomware Encryptor Payload",
    evidenceType: "Malware Binary",
    fromOrg: "Organization A (CERT-Alpha)",
    fromActor: "Cmdr. Rajesh Kumar (Org A)",
    toOrg: "Organization B (Cyber Lab)",
    toActor: "Dr. Sarah Chen (Org B)",
    status: "AWAITING_APPROVAL",
    requiresQuorum: true,
    approvals: [
      {
        approverDid: "did:ethr:0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
        approverName: "Cmdr. Rajesh Kumar",
        approverRole: "CERT-Alpha Commander (Org A)",
        signedAt: "2026-09-28 10:15:00 IST"
      }
    ],
    transferProtocol: "Consortium Quorum Protocol + mTLS Dispatch",
    manifestHash: "8f3a91bc72f4cd2a4e9b671a5c28e930f1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6",
    initiatedAt: "2026-09-28 10:15:00 IST",
    completedAt: null,
    blockchainTx: "0xpending_application_quorum_gate",
    notes: "CRITICAL ASSET: Transfer requires 2-of-3 consortium signers before state transition to DISPATCHED."
  }
];
