import React, { useState } from 'react';
import {
  ShieldCheck,
  ShieldAlert,
  ArrowDown,
  CheckCircle2,
  XCircle,
  RotateCcw,
  ChevronDown,
  ChevronUp,
  Fingerprint,
  KeyRound,
  History,
  GitBranch,
  Clock,
  Sparkles
} from 'lucide-react';

export const IndependentVerificationSection = () => {
  const [tamperSimulated, setTamperSimulated] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  // Exact exhibit test hashes
  const expectedHash = "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855";
  const observedHash = tamperSimulated
    ? "5d41402abc4b2a76b9719d911017c592b21ee4c4a4e5257e8419c8fb92994116"
    : "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855";

  const isVerified = expectedHash === observedHash;

  const detailedChecks = [
    {
      title: '01. Cryptographic Integrity',
      pass: isVerified,
      icon: Fingerprint,
      detail: isVerified
        ? 'Observed file SHA-256 hash strictly matches on-chain contentHash root.'
        : 'Bitstream mismatch: 1 or more bytes altered in payload. Integrity seal broken.'
    },
    {
      title: '02. Identity & Signature Validation',
      pass: true,
      icon: KeyRound,
      detail: 'Registered secp256k1 key signature verified against on-chain DID Document.'
    },
    {
      title: '03. Custody Continuity',
      pass: true,
      icon: History,
      detail: 'Sequential dual-authorization handovers without gaps or unverified transfer hops.'
    },
    {
      title: '04. Monotonic Sequence & Block Timestamps',
      pass: true,
      icon: Clock,
      detail: 'EVM block timestamps progress monotonically without retroactive manipulation.'
    },
    {
      title: '05. DAG Lineage Parent-Child Proof',
      pass: true,
      icon: GitBranch,
      detail: 'Derived forensic artifacts cryptographically resolve to original seized exhibit root.'
    }
  ];

  return (
    <section id="verification" className="relative py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-ce-border dark:border-slate-800/80">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 dark:bg-emerald-400 animate-pulse shadow-sm" />
            <span className="text-[11px] font-mono font-bold text-emerald-800 dark:text-emerald-400 uppercase tracking-widest">
              SECTION 04 &bull; ZERO-TRUST AUDIT
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-mono font-black text-slate-950 dark:text-white">
            INDEPENDENT VERIFICATION ENGINE
          </h2>
          <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-sans mt-1 max-w-3xl font-medium">
            Anyone can independently verify evidence without trusting police servers, cloud databases, or administrative credentials. The mathematics alone determine authenticity.
          </p>
        </div>

        {/* Interactive Tamper Toggle */}
        <button
          onClick={() => setTamperSimulated(!tamperSimulated)}
          className={`px-4 py-2.5 rounded-xl border-2 font-mono text-xs font-bold transition-all cursor-pointer flex items-center gap-2 shrink-0 shadow-sm ${
            tamperSimulated
              ? 'bg-rose-50 border-rose-400 text-rose-900 shadow-sm dark:bg-rose-500/20 dark:border-rose-500/50 dark:text-rose-300 dark:shadow-[0_0_20px_rgba(244,63,94,0.3)]'
              : 'bg-white border-slate-300 text-slate-900 hover:border-slate-400 hover:bg-slate-50 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-300 dark:hover:text-cyan-300'
          }`}
        >
          <RotateCcw className="w-4 h-4" />
          <span>{tamperSimulated ? 'Reset to Legitimate Evidence' : 'Simulate Evidence Tampering'}</span>
        </button>
      </div>

      {/* ─── MAIN VISUALIZATION: DOCKET DOSSIER CONTAINER ─── */}
      <div className={`p-6 sm:p-8 rounded-2xl bg-white dark:bg-[#070e1c] border-2 transition-all duration-300 shadow-premium ${
        isVerified
          ? 'border-slate-300 dark:border-slate-800'
          : 'border-rose-400 dark:border-rose-500/60 shadow-[0_0_30px_rgba(244,63,94,0.12)]'
      }`}>
        {/* Top Docket Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b-2 border-dashed border-slate-300 dark:border-slate-800 gap-3 mb-8">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl border-2 font-mono font-bold text-xs ${
              isVerified
                ? 'bg-blue-50 text-blue-900 border-blue-300 dark:bg-blue-950 dark:text-cyan-300 dark:border-cyan-500/40'
                : 'bg-rose-50 text-rose-900 border-rose-300 dark:bg-rose-950 dark:text-rose-300 dark:border-rose-500/40'
            }`}>
              AUDIT // 04
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-slate-700 dark:text-slate-400 font-bold block">
                AUDIT PROTOCOL &bull; 5-POINT ZERO-TRUST ENGINE
              </span>
              <span className="text-sm font-mono font-black text-slate-950 dark:text-white">
                RFC-6962 SHA-256 BITSTREAM NOTARIZATION
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className={`px-3 py-1 rounded-lg border-2 font-mono text-[11px] font-bold flex items-center gap-1.5 ${
              isVerified
                ? 'bg-emerald-50 border-emerald-300 text-emerald-900 dark:bg-emerald-950 dark:border-emerald-500/40 dark:text-emerald-300'
                : 'bg-rose-50 border-rose-300 text-rose-900 dark:bg-rose-950 dark:border-rose-500/40 dark:text-rose-300 animate-pulse'
            }`}>
              <span className={`w-2 h-2 rounded-full ${isVerified ? 'bg-emerald-600 dark:bg-emerald-400' : 'bg-rose-600 dark:bg-rose-400'}`} />
              <span>{isVerified ? 'STATUS: DOCKET SEALED & UNBROKEN' : 'STATUS: INTEGRITY BREACH SIMULATED'}</span>
            </span>
          </div>
        </div>

        {/* Dual Cryptographic Dossier Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch relative">
          {/* Card 1: SEALED REFERENCE → EXPECTED SHA-256 */}
          <div className="rounded-xl border-2 border-slate-300 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/70 overflow-hidden flex flex-col justify-between shadow-xs">
            <div>
              <div className="bg-slate-100 dark:bg-slate-900 px-4 py-2.5 border-b-2 border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <span className="font-mono text-xs font-black text-blue-950 dark:text-cyan-300 uppercase tracking-wider flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-blue-700 dark:text-cyan-400" />
                  <span>SEALED REFERENCE ROOT</span>
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-100 text-blue-900 border border-blue-300 dark:bg-cyan-950 dark:text-cyan-300 dark:border-cyan-500/40 font-bold">
                  EVM SMART CONTRACT
                </span>
              </div>
              <div className="p-4 space-y-3">
                <p className="text-xs text-slate-700 dark:text-slate-300 font-sans font-medium leading-relaxed">
                  Immutable reference digest anchored during evidence seizure and permanently sealed inside the smart contract:
                </p>
                <div>
                  <div className="text-[10px] font-mono text-slate-800 dark:text-slate-300 uppercase mb-1.5 font-bold flex items-center justify-between">
                    <span>EXPECTED SHA-256 DIGEST:</span>
                    <span className="text-[9px] text-slate-600 dark:text-slate-400 font-normal">FIPS 180-4 256-BIT</span>
                  </div>
                  {/* Cryptographic terminal console */}
                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-cyan-400 font-mono text-xs font-bold break-all select-all shadow-inner tracking-wider">
                    {expectedHash}
                  </div>
                </div>
              </div>
            </div>
            <div className="px-4 py-2.5 bg-slate-100/80 dark:bg-slate-900/80 border-t border-slate-200 dark:border-slate-800 text-[10px] font-mono text-slate-700 dark:text-slate-400 flex items-center justify-between">
              <span>CONTRACT: HashGuard.sol :: contentHash</span>
              <span className="font-bold text-slate-800 dark:text-slate-300">BLOCK #19,402,118</span>
            </div>
          </div>

          {/* Card 2: CURRENT ASSET → RECOMPUTED SHA-256 */}
          <div className={`rounded-xl border-2 overflow-hidden flex flex-col justify-between shadow-xs transition-colors ${
            isVerified
              ? 'border-slate-300 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/70'
              : 'border-rose-400 dark:border-rose-500/60 bg-rose-50/30 dark:bg-rose-950/20'
          }`}>
            <div>
              <div className={`px-4 py-2.5 border-b-2 flex items-center justify-between ${
                isVerified
                  ? 'bg-slate-100 dark:bg-slate-900 border-slate-200 dark:border-slate-800'
                  : 'bg-rose-100 dark:bg-rose-950/70 border-rose-300 dark:border-rose-500/50'
              }`}>
                <span className="font-mono text-xs font-black uppercase tracking-wider text-slate-950 dark:text-slate-200 flex items-center gap-2">
                  <Fingerprint className={`w-4 h-4 ${isVerified ? 'text-emerald-700 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`} />
                  <span>CURRENT ASSET PAYLOAD</span>
                </span>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded border font-bold ${
                  isVerified
                    ? 'bg-emerald-100 text-emerald-900 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-500/40'
                    : 'bg-rose-200 text-rose-900 border-rose-400 dark:bg-rose-900 dark:text-rose-200 dark:border-rose-500 animate-pulse'
                }`}>
                  {isVerified ? 'BITSTREAM INTACT' : 'PAYLOAD MODIFIED'}
                </span>
              </div>
              <div className="p-4 space-y-3">
                <p className="text-xs text-slate-700 dark:text-slate-300 font-sans font-medium leading-relaxed">
                  Recomputed SHA-256 digest calculated live in client browser sandbox directly from the presented exhibit bitstream:
                </p>
                <div>
                  <div className="text-[10px] font-mono uppercase mb-1.5 font-bold flex items-center justify-between text-slate-800 dark:text-slate-300">
                    <span>RECOMPUTED SHA-256 DIGEST:</span>
                    <span className="text-[9px] text-slate-600 dark:text-slate-400 font-normal">WEB-CRYPTO API</span>
                  </div>
                  {/* Cryptographic terminal console */}
                  <div className={`p-3.5 rounded-xl font-mono text-xs font-bold break-all select-all shadow-inner tracking-wider ${
                    isVerified
                      ? 'bg-slate-950 border border-slate-800 text-emerald-400'
                      : 'bg-rose-950 border-2 border-rose-500 text-rose-300 animate-pulse shadow-[0_0_20px_rgba(244,63,94,0.25)]'
                  }`}>
                    {observedHash}
                  </div>
                </div>
              </div>
            </div>
            <div className={`px-4 py-2.5 border-t text-[10px] font-mono flex items-center justify-between ${
              isVerified
                ? 'bg-slate-100/80 dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-400'
                : 'bg-rose-100/80 dark:bg-rose-950/50 border-rose-200 dark:border-rose-800 text-rose-900 dark:text-rose-300'
            }`}>
              <span>RUNTIME: window.crypto.subtle.digest</span>
              <span className="font-bold">{isVerified ? 'CRYPTO_OK' : 'MISMATCH_ALERT'}</span>
            </div>
          </div>
        </div>

        {/* ─── CENTRAL DETERMINISTIC COMPARATOR GATE ─── */}
        <div className="flex flex-col items-center justify-center my-8 relative">
          {/* Connecting Conduit Rail */}
          <div className="w-0.5 h-6 bg-slate-400 dark:bg-slate-700" />
          <div className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-700 font-mono text-xs text-slate-800 dark:text-slate-200 shadow-sm flex items-center gap-2.5 z-10">
            <span className="font-black text-blue-700 dark:text-cyan-400">[===]</span>
            <span className="font-bold tracking-wider uppercase text-[11px]">
              DETERMINISTIC BITSTREAM EQUALITY CHECK
            </span>
            <ArrowDown className="w-3.5 h-3.5 text-slate-600 dark:text-slate-400" />
          </div>
          <div className="w-0.5 h-6 bg-slate-400 dark:bg-slate-700" />

          {/* ─── FINAL VERDICT: OFFICIAL FORENSIC NOTARY ATTESTATION SEAL ─── */}
          <div className={`w-full max-w-2xl p-6 sm:p-7 rounded-2xl border-2 text-center transition-all shadow-md relative overflow-hidden ${
            isVerified
              ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-950 dark:text-emerald-200'
              : 'bg-rose-50 dark:bg-rose-950/70 border-rose-500 text-rose-950 dark:text-rose-200 animate-pulse shadow-[0_0_35px_rgba(244,63,94,0.25)]'
          }`}>
            {/* Seal Watermark Tag */}
            <div className="text-[10px] font-mono uppercase tracking-widest font-black mb-2 flex items-center justify-center gap-2">
              <span className={`px-2.5 py-0.5 rounded border text-[9px] font-mono font-bold ${
                isVerified
                  ? 'bg-emerald-100 border-emerald-300 text-emerald-900 dark:bg-emerald-900 dark:border-emerald-500/50 dark:text-emerald-200'
                  : 'bg-rose-100 border-rose-300 text-rose-900 dark:bg-rose-900 dark:border-rose-500/50 dark:text-rose-200'
              }`}>
                {isVerified ? 'CERTIFIED FORENSIC ATTESTATION // SEC-65B' : 'FORENSIC ALERT // EVIDENCE INTEGRITY COMPROMISED'}
              </span>
            </div>

            <div className="flex items-center justify-center gap-3 mb-2">
              {isVerified ? (
                <CheckCircle2 className="w-8 h-8 text-emerald-600 dark:text-emerald-400 shrink-0" />
              ) : (
                <XCircle className="w-8 h-8 text-rose-600 dark:text-rose-400 shrink-0" />
              )}
              <h3 className="font-mono text-xl sm:text-2xl font-black tracking-wider uppercase">
                {isVerified ? 'VERDICT: 100% BITSTREAM MATCH VERIFIED' : 'VERDICT: BITSTREAM MISMATCH DETECTED'}
              </h3>
            </div>

            <p className="text-xs sm:text-sm font-sans font-medium text-slate-800 dark:text-slate-200 max-w-xl mx-auto leading-relaxed">
              {isVerified
                ? 'The presented digital asset matches the anchored on-chain baseline byte-for-byte. Mathematical proof of zero alteration satisfies court admissibility requirements.'
                : 'Cryptographic hash mismatch. 1 or more bits have been altered or substituted. Evidentiary chain seal broken and admissibility voided!'}
            </p>

            {/* Validation stamps */}
            <div className="mt-4 pt-4 border-t-2 border-dashed border-emerald-200 dark:border-emerald-800/60 flex flex-wrap items-center justify-center gap-2">
              <span className={`px-2.5 py-1 rounded-md text-[10px] font-mono font-bold border ${
                isVerified
                  ? 'bg-white border-emerald-300 text-emerald-900 dark:bg-emerald-900/40 dark:border-emerald-600 dark:text-emerald-200'
                  : 'bg-white border-rose-300 text-rose-900 dark:bg-rose-900/40 dark:border-rose-600 dark:text-rose-200'
              }`}>
                {isVerified ? '✓ CRYPTOGRAPHIC SEAL: VALID' : '✗ HASH MISMATCH: FAILED'}
              </span>
              <span className="px-2.5 py-1 rounded-md text-[10px] font-mono font-bold bg-white border border-slate-300 text-slate-800 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-300">
                W3C DID SIGNATURE: AUTHENTIC
              </span>
              <span className="px-2.5 py-1 rounded-md text-[10px] font-mono font-bold bg-white border border-slate-300 text-slate-800 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-300">
                CUSTODY CONTINUITY: UNBROKEN
              </span>
            </div>
          </div>
        </div>

        {/* ─── PROGRESSIVE DISCLOSURE: 5-POINT VECTORS INSPECTION ─── */}
        <div className="pt-5 border-t-2 border-slate-200 dark:border-slate-800 flex flex-col items-center">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white hover:bg-slate-50 border-2 border-slate-300 text-slate-900 dark:bg-slate-900 dark:hover:bg-slate-800 dark:border-slate-700 dark:text-slate-200 dark:hover:text-white font-mono text-xs font-bold transition-all cursor-pointer shadow-xs"
          >
            <span>{showDetails ? 'Hide Verification Inspection Docket' : 'View Verification Inspection (Ownership, Custody, Provenance, Audit)'}</span>
            {showDetails ? <ChevronUp className="w-4 h-4 text-blue-700 dark:text-cyan-400" /> : <ChevronDown className="w-4 h-4 text-blue-700 dark:text-cyan-400" />}
          </button>

          {/* Expandable Deeper Inspection Vectors */}
          {showDetails && (
            <div className="w-full mt-6 pt-6 border-t-2 border-dashed border-slate-200 dark:border-slate-800 space-y-4 animate-in fade-in duration-300">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[11px] uppercase font-black text-slate-800 dark:text-slate-300 tracking-wider block text-left">
                  INSPECTION VECTORS &bull; 5-POINT COMPLIANCE AUDIT
                </span>
                <span className="text-[10px] font-mono text-slate-600 dark:text-slate-400">
                  {isVerified ? '5/5 PASSED' : '4/5 PASSED (1 FAILURE)'}
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 font-mono text-xs">
                {detailedChecks.map((c, i) => {
                  const CheckIcon = c.icon;
                  return (
                    <div
                      key={i}
                      className={`p-4 rounded-xl border-2 flex flex-col justify-between shadow-xs ${
                        c.pass
                          ? 'bg-white border-slate-300 text-slate-950 dark:bg-slate-900/60 dark:border-slate-800 dark:text-slate-300'
                          : 'bg-rose-50 border-rose-400 text-rose-950 dark:bg-rose-950/40 dark:border-rose-500/60 dark:text-rose-200'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2.5 pb-2 border-b border-slate-200 dark:border-slate-800">
                          <CheckIcon className={`w-4 h-4 ${c.pass ? 'text-blue-700 dark:text-cyan-400' : 'text-rose-600 dark:text-rose-400'}`} />
                          {c.pass ? (
                            <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-900 border border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-500/40 text-[9px] font-bold">
                              PASS ✓
                            </span>
                          ) : (
                            <span className="px-1.5 py-0.5 rounded bg-rose-200 text-rose-950 border border-rose-400 dark:bg-rose-900 dark:text-rose-200 dark:border-rose-500 text-[9px] font-bold animate-pulse">
                              FAIL ✗
                            </span>
                          )}
                        </div>
                        <div className="font-black text-[11px] mb-1.5 text-slate-950 dark:text-white leading-tight">
                          {c.title}
                        </div>
                        <p className="text-[10px] text-slate-700 dark:text-slate-300 font-sans leading-relaxed font-medium">
                          {c.detail}
                        </p>
                      </div>
                      <div className="mt-3 pt-2.5 border-t border-slate-200 dark:border-slate-800 text-[10px] font-bold flex items-center justify-between">
                        <span className="text-slate-500 dark:text-slate-400 text-[9px]">RESULT</span>
                        {c.pass ? (
                          <span className="text-emerald-800 dark:text-emerald-400">VERIFIED ✓</span>
                        ) : (
                          <span className="text-rose-800 dark:text-rose-400 font-black">FAILED ✗</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
