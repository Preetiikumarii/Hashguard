import React, { useState } from 'react';
import { 
  X, 
  AlertTriangle, 
  ArrowRight, 
  RotateCcw, 
  Terminal,
  Activity
} from 'lucide-react';

export const TamperBreachModal = ({ isOpen, onClose, onLaunchSandbox, onScrollToTamperEngine }) => {
  const [activeDrillState, setActiveDrillState] = useState('tampered'); // 'tampered' | 'restored'

  if (!isOpen) return null;

  const sealedHash = '8f3a91bc4e8d2f6a7c1e2d9fe4b6c3a77d210984a9e52c801e0a2b8e3a4f6d8c';
  const tamperedHash = '4c8e2d1f9b7a6c3e4d091b3ef2a6d0c4f9eb2a1d8c7e6b5a4f3e2d1c0b9a8f7e';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-2xl rounded-2xl bg-[#14080e] border border-rose-500/50 shadow-[0_0_50px_rgba(244,63,94,0.3)] p-6 text-white font-sans overflow-hidden">
        {/* Glow ambient */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-rose-900/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-500/15 border border-rose-500/40 flex items-center justify-center text-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.3)] animate-pulse">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold font-mono text-white tracking-wide">
                  CRYPTOGRAPHIC TAMPER BREACH CONTAINMENT
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-500/20 border border-rose-500/40 text-rose-300 font-bold animate-pulse">
                  CRITICAL BREACH ALERT
                </span>
              </div>
              <p className="text-xs text-rose-300/80 font-mono mt-0.5">
                Exhibit EV-001 (specimen_lockbit_dump.dd) • Bit Inversion Contained
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg border border-rose-900/60 bg-rose-950/60 hover:bg-rose-900 text-rose-300 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body Proof Details */}
        <div className="mt-5 space-y-4 font-mono text-xs">
          {/* Root cause analysis */}
          <div className="p-3.5 rounded-xl bg-slate-950/90 border border-rose-500/30 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-rose-400 font-bold uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5" />
                <span>1-Bit Alteration Mathematical Proof</span>
              </span>
              <span className="text-[10px] text-slate-400">Byte Offset: 0x00FF (Inverted)</span>
            </div>
            <p className="text-slate-300 font-sans text-xs leading-relaxed">
              An unauthorized party altered a single bit in off-chain file storage. Because SHA-256 exhibits the avalanche effect, changing 1 bit produces a completely unrecognizable 256-bit digest, immediately failing on-chain smart contract verification.
            </p>
          </div>

          {/* Hash Comparison Diff */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="p-3 rounded-xl bg-slate-950/80 border border-emerald-500/30">
              <span className="text-emerald-400 text-[10px] uppercase font-bold block">
                1. ON-CHAIN SEALED ROOT DIGEST
              </span>
              <div className="text-emerald-300 font-bold break-all mt-1 text-[11px]">
                {sealedHash}
              </div>
              <span className="text-[10px] text-slate-400 block mt-1">Locked in Block #1845201</span>
            </div>

            <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/40">
              <span className="text-rose-400 text-[10px] uppercase font-bold block">
                2. OFF-CHAIN COMPUTED SPECIMEN
              </span>
              <div className="text-rose-300 font-bold break-all mt-1 text-[11px] animate-pulse">
                {activeDrillState === 'tampered' ? tamperedHash : sealedHash}
              </div>
              <span className="text-[10px] text-rose-400 font-bold block mt-1">
                {activeDrillState === 'tampered' ? '≠ MISMATCH: STATE TRANSITION REVERTED' : '✓ 100% BIT-LEVEL MATCH'}
              </span>
            </div>
          </div>

          {/* Smart Contract Revert Trace */}
          <div className="p-3 rounded-xl bg-slate-950/90 border border-slate-800 space-y-1.5">
            <div className="flex items-center gap-2 text-slate-400 text-[11px]">
              <Terminal className="w-3.5 h-3.5 text-cyan-400" />
              <span>EVM Execution Revert Trace:</span>
            </div>
            <div className="text-slate-400 text-[10px] font-mono space-y-0.5 pl-2 border-l border-slate-700">
              <div>→ CALL HASHGUARD.verifyExhibit(bytes32 exhibitId, bytes32 computedDigest)</div>
              <div>→ LOAD storage.sealedHash = 0x8f3a91bc4e8d2f6a7c1e...c5d6</div>
              <div className="text-rose-400 font-bold">→ ASSERT (sealedHash == computedDigest) ➔ FALSE</div>
              <div className="text-rose-400">→ REVERT "HASHGUARD: CRYPTOGRAPHIC_INTEGRITY_VIOLATION" [0x08c379a0]</div>
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="mt-6 pt-4 border-t border-rose-900/40 flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveDrillState(activeDrillState === 'tampered' ? 'restored' : 'tampered')}
              className="px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-900 text-slate-300 hover:text-white text-xs font-mono cursor-pointer transition-colors flex items-center gap-1.5"
            >
              <RotateCcw className="w-3 h-3" />
              <span>{activeDrillState === 'tampered' ? 'Simulate Specimen Recovery' : 'Simulate 1-Bit Attack'}</span>
            </button>
            <button
              onClick={() => {
                onClose();
                onScrollToTamperEngine();
              }}
              className="px-3 py-1.5 rounded-lg border border-amber-500/40 bg-amber-500/10 text-amber-300 hover:bg-amber-500/20 text-xs font-mono cursor-pointer transition-colors"
            >
              Open Live Tamper Lab ↓
            </button>
          </div>

          <button
            onClick={() => {
              onClose();
              onLaunchSandbox('ORG_B', '/dashboard', true);
            }}
            className="px-5 py-2 rounded-lg bg-gradient-to-r from-rose-500 to-amber-600 hover:from-rose-400 hover:to-amber-500 text-slate-950 font-mono font-bold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <span>Launch Evaluation Sandbox</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
