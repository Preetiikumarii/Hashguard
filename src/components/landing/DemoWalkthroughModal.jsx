import React, { useState, useEffect } from 'react';
import { 
  X, 
  Play, 
  Pause, 
  ArrowRight, 
  Zap, 
  Lock, 
  AlertTriangle,
  Building2,
  Users
} from 'lucide-react';

export const DemoWalkthroughModal = ({ isOpen, onClose, onLaunchSandbox }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [modalVideoPlaying, setModalVideoPlaying] = useState(false);

  const steps = [
    {
      id: 'step1',
      title: '01. Cryptographic Exhibit Ingestion',
      subtitle: 'Deterministic Client-Side Hashing & Smart Contract Anchoring',
      icon: Lock,
      accent: 'cyan',
      description: 'Upon physical seizure of specimen_lockbit_dump.dd (4.2 GB disk image), WebCrypto computes its SHA-256 digest in client browser memory. The 32-byte digest is anchored to the Anvil EVM smart contract, establishing an immutable cryptographic root of custody.',
      details: [
        { label: 'Specimen', value: 'specimen_lockbit_dump.dd (Disk Image)' },
        { label: 'SHA-256 Root', value: '8f3a91bc4e8d2f6a7c1e2d9fe4b6c3a77d210984...' },
        { label: 'Storage Enclave', value: 'AES-256-GCM Air-Gapped Object Vault' },
        { label: 'Ledger State', value: 'SEALED on Block #1845201' }
      ]
    },
    {
      id: 'step2',
      title: '02. Dual-Sign Inter-Agency Custody Transfer',
      subtitle: 'mTLS Handoff with ECDSA secp256k1 Digital Signatures',
      icon: Users,
      accent: 'blue',
      description: 'Transferring evidence from CERT-Alpha (StateA) to Cyber Defense Lab (StateB) requires an authenticated mTLS session. Both agencies sign the transfer manifest using their hardware-backed ECDSA secp256k1 keys before ownership changes on-chain.',
      details: [
        { label: 'Dispatch Node', value: 'CERT-Alpha (StateA - Node 0x71C8...A18f)' },
        { label: 'Recipient Node', value: 'Cyber Defense Lab (StateB - Node 0x3F2B...C901)' },
        { label: 'Auth Protocol', value: 'mTLS Mutual TLS + EIP-712 Typed Signature' },
        { label: 'Custody Status', value: 'TRANSFERRED_CONFIRMED' }
      ]
    },
    {
      id: 'step3',
      title: '03. Real-Time 1-Bit Tamper Containment',
      subtitle: 'Off-Chain vs On-Chain Mathematical State Machine',
      icon: AlertTriangle,
      accent: 'rose',
      description: 'If an adversary or rogue insider modifies even a single bit in the 4.2 GB file (such as inverting byte 0x00FF), the recomputed SHA-256 hash immediately changes. The smart contract rejects the mismatch and halts all transfers across the network.',
      details: [
        { label: 'Original Root', value: '8f3a91bc4e8d2f6a7c1e...c5d6' },
        { label: 'Tampered Hash', value: '4c8e2d1f9b7a6c3e4d09...b2a1' },
        { label: 'Discrepancy', value: 'Byte 0x00FF Inversion Detected' },
        { label: 'System Action', value: '🚨 TAMPER DETECTED: SMART CONTRACT REVERT' }
      ]
    },
    {
      id: 'step4',
      title: '04. Judicial Courtroom Attestation',
      subtitle: 'Cryptographic Attestation Dossier (Section 65B Admissibility)',
      icon: Building2,
      accent: 'emerald',
      description: 'The National Cyber Audit Board and judicial courts verify the entire custody lineage without accessing confidential raw payloads. 1-click export generates Section 65B certified evidence dossiers with full block timestamps and cryptographic proofs.',
      details: [
        { label: 'Audit Standard', value: 'ISO/IEC 27037 & NIST SP 800-86 Informed' },
        { label: 'Zero-Knowledge', value: 'Zero Raw Payload Exposure to Auditors' },
        { label: 'Certificate Format', value: 'Cryptographic JSON Attestation + Signed PDF' },
        { label: 'Admissibility', value: 'Strict Evidentiary Provenance Guaranteed' }
      ]
    }
  ];

  // Auto-play timer
  useEffect(() => {
    if (!isOpen || !isPlaying) return;
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % steps.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [isOpen, isPlaying, steps.length]);

  if (!isOpen) return null;

  const active = steps[currentStep];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl bg-[#080f1e] border border-cyan-500/40 shadow-[0_0_60px_rgba(6,182,212,0.25)] p-6 text-white font-sans">
        {/* Glow ambient */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
              <Zap className="w-5 h-5 text-cyan-400 fill-cyan-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold font-mono text-white tracking-wide">
                  HASHGUARD ARCHITECTURAL DEMO
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-bold">
                  DEMO VIDEO & WALKTHROUGH
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                Watch full product walkthrough or explore the 4-stage lifecycle simulation
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-1.5 rounded-lg border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer text-xs font-mono flex items-center gap-1 px-2.5"
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{isPlaying ? 'Pause Steps' : 'Play Steps'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Embedded YouTube Demo Video with Custom Thumbnail */}
        <div className="mt-4 rounded-xl overflow-hidden border border-cyan-500/30 aspect-video w-full bg-slate-950 shadow-2xl group">
          {modalVideoPlaying ? (
            <iframe
              className="w-full h-full"
              src="https://www.youtube-nocookie.com/embed/jQ7otleJOcU?autoplay=1&rel=0&modestbranding=1"
              title="HashGuard - Cyber Evidence Exchange Demo Video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          ) : (
            <div
              onClick={() => setModalVideoPlaying(true)}
              className="relative w-full h-full cursor-pointer overflow-hidden flex items-center justify-center select-none"
            >
              <img
                src="/assets/video-thumbnail.jpg"
                alt="HashGuard Demonstration Video Thumbnail"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.015]"
              />
              <div className="absolute inset-0 bg-slate-950/15 group-hover:bg-transparent transition-colors duration-300" />
              <div className="absolute bottom-3 left-3 px-3 py-1.5 rounded-lg bg-slate-950/85 backdrop-blur-md border border-slate-700/80 text-xs font-mono text-slate-200 flex items-center gap-2 shadow-lg group-hover:border-cyan-500/50 transition-colors">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                <span>Click anywhere to play demo</span>
              </div>
            </div>
          )}
        </div>

        {/* Step Progress Indicators */}
        <div className="mt-5 grid grid-cols-4 gap-2">
          {steps.map((s, idx) => (
            <button
              key={s.id}
              onClick={() => {
                setCurrentStep(idx);
                setIsPlaying(false);
              }}
              className={`p-2 rounded-lg border text-left transition-all cursor-pointer ${
                idx === currentStep
                  ? 'bg-cyan-500/15 border-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.2)]'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 text-slate-400'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`text-[10px] font-mono font-bold ${idx === currentStep ? 'text-cyan-400' : 'text-slate-500'}`}>
                  STAGE 0{idx + 1}
                </span>
                {idx === currentStep && isPlaying && (
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                )}
              </div>
              <div className={`text-xs font-bold font-mono truncate mt-0.5 ${idx === currentStep ? 'text-white' : 'text-slate-300'}`}>
                {s.title.split('. ')[1]}
              </div>
            </button>
          ))}
        </div>

        {/* Active Stage Detail Showcase */}
        <div className="mt-5 p-5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <span className="text-[11px] font-mono text-cyan-400 font-bold uppercase tracking-wider">
                {active.subtitle}
              </span>
              <h4 className="text-lg font-bold text-white mt-1">
                {active.title}
              </h4>
            </div>
            <div className={`p-2.5 rounded-xl border ${
              active.accent === 'rose'
                ? 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                : active.accent === 'emerald'
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                : 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400'
            }`}>
              <active.icon className="w-6 h-6" />
            </div>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed font-sans">
            {active.description}
          </p>

          {/* Telemetry Table */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 font-mono text-xs pt-2 border-t border-slate-800">
            {active.details.map((d, i) => (
              <div key={i} className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800 flex flex-col justify-between">
                <span className="text-[10px] text-slate-500 uppercase">{d.label}</span>
                <span className={`font-bold mt-1 text-[11px] break-all ${
                  d.value.includes('🚨') ? 'text-rose-400 animate-pulse' :
                  d.value.includes('SEALED') || d.value.includes('TRANSFERRED') ? 'text-emerald-400' :
                  d.value.includes('8f3a91') ? 'text-cyan-300' : 'text-slate-200'
                }`}>
                  {d.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentStep((prev) => (prev > 0 ? prev - 1 : steps.length - 1))}
              className="px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-900 text-slate-300 hover:text-white text-xs font-mono cursor-pointer transition-colors"
            >
              ← Previous
            </button>
            <button
              onClick={() => setCurrentStep((prev) => (prev + 1) % steps.length)}
              className="px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-900 text-slate-300 hover:text-white text-xs font-mono cursor-pointer transition-colors"
            >
              Next Step →
            </button>
          </div>

          <button
            onClick={() => {
              onClose();
              onLaunchSandbox('ORG_B', '/dashboard', true);
            }}
            className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-mono font-bold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer"
          >
            <Zap className="w-3.5 h-3.5 fill-slate-950" />
            <span>Launch Evaluation Sandbox Now</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
