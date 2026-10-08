import React from 'react';
import { History, CheckCircle2, ArrowRight, ShieldCheck, User, Clock, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatISTCustodyEvent } from '../../utils/formatters';

export const CustodyActivityStream = ({ latestEvent }) => {
  const lifecycleSteps = [
    { label: 'COLLECT', desc: 'Acquisition & Hashing' },
    { label: 'SEAL', desc: 'Manifest HSM Signing' },
    { label: 'TRANSFER', desc: 'Encrypted Transport' },
    { label: 'RECEIVE', desc: 'Cross-Org Verification' },
    { label: 'ANALYZE', desc: 'Forensic Enclave Run' },
    { label: 'DERIVE', desc: 'IOC & Report Lineage' }
  ];

  const currentStep = latestEvent ? latestEvent.event : 'RECEIVE';
  const currentStepIdx = lifecycleSteps.findIndex((s) => s.label === currentStep);
  const activeIdx = currentStepIdx !== -1 ? currentStepIdx : 3;

  return (
    <div className="bg-surface border border-surface-border rounded-xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-2">
          <History className="w-5 h-5 text-cyan-500" />
          <h3 className="text-sm font-semibold text-foreground font-sans tracking-tight">
            CUSTODY LIFECYCLE
          </h3>
        </div>

        <Link
          to="/custody"
          className="text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-colors"
        >
          View Full Chain <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-6 gap-3 mb-8">
        {lifecycleSteps.map((step, idx) => {
          const isPast = idx < activeIdx;
          const isCurrent = idx === activeIdx;

          let bgClass = 'bg-black/30 border-surface-border';
          let textClass = 'text-muted-foreground';
          let iconClass = 'text-muted-foreground opacity-50';

          if (isCurrent) {
            bgClass = 'bg-status-pending-bg border-status-pending-border shadow-glow-amber';
            textClass = 'text-status-pending font-bold';
            iconClass = 'text-status-pending';
          } else if (isPast) {
            bgClass = 'bg-status-verified-bg border-status-verified-border';
            textClass = 'text-status-verified';
            iconClass = 'text-status-verified';
          }

          return (
            <div
              key={step.label}
              className={`relative flex flex-col items-center justify-center p-3 rounded-lg border text-center transition-all ${bgClass}`}
            >
              <div className="mb-2">
                {isPast ? (
                  <CheckCircle2 className={`w-5 h-5 ${iconClass}`} />
                ) : isCurrent ? (
                  <ShieldCheck className={`w-5 h-5 ${iconClass}`} />
                ) : (
                  <div className={`w-5 h-5 rounded-full border-2 ${iconClass} flex items-center justify-center`}>
                    <div className="w-1.5 h-1.5 rounded-full bg-current opacity-30" />
                  </div>
                )}
              </div>
              <span className={`text-[10px] font-mono tracking-wider ${textClass}`}>
                {step.label}
              </span>
              <span className="text-[9px] text-muted-foreground mt-1 opacity-70 hidden xl:block">
                {step.desc}
              </span>

              {idx < lifecycleSteps.length - 1 && (
                <ArrowRight className="absolute -right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-border hidden md:block z-10" />
              )}
            </div>
          );
        })}
      </div>

      {latestEvent && (
        <div className="p-4 rounded-lg bg-black/40 border border-surface-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="px-2 py-1 rounded bg-surface-subtle text-[10px] font-mono text-muted-foreground tracking-wider">
              LATEST EVENT
            </div>
            <div className="font-sans text-sm text-foreground">
              <span className="text-cyan-400 font-mono font-bold mr-2">{latestEvent.event}</span>
              {latestEvent.organization}
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <User className="w-3.5 h-3.5" />
              {latestEvent.actor}
            </span>
            <span 
              className="flex items-center gap-1.5"
              title={latestEvent.timestamp ? `Source timestamp: UTC (${latestEvent.timestamp})` : undefined}
            >
              <Clock className="w-3.5 h-3.5" />
              {formatISTCustodyEvent(latestEvent.timestamp)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
