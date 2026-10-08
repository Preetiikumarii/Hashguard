import React from 'react';
import { AlertOctagon, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const IntegrityAlertBanner = ({
  evidenceId = 'EV-009',
  expectedHash = '8f3a91bc72f4cd2a4e9b671a5c28e930f1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6',
  currentHash = '7a21f9c82e04192b47e301293840192830192840192830192830192830192830',
  description = 'Current hash does not match sealed hash.'
}) => {
  return (
    <div className="rounded-lg bg-ce-danger/5 border border-ce-danger/30 p-5 relative overflow-hidden shadow-[0_0_15px_rgba(239,68,68,0.1)]">
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 relative z-10">
        {/* Left icon & description */}
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-md bg-ce-danger/10 border border-ce-danger/20 text-ce-danger shrink-0 animate-pulse">
            <AlertOctagon className="w-6 h-6" />
          </div>

          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2 py-0.5 rounded bg-ce-danger/20 text-ce-danger border border-ce-danger/30 text-[10px] font-mono font-bold tracking-widest uppercase">
                INTEGRITY ALERT
              </span>
              <span className="text-xs font-mono text-ce-text-secondary">
                Evidence: <strong className="text-ce-text-primary">{evidenceId}</strong>
              </span>
            </div>

            <p className="text-sm font-semibold text-ce-danger mt-1">
              {description}
            </p>
            <p className="text-xs text-ce-text-muted mt-1 max-w-2xl leading-relaxed">
              Cryptographic seal mismatch detected during custodial verification. Forensic chain halted.
            </p>

            {/* Hashes comparison box */}
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
              <div className="p-3 rounded-md bg-ce-surface border border-ce-border">
                <div className="text-[10px] text-ce-success font-semibold uppercase tracking-wider mb-1">
                  Expected Sealed Hash
                </div>
                <div className="text-ce-success/80 font-mono text-[11px] truncate bg-ce-success/5 p-1 rounded">
                  {expectedHash}
                </div>
              </div>

              <div className="p-3 rounded-md bg-ce-danger/10 border border-ce-danger/30">
                <div className="text-[10px] text-ce-danger font-semibold uppercase tracking-wider mb-1">
                  Current Computed Hash
                </div>
                <div className="text-ce-danger font-mono font-bold text-[11px] truncate bg-ce-danger/5 p-1 rounded">
                  {currentHash}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right CTA */}
        <div className="shrink-0 flex items-center md:self-stretch md:items-center">
          <Link
            to="/verification"
            className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-md bg-ce-danger hover:bg-ce-danger/90 text-white text-xs font-mono font-bold transition-colors"
          >
            <span>VIEW VERIFICATION LOG</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};
