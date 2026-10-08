import React from 'react';
import {
  KeyRound,
  FileCode,
  Fingerprint,
  Lock,
  Boxes,
  ArrowLeftRight,
  ShieldCheck,
  History,
  ArrowRight
} from 'lucide-react';

export const HowHashGuardWorks = () => {
  const steps = [
    {
      num: '01',
      title: 'IDENTITY',
      icon: KeyRound,
      desc: 'An authorized custodian enters the system using a cryptographic W3C DID (did:ethr).'
    },
    {
      num: '02',
      title: 'REGISTER',
      icon: FileCode,
      desc: 'Digital evidence (disk image, PCAP, or memory dump) is ingested and stored securely in off-chain enclaves.'
    },
    {
      num: '03',
      title: 'PROVE',
      icon: Fingerprint,
      desc: 'A deterministic SHA-256 cryptographic fingerprint is generated across the raw binary bitstream.'
    },
    {
      num: '04',
      title: 'GOVERN',
      icon: Lock,
      desc: 'Access and custody privileges are strictly governed by RBAC roles and organization boundaries.'
    },
    {
      num: '05',
      title: 'ANCHOR',
      icon: Boxes,
      desc: 'The cryptographic proof is permanently anchored by minting an ERC-721 exhibit token on EVM.'
    },
    {
      num: '06',
      title: 'TRANSFER',
      icon: ArrowLeftRight,
      desc: 'Custody transitions across consortium agencies via authenticated mutual TLS and cryptographic handshakes.'
    },
    {
      num: '07',
      title: 'VERIFY',
      icon: ShieldCheck,
      desc: 'Any party independently recomputes the SHA-256 digest to verify zero-tampering against the sealed root.'
    },
    {
      num: '08',
      title: 'AUDIT',
      icon: History,
      desc: 'The resulting custody lineage and event stream remains permanently traceable and court-admissible.'
    }
  ];

  return (
    <div className="w-full bg-[#040812]/90 border border-slate-800 rounded-2xl p-4 sm:p-6 lg:p-8 backdrop-blur-xl shadow-2xl space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-widest">
              LIFECYCLE SUMMARY
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-mono font-black text-white">
            HOW HASHGUARD WORKS
          </h3>
          <p className="text-xs text-slate-400 font-sans mt-0.5">
            The complete 8-stage trust continuum from crime scene intake to court adjudication.
          </p>
        </div>
      </div>

      {/* 8 Step Flow Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          return (
            <div
              key={step.num}
              className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/90 hover:border-slate-700 transition-all flex flex-col justify-between space-y-3 group"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-cyan-400">
                    {step.num}
                  </span>
                  <div className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 group-hover:text-cyan-400 transition-colors">
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                </div>

                <h4 className="text-xs font-mono font-bold text-white tracking-wider">
                  {step.title}
                </h4>

                <p className="text-xs text-slate-300 font-sans leading-relaxed">
                  {step.desc}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-[10px] font-mono text-slate-500">
                <span>Stage {step.num}</span>
                {idx < steps.length - 1 ? (
                  <span className="text-cyan-400">↓ Next</span>
                ) : (
                  <span className="text-emerald-400 font-bold">✓ Complete</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
