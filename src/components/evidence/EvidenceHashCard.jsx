import React, { useState } from 'react';
import { ShieldCheck, ShieldAlert, Copy, Check, Hash, Blocks } from 'lucide-react';
import { Badge } from '../common/Badge';

export const EvidenceHashCard = ({ evidence }) => {
  const [copied, setCopied] = useState(false);
  const isCompromised = evidence.status === 'COMPROMISED';

  const copyFullHash = () => {
    navigator.clipboard.writeText(evidence.hash);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={`rounded-lg p-5 border transition-all ${
        isCompromised
          ? 'bg-ce-danger/10 border-ce-danger/50 shadow-[0_0_15px_rgba(239,68,68,0.15)]'
          : 'bg-ce-surface border-ce-border'
      }`}
    >
      <div className="flex items-center justify-between pb-3 border-b border-ce-border">
        <div className="flex items-center gap-3">
          <div
            className={`p-2 rounded-md border ${
              isCompromised
                ? 'bg-ce-danger/20 text-ce-danger border-ce-danger/40'
                : 'bg-ce-success/10 text-ce-success border-ce-success/30'
            }`}
          >
            <Hash className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-mono font-bold tracking-wider uppercase text-ce-text-primary">
              INTEGRITY VERIFICATION (SHA-256)
            </h3>
            <span className="text-[11px] text-ce-text-muted font-mono">
              Deterministic Bit-Level Hash Seal
            </span>
          </div>
        </div>

        <Badge status={evidence.status} />
      </div>

      <div className="mt-4 space-y-3">
        {/* Computed Hash Display */}
        <div>
          <div className="flex items-center justify-between text-[11px] font-mono text-ce-text-secondary mb-1.5">
            <span>Computed Payload Hash ({evidence.hashAlgorithm || 'SHA-256'}):</span>
            <button
              onClick={copyFullHash}
              className="text-ce-brand hover:text-ce-brand-hover flex items-center gap-1 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-ce-success" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy Hash'}</span>
            </button>
          </div>

          <div
            className={`p-3 rounded-md font-mono text-xs break-all border select-all ${
              isCompromised
                ? 'bg-ce-danger/20 text-ce-danger border-ce-danger/50 font-bold'
                : 'bg-ce-bg text-ce-brand border-ce-border'
            }`}
          >
            {evidence.hash}
          </div>
        </div>

        {/* Expected Hash if Compromised */}
        {isCompromised && (
          <div className="p-3 rounded-md bg-ce-danger/10 border border-ce-danger/30 text-xs font-mono space-y-1.5 mt-3">
            <div className="text-[11px] text-ce-danger font-semibold uppercase tracking-wider">
              ✕ IMMUTABLE ANCHOR MISMATCH:
            </div>
            <div className="text-ce-text-secondary text-[11px]">
              Expected On-Chain Sealed Hash:
            </div>
            <div className="text-ce-success text-[11px] break-all bg-ce-bg p-1.5 rounded border border-ce-border">
              {evidence.expectedHash}
            </div>
          </div>
        )}

        {/* Blockchain Anchor metadata */}
        <div className="pt-3 mt-3 border-t border-ce-border flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono text-ce-text-muted">
          <div className="flex items-center gap-1.5">
            <Blocks className="w-3.5 h-3.5 text-ce-brand" />
            <span>Anchor Block: <strong className="text-ce-text-primary">#{evidence.blockNumber || 482910}</strong></span>
          </div>
          <div className="truncate max-w-[280px]">
            Tx: {evidence.txHash}
          </div>
        </div>
      </div>
    </div>
  );
};
