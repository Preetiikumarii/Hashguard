import React from 'react';
import {
  Blocks,
  ShieldCheck,
  KeyRound,
  History,
  FileSpreadsheet,
  ExternalLink,
  Lock,
  Layers,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export const BlockchainTrustSection = () => {
  const contractAddress = "0x3592925Cf64E7C3c68d4911b2ebC722c2Ea67052";

  const contractConnections = [
    {
      title: 'ERC-721 TOKENIZATION',
      badge: 'OpenZeppelin',
      icon: Blocks,
      color: 'amber',
      detail: 'Mints individual digital evidence exhibits as non-fungible tokens with immutable contentHash and metadataHash binding.'
    },
    {
      title: 'EVM ACCESSCONTROL',
      badge: 'Role-Based',
      icon: Lock,
      color: 'purple',
      detail: 'On-chain enforcement of organizational roles (ROLE_ADMIN, ROLE_COLLECTOR, ROLE_ANALYST, ROLE_AUDITOR) preventing unauthorized state mutation.'
    },
    {
      title: 'DID REGISTRY MAPPING',
      badge: 'W3C Compatible',
      icon: KeyRound,
      color: 'cyan',
      detail: 'Maps did:ethr:<address> identity roots and document hashes directly on-chain for tamper-evident cryptographic signature verification.'
    },
    {
      title: 'CUSTODY STATE MACHINE',
      badge: 'Atomic Transfers',
      icon: History,
      color: 'emerald',
      detail: 'Requires sender dispatch and receiver acceptance transactions before updating assetCustodian[tokenId] mapping on-chain.'
    },
    {
      title: 'IMMUTABLE AUDIT EVENTS',
      badge: 'Dual-Stream',
      icon: FileSpreadsheet,
      color: 'blue',
      detail: 'Emits AssetNFTMinted, CustodyTransferred, and HashVerified EVM events stored permanently within block transaction receipts.'
    }
  ];

  return (
    <section id="smart-contract" className="relative py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-800/80">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-[11px] font-mono font-bold text-amber-400 uppercase tracking-widest">
              ON-CHAIN CONSENSUS STATE MACHINE
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-mono font-black text-white">
            BLOCKCHAIN TRUST LAYER
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 font-sans mt-1 max-w-3xl">
            Solidity smart contract (<code className="text-amber-300 font-mono">HASHGUARD.sol</code>) enforcing consensus-level evidence tokenization, multi-agency role authorization, and atomic custody handovers.
          </p>
        </div>

        {/* Explicit Status Badges */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 font-mono text-xs">
          <div className="px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/40 text-emerald-400 font-bold flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>CURRENT PROTOTYPE: ETHEREUM SEPOLIA</span>
          </div>
          <div className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-400 font-medium flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            <span>FUTURE PRODUCTION TARGET: HYPERLEDGER BESU</span>
          </div>
        </div>
      </div>

      {/* Grid of On-Chain Connections */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {contractConnections.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-amber-500/40 transition-all group"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 group-hover:scale-105 transition-transform">
                  <Icon className="w-5 h-5" />
                </div>
                <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                  {item.badge}
                </span>
              </div>
              <h3 className="font-mono text-sm font-bold text-white tracking-wide">
                {item.title}
              </h3>
              <p className="text-xs text-slate-400 font-sans mt-2 leading-relaxed">
                {item.detail}
              </p>
            </div>
          );
        })}

        {/* Small Technical Contract Panel */}
        <div className="p-5 rounded-xl bg-gradient-to-br from-amber-950/30 via-slate-900/90 to-slate-950 border border-amber-500/40 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono text-amber-400 uppercase font-bold tracking-wider">
                CONTRACT TELEMETRY
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-bold">
                VERIFIED SOURCE
              </span>
            </div>
            <h4 className="font-mono text-xs font-bold text-white">HASHGUARD.sol</h4>

            <div className="mt-3 space-y-1.5 font-mono text-[11px]">
              <div className="flex justify-between text-slate-400">
                <span>Network:</span>
                <span className="text-slate-200">Ethereum Sepolia</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Chain ID:</span>
                <span className="text-slate-200">11155111</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Compiler:</span>
                <span className="text-slate-200">Solidity ^0.8.20</span>
              </div>
              <div className="pt-2">
                <span className="text-slate-400 block text-[10px] mb-1">Live Contract Address:</span>
                <div className="p-2 rounded bg-black/60 border border-slate-800 text-cyan-300 text-[10px] break-all select-all font-mono">
                  {contractAddress}
                </div>
              </div>
            </div>
          </div>

          <a
            href={`https://sepolia.etherscan.io/address/${contractAddress}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 py-2 px-3 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 font-mono text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
          >
            <span>Inspect on Sepolia Etherscan</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </section>
  );
};
