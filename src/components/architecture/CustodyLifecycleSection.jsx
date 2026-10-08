import React, { useState } from 'react';
import {
  FilePlus,
  Fingerprint,
  Blocks,
  ArrowLeftRight,
  ShieldCheck,
  GitFork,
  Archive,
  ChevronRight,
  Lock,
  ArrowRight
} from 'lucide-react';

export const CustodyLifecycleSection = () => {
  const [selectedStage, setSelectedStage] = useState(0);

  const stages = [
    {
      id: 'register',
      num: '01',
      name: 'REGISTER',
      icon: FilePlus,
      color: 'blue',
      purpose: 'Initial digital evidence intake, physical device seizure, and local bitstream acquisition.',
      input: 'Physical hard drive, memory chip, network capture, or forensic image file (.dd/.E01).',
      output: 'Raw binary stream stored in isolated intake buffer with initial case metadata tags.',
      securityProperty: 'Write-block protection ensures pristine physical source preservation (NIST SP 800-86).'
    },
    {
      id: 'seal',
      num: '02',
      name: 'SEAL',
      icon: Fingerprint,
      color: 'cyan',
      purpose: 'Generate irreversible SHA-256 cryptographic bitstream fingerprint and manifest seal.',
      input: 'Complete binary stream from intake buffer + canonicalized examiner metadata JSON.',
      output: '32-byte contentHash, metadataHash, and tamper-evident acquisition certificate.',
      securityProperty: 'Mathematical immutability: Any subsequent single-bit flip changes digest output.'
    },
    {
      id: 'mint',
      num: '03',
      name: 'MINT',
      icon: Blocks,
      color: 'amber',
      purpose: 'Anchor exhibit identity on Ethereum Sepolia smart contract as an ERC-721 token.',
      input: 'contentHash, metadataHash, initial custodian DID, and organizational enclave ID.',
      output: 'ERC-721 Token ID minted on HASHGUARD.sol; AssetNFTMinted event emitted to block.',
      securityProperty: 'Consensus-level proof of existence and non-repudiable initial ownership record.'
    },
    {
      id: 'transfer',
      num: '04',
      name: 'TRANSFER',
      icon: ArrowLeftRight,
      color: 'purple',
      purpose: 'Execute cross-organization custody handover between registered consortium agencies.',
      input: 'Transfer dispatch manifest signed by sender DID + receiver acceptance signature.',
      output: 'Atomic on-chain custodian state transition via transferCustody() contract method.',
      securityProperty: 'Dual-authorization requirement: Prevents unilateral transfers or ghost evidence.'
    },
    {
      id: 'verify',
      num: '05',
      name: 'VERIFY',
      icon: ShieldCheck,
      color: 'emerald',
      purpose: 'Zero-trust inbound cryptographic verification before admitting exhibit into evidence vault.',
      input: 'Transferred binary payload + reference contentHash from on-chain smart contract token.',
      output: 'Hash comparison certificate: 100% Bit-level match confirms evidence intact.',
      securityProperty: 'Independent verification: Receiver relies on mathematics, not trust in sender.'
    },
    {
      id: 'derive',
      num: '06',
      name: 'DERIVE',
      icon: GitFork,
      color: 'indigo',
      purpose: 'Generate child forensic artifacts (decompiled binaries, PCAP streams, YARA detections).',
      input: 'Sealed primary exhibit analyzed inside air-gapped forensic detonation sandbox.',
      output: 'Derived artifact token with cryptographic parent pointer registered in Lineage DAG.',
      securityProperty: 'Provenance continuity: Every conclusion traces back to root seized exhibit.'
    },
    {
      id: 'archive',
      num: '07',
      name: 'ARCHIVE',
      icon: Archive,
      color: 'slate',
      purpose: 'Statutory evidence retention enforcement and court-ordered legal hold preservation.',
      input: 'Retention policy parameters (years) or Section 65B judicial preservation orders.',
      output: 'Smart contract lock: applyRetentionPolicy() prevents premature deletion or release.',
      securityProperty: 'Tamper-proof retention guarantee: Expiration verified prior to administrative pruning.'
    }
  ];

  const current = stages[selectedStage];

  return (
    <section className="relative py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-800/80">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-[11px] font-mono font-bold text-cyan-400 uppercase tracking-widest">
              7-STAGE FORMAL STATE MACHINE
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-mono font-black text-white">
            CUSTODY LIFECYCLE TIMELINE
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 font-sans mt-1 max-w-3xl">
            A deterministic custody state machine governing every exhibit from physical collection through courtroom admission and statutory archival.
          </p>
        </div>
        <div className="text-xs font-mono text-cyan-400">
          SELECT ANY STAGE TO INSPECT INVARIANTS
        </div>
      </div>

      {/* Horizontal State Machine Ribbon */}
      <div className="relative overflow-x-auto pb-4 pt-2">
        <div className="min-w-[760px]">
          {/* Connector bar */}
          <div className="relative h-1 bg-slate-800 rounded-full mb-6 mx-4">
            <div 
              className="absolute top-0 left-0 h-1 bg-gradient-to-r from-cyan-400 via-purple-400 to-emerald-400 rounded-full transition-all duration-300"
              style={{ width: `${((selectedStage + 1) / stages.length) * 100}%` }}
            />
          </div>

          <div className="grid grid-cols-7 gap-2">
            {stages.map((stage, idx) => {
              const Icon = stage.icon;
              const isSelected = selectedStage === idx;

              return (
                <button
                  key={stage.id}
                  onClick={() => setSelectedStage(idx)}
                  className={`group relative flex flex-col items-center p-3 rounded-xl border transition-all text-center cursor-pointer ${
                    isSelected
                      ? 'bg-slate-900 border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.3)] -translate-y-1'
                      : 'bg-slate-950/70 border-slate-800 hover:border-slate-700 hover:bg-slate-900/60'
                  }`}
                >
                  <span className={`text-[10px] font-mono font-bold mb-1 ${isSelected ? 'text-cyan-400' : 'text-slate-400'}`}>
                    {stage.num}
                  </span>

                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-2 transition-all ${
                    isSelected
                      ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-400/50'
                      : 'bg-slate-900 text-slate-400 group-hover:text-slate-200'
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>

                  <span className={`font-mono text-xs font-bold tracking-wider ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                    {stage.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Cinematic Detail Panel for Selected State */}
      <div className="mt-4 p-6 rounded-2xl bg-[#030712]/95 border border-slate-800 shadow-[0_0_30px_rgba(6,182,212,0.06)]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-2 mb-6">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs px-2.5 py-1 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 font-bold">
              STAGE {current.num} / 07
            </span>
            <h3 className="font-mono text-lg font-black text-white tracking-wide">
              {current.name} STAGE SPECIFICATION
            </h3>
          </div>
          <span className="font-mono text-xs text-emerald-400 font-semibold flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5" />
            <span>STATE MACHINE INVARIANT ENFORCED</span>
          </span>
        </div>

        {/* 4 Technical Columns: Purpose, Input, Output, Security Property */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 font-mono text-xs">
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800/80">
            <span className="text-[10px] uppercase font-bold text-cyan-400 tracking-wider block mb-1.5">
              01. PURPOSE
            </span>
            <p className="text-xs text-slate-300 font-sans leading-relaxed">
              {current.purpose}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800/80">
            <span className="text-[10px] uppercase font-bold text-blue-400 tracking-wider block mb-1.5">
              02. INPUT ARTIFACTS
            </span>
            <p className="text-xs text-slate-300 font-sans leading-relaxed">
              {current.input}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800/80">
            <span className="text-[10px] uppercase font-bold text-purple-400 tracking-wider block mb-1.5">
              03. OUTPUT STATE
            </span>
            <p className="text-xs text-slate-300 font-sans leading-relaxed">
              {current.output}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800/80">
            <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider block mb-1.5">
              04. SECURITY PROPERTY
            </span>
            <p className="text-xs text-slate-300 font-sans leading-relaxed">
              {current.securityProperty}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
