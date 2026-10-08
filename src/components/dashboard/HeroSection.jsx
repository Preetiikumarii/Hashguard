import React from 'react';
import { ShieldCheck, Activity, Building2, AlertTriangle, RefreshCw } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const HeroSection = ({ criticalAlertsCount = 0 }) => {
  const { currentOrg, currentRole, isTamperSimulated } = useApp();
  const user = React.useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem('cee_user') || '{}');
    } catch {
      return {};
    }
  }, []);

  const displayOrgName = currentOrg?.name || user.orgName || currentRole.orgName;
  const roleTitle = currentRole?.name || currentRole?.roleName || 'Operator';
  const displayName = user.name ? `${user.name} • ${roleTitle}` : roleTitle;

  return (
    <div className="bg-ce-surface border border-ce-border rounded-lg p-4 md:p-6 mb-6">
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
        
        {/* Identity & Role */}
        <div className="flex items-start gap-4 flex-1">
          <div className="w-12 h-12 rounded-lg bg-ce-surface-subtle border border-ce-border-strong flex items-center justify-center shrink-0">
            <Building2 className="w-6 h-6 text-ce-brand" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-ce-text-primary tracking-tight">
              {displayOrgName}
            </h2>
            <div className="text-sm text-ce-text-secondary mt-1 flex items-center gap-2">
              <span className="font-mono text-ce-text-primary bg-ce-surface-subtle px-2 py-0.5 rounded text-xs">
                {displayName}
              </span>
              <span>•</span>
              <span>Operational Command Center</span>
            </div>
          </div>
        </div>

        {/* System Health Overview */}
        <div className="flex flex-wrap md:flex-nowrap items-center gap-4 md:gap-8 shrink-0">
          
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-mono text-ce-text-muted mb-1">Ledger Status</span>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-ce-success animate-pulse" />
              <span className="text-sm font-semibold text-ce-text-primary">SYNCED</span>
            </div>
          </div>

          <div className="hidden sm:block w-px h-8 bg-ce-border" />

          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-mono text-ce-text-muted mb-1">Last Synchronization</span>
            <div className="flex items-center gap-2">
              <RefreshCw className="w-3.5 h-3.5 text-ce-text-secondary" />
              <span className="text-sm text-ce-text-primary font-mono">Just now</span>
            </div>
          </div>

          <div className="hidden sm:block w-px h-8 bg-ce-border" />

          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-mono text-ce-text-muted mb-1">Critical Alerts</span>
            <div className="flex items-center gap-2">
              {isTamperSimulated || criticalAlertsCount > 0 ? (
                <>
                  <AlertTriangle className="w-4 h-4 text-ce-danger" />
                  <span className="text-sm font-bold text-ce-danger">
                    {isTamperSimulated ? criticalAlertsCount + 1 : criticalAlertsCount}
                  </span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4 text-ce-success" />
                  <span className="text-sm font-semibold text-ce-success">0</span>
                </>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
