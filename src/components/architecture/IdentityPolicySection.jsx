import React, { useState } from 'react';
import {
  User,
  KeyRound,
  Building2,
  Shield,
  CheckCircle2,
  XCircle,
  ArrowRight,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';

export const IdentityPolicySection = () => {
  const [selectedExample, setSelectedExample] = useState(0);

  const examples = [
    {
      actor: 'Detective Sharma',
      roleTitle: 'Investigator',
      didPreview: 'did:ethr:0x90F7...b906',
      fullDid: 'did:ethr:0x90F79bf6EB2c4f870365E102c77465A726a4b906',
      org: 'ORG_D (Cyber Crime Police LEA)',
      action: 'Register FIR Exhibit & Seize Hardware',
      status: 'AUTHORIZED',
      allowed: true,
      reason: 'Role INVESTIGATOR in ORG_D possesses canCollectEvidence & canSealEvidence permissions.'
    },
    {
      actor: 'Dr. Sarah Lin',
      roleTitle: 'Forensic Analyst',
      didPreview: 'did:ethr:0x7099...79C8',
      fullDid: 'did:ethr:0x70997970C51812dc3A010C7d01b50e0d17dc79C8',
      org: 'ORG_B (Cyber Defense Lab)',
      action: 'Air-Gapped Sandbox Detonation & YARA Derivation',
      status: 'AUTHORIZED',
      allowed: true,
      reason: 'Role FORENSIC_ANALYST in ORG_B possesses canGenerateHash & analyzeSandbox permissions.'
    },
    {
      actor: 'Officer K. Verma',
      roleTitle: 'First Responder',
      didPreview: 'did:ethr:0xf39F...2266',
      fullDid: 'did:ethr:0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
      org: 'ORG_A (CERT-Alpha)',
      action: 'Delete Sealed Evidence Exhibit',
      status: 'DENIED',
      allowed: false,
      reason: 'RBAC Security Invariant: Only unpreserved exhibits under administrative policy can be pruned. Deletion is denied.'
    },
    {
      actor: 'Court Registrar Jain',
      roleTitle: 'Evidence Custodian',
      didPreview: 'did:ethr:0x3C44...93BC',
      fullDid: 'did:ethr:0x3C44CdDd6a900fa2b585dd299e03d12FA4293BC',
      org: 'ORG_C (Judicial Court Registry)',
      action: 'Apply Section 65B Statutory Legal Hold Order',
      status: 'AUTHORIZED',
      allowed: true,
      reason: 'Role EVIDENCE_CUSTODIAN in ORG_C holds statutory legal preservation order authority.'
    }
  ];

  const current = examples[selectedExample];

  return (
    <section className="relative py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-800/80">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-[11px] font-mono font-bold text-cyan-400 uppercase tracking-widest">
              SELF-SOVEREIGN IDENTITY & ACCESS CONTROL
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-mono font-black text-white">
            DECENTRALIZED IDENTITY & POLICY ENFORCEMENT
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 font-sans mt-1 max-w-3xl">
            Strict separation of Actor Identity (W3C DID), Organizational Enclave, and RBAC Role. Every operation evaluates cryptographic identity before smart contract execution.
          </p>
        </div>
      </div>

      {/* Identity Node Pipeline Card */}
      <div className="p-6 rounded-2xl bg-[#030712]/90 border border-slate-800 shadow-[0_0_30px_rgba(6,182,212,0.06)]">
        {/* Selector Tabs */}
        <div className="flex flex-wrap items-center gap-2 pb-5 border-b border-slate-800/80 font-mono text-xs">
          <span className="text-slate-400 mr-2 text-[11px]">SELECT SCENARIO:</span>
          {examples.map((ex, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedExample(idx)}
              className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all cursor-pointer ${
                selectedExample === idx
                  ? 'bg-cyan-500/15 border-cyan-400 text-cyan-300'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              {ex.roleTitle} ({ex.allowed ? 'Authorized' : 'Denied'})
            </button>
          ))}
        </div>

        {/* The Visual Identity Chain */}
        <div className="py-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3 items-center">
            {/* 1. ACTOR */}
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
              <div className="flex items-center gap-2 text-slate-400 font-mono text-[10px] uppercase mb-1">
                <User className="w-3.5 h-3.5 text-blue-400" />
                <span>01. ACTOR</span>
              </div>
              <h4 className="font-mono text-sm font-bold text-white truncate">{current.actor}</h4>
              <span className="font-mono text-[10px] text-blue-400 block mt-0.5">{current.roleTitle}</span>
            </div>

            {/* 2. DID */}
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
              <div className="flex items-center gap-2 text-slate-400 font-mono text-[10px] uppercase mb-1">
                <KeyRound className="w-3.5 h-3.5 text-cyan-400" />
                <span>02. W3C DID</span>
              </div>
              <h4 className="font-mono text-xs font-bold text-cyan-300 truncate" title={current.fullDid}>
                {current.didPreview}
              </h4>
              <span className="font-mono text-[10px] text-slate-400 block mt-0.5">secp256k1 Keypair</span>
            </div>

            {/* 3. ORGANIZATION */}
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
              <div className="flex items-center gap-2 text-slate-400 font-mono text-[10px] uppercase mb-1">
                <Building2 className="w-3.5 h-3.5 text-purple-400" />
                <span>03. ORGANIZATION</span>
              </div>
              <h4 className="font-mono text-xs font-bold text-slate-200 truncate">{current.org}</h4>
              <span className="font-mono text-[10px] text-purple-400 block mt-0.5">Isolated Context</span>
            </div>

            {/* 4. ACTION */}
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
              <div className="flex items-center gap-2 text-slate-400 font-mono text-[10px] uppercase mb-1">
                <Shield className="w-3.5 h-3.5 text-amber-400" />
                <span>04. TARGET ACTION</span>
              </div>
              <h4 className="font-mono text-xs font-bold text-slate-300 truncate">{current.action}</h4>
              <span className="font-mono text-[10px] text-amber-400 block mt-0.5">RBAC Policy Check</span>
            </div>

            {/* 5. DECISION */}
            <div className={`p-4 rounded-xl border ${
              current.allowed
                ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300 shadow-[0_0_20px_rgba(16,185,129,0.15)]'
                : 'bg-rose-950/40 border-rose-500/40 text-rose-300 shadow-[0_0_20px_rgba(244,63,94,0.15)]'
            }`}>
              <div className="flex items-center gap-1.5 font-mono text-[10px] uppercase mb-1">
                {current.allowed ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <XCircle className="w-3.5 h-3.5 text-rose-400" />
                )}
                <span className="font-bold">05. DECISION</span>
              </div>
              <h4 className="font-mono text-sm font-black tracking-wider uppercase">
                {current.status}
              </h4>
              <span className="font-mono text-[10px] block mt-0.5 opacity-80">
                {current.allowed ? 'EVM Exec Allowed' : 'EVM Reverted'}
              </span>
            </div>
          </div>
        </div>

        {/* Policy Decision Reason */}
        <div className="pt-4 border-t border-slate-800/80 font-mono text-xs text-slate-400 flex items-center gap-2">
          <span className="text-cyan-400 font-bold uppercase text-[10px]">POLICY EVALUATION:</span>
          <span className="text-slate-300">{current.reason}</span>
        </div>
      </div>
    </section>
  );
};
