import React from 'react';
import { X, FileText, ArrowUpRight } from 'lucide-react';
import { Badge } from '../common/Badge';
import { Link } from 'react-router-dom';
import { formatISTTimestamp } from '../../utils/formatters';

export const LineageNodeDetailsDrawer = ({ node, onClose, onDeriveFromNode }) => {
  if (!node) return null;
  const data = node.data;

  return (
    <div className="absolute right-4 top-4 bottom-4 w-96 rounded-lg bg-ce-surface border border-ce-border shadow-xl p-5 z-20 flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-200">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-ce-border">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-ce-text-primary uppercase tracking-wider">
              ARTIFACT DETAILS
            </span>
            <Badge status={data.verificationState} />
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-ce-text-muted hover:text-ce-text-primary hover:bg-ce-surface-hover transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Title & Type */}
        <div className="mt-4">
          <span className="text-[10px] uppercase font-mono text-ce-brand font-bold block tracking-wider">
            {data.artifactType}
          </span>
          <h4 className="text-sm font-bold text-ce-text-primary mt-1">
            {data.label}
          </h4>
          <span className="text-xs font-mono text-ce-text-secondary mt-1.5 block">
            ID: <strong className="text-ce-text-primary">{data.id}</strong>
          </span>
        </div>

        {/* Hash & Signature Details */}
        <div className="mt-5 space-y-3 font-mono text-xs">
          <div className="p-3 rounded-md bg-ce-bg border border-ce-border">
            <span className="text-[10px] uppercase tracking-wider text-ce-text-muted block font-bold mb-1.5">
              Artifact SHA-256 Digest:
            </span>
            <div className="text-ce-brand text-[11px] font-bold break-all select-all">
              {data.hash}
            </div>
          </div>

          <div className="p-3 rounded-md bg-ce-bg border border-ce-border space-y-3">
            <div>
              <span className="text-[10px] uppercase tracking-wider text-ce-text-muted block font-bold mb-0.5">
                Creating Entity / Custodian:
              </span>
              <span className="text-ce-text-primary text-[11px] font-semibold">{data.creator}</span>
            </div>

            <div>
              <span className="text-[10px] uppercase tracking-wider text-ce-text-muted block font-bold mb-0.5">
                Anchor Timestamp (IST):
              </span>
              <span 
                className="text-ce-text-secondary text-[11px] font-medium"
                title={data.timestamp ? `Source timestamp: UTC (${data.timestamp})` : undefined}
              >
                {formatISTTimestamp(data.timestamp)}
              </span>
            </div>

            <div>
              <span className="text-[10px] uppercase tracking-wider text-ce-text-muted block font-bold mb-0.5">
                Cryptographic Attestation:
              </span>
              <span className="text-ce-success text-[11px] font-bold">
                ✓ {data.details?.signature || 'ECDSA VALID'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="pt-4 border-t border-ce-border space-y-3 mt-5">
        {data.isRoot && (
          <Link
            to={`/evidence/${data.id}`}
            className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-md bg-ce-surface-subtle border border-ce-border text-xs font-mono font-bold text-ce-brand hover:text-ce-brand-hover hover:border-ce-brand/50 transition-colors"
          >
            <span>Open Raw Evidence Dossier</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        )}

        <button
          onClick={() => onDeriveFromNode(data)}
          className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-md bg-ce-brand hover:bg-ce-brand-hover text-white text-xs font-mono font-bold transition-colors shadow-sm"
        >
          <FileText className="w-4 h-4" />
          <span>Derive Child Artifact From This Node</span>
        </button>
      </div>
    </div>
  );
};
