import React from 'react';
import { Fingerprint, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const ChainOfTrustBanner = () => {
  return (
    <div className="bg-ce-surface border border-ce-border rounded-lg overflow-hidden flex items-center p-6 relative h-full">
      {/* Background patterns */}
      <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-ce-brand/5 to-transparent pointer-events-none" />
      <div className="absolute left-0 top-0 w-[300px] h-full bg-ce-brand/5 blur-[80px] pointer-events-none" />

      {/* Left Icon (Fingerprint) */}
      <div className="hidden sm:flex w-16 h-16 shrink-0 items-center justify-center relative mr-6 border border-ce-border-strong rounded-full bg-ce-surface-subtle">
        <Fingerprint className="w-8 h-8 text-ce-brand relative z-10" />
      </div>

      <div className="flex-1 relative z-10">
        <div className="text-[10px] font-mono tracking-widest text-ce-text-muted uppercase mb-1 flex items-center gap-2">
          Cryptographic Ledger
        </div>
        <h2 className="text-xl font-semibold text-ce-text-primary mb-1 tracking-tight">
          Every Action Leaves a Verifiable Trace.
        </h2>
        <p className="text-xs text-ce-text-secondary max-w-lg">
          Blockchain-anchored evidence management ensures non-repudiation across organizational boundaries.
        </p>
      </div>

      <div className="relative z-10 ml-6 shrink-0">
        <Link 
          to="/lineage"
          className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-md bg-ce-brand hover:bg-ce-brand-hover text-white text-xs font-medium transition-colors shadow-sm"
        >
          Explore Lineage <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};
