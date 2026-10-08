import React, { useState } from 'react';
import {
  Building2,
  Layers,
  Database,
  Blocks,
  Shield,
  Lock,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';

export const TrustBoundariesSection = () => {
  const [selectedZone, setSelectedZone] = useState('zone1');

  const zones = {
    zone1: {
      num: 'ZONE 1',
      title: 'USER & ORGANIZATION BOUNDARY',
      actor: 'CERT-Alpha, Cyber Defense Lab, Police LEA, Court Registry, Auditor',
      color: 'blue',
      whoTrustsWhom: 'Agencies do NOT trust each other’s internal databases. Trust is rooted in local secp256k1 private keys and W3C DIDs.',
      whatIsProtected: 'Private keys, investigator workstations, and organizational enclave credentials.',
      whereDataExists: 'In agency endpoints and local acquisition forensic hardware.',
      whereProofExists: 'Local W3C DID document and cryptographic signature manifest.'
    },
    zone2: {
      num: 'ZONE 2',
      title: 'HASHGUARD APPLICATION ENCLAVE',
      actor: 'React 19 Client + FastAPI (8000) & Node.js Express (8001) Microservices',
      color: 'cyan',
      whoTrustsWhom: 'Application validates caller JWT/DID before execution; enforces RBAC permissions across all 6 roles.',
      whatIsProtected: 'Forensic operator workflows, API endpoints, upload triage, and JSON-RPC dispatch channels.',
      whereDataExists: 'Transient memory and secure buffer queues during acquisition.',
      whereProofExists: 'Calculated 32-byte SHA-256 bitstream digests.'
    },
    zone3: {
      num: 'ZONE 3',
      title: 'OFF-CHAIN EVIDENCE REPOSITORY',
      actor: 'MinIO S3 Object Store + PostgreSQL 15 / Local Encrypted Vault',
      color: 'purple',
      whoTrustsWhom: 'Storage layer only accepts authenticated, encrypted streams via presigned URLs and internal service credentials.',
      whatIsProtected: 'Heavy multi-gigabyte disk images (.E01), memory dumps (.raw), PCAPs, and case notes.',
      whereDataExists: 'AES-256-GCM encrypted object buckets and relational metadata tables.',
      whereProofExists: 'Separated completely from on-chain state; only hash references leave this enclave.'
    },
    zone4: {
      num: 'ZONE 4',
      title: 'BLOCKCHAIN TRUST LAYER',
      actor: 'Ethereum Sepolia EVM Consensus + HASHGUARD.sol Smart Contract',
      color: 'amber',
      whoTrustsWhom: 'Zero human trust required. EVM consensus guarantees tamper-evident state transitions and immutable event logs.',
      whatIsProtected: 'Tokenized exhibit ownership (ERC-721), AccessControl state, and irreversible custody records.',
      whereDataExists: 'Zero raw evidence data stored on-chain.',
      whereProofExists: 'Immutable 32-byte contentHash, token nonces, and block transaction receipts.'
    }
  };

  const current = zones[selectedZone];

  return (
    <section id="trust-boundaries" className="relative py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-800/80">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-[11px] font-mono font-bold text-cyan-400 uppercase tracking-widest">
              ISOLATION ARCHITECTURE
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-mono font-black text-white">
            FOUR CONCENTRIC TRUST BOUNDARIES
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 font-sans mt-1 max-w-3xl">
            A nested zero-trust perimeter isolating external organizations, application microservices, confidential evidence payloads, and decentralized consensus.
          </p>
        </div>
        <div className="text-xs font-mono text-cyan-400">
          SELECT A ZONE TO INSPECT ITS TRUST INVARIANTS
        </div>
      </div>

      {/* Concentric Nested Visual Presentation */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left: Nested visual zones */}
        <div className="lg:col-span-7">
          <div className="relative p-6 rounded-3xl bg-[#02050e] border border-blue-500/30">
            {/* Zone 1 Outer Ring */}
            <div 
              onClick={() => setSelectedZone('zone1')}
              className={`p-5 rounded-2xl border transition-all cursor-pointer ${
                selectedZone === 'zone1'
                  ? 'bg-blue-950/40 border-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.3)]'
                  : 'bg-slate-950/60 border-slate-800 hover:border-blue-500/50'
              }`}
            >
              <div className="flex items-center justify-between font-mono text-xs mb-3">
                <span className="text-blue-400 font-bold uppercase tracking-wider">
                  ZONE 1: USER / ORGANIZATION PERIMETER
                </span>
                <span className="text-[10px] text-slate-400">W3C DIDs & Local Keys</span>
              </div>

              {/* Zone 2 Ring */}
              <div 
                onClick={(e) => { e.stopPropagation(); setSelectedZone('zone2'); }}
                className={`p-5 rounded-xl border transition-all cursor-pointer ${
                  selectedZone === 'zone2'
                    ? 'bg-cyan-950/40 border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.3)]'
                    : 'bg-slate-900/60 border-slate-800 hover:border-cyan-500/50'
                }`}
              >
                <div className="flex items-center justify-between font-mono text-xs mb-3">
                  <span className="text-cyan-400 font-bold uppercase tracking-wider">
                    ZONE 2: HASHGUARD APPLICATION ENCLAVE
                  </span>
                  <span className="text-[10px] text-slate-400">FastAPI & Node.js</span>
                </div>

                {/* Split inner cores: Zone 3 and Zone 4 */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  {/* Zone 3 */}
                  <div
                    onClick={(e) => { e.stopPropagation(); setSelectedZone('zone3'); }}
                    className={`p-4 rounded-lg border transition-all cursor-pointer ${
                      selectedZone === 'zone3'
                        ? 'bg-purple-950/50 border-purple-400 shadow-[0_0_20px_rgba(168,85,247,0.3)]'
                        : 'bg-slate-950/80 border-slate-800 hover:border-purple-500/50'
                    }`}
                  >
                    <span className="text-[10px] font-mono font-bold text-purple-400 uppercase tracking-wider block">
                      ZONE 3: OFF-CHAIN VAULT
                    </span>
                    <span className="font-mono text-xs text-white font-bold block mt-1">
                      MinIO S3 / AES-GCM
                    </span>
                    <span className="text-[10px] font-mono text-slate-400 block mt-1">
                      Confidential Evidence
                    </span>
                  </div>

                  {/* Zone 4 */}
                  <div
                    onClick={(e) => { e.stopPropagation(); setSelectedZone('zone4'); }}
                    className={`p-4 rounded-lg border transition-all cursor-pointer ${
                      selectedZone === 'zone4'
                        ? 'bg-amber-950/50 border-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.3)]'
                        : 'bg-slate-950/80 border-slate-800 hover:border-amber-500/50'
                    }`}
                  >
                    <span className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-wider block">
                      ZONE 4: TRUST LEDGER
                    </span>
                    <span className="font-mono text-xs text-white font-bold block mt-1">
                      Ethereum Sepolia
                    </span>
                    <span className="text-[10px] font-mono text-slate-400 block mt-1">
                      State & Proof Anchoring
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Invariant Explainer Card */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-[#030712]/95 border border-slate-800 shadow-[0_0_30px_rgba(6,182,212,0.06)] font-mono text-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
            <span className="text-cyan-400 font-bold uppercase text-[11px]">
              {current.num}: {current.title}
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300">
              ACTIVE INSPECTION
            </span>
          </div>

          <div className="space-y-4">
            <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800">
              <span className="text-[10px] text-cyan-400 uppercase font-bold block mb-1">
                WHO TRUSTS WHOM
              </span>
              <p className="text-xs text-slate-300 font-sans leading-relaxed">
                {current.whoTrustsWhom}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800">
              <span className="text-[10px] text-blue-400 uppercase font-bold block mb-1">
                WHAT IS PROTECTED
              </span>
              <p className="text-xs text-slate-300 font-sans leading-relaxed">
                {current.whatIsProtected}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800">
              <span className="text-[10px] text-purple-400 uppercase font-bold block mb-1">
                WHERE DATA EXISTS
              </span>
              <p className="text-xs text-slate-300 font-sans leading-relaxed">
                {current.whereDataExists}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800">
              <span className="text-[10px] text-amber-400 uppercase font-bold block mb-1">
                WHERE PROOF EXISTS
              </span>
              <p className="text-xs text-slate-300 font-sans leading-relaxed">
                {current.whereProofExists}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
