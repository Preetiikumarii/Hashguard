import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FileText, ArrowRight, ShieldCheck, Clock, Image, FileQuestion, HardDrive, Smartphone, AlertTriangle } from 'lucide-react';
import { formatISTTimestamp, formatRelativeTime } from '../../utils/formatters';

export const RecentEvidenceTable = ({ evidenceList = [] }) => {
  const navigate = useNavigate();
  // Show up to 5 items on dashboard
  const displayItems = evidenceList.slice(0, 5);

  const getTypeIcon = (title) => {
    const t = title?.toLowerCase() || '';
    if (t.includes('disk') || t.includes('drive') || t.includes('ssd')) return <HardDrive className="w-4 h-4 text-ce-text-muted" />;
    if (t.includes('phone') || t.includes('mobile')) return <Smartphone className="w-4 h-4 text-ce-text-muted" />;
    if (t.includes('image') || t.includes('photo')) return <Image className="w-4 h-4 text-ce-text-muted" />;
    return <FileQuestion className="w-4 h-4 text-ce-text-muted" />;
  };

  const getTimeAgo = (idx) => {
    const times = ['2m ago', '15m ago', '1h ago', '3h ago', '1d ago'];
    return times[idx] || '2d ago';
  };

  return (
    <div className="bg-ce-surface border border-ce-border rounded-lg overflow-hidden flex flex-col h-full">
      <div className="flex items-center justify-between p-4 border-b border-ce-border">
        <div className="flex items-center gap-2 text-ce-text-primary font-medium">
          <FileText className="w-4 h-4 text-ce-text-muted" />
          <span className="text-sm">Recent Evidence</span>
        </div>
        <Link to="/evidence" className="text-xs font-medium text-ce-brand hover:text-ce-brand-hover flex items-center gap-1 transition-colors">
          View All <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="overflow-x-auto flex-1">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="text-[10px] font-mono tracking-wider text-ce-text-muted uppercase border-b border-ce-border bg-ce-surface-subtle">
              <th className="py-2.5 px-4 font-semibold">Evidence ID</th>
              <th className="py-2.5 px-4 font-semibold">Type</th>
              <th className="py-2.5 px-4 font-semibold">Title</th>
              <th className="py-2.5 px-4 font-semibold">Status</th>
              <th className="py-2.5 px-4 font-semibold whitespace-nowrap">Logged (IST)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ce-border">
            {displayItems.length === 0 ? (
              <tr>
                <td colSpan="5" className="py-8 text-center text-ce-text-muted text-xs">
                  No evidence recorded yet.
                </td>
              </tr>
            ) : displayItems.map((item, idx) => (
              <tr 
                key={item.id} 
                onClick={() => navigate(`/evidence/${item.id}`)}
                className="hover:bg-ce-surface-subtle transition-colors cursor-pointer group"
              >
                <td className="py-3 px-4 font-mono font-medium text-ce-text-primary whitespace-nowrap">
                  {item.id}
                </td>
                <td className="py-3 px-4 whitespace-nowrap">
                  {getTypeIcon(item.title || item.type)}
                </td>
                <td className="py-3 px-4 text-ce-text-secondary whitespace-nowrap group-hover:text-ce-text-primary transition-colors">
                  {item.title}
                </td>
                <td className="py-3 px-4 whitespace-nowrap">
                  {item.status === 'VERIFIED' ? (
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-medium bg-ce-success/10 text-ce-success border border-ce-success/20">
                      <ShieldCheck className="w-3 h-3" /> VERIFIED
                    </span>
                  ) : item.status === 'PENDING' ? (
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-medium bg-ce-warning/10 text-ce-warning border border-ce-warning/20">
                      <Clock className="w-3 h-3" /> PENDING
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-medium bg-ce-danger/10 text-ce-danger border border-ce-danger/20">
                      <AlertTriangle className="w-3 h-3" /> COMPROMISED
                    </span>
                  )}
                </td>
                <td 
                  className="py-3 px-4 text-ce-text-muted font-mono whitespace-nowrap min-w-[180px]"
                  title={item.createdAt ? `Source: UTC (${item.createdAt})` : undefined}
                >
                  {item.createdAt ? formatISTTimestamp(item.createdAt) : getTimeAgo(idx)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
