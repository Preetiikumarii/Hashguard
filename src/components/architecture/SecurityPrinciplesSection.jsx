import React, { useState } from 'react';
import {
  Fingerprint,
  KeyRound,
  ShieldCheck,
  History,
  Layers,
  CheckCircle2,
  ChevronRight,
  Shield
} from 'lucide-react';

export const SecurityPrinciplesSection = () => {
  const [activePrinciple, setActivePrinciple] = useState(0);

  const principles = [
    {
      num: '01',
      title: 'CRYPTOGRAPHIC INTEGRITY',
      subtitle: 'Deterministic Bitstream Sealing',
      icon: Fingerprint,
      color: 'emerald',
      rule: 'FIPS 180-4 SHA-256 standard',
      summary: 'Digital evidence is fingerprinted by deterministic SHA-256 digests. Any single-bit alteration changes the output hash entirely, producing immediate tamper detection across all audit nodes.'
    },
    {
      num: '02',
      title: 'DECENTRALIZED IDENTITY',
      subtitle: 'Self-Sovereign W3C DIDs',
      icon: KeyRound,
      color: 'cyan',
      rule: 'did:ethr + secp256k1 keys',
      summary: 'Eliminates centralized Active Directory / LDAP single points of failure. Every forensic action is signed directly by the custodian’s private key and validated against on-chain DID Documents.'
    },
    {
      num: '03',
      title: 'GRANULAR AUTHORIZATION',
      subtitle: 'Dual-Layer RBAC Enclave',
      icon: ShieldCheck,
      color: 'purple',
      rule: 'EVM AccessControl + API Matrix',
      summary: 'Permissions for the 6 RBAC roles are validated at both the API gateway and directly inside EVM smart contract execution bytecode, preventing unauthorized state modification.'
    },
    {
      num: '04',
      title: 'VERIFIABLE CUSTODY',
      subtitle: 'Dual-Authorized Handover Chain',
      icon: History,
      color: 'amber',
      rule: 'Atomic ERC-721 Transfers',
      summary: 'Every custody transfer requires sender dispatch and receiver acceptance. Custody transitions emit permanent EVM block events, satisfying statutory court admissibility rules (ISO/IEC 27037).'
    },
    {
      num: '05',
      title: 'DATA / PROOF SEPARATION',
      subtitle: 'Zero Raw Evidence On-Chain',
      icon: Layers,
      color: 'indigo',
      rule: 'Off-Chain Storage / On-Chain Trust',
      summary: 'Multi-gigabyte disk images and sensitive PII are isolated in encrypted MinIO S3 vaults off-chain. Only 32-byte cryptographic hashes and ownership tokens anchor to the public ledger.'
    },
    {
      num: '06',
      title: 'INDEPENDENT VERIFICATION',
      subtitle: 'Mathematical Truth Over Trust',
      icon: CheckCircle2,
      color: 'emerald',
      rule: '5-Point Zero-Trust Engine',
      summary: 'Any defense counsel, judicial registrar, or auditor can independently recompute bitstream hashes and verify unbroken custody without trusting police servers or administrative credentials.'
    }
  ];

  const current = principles[activePrinciple];

  return (
    <section id="security" className="relative py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-800/80">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-[11px] font-mono font-bold text-cyan-400 uppercase tracking-widest">
              SYSTEM INVARIANTS & GUARANTEES
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-mono font-black text-white">
            SIX CORE SECURITY PRINCIPLES
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 font-sans mt-1 max-w-3xl">
            Mathematical, cryptographic, and operational axioms enforced across every layer of the HashGuard platform.
          </p>
        </div>
        <div className="text-xs font-mono text-cyan-400">
          SELECT PRINCIPLE TO EXPAND
        </div>
      </div>

      {/* Compact Horizontal Grid System */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 mb-6">
        {principles.map((p, idx) => {
          const Icon = p.icon;
          const isSelected = activePrinciple === idx;

          return (
            <button
              key={p.num}
              onClick={() => setActivePrinciple(idx)}
              className={`p-3 rounded-xl border text-left font-mono transition-all cursor-pointer ${
                isSelected
                  ? 'bg-slate-900 border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.25)] -translate-y-1'
                  : 'bg-slate-950/70 border-slate-800 hover:border-slate-700 hover:bg-slate-900/60'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className={`text-[10px] font-bold ${isSelected ? 'text-cyan-400' : 'text-slate-500'}`}>
                  {p.num}
                </span>
                <Icon className={`w-4 h-4 ${isSelected ? 'text-cyan-400' : 'text-slate-400'}`} />
              </div>
              <h4 className="text-xs font-bold text-white leading-tight">
                {p.title}
              </h4>
              <span className="text-[9px] text-slate-400 block mt-1 truncate">
                {p.subtitle}
              </span>
            </button>
          );
        })}
      </div>

      {/* Expanded Interactive Detail Strip */}
      <div className="p-6 rounded-2xl bg-[#030712]/95 border border-slate-800 shadow-[0_0_30px_rgba(6,182,212,0.06)] font-mono text-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-800 gap-2 mb-4">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs px-2.5 py-1 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 font-bold">
              PRINCIPLE {current.num}: {current.title}
            </span>
            <span className="text-slate-300 font-bold">{current.subtitle}</span>
          </div>
          <span className="text-[11px] text-cyan-400 font-semibold">
            Standard: {current.rule}
          </span>
        </div>

        <p className="text-xs sm:text-sm text-slate-300 font-sans leading-relaxed">
          {current.summary}
        </p>
      </div>
    </section>
  );
};
