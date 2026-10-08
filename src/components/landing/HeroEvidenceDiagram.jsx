import React, { useState } from 'react';
import { ExternalLink } from 'lucide-react';

export const HeroEvidenceDiagram = ({ 
  onOpenOnChainProof, 
  onOpenTamperBreach,
  onLaunchSandbox 
}) => {
  const [showDocDetails, setShowDocDetails] = useState(false);

  return (
    <div className="relative w-full select-none rounded-2xl overflow-hidden bg-slate-950 border border-slate-300/80 dark:border-slate-800/80 shadow-2xl p-1 sm:p-2">
      {/* Hero illustration — borderless, blends into hero background */}
      <div className="relative w-full overflow-visible">
        {/* The diagram image with left-edge and bottom-edge fade via CSS mask */}
        <img 
          src="/assets/hero-diagram-final.png" 
          alt="Cryptographic Evidence Flow & Tamper Verification Diagram" 
          className="w-full h-auto object-contain block"
          style={{
            WebkitMaskImage:
              'linear-gradient(to right, transparent 0%, rgba(0,0,0,0.5) 5%, black 12%), ' +
              'linear-gradient(to top, transparent 0%, rgba(0,0,0,0.4) 4%, black 10%)',
            maskImage:
              'linear-gradient(to right, transparent 0%, rgba(0,0,0,0.5) 5%, black 12%), ' +
              'linear-gradient(to top, transparent 0%, rgba(0,0,0,0.4) 4%, black 10%)',
            WebkitMaskComposite: 'source-in',
            maskComposite: 'intersect',
          }}
        />

        {/* ─── Interactive Overlay Hotspots ─── */}

        {/* 1. EV-001 Document Hotspot */}
        <div 
          onClick={() => setShowDocDetails(!showDocDetails)}
          className="absolute cursor-pointer rounded-xl transition-all z-20 group/ev"
          style={{ left: '6%', top: '15%', width: '25%', height: '70%' }}
          title="Click to inspect EV-001 Exhibit Metadata"
        >
          <div className="w-full h-full rounded-xl border border-transparent hover:border-cyan-400/50 hover:bg-cyan-500/5 transition-all flex items-start justify-end p-2">
            <span className="opacity-0 group-hover/ev:opacity-100 transition-opacity bg-[#081224]/90 text-cyan-300 border border-cyan-500/40 px-1.5 py-0.5 rounded text-[9px] font-mono">
              Inspect ↗
            </span>
          </div>
        </div>

        {/* 2. Proof Recorded On-Chain Hotspot */}
        <div 
          onClick={onOpenOnChainProof}
          className="absolute cursor-pointer rounded-xl transition-all z-20 group/proof"
          style={{ left: '66%', top: '4%', width: '32%', height: '28%' }}
          title="Click to view On-Chain Ledger Proof"
        >
          <div className="w-full h-full rounded-xl border border-transparent hover:border-cyan-400/60 hover:bg-cyan-500/10 hover:shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all flex items-start justify-end p-1.5">
            <span className="opacity-0 group-hover/proof:opacity-100 transition-opacity bg-cyan-950/90 text-cyan-300 border border-cyan-500/40 px-1.5 py-0.5 rounded text-[9px] font-mono flex items-center gap-1 shadow-sm">
              <span>Proof Details</span>
              <ExternalLink className="w-2.5 h-2.5" />
            </span>
          </div>
        </div>

        {/* 3. TAMPER DETECTED Card Hotspot */}
        <div 
          onClick={onOpenTamperBreach}
          className="absolute cursor-pointer rounded-xl transition-all z-20 group/tamper"
          style={{ left: '70%', top: '51%', width: '28%', height: '36%' }}
          title="Click to inspect 1-Bit Tamper Containment Drill"
        >
          <div className="w-full h-full rounded-xl border border-transparent hover:border-rose-500/80 hover:bg-rose-500/15 hover:shadow-[0_0_25px_rgba(239,68,68,0.35)] transition-all flex items-start justify-end p-1.5">
            <span className="opacity-0 group-hover/tamper:opacity-100 transition-opacity bg-rose-950/90 text-rose-300 border border-rose-500/40 px-1.5 py-0.5 rounded text-[9px] font-mono flex items-center gap-1 shadow-sm">
              <span>Tamper Drill</span>
              <ExternalLink className="w-2.5 h-2.5" />
            </span>
          </div>
        </div>

        {/* EV-001 Quick Details Popover */}
        {showDocDetails && (
          <div className="absolute top-3 left-3 max-w-xs bg-[#091122]/95 border border-cyan-500/40 p-3 rounded-xl shadow-2xl backdrop-blur-md z-40 text-xs font-mono space-y-1.5">
            <div className="flex items-center justify-between pb-1 border-b border-slate-800">
              <span className="font-bold text-white">EXHIBIT EV-001 SPECIMEN</span>
              <button 
                onClick={() => setShowDocDetails(false)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>
            <div className="text-slate-300"><span className="text-slate-500">File:</span> specimen_lockbit_dump.dd</div>
            <div className="text-slate-300"><span className="text-slate-500">Format:</span> Raw Forensic Disk Image (.dd)</div>
            <div className="text-slate-300"><span className="text-slate-500">Size:</span> 4.2 GB (Chunked WebCrypto Hashed)</div>
            <div className="text-slate-300"><span className="text-slate-500">Vault:</span> Air-gapped AES-256-GCM Object Storage</div>
            <div className="text-emerald-400 pt-1 text-[11px]">
              <span className="text-slate-500">Integrity:</span> Anchored on Anvil EVM Block #1845201
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
