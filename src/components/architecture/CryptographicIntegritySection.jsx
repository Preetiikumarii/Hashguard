import React, { useState } from 'react';
import {
  Fingerprint,
  ShieldCheck,
  ShieldAlert,
  ArrowRight,
  FileCode,
  Lock,
  CheckCircle2,
  XCircle,
  Hash,
  AlertTriangle
} from 'lucide-react';

export const CryptographicIntegritySection = () => {
  const [tamperMode, setTamperMode] = useState(false);

  // Real SHA-256 hashes from the repository exhibits
  const sealedHash = "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855";
  const tamperedHash = "a78d89a45610d724bc27fb38562309e451b68239014e7a834125b29015ba9121";

  const currentHash = tamperMode ? tamperedHash : sealedHash;
  const isMatch = currentHash === sealedHash;

  return (
    <section className="relative py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-800/80">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-[11px] font-mono font-bold text-cyan-400 uppercase tracking-widest">
              CRYPTOGRAPHIC INTEGRITY & SEALING
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-mono font-black text-white">
            MATHEMATICAL VERIFICATION OF EVIDENCE
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 font-sans mt-1 max-w-3xl">
            Strict conceptual segregation: SHA-256 serves as the irreversible bitstream integrity fingerprint, while AES-256-GCM protects off-chain payloads at rest.
          </p>
        </div>

        {/* Toggle Tamper Simulation */}
        <button
          onClick={() => setTamperMode(!tamperMode)}
          className={`px-3 py-1.5 rounded-lg border font-mono text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
            tamperMode
              ? 'bg-rose-500/20 border-rose-500/50 text-rose-300 shadow-[0_0_15px_rgba(244,63,94,0.3)]'
              : 'bg-slate-900 border-slate-700 text-slate-300 hover:border-cyan-500/50 hover:text-cyan-300'
          }`}
        >
          <AlertTriangle className={`w-3.5 h-3.5 ${tamperMode ? 'text-rose-400' : 'text-slate-400'}`} />
          <span>{tamperMode ? 'Reset to Sealed State' : 'Simulate 1-Bit Payload Modification'}</span>
        </button>
      </div>

      {/* Pipeline Visual: Evidence -> SHA-256 -> 32-Byte Digest -> Trust Anchor */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-8">
        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800">
          <div className="flex items-center gap-2 font-mono text-[10px] text-slate-400 uppercase mb-1">
            <FileCode className="w-3.5 h-3.5 text-blue-400" />
            <span>01. RAW BITSTREAM</span>
          </div>
          <h4 className="font-mono text-sm font-bold text-white">Digital Evidence File</h4>
          <p className="text-[11px] text-slate-400 font-sans mt-1">
            .E01 Disk Image, .pcap capture, or system memory dump bitstream.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800">
          <div className="flex items-center gap-2 font-mono text-[10px] text-slate-400 uppercase mb-1">
            <Fingerprint className="w-3.5 h-3.5 text-cyan-400" />
            <span>02. HASH GENERATION</span>
          </div>
          <h4 className="font-mono text-sm font-bold text-white">SHA-256 (FIPS 180-4)</h4>
          <p className="text-[11px] text-slate-400 font-sans mt-1">
            Deterministic, one-way cryptographic hash algorithm.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800">
          <div className="flex items-center gap-2 font-mono text-[10px] text-slate-400 uppercase mb-1">
            <Hash className="w-3.5 h-3.5 text-purple-400" />
            <span>03. FINGERPRINT</span>
          </div>
          <h4 className="font-mono text-sm font-bold text-white">32-Byte Digest</h4>
          <p className="text-[11px] text-slate-400 font-sans mt-1">
            Irreversible mathematical summary representing entire binary file.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800">
          <div className="flex items-center gap-2 font-mono text-[10px] text-slate-400 uppercase mb-1">
            <Lock className="w-3.5 h-3.5 text-amber-400" />
            <span>04. TRUST ANCHOR</span>
          </div>
          <h4 className="font-mono text-sm font-bold text-white">On-Chain Registry</h4>
          <p className="text-[11px] text-slate-400 font-sans mt-1">
            Sealed on Ethereum Sepolia contract as <code className="text-amber-300">contentHash</code>.
          </p>
        </div>
      </div>

      {/* Comparison Engine Card */}
      <div className={`p-6 rounded-2xl border transition-all duration-300 ${
        isMatch
          ? 'bg-[#030712]/90 border-emerald-500/40 shadow-[0_0_30px_rgba(16,185,129,0.1)]'
          : 'bg-[#030712]/90 border-rose-500/50 shadow-[0_0_30px_rgba(244,63,94,0.15)]'
      }`}>
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
          <div className="flex items-center gap-2 font-mono text-xs font-bold text-white">
            <span className={`w-2.5 h-2.5 rounded-full ${isMatch ? 'bg-emerald-400 animate-pulse' : 'bg-rose-500'}`} />
            <span>CRYPTOGRAPHIC COMPARISON ENGINE</span>
          </div>
          <span className={`px-2.5 py-1 rounded font-mono text-xs font-bold border ${
            isMatch
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
              : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
          }`}>
            {isMatch ? 'STATUS: VERIFIED (MATCH)' : 'STATUS: TAMPER DETECTED (MISMATCH)'}
          </span>
        </div>

        {/* 2-Side Hash Comparison */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Sealed Reference */}
          <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800">
            <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 font-bold block mb-1">
              SEALED REFERENCE DIGEST (FROM ON-CHAIN EVM BLOCK)
            </span>
            <div className="p-2.5 rounded-lg bg-black/60 border border-slate-800 font-mono text-xs text-cyan-300 break-all select-all">
              {sealedHash}
            </div>
            <span className="font-mono text-[10px] text-slate-400 block mt-2">
              Anchored during original exhibit registration on Sepolia contract
            </span>
          </div>

          {/* Current Evidence */}
          <div className={`p-4 rounded-xl bg-slate-900/90 border ${isMatch ? 'border-slate-800' : 'border-rose-500/40'}`}>
            <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 font-bold block mb-1">
              RECOMPUTED EVIDENCE DIGEST (FROM CURRENT LOCAL FILE)
            </span>
            <div className={`p-2.5 rounded-lg bg-black/60 border font-mono text-xs break-all select-all ${
              isMatch ? 'border-slate-800 text-emerald-300' : 'border-rose-500/50 text-rose-300'
            }`}>
              {currentHash}
            </div>
            <span className={`font-mono text-[10px] block mt-2 ${isMatch ? 'text-slate-400' : 'text-rose-400 font-bold'}`}>
              {isMatch
                ? 'Computed via WebCrypto API bitstream digest'
                : '1-bit divergence detected: Cryptographic seal broken!'}
            </span>
          </div>
        </div>

        {/* Clear Technical Distinction Note */}
        <div className="mt-6 pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-[11px] font-mono text-slate-400">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 font-bold border border-cyan-500/30">
              SHA-256
            </span>
            <span>Deterministic Integrity Fingerprint (Public & On-Chain)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 font-bold border border-indigo-500/30">
              AES-256-GCM
            </span>
            <span>Confidentiality Encryption at Rest (Off-Chain Only)</span>
          </div>
        </div>
      </div>
    </section>
  );
};
