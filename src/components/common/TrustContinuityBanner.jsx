import React, { useState } from 'react';
import { 
  Fingerprint, 
  ShieldCheck, 
  FileBox, 
  Hash, 
  Award, 
  History, 
  ArrowLeftRight, 
  RotateCw, 
  GitFork, 
  FileSpreadsheet, 
  CheckCircle2,
  ChevronRight,
  Info
} from 'lucide-react';

export const TRUST_CONTINUITY_STAGES = [
  {
    id: 'identity',
    title: 'IDENTITY',
    subtitle: 'W3C DID Registry',
    description: 'Establishes WHO is acting via public-key cryptography and verifiable DID credentials.',
    icon: Fingerprint,
    color: 'text-blue-400 border-blue-500/30 bg-blue-500/10'
  },
  {
    id: 'authorization',
    title: 'AUTHORIZATION',
    subtitle: 'Adaptive Access & RBAC',
    description: 'Establishes WHAT actions they may perform based on asset sensitivity and time-bound leases.',
    icon: ShieldCheck,
    color: 'text-purple-400 border-purple-500/30 bg-purple-500/10'
  },
  {
    id: 'registration',
    title: 'ASSET REGISTRATION',
    subtitle: 'Off-Chain Ingestion',
    description: 'Sensitive payload ingested into off-chain storage; raw data never bloats the blockchain.',
    icon: FileBox,
    color: 'text-indigo-400 border-indigo-500/30 bg-indigo-500/10'
  },
  {
    id: 'seal',
    title: 'CRYPTOGRAPHIC SEAL',
    subtitle: 'SHA-256 + ECDSA Manifest',
    description: 'Deterministic 256-bit content digest computed and anchored immutably to the ledger.',
    icon: Hash,
    color: 'text-cyan-400 border-cyan-500/30 bg-cyan-500/10'
  },
  {
    id: 'ownership',
    title: 'OWNERSHIP',
    subtitle: 'ERC-721 Digital Token',
    description: 'Unique NFT token minted to represent verifiable legal ownership of the asset record.',
    icon: Award,
    color: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10'
  },
  {
    id: 'custody',
    title: 'CUSTODY',
    subtitle: 'Physical / Enclave Holding',
    description: 'Identifies current custodian agency holding custody without mutating legal ownership.',
    icon: History,
    color: 'text-amber-400 border-amber-500/30 bg-amber-500/10'
  },
  {
    id: 'transfer',
    title: 'TRANSFER',
    subtitle: 'Application-Level Quorum Gate',
    description: 'Monotonic custody handoff. Critical assets require Application-Level Quorum Gate (2-of-3) consortium approval.',
    icon: ArrowLeftRight,
    color: 'text-orange-400 border-orange-500/30 bg-orange-500/10'
  },
  {
    id: 're-verification',
    title: 'RE-VERIFICATION',
    subtitle: 'Dynamic Integrity Check',
    description: 'On receipt or analysis, off-chain bytes are re-hashed; any single bit alteration fails.',
    icon: RotateCw,
    color: 'text-teal-400 border-teal-500/30 bg-teal-500/10'
  },
  {
    id: 'provenance',
    title: 'PROVENANCE',
    subtitle: 'Lineage Graph (DAG)',
    description: 'Tracks derived artifacts (memory extracts, sandbox reports) linked to verified root parents.',
    icon: GitFork,
    color: 'text-violet-400 border-violet-500/30 bg-violet-500/10'
  },
  {
    id: 'audit',
    title: 'AUDIT',
    subtitle: 'Tamper-Evident Audit Trail',
    description: 'Complete chronological history of transitions preserved in tamper-evident ledger with cryptographic block receipts.',
    icon: FileSpreadsheet,
    color: 'text-sky-400 border-sky-500/30 bg-sky-500/10'
  },
  {
    id: 'independent-verification',
    title: 'INDEPENDENT VERIFICATION',
    subtitle: 'Zero-Trust Audit Admissibility',
    description: 'External auditors independently verify the entire chain of trust without inspecting raw sensitive bytes.',
    icon: CheckCircle2,
    color: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10'
  }
];

