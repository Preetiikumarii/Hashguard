import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '../common/Badge';
import { truncateHash, getEventColor, formatISTTimestamp } from '../../utils/formatters';
import { ExternalLink, Copy, Check, Trash2, ShieldCheck, Lock } from 'lucide-react';
import { evidenceService } from '../../services/evidenceService';
import { useApp } from '../../context/AppContext';

export const EvidenceTable = ({ evidenceList = [] }) => {
  const [copiedHash, setCopiedHash] = useState(null);
  const { currentRole, triggerRefresh } = useApp();

  const handleCopy = (hash, e) => {
    e.stopPropagation();
    e.preventDefault();
    navigator.clipboard.writeText(hash);
    setCopiedHash(hash);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  const handleDelete = async (item, e) => {
    e.stopPropagation();
    e.preventDefault();

    // 1. RBAC Check
    if (!currentRole?.permissions?.canDeleteEvidence && currentRole?.id !== 'ADMINISTRATOR') {
      alert(`❌ ACCESS DENIED: Role '${currentRole?.name || 'Operator'}' does not have permission to delete evidence exhibits. Administrator privileges required.`);
      return;
    }

    // 2. Legal Hold Override Check
    if (item.legalHold || item.retentionStatus === 'LEGAL HOLD') {
      alert(`❌ DELETION BLOCKED: Evidence exhibit ${item.id} is protected under an active Legal Hold preservation order and cannot be deleted.`);
      return;
    }

    if (window.confirm(`Permanently remove evidence exhibit ${item.id}?`)) {
      try {
        await evidenceService.deleteEvidence(item.id);
        triggerRefresh();
      } catch (err) {
        alert(err.message || 'Failed to delete evidence.');
      }
    }
  };

  return (
    <div className="rounded-lg bg-ce-surface border border-ce-border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="border-b border-ce-border bg-ce-surface-subtle text-ce-text-muted text-[10px] uppercase tracking-wider font-mono">
              <th className="py-3 px-4 font-semibold">Evidence ID</th>
              <th className="py-3 px-4 font-semibold">Case ID</th>
              <th className="py-3 px-4 font-semibold">Evidence Type</th>
              <th className="py-3 px-4 font-semibold">Source Org</th>
              <th className="py-3 px-4 font-semibold">Current Custodian</th>
              <th className="py-3 px-4 font-semibold">SHA-256 Hash</th>
              <th className="py-3 px-4 font-semibold">Status</th>
              <th className="py-3 px-4 font-semibold">Last Event</th>
              <th className="py-3 px-4 font-semibold whitespace-nowrap">Logged Date (IST)</th>
              <th className="py-3 px-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ce-border">
            {evidenceList.length === 0 ? (
              <tr>
                <td colSpan="10" className="py-12 text-center text-ce-text-muted text-sm font-mono">
                  No evidence exhibits found. Click "+ Collect & Seal Evidence" to register legitimate evidence.
                </td>
              </tr>
            ) : evidenceList.map((item) => (
              <tr
                key={item.id}
                className="hover:bg-ce-surface-subtle transition-colors group"
              >
                <td className="py-3 px-4 font-mono font-medium text-ce-text-primary whitespace-nowrap">
                  <Link
                    to={`/evidence/${item.id}`}
                    className="hover:text-ce-brand-hover transition-colors flex items-center gap-1.5"
                  >
                    <span>{item.id}</span>
                    {item.isDerived && (
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-ce-brand/10 text-ce-brand border border-ce-brand/30">
                        DERIVED
                      </span>
                    )}
                    {(item.legalHold || item.retentionStatus === 'LEGAL HOLD') && (
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/30 flex items-center gap-1 font-mono font-bold">
                        <Lock className="w-2.5 h-2.5" />
                        HOLD
                      </span>
                    )}
                  </Link>
                </td>
                <td className="py-3 px-4 font-mono text-xs text-ce-brand font-semibold whitespace-nowrap">
                  {item.caseId || 'CASE-2026-9012'}
                </td>
                <td className="py-3 px-4 whitespace-nowrap">
                  <div className="text-ce-text-primary font-medium text-sm">{item.type}</div>
                  <div className="text-xs text-ce-text-secondary truncate max-w-[180px]">
                    {item.title}
                  </div>
                </td>
                <td className="py-3 px-4 text-ce-text-secondary whitespace-nowrap">
                  {item.sourceOrg}
                </td>
                <td className="py-3 px-4 text-ce-text-secondary whitespace-nowrap">
                  {item.currentCustodian}
                </td>
                <td className="py-3 px-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-1.5 py-0.5 rounded font-mono text-xs ${
                        item.status === 'COMPROMISED'
                          ? 'bg-ce-danger/10 text-ce-danger border border-ce-danger/30'
                          : 'bg-ce-bg text-ce-text-muted border border-ce-border'
                      }`}
                      title={item.hash}
                    >
                      {truncateHash(item.hash, 5, 5)}
                    </span>
                    <button
                      onClick={(e) => handleCopy(item.hash, e)}
                      className="p-1 rounded text-ce-text-muted hover:text-ce-text-primary hover:bg-ce-bg transition-colors"
                      title="Copy full hash"
                      aria-label="Copy SHA-256 Hash"
                    >
                      {copiedHash === item.hash ? (
                        <Check className="w-3.5 h-3.5 text-ce-success" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </td>
                <td className="py-3 px-4 whitespace-nowrap">
                  <Badge status={item.status} />
                </td>
                <td className="py-3 px-4 whitespace-nowrap">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold border ${getEventColor(
                      item.lastEvent
                    )}`}
                  >
                    {item.lastEvent}
                  </span>
                </td>
                <td 
                  className="py-3 px-4 text-ce-text-muted font-mono whitespace-nowrap min-w-[200px]"
                  title={item.createdAt ? `Source timestamp: UTC (${item.createdAt})` : undefined}
                >
                  {formatISTTimestamp(item.createdAt)}
                </td>
                <td className="py-3 px-4 text-right whitespace-nowrap">
                  <div className="inline-flex items-center gap-2">
                    <Link
                      to={`/evidence/${item.id}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-ce-bg border border-ce-border text-xs text-ce-text-secondary hover:text-ce-text-primary hover:border-ce-brand/50 transition-all"
                    >
                      <span>Inspect</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                    <Link
                      to={`/verification?id=${item.id}`}
                      className="p-1.5 rounded-md bg-ce-bg border border-ce-border text-xs text-ce-text-muted hover:text-ce-brand hover:border-ce-brand/50 transition-all"
                      title="Run Zero-Trust Verification"
                    >
                      <ShieldCheck className="w-3.5 h-3.5 text-ce-brand" />
                    </Link>
                    <button
                      onClick={(e) => handleDelete(item, e)}
                      className={`p-1.5 rounded-md bg-ce-bg border text-xs transition-all ${
                        item.legalHold || item.retentionStatus === 'LEGAL HOLD'
                          ? 'border-purple-500/30 text-purple-400 hover:border-purple-500/60'
                          : 'border-ce-border text-ce-text-muted hover:text-ce-danger hover:border-ce-danger/40'
                      }`}
                      title={
                        item.legalHold || item.retentionStatus === 'LEGAL HOLD'
                          ? 'Protected under Legal Hold'
                          : 'Delete exhibit'
                      }
                    >
                      {item.legalHold || item.retentionStatus === 'LEGAL HOLD' ? (
                        <Lock className="w-3.5 h-3.5 text-purple-400" />
                      ) : (
                        <Trash2 className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
