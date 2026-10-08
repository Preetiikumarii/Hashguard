import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Badge } from '../common/Badge';
import { truncateHash, formatISTDate, formatISTTimestamp } from '../../utils/formatters';
import { Shield, FileText, Cpu, GitFork } from 'lucide-react';

export const LineageCustomNode = memo(({ data, selected }) => {
  const isRoot = data.isRoot;
  const isCompromised = data.verificationState === 'COMPROMISED';

  const getNodeIcon = () => {
    if (isRoot) return Shield;
    if (data.artifactType?.includes('IOC')) return GitFork;
    if (data.artifactType?.includes('Analysis')) return Cpu;
    return FileText;
  };

  const Icon = getNodeIcon();

  return (
    <div
      className={`w-72 rounded-md p-4 border transition-all select-none shadow-sm ${
        selected
          ? 'ring-2 ring-ce-brand border-ce-brand bg-ce-surface'
          : isCompromised
          ? 'bg-ce-danger/10 border-ce-danger shadow-[0_0_15px_rgba(239,68,68,0.2)]'
          : isRoot
          ? 'bg-ce-surface border-ce-brand/50 shadow-[0_0_15px_rgba(6,182,212,0.1)]'
          : 'bg-ce-surface-subtle border-ce-border hover:border-ce-text-muted'
      }`}
    >
      {/* React Flow Top Handle */}
      {!isRoot && (
        <Handle
          type="target"
          position={Position.Top}
          className="w-3 h-3 bg-ce-brand border-2 border-ce-bg"
        />
      )}

      {/* Node Header */}
      <div className="flex items-center justify-between pb-3 border-b border-ce-border">
        <div className="flex items-center gap-2.5">
          <div
            className={`p-1.5 rounded-md ${
              isRoot
                ? 'bg-ce-brand/20 text-ce-brand'
                : 'bg-ce-surface text-ce-text-secondary border border-ce-border'
            }`}
          >
            <Icon className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs font-bold font-mono text-ce-text-primary block leading-tight">
              {data.id}
            </span>
            <span className="text-[10px] font-bold uppercase font-mono text-ce-brand">
              {data.artifactType}
            </span>
          </div>
        </div>

        <Badge status={data.verificationState || 'VERIFIED'} />
      </div>

      {/* Node Title & Description */}
      <div className="my-3">
        <div className="text-xs font-semibold text-ce-text-primary line-clamp-1">
          {data.label}
        </div>
      </div>

      {/* Forensic Properties (Hash, Creator, Time) */}
      <div className="space-y-1.5 text-[10px] font-mono text-ce-text-muted pt-3 border-t border-ce-border">
        <div className="flex items-center justify-between">
          <span>SHA-256:</span>
          <span
            className="text-ce-brand bg-ce-bg border border-ce-border px-1.5 py-0.5 rounded-sm font-bold"
            title={data.hash}
          >
            {truncateHash(data.hash, 4, 4)}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span>Creator:</span>
          <span className="text-ce-text-secondary font-semibold truncate max-w-[140px]">
            {data.creator?.split(' ')[0] || data.creator}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span>Anchored (IST):</span>
          <span 
            className="text-ce-text-muted"
            title={data.timestamp ? `Source timestamp: UTC (${data.timestamp}) • IST: ${formatISTTimestamp(data.timestamp)}` : undefined}
          >
            {data.timestamp ? formatISTDate(data.timestamp) : '—'}
          </span>
        </div>
      </div>

      {/* React Flow Bottom Handle */}
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 bg-ce-success border-2 border-ce-bg"
      />
    </div>
  );
});
