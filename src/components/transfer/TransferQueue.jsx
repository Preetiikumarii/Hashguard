import React from 'react';
import { Badge } from '../common/Badge';
import { ArrowRight, CheckCircle2, AlertTriangle, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatISTCustodyEvent } from '../../utils/formatters';

export const TransferQueue = ({
  transfers = [],
  selectedTransferId,
  onSelectTransfer,
  onAcceptTransfer
}) => {
  return (
    <div className="rounded-lg bg-ce-surface border border-ce-border overflow-hidden shadow-sm">
      <div className="p-4 border-b border-ce-border flex items-center justify-between bg-ce-surface-subtle">
        <div>
          <h3 className="text-xs font-mono font-bold tracking-wider uppercase text-ce-text-primary">
            TRANSFER QUEUE & CROSS-ORG DISPATCH
          </h3>
          <p className="text-xs text-ce-text-muted mt-0.5">
            Inter-agency evidence transmission records and verify-on-receipt actions
          </p>
        </div>
        <span className="text-[11px] font-mono font-bold px-2.5 py-1 rounded-md bg-ce-brand/10 text-ce-brand border border-ce-brand/30">
          {transfers.length} ACTIVE TRANSFERS
        </span>
      </div>

      <div className="divide-y divide-ce-border">
        {transfers.length === 0 ? (
          <div className="p-8 text-center text-xs font-mono text-ce-text-muted">
            No inter-agency transfers currently in queue. Ingest evidence exhibits and initiate a cross-agency transfer to begin.
          </div>
        ) : (
          transfers.map((item) => {
          const isSelected = selectedTransferId === item.id;
          return (
            <div
              key={item.id}
              onClick={() => onSelectTransfer(item)}
              className={`p-4 transition-all cursor-pointer ${
                isSelected
                  ? 'bg-ce-brand/5 border-l-4 border-l-ce-brand'
                  : 'hover:bg-ce-surface-elevated'
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                {/* Left Transfer Metadata */}
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2.5">
                    <span className="text-xs font-bold font-mono text-ce-text-primary">
                      {item.id}
                    </span>
                    <span className="text-xs font-mono text-ce-border-strong">|</span>
                    <Link
                      to={`/evidence/${item.evidenceId}`}
                      onClick={(e) => e.stopPropagation()}
                      className="text-xs font-mono text-ce-brand hover:text-ce-brand-hover hover:underline font-bold"
                    >
                      {item.evidenceId}
                    </Link>
                    <span className="text-xs text-ce-text-secondary font-semibold truncate max-w-xs">
                      {item.evidenceTitle}
                    </span>
                    <Badge status={item.status} />
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-[11px] font-mono text-ce-text-muted">
                    <div className="flex items-center gap-1.5">
                      <span className="text-ce-text-muted uppercase tracking-wider font-semibold">From:</span>
                      <span className="text-ce-text-primary font-semibold">{item.fromOrg}</span>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-ce-brand" />
                    <div className="flex items-center gap-1.5">
                      <span className="text-ce-text-muted uppercase tracking-wider font-semibold">To:</span>
                      <span className="text-ce-brand font-semibold">{item.toOrg}</span>
                    </div>
                  </div>

                  {item.notes && (
                    <div className="text-[11px] text-ce-text-muted italic pt-0.5">
                      "{item.notes}"
                    </div>
                  )}
                </div>

                {/* Right Action & Verification status */}
                <div className="flex items-center gap-3 shrink-0">
                  {item.status === 'TRANSFERRING' && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onAcceptTransfer(item.id);
                      }}
                      className="px-3 py-1.5 rounded-md bg-ce-success hover:bg-ce-success/90 text-white text-xs font-mono font-bold transition-colors shadow-sm"
                    >
                      ✓ Verify & Accept Ingestion
                    </button>
                  )}

                  {item.status === 'VERIFIED' && (
                    <div className="text-right text-[11px] font-mono text-ce-success">
                      <div className="font-bold flex items-center gap-1 justify-end">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>RECEIPT VERIFIED</span>
                      </div>
                      <span 
                        className="text-ce-text-muted text-[10px]"
                        title={item.completedAt ? `Source timestamp: UTC (${item.completedAt})` : undefined}
                      >
                        {formatISTCustodyEvent(item.completedAt)}
                      </span>
                    </div>
                  )}

                  {item.status === 'FAILED' && (
                    <div className="text-right text-[11px] font-mono text-ce-danger">
                      <div className="font-bold flex items-center gap-1 justify-end">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        <span>REJECTED (TAMPER)</span>
                      </div>
                      <span className="text-ce-text-muted text-[10px]">Hash mismatch</span>
                    </div>
                  )}

                  <Link
                    to={`/evidence/${item.evidenceId}`}
                    onClick={(e) => e.stopPropagation()}
                    className="p-1.5 rounded-md bg-ce-surface-subtle text-ce-text-secondary hover:text-ce-text-primary border border-ce-border transition-colors"
                    title="View Evidence Details"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          );
        }))}
      </div>
    </div>
  );
};
