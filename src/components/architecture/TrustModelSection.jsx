import React, { useState } from 'react';
import {
  KeyRound,
  ShieldAlert,
  FileCode,
  Fingerprint,
  HardDrive,
  Blocks,
  ArrowRightLeft,
  ShieldCheck,
  GitBranch,
  FileSpreadsheet,
  CheckCircle2,
  ExternalLink,
  ChevronDown,
  Info,
  Lock,
  Layers,
  Sparkles,
  Shield
} from 'lucide-react';

export const TrustModelSection = ({ onSelectNode }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [selectedMapNode, setSelectedMapNode] = useState('PROOF');

  // The 8-stage Trust Continuum matching the prompt's exact sequence
  const trustStages = [
    {
      id: 'IDENTITY',
      num: '01',
      title: 'IDENTITY',
      question: 'Who acted?',
      icon: KeyRound,
      color: 'blue',
      badge: 'W3C DID • secp256k1',
      summary: 'Establishes cryptographic identity for actors without centralized domain controllers.',
      detail: 'Resolves decentralized identifier (did:ethr) anchored by cryptographic public keypairs. Removes single-point-of-failure LDAP/Active Directory dependencies.'
    },
    {
      id: 'AUTHORIZATION',
      num: '02',
      title: 'AUTHORIZATION',
      question: 'What were they allowed to do?',
      icon: ShieldAlert,
      color: 'purple',
      badge: 'RBAC • Policy Enclave',
      summary: 'Validates granular permissions across 6 roles and organization boundaries.',
      detail: 'Evaluates tenant scoping and role-based permissions matrix before allowing sensitive operations, backed by EVM AccessControl bytecode.'
    },
    {
      id: 'ASSET',
      num: '03',
      title: 'DIGITAL ASSET',
      question: 'Which asset did they act on?',
      icon: FileCode,
      color: 'indigo',
      badge: 'Asset ID • ERC-721',
      summary: 'Tokens and exhibits uniquely indexed and classified by sensitivity.',
      detail: 'Binds raw evidence exhibit (e.g. EV-001) to a unique deterministic identity with Standard, Restricted, or Critical sensitivity governance.'
    },
    {
      id: 'PROOF',
      num: '04',
      title: 'CRYPTOGRAPHIC PROOF',
      question: 'What was its original state?',
      icon: Fingerprint,
      color: 'cyan',
      badge: 'FIPS 180-4 SHA-256',
      summary: 'Computes deterministic 32-byte hash seal over binary bitstream.',
      detail: 'Avalanche effect guarantees that a 1-bit alteration flips the digest entirely. Anchors contentHash and metadataHash as the permanent root baseline.'
    },
    {
      id: 'DATA_SPLIT',
      num: '05',
      title: 'DATA / TRUST SPLIT',
      question: 'Where is data vs trust?',
      icon: HardDrive,
      color: 'indigo',
      badge: 'Off-Chain Data • On-Chain Trust',
      summary: 'Raw confidential files stay in encrypted storage; trust anchors on blockchain.',
      detail: 'Zero raw evidence is ever stored on the blockchain. Anchoring 32-byte hash roots guarantees bit-level integrity with zero confidentiality risk.'
    },
    {
      id: 'CUSTODY',
      num: '06',
      title: 'OWNERSHIP / CUSTODY',
      question: 'Who owned / held it?',
      icon: ArrowRightLeft,
      color: 'amber',
      badge: 'Dual-Auth Handover',
      summary: 'Tracks atomic state handovers between consortium agency nodes.',
      detail: 'Inter-agency transfers require dispatch manifest signing and receiver acceptance, preventing unilateral custody handovers or untracked gaps.'
    },
    {
      id: 'VERIFICATION',
      num: '07',
      title: 'INDEPENDENT VERIFICATION',
      question: 'Can another party verify it?',
      icon: ShieldCheck,
      color: 'emerald',
      badge: 'Zero-Trust Engine',
      summary: 'Independent recomputation compares presented bytes against root proof.',
      detail: 'Auditors, judges, or defense counsel verify integrity mathematically without trusting police servers, databases, or administrative credentials.'
    },
    {
      id: 'PROVENANCE_AUDIT',
      num: '08',
      title: 'PROVENANCE & AUDIT',
      question: 'What happened over its lifecycle?',
      icon: FileSpreadsheet,
      color: 'teal',
      badge: 'DAG + Tamper-Evident Ledger',
      summary: 'Derived artifacts map to parent roots; dual streams guarantee accountability.',
      detail: 'Combines permanent EVM block logs (AssetNFTMinted, CustodyTransferred) with relational operational activity records. Historical audit is preserved forever.'
    }
  ];

  // Main Architecture Map Nodes
  const mapNodes = {
    IDENTITY: {
      title: 'IDENTITY',
      sub: 'W3C DID / secp256k1',
      color: 'blue',
      layer: 'WHO',
      desc: 'Cryptographic root of the actor. Binds human/machine investigator to a decentralized public key.'
    },
    AUTHORIZATION: {
      title: 'AUTHORIZATION',
      sub: 'Role / Policy Gate',
      color: 'purple',
      layer: 'PERMIT',
      desc: 'Enforces dual-layer RBAC at both the API gateway and EVM AccessControl bytecode.'
    },
    ASSET: {
      title: 'ASSET',
      sub: 'Asset ID / ERC-721',
      color: 'indigo',
      layer: 'WHAT',
      desc: 'Digital asset exhibit tokenized with unambiguous ownership and sensitivity classification.'
    },
    PROOF: {
      title: 'CRYPTOGRAPHIC PROOF',
      sub: 'SHA-256 Bitstream Seal',
      color: 'cyan',
      layer: 'INTEGRITY',
      desc: 'Deterministic 32-byte content digest. The immutable mathematical anchor for all trust.'
    },
    OFFCHAIN: {
      title: 'OFF-CHAIN STORAGE',
      sub: 'MinIO S3 / AES-256-GCM',
      color: 'indigo',
      layer: 'DATA',
      desc: 'Confidential multi-GB disk images, PCAPs, and notes isolated off-chain. Zero raw bytes on-chain.'
    },
    ONCHAIN: {
      title: 'ON-CHAIN STATE',
      sub: 'Ethereum Sepolia Contract',
      color: 'amber',
      layer: 'TRUST',
      desc: 'Tamper-evident consensus ledger anchoring content hashes, token custody, and immutable event logs.'
    },
    CUSTODY: {
      title: 'CUSTODY LIFECYCLE',
      sub: 'Dual-Authorized Handover',
      color: 'amber',
      layer: 'CUSTODY',
      desc: 'Unbroken chain of custody verified across dispatch and receipt by consortium agencies.'
    },
    VERIFICATION: {
      title: 'INDEPENDENT VERIFICATION',
      sub: 'Zero-Trust Comparison',
      color: 'emerald',
      layer: 'VERIFY',
      desc: 'Recomputes SHA-256 live from presented bits. Exact match yields TRUST VERIFIED verdict.'
    },
    PROVENANCE: {
      title: 'FORENSIC PROVENANCE',
      sub: 'Interactive Lineage DAG',
      color: 'sky',
      layer: 'ORIGIN',
      desc: 'Parent-child cryptographic lineage connecting derived analysis artifacts to seized exhibits.'
    },
    AUDIT: {
      title: 'AUDIT & EVENT STREAM',
      sub: 'Tamper-Evident Ledger',
      color: 'teal',
      layer: 'RECORD',
      desc: 'Comprehensive dual-stream event history guaranteeing accountability across the lifecycle.'
    }
  };

  const currentMap = mapNodes[selectedMapNode] || mapNodes.PROOF;

  return (
    <section id="trust-model" className="relative pt-12 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* ─── 1. HERO HEADER ─── */}
      <div className="space-y-6 text-center max-w-4xl mx-auto mb-16">
        {/* Architecture Framework Tag */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-slate-300/80 bg-white text-slate-800 shadow-xs dark:border-cyan-500/30 dark:bg-cyan-950/40 dark:text-cyan-300 font-mono text-[11px] font-bold tracking-wider uppercase">
          <span className="w-2 h-2 rounded-full bg-blue-600 dark:bg-cyan-400 animate-pulse" />
          <span>ZERO-TRUST ARCHITECTURE SPECIFICATION</span>
          <span className="text-slate-300 dark:text-slate-600">|</span>
          <span className="text-slate-600 dark:text-slate-300">BLOCKCHAIN-BASED IDENTITY, ACCESS &amp; DIGITAL ASSET MANAGEMENT</span>
        </div>

        {/* Product Identity */}
        <div>
          <h1 className="text-4xl sm:text-6xl font-black font-mono tracking-tight text-slate-950 dark:text-white uppercase">
            HASH<span className="text-blue-700 dark:text-cyan-400">GUARD</span>
          </h1>
          <p className="text-xl sm:text-2xl font-mono text-slate-900 dark:text-slate-200 font-bold tracking-wide mt-2">
            Verifiable Trust Infrastructure for Digital Assets
          </p>
          <p className="text-sm sm:text-base text-slate-600 dark:text-cyan-300/80 font-sans mt-1">
            Demonstrated through digital evidence and cross-organizational chain of custody.
          </p>
        </div>

        {/* Core Product Theses */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left max-w-3xl mx-auto pt-2">
          <div className="p-4 rounded-xl bg-white border border-slate-200/90 shadow-sm dark:bg-slate-900/80 dark:border-cyan-500/30">
            <span className="text-[10px] font-mono text-blue-700 dark:text-cyan-400 font-bold uppercase tracking-wider block">
              CORE PRODUCT THESIS
            </span>
            <p className="text-sm font-mono font-bold text-slate-950 dark:text-white mt-1">
              "Don't just trust the digital asset. Verify it."
            </p>
          </div>
          <div className="p-4 rounded-xl bg-white border border-slate-200/90 shadow-sm dark:bg-slate-900/80 dark:border-blue-500/30">
            <span className="text-[10px] font-mono text-indigo-700 dark:text-blue-400 font-bold uppercase tracking-wider block">
              ARCHITECTURAL THESIS
            </span>
            <p className="text-sm font-mono font-bold text-slate-950 dark:text-white mt-1">
              "Trust Continuity across the asset lifecycle."
            </p>
          </div>
        </div>

        {/* One-Sentence Judge Anchor */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm dark:bg-gradient-to-r dark:from-cyan-950/40 dark:via-slate-900/90 dark:to-blue-950/40 dark:border-cyan-500/40 text-left">
          <div className="flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-blue-700 dark:text-cyan-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="text-[10px] font-mono uppercase font-bold text-blue-700 dark:text-cyan-400 tracking-wider block">
                ONE-SENTENCE ARCHITECTURE SUMMARY FOR EVALUATORS
              </span>
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 font-sans leading-relaxed">
                "HashGuard establishes <strong className="text-slate-950 dark:text-white">who is authorized to act</strong>, cryptographically <strong className="text-slate-950 dark:text-white">anchors the identity of the asset</strong>, tracks <strong className="text-slate-950 dark:text-white">ownership and custody</strong>, and lets another party <strong className="text-slate-950 dark:text-white">independently verify</strong> its integrity and history."
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ─── 2. THE CENTERPIECE: 8-STAGE TRUST MODEL FLOW ─── */}
      <div className="mb-20">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-blue-600 dark:bg-cyan-400 animate-pulse" />
              <span className="text-[10px] font-mono font-bold text-blue-700 dark:text-cyan-400 uppercase tracking-widest">
                THE VERIFIABLE TRUST SEQUENCE
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-mono font-black text-slate-950 dark:text-white">
              TRUST MODEL CONTINUUM
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-sans mt-0.5">
              Click any stage to inspect the exact question it answers and its technical enforcement mechanism.
            </p>
          </div>
          <span className="text-[11px] font-mono text-slate-800 bg-white px-3 py-1 rounded-full border border-slate-300 shadow-xs dark:bg-cyan-500/10 dark:text-cyan-400 dark:border-cyan-500/30">
            PROGRESSIVE DISCLOSURE
          </span>
        </div>

        {/* Connected Horizontal Flow Stream */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5">
          {trustStages.map((stage, idx) => {
            const Icon = stage.icon;
            const isActive = activeStep === idx;
            return (
              <button
                key={stage.id}
                onClick={() => setActiveStep(idx)}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer relative group flex flex-col justify-between h-36 ${
                  isActive
                    ? 'bg-blue-50/80 border-blue-600 text-slate-950 shadow-sm ring-1 ring-blue-600 dark:bg-cyan-950/50 dark:border-cyan-400 dark:shadow-[0_0_25px_rgba(6,182,212,0.25)] dark:ring-cyan-400'
                    : 'bg-white border-slate-200/90 hover:border-slate-400 hover:shadow-xs dark:bg-slate-950/70 dark:border-slate-800 dark:hover:border-slate-700 dark:hover:bg-slate-900/60'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`font-mono text-[10px] font-bold ${isActive ? 'text-blue-700 dark:text-cyan-400' : 'text-slate-400 group-hover:text-slate-700 dark:text-slate-500 dark:group-hover:text-cyan-400'}`}>
                      {stage.num}
                    </span>
                    <Icon className={`w-4 h-4 ${isActive ? 'text-blue-700 dark:text-cyan-400' : 'text-slate-400 group-hover:text-slate-700 dark:text-slate-400'}`} />
                  </div>
                  <div className="font-mono text-[11px] font-bold text-slate-950 dark:text-white uppercase tracking-wider truncate">
                    {stage.title}
                  </div>
                  <div className="text-[9px] font-mono text-slate-600 dark:text-cyan-400 font-semibold mt-0.5 truncate">
                    {stage.question}
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80">
                  <span className="text-[8px] font-mono px-1.5 py-0.5 rounded bg-slate-50 border border-slate-200 text-slate-600 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-400 block truncate">
                    {stage.badge}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Stage Detail Drawer / Card */}
        <div className="mt-4 p-5 rounded-2xl bg-white border border-slate-200 shadow-sm dark:bg-[#040812] dark:border-cyan-500/30 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 dark:bg-cyan-500/15 dark:text-cyan-300 dark:border-cyan-500/30">
                STAGE {trustStages[activeStep].num} • {trustStages[activeStep].title}
              </span>
              <span className="text-xs font-mono text-emerald-700 dark:text-emerald-400 font-bold">
                Answers: "{trustStages[activeStep].question}"
              </span>
            </div>
            <p className="text-sm font-sans text-slate-900 dark:text-slate-200 font-medium">
              {trustStages[activeStep].summary}
            </p>
            <p className="text-xs font-sans text-slate-600 dark:text-slate-400 leading-relaxed">
              {trustStages[activeStep].detail}
            </p>
          </div>

          <div className="shrink-0 font-mono text-xs text-right">
            <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase block mb-1">Status</span>
            <span className="px-3 py-1 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-800 dark:bg-emerald-500/10 dark:border-emerald-500/30 dark:text-emerald-400 font-bold inline-flex items-center gap-1.5 shadow-2xs">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>IMPLEMENTED</span>
            </span>
          </div>
        </div>
      </div>

      {/* ─── 3. THE MAIN ARCHITECTURE MAP (CENTERPIECE DIAGRAM) ─── */}
      <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-[#070e1c] border-2 border-slate-300 dark:border-slate-800 shadow-premium">
        {/* Top Technical Docket Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b-2 border-dashed border-slate-300 dark:border-slate-800 gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-700 dark:bg-cyan-400 animate-pulse" />
              <span className="text-[11px] font-mono font-bold text-blue-900 dark:text-cyan-400 uppercase tracking-widest">
                SYSTEM ARCHITECTURE RUNTIME TOPOLOGY
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-mono font-black text-slate-950 dark:text-white">
              MAIN ARCHITECTURE MAP
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 font-sans mt-0.5">
              Interactive topology map. Click any node to inspect its cryptographic enforcement properties and isolation boundaries.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs font-mono font-bold text-slate-800 dark:text-slate-200 shadow-2xs">
              TOPOLOGY ROOT: <strong className="text-blue-700 dark:text-cyan-400">HASHGUARD.sol</strong>
            </span>
          </div>
        </div>

        {/* Visual Diagram Tree with Explicit Connecting Conduits */}
        <div className="flex flex-col items-center max-w-4xl mx-auto font-mono">
          {/* Level 0: HashGuard Core Header */}
          <div className="px-7 py-3 rounded-xl bg-slate-950 border-2 border-slate-800 text-white font-bold text-sm tracking-widest shadow-md flex items-center gap-2.5 dark:bg-cyan-950 dark:border-cyan-400 dark:text-cyan-300">
            <Shield className="w-4 h-4 text-cyan-400" />
            <span>HASHGUARD VERIFIABLE TRUST CORE</span>
          </div>

          {/* Conduit: Core to Level 1 Bus */}
          <div className="flex flex-col items-center w-full">
            <div className="w-1 h-6 bg-slate-400 dark:bg-cyan-500 rounded-full" />
            {/* Horizontal Bus Rail */}
            <div className="w-5/6 max-w-2xl h-0.5 bg-slate-400 dark:bg-cyan-500 relative flex justify-between items-center">
              <div className="w-2.5 h-2.5 -mt-1 bg-blue-700 dark:bg-cyan-400 rounded-full border-2 border-white dark:border-black absolute left-0" />
              <div className="w-2.5 h-2.5 -mt-1 bg-blue-700 dark:bg-cyan-400 rounded-full border-2 border-white dark:border-black absolute left-1/2 -translate-x-1/2" />
              <div className="w-2.5 h-2.5 -mt-1 bg-blue-700 dark:bg-cyan-400 rounded-full border-2 border-white dark:border-black absolute right-0" />
            </div>
            {/* Drop lines with arrow indicators */}
            <div className="w-5/6 max-w-2xl flex justify-between text-slate-500 dark:text-cyan-400 text-xs font-bold leading-none mb-1">
              <span>&darr;</span>
              <span>&darr;</span>
              <span>&darr;</span>
            </div>
          </div>

          {/* Level 1: Triad (Identity, Authorization, Asset) */}
          <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-4">
            <button
              onClick={() => setSelectedMapNode('IDENTITY')}
              className={`p-4 rounded-xl border-2 text-left transition-all cursor-pointer relative shadow-xs hover:shadow-md ${
                selectedMapNode === 'IDENTITY'
                  ? 'bg-blue-50/95 border-blue-600 ring-2 ring-blue-600/30 dark:bg-blue-950/60 dark:border-blue-400'
                  : 'bg-white border-slate-300 hover:border-slate-400 dark:bg-slate-900/90 dark:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between pb-1.5 border-b border-slate-200 dark:border-slate-800 mb-2">
                <span className="text-[10px] text-blue-700 dark:text-blue-400 font-bold uppercase tracking-wider">
                  [ACTOR] WHO?
                </span>
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 font-bold">
                  W3C DID
                </span>
              </div>
              <span className="text-sm font-black text-slate-950 dark:text-white block">
                IDENTITY
              </span>
              <span className="text-[11px] text-slate-600 dark:text-slate-400 block mt-0.5">
                did:ethr Registry (secp256k1)
              </span>
            </button>

            <button
              onClick={() => setSelectedMapNode('AUTHORIZATION')}
              className={`p-4 rounded-xl border-2 text-left transition-all cursor-pointer relative shadow-xs hover:shadow-md ${
                selectedMapNode === 'AUTHORIZATION'
                  ? 'bg-purple-50/95 border-purple-600 ring-2 ring-purple-600/30 dark:bg-purple-950/60 dark:border-purple-400'
                  : 'bg-white border-slate-300 hover:border-slate-400 dark:bg-slate-900/90 dark:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between pb-1.5 border-b border-slate-200 dark:border-slate-800 mb-2">
                <span className="text-[10px] text-purple-700 dark:text-purple-400 font-bold uppercase tracking-wider">
                  [POLICY] PERMITTED?
                </span>
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 font-bold">
                  RBAC
                </span>
              </div>
              <span className="text-sm font-black text-slate-950 dark:text-white block">
                AUTHORIZATION
              </span>
              <span className="text-[11px] text-slate-600 dark:text-slate-400 block mt-0.5">
                Consortium Role &amp; Quorum Gate
              </span>
            </button>

            <button
              onClick={() => setSelectedMapNode('ASSET')}
              className={`p-4 rounded-xl border-2 text-left transition-all cursor-pointer relative shadow-xs hover:shadow-md ${
                selectedMapNode === 'ASSET'
                  ? 'bg-indigo-50/95 border-indigo-600 ring-2 ring-indigo-600/30 dark:bg-indigo-950/60 dark:border-indigo-400'
                  : 'bg-white border-slate-300 hover:border-slate-400 dark:bg-slate-900/90 dark:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between pb-1.5 border-b border-slate-200 dark:border-slate-800 mb-2">
                <span className="text-[10px] text-indigo-700 dark:text-indigo-400 font-bold uppercase tracking-wider">
                  [ENTITY] WHAT ASSET?
                </span>
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300 font-bold">
                  ERC-721
                </span>
              </div>
              <span className="text-sm font-black text-slate-950 dark:text-white block">
                DIGITAL ASSET
              </span>
              <span className="text-[11px] text-slate-600 dark:text-slate-400 block mt-0.5">
                Exhibit ID &amp; Sensitivity Tier
              </span>
            </button>
          </div>

          {/* Conduit: Convergence into Level 2 Proof */}
          <div className="flex flex-col items-center w-full my-1">
            <div className="w-5/6 max-w-2xl h-0.5 bg-slate-400 dark:bg-cyan-500 relative flex justify-between items-center">
              <div className="w-2.5 h-2.5 -mt-1 bg-blue-700 dark:bg-cyan-400 rounded-full border-2 border-white dark:border-black absolute left-0" />
              <div className="w-2.5 h-2.5 -mt-1 bg-blue-700 dark:bg-cyan-400 rounded-full border-2 border-white dark:border-black absolute left-1/2 -translate-x-1/2" />
              <div className="w-2.5 h-2.5 -mt-1 bg-blue-700 dark:bg-cyan-400 rounded-full border-2 border-white dark:border-black absolute right-0" />
            </div>
            <div className="w-1 h-5 bg-slate-400 dark:bg-cyan-500 rounded-full" />
            <span className="text-slate-500 dark:text-cyan-400 text-xs font-bold leading-none">&darr;</span>
          </div>

          {/* Level 2: Cryptographic Proof (SHA-256 Anchor Box) */}
          <button
            onClick={() => setSelectedMapNode('PROOF')}
            className={`w-full max-w-lg p-4 rounded-xl border-2 text-center transition-all cursor-pointer relative shadow-sm hover:shadow-md ${
              selectedMapNode === 'PROOF'
                ? 'bg-cyan-50/95 border-cyan-600 ring-2 ring-cyan-600/30 dark:bg-cyan-950/60 dark:border-cyan-400'
                : 'bg-white border-cyan-500/60 hover:border-cyan-600 dark:bg-slate-900/90 dark:border-cyan-500/40'
            }`}
          >
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-cyan-100 text-cyan-900 border border-cyan-200 dark:bg-cyan-950 dark:text-cyan-300 dark:border-cyan-500/30 text-[10px] font-bold uppercase mb-1">
              <Fingerprint className="w-3.5 h-3.5 text-cyan-700 dark:text-cyan-400" />
              <span>ORIGINAL STATE? &bull; FIPS 180-4 CRYPTOGRAPHIC ROOT</span>
            </div>
            <span className="text-base font-black text-slate-950 dark:text-white block mt-0.5">
              CRYPTOGRAPHIC PROOF (SHA-256)
            </span>
            <span className="text-xs text-cyan-900 dark:text-cyan-300 block mt-1 font-semibold">
              Deterministic Bitstream Fingerprint &bull; 32-Byte Immutable contentHash
            </span>
          </button>

          {/* Conduit: Proof to Off-Chain/On-Chain Split */}
          <div className="flex flex-col items-center w-full my-1">
            <span className="text-slate-500 dark:text-cyan-400 text-xs font-bold leading-none">&darr;</span>
            <div className="w-1 h-5 bg-slate-400 dark:bg-cyan-500 rounded-full" />
            <div className="w-3/4 max-w-xl h-0.5 bg-slate-400 dark:bg-cyan-500 relative flex justify-between items-center">
              <div className="w-2.5 h-2.5 -mt-1 bg-indigo-700 dark:bg-indigo-400 rounded-full border-2 border-white dark:border-black absolute left-0" />
              <div className="w-2.5 h-2.5 -mt-1 bg-amber-700 dark:bg-amber-400 rounded-full border-2 border-white dark:border-black absolute right-0" />
            </div>
            <div className="w-3/4 max-w-xl flex justify-between text-slate-500 dark:text-cyan-400 text-xs font-bold leading-none mb-1">
              <span>&darr;</span>
              <span>&darr;</span>
            </div>
          </div>

          {/* Level 3: Off-Chain Data vs On-Chain Trust Split */}
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              onClick={() => setSelectedMapNode('OFFCHAIN')}
              className={`p-4 rounded-xl border-2 text-left transition-all cursor-pointer relative shadow-xs hover:shadow-md ${
                selectedMapNode === 'OFFCHAIN'
                  ? 'bg-indigo-50/95 border-indigo-600 ring-2 ring-indigo-600/30 dark:bg-indigo-950/60 dark:border-indigo-400'
                  : 'bg-white border-slate-300 hover:border-slate-400 dark:bg-slate-900/90 dark:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between pb-1.5 border-b border-slate-200 dark:border-slate-800 mb-2">
                <span className="text-[10px] text-indigo-700 dark:text-indigo-400 font-bold uppercase tracking-wider">
                  ZONE 01 &bull; ISOLATED ENCLAVE
                </span>
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300 font-bold">
                  AES-256-GCM
                </span>
              </div>
              <span className="text-sm font-black text-slate-950 dark:text-white block">
                OFF-CHAIN CONFIDENTIAL STORAGE
              </span>
              <span className="text-[11px] text-slate-600 dark:text-slate-400 block mt-0.5">
                Raw Forensic Binaries &bull; MinIO S3 &bull; Zero Raw Bytes On-Chain
              </span>
            </button>

            <button
              onClick={() => setSelectedMapNode('ONCHAIN')}
              className={`p-4 rounded-xl border-2 text-left transition-all cursor-pointer relative shadow-xs hover:shadow-md ${
                selectedMapNode === 'ONCHAIN'
                  ? 'bg-amber-50/95 border-amber-600 ring-2 ring-amber-600/30 dark:bg-amber-950/60 dark:border-amber-400'
                  : 'bg-white border-slate-300 hover:border-slate-400 dark:bg-slate-900/90 dark:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between pb-1.5 border-b border-slate-200 dark:border-slate-800 mb-2">
                <span className="text-[10px] text-amber-800 dark:text-amber-400 font-bold uppercase tracking-wider">
                  ZONE 02 &bull; CONSENSUS ANCHOR
                </span>
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300 font-bold">
                  ETHEREUM / BESU
                </span>
              </div>
              <span className="text-sm font-black text-slate-950 dark:text-white block">
                ON-CHAIN TRUST STATE
              </span>
              <span className="text-[11px] text-slate-600 dark:text-slate-400 block mt-0.5">
                Proofs &bull; ERC-721 Tokens &bull; Custody Handovers &bull; Block Event Logs
              </span>
            </button>
          </div>

          {/* Conduit: Split to Lifecycle Pillars */}
          <div className="flex flex-col items-center w-full my-1">
            <div className="w-1 h-5 bg-slate-400 dark:bg-cyan-500 rounded-full" />
            <div className="w-full max-w-3xl h-0.5 bg-slate-400 dark:bg-cyan-500 relative flex justify-between items-center">
              <div className="w-2.5 h-2.5 -mt-1 bg-amber-700 dark:bg-amber-400 rounded-full border-2 border-white dark:border-black absolute left-[12%]" />
              <div className="w-2.5 h-2.5 -mt-1 bg-emerald-700 dark:bg-emerald-400 rounded-full border-2 border-white dark:border-black absolute left-[37%]" />
              <div className="w-2.5 h-2.5 -mt-1 bg-sky-700 dark:bg-sky-400 rounded-full border-2 border-white dark:border-black absolute left-[62%]" />
              <div className="w-2.5 h-2.5 -mt-1 bg-teal-700 dark:bg-teal-400 rounded-full border-2 border-white dark:border-black absolute left-[87%]" />
            </div>
            <div className="w-full max-w-3xl flex justify-around text-slate-500 dark:text-cyan-400 text-xs font-bold leading-none mb-1">
              <span>&darr;</span>
              <span>&darr;</span>
              <span>&darr;</span>
              <span>&darr;</span>
            </div>
          </div>

          {/* Level 4: Downstream Trust Verification Chain (4 Pillars) */}
          <div className="w-full grid grid-cols-2 sm:grid-cols-4 gap-3">
            <button
              onClick={() => setSelectedMapNode('CUSTODY')}
              className={`p-3 rounded-xl border-2 text-left transition-all cursor-pointer shadow-xs hover:shadow-md ${
                selectedMapNode === 'CUSTODY'
                  ? 'bg-amber-50/95 border-amber-600 ring-2 ring-amber-600/30 dark:bg-amber-950/60 dark:border-amber-400'
                  : 'bg-white border-slate-300 hover:border-slate-400 dark:bg-slate-900 dark:border-slate-700'
              }`}
            >
              <span className="text-[10px] text-amber-800 dark:text-amber-400 font-bold block uppercase">WHO HANDLED?</span>
              <span className="text-xs font-black text-slate-950 dark:text-white block mt-0.5">CUSTODY</span>
              <span className="text-[10px] text-slate-600 dark:text-slate-400 block mt-0.5">Dual-Auth Transfers</span>
            </button>

            <button
              onClick={() => setSelectedMapNode('VERIFICATION')}
              className={`p-3 rounded-xl border-2 text-left transition-all cursor-pointer shadow-xs hover:shadow-md ${
                selectedMapNode === 'VERIFICATION'
                  ? 'bg-emerald-50/95 border-emerald-600 ring-2 ring-emerald-600/30 dark:bg-emerald-950/60 dark:border-emerald-400'
                  : 'bg-white border-slate-300 hover:border-slate-400 dark:bg-slate-900 dark:border-slate-700'
              }`}
            >
              <span className="text-[10px] text-emerald-800 dark:text-emerald-400 font-bold block uppercase">DID IT CHANGE?</span>
              <span className="text-xs font-black text-slate-950 dark:text-white block mt-0.5">VERIFICATION</span>
              <span className="text-[10px] text-slate-600 dark:text-slate-400 block mt-0.5">Zero-Trust Match</span>
            </button>

            <button
              onClick={() => setSelectedMapNode('PROVENANCE')}
              className={`p-3 rounded-xl border-2 text-left transition-all cursor-pointer shadow-xs hover:shadow-md ${
                selectedMapNode === 'PROVENANCE'
                  ? 'bg-sky-50/95 border-sky-600 ring-2 ring-sky-600/30 dark:bg-sky-950/60 dark:border-sky-400'
                  : 'bg-white border-slate-300 hover:border-slate-400 dark:bg-slate-900 dark:border-slate-700'
              }`}
            >
              <span className="text-[10px] text-sky-800 dark:text-sky-400 font-bold block uppercase">WHERE FROM?</span>
              <span className="text-xs font-black text-slate-950 dark:text-white block mt-0.5">PROVENANCE</span>
              <span className="text-[10px] text-slate-600 dark:text-slate-400 block mt-0.5">Lineage DAG Tree</span>
            </button>

            <button
              onClick={() => setSelectedMapNode('AUDIT')}
              className={`p-3 rounded-xl border-2 text-left transition-all cursor-pointer shadow-xs hover:shadow-md ${
                selectedMapNode === 'AUDIT'
                  ? 'bg-teal-50/95 border-teal-600 ring-2 ring-teal-600/30 dark:bg-teal-950/60 dark:border-teal-400'
                  : 'bg-white border-slate-300 hover:border-slate-400 dark:bg-slate-900 dark:border-slate-700'
              }`}
            >
              <span className="text-[10px] text-teal-800 dark:text-teal-400 font-bold block uppercase">WHAT HAPPENED?</span>
              <span className="text-xs font-black text-slate-950 dark:text-white block mt-0.5">AUDIT TRAIL</span>
              <span className="text-[10px] text-slate-600 dark:text-slate-400 block mt-0.5">Tamper-Evident Stream</span>
            </button>
          </div>

          {/* Map Node Inspector Drawer */}
          <div className="w-full mt-6 p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border-2 border-slate-300 dark:border-slate-800 flex items-start gap-3 text-left shadow-xs">
            <Info className="w-4 h-4 text-blue-700 dark:text-cyan-400 shrink-0 mt-0.5" />
            <div>
              <span className="text-xs font-mono font-bold text-slate-950 dark:text-white uppercase">
                NODE SPECIFICATION &mdash; {currentMap.title} (<span className="text-blue-700 dark:text-cyan-400">{currentMap.sub}</span>)
              </span>
              <p className="text-xs font-sans text-slate-700 dark:text-slate-300 mt-0.5">
                {currentMap.desc}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
