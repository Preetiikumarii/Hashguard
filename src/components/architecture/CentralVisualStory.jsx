import React, { useState } from 'react';
import {
  User,
  KeyRound,
  ShieldAlert,
  FileCode,
  Fingerprint,
  HardDrive,
  Blocks,
  History,
  ShieldCheck,
  GitBranch,
  ArrowRight,
  CheckCircle2
} from 'lucide-react';

export const CentralVisualStory = () => {
  const [activeStep, setActiveStep] = useState(4); // Default on SHA-256 proof anchor

  const steps = [
    {
      num: '01',
      title: 'ACTOR',
      subtitle: 'Forensic Examiner',
      icon: User,
      color: 'blue',
      detail: 'Investigator or forensic examiner initiates intake on physical crime scene hardware or network capture.'
    },
    {
      num: '02',
      title: 'IDENTITY',
      subtitle: 'W3C DID',
      icon: KeyRound,
      color: 'cyan',
      detail: 'Actor is identified by decentralized identifier did:ethr:<address> with secp256k1 signature validation.'
    },
    {
      num: '03',
      title: 'AUTH ACTION',
      subtitle: 'RBAC Permission',
      icon: ShieldAlert,
      color: 'indigo',
      detail: 'Smart contract AccessControl and API gateway confirm the actor has permissions to register exhibits.'
    },
    {
      num: '04',
      title: 'DIGITAL ASSET',
      subtitle: 'Raw Bitstream',
      icon: FileCode,
      color: 'emerald',
      detail: 'Raw .E01 disk image, memory dump, or network PCAP binary is ingested into the local acquisition buffer.'
    },
    {
      num: '05',
      title: 'SHA-256 PROOF',
      subtitle: '32-Byte Hash',
      icon: Fingerprint,
      color: 'cyan',
      detail: 'Deterministic FIPS 180-4 cryptographic bitstream digest is calculated; metadata manifest is created.'
    },
    {
      num: '06',
      title: 'STORAGE & STATE',
      subtitle: 'Off-Chain + On-Chain',
      icon: HardDrive,
      color: 'purple',
      detail: 'Heavy binary payload is encrypted in MinIO S3 off-chain; cryptographic hash is anchored on Ethereum Sepolia.'
    },
    {
      num: '07',
      title: 'CUSTODY',
      subtitle: 'ERC-721 Token',
      icon: Blocks,
      color: 'amber',
      detail: 'Exhibit is minted as a non-fungible token; initial custodian address is immutably mapped in EVM storage.'
    },
    {
      num: '08',
      title: 'VERIFICATION',
      subtitle: 'Zero-Trust Engine',
      icon: ShieldCheck,
      color: 'emerald',
      detail: 'Independent auditor or receiving custodian recomputes hash to guarantee 100% bit-level preservation.'
    },
    {
      num: '09',
      title: 'LINEAGE & AUDIT',
      subtitle: 'DAG + Block Events',
      icon: GitBranch,
      color: 'cyan',
      detail: 'Derived forensic artifacts link to root DAG exhibit; on-chain event stream provides tamper-evident audit trail.'
    }
  ];

  return (
    <section className="relative py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-800/80">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-[11px] font-mono font-bold text-cyan-400 uppercase tracking-widest">
              END-TO-END TRUST CONTINUUM
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-mono font-black text-white">
            THE CENTRAL ARCHITECTURAL BACKBONE
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 font-sans mt-1 max-w-3xl">
            How physical cyber evidence transforms into an immutable, legally admissible, independently verifiable digital asset.
          </p>
        </div>
        <div className="text-xs font-mono text-cyan-400">
          HOVER / CLICK STAGE TO ILLUMINATE PATH
        </div>
      </div>

      {/* Horizontal Interactive Chain */}
      <div className="relative overflow-x-auto pb-4 pt-2">
        <div className="min-w-[900px]">
          {/* Connecting Line */}
          <div className="relative h-1 bg-slate-800 rounded-full mb-8 mx-6">
            <div 
              className="absolute top-0 left-0 h-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-emerald-400 rounded-full transition-all duration-500"
              style={{ width: `${((activeStep + 1) / steps.length) * 100}%` }}
            />
          </div>

          {/* Steps Grid */}
          <div className="grid grid-cols-9 gap-2">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              const isActive = activeStep === idx;
              const isPast = activeStep >= idx;

              return (
                <div
                  key={step.num}
                  onMouseEnter={() => setActiveStep(idx)}
                  onClick={() => setActiveStep(idx)}
                  className={`group relative flex flex-col items-center text-center p-2.5 rounded-xl border transition-all duration-300 cursor-pointer ${
                    isActive
                      ? 'bg-slate-900 border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.3)] -translate-y-1'
                      : isPast
                      ? 'bg-slate-900/60 border-slate-700 hover:border-slate-600'
                      : 'bg-slate-950/40 border-slate-800/80 opacity-60 hover:opacity-100'
                  }`}
                >
                  {/* Step Number Badge */}
                  <span className={`text-[9px] font-mono font-bold mb-1.5 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`}>
                    {step.num}
                  </span>

                  {/* Icon Circle */}
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-2 transition-all ${
                    isActive
                      ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-400'
                      : isPast
                      ? 'bg-slate-800 text-slate-300'
                      : 'bg-slate-900 text-slate-400'
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>

                  {/* Title & Subtitle */}
                  <span className="font-mono text-[10px] font-bold text-white tracking-wider block">
                    {step.title}
                  </span>
                  <span className="font-mono text-[9px] text-slate-400 mt-0.5 block truncate max-w-full">
                    {step.subtitle}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Active Step Explainer Strip */}
      <div className="mt-4 p-4 rounded-xl bg-slate-900/90 border border-cyan-500/30 flex items-center gap-4">
        <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 shrink-0">
          <CheckCircle2 className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-cyan-400 uppercase">
              STAGE {steps[activeStep].num}: {steps[activeStep].title} — {steps[activeStep].subtitle}
            </span>
          </div>
          <p className="text-xs text-slate-300 font-sans mt-0.5">
            {steps[activeStep].detail}
          </p>
        </div>
      </div>
    </section>
  );
};
