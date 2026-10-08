import React from 'react';
import {
  HardDrive,
  Blocks,
  ArrowRight,
  Shield,
  FileCode,
  FileText,
  Lock,
  Hash,
  Fingerprint,
  Link,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

export const OffChainVsOnChainSection = () => {
  return (
    <section className="relative py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-800/80">
      {/* Central Visual Statement Banner */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-950/40 text-cyan-300 font-mono text-[11px] font-bold tracking-wider uppercase mb-3">
          <Shield className="w-3.5 h-3.5 text-cyan-400" />
          <span>CRYPTOGRAPHIC DATA ISOLATION PRINCIPLE</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-mono font-black text-white tracking-tight">
          RAW DATA STAYS OFF-CHAIN
          <span className="block text-cyan-400 mt-1">PROOF IS ANCHORED ON-CHAIN</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 font-sans mt-2">
          Storing multi-gigabyte forensic disk images directly on a blockchain is cost-prohibitive, technically impractical, and violates evidentiary confidentiality. HashGuard maintains complete separation between confidential binary storage and decentralized trust anchoring.
        </p>
      </div>

      {/* Split Architecture View */}
      <div className="grid grid-cols-1 lg:grid-cols-11 gap-6 items-stretch">
        {/* LEFT: OFF-CHAIN CONFIDENTIAL DATA */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-gradient-to-b from-indigo-950/30 to-slate-900/90 border border-indigo-500/30 shadow-[0_0_30px_rgba(99,102,241,0.08)] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-indigo-500/20 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                  <HardDrive className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-indigo-400 font-bold block">
                    ISOLATED REPOSITORY
                  </span>
                  <h3 className="font-mono text-lg font-bold text-white leading-tight">
                    OFF-CHAIN CONFIDENTIAL DATA
                  </h3>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 font-mono text-[10px] font-bold border border-indigo-500/30">
                AES-256-GCM / MinIO S3
              </span>
            </div>

            <p className="text-xs text-slate-300 font-sans mb-4">
              Confidential, heavy digital evidence files and examiner work product isolated inside encrypted agency vaults. Zero raw bytes are exposed to the public blockchain.
            </p>

            {/* List of Off-Chain Items */}
            <div className="space-y-2.5 font-mono text-xs">
              <div className="p-2.5 rounded-lg bg-slate-900/90 border border-slate-800 flex items-center justify-between">
                <span className="text-slate-200 font-medium flex items-center gap-2">
                  <FileCode className="w-4 h-4 text-indigo-400" />
                  <span>Raw Forensic Disk Images (.E01 / .dd)</span>
                </span>
                <span className="text-[10px] text-slate-400">Gigabyte/Terabyte Scale</span>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-900/90 border border-slate-800 flex items-center justify-between">
                <span className="text-slate-200 font-medium flex items-center gap-2">
                  <HardDrive className="w-4 h-4 text-indigo-400" />
                  <span>Volatile Memory Dumps (.raw / .vmem)</span>
                </span>
                <span className="text-[10px] text-slate-400">Process Bitstreams</span>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-900/90 border border-slate-800 flex items-center justify-between">
                <span className="text-slate-200 font-medium flex items-center gap-2">
                  <FileText className="w-4 h-4 text-indigo-400" />
                  <span>Packet Captures (.pcap / .pcapng)</span>
                </span>
                <span className="text-[10px] text-slate-400">Encrypted Network Logs</span>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-900/90 border border-slate-800 flex items-center justify-between">
                <span className="text-slate-200 font-medium flex items-center gap-2">
                  <Lock className="w-4 h-4 text-indigo-400" />
                  <span>Examiner Case Notes & Triage Findings</span>
                </span>
                <span className="text-[10px] text-slate-400">PII / Case Sensitive</span>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-900/90 border border-slate-800 flex items-center justify-between">
                <span className="text-slate-200 font-medium flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-indigo-400" />
                  <span>Encrypted Object Storage (MinIO S3 / Local)</span>
                </span>
                <span className="text-[10px] text-emerald-400">Zero Public Exposure</span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-3 border-t border-slate-800/80 text-[11px] font-mono text-slate-400 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
            <span>Guarantees Data Privacy, GDPR & CJIS Compliance</span>
          </div>
        </div>

        {/* MIDDLE: HASH / PROOF ANCHOR */}
        <div className="lg:col-span-1 flex flex-col items-center justify-center py-4">
          <div className="w-full flex lg:flex-col items-center justify-center gap-2">
            <div className="hidden lg:block w-px h-16 bg-gradient-to-b from-indigo-500 via-cyan-400 to-amber-500" />
            <div className="p-3 rounded-xl bg-slate-900 border border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.4)] text-center shrink-0">
              <Fingerprint className="w-6 h-6 text-cyan-400 mx-auto" />
              <span className="font-mono text-[9px] font-bold text-cyan-300 block mt-1 tracking-widest uppercase">
                SHA-256
              </span>
              <span className="font-mono text-[8px] text-slate-400 block mt-0.5">
                32-Byte Hash
              </span>
            </div>
            <div className="hidden lg:block w-px h-16 bg-gradient-to-b from-cyan-400 via-amber-500 to-amber-600" />
          </div>
          <span className="font-mono text-[9px] text-slate-500 text-center uppercase tracking-widest mt-2 hidden lg:block">
            Cryptographic Anchor
          </span>
        </div>

        {/* RIGHT: ON-CHAIN TRUST + STATE */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-gradient-to-b from-amber-950/30 to-slate-900/90 border border-amber-500/30 shadow-[0_0_30px_rgba(245,158,11,0.08)] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-amber-500/20 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  <Blocks className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 font-bold block">
                    PUBLIC CONSENSUS LEDGER
                  </span>
                  <h3 className="font-mono text-lg font-bold text-white leading-tight">
                    ON-CHAIN TRUST + STATE
                  </h3>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 font-mono text-[10px] font-bold border border-amber-500/30">
                Ethereum Sepolia
              </span>
            </div>

            <p className="text-xs text-slate-300 font-sans mb-4">
              Mathematical anchor providing decentralized proof of existence, immutable custodian ownership transitions, and tamper-evident event streaming.
            </p>

            {/* List of On-Chain Items */}
            <div className="space-y-2.5 font-mono text-xs">
              <div className="p-2.5 rounded-lg bg-slate-900/90 border border-slate-800 flex items-center justify-between">
                <span className="text-slate-200 font-medium flex items-center gap-2">
                  <Hash className="w-4 h-4 text-amber-400" />
                  <span>32-Byte SHA-256 Digest (contentHash)</span>
                </span>
                <span className="text-[10px] text-amber-400">Immutable Fingerprint</span>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-900/90 border border-slate-800 flex items-center justify-between">
                <span className="text-slate-200 font-medium flex items-center gap-2">
                  <Blocks className="w-4 h-4 text-amber-400" />
                  <span>ERC-721 Token ID & Exhibit Nonce</span>
                </span>
                <span className="text-[10px] text-slate-400">Asset Representation</span>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-900/90 border border-slate-800 flex items-center justify-between">
                <span className="text-slate-200 font-medium flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-amber-400" />
                  <span>Custodian DID & Owner Address</span>
                </span>
                <span className="text-[10px] text-slate-400">did:ethr Identity</span>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-900/90 border border-slate-800 flex items-center justify-between">
                <span className="text-slate-200 font-medium flex items-center gap-2">
                  <Lock className="w-4 h-4 text-amber-400" />
                  <span>EVM Role State (AccessControl)</span>
                </span>
                <span className="text-[10px] text-slate-400">Smart Contract RBAC</span>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-900/90 border border-slate-800 flex items-center justify-between">
                <span className="text-slate-200 font-medium flex items-center gap-2">
                  <Link className="w-4 h-4 text-amber-400" />
                  <span>Block Timestamps & Event Logs</span>
                </span>
                <span className="text-[10px] text-emerald-400">Zero-Trust Audit Stream</span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-3 border-t border-slate-800/80 text-[11px] font-mono text-slate-400 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            <span>Guarantees Court Admissibility (NIST SP 800-86 / ISO 27037)</span>
          </div>
        </div>
      </div>
    </section>
  );
};
