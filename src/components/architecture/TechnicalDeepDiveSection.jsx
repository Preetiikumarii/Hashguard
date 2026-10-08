import React, { useState } from 'react';
import {
  ChevronDown,
  ChevronUp,
  Layers,
  Monitor,
  Server,
  KeyRound,
  Fingerprint,
  HardDrive,
  Blocks,
  ShieldCheck,
  GitFork,
  FileSpreadsheet,
  Building2,
  Shield,
  ExternalLink,
  Copy,
  CheckCircle2,
  Activity,
  Boxes,
  Cpu,
  Lock,
  GitBranch
} from 'lucide-react';
import { ARCHITECTURE_NODES } from './architectureData';

export const TechnicalDeepDiveSection = () => {
  const [openModule, setOpenModule] = useState('01');
  const [copiedAddress, setCopiedAddress] = useState(false);

  const contractAddress = "0x3592925Cf64E7C3c68d4911b2ebC722c2Ea67052";

  const copyToClipboard = () => {
    navigator.clipboard.writeText(contractAddress);
    setCopiedAddress(true);
    setTimeout(() => setCopiedAddress(false), 2000);
  };

  const toggleModule = (id) => {
    setOpenModule(prev => prev === id ? null : id);
  };

  // 12 Technical Deep Dive Modules with Ground-Truth Specifications
  const modules = [
    {
      id: '01',
      title: '01. Presentation Layer',
      icon: Monitor,
      badge: 'React 19 • Web3 UI',
      status: 'IMPLEMENTED',
      statusType: 'implemented',
      tech: ['React 19.2.8', 'Vite 8.2.1', 'Tailwind CSS 3.4.17', 'Ethers.js v6.17.0', '@xyflow/react 12.11.3'],
      summary: 'Client-side forensic operator console delivering zero-trust verification and DAG visualization.',
      details: [
        'Client-side deterministic bitstream hashing using the native browser WebCrypto API.',
        'Dynamic organization and role context switching across 5 consortium nodes and 6 RBAC roles.',
        'Interactive Lineage DAG rendering for derived evidence exhibits using @xyflow/react.',
        'Real-time tamper alert banner notifying operators of bit-level integrity breaches across the system.'
      ],
      codeRefs: ['src/App.jsx', 'src/context/AppContext.jsx', 'src/pages/Passport/PassportPage.jsx', 'src/components/layout/Sidebar.jsx']
    },
    {
      id: '02',
      title: '02. Application / API Layer',
      icon: Server,
      badge: 'FastAPI • Node.js Express',
      status: 'IMPLEMENTED',
      statusType: 'implemented',
      tech: ['FastAPI Python 3.11+ (:8000)', 'Node.js Express (:8001)', 'Pydantic v2', 'SQLAlchemy', 'JWT'],
      summary: 'Backend orchestration layer managing session authentication, intake pipelines, and EVM JSON-RPC bridging.',
      details: [
        'Multi-service API architecture: Python FastAPI high-performance core + Node.js Express microservice.',
        'Validates caller DID tokens and RBAC claims before allowing evidence ingest or custody mutations.',
        'Coordinates inter-agency custody transfer queues and 2-of-3 consortium approval state.',
        'Strict server-side file stream verification against incoming SHA-256 client claims.'
      ],
      codeRefs: ['backend/app/main.py', 'node_backend/server.js', 'src/services/api.js', 'src/services/evidenceService.js']
    },
    {
      id: '03',
      title: '03. Identity & Access Control',
      icon: KeyRound,
      badge: 'W3C DID • EVM AccessControl',
      status: 'IMPLEMENTED',
      statusType: 'implemented',
      tech: ['W3C DID v1.0 (did:ethr)', 'secp256k1 Keypairs', 'OpenZeppelin AccessControl', 'Multi-Tenant Scoping'],
      summary: 'Decentralized identity layer eliminating reliance on vulnerable centralized domain controllers.',
      details: [
        'Separates WHO the actor is (W3C DID), WHERE they belong (Consortium Org Enclave), and WHAT they can do (RBAC Role).',
        'Consortium participants: CERT-Alpha (Org A), Cyber Defense Lab (Org B), Court Registry (Org C), Police LEA (Org D), Audit Board (Org Audit).',
        '6 Implemented RBAC Roles: FIRST_RESPONDER, FORENSIC_ANALYST, EVIDENCE_CUSTODIAN, INVESTIGATOR, AUDITOR, ADMINISTRATOR.',
        'On-chain smart contract modifiers (onlyRole) enforce execution boundaries directly at bytecode level.'
      ],
      codeRefs: ['contracts/HASHGUARD.sol (Lines 18-45)', 'src/context/AppContext.jsx (ORGANIZATIONS & RBAC_ROLES)']
    },
    {
      id: '04',
      title: '04. Cryptographic Integrity Layer',
      icon: Fingerprint,
      badge: 'FIPS 180-4 SHA-256',
      status: 'IMPLEMENTED',
      statusType: 'implemented',
      tech: ['SHA-256 (FIPS 180-4)', 'WebCrypto API', 'Node.js crypto / hashlib', 'ECDSA secp256k1 Signatures'],
      summary: 'Deterministic 32-byte content fingerprints guaranteeing bit-level immutability and instant tamper detection.',
      details: [
        'Computes deterministic 256-bit SHA-256 hash across the raw bitstream upon seizure.',
        'Calculates canonical metadataHash across incident parameters to seal acquisition manifests.',
        'Cryptographic Avalanche Effect: Altering even a single bit in a 100GB disk image changes the entire 32-byte digest.',
        'Anchors the 32-byte digest on-chain as the unalterable reference baseline.'
      ],
      codeRefs: ['src/services/verificationService.js', 'contracts/HASHGUARD.sol (contentHash, metaHash)']
    },
    {
      id: '05',
      title: '05. Off-Chain Storage Enclave',
      icon: HardDrive,
      badge: 'MinIO S3 • AES-256-GCM',
      status: 'IMPLEMENTED',
      statusType: 'implemented',
      tech: ['MinIO S3 Object Storage', 'Local Encrypted Vault', 'PostgreSQL 15 / db.json', 'AES-256-GCM At-Rest'],
      summary: 'Confidential repository isolating multi-gigabyte forensic exhibits and case files from the public ledger.',
      details: [
        'Stores heavy payloads: .E01 forensic images, .raw memory dumps, .pcap network streams, and case triage notes.',
        'Zero raw evidence bytes are ever stored on or exposed to the blockchain ledger.',
        'Access to off-chain blobs strictly gated by cryptographic token authorization and temporary lease checks.',
        'Storage receipts and hashes provide mathematical linkage between encrypted off-chain blobs and on-chain tokens.'
      ],
      codeRefs: ['backend/app/storage/minio_client.py', 'node_backend/server.js', 'src/services/evidenceService.js']
    },
    {
      id: '06',
      title: '06. Blockchain & Smart Contracts',
      icon: Blocks,
      badge: 'Solidity ^0.8.20 • Ethereum Sepolia',
      status: 'IMPLEMENTED',
      statusType: 'implemented',
      tech: ['Solidity ^0.8.20', 'OpenZeppelin Contracts v5.6.1 (ERC-721 + AccessControl)', 'Live Sepolia Contract: 0x3592...'],
      summary: 'Decentralized trust machine anchoring asset ownership, custody transitions, and immutable event records.',
      details: [
        'mintAssetNFT(): Mints unique ERC-721 token representing physical/digital exhibit and anchors contentHash.',
        'transferCustody(): Atomically updates on-chain exhibit custodian upon dual-authorization acceptance.',
        'registerDID(): Binds actor address to W3C DID document hash on-chain.',
        'applyRetentionPolicy(): Anchors court legal hold orders or statutory retention periods into smart contract state.',
        'Emits permanent EVM block logs: AssetNFTMinted, CustodyTransferred, HashVerified.'
      ],
      codeRefs: ['contracts/HASHGUARD.sol', 'src/contracts/HashGuard.json', 'deploy_sepolia_live.py']
    },
    {
      id: '07',
      title: '07. Verification Engine',
      icon: ShieldCheck,
      badge: '5-Point Zero-Trust Engine',
      status: 'IMPLEMENTED',
      statusType: 'implemented',
      tech: ['5-Point Audit Matrix', 'WebCrypto Recomputation', 'Tamper Simulation', 'Cryptographic Verification Report'],
      summary: 'Independent audit engine that recomputes cryptographic proofs live from presented evidence.',
      details: [
        'Point 1: SHA-256 bitstream equality against on-chain contentHash.',
        'Point 2: Custodian ECDSA secp256k1 signature validation against on-chain DID Document.',
        'Point 3: Custody chain continuity verifying no missing transfer hops or gaps.',
        'Point 4: Monotonic sequence and EVM block timestamp progression.',
        'Point 5: Merkle parent-child root linkage verification for derived artifacts.',
        'Generates standard, defensible Cryptographic Verification Reports in JSON format.'
      ],
      codeRefs: ['src/services/verificationService.js', 'src/pages/Verification/VerificationPage.jsx', 'src/pages/Passport/PassportPage.jsx']
    },
    {
      id: '08',
      title: '08. Digital Asset & Custody Lifecycle',
      icon: GitFork,
      badge: '7-Stage State Machine',
      status: 'IMPLEMENTED',
      statusType: 'implemented',
      tech: ['7-Stage State Model', 'Inter-Agency Handover Protocol', 'NIST SP 800-88 Retention Logic'],
      summary: 'Deterministic custody state machine tracking evidence from initial seizure to long-term archiving.',
      details: [
        'Lifecycle stages: REGISTER → SEAL → MINT → TRANSFER → VERIFY → DERIVE → ARCHIVE.',
        'Dual-authorization protocol: Transferring agency dispatches; receiving agency must verify hash before accepting.',
        'Prevents unauthorized unilateral transfers or phantom assets.',
        'Statutory retention rules prevent premature deletion while legal holds freeze countdowns.'
      ],
      codeRefs: ['src/pages/Custody/CustodyPage.jsx', 'src/pages/Transfers/TransfersPage.jsx', 'src/services/transferService.js']
    },
    {
      id: '09',
      title: '09. Forensic Lineage DAG',
      icon: GitBranch,
      badge: '@xyflow/react • Merkle Tree',
      status: 'IMPLEMENTED',
      statusType: 'implemented',
      tech: ['@xyflow/react 12.11.3', 'Parent-Child Hash Binding', 'Merkle Lineage Graph', 'Forensic Provenance'],
      summary: 'Interactive Directed Acyclic Graph proving mathematical provenance of derived analysis artifacts.',
      details: [
        'Connects primary seized exhibits (e.g. EV-001) to all downstream derived artifacts (EV-001-A, EV-001-B).',
        'Records tool provenance (e.g. Volatility 3, Ghidra, Wireshark) and examiner DID alongside derived hashes.',
        'Ensures derived reports and carved payloads mathematically trace back to the original seized physical root.',
        'Prevents orphaned or unattributed evidence in courtroom proceedings.'
      ],
      codeRefs: ['src/pages/Lineage/LineagePage.jsx', 'src/components/lineage/LineageFlowGraph.jsx', 'src/services/lineageService.js']
    },
    {
      id: '10',
      title: '10. Audit & Event Streams',
      icon: FileSpreadsheet,
      badge: 'Tamper-Evident Dual Stream',
      status: 'IMPLEMENTED',
      statusType: 'implemented',
      tech: ['EVM Block Logs', 'PostgreSQL / JSON Ledger', 'Dual Stream Architecture'],
      summary: 'Tamper-evident audit trail combining permanent smart contract block logs with operational audit records.',
      details: [
        'On-chain stream: Irreversible EVM block logs (AssetNFTMinted, CustodyTransferred, HashVerified).',
        'Application stream: Operational audit records (logins, context switches, transfer dispatches, verification runs).',
        'Every audit event cryptographically binds to the actor DID and timestamp.',
        'Audit records are preserved forever: Even if an identity is revoked, all historical audit records remain intact (REVOKED ≠ DELETED).'
      ],
      codeRefs: ['src/pages/Audit/AuditPage.jsx', 'src/services/auditService.js', 'backend/app/models/audit_log.py']
    },
    {
      id: '11',
      title: '11. Consortium & Adaptive Governance',
      icon: Building2,
      badge: 'Application-Level Quorum Gate',
      status: 'APPLICATION-LEVEL',
      statusType: 'application',
      tech: ['2-of-3 Consensual Approval', 'Time-Bound Access Leases', 'Sensitivity Tiers', 'Revocation Cascade'],
      summary: 'Adaptive governance engine enforcing multi-stakeholder consensus on high-risk operations.',
      details: [
        'Asset sensitivity classification: STANDARD, RESTRICTED, CRITICAL.',
        'Critical custody operations require Application-Level Quorum Gate (2-of-3 consensual signatures) before inter-agency dispatch.',
        'Time-bound, purpose-bound access leases with automatic timestamp expiration.',
        'Revocation Cascade: Revoking a DID zeroes effective roles, cancels pending transfers, and invalidates leases while preserving historical audit records.'
      ],
      codeRefs: ['src/pages/AccessGovernance/AccessGovernancePage.jsx', 'src/context/AppContext.jsx']
    },
    {
      id: '12',
      title: '12. Core Security Principles',
      icon: Shield,
      badge: '6 Core Guarantees',
      status: 'IMPLEMENTED',
      statusType: 'implemented',
      tech: ['Cryptographic Integrity', 'Self-Sovereign Identity', 'Granular Authorization', 'Verifiable Custody', 'Data/Proof Separation', 'Independent Verification'],
      summary: 'Foundational security axioms and mathematical guarantees enforced across every layer.',
      details: [
        'Principle 1 — Cryptographic Integrity: Deterministic SHA-256 bitstream sealing.',
        'Principle 2 — Decentralized Identity: Self-sovereign W3C DIDs with secp256k1 keypairs.',
        'Principle 3 — Granular Authorization: Dual-layer RBAC validated at API and smart contract bytecode.',
        'Principle 4 — Verifiable Custody: Dual-authorized handovers emitting permanent block events.',
        'Principle 5 — Data / Proof Separation: Raw data stays off-chain; trust is anchored on-chain.',
        'Principle 6 — Independent Verification: Mathematical verification without trusting external servers.'
      ],
      codeRefs: ['src/components/architecture/SecurityPrinciplesSection.jsx', 'src/components/architecture/TrustBoundariesSection.jsx']
    }
  ];

  return (
    <section id="deep-dive" className="relative py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-ce-border dark:border-slate-800/80">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-blue-600 dark:bg-cyan-400 animate-pulse" />
            <span className="text-[11px] font-mono font-bold text-blue-900 dark:text-cyan-400 uppercase tracking-widest">
              SECTION 05 &bull; COMPLETE TECHNICAL SPECIFICATIONS
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-mono font-black text-slate-950 dark:text-white">
            TECHNICAL DEEP DIVE
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-sans mt-1 max-w-3xl">
            Exhaustive specifications for all 12 platform architectural modules, smart contract bytecode, and consortium topology. Progressive disclosure keeps the primary narrative clean while preserving complete technical depth.
          </p>
        </div>

        {/* Status Legend */}
        <div className="flex flex-wrap items-center gap-2 font-mono text-[10px] shrink-0">
          <span className="px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 dark:bg-emerald-500/10 dark:border-emerald-500/30 dark:text-emerald-400 font-bold">
            ✓ IMPLEMENTED
          </span>
          <span className="px-2.5 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-800 dark:bg-blue-500/10 dark:border-blue-500/30 dark:text-blue-400 font-bold">
            APPLICATION-LEVEL
          </span>
          <span className="px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 dark:bg-amber-500/10 dark:border-amber-500/30 dark:text-amber-400 font-bold">
            FUTURE (v2.1)
          </span>
          <span className="px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400 font-bold">
            CONCEPTUAL
          </span>
        </div>
      </div>

      {/* ─── BLOCKCHAIN TELEMETRY PANEL (SEPOLIA vs BESU SEPARATED) ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
        {/* CURRENT PROTOTYPE (ETHEREUM SEPOLIA) */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-premium dark:bg-gradient-to-b dark:from-[#040812] dark:to-slate-950 dark:border-cyan-500/40 dark:shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200/80 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-600 dark:bg-emerald-400 animate-pulse" />
              <span className="text-[11px] font-mono font-bold text-blue-900 dark:text-cyan-400 uppercase tracking-wider">
                CURRENT PROTOTYPE
              </span>
            </div>
            <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/30">
              DEPLOYED &amp; VERIFIED
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 font-mono text-xs">
            <div className="p-3 rounded-xl bg-slate-50/80 border border-slate-200/80 dark:bg-slate-900/80 dark:border-slate-800">
              <span className="text-[10px] text-slate-500 dark:text-slate-500 block uppercase font-semibold">Network</span>
              <span className="font-bold text-slate-950 dark:text-white text-sm">Ethereum Sepolia</span>
              <span className="text-[10px] text-blue-700 dark:text-cyan-400 block mt-0.5 font-medium">Public EVM Testnet</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50/80 border border-slate-200/80 dark:bg-slate-900/80 dark:border-slate-800">
              <span className="text-[10px] text-slate-500 dark:text-slate-500 block uppercase font-semibold">Chain ID</span>
              <span className="font-bold text-slate-950 dark:text-white text-sm">11155111</span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 block mt-0.5">Sepolia EVM RPC</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50/80 border border-slate-200/80 dark:bg-slate-900/90 dark:border-slate-800 space-y-1 font-mono">
            <div className="flex items-center justify-between text-[10px] text-slate-600 dark:text-slate-400 font-semibold">
              <span>CONTRACT: HASHGUARD.sol</span>
              <button
                onClick={copyToClipboard}
                className="hover:text-blue-700 dark:hover:text-cyan-400 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <Copy className="w-3 h-3" />
                <span>{copiedAddress ? 'Copied!' : 'Copy Address'}</span>
              </button>
            </div>
            <code className="text-xs text-slate-950 dark:text-cyan-300 block truncate select-all font-bold">
              {contractAddress}
            </code>
          </div>

          <div className="flex items-center justify-between pt-1">
            <a
              href={`https://sepolia.etherscan.io/address/${contractAddress}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-mono text-blue-700 hover:text-blue-900 dark:text-cyan-400 dark:hover:text-cyan-300 font-semibold transition-colors"
            >
              <span>Inspect on Etherscan</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <span className="text-[10px] font-mono text-slate-500 dark:text-slate-500">
              Standards: ERC-721 + AccessControl
            </span>
          </div>
        </div>

        {/* FUTURE ENTERPRISE TARGET (HYPERLEDGER BESU) */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-premium dark:bg-gradient-to-b dark:from-[#0a0702] dark:to-slate-950 dark:border-amber-500/40 dark:shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200/80 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-500 dark:bg-amber-400" />
              <span className="text-[11px] font-mono font-bold text-amber-800 dark:text-amber-400 uppercase tracking-wider">
                FUTURE ENTERPRISE TARGET
              </span>
            </div>
            <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-50 text-amber-800 border border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/30">
              ROADMAP SPECIFICATION
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 font-mono text-xs">
            <div className="p-3 rounded-xl bg-slate-50/80 border border-slate-200/80 dark:bg-slate-900/80 dark:border-slate-800">
              <span className="text-[10px] text-slate-500 dark:text-slate-500 block uppercase font-semibold">Consortium Engine</span>
              <span className="font-bold text-slate-950 dark:text-white text-sm">Hyperledger Besu</span>
              <span className="text-[10px] text-amber-700 dark:text-amber-400 block mt-0.5 font-medium">Permissioned Consortium</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50/80 border border-slate-200/80 dark:bg-slate-900/80 dark:border-slate-800">
              <span className="text-[10px] text-slate-500 dark:text-slate-500 block uppercase font-semibold">Consensus Algorithm</span>
              <span className="font-bold text-slate-950 dark:text-white text-sm">IBFT 2.0 / QBFT</span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 block mt-0.5">Sub-Second Finality &bull; High Throughput</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50/80 border border-slate-200/80 dark:bg-slate-900/90 dark:border-slate-800 space-y-1 font-mono text-xs text-slate-700 dark:text-slate-300">
            <span className="text-[10px] text-amber-800 dark:text-amber-400 font-bold uppercase block">
              ENTERPRISE CONSORTIUM ADVANTAGES
            </span>
            <p className="text-xs font-sans text-slate-600 dark:text-slate-300 mt-1">
              Private inter-agency network between CERT, Defense Labs, Law Enforcement, and Courts with predictable consortium execution and deterministic sub-second block finality.
            </p>
          </div>

          <div className="pt-1 text-[11px] font-mono text-slate-500 dark:text-slate-500 flex items-center justify-between">
            <span>Isolation: Strict Private Subnet</span>
            <span className="text-amber-800 dark:text-amber-400/80 font-bold">Planned Deployment v2.1</span>
          </div>
        </div>
      </div>

      {/* ─── 12 EXPANDABLE MODULES ACCORDION ─── */}
      <div className="space-y-3">
        {modules.map((m) => {
          const ModuleIcon = m.icon;
          const isOpen = openModule === m.id;

          const statusBadge = m.statusType === 'implemented'
            ? 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/30'
            : m.statusType === 'application'
            ? 'bg-blue-50 text-blue-800 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/30'
            : 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/30';

          return (
            <div
              key={m.id}
              className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                isOpen
                  ? 'bg-white border-blue-600 shadow-premium dark:bg-slate-950/90 dark:border-cyan-500/50 dark:shadow-[0_0_20px_rgba(6,182,212,0.12)]'
                  : 'bg-white border-slate-200/90 hover:border-slate-400 hover:shadow-card shadow-xs dark:bg-slate-950/60 dark:border-slate-800/80 dark:hover:border-slate-700 dark:hover:bg-slate-900/40'
              }`}
            >
              {/* Module Header / Toggle */}
              <button
                onClick={() => toggleModule(m.id)}
                className="w-full p-4 sm:p-5 flex items-center justify-between text-left cursor-pointer gap-4"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className={`p-2.5 rounded-xl border shrink-0 ${
                    isOpen ? 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-cyan-500/20 dark:text-cyan-300 dark:border-cyan-500/40' : 'bg-slate-50 text-slate-600 border-slate-200 dark:bg-slate-900 dark:text-slate-400 dark:border-slate-800'
                  }`}>
                    <ModuleIcon className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-mono text-sm sm:text-base font-bold text-slate-950 dark:text-white truncate">
                        {m.title}
                      </h3>
                      <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold border ${statusBadge}`}>
                        {m.status}
                      </span>
                    </div>
                    <p className="text-xs font-sans text-slate-600 dark:text-slate-400 truncate mt-0.5">
                      {m.summary}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="hidden sm:inline-block px-2.5 py-1 rounded bg-slate-50 border border-slate-200 text-[11px] font-mono text-slate-700 font-semibold dark:bg-slate-900 dark:border-slate-800 dark:text-slate-300">
                    {m.badge}
                  </span>
                  <div className={`p-1 rounded-lg border transition-transform ${
                    isOpen ? 'bg-blue-50 border-blue-200 text-blue-700 dark:bg-cyan-500/10 dark:border-cyan-500/30 dark:text-cyan-300' : 'border-slate-200 text-slate-500 dark:border-slate-800 dark:text-slate-500'
                  }`}>
                    {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </div>
              </button>

              {/* Module Expanded Content */}
              {isOpen && (
                <div className="px-5 pb-6 pt-2 border-t border-slate-200/80 dark:border-slate-800/80 space-y-4 animate-in fade-in duration-200">
                  {/* Tech Stack Pills */}
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-500 font-bold block mb-1.5">
                      Verified Technologies:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {m.tech.map((t, idx) => (
                        <span key={idx} className="px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200 text-xs font-mono text-slate-900 font-semibold dark:bg-slate-900 dark:border-slate-800 dark:text-cyan-300">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Architectural Details List */}
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-500 font-bold block mb-1.5">
                      Architectural Responsibilities &amp; Invariants:
                    </span>
                    <ul className="space-y-2">
                      {m.details.map((d, idx) => (
                        <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-800 dark:text-slate-200 font-sans">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-700 dark:bg-cyan-400 shrink-0 mt-1.5" />
                          <span>{d}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Code Artifacts */}
                  {m.codeRefs && m.codeRefs.length > 0 && (
                    <div className="pt-2 border-t border-slate-200/80 dark:border-slate-800/60">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-500 font-bold block mb-1.5">
                        Repository Code Artifacts:
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {m.codeRefs.map((ref, idx) => (
                          <code key={idx} className="text-[11px] font-mono text-slate-700 bg-slate-50 px-2 py-0.5 rounded border border-slate-200 select-all dark:text-slate-400 dark:bg-black/60 dark:border-slate-800 font-semibold">
                            {ref}
                          </code>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
