import React from 'react';
import { Database, Blocks, Lock } from 'lucide-react';

export const OffChainBadge = ({ className = '', compact = false }) => {
  if (compact) {
    return (
      <div className={`flex items-center gap-2 text-xs ${className}`}>
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-ce-off-chain/10 text-ce-off-chain border border-ce-off-chain/30 font-mono">
          <Database className="w-3 h-3 text-ce-off-chain" />
          <span>OFF-CHAIN DATA</span>
        </span>
        <span className="text-ce-text-muted font-mono">|</span>
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-ce-blockchain/10 text-ce-blockchain border border-ce-blockchain/30 font-mono">
          <Blocks className="w-3 h-3 text-ce-blockchain" />
          <span>ON-CHAIN AUDIT</span>
        </span>
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 gap-3 p-4 rounded-md bg-ce-surface border border-ce-border ${className}`}>
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-md bg-ce-off-chain/10 border border-ce-off-chain/20 text-ce-off-chain shrink-0">
          <Lock className="w-4 h-4" />
        </div>
        <div>
          <div className="text-[10px] uppercase tracking-wider font-mono text-ce-off-chain font-semibold">
            Actual Evidence Storage
          </div>
          <div className="text-sm font-medium text-ce-text-primary flex items-center gap-2 mt-0.5">
            <span>OFF-CHAIN</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-ce-success/10 text-ce-success border border-ce-success/20 font-mono tracking-widest font-bold">
              SECURED
            </span>
          </div>
          <p className="text-xs text-ce-text-muted mt-1">
            Raw payload isolated in encrypted off-chain storage enclave. Zero raw forensic data on-chain.
          </p>
        </div>
      </div>

      <div className="flex items-start gap-3">
        <div className="p-2 rounded-md bg-ce-blockchain/10 border border-ce-blockchain/20 text-ce-blockchain shrink-0">
          <Blocks className="w-4 h-4" />
        </div>
        <div>
          <div className="text-[10px] uppercase tracking-wider font-mono text-ce-blockchain font-semibold">
            Shared Audit Layer
          </div>
          <div className="text-sm font-medium text-ce-text-primary flex items-center gap-2 mt-0.5">
            <span>PERMISSIONED LEDGER</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-ce-blockchain/10 text-ce-blockchain border border-ce-blockchain/20 font-mono tracking-widest font-bold">
              VERIFIABLE
            </span>
          </div>
          <p className="text-xs text-ce-text-muted mt-1">
            SHA-256 hash root, ECDSA signatures & timestamped custody state anchored immutably.
          </p>
        </div>
      </div>
    </div>
  );
};
