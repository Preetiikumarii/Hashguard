import React from 'react';
import {
  Code,
  Server,
  KeyRound,
  Fingerprint,
  Database,
  Blocks,
  CheckCircle2
} from 'lucide-react';

export const TechStackSection = () => {
  const specs = [
    {
      category: 'FRONTEND',
      icon: Code,
      color: 'cyan',
      items: [
        { name: 'React 19.2.8', role: 'Component core & concurrent UI state rendering' },
        { name: 'Vite 8.2.1', role: 'Next-generation ES module bundler & lightning HMR' },
        { name: 'Tailwind CSS 3.4.17', role: 'Forensic SOC dark/light design token architecture' },
        { name: '@xyflow/react 12.11.3', role: 'Interactive node-edge Directed Acyclic Graph (Lineage DAG)' },
        { name: 'Ethers.js v6.17.0', role: 'EVM JSON-RPC provider, wallet signer, contract abstraction' }
      ]
    },
    {
      category: 'BACKEND',
      icon: Server,
      color: 'blue',
      items: [
        { name: 'Python FastAPI', role: 'Asynchronous ASGI microservice core (Port 8000) with Pydantic v2' },
        { name: 'Node.js Express', role: 'Lightweight upload triage & document microservice (Port 8001)' }
      ]
    },
    {
      category: 'IDENTITY',
      icon: KeyRound,
      color: 'purple',
      items: [
        { name: 'W3C DID v1.0 (did:ethr)', role: 'Self-Sovereign Decentralized Identifiers for agencies & operators' },
        { name: 'secp256k1 Keypairs', role: 'Cryptographic ECDSA key derivation and handover signatures' }
      ]
    },
    {
      category: 'CRYPTO',
      icon: Fingerprint,
      color: 'emerald',
      items: [
        { name: 'SHA-256 (FIPS 180-4)', role: 'Deterministic, irreversible 32-byte bitstream integrity fingerprint' },
        { name: 'AES-256-GCM', role: 'Authenticated symmetric payload encryption for off-chain repository' }
      ]
    },
    {
      category: 'STORAGE',
      icon: Database,
      color: 'indigo',
      items: [
        { name: 'MinIO S3 Object Store', role: 'Scalable S3-compatible encrypted binary vault for heavy evidence files' },
        { name: 'PostgreSQL 15 / JSON Store', role: 'Relational metadata persistence & operational audit ledger (`db.json`)' }
      ]
    },
    {
      category: 'BLOCKCHAIN',
      icon: Blocks,
      color: 'amber',
      items: [
        { name: 'Ethereum Sepolia (Chain ID 11155111)', role: 'Public EVM testnet consensus anchor (Current Prototype)' },
        { name: 'Solidity ^0.8.20 (HASHGUARD.sol)', role: 'Smart contract state machine for custody, DIDs, and retention' },
        { name: 'OpenZeppelin ERC-721', role: 'Standardized non-fungible digital evidence exhibit tokenization' },
        { name: 'OpenZeppelin AccessControl', role: 'Bytecode-level role-based authorization security modifiers' }
      ]
    }
  ];

  return (
    <section id="tech-stack" className="relative py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-800/80">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-[11px] font-mono font-bold text-cyan-400 uppercase tracking-widest">
              ENGINEERING SPECIFICATION
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-mono font-black text-white">
            VERIFIED TECHNOLOGY STACK
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 font-sans mt-1 max-w-3xl">
            Technical inventory of all frameworks, libraries, protocols, and standards active across the repository.
          </p>
        </div>
      </div>

      {/* Grouped Categories Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 font-mono text-xs">
        {specs.map((group, idx) => {
          const Icon = group.icon;
          return (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-[#030712]/95 border border-slate-800/90 shadow-[0_0_20px_rgba(0,0,0,0.5)] flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-2.5 pb-3 border-b border-slate-800/80 mb-4">
                  <div className="p-2 rounded-lg bg-slate-900 border border-slate-700 text-cyan-400">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold block">CATEGORY</span>
                    <h3 className="text-sm font-bold text-white tracking-wider">
                      {group.category}
                    </h3>
                  </div>
                </div>

                <div className="space-y-3">
                  {group.items.map((item, itemIdx) => (
                    <div key={itemIdx} className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800/80">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-slate-200 text-xs">{item.name}</span>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      </div>
                      <p className="text-[11px] text-slate-400 font-sans leading-relaxed">
                        {item.role}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
