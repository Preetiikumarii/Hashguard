import React from 'react';
import { ShieldCheck, Cpu, ArrowRight, Layers, Lock, FileKey2, CheckCircle2 } from 'lucide-react';

export const ArchitectureHero = ({ onScrollToDiagram }) => {
  return (
    <section className="relative pt-12 pb-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-b border-slate-800/80">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        {/* Left Column: Heading, Subtitle, Badges */}
        <div className="lg:col-span-7 space-y-6">
          {/* Micro telemetry tag */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-950/40 text-cyan-300 font-mono text-[11px] tracking-wider uppercase">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span>SECURITY ARCHITECTURE CONTROL ROOM</span>
          </div>

          {/* Heading */}
          <div className="space-y-1">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black font-mono tracking-tight text-white leading-none">
              HASH<span className="text-cyan-400">GUARD</span>
            </h1>
            <p className="text-xl sm:text-2xl font-mono text-slate-300 font-bold tracking-wide">
              SYSTEM ARCHITECTURE
            </p>
          </div>

          {/* Subheading */}
          <p className="text-slate-300 text-base sm:text-lg font-sans max-w-2xl leading-relaxed">
            "From digital evidence to independently verifiable trust."
          </p>

          <p className="text-xs sm:text-sm text-slate-400 font-mono max-w-2xl leading-relaxed">
            A zero-trust cryptographic architecture uniting W3C Decentralized Identifiers, deterministic SHA-256 bitstream sealing, off-chain evidence vaults, and on-chain ERC-721 custody consensus.
          </p>

          {/* Small Status Row */}
          <div className="flex flex-wrap items-center gap-2 pt-1 font-mono text-[11px]">
            <span className="px-2.5 py-1 rounded bg-emerald-500/10 border border-emerald-500/40 text-emerald-400 font-bold flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              IMPLEMENTED
            </span>
            <span className="px-2.5 py-1 rounded bg-slate-900 border border-slate-700/80 text-cyan-300 font-medium">
              ETHEREUM SEPOLIA
            </span>
            <span className="px-2.5 py-1 rounded bg-slate-900 border border-slate-700/80 text-slate-300 font-medium">
              CHAIN ID 11155111
            </span>
            <span className="px-2.5 py-1 rounded bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-medium flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              SMART CONTRACT VERIFIED
            </span>
          </div>
        </div>

        {/* Right Column: Minimal Animated System Signal (Conceptual Convergence) */}
        <div className="lg:col-span-5">
          <div className="relative p-6 rounded-2xl bg-[#030712]/90 border border-slate-800 shadow-[0_0_40px_rgba(6,182,212,0.08)]">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 mb-4">
              <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 font-bold">
                SYSTEM CONVERGENCE SIGNAL
              </span>
              <span className="text-[10px] font-mono text-cyan-400 font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                DETERMINISTIC PIPELINE
              </span>
            </div>

            {/* 4 Pillars Converging */}
            <div className="space-y-2.5">
              <div className="grid grid-cols-4 gap-2 font-mono text-[11px]">
                <div className="p-2.5 rounded-lg bg-slate-900/90 border border-blue-500/30 text-center">
                  <span className="text-blue-400 font-bold block text-[10px]">01</span>
                  <span className="text-slate-200 font-semibold block text-[11px] mt-0.5">IDENTITY</span>
                  <span className="text-[9px] text-slate-400 block mt-0.5">W3C DID</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-900/90 border border-purple-500/30 text-center">
                  <span className="text-purple-400 font-bold block text-[10px]">02</span>
                  <span className="text-slate-200 font-semibold block text-[11px] mt-0.5">ASSET</span>
                  <span className="text-[9px] text-slate-400 block mt-0.5">ERC-721</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-900/90 border border-cyan-500/30 text-center">
                  <span className="text-cyan-400 font-bold block text-[10px]">03</span>
                  <span className="text-slate-200 font-semibold block text-[11px] mt-0.5">PROOF</span>
                  <span className="text-[9px] text-slate-400 block mt-0.5">SHA-256</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-900/90 border border-amber-500/30 text-center">
                  <span className="text-amber-400 font-bold block text-[10px]">04</span>
                  <span className="text-slate-200 font-semibold block text-[11px] mt-0.5">CUSTODY</span>
                  <span className="text-[9px] text-slate-400 block mt-0.5">EVM Ledger</span>
                </div>
              </div>

              {/* Animated Convergence Arrow Flow */}
              <div className="flex items-center justify-center py-1">
                <div className="w-px h-6 bg-gradient-to-b from-cyan-400 to-emerald-400 animate-pulse" />
              </div>

              {/* Target State */}
              <div className="p-3.5 rounded-xl bg-gradient-to-r from-cyan-950/60 via-slate-900/90 to-emerald-950/60 border border-cyan-500/40 text-center shadow-[0_0_20px_rgba(6,182,212,0.15)]">
                <div className="flex items-center justify-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span className="font-mono text-xs font-black tracking-wider text-white uppercase">
                    INDEPENDENTLY VERIFIABLE TRUST
                  </span>
                </div>
                <p className="text-[10px] font-mono text-slate-400 mt-1">
                  Court-Admissible Digital Evidence • Section 65B & ISO/IEC 27037 Compatible
                </p>
              </div>
            </div>

            {/* Quick Explore Anchor */}
            {onScrollToDiagram && (
              <button
                onClick={onScrollToDiagram}
                className="w-full mt-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-850 border border-slate-700 text-slate-300 hover:text-cyan-300 font-mono text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <span>Inspect Layered Architecture</span>
                <ArrowRight className="w-3.5 h-3.5 text-cyan-400" />
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
