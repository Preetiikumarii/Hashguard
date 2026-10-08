import React from 'react';
import { Activity, ShieldCheck, ArrowRightLeft, FileWarning, Key, UserPlus } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatISTTime, formatISTTimestamp, parseTimestamp } from '../../utils/formatters';

export const RecentActivityFeed = ({ events = [] }) => {
  const { isTamperSimulated } = useApp();

  // Show up to 5 events
  const safeParsedTime = (ts) => {
    const p = parseTimestamp(ts);
    if (!p || typeof p.getTime !== 'function') return 0;
    const t = p.getTime();
    return isNaN(t) ? 0 : t;
  };
  let displayEvents = [...events].sort((a, b) => safeParsedTime(b.timestamp) - safeParsedTime(a.timestamp)).slice(0, 5);

  const getActionStyles = (action) => {
    switch (action) {
      case 'VERIFIED':
      case 'SEALED':
        return { icon: ShieldCheck, color: 'text-ce-success', bg: 'bg-ce-success/10' };
      case 'TRANSFERRED':
      case 'CUSTODY_CHANGED':
        return { icon: ArrowRightLeft, color: 'text-ce-info', bg: 'bg-ce-info/10' };
      case 'COMPROMISED':
      case 'TAMPER_DETECTED':
        return { icon: FileWarning, color: 'text-ce-danger', bg: 'bg-ce-danger/10' };
      case 'REGISTERED':
      case 'CREATED':
        return { icon: UserPlus, color: 'text-ce-brand', bg: 'bg-ce-brand/10' };
      case 'KEY_ROTATED':
        return { icon: Key, color: 'text-ce-warning', bg: 'bg-ce-warning/10' };
      default:
        return { icon: Activity, color: 'text-ce-text-muted', bg: 'bg-ce-surface-subtle' };
    }
  };

  const getTimeFormat = (dateStr) => {
    return formatISTTime(dateStr);
  };

  return (
    <div className="bg-ce-surface border border-ce-border rounded-lg overflow-hidden flex flex-col h-full">
      <div className="flex items-center justify-between p-4 border-b border-ce-border">
        <div className="flex items-center gap-2 text-ce-text-primary font-medium">
          <Activity className="w-4 h-4 text-ce-text-muted" />
          <span className="text-sm">Activity Log</span>
        </div>
      </div>

      <div className="p-4 flex-1 overflow-y-auto">
        <div className="space-y-4 relative before:absolute before:inset-0 before:ml-[15px] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-ce-border before:via-ce-border before:to-transparent">
          
          {displayEvents.length === 0 ? (
            <div className="text-center text-xs text-ce-text-muted py-4">No recent activity.</div>
          ) : (
            displayEvents.map((evt, idx) => {
              const { icon: Icon, color, bg } = getActionStyles(evt.action || evt.status);
              
              return (
                <div key={evt.id || idx} className="relative flex items-start gap-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 z-10 border border-ce-surface ${bg}`}>
                    <Icon className={`w-4 h-4 ${color}`} />
                  </div>
                  <div className="flex-1 bg-ce-bg border border-ce-border rounded-md p-3">
                    <div className="flex justify-between items-start mb-1 gap-2">
                      <span className="text-xs font-semibold text-ce-text-primary uppercase tracking-wider">
                        {evt.action || evt.status}
                      </span>
                      <span className="text-[10px] font-mono text-ce-text-muted shrink-0 whitespace-nowrap">
                        {getTimeFormat(evt.timestamp)}
                      </span>
                    </div>
                    <p className="text-xs text-ce-text-secondary leading-relaxed">
                      {evt.details || `Item ${evt.evidenceId || evt.id} state updated.`}
                    </p>
                    {(evt.evidenceId || evt.id) && (
                      <div className="mt-2 text-[10px] font-mono text-ce-text-muted bg-ce-surface-subtle px-2 py-1 rounded inline-block border border-ce-border-strong">
                        REF: {evt.evidenceId || evt.id}
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}

        </div>
      </div>
    </div>
  );
};
