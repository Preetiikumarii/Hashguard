import React, { useState } from 'react';
import {
  Search,
  Bell,
  Menu,
  ShieldAlert,
  ShieldCheck
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ThemeToggle } from '../common/ThemeToggle';

export const Topbar = ({ setMobileOpen }) => {
  const {
    currentOrg,
    currentRole,
    searchQuery,
    setSearchQuery,
    notifications,
    isSandboxMode,
    isTamperSimulated,
    toggleTamperSimulation
  } = useApp();

  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header className="h-16 bg-ce-surface/90 backdrop-blur border-b border-ce-border px-4 lg:px-6 flex items-center justify-between gap-4 sticky top-0 z-30 shrink-0">
      <div className="flex items-center gap-3 flex-1">
        <button 
          onClick={() => setMobileOpen(true)}
          className="lg:hidden p-2 -ml-2 rounded-md hover:bg-ce-surface-subtle text-ce-text-secondary"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex-1 max-w-md relative hidden sm:block">
          <Search className="w-4 h-4 text-ce-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Evidence ID, Hash..."
            className="w-full bg-ce-bg border border-ce-border rounded-md pl-9 pr-4 py-1.5 text-sm text-ce-text-primary placeholder:text-ce-text-muted focus:outline-none focus:border-ce-brand focus:ring-1 focus:ring-ce-brand transition-colors"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        {isSandboxMode && (
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-amber-500/10 border border-amber-500/30 text-amber-500 dark:text-amber-400 font-mono text-[11px] font-bold shadow-sm">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span className="hidden sm:inline">SANDBOX — EVALUATION MODE</span>
            <span className="sm:hidden">SANDBOX</span>
          </div>
        )}

        {/* Unified Global Tamper Drill Toggle */}
        <button
          onClick={() => toggleTamperSimulation(!isTamperSimulated, 'EV-001')}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border font-mono text-[11px] font-bold transition-all cursor-pointer shadow-xs ${
            isTamperSimulated
              ? 'bg-rose-500/20 border-rose-500/60 text-rose-800 dark:text-rose-300 shadow-[0_0_15px_rgba(244,63,94,0.3)] animate-pulse'
              : 'bg-ce-surface-subtle hover:bg-ce-border text-slate-800 dark:text-slate-200 border-ce-border hover:border-slate-400'
          }`}
          title="Global Zero-Trust Tamper Drill: Inverts 1 bit in exhibit EV-001 off-chain payload to test cryptographic verification across the entire platform."
        >
          <span className={`w-2 h-2 rounded-full shrink-0 ${isTamperSimulated ? 'bg-rose-500 animate-ping' : 'bg-emerald-500'}`} />
          {isTamperSimulated ? (
            <ShieldAlert className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400 shrink-0" />
          ) : (
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
          )}
          <span className="hidden md:inline">
            {isTamperSimulated ? 'TAMPER DRILL: ACTIVE' : 'TAMPER DRILL: CLEAN'}
          </span>
          <span className="md:hidden">
            {isTamperSimulated ? 'TAMPER' : 'CLEAN'}
          </span>
        </button>

        <ThemeToggle size="md" />

        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-md hover:bg-ce-surface-subtle text-ce-text-secondary hover:text-ce-text-primary transition-colors"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            {notifications.length > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-ce-danger ring-2 ring-ce-surface" />
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 rounded-lg bg-ce-surface border border-ce-border shadow-lg p-3 z-50 animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center justify-between pb-2 border-b border-ce-border mb-2">
                <span className="text-xs font-semibold text-ce-text-primary uppercase tracking-wider">Live Feeds</span>
                <span className="text-[10px] text-ce-success font-mono">P2P Synced</span>
              </div>
              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {notifications.length === 0 ? (
                  <div className="text-xs text-ce-text-muted text-center py-4">No recent notifications.</div>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      className={`p-2.5 rounded-md text-xs border ${
                        n.type === 'danger'
                          ? 'bg-ce-danger/5 border-ce-danger/20 text-ce-danger'
                          : 'bg-ce-bg border-ce-border text-ce-text-primary'
                      }`}
                    >
                      <div className="font-semibold flex items-center justify-between mb-1">
                        <span>{n.title}</span>
                        <span className="text-[10px] opacity-70 font-mono">{n.time}</span>
                      </div>
                      <p className="text-[11px] opacity-80 leading-relaxed">{n.desc}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2.5 pl-2 sm:pl-3 border-l border-ce-border">
          <div className="w-8 h-8 rounded-md bg-ce-brand/10 border border-ce-brand/20 flex items-center justify-center font-bold text-xs text-ce-brand">
            {(currentRole.name || currentRole.id).charAt(0)}
          </div>
          <div className="hidden lg:block text-left">
            <div className="text-xs font-semibold text-ce-text-primary truncate max-w-[150px]">
              {currentRole.name || currentRole.roleName}
            </div>
            <div className="text-[10px] text-ce-text-muted font-mono truncate max-w-[150px]">
              {currentOrg?.shortName || 'Consortium'}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
