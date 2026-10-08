import React from 'react';
import { ShieldCheck, ArrowRight, Sparkles } from 'lucide-react';
import { LogoIcon } from '../common/Logo';

export const FinalStatementSection = () => {
  return (
    <section className="relative py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto border-t border-slate-800/80 text-center">
      {/* Brand Icon */}
      <div className="flex justify-center mb-4">
        <div className="p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 shadow-[0_0_30px_rgba(6,182,212,0.2)]">
          <LogoIcon className="w-8 h-8" />
        </div>
      </div>

      {/* Main Title */}
      <h2 className="text-3xl sm:text-4xl font-mono font-black text-white tracking-tight">
        HASH<span className="text-cyan-400">GUARD</span>
      </h2>
      <p className="text-xs sm:text-sm font-mono text-slate-400 uppercase tracking-widest mt-1 mb-8">
        DIGITAL ASSET TRUST INFRASTRUCTURE
      </p>

      {/* Mathematical Synthesis Ribbon */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-cyan-500/30 shadow-[0_0_40px_rgba(6,182,212,0.1)] mb-10">
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 font-mono text-xs sm:text-sm font-bold text-slate-200">
          <span className="px-2.5 py-1 rounded bg-slate-800 border border-slate-700 text-cyan-300">
            IDENTITY
          </span>
          <span className="text-cyan-400">+</span>
          <span className="px-2.5 py-1 rounded bg-slate-800 border border-slate-700 text-blue-300">
            AUTHORIZATION
          </span>
          <span className="text-cyan-400">+</span>
          <span className="px-2.5 py-1 rounded bg-slate-800 border border-slate-700 text-emerald-300">
            INTEGRITY
          </span>
          <span className="text-cyan-400">+</span>
          <span className="px-2.5 py-1 rounded bg-slate-800 border border-slate-700 text-amber-300">
            OWNERSHIP
          </span>
          <span className="text-cyan-400">+</span>
          <span className="px-2.5 py-1 rounded bg-slate-800 border border-slate-700 text-purple-300">
            CUSTODY
          </span>
          <span className="text-cyan-400">+</span>
          <span className="px-2.5 py-1 rounded bg-slate-800 border border-slate-700 text-slate-300">
            AUDIT
          </span>
        </div>

        <div className="my-4 flex justify-center">
          <ArrowRight className="w-5 h-5 text-cyan-400 animate-pulse" />
        </div>

        <div className="inline-block px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-950/80 to-emerald-950/80 border border-cyan-400/60 shadow-[0_0_25px_rgba(6,182,212,0.3)]">
          <span className="font-mono text-sm sm:text-base font-black tracking-wider text-white uppercase">
            INDEPENDENTLY VERIFIABLE DIGITAL ASSETS
          </span>
        </div>
      </div>

      {/* Team & Hackathon Attribution */}
      <div className="font-mono text-xs text-slate-400 space-y-1">
        <p className="text-slate-300 font-bold tracking-wider">TEAM DOOMDAY</p>
        <p className="text-cyan-400 font-semibold tracking-widest text-[11px]">SMART INDIA HACKATHON 2026</p>
      </div>
    </section>
  );
};
