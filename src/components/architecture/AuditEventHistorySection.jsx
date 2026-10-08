import React, { useState } from 'react';
import {
  FileSpreadsheet,
  CheckCircle2,
  Clock,
  User,
  Building2,
  Blocks,
  Hash,
  ArrowRight,
  ExternalLink
} from 'lucide-react';

export const AuditEventHistorySection = () => {
  const [selectedEvent, setSelectedEvent] = useState(0);

  // Real events from the project repository audit and mock structures
  const events = [
    {
      id: 'EVT-01',
      stage: 'REGISTERED',
      type: 'EVIDENCE_INGESTED',
      timestamp: '2026-09-28 01:14:02 UTC',
      actor: 'Detective Sharma (did:ethr:0x90F7...b906)',
      organization: 'ORG_D (Cyber Crime Police LEA)',
      assetId: 'EV-2026-0891',
      blockEvent: 'N/A (Local Ingestion Buffer)',
      detail: 'Raw bitstream disk image acquired via hardware write-blocker; metadata manifest constructed.'
    },
    {
      id: 'EVT-02',
      stage: 'AUTHORIZED',
      type: 'RBAC_ACCESS_EVALUATED',
      timestamp: '2026-09-28 01:14:15 UTC',
      actor: 'AccessControl Enclave Engine',
      organization: 'Consortium Gateway',
      assetId: 'EV-2026-0891',
      blockEvent: 'RoleGranted(ROLE_COLLECTOR, 0x90F7...)',
      detail: 'Smart contract verified caller DID possesses ROLE_COLLECTOR permissions required to mint.'
    },
    {
      id: 'EVT-03',
      stage: 'MINTED',
      type: 'ASSET_NFT_MINTED',
      timestamp: '2026-09-28 01:15:30 UTC',
      actor: 'Consortium Relayer',
      organization: 'ORG_D (Cyber Crime Police LEA)',
      assetId: 'EV-2026-0891 (Token #1)',
      blockEvent: 'AssetNFTMinted(1, "EV-2026-0891", 0x90F7..., contentHash)',
      detail: 'ERC-721 token minted on Ethereum Sepolia contract binding contentHash and metadataHash.'
    },
    {
      id: 'EVT-04',
      stage: 'TRANSFERRED',
      type: 'CUSTODY_HANDOVER_DISPATCH',
      timestamp: '2026-09-28 02:40:11 UTC',
      actor: 'Dr. Sarah Lin (did:ethr:0x7099...79C8)',
      organization: 'ORG_B (Cyber Defense Lab)',
      assetId: 'EV-2026-0891',
      blockEvent: 'CustodyTransferred(1, 0x90F7..., 0x7099...)',
      detail: 'Custody transferred from Police LEA to Cyber Defense Lab following dual-signature consensus.'
    },
    {
      id: 'EVT-05',
      stage: 'VERIFIED',
      type: 'INTEGRITY_VERIFICATION_PASS',
      timestamp: '2026-09-28 02:45:22 UTC',
      actor: 'Zero-Trust Verification Engine',
      organization: 'ORG_B (Cyber Defense Lab)',
      assetId: 'EV-2026-0891',
      blockEvent: 'HashVerified(1, expectedHash, observedHash, true)',
      detail: 'Inbound verification computed SHA-256 bitstream equality: 100% bit-level preservation confirmed.'
    },
    {
      id: 'EVT-06',
      stage: 'AUDITED',
      type: 'ATTESTATION_EXPORTED',
      timestamp: '2026-09-28 03:00:00 UTC',
      actor: 'Chief Auditor (did:ethr:0x15d3...6A65)',
      organization: 'ORG_AUDIT (Audit Board)',
      assetId: 'EV-2026-0891',
      blockEvent: 'AuditAttestationGenerated(1, attestationDigest)',
      detail: 'Court Section 65B statutory certificate exported with mathematical proof of continuous chain of custody.'
    }
  ];

  const current = events[selectedEvent];

  return (
    <section id="audit" className="relative py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-800/80">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
            <span className="text-[11px] font-mono font-bold text-purple-400 uppercase tracking-widest">
              DUAL-STREAM PROOF LOG
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-mono font-black text-white">
            AUDIT TRAIL & EVENT HISTORY
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 font-sans mt-1 max-w-3xl">
            Immutable chronicle tracking every exhibit milestone. Combines relational operational logging with permanent Ethereum Sepolia block receipts.
          </p>
        </div>
      </div>

      {/* Horizontal Sequential Timeline */}
      <div className="p-6 rounded-2xl bg-[#030712]/95 border border-slate-800 shadow-[0_0_30px_rgba(168,85,247,0.06)]">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 mb-6">
          {events.map((evt, idx) => {
            const isSelected = selectedEvent === idx;
            return (
              <button
                key={evt.id}
                onClick={() => setSelectedEvent(idx)}
                className={`p-3 rounded-xl border text-left font-mono transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-purple-950/40 border-purple-400 shadow-[0_0_20px_rgba(168,85,247,0.2)] -translate-y-1'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <span className={`text-[9px] font-bold block ${isSelected ? 'text-purple-400' : 'text-slate-500'}`}>
                  0{idx + 1} • {evt.id}
                </span>
                <span className="text-xs font-bold text-white block mt-1">
                  {evt.stage}
                </span>
                <span className="text-[9px] text-slate-400 block mt-0.5 truncate">
                  {evt.type}
                </span>
              </button>
            );
          })}
        </div>

        {/* Selected Event Detail Ledger Card */}
        <div className="p-5 rounded-xl bg-slate-900/90 border border-slate-800 font-mono text-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-800 gap-2 mb-4">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/30 font-bold">
                {current.stage}
              </span>
              <span className="text-white font-bold">{current.type}</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              <span>{current.timestamp}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="p-3 rounded-lg bg-black/60 border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase block mb-1">Actor Identity</span>
              <span className="text-slate-200 font-bold break-all block">{current.actor}</span>
            </div>

            <div className="p-3 rounded-lg bg-black/60 border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase block mb-1">Organization</span>
              <span className="text-slate-200 font-bold block">{current.organization}</span>
            </div>

            <div className="p-3 rounded-lg bg-black/60 border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase block mb-1">Exhibit Target</span>
              <span className="text-cyan-300 font-bold block">{current.assetId}</span>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-black/60 border border-slate-800 mb-3">
            <span className="text-[10px] text-amber-400 uppercase block mb-1">On-Chain Block Event</span>
            <span className="text-amber-300 font-mono text-[11px] block">{current.blockEvent}</span>
          </div>

          <p className="text-xs text-slate-300 font-sans leading-relaxed">
            {current.detail}
          </p>
        </div>
      </div>
    </section>
  );
};
