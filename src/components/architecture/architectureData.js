/**
 * HASHGUARD System Architecture Component & Layer Definitions
 * Grounded strictly in repository inspection:
 * - Frontend: React 19.2.8, Vite 8.2.0, Tailwind CSS 3.4.17, @xyflow/react 12.11.3, Ethers.js v6.17.0
 * - Backend: Node.js Express Port 8001 (`node_backend/server.js`), FastAPI Python 3.11+ (`backend/app/main.py`), PostgreSQL 15, MinIO S3
 * - Blockchain: Solidity ^0.8.20 (`contracts/HASHGUARD.sol`), OpenZeppelin ERC721 + AccessControl, Ethereum Sepolia Live Contract: `0x3592925Cf64E7C3c68d4911b2ebC722c2Ea67052` (Chain ID 11155111), Local Anvil (Chain ID 31337)
 * - Cryptography: SHA-256 Bitstream acquisition & sealing, W3C DIDs (`did:ethr:...`), secp256k1 ECDSA
 */

export const ARCHITECTURE_NODES = {
  PRESENTATION: {
    id: 'presentation',
    layerNumber: '01',
    layerTitle: 'PRESENTATION LAYER',
    name: 'Presentation Layer',
    badge: 'React 19 • Web3 UI',
    status: 'IMPLEMENTED',
    category: 'client',
    accentColor: 'cyan',
    borderColor: 'border-cyan-500/40',
    bgGradient: 'from-cyan-950/40 to-slate-900/60',
    icon: 'Monitor',
    summary: 'The user-facing HashGuard interface through which authorized users interact with evidence, custody, verification, audit, lineage, and organizational workflows.',
    technologies: [
      { name: 'React 19.2.8', role: 'Component Framework' },
      { name: 'Vite 8.2.0', role: 'High-Performance Bundler' },
      { name: 'Tailwind CSS 3.4.17', role: 'Forensic SOC Design Tokens' },
      { name: '@xyflow/react 12.11.3', role: 'Interactive Lineage DAG Flow' },
      { name: 'Ethers.js v6.17.0', role: 'Web3 / EVM RPC Client' },
      { name: 'Lucide React 1.31.0', role: 'Security Iconography' }
    ],
    responsibilities: [
      'Evidence registration & bitstream file acquisition',
      'Unified forensic evidence dashboard & telemetry',
      'Cross-organization custody management & transfer workflows',
      '5-Point independent zero-trust verification suite',
      'Interactive Lineage DAG visualization & child derivation',
      'Immutable audit ledger timeline viewer',
      'Role-aware UI guards (6 RBAC roles)',
      'Organization-aware multi-tenant context switching (5 Orgs)'
    ],
    flow: [
      'Evidence File / Input Selected in UI',
      'Browser WebCrypto API generates initial SHA-256 digest',
      'Authenticated session token & DID signature attached',
      'Dispatched via REST API to backend or directly verified via EVM'
    ],
    whyItMatters: 'Provides forensic investigators, custodians, and court registrars with a zero-trust interface that enforces mathematical verification before presenting any evidence as authentic.',
    codeReferences: [
      'src/App.jsx',
      'src/context/AppContext.jsx',
      'src/pages/Evidence/EvidencePage.jsx',
      'src/pages/Verification/VerificationPage.jsx',
      'src/pages/Lineage/LineagePage.jsx',
      'src/components/lineage/LineageFlowGraph.jsx'
    ]
  },

  APPLICATION: {
    id: 'application',
    layerNumber: '02',
    layerTitle: 'APPLICATION / API LAYER',
    name: 'Application / API Layer',
    badge: 'Express Node.js • FastAPI Python',
    status: 'IMPLEMENTED',
    category: 'backend',
    accentColor: 'blue',
    borderColor: 'border-blue-500/40',
    bgGradient: 'from-blue-950/40 to-slate-900/60',
    icon: 'Server',
    summary: 'The backend service layer responsible for coordinating application workflows, evidence intake, cross-agency transfer state, and database persistence.',
    technologies: [
      { name: 'Node.js Express (Port 8001)', role: 'Microservice API & JSON DB' },
      { name: 'Python FastAPI (Port 8000)', role: 'Enterprise ASGI Core' },
      { name: 'Multer & File Storage', role: 'Evidence Upload Pipeline' },
      { name: 'Pydantic & SQLAlchemy', role: 'Data Validation & ORM' },
      { name: 'JWT & Bearer Tokens', role: 'Session Authentication' }
    ],
    responsibilities: [
      'User & organization authentication session management',
      'Evidence metadata registration & ingestion pipeline',
      'Cross-agency transfer queue state coordination',
      'Independent verification API requests & comparisons',
      'Organization tenant isolation & user provisioning',
      'Structured audit event logging & database synchronization',
      'Blockchain JSON-RPC provider bridge & transaction dispatch'
    ],
    flow: [
      'Inbound HTTP requests validated against OpenAPI/Pydantic schemas',
      'RBAC and organization tenant scope verified',
      'File stream received and binary SHA-256 verified on disk',
      'State persisted to database and smart contract transaction dispatched'
    ],
    whyItMatters: 'Coordinates sensitive forensic pipelines and enforces strict server-side validation so unauthenticated or non-permitted actors cannot register or transfer evidence exhibits.',
    codeReferences: [
      'node_backend/server.js',
      'backend/app/main.py',
      'backend/app/services/evidence_service.py',
      'backend/app/services/transfer_service.py',
      'src/services/api.js'
    ]
  },

  IDENTITY_RBAC: {
    id: 'identity_rbac',
    layerNumber: '03',
    layerTitle: 'IDENTITY & ACCESS CONTROL',
    name: 'Identity & Access Control',
    badge: 'W3C DIDs • EVM AccessControl',
    status: 'IMPLEMENTED',
    category: 'security',
    accentColor: 'purple',
    borderColor: 'border-purple-500/40',
    bgGradient: 'from-purple-950/40 to-slate-900/60',
    icon: 'KeyRound',
    summary: 'Controls who can perform which actions through a strict separation of WHO the actor is (DID Identity), WHERE they belong (Organization Context), and WHAT they are permitted to do (RBAC Role).',
    technologies: [
      { name: 'W3C DID v1.0 (did:ethr)', role: 'Decentralized Identifiers' },
      { name: 'secp256k1 Keypairs', role: 'Cryptographic Wallet Identity' },
      { name: 'OpenZeppelin AccessControl', role: 'On-Chain RBAC Governance' },
      { name: 'Multi-Tenant Scoping', role: 'Organization Enclave Isolation' }
    ],
    implementedRoles: [
      { code: 'FIRST_RESPONDER', title: 'First Responder', org: 'ORG_A (CERT-Alpha)', actions: 'Collect, SHA-256 Hash, Seal Manifest, Dispatch' },
      { code: 'FORENSIC_ANALYST', title: 'Forensic Analyst', org: 'ORG_B (Cyber Defense Lab)', actions: 'Inspect, Sandbox Detonation, Hash Verify, Derive Artifacts' },
      { code: 'EVIDENCE_CUSTODIAN', title: 'Evidence Custodian', org: 'ORG_C (Court Registry)', actions: 'Vault Custody, Admit Exhibits, Legal Hold, 65B Certs' },
      { code: 'INVESTIGATOR', title: 'Investigator', org: 'ORG_D (Cyber Crime LEA)', actions: 'Seize Raid Exhibits, FIR Registration, Custody Tracking' },
      { code: 'AUDITOR', title: 'Auditor', org: 'ORG_AUDIT (Audit Board)', actions: 'Zero-Trust 5-Point Verification, Ledger Audit, Attestation' },
      { code: 'ADMINISTRATOR', title: 'Organization Admin', org: 'All Consortium Nodes', actions: 'User Provisioning, Retention Rules, Governance' }
    ],
    participatingOrgs: [
      { code: 'ORG_A', name: 'Organization A — CERT-Alpha', function: 'First Responder / incident intake' },
      { code: 'ORG_B', name: 'Organization B — Cyber Defense Lab', function: 'Digital forensics / reverse engineering' },
      { code: 'ORG_C', name: 'Organization C — Judicial Court Registry', function: 'Legal / court evidence vault' },
      { code: 'ORG_D', name: 'Organization D — Cyber Crime Police (LEA)', function: 'Law-enforcement crime scene seizure' },
      { code: 'ORG_AUDIT', name: 'Audit Board — Independent Oversight', function: 'Zero-trust independent oversight' }
    ],
    responsibilities: [
      'DID Identity establishes cryptographic root of WHO the actor is',
      'Organization code establishes tenant enclave WHERE the actor operates',
      'RBAC permissions matrix establishes WHAT sensitive operations are permitted',
      'Smart contract modifiers (onlyRole) enforce on-chain execution boundaries'
    ],
    flow: [
      'User signs authentication challenge with private key / DID',
      'System resolves on-chain DID Document hash and active role',
      'Permissions dynamically evaluated before any custody or evidence mutation'
    ],
    whyItMatters: 'Eliminates reliance on vulnerable centralized LDAP/Active Directory domain controllers. Every forensic act is non-repudiably tied to a decentralized cryptographic identity.',
    codeReferences: [
      'contracts/HASHGUARD.sol (Lines 18-40)',
      'src/context/AppContext.jsx (ORGANIZATIONS & RBAC_ROLES)',
      'backend/app/models/user.py'
    ]
  },

  CRYPTOGRAPHIC_INTEGRITY: {
    id: 'cryptographic_integrity',
    layerNumber: '04',
    layerTitle: 'CRYPTOGRAPHIC INTEGRITY LAYER',
    name: 'Cryptographic Proof',
    badge: 'SHA-256 • Deterministic Digest',
    status: 'IMPLEMENTED',
    category: 'crypto',
    accentColor: 'emerald',
    borderColor: 'border-emerald-500/40',
    bgGradient: 'from-emerald-950/40 to-slate-900/60',
    icon: 'Fingerprint',
    summary: 'Generates deterministic 32-byte cryptographic fingerprints for all digital evidence exhibits, ensuring bit-level immutability and instant tamper detection.',
    technologies: [
      { name: 'SHA-256 (FIPS 180-4)', role: 'Deterministic Content Hashing' },
      { name: 'WebCrypto API', role: 'Browser-Side Bitstream Acquisition' },
      { name: 'Node.js Crypto / hashlib', role: 'Server-Side Verification' },
      { name: 'ECDSA secp256k1', role: 'Custodian Attestation Signatures' }
    ],
    responsibilities: [
      'Calculate bit-exact 256-bit SHA-256 digest upon initial evidence seizure',
      'Generate sealed digital evidence manifest with metadata hash',
      'Anchor sealed cryptographic digest on-chain as the immutable baseline',
      'Detect any bit-level modification or tampering across lifecycle transitions'
    ],
    flow: [
      'Digital Evidence (Disk / PCAP / Memory Dump / Binary) Ingested',
      'Binary stream passed through SHA-256 hashing algorithm',
      '32-byte hexadecimal digest generated (e.g. 8f3a91bc...91bc)',
      'Sealed digest anchored on-chain in HASHGUARD smart contract',
      'Original evidence remains securely stored off-chain'
    ],
    whyItMatters: 'The original multi-gigabyte evidence file does NOT need to be stored on-chain. Anchoring the compact 32-byte SHA-256 digest mathematically guarantees that any subsequent bit alteration will be immediately detected.',
    codeReferences: [
      'src/components/evidence/EvidenceHashCard.jsx',
      'src/services/verificationService.js',
      'node_backend/server.js (crypto.createHash)',
      'contracts/HASHGUARD.sol (contentHash)'
    ]
  },

  OFF_CHAIN_STORAGE: {
    id: 'off_chain_storage',
    layerNumber: '05',
    layerTitle: 'OFF-CHAIN STORAGE',
    name: 'Off-Chain Storage Enclave',
    badge: 'MinIO S3 • Encrypted Vault',
    status: 'IMPLEMENTED',
    category: 'storage',
    accentColor: 'indigo',
    borderColor: 'border-indigo-500/40',
    bgGradient: 'from-indigo-950/40 to-slate-900/60',
    icon: 'Database',
    summary: 'Encrypted off-chain repository isolating heavy digital exhibits (disk images, PCAP dumps, malware binaries) and operational application metadata from the public ledger.',
    technologies: [
      { name: 'MinIO S3 Compatible Storage', role: 'Object Storage Bucket' },
      { name: 'Local Encrypted Vault (/uploads)', role: 'Node.js Disk Storage' },
      { name: 'PostgreSQL 15 / db.json', role: 'Relational Metadata & Audit Store' },
      { name: 'AES-256-GCM (Enclave Architecture)', role: 'At-Rest Payload Encryption' }
    ],
    storedData: {
      offChain: [
        'Raw evidence bitstreams (.E01 disk images, .pcap captures, .bin payloads)',
        'Detailed forensic analyst case notes and triage tags',
        'Relational operational tables and user profile metadata',
        'Large YARA rule definitions and decompilation outputs'
      ],
      onChain: [
        '32-byte SHA-256 content hashes (contentHash)',
        '32-byte metadata hashes (metadataHash)',
        'ERC-721 Token IDs & owner addresses',
        'DID Registry Document hashes',
        'Custody transfer receipts & immutable block timestamps'
      ]
    },
    whyItMatters: 'Storing large binary evidence files directly on-chain is cost-prohibitive, inefficient, and violates data privacy laws. Off-chain storage maintains confidentiality while the blockchain anchors integrity.',
    codeReferences: [
      'backend/app/storage/minio_client.py',
      'node_backend/server.js (UPLOADS_DIR)',
      'src/components/common/OffChainBadge.jsx'
    ]
  },

  BLOCKCHAIN_LAYER: {
    id: 'blockchain_layer',
    layerNumber: '06',
    layerTitle: 'BLOCKCHAIN & SMART CONTRACTS',
    name: 'Blockchain Trust Layer',
    badge: 'Solidity ^0.8.20 • Ethereum Sepolia',
    status: 'IMPLEMENTED',
    category: 'blockchain',
    accentColor: 'amber',
    borderColor: 'border-amber-500/40',
    bgGradient: 'from-amber-950/40 to-slate-900/60',
    icon: 'Boxes',
    summary: 'A decentralized, tamper-evident state machine anchoring verifiable Decentralized Identifiers (DIDs), ERC-721 asset ownership, custody state transitions, and immutable audit events.',
    technologies: [
      { name: 'Solidity ^0.8.20', role: 'Smart Contract Programming Language' },
      { name: 'OpenZeppelin Contracts v5.6.1', role: 'Audited ERC721 & AccessControl' },
      { name: 'Ethereum Sepolia Testnet', role: 'Live Network (Chain ID: 11155111)' },
      { name: 'Live Contract Address', role: '0x3592925Cf64E7C3c68d4911b2ebC722c2Ea67052' },
      { name: 'Local Anvil EVM', role: 'Fast Offline Development (Chain ID: 31337)' },
      { name: 'Target: Hyperledger Besu', role: 'Enterprise Permissioned Consortium' }
    ],
    responsibilities: [
      'Mint unique ERC-721 non-fungible tokens representing physical/digital evidence',
      'Map string asset IDs (e.g. EV-001) to token IDs via assetIdToTokenId',
      'Enforce bytecode-level RBAC (ROLE_ADMIN, ROLE_MANAGER, ROLE_AUDITOR, ROLE_USER)',
      'Record atomic custody transitions (transferCustody, transferFrom)',
      'Emit immutable on-chain event logs for independent zero-knowledge auditing'
    ],
    flow: [
      'Evidence manifest prepared with contentHash and metadataHash',
      'Authorized custodian invokes mintAssetNFT() on HASHGUARD contract',
      'EVM executes bytecode, validates caller role, and assigns tokenId',
      'AssetNFTMinted event emitted and mined into immutable block'
    ],
    whyItMatters: 'Blockchain does NOT act as a heavy database. It acts as an unforgeable, cross-organization witness that proves what state transitions happened, when they occurred, and who authorized them.',
    codeReferences: [
      'contracts/HASHGUARD.sol',
      'src/contracts/HashGuard.json',
      'deploy_sepolia_live.py',
      '.env (HASHGUARD_CONTRACT_ADDRESS)'
    ]
  },

  VERIFICATION_LAYER: {
    id: 'verification_layer',
    layerNumber: '07',
    layerTitle: 'INDEPENDENT VERIFICATION',
    name: 'Independent Verification',
    badge: '5-Point Zero-Trust Engine',
    status: 'IMPLEMENTED',
    category: 'verification',
    accentColor: 'rose',
    borderColor: 'border-rose-500/40',
    bgGradient: 'from-rose-950/40 to-slate-900/60',
    icon: 'ShieldCheck',
    summary: 'Zero-trust verification engine that recomputes cryptographic proofs on presented evidence and compares them directly against the sealed on-chain baseline.',
    technologies: [
      { name: '5-Point Audit Matrix', role: 'Multi-Vector Proof Validation' },
      { name: 'WebCrypto Deterministic Hasher', role: 'Client-Side Recomputation' },
      { name: 'Tamper Simulation Engine', role: 'Bit-Flip Detection Demonstration' },
      { name: 'Section 65B Certificate Generator', role: 'Court-Ready Attestation Export' }
    ],
    fivePointChecklist: [
      { point: '01', title: 'SHA-256 Bitstream Integrity', desc: 'Recomputes hash from current binary and checks match against on-chain root digest.' },
      { point: '02', title: 'ECDSA Signature & DID Proof', desc: 'Validates custodian public key signature against on-chain DID Document.' },
      { point: '03', title: 'Chain of Custody Continuity', desc: 'Ensures no gaps or unauthorized custodians exist across transfer transitions.' },
      { point: '04', title: 'Monotonic Sequence & Block Timestamps', desc: 'Confirms sequential timestamp progression without backwards temporal tampering.' },
      { point: '05', title: 'DAG Lineage Parent-Child Root', desc: 'Verifies derived child artifacts cryptographically resolve to original seized root.' }
    ],
    flow: [
      'SEALED REFERENCE: Expected SHA-256 retrieved from on-chain block',
      'CURRENT EVIDENCE: Recompute SHA-256 over presented bitstream',
      'EVALUATION: Compare Expected vs Observed digests',
      'MATCH → VALID (Integrity Confirmed, Court Admissible)',
      'MISMATCH → TAMPER DETECTED (Seal Broken, Alert Broadcasted)'
    ],
    whyItMatters: 'Judges, defense counsel, and independent auditors can verify the bit-level integrity of evidence without trusting any single organization, database administrator, or server.',
    codeReferences: [
      'src/services/verificationService.js',
      'src/pages/Verification/VerificationPage.jsx',
      'src/components/verification/IndependentVerificationPanel.jsx'
    ]
  },

  CUSTODY_LIFECYCLE: {
    id: 'custody_lifecycle',
    layerNumber: '08',
    layerTitle: 'CUSTODY & ASSET LIFECYCLE',
    name: 'Digital Asset & Custody Lifecycle',
    badge: '7-Stage State Machine',
    status: 'IMPLEMENTED',
    category: 'workflow',
    accentColor: 'teal',
    borderColor: 'border-teal-500/40',
    bgGradient: 'from-teal-950/40 to-slate-900/60',
    icon: 'GitFork',
    summary: 'A deterministic 7-stage custody state machine tracking evidence from initial crime scene / incident intake to long-term statutory retention or legal hold.',
    lifecycleStages: [
      { stage: 'REGISTER', name: '01. Register & Ingest', actor: 'First Responder / LEA', desc: 'Seize device or intake incident artifact, generate local bitstream.' },
      { stage: 'SEAL', name: '02. Hash & Seal Manifest', actor: 'Intake Custodian', desc: 'Generate SHA-256 content digest and package into immutable tamper manifest.' },
      { stage: 'MINT', name: '03. Mint Asset NFT', actor: 'Originating Agency', desc: 'Mint ERC-721 token on-chain binding assetId to contentHash and initial custodian.' },
      { stage: 'TRANSFER', name: '04. Dispatch Transfer', actor: 'Dispatching Node', desc: 'Initiate cross-organization transfer manifest with recipient challenge.' },
      { stage: 'VERIFY', name: '05. Inbound Re-Verification', actor: 'Receiving Agency', desc: 'Re-compute SHA-256 digest on receipt; atomic acceptance if 100% match.' },
      { stage: 'DERIVE', name: '06. Derive Child Artifacts', actor: 'Forensic Analyst', desc: 'Carve files, extract memory strings, generate YARA rules with parent DAG linkage.' },
      { stage: 'ARCHIVE', name: '07. Retention & Legal Hold', actor: 'Court Registrar / Admin', desc: 'Apply NIST SP 800-88 retention policy or immutable court legal hold order.' }
    ],
    whyItMatters: 'Provides a complete, unbroken chain of custody where every handover requires mutual verification, eliminating unaccounted gaps in evidence handling.',
    codeReferences: [
      'src/pages/Custody/CustodyPage.jsx',
      'src/pages/Transfers/TransfersPage.jsx',
      'src/pages/Retention/RetentionPage.jsx',
      'contracts/HASHGUARD.sol (transferCustody, applyRetentionPolicy)'
    ]
  },

  LINEAGE_DAG: {
    id: 'lineage_dag',
    layerNumber: '09',
    layerTitle: 'FORENSIC LINEAGE DAG',
    name: 'Evidence Lineage DAG',
    badge: '@xyflow/react • Merkle Tree',
    status: 'IMPLEMENTED',
    category: 'lineage',
    accentColor: 'sky',
    borderColor: 'border-sky-500/40',
    bgGradient: 'from-sky-950/40 to-slate-900/60',
    icon: 'GitBranch',
    summary: 'An interactive Directed Acyclic Graph (DAG) visualizing how derived forensic artifacts (decompilations, carved PCAPs, YARA rules, reports) cryptographically link back to original seizures.',
    technologies: [
      { name: '@xyflow/react 12.11.3', role: 'Interactive Node-Edge DAG Engine' },
      { name: 'Parent-Child Hash Binding', role: 'Merkle Lineage Cryptography' },
      { name: 'DAG Node Drawer', role: 'Artifact Metadata & Hash Inspector' }
    ],
    responsibilities: [
      'Map primary seized digital exhibits to all downstream child artifacts',
      'Preserve mathematical transformation provenance across forensic tools',
      'Prevent orphaned or unattributed forensic artifacts in court exhibits',
      'Enable instant sub-tree verification from any leaf node back to root'
    ],
    flow: [
      'Primary Seizure (Root Exhibit: EV-001) registered',
      'Analyst performs memory carving → generates Child Artifact (EV-001-A)',
      'Child artifact inherits parentTokenId and registers child contentHash',
      'DAG links rendered with status badges, tool provenance, and analyst DIDs'
    ],
    whyItMatters: 'Forensic transformations (such as string extraction, reverse engineering, and threat triage) create secondary evidence. Lineage proves the exact mathematical lineage from raw seizure to courtroom report.',
    codeReferences: [
      'src/pages/Lineage/LineagePage.jsx',
      'src/components/lineage/LineageFlowGraph.jsx',
      'src/components/lineage/LineageCustomNode.jsx',
      'src/services/lineageService.js'
    ]
  },

  AUDIT_STREAM: {
    id: 'audit_stream',
    layerNumber: '10',
    layerTitle: 'AUDIT & EVENT HISTORY',
    name: 'Audit & Event History',
    badge: 'Dual Stream • On-Chain + Off-Chain',
    status: 'IMPLEMENTED',
    category: 'audit',
    accentColor: 'cyan',
    borderColor: 'border-cyan-500/40',
    bgGradient: 'from-cyan-950/40 to-slate-900/60',
    icon: 'FileText',
    summary: 'Maintains a tamper-evident audit trail combining real-time application activity logs with immutable smart contract event emissions on the blockchain.',
    streamTypes: [
      {
        name: 'On-Chain Smart Contract Events',
        medium: 'Ethereum Sepolia EVM Block Logs',
        events: ['AssetNFTMinted', 'CustodyTransferred', 'RoleAssignedDetailed', 'HashVerified', 'RetentionEvent'],
        guarantee: 'Immutable, decentralized, miners/validators provide mathematical proof of block inclusion.'
      },
      {
        name: 'Application Audit Ledger',
        medium: 'PostgreSQL 15 / Node JSON DB',
        events: ['USER_LOGIN', 'ORG_CONTEXT_SWITCH', 'EVIDENCE_INGESTED', 'VERIFICATION_RUN', 'TRANSFER_INITIATED'],
        guarantee: 'Fast queryable operational stream with actor DID bindings and cryptographic verification tags.'
      }
    ],
    whyItMatters: 'Separating application audit logs from smart contract events allows high-frequency operational visibility while anchoring critical legal state changes to the blockchain.',
    codeReferences: [
      'src/pages/Audit/AuditPage.jsx',
      'src/services/auditService.js',
      'backend/app/models/audit_log.py',
      'contracts/HASHGUARD.sol (Lines 63-86)'
    ]
  },

  MULTI_ORG_TRUST: {
    id: 'multi_org_trust',
    layerNumber: '11',
    layerTitle: 'MULTI-ORGANIZATION TRUST',
    name: 'Multi-Organization Consortium Trust',
    badge: '5-Agency Consortium',
    status: 'IMPLEMENTED',
    category: 'trust',
    accentColor: 'violet',
    borderColor: 'border-violet-500/40',
    bgGradient: 'from-violet-950/40 to-slate-900/60',
    icon: 'Building2',
    summary: 'Enables zero-trust evidence exchange between adversarial or independent organizations without requiring any party to grant root database access to others.',
    consortiumNodes: [
      { code: 'ORG_A', name: 'CERT-Alpha', role: 'First Responder', did: 'did:ethr:0xf39Fd6e5...2266' },
      { code: 'ORG_B', name: 'Cyber Defense Lab', role: 'Forensic Lab', did: 'did:ethr:0x70997970...79C8' },
      { code: 'ORG_C', name: 'Judicial Court Registry', role: 'Court Vault', did: 'did:ethr:0x3C44CdDd...93BC' },
      { code: 'ORG_D', name: 'Cyber Crime Police LEA', role: 'Law Enforcement', did: 'did:ethr:0x90F79bf6...b906' },
      { code: 'ORG_AUDIT', name: 'Audit Board', role: 'Independent Oversight', did: 'did:ethr:0x15d34AAf...6A65' }
    ],
    whyItMatters: 'Legacy systems force agencies to trust a central admin. HashGuard uses decentralized identity and smart contracts so agencies can verify every transfer mathematically.',
    codeReferences: [
      'src/context/AppContext.jsx (ORGANIZATIONS)',
      'backend/app/models/organization.py'
    ]
  },

  HSM_ENCLAVE: {
    id: 'hsm_enclave',
    layerNumber: '12',
    layerTitle: 'HARDWARE SECURITY ENCLAVE (HSM)',
    name: 'Direct HSM Enclave Bridge',
    badge: 'PKCS#11 • FIPS 140-2 Level 3',
    status: 'CONCEPTUAL',
    category: 'future',
    accentColor: 'purple',
    borderColor: 'border-purple-500/40',
    bgGradient: 'from-purple-950/40 to-slate-900/60',
    icon: 'Cpu',
    summary: 'Hardware-level private key isolation using PKCS#11 compliant Hardware Security Modules (HSMs) for air-gapped forensic workstation signing.',
    whyItMatters: 'Protects custodian private keys from extraction even if the analyst operating system is fully compromised.',
    codeReferences: ['Documented in RESEARCH_AND_DEVELOPMENT.md • Planned Future Milestone']
  },

  ZK_SNARKS: {
    id: 'zk_snarks',
    layerNumber: '13',
    layerTitle: 'ZERO-KNOWLEDGE PRIVACY PROOFS',
    name: 'zk-SNARK Evidence Attribute Verification',
    badge: 'Circom • Groth16 zk-Proof',
    status: 'FUTURE EXTENSION',
    category: 'future',
    accentColor: 'purple',
    borderColor: 'border-purple-500/40',
    bgGradient: 'from-purple-950/40 to-slate-900/60',
    icon: 'Shield',
    summary: 'Allows verifying specific forensic attributes (e.g. "contains IP within target subnet" or "entropy > 7.8") without disclosing any confidential case payloads.',
    whyItMatters: 'Enables cross-jurisdictional intelligence sharing while maintaining strict national classified data privacy rules.',
    codeReferences: ['Documented in Architecture Roadmap • Conceptual Extension']
  }
};
