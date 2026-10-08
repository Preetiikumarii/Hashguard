import React from 'react';
import {
  HardDrive,
  Blocks,
  Shield,
  FileCode,
  FileText,
  Lock,
  Fingerprint,
  Link,
  ShieldCheck,
  CheckCircle2,
  Database,
  KeyRound,
  History,
  Activity,
  ArrowRightLeft
} from 'lucide-react';

export const DataTrustSplitSection = () => {
  return (
    <section id="data-split" className="relative py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-ce-border dark:border-slate-800/80">
      {/* Central Statement Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-blue-600/20 bg-blue-50 text-blue-900 dark:border-cyan-500/30 dark:bg-cyan-950/40 dark:text-cyan-300 font-mono text-[11px] font-bold tracking-wider uppercase mb-3 shadow-xs">
          <Shield className="w-3.5 h-3.5 text-blue-700 dark:text-cyan-400" />
          <span>SECTION 02 &bull; DATA / TRUST SPLIT</span>
        </div>
        
        {/* Dominant Center Statement */}
        <div className="p-6 sm:p-8 rounded-2xl bg-white border border-ce-border shadow-premium dark:bg-gradient-to-r dark:from-indigo-950/40 dark:via-slate-900/90 dark:to-amber-950/40 dark:border-slate-700 dark:shadow-2xl my-4">
          <h2 className="text-2xl sm:text-4xl font-mono font-black tracking-tight text-slate-950 dark:text-white uppercase">
            RAW DATA STAYS OFF-CHAIN.
            <span className="block text-blue-700 dark:text-cyan-400 mt-1">TRUST IS ANCHORED ON-CHAIN.</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-sans mt-3 max-w-2xl mx-auto leading-relaxed">
            Storing multi-gigabyte forensic disk images directly on a blockchain is cost-prohibitive, technically impractical, and violates confidentiality statutes. HashGuard enforces strict mathematical separation between confidential binary storage and decentralized trust anchoring.
          </p>
        </div>
      </div>

      {/* Visually Dominant Two Clean Zones */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
        {/* LEFT ZONE: OFF-CHAIN CONFIDENTIAL DATA */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-premium dark:bg-gradient-to-b dark:from-indigo-950/40 dark:via-[#030614] dark:to-slate-950 dark:border-indigo-500/40 dark:shadow-[0_0_40px_rgba(99,102,241,0.12)] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-200/80 dark:border-indigo-500/20 mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-200/80 dark:bg-indigo-500/20 dark:text-indigo-400 dark:border-indigo-500/40 shadow-xs">
                  <HardDrive className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-indigo-700 dark:text-indigo-400 font-bold block">
                    ZONE 01 &bull; ISOLATED ENCLAVE
                  </span>
                  <h3 className="font-mono text-xl font-bold text-slate-950 dark:text-white leading-tight">
                    OFF-CHAIN CONFIDENTIAL DATA
                  </h3>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded bg-indigo-50 text-indigo-700 font-mono text-[10px] font-bold border border-indigo-200/80 dark:bg-indigo-500/15 dark:text-indigo-300">
                AES-256-GCM / MinIO S3
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-sans mb-6 leading-relaxed">
              Confidential, heavy digital exhibits and examiner work product isolated inside encrypted agency vaults. Zero raw bytes are ever uploaded to or stored on the public blockchain.
            </p>

            {/* List of Off-Chain Items */}
            <div className="space-y-3 font-mono text-xs">
              <div className="p-3.5 rounded-xl bg-slate-50/80 border border-slate-200/80 flex items-center justify-between hover:bg-white hover:border-indigo-400 hover:shadow-card transition-all dark:bg-slate-900/90 dark:border-slate-800">
                <span className="text-slate-900 dark:text-slate-200 font-semibold flex items-center gap-2.5">
                  <FileCode className="w-4 h-4 text-indigo-700 dark:text-indigo-400 shrink-0" />
                  <span>Raw Evidence (.E01 disk images, .dd, memory dumps)</span>
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 shrink-0 font-medium">GB / TB Scale</span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50/80 border border-slate-200/80 flex items-center justify-between hover:bg-white hover:border-indigo-400 hover:shadow-card transition-all dark:bg-slate-900/90 dark:border-slate-800">
                <span className="text-slate-900 dark:text-slate-200 font-semibold flex items-center gap-2.5">
                  <HardDrive className="w-4 h-4 text-indigo-700 dark:text-indigo-400 shrink-0" />
                  <span>Large Binary Files (Malware samples, PCAP captures)</span>
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 shrink-0 font-medium">Network Streams</span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50/80 border border-slate-200/80 flex items-center justify-between hover:bg-white hover:border-indigo-400 hover:shadow-card transition-all dark:bg-slate-900/90 dark:border-slate-800">
                <span className="text-slate-900 dark:text-slate-200 font-semibold flex items-center gap-2.5">
                  <Lock className="w-4 h-4 text-indigo-700 dark:text-indigo-400 shrink-0" />
                  <span>Sensitive Metadata (Investigator notes, PII, FIRs)</span>
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 shrink-0 font-medium">Privileged Case Data</span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50/80 border border-slate-200/80 flex items-center justify-between hover:bg-white hover:border-indigo-400 hover:shadow-card transition-all dark:bg-slate-900/90 dark:border-slate-800">
                <span className="text-slate-900 dark:text-slate-200 font-semibold flex items-center gap-2.5">
                  <FileText className="w-4 h-4 text-indigo-700 dark:text-indigo-400 shrink-0" />
                  <span>Analyst Artifacts (Decompilations, carved files, YARA)</span>
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 shrink-0 font-medium">Derived Exhibits</span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50/80 border border-slate-200/80 flex items-center justify-between hover:bg-white hover:border-indigo-400 hover:shadow-card transition-all dark:bg-slate-900/90 dark:border-slate-800">
                <span className="text-slate-900 dark:text-slate-200 font-semibold flex items-center gap-2.5">
                  <Database className="w-4 h-4 text-indigo-700 dark:text-indigo-400 shrink-0" />
                  <span>Encrypted Storage (MinIO S3, PostgreSQL 15)</span>
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 shrink-0 font-medium">At-Rest Protection</span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-200/80 dark:border-indigo-500/20 font-mono text-[11px] text-indigo-800 dark:text-indigo-300/80 flex items-center justify-between">
            <span>Confidentiality Guarantee:</span>
            <span className="font-bold text-indigo-700 dark:text-indigo-400">ZERO RAW BYTES ON-CHAIN</span>
          </div>
        </div>

        {/* RIGHT ZONE: ON-CHAIN TRUST STATE */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-premium dark:bg-gradient-to-b dark:from-amber-950/40 dark:via-[#0a0702] dark:to-slate-950 dark:border-amber-500/40 dark:shadow-[0_0_40px_rgba(245,158,11,0.12)] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-200/80 dark:border-amber-500/20 mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-amber-50 text-amber-700 border border-amber-300/80 dark:bg-amber-500/20 dark:text-amber-400 dark:border-amber-500/40 shadow-xs">
                  <Blocks className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-amber-700 dark:text-amber-400 font-bold block">
                    ZONE 02 &bull; DECENTRALIZED CONSENSUS
                  </span>
                  <h3 className="font-mono text-xl font-bold text-slate-950 dark:text-white leading-tight">
                    ON-CHAIN TRUST STATE
                  </h3>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded bg-amber-50 text-amber-700 font-mono text-[10px] font-bold border border-amber-300/80 dark:bg-amber-500/15 dark:text-amber-300">
                Ethereum Sepolia / Besu
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-sans mb-6 leading-relaxed">
              Decentralized state machine anchoring verifiable ownership, identity, custody handovers, and tamper-evident event logs. Zero human trust required.
            </p>

            {/* List of On-Chain Items */}
            <div className="space-y-3 font-mono text-xs">
              <div className="p-3.5 rounded-xl bg-slate-50/80 border border-slate-200/80 flex items-center justify-between hover:bg-white hover:border-amber-400 hover:shadow-card transition-all dark:bg-slate-900/90 dark:border-slate-800">
                <span className="text-slate-900 dark:text-slate-200 font-semibold flex items-center gap-2.5">
                  <Fingerprint className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                  <span>SHA-256 Proof / Reference (contentHash &amp; metaHash)</span>
                </span>
                <span className="text-[10px] text-amber-700 dark:text-amber-400 font-bold shrink-0">32 Bytes Root</span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50/80 border border-slate-200/80 flex items-center justify-between hover:bg-white hover:border-amber-400 hover:shadow-card transition-all dark:bg-slate-900/90 dark:border-slate-800">
                <span className="text-slate-900 dark:text-slate-200 font-semibold flex items-center gap-2.5">
                  <KeyRound className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                  <span>Identity State (W3C DID Registry &amp; Document Hashes)</span>
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 shrink-0 font-medium">did:ethr Registry</span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50/80 border border-slate-200/80 flex items-center justify-between hover:bg-white hover:border-amber-400 hover:shadow-card transition-all dark:bg-slate-900/90 dark:border-slate-800">
                <span className="text-slate-900 dark:text-slate-200 font-semibold flex items-center gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                  <span>Ownership / Token State (ERC-721 Exhibit Tokens)</span>
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 shrink-0 font-medium">assetIdToTokenId</span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50/80 border border-slate-200/80 flex items-center justify-between hover:bg-white hover:border-amber-400 hover:shadow-card transition-all dark:bg-slate-900/90 dark:border-slate-800">
                <span className="text-slate-900 dark:text-slate-200 font-semibold flex items-center gap-2.5">
                  <History className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                  <span>Custody State (Atomic transferCustody transitions)</span>
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 shrink-0 font-medium">assetCustodian</span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50/80 border border-slate-200/80 flex items-center justify-between hover:bg-white hover:border-amber-400 hover:shadow-card transition-all dark:bg-slate-900/90 dark:border-slate-800">
                <span className="text-slate-900 dark:text-slate-200 font-semibold flex items-center gap-2.5">
                  <Activity className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                  <span>Lifecycle Event Anchors (EVM Block Event Logs)</span>
                </span>
                <span className="text-[10px] text-amber-700 dark:text-amber-400 font-bold shrink-0">Immutable Logs</span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-200/80 dark:border-amber-500/20 font-mono text-[11px] text-amber-800 dark:text-amber-300/80 flex items-center justify-between">
            <span>Integrity Guarantee:</span>
            <span className="font-bold text-amber-700 dark:text-amber-400">UNFORGEABLE BLOCKCHAIN PROOF</span>
          </div>
        </div>
      </div>
    </section>
  );
};
