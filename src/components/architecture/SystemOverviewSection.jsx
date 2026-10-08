import React from 'react';
import {
  Monitor,
  Server,
  KeyRound,
  ShieldCheck,
  Blocks,
  ArrowDown,
  Layers,
  History,
  GitFork,
  FileSpreadsheet,
  Lock,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { ARCHITECTURE_NODES } from './architectureData';

export const SystemOverviewSection = ({ onSelectNode, selectedNodeId }) => {
  return (
    <section id="architecture" className="relative py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-[11px] font-mono font-bold text-cyan-400 uppercase tracking-widest">
              SYSTEM TOPOLOGY & CONTROL MATRIX
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-mono font-black text-white">
            LAYERED ARCHITECTURE OVERVIEW
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 font-sans mt-1 max-w-3xl">
            Five coordinated horizontal architectural zones communicating through deterministic cryptographic protocols. Select any tier or component to inspect technical implementation specifications.
          </p>
        </div>
        <div className="flex items-center gap-2 font-mono text-[11px] text-slate-400 shrink-0">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span>✓ IMPLEMENTED</span>
          <span className="text-slate-600">|</span>
          <span className="w-2 h-2 rounded-full bg-amber-400" />
          <span>FUTURE EXTENSION</span>
        </div>
      </div>

      {/* ─── 5 HORIZONTAL ZONES ─── */}
      <div className="space-y-4">
        {/* ZONE 01: EXPERIENCE */}
        <div 
          onClick={() => onSelectNode(ARCHITECTURE_NODES.PRESENTATION)}
          className={`group relative p-5 rounded-2xl bg-gradient-to-r from-cyan-950/30 via-slate-900/90 to-slate-950 border transition-all duration-300 cursor-pointer ${
            selectedNodeId === 'presentation'
              ? 'border-cyan-400 shadow-[0_0_30px_rgba(6,182,212,0.25)] ring-1 ring-cyan-400'
              : 'border-slate-800 hover:border-cyan-500/60 hover:shadow-[0_0_20px_rgba(6,182,212,0.1)]'
          }`}
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 group-hover:scale-105 transition-transform">
                <Monitor className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] font-black text-cyan-400 uppercase tracking-widest">
                    ZONE 01
                  </span>
                  <span className="text-slate-600">•</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/30">
                    ✓ IMPLEMENTED
                  </span>
                </div>
                <h3 className="font-mono text-base sm:text-lg font-bold text-white mt-0.5">
                  EXPERIENCE & OPERATOR UI
                </h3>
                <p className="text-xs text-slate-400 font-sans mt-0.5">
                  Forensic Operator Console, Evidence Registrar, 5-Point Verification Suite, and Interactive Lineage DAG.
                </p>
              </div>
            </div>

            {/* Micro Tags */}
            <div className="flex flex-wrap items-center gap-2 font-mono text-[11px] self-start md:self-auto">
              <span className="px-2.5 py-1 rounded bg-slate-900 border border-slate-700 text-slate-300">
                React 19
              </span>
              <span className="px-2.5 py-1 rounded bg-slate-900 border border-slate-700 text-slate-300">
                Vite 8
              </span>
              <span className="px-2.5 py-1 rounded bg-slate-900 border border-slate-700 text-slate-300">
                Tailwind SOC Tokens
              </span>
              <span className="px-2.5 py-1 rounded bg-slate-900 border border-slate-700 text-slate-300">
                Ethers.js v6
              </span>
              <span className="p-1 rounded bg-cyan-500/10 text-cyan-400 group-hover:translate-x-1 transition-transform">
                <ChevronRight className="w-4 h-4" />
              </span>
            </div>
          </div>
        </div>

        {/* Animated Connector 1 -> 2 */}
        <div className="flex items-center justify-center -my-2 relative z-10">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-950 border border-slate-800 text-[10px] font-mono text-slate-400">
            <ArrowDown className="w-3 h-3 text-cyan-400 animate-bounce" />
            <span>Authenticated REST API & JSON-RPC Calls</span>
          </div>
        </div>

        {/* ZONE 02: APPLICATION */}
        <div 
          onClick={() => onSelectNode(ARCHITECTURE_NODES.APPLICATION)}
          className={`group relative p-5 rounded-2xl bg-gradient-to-r from-blue-950/30 via-slate-900/90 to-slate-950 border transition-all duration-300 cursor-pointer ${
            selectedNodeId === 'application'
              ? 'border-blue-400 shadow-[0_0_30px_rgba(59,130,246,0.25)] ring-1 ring-blue-400'
              : 'border-slate-800 hover:border-blue-500/60 hover:shadow-[0_0_20px_rgba(59,130,246,0.1)]'
          }`}
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-400 group-hover:scale-105 transition-transform">
                <Server className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] font-black text-blue-400 uppercase tracking-widest">
                    ZONE 02
                  </span>
                  <span className="text-slate-600">•</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/30">
                    ✓ IMPLEMENTED
                  </span>
                </div>
                <h3 className="font-mono text-base sm:text-lg font-bold text-white mt-0.5">
                  APPLICATION & ORCHESTRATION LAYER
                </h3>
                <p className="text-xs text-slate-400 font-sans mt-0.5">
                  Dual-engine microservice architecture orchestrating upload triage, hash computation, and blockchain dispatches.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 font-mono text-[11px] self-start md:self-auto">
              <span className="px-2.5 py-1 rounded bg-slate-900 border border-slate-700 text-slate-300">
                FastAPI Python 3.11+
              </span>
              <span className="px-2.5 py-1 rounded bg-slate-900 border border-slate-700 text-slate-300">
                Node.js Express (Port 8001)
              </span>
              <span className="px-2.5 py-1 rounded bg-slate-900 border border-slate-700 text-slate-300">
                Pydantic v2
              </span>
              <span className="p-1 rounded bg-blue-500/10 text-blue-400 group-hover:translate-x-1 transition-transform">
                <ChevronRight className="w-4 h-4" />
              </span>
            </div>
          </div>
        </div>

        {/* Animated Connector 2 -> 3 */}
        <div className="flex items-center justify-center -my-2 relative z-10">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-950 border border-slate-800 text-[10px] font-mono text-slate-400">
            <ArrowDown className="w-3 h-3 text-purple-400 animate-bounce" />
            <span>Actor Identity & Permission Validation</span>
          </div>
        </div>

        {/* ZONE 03: IDENTITY + POLICY */}
        <div 
          onClick={() => onSelectNode(ARCHITECTURE_NODES.IDENTITY_RBAC)}
          className={`group relative p-5 rounded-2xl bg-gradient-to-r from-purple-950/30 via-slate-900/90 to-slate-950 border transition-all duration-300 cursor-pointer ${
            selectedNodeId === 'identity_rbac'
              ? 'border-purple-400 shadow-[0_0_30px_rgba(168,85,247,0.25)] ring-1 ring-purple-400'
              : 'border-slate-800 hover:border-purple-500/60 hover:shadow-[0_0_20px_rgba(168,85,247,0.1)]'
          }`}
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400 group-hover:scale-105 transition-transform">
                <KeyRound className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] font-black text-purple-400 uppercase tracking-widest">
                    ZONE 03
                  </span>
                  <span className="text-slate-600">•</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/30">
                    ✓ IMPLEMENTED
                  </span>
                </div>
                <h3 className="font-mono text-base sm:text-lg font-bold text-white mt-0.5">
                  IDENTITY & GOVERNANCE POLICY
                </h3>
                <p className="text-xs text-slate-400 font-sans mt-0.5">
                  Self-Sovereign Identity (W3C DIDs), 6 Granular RBAC Roles, and Multi-Tenant Organization Isolation.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 font-mono text-[11px] self-start md:self-auto">
              <span className="px-2.5 py-1 rounded bg-slate-900 border border-slate-700 text-slate-300">
                did:ethr (W3C)
              </span>
              <span className="px-2.5 py-1 rounded bg-slate-900 border border-slate-700 text-slate-300">
                secp256k1 Keys
              </span>
              <span className="px-2.5 py-1 rounded bg-slate-900 border border-slate-700 text-slate-300">
                6 RBAC Roles
              </span>
              <span className="px-2.5 py-1 rounded bg-slate-900 border border-slate-700 text-slate-300">
                5 Consortium Orgs
              </span>
              <span className="p-1 rounded bg-purple-500/10 text-purple-400 group-hover:translate-x-1 transition-transform">
                <ChevronRight className="w-4 h-4" />
              </span>
            </div>
          </div>
        </div>

        {/* Animated Connector 3 -> 4 */}
        <div className="flex items-center justify-center -my-2 relative z-10">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-950 border border-slate-800 text-[10px] font-mono text-slate-400">
            <ArrowDown className="w-3 h-3 text-emerald-400 animate-bounce" />
            <span>Deterministic SHA-256 Hashing & Encryption Sealing</span>
          </div>
        </div>

        {/* ZONE 04: PROOF + STORAGE */}
        <div 
          onClick={() => onSelectNode(ARCHITECTURE_NODES.OFF_CHAIN_STORAGE)}
          className={`group relative p-5 rounded-2xl bg-gradient-to-r from-emerald-950/30 via-slate-900/90 to-slate-950 border transition-all duration-300 cursor-pointer ${
            selectedNodeId === 'off_chain_storage'
              ? 'border-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.25)] ring-1 ring-emerald-400'
              : 'border-slate-800 hover:border-emerald-500/60 hover:shadow-[0_0_20px_rgba(16,185,129,0.1)]'
          }`}
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 group-hover:scale-105 transition-transform">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] font-black text-emerald-400 uppercase tracking-widest">
                    ZONE 04
                  </span>
                  <span className="text-slate-600">•</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/30">
                    ✓ IMPLEMENTED
                  </span>
                </div>
                <h3 className="font-mono text-base sm:text-lg font-bold text-white mt-0.5">
                  CRYPTOGRAPHIC PROOF & CONFIDENTIAL STORAGE
                </h3>
                <p className="text-xs text-slate-400 font-sans mt-0.5">
                  Deterministic SHA-256 bitstream sealing. Raw binaries encrypted in off-chain object vaults while hashes anchor to blockchain.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 font-mono text-[11px] self-start md:self-auto">
              <span className="px-2.5 py-1 rounded bg-slate-900 border border-slate-700 text-slate-300">
                SHA-256 Digest (32-Byte)
              </span>
              <span className="px-2.5 py-1 rounded bg-slate-900 border border-slate-700 text-slate-300">
                MinIO S3 Vault
              </span>
              <span className="px-2.5 py-1 rounded bg-slate-900 border border-slate-700 text-slate-300">
                AES-256-GCM Enclave
              </span>
              <span className="p-1 rounded bg-emerald-500/10 text-emerald-400 group-hover:translate-x-1 transition-transform">
                <ChevronRight className="w-4 h-4" />
              </span>
            </div>
          </div>
        </div>

        {/* Animated Connector 4 -> 5 */}
        <div className="flex items-center justify-center -my-2 relative z-10">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-950 border border-slate-800 text-[10px] font-mono text-slate-400">
            <ArrowDown className="w-3 h-3 text-amber-400 animate-bounce" />
            <span>State Anchor (mintAssetNFT / transferCustody)</span>
          </div>
        </div>

        {/* ZONE 05: TRUST INFRASTRUCTURE */}
        <div 
          onClick={() => onSelectNode(ARCHITECTURE_NODES.BLOCKCHAIN_LAYER)}
          className={`group relative p-5 rounded-2xl bg-gradient-to-r from-amber-950/30 via-slate-900/90 to-slate-950 border transition-all duration-300 cursor-pointer ${
            selectedNodeId === 'blockchain_layer'
              ? 'border-amber-400 shadow-[0_0_30px_rgba(245,158,11,0.25)] ring-1 ring-amber-400'
              : 'border-slate-800 hover:border-amber-500/60 hover:shadow-[0_0_20px_rgba(245,158,11,0.1)]'
          }`}
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 group-hover:scale-105 transition-transform">
                <Blocks className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] font-black text-amber-400 uppercase tracking-widest">
                    ZONE 05
                  </span>
                  <span className="text-slate-600">•</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/30">
                    ✓ IMPLEMENTED (SEPOLIA)
                  </span>
                </div>
                <h3 className="font-mono text-base sm:text-lg font-bold text-white mt-0.5">
                  DECENTRALIZED TRUST INFRASTRUCTURE
                </h3>
                <p className="text-xs text-slate-400 font-sans mt-0.5">
                  Ethereum Sepolia smart contract anchoring tokenized exhibits, atomic custody handovers, and immutable event logs.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 font-mono text-[11px] self-start md:self-auto">
              <span className="px-2.5 py-1 rounded bg-slate-900 border border-slate-700 text-amber-400 font-bold">
                HASHGUARD.sol
              </span>
              <span className="px-2.5 py-1 rounded bg-slate-900 border border-slate-700 text-slate-300">
                ERC-721
              </span>
              <span className="px-2.5 py-1 rounded bg-slate-900 border border-slate-700 text-slate-300">
                AccessControl
              </span>
              <span className="px-2.5 py-1 rounded bg-slate-900 border border-slate-700 text-slate-300">
                Chain ID 11155111
              </span>
              <span className="p-1 rounded bg-amber-500/10 text-amber-400 group-hover:translate-x-1 transition-transform">
                <ChevronRight className="w-4 h-4" />
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ─── 4 FOUNDATIONAL PILLARS BELOW ARCHITECTURE ─── */}
      <div className="mt-8 pt-8 border-t border-slate-800/80">
        <div className="flex items-center justify-between mb-4">
          <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 font-bold">
            FOUNDATIONAL EVIDENCE VERIFICATION & GOVERNANCE PILLARS
          </span>
          <span className="text-[10px] font-mono text-cyan-400">
            CLICK PILLAR TO INSPECT CODE & FLOWS
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono text-xs">
          {/* Pillar 1: Verification */}
          <div
            onClick={() => onSelectNode(ARCHITECTURE_NODES.VERIFICATION_LAYER)}
            className={`p-4 rounded-xl bg-slate-900/80 border transition-all cursor-pointer ${
              selectedNodeId === 'verification_layer'
                ? 'border-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.25)]'
                : 'border-slate-800 hover:border-emerald-500/50 hover:bg-slate-850'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/30">
                IMPLEMENTED
              </span>
            </div>
            <h4 className="font-bold text-white text-sm">INDEPENDENT VERIFY</h4>
            <p className="text-[11px] text-slate-400 font-sans mt-1">
              Zero-trust engine comparing recomputed local file digests directly against EVM blocks.
            </p>
          </div>

          {/* Pillar 2: Custody */}
          <div
            onClick={() => onSelectNode(ARCHITECTURE_NODES.CUSTODY_LIFECYCLE)}
            className={`p-4 rounded-xl bg-slate-900/80 border transition-all cursor-pointer ${
              selectedNodeId === 'custody_lifecycle'
                ? 'border-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.25)]'
                : 'border-slate-800 hover:border-amber-500/50 hover:bg-slate-850'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <History className="w-4 h-4 text-amber-400" />
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/30">
                IMPLEMENTED
              </span>
            </div>
            <h4 className="font-bold text-white text-sm">CUSTODY LIFECYCLE</h4>
            <p className="text-[11px] text-slate-400 font-sans mt-1">
              7-stage formal state machine enforcing dual-authorization on transfers.
            </p>
          </div>

          {/* Pillar 3: Lineage */}
          <div
            onClick={() => onSelectNode(ARCHITECTURE_NODES.LINEAGE_DAG)}
            className={`p-4 rounded-xl bg-slate-900/80 border transition-all cursor-pointer ${
              selectedNodeId === 'lineage_dag'
                ? 'border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.25)]'
                : 'border-slate-800 hover:border-cyan-500/50 hover:bg-slate-850'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <GitFork className="w-4 h-4 text-cyan-400" />
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/30">
                IMPLEMENTED
              </span>
            </div>
            <h4 className="font-bold text-white text-sm">LINEAGE DAG</h4>
            <p className="text-[11px] text-slate-400 font-sans mt-1">
              Directed Acyclic Graph linking extracted secondary artifacts back to root evidence.
            </p>
          </div>

          {/* Pillar 4: Audit */}
          <div
            onClick={() => onSelectNode(ARCHITECTURE_NODES.AUDIT_STREAM)}
            className={`p-4 rounded-xl bg-slate-900/80 border transition-all cursor-pointer ${
              selectedNodeId === 'audit_stream'
                ? 'border-purple-400 shadow-[0_0_20px_rgba(168,85,247,0.25)]'
                : 'border-slate-800 hover:border-purple-500/50 hover:bg-slate-850'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <FileSpreadsheet className="w-4 h-4 text-purple-400" />
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/30">
                IMPLEMENTED
              </span>
            </div>
            <h4 className="font-bold text-white text-sm">AUDIT & EVENTS</h4>
            <p className="text-[11px] text-slate-400 font-sans mt-1">
              Dual-stream audit architecture: relational operational logs + immutable EVM block events.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