export const TrustContinuityBanner = ({ activeStage = null, compact = false }) => {
  const [selectedStage, setSelectedStage] = useState(activeStage ? TRUST_CONTINUITY_STAGES.find(s => s.id === activeStage) : TRUST_CONTINUITY_STAGES[0]);

  return (
    <div className="rounded-xl bg-ce-surface border border-ce-border p-5 shadow-sm space-y-4">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-ce-border">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-ce-text-primary">
              Trust Continuity Model
            </h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-semibold">
              Asset Lifecycle Trust Engine
            </span>
          </div>
          <p className="text-xs text-ce-text-muted mt-1 font-sans">
            "Don't just trust the digital asset. Verify it." &bull; Trust is preserved across every lifecycle transition.
          </p>
        </div>
        <div className="text-right shrink-0">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-ce-text-muted px-2.5 py-1 rounded bg-ce-surface-subtle border border-ce-border block">
            RAW DATA STAYS OFF-CHAIN &bull; TRUST ANCHORED ON-CHAIN
          </span>
        </div>
      </div>

      {/* Pipeline Chevron Progression */}
      <div className="overflow-x-auto pb-2 scrollbar-thin">
        <div className="flex items-center gap-1.5 min-w-[980px]">
          {TRUST_CONTINUITY_STAGES.map((stage, idx) => {
            const Icon = stage.icon;
            const isSelected = selectedStage?.id === stage.id;
            return (
              <React.Fragment key={stage.id}>
                <button
                  onClick={() => setSelectedStage(stage)}
                  className={`flex-1 min-w-[90px] p-2.5 rounded-lg border text-left transition-all cursor-pointer relative group ${
                    isSelected
                      ? `${stage.color} ring-1 ring-cyan-400/50 shadow-sm`
                      : 'bg-ce-bg border-ce-border hover:border-ce-brand/40 text-ce-text-secondary hover:text-ce-text-primary'
                  }`}
                  title={`${stage.title}: ${stage.subtitle}`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[9px] font-mono font-bold opacity-60">
                      0{idx + 1}
                    </span>
                    <Icon className={`w-3.5 h-3.5 ${isSelected ? '' : 'text-ce-text-muted group-hover:text-cyan-400'}`} />
                  </div>
                  <div className="text-[10px] font-mono font-bold truncate leading-tight">
                    {stage.title}
                  </div>
                  <div className="text-[8px] text-ce-text-muted truncate mt-0.5">
                    {stage.subtitle}
                  </div>
                </button>

                {idx < TRUST_CONTINUITY_STAGES.length - 1 && (
                  <ChevronRight className="w-3.5 h-3.5 text-ce-text-muted/40 shrink-0" />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Selected Stage Explanation Drawer */}
      {selectedStage && !compact && (
        <div className="p-3.5 rounded-lg bg-ce-surface-subtle border border-ce-border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-start gap-3">
            <div className={`p-2 rounded-md border shrink-0 ${selectedStage.color}`}>
              <selectedStage.icon className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-ce-text-primary uppercase">
                  {selectedStage.title} &mdash; {selectedStage.subtitle}
                </span>
              </div>
              <p className="text-xs text-ce-text-secondary mt-1 font-sans leading-relaxed max-w-3xl">
                {selectedStage.description}
              </p>
            </div>
          </div>
          <div className="text-[10px] font-mono text-ce-text-muted sm:text-right shrink-0">
            <span className="block font-semibold text-cyan-400">CRYPTOGRAPHIC INVARIANT</span>
            <span className="text-[9px]">Monotonic &bull; Auditable &bull; Verifiable</span>
          </div>
        </div>
      )}
    </div>
  );
};
