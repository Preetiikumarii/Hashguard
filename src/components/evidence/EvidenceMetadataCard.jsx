import React from 'react';
import { Database, User, Calendar, HardDrive, FileText, Building2, Shield } from 'lucide-react';
import { formatISTTimestamp } from '../../utils/formatters';

export const EvidenceMetadataCard = ({ evidence }) => {
  const metadataItems = [
    { label: 'Evidence ID', value: evidence.id, icon: Shield, mono: true, highlight: true },
    { label: 'Case ID', value: evidence.caseId || 'CASE-2026-9012', icon: FileText, mono: true, highlight: true },
    { label: 'Evidence Type', value: evidence.type, icon: FileText },
    { label: 'Source Organization', value: evidence.sourceOrg, icon: Building2 },
    { label: 'Collector', value: evidence.collector, icon: User, mono: true },
    { label: 'Created Timestamp (IST)', value: formatISTTimestamp(evidence.createdAt), icon: Calendar, mono: true },
    { label: 'Current Custodian', value: evidence.currentCustodian, icon: Building2 },
    { label: 'File Size', value: evidence.fileSize, icon: HardDrive, mono: true },
    { label: 'Hash Algorithm', value: evidence.hashAlgorithm || 'SHA-256', icon: Database, mono: true },
    { label: 'Retention Policy', value: evidence.retentionPolicyName || 'Active Investigation Evidence', icon: FileText, mono: true },
    { label: 'Legal Hold Status', value: evidence.legalHold ? 'ON HOLD (BLOCKED)' : 'NO HOLD (ACTIVE)', icon: Shield, mono: true, highlight: evidence.legalHold },
  ];

  return (
    <div className="rounded-lg bg-ce-surface border border-ce-border p-5">
      <h3 className="text-xs font-mono font-bold tracking-wider uppercase text-ce-text-primary pb-3 border-b border-ce-border mb-4 flex items-center gap-2">
        <FileText className="w-4 h-4 text-ce-brand" />
        FORENSIC METADATA
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {metadataItems.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className="p-3 rounded-md bg-ce-bg border border-ce-border flex items-start gap-3"
            >
              <div className="p-1.5 rounded-sm bg-ce-surface-subtle text-ce-text-secondary shrink-0 mt-0.5 border border-ce-border">
                <Icon className="w-3.5 h-3.5" />
              </div>
              <div className="min-w-0">
                <div className="text-[10px] uppercase font-mono text-ce-text-muted font-semibold tracking-wider">
                  {item.label}
                </div>
                <div
                  className={`text-xs mt-0.5 truncate ${
                    item.highlight
                      ? 'text-ce-brand font-bold'
                      : item.mono
                      ? 'font-mono text-ce-text-primary'
                      : 'text-ce-text-primary'
                  }`}
                >
                  {item.value || '—'}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {evidence.description && (
        <div className="mt-4 p-4 rounded-md bg-ce-surface-subtle border border-ce-border">
          <div className="text-[10px] uppercase font-mono text-ce-text-muted font-semibold mb-1.5 tracking-wider">
            Forensic Scope & Description:
          </div>
          <p className="text-xs text-ce-text-primary leading-relaxed font-sans">
            {evidence.description}
          </p>
        </div>
      )}

      {evidence.forensicNotes && (
        <div className="mt-4 p-4 rounded-md bg-ce-surface-subtle border border-ce-border">
          <div className="text-[10px] uppercase font-mono text-ce-brand font-semibold mb-1.5 tracking-wider">
            RAW SAMPLE / FORENSIC NOTES:
          </div>
          <pre className="text-xs text-ce-text-primary leading-relaxed font-mono whitespace-pre-wrap">
            {evidence.forensicNotes}
          </pre>
        </div>
      )}
    </div>
  );
};
