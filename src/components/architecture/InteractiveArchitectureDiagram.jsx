import React, { useState } from 'react';
import {
  Monitor,
  Server,
  KeyRound,
  Fingerprint,
  Database,
  Boxes,
  ShieldCheck,
  GitFork,
  GitBranch,
  FileText,
  Building2,
  ArrowDown,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Lock,
  Layers
} from 'lucide-react';
import { ARCHITECTURE_NODES } from './architectureData';

export const InteractiveArchitectureDiagram = ({
  selectedNodeId,
  onSelectNode
}) => {
  const [hoveredNodeId, setHoveredNodeId] = useState(null);

  const isSelected = (id) => selectedNodeId === id;
  const isHovered = (id) => hoveredNodeId === id;

  const renderCard = ({
    node,
    icon: Icon,
    className = "",
    tag = null,
    subtext = null,
    customAction = null
  }) => {
    const selected = isSelected(node.id);
    const hovered = isHovered(node.id);

    return (
      <button
        type="button"
        onClick={() => {
          if (customAction) {
            customAction();
          } else {
            onSelectNode(node);
          }
        }}
        onMouseEnter={() => setHoveredNodeId(node.id)}
        onMouseLeave={() => setHoveredNodeId(null)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onSelectNode(node);
          }
        }}
        tabIndex={0}
        aria-label={`Inspect ${node.name} architecture details`}
        aria-expanded={selected}
        className={`
          group relative p-3 sm:p-4 rounded-xl text-left transition-all duration-300 cursor-pointer w-full
          border ${selected ? 'border-cyan-400 bg-cyan-950/40 shadow-[0_0_25px_rgba(6,182,212,0.3)] ring-1 ring-cyan-400' : 'border-slate-800 bg-slate-900/60 hover:border-slate-600 hover:bg-slate-900/90'}
          ${className}
        `}
      >
        {/* Active Selection Glow Ring */}
        {selected && (
          <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-cyan-400 ring-4 ring-[#040812] animate-pulse" />
        )}

        <div className="flex items-start justify-between gap-2 mb-1.5">
          <div className="flex items-center gap-2">
            <div className={`p-1.5 rounded-lg border transition-colors ${
              selected ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300' : 'bg-slate-800 border-slate-700 text-slate-400 group-hover:text-cyan-400 group-hover:border-cyan-500/40'
            }`}>
              <Icon className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-mono text-cyan-400 font-bold block uppercase tracking-wider">
                LAYER {node.layerNumber}
              </span>
              <h4 className="text-xs sm:text-sm font-mono font-bold text-white group-hover:text-cyan-200 transition-colors">
                {node.name}
              </h4>
            </div>
          </div>

          <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border shrink-0 ${
            node.status === 'IMPLEMENTED' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-purple-500/10 text-purple-400 border-purple-500/30'
          }`}>
            {node.status === 'IMPLEMENTED' ? '✓ VERIFIED' : node.status}
          </span>
        </div>

        <p className="text-[11px] text-slate-400 font-mono line-clamp-2 leading-relaxed mt-1">
          {subtext || node.badge}
        </p>

        {tag && (
          <div className="mt-2 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-slate-400">
            <span>{tag}</span>
            <span className="text-cyan-400 group-hover:translate-x-0.5 transition-transform">Inspect →</span>
          </div>
        )}
      </button>
    );
  };

  return (
    <div className="w-full bg-[#040812]/80 border border-slate-800/90 rounded-2xl p-4 sm:p-6 lg:p-8 backdrop-blur-xl relative overflow-hidden shadow-2xl">
      {/* Background grid accent */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b0a_1px,transparent_1px),linear-gradient(to_bottom,#1e293b0a_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

      {/* Top Header / Core Brand Node */}
      <div className="flex flex-col items-center mb-6">
        <div className="px-6 py-2 rounded-xl bg-gradient-to-r from-cyan-950/80 via-slate-900 to-blue-950/80 border border-cyan-500/40 text-center shadow-[0_0_25px_rgba(6,182,212,0.2)]">
          <div className="flex items-center gap-2 justify-center">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span className="font-mono font-black text-sm sm:text-base text-white tracking-[0.2em]">
              HASHGUARD TRUST ENGINE
            </span>
          </div>
          <span className="text-[10px] font-mono text-cyan-300">
            Unified Cryptographic Evidence & Custody Layer
          </span>
        </div>

        {/* Bus Downward Connectors */}
        <div className="w-px h-6 bg-gradient-to-b from-cyan-500/60 to-slate-700" />
      </div>

      {/* =======================================================
          ROW 1: PRESENTATION + APPLICATION + IDENTITY LAYERS
         ======================================================= */}
      <div className="relative">
        {/* Horizontal Bus Wire for Row 1 */}
        <div className="hidden md:block absolute -top-3 left-[16%] right-[16%] h-px bg-gradient-to-r from-cyan-500/40 via-blue-500/40 to-purple-500/40" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
          {/* Node 1: Presentation Layer */}
          <div className="flex flex-col items-center">
            <div className="hidden md:block w-px h-3 bg-cyan-500/40 -mt-3 mb-0" />
            {renderCard({
              node: ARCHITECTURE_NODES.PRESENTATION,
              icon: Monitor,
              subtext: 'React 19 • Vite • Tailwind • @xyflow/react DAG • Ethers.js v6',
              tag: 'Client SOC Interface'
            })}
            <div className="w-px h-6 bg-gradient-to-b from-cyan-500/40 to-slate-700 mt-2" />
          </div>

          {/* Node 2: Application / API Layer */}
          <div className="flex flex-col items-center">
            <div className="hidden md:block w-px h-3 bg-blue-500/40 -mt-3 mb-0" />
            {renderCard({
              node: ARCHITECTURE_NODES.APPLICATION,
              icon: Server,
              subtext: 'Node.js Express (8001) • FastAPI Python (8000) • REST API v1',
              tag: 'Service Orchestrator'
            })}
            <div className="w-px h-6 bg-gradient-to-b from-blue-500/40 to-slate-700 mt-2" />
          </div>

          {/* Node 3: Identity & Access Control */}
          <div className="flex flex-col items-center">
            <div className="hidden md:block w-px h-3 bg-purple-500/40 -mt-3 mb-0" />
            {renderCard({
              node: ARCHITECTURE_NODES.IDENTITY_RBAC,
              icon: KeyRound,
              subtext: 'W3C DIDs (did:ethr) • 6 RBAC Roles • 5 Consortium Orgs',
              tag: 'Self-Sovereign IAM'
            })}
            <div className="w-px h-6 bg-gradient-to-b from-purple-500/40 to-slate-700 mt-2" />
          </div>
        </div>

        {/* Horizontal Gathering Bus */}
        <div className="hidden md:block w-[70%] mx-auto h-px bg-gradient-to-r from-cyan-500/40 via-emerald-500/50 to-purple-500/40 my-1" />
        <div className="w-px h-5 bg-emerald-500/50 mx-auto" />
      </div>

      {/* =======================================================
          ROW 2: CRYPTOGRAPHIC INTEGRITY LAYER (SHA-256 / SIGNATURE)
         ======================================================= */}
      <div className="max-w-2xl mx-auto my-2">
        {renderCard({
          node: ARCHITECTURE_NODES.CRYPTOGRAPHIC_INTEGRITY,
          icon: Fingerprint,
          className: "border-emerald-500/40 bg-emerald-950/20 shadow-[0_0_20px_rgba(16,185,129,0.15)]",
          subtext: 'Deterministic 32-Byte SHA-256 Bitstream Hash • HSM secp256k1 Manifest Signature',
          tag: 'Cryptographic Root of Trust'
        })}
      </div>

      {/* Split to Off-Chain vs On-Chain */}
      <div className="flex flex-col items-center my-3">
        <div className="w-px h-5 bg-gradient-to-b from-emerald-500/50 to-slate-600" />
        <div className="hidden sm:block w-[55%] h-px bg-gradient-to-r from-indigo-500/50 via-slate-600 to-amber-500/50" />
      </div>

      {/* =======================================================
          ROW 3: OFF-CHAIN (STORAGE) vs ON-CHAIN (SMART CONTRACT)
         ======================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-8 my-2">
        {/* Node 5: Off-Chain Storage */}
        <div className="flex flex-col items-center">
          <div className="hidden sm:block w-px h-3 bg-indigo-500/50 -mt-3 mb-0" />
          {renderCard({
            node: ARCHITECTURE_NODES.OFF_CHAIN_STORAGE,
            icon: Database,
            className: "border-indigo-500/30 bg-indigo-950/20",
            subtext: 'MinIO S3 Bucket • Local Encrypted Vault • PostgreSQL Metadata • Zero Raw Data On-Chain',
            tag: 'Confidential Payload Vault'
          })}
        </div>

        {/* Node 6: Blockchain / Smart Contract Layer */}
        <div className="flex flex-col items-center">
          <div className="hidden sm:block w-px h-3 bg-amber-500/50 -mt-3 mb-0" />
          {renderCard({
            node: ARCHITECTURE_NODES.BLOCKCHAIN_LAYER,
            icon: Boxes,
            className: "border-amber-500/40 bg-amber-950/20 shadow-[0_0_20px_rgba(245,158,11,0.15)]",
            subtext: 'Solidity ^0.8.20 (HASHGUARD.sol) • Sepolia (0x3592...7052) • ERC-721 NFT Assets',
            tag: 'Immutable State Ledger'
          })}
        </div>
      </div>

      {/* Sub-Smart Contract Pillars (RBAC, Ownership, Audit) */}
      <div className="my-4 p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80 max-w-3xl mx-auto">
        <div className="text-[10px] font-mono text-center text-amber-400 font-bold uppercase tracking-wider mb-2.5">
          EVM SMART CONTRACT INTERNAL PILLARS (HASHGUARD.sol)
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-center">
          <div
            onClick={() => onSelectNode(ARCHITECTURE_NODES.IDENTITY_RBAC)}
            className="p-2 rounded bg-slate-900/80 border border-slate-800 hover:border-purple-500/40 hover:bg-purple-950/20 transition-colors cursor-pointer"
          >
            <Lock className="w-3.5 h-3.5 text-purple-400 mx-auto mb-1" />
            <span className="text-[11px] font-mono font-bold text-white block">EVM AccessControl</span>
            <span className="text-[9px] font-mono text-slate-400">Bytecode-Enforced RBAC</span>
          </div>

          <div
            onClick={() => onSelectNode(ARCHITECTURE_NODES.CUSTODY_LIFECYCLE)}
            className="p-2 rounded bg-slate-900/80 border border-slate-800 hover:border-amber-500/40 hover:bg-amber-950/20 transition-colors cursor-pointer"
          >
            <Boxes className="w-3.5 h-3.5 text-amber-400 mx-auto mb-1" />
            <span className="text-[11px] font-mono font-bold text-white block">ERC-721 Ownership</span>
            <span className="text-[9px] font-mono text-slate-400">Tokenized Evidence Exhibits</span>
          </div>

          <div
            onClick={() => onSelectNode(ARCHITECTURE_NODES.AUDIT_STREAM)}
            className="p-2 rounded bg-slate-900/80 border border-slate-800 hover:border-cyan-500/40 hover:bg-cyan-950/20 transition-colors cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5 text-cyan-400 mx-auto mb-1" />
            <span className="text-[11px] font-mono font-bold text-white block">Immutable Event Logs</span>
            <span className="text-[9px] font-mono text-slate-400">Decentralized Audit Trail</span>
          </div>
        </div>
      </div>

      {/* Downward Wire to Verification */}
      <div className="w-px h-6 bg-gradient-to-b from-amber-500/50 to-rose-500/50 mx-auto" />

      {/* =======================================================
          ROW 4: INDEPENDENT VERIFICATION LAYER
         ======================================================= */}
      <div className="max-w-2xl mx-auto my-2">
        {renderCard({
          node: ARCHITECTURE_NODES.VERIFICATION_LAYER,
          icon: ShieldCheck,
          className: "border-rose-500/40 bg-rose-950/20 shadow-[0_0_20px_rgba(244,63,94,0.15)]",
          subtext: '5-Point Zero-Knowledge Audit Suite • Real-time Hash Recomputation vs On-Chain Root',
          tag: 'Independent Verification Engine'
        })}
      </div>

      {/* Downward Wire to Multi-Org Trust */}
      <div className="w-px h-6 bg-gradient-to-b from-rose-500/50 to-violet-500/50 mx-auto" />

      {/* =======================================================
          ROW 5: MULTI-ORGANIZATION CONSORTIUM TRUST
         ======================================================= */}
      <div className="max-w-3xl mx-auto my-2">
        {renderCard({
          node: ARCHITECTURE_NODES.MULTI_ORG_TRUST,
          icon: Building2,
          className: "border-violet-500/40 bg-violet-950/20 shadow-[0_0_20px_rgba(139,92,246,0.15)]",
          subtext: 'Cross-Agency Zero-Trust Boundary (CERT-Alpha, Cyber Defense Lab, Police LEA, Court Registry, Audit Board)',
          tag: 'Consortium Trust Root'
        })}
      </div>

      {/* Interactive Helper Banner */}
      <div className="mt-6 pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono text-slate-400">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
          <span>Click any block to inspect full technical specifications, data flows, and code artifacts.</span>
        </div>
        <div className="flex items-center gap-2 text-[11px]">
          <span className="text-cyan-400 font-bold">Tip:</span>
          <span>Inspect off-chain vs on-chain segregation rules</span>
        </div>
      </div>
    </div>
  );
};
