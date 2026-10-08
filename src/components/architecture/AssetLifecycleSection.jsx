import React, { useState } from 'react';
import {
  FilePlus,
  Fingerprint,
  Blocks,
  ArrowRightLeft,
  ShieldCheck,
  GitFork,
  Archive,
  ChevronRight,
  Shield,
  CheckCircle2,
  Lock,
  ArrowRight
} from 'lucide-react';

export const AssetLifecycleSection = () => {
  const [selectedStage, setSelectedStage] = useState(0);

  const stages = [
    {
      id: 'register',
      num: '01',
      name: 'REGISTER',
      icon: FilePlus,
      color: 'blue',
      purpose: 'Initial digital evidence intake, physical device seizure, and local bitstream acquisition into isolated memory.',
      input: 'Physical hard drive, memory chip, network capture, or forensic disk image file (.dd/.E01).',
      output: 'Raw binary stream stored in isolated local buffer with initial case metadata and examiner tags.',
      securityProperty: 'Hardware write-block protection ensures pristine physical source preservation (NIST SP 800-86 standard).'
    },
    {
      id: 'seal',
      num: '02',
      name: 'SEAL',
      icon: Fingerprint,
      color: 'cyan',
      purpose: 'Generate deterministic SHA-256 cryptographic bitstream fingerprint and tamper-evident manifest seal.',
      input: 'Complete binary stream from acquisition buffer + canonicalized examiner metadata JSON.',
      output: '32-byte contentHash, metadataHash, and tamper-evident acquisition manifest.',
      securityProperty: 'Mathematical immutability: Any subsequent single-bit flip completely alters the digest output (avalanche effect).'
    },
    {
      id: 'mint',
      num: '03',
      name: 'MINT / REGISTER OWNERSHIP',
      icon: Blocks,
      color: 'amber',
      purpose: 'Anchor exhibit identity on Ethereum Sepolia smart contract as a non-fungible ERC-721 token.',
      input: 'contentHash, metadataHash, initial custodian DID, and organizational enclave ID.',
      output: 'ERC-721 Token ID minted on HASHGUARD.sol; AssetNFTMinted event emitted to public block logs.',
      securityProperty: 'Consensus-level proof of existence and non-repudiable initial ownership record anchored to blockchain.'
    },
    {
      id: 'transfer',
      num: '04',
      name: 'TRANSFER',
      icon: ArrowRightLeft,
      color: 'purple',
      purpose: 'Execute cross-organization custody handover between participating consortium agencies.',
      input: 'Transfer dispatch manifest signed by sender DID + receiver acceptance signature challenge.',
      output: 'Atomic on-chain custodian state transition via transferCustody() contract transaction.',
      securityProperty: 'Dual-authorization requirement: Prevents unilateral transfers, ghost evidence, or unaccounted custody gaps.'
    },
    {
      id: 'verify',
      num: '05',
      name: 'VERIFY',
      icon: ShieldCheck,
      color: 'emerald',
      purpose: 'Zero-trust inbound cryptographic verification before admitting exhibit into evidence vault.',
      input: 'Transferred binary payload + reference contentHash from on-chain smart contract token.',
      output: 'Cryptographic verification report: 100% bit-level match confirms evidence intact.',
      securityProperty: 'Independent verification: Receiving node relies strictly on mathematics, not trust in sender database.'
    },
    {
      id: 'derive',
      num: '06',
      name: 'DERIVE / TRACE',
      icon: GitFork,
      color: 'indigo',
      purpose: 'Generate child forensic artifacts (decompiled binaries, PCAP streams, YARA threat detections).',
      input: 'Sealed primary exhibit analyzed inside air-gapped forensic detonation sandbox.',
      output: 'Derived artifact token with cryptographic parent pointer registered in Forensic Lineage DAG.',
      securityProperty: 'Provenance continuity: Every forensic conclusion traces mathematically back to root seized exhibit.'
    },
    {
      id: 'archive',
      num: '07',
      name: 'ARCHIVE',
      icon: Archive,
      color: 'slate',
      purpose: 'Statutory evidence retention enforcement and court-ordered legal hold preservation.',
      input: 'Retention policy parameters (years) or court-ordered legal hold preservation orders.',
      output: 'Smart contract lock: applyRetentionPolicy() prevents premature deletion or unauthorized release.',
      securityProperty: 'Tamper-proof retention guarantee: Statutory expiry date verified prior to administrative pruning.'
    }
  ];

  const current = stages[selectedStage];
  const Icon = current.icon;

  return (
    <section id="asset-lifecycle" className="relative py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-ce-border dark:border-slate-800/80">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-teal-600 dark:bg-teal-400 animate-pulse" />
            <span className="text-[11px] font-mono font-bold text-teal-800 dark:text-teal-400 uppercase tracking-widest">
              SECTION 03 &bull; LIFECYCLE STATE MACHINE
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-mono font-black text-slate-950 dark:text-white">
            THE 7-STAGE ASSET LIFECYCLE
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-sans mt-1 max-w-2xl">
            A continuous, connected chain of custody. Click any stage along the timeline to inspect its operational purpose, cryptographic inputs, outputs, and security invariants.
          </p>
        </div>
        <div className="text-xs font-mono text-teal-950 dark:text-cyan-400 bg-teal-50 dark:bg-cyan-950/40 border-2 border-teal-300 dark:border-cyan-500/30 px-3.5 py-1.5 rounded-xl shrink-0 font-bold shadow-xs">
          STAGE {current.num} OF 07 &bull; {current.name}
        </div>
      </div>

      {/* ONE CONNECTED HORIZONTAL TIMELINE WITH CONDUIT PROGRESSION */}
      <div className="mb-8">
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5 relative">
          {stages.map((stage, idx) => {
            const StageIcon = stage.icon;
            const isSelected = selectedStage === idx;
            const isPassed = idx < selectedStage;

            return (
              <button
                key={stage.id}
                onClick={() => setSelectedStage(idx)}
                className={`p-3.5 rounded-xl border-2 text-left transition-all cursor-pointer relative flex flex-col justify-between h-32 group shadow-xs hover:shadow-md ${
                  isSelected
                    ? 'bg-teal-50/95 border-teal-600 text-slate-950 shadow-md ring-2 ring-teal-600/30 dark:bg-teal-950/70 dark:border-teal-400'
                    : isPassed
                    ? 'bg-white border-slate-300 hover:border-teal-500/80 text-slate-900 dark:bg-slate-900/90 dark:border-slate-700'
                    : 'bg-white border-slate-200 hover:border-slate-400 text-slate-800 dark:bg-slate-900/60 dark:border-slate-800'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className={`px-2 py-0.5 rounded font-mono text-[10px] font-black ${
                    isSelected ? 'bg-teal-700 text-white' : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                  }`}>
                    {stage.num}
                  </span>
                  <div className={`p-1.5 rounded-lg ${isSelected ? 'bg-teal-100 text-teal-800 dark:bg-teal-900/50 dark:text-teal-300' : 'text-slate-500 dark:text-slate-400 group-hover:text-slate-900'}`}>
                    <StageIcon className="w-4 h-4" />
                  </div>
                </div>

                <div>
                  <div className="font-mono text-xs font-black text-slate-950 dark:text-white tracking-wider uppercase leading-tight">
                    {stage.name}
                  </div>
                  <div className="text-[9px] font-mono text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1 font-bold">
                    <span>STATUS:</span>
                    <span className={isSelected ? 'text-teal-700 font-bold' : isPassed ? 'text-slate-700 font-semibold' : 'text-slate-400'}>
                      {isSelected ? 'INSPECTING' : isPassed ? 'COMMITTED' : 'PENDING'}
                    </span>
                  </div>
                </div>

                {/* Bottom Active Indicator Bar */}
                <div className={`h-1.5 w-full rounded-full transition-all ${
                  isSelected ? 'bg-teal-600 dark:bg-teal-400' : isPassed ? 'bg-slate-400 dark:bg-slate-600' : 'bg-slate-200 dark:bg-slate-800'
                }`} />
              </button>
            );
          })}
        </div>
      </div>

      {/* DYNAMIC STAGE INSPECTOR (OFFICIAL STATE TRANSITION DOCKET) */}
      <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-[#070e1c] border-2 border-slate-300 dark:border-slate-800 shadow-premium space-y-6">
        {/* Top Docket Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b-2 border-dashed border-slate-300 dark:border-slate-800 gap-4">
          <div className="flex items-center gap-3.5">
            <div className="p-3.5 rounded-xl bg-teal-100 text-teal-900 border-2 border-teal-300 dark:bg-teal-950 dark:text-teal-300 dark:border-teal-500/40 shadow-xs">
              <Icon className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-teal-800 dark:text-teal-400 font-bold block">
                DOCKET CC-STAGE-{current.num} &bull; STATE TRANSITION INVARIANT
              </span>
              <h3 className="text-xl sm:text-2xl font-mono font-black text-slate-950 dark:text-white">
                STAGE {current.num}: {current.name}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 rounded-lg bg-emerald-50 border-2 border-emerald-300 text-emerald-900 font-mono text-xs font-bold flex items-center gap-1.5 dark:bg-emerald-950 dark:border-emerald-500/40 dark:text-emerald-300 shadow-2xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
              <span>DETERMINISTIC INVARIANT ENFORCED</span>
            </span>
          </div>
        </div>

        {/* 4 Invariant Dossier Cards: Purpose, Input, Output, Security Property */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* 01 PURPOSE */}
          <div className="rounded-xl border-2 border-slate-300 dark:border-slate-800 overflow-hidden shadow-xs">
            <div className="bg-slate-100 dark:bg-slate-900 px-3.5 py-2 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-800 dark:text-slate-300 font-bold">
                01 &bull; OPERATIONAL PURPOSE
              </span>
              <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-white text-slate-700 border border-slate-300 dark:bg-slate-950 dark:text-slate-400 dark:border-slate-800 font-semibold">
                EXECUTION
              </span>
            </div>
            <div className="p-4 bg-white dark:bg-slate-950">
              <p className="text-xs sm:text-sm text-slate-900 dark:text-slate-200 font-sans leading-relaxed font-medium">
                {current.purpose}
              </p>
            </div>
          </div>

          {/* 02 SECURITY INVARIANT */}
          <div className="rounded-xl border-2 border-emerald-300 dark:border-emerald-500/40 overflow-hidden shadow-xs">
            <div className="bg-emerald-50 dark:bg-emerald-950/60 px-3.5 py-2 border-b border-emerald-200 dark:border-emerald-500/40 flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-900 dark:text-emerald-300 font-bold">
                02 &bull; SECURITY INVARIANT &amp; GUARANTEE
              </span>
              <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-emerald-200 text-emerald-900 dark:bg-emerald-900 dark:text-emerald-200 font-bold">
                NON-MUTABLE
              </span>
            </div>
            <div className="p-4 bg-white dark:bg-slate-950 border-l-4 border-l-emerald-600">
              <p className="text-xs sm:text-sm text-slate-950 dark:text-slate-200 font-sans leading-relaxed font-semibold">
                {current.securityProperty}
              </p>
            </div>
          </div>

          {/* 03 INPUT */}
          <div className="rounded-xl border-2 border-slate-300 dark:border-slate-800 overflow-hidden shadow-xs">
            <div className="bg-slate-100 dark:bg-slate-900 px-3.5 py-2 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-800 dark:text-slate-300 font-bold">
                03 &bull; INCOMING EVIDENCE INPUT
              </span>
              <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-white text-slate-700 border border-slate-300 dark:bg-slate-950 dark:text-slate-400 dark:border-slate-800 font-semibold">
                PAYLOAD
              </span>
            </div>
            <div className="p-4 bg-slate-50/80 dark:bg-slate-950/80">
              <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-300 font-mono leading-relaxed font-medium">
                {current.input}
              </p>
            </div>
          </div>

          {/* 04 OUTPUT */}
          <div className="rounded-xl border-2 border-blue-300 dark:border-cyan-500/40 overflow-hidden shadow-xs">
            <div className="bg-blue-50 dark:bg-cyan-950/60 px-3.5 py-2 border-b border-blue-200 dark:border-cyan-500/40 flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-wider text-blue-900 dark:text-cyan-300 font-bold">
                04 &bull; EMITTED OUTPUT &amp; ON-CHAIN PROOF
              </span>
              <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-blue-200 text-blue-900 dark:bg-cyan-900 dark:text-cyan-200 font-bold">
                BLOCK LOG
              </span>
            </div>
            <div className="p-4 bg-white dark:bg-slate-950 border-l-4 border-l-blue-600">
              <p className="text-xs sm:text-sm text-blue-950 dark:text-cyan-200 font-mono leading-relaxed font-semibold">
                {current.output}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
