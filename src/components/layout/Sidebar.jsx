import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  ShieldAlert,
  ArrowLeftRight,
  History,
  GitFork,
  ShieldCheck,
  FileSpreadsheet,
  Settings,
  Building2,
  Lock,
  ChevronLeft,
  ChevronRight,
  Menu,
  Wallet,
  LogOut,
  Clock,
  BadgeCheck,
  FlaskConical,
  KeyRound,
  Layers
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Logo } from '../common/Logo';

export const Sidebar = ({ isMobileOpen, setMobileOpen }) => {
  const { currentOrg, switchOrg, organizations, currentRole, switchRole, isTamperSimulated, walletAddress, did, connectWallet } = useApp();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isContextOpen, setIsContextOpen] = useState(true);
  const [showSecondaryOps, setShowSecondaryOps] = useState(false);

  // PRIMARY NAVIGATION (7 Core Platform Items)
  const primaryNavigation = [
    { name: 'Overview', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Assets', path: '/evidence', icon: ShieldAlert },
    { name: 'Access & Governance', path: '/access-governance', icon: KeyRound },
    { name: 'Trust Passport', path: '/passport', icon: BadgeCheck },
    { name: 'Verification', path: '/verification', icon: ShieldCheck, alert: isTamperSimulated },
    { name: 'Security Lab', path: '/security-lab', icon: FlaskConical },
    { name: 'Audit', path: '/audit', icon: FileSpreadsheet },
  ];

  // SECONDARY / DETAIL ROUTES (Preserved & Accessible)
  const secondaryNavigation = [
    { name: 'Transfers', path: '/transfers', icon: ArrowLeftRight },
    { name: 'Custody', path: '/custody', icon: History },
    { name: 'Lineage DAG', path: '/lineage', icon: GitFork },
    { name: 'Retention', path: '/retention', icon: Clock },
    { name: 'Identity & Settings', path: '/settings', icon: Settings },
  ];

  const sidebarClass = `
    fixed inset-y-0 left-0 z-40 flex flex-col bg-ce-surface border-r border-ce-border transition-all duration-300 ease-in-out
    ${isCollapsed ? 'w-20' : 'w-64'}
    ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
    lg:static lg:h-screen
  `;

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 lg:hidden backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside className={sidebarClass}>
        {/* Header / Logo Area */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-ce-border shrink-0">
          {!isCollapsed && (
            <NavLink to="/" className="hover:opacity-90 transition-opacity truncate">
              <Logo size="sm" tampered={isTamperSimulated} />
            </NavLink>
          )}
          {isCollapsed && (
            <NavLink to="/" className="mx-auto hover:opacity-90 transition-opacity">
              <Logo variant="icon" size="sm" tampered={isTamperSimulated} />
            </NavLink>
          )}
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex p-1.5 rounded-md hover:bg-ce-surface-subtle text-ce-text-muted transition-colors"
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Organization / Role Info (Active Context collapsible) */}
        <div className={`p-3 border-b border-ce-border ${isCollapsed ? 'px-2' : ''}`}>
          {!isCollapsed ? (
            <div className="bg-ce-surface-subtle rounded-md border border-ce-border-strong overflow-hidden transition-all duration-200">
              {/* Header with Accordion Toggle */}
              <button
                type="button"
                onClick={() => setIsContextOpen(!isContextOpen)}
                className="w-full flex items-center justify-between p-3 text-[10px] font-mono text-ce-text-muted uppercase tracking-wider hover:bg-ce-surface/50 transition-colors cursor-pointer text-left"
                aria-expanded={isContextOpen}
              >
                <span className="flex items-center gap-1.5 font-bold text-ce-brand">
                  <Building2 className="w-3.5 h-3.5" />
                  Active Context
                </span>
                <div className="flex items-center gap-2">
                  <span className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-ce-success animate-pulse" title="Network Connected" />
                    <span className="text-[9px] text-ce-success font-semibold">SYNCED</span>
                  </span>
                  <span className="text-xs text-ce-text-muted font-bold">
                    {isContextOpen ? '▲' : '▼'}
                  </span>
                </div>
              </button>

              {/* Collapsed Preview Line when closed */}
              {!isContextOpen && (
                <div className="px-3 pb-2.5 pt-0 flex items-center justify-between text-[11px] font-mono text-ce-text-secondary border-t border-ce-border/40">
                  <span className="truncate max-w-[120px] font-medium text-ce-text-primary">
                    {currentOrg?.shortName || 'Cyber Defense Lab'}
                  </span>
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${currentRole.badgeColor}`}>
                    {currentRole.name?.split(' ')[0] || 'Analyst'}
                  </span>
                </div>
              )}

              {/* Expanded Full Context Controls */}
              {isContextOpen && (
                <div className="p-3 pt-0 space-y-3 border-t border-ce-border/60">
                  {/* Organization Selector (WHERE the user belongs) */}
                  <div className="pt-2">
                    <label className="block text-[10px] font-mono font-bold text-ce-text-muted uppercase tracking-wider mb-1">
                      Organization
                    </label>
                    <select
                      value={currentOrg?.id || 'ORG_B'}
                      onChange={(e) => switchOrg(e.target.value)}
                      className="w-full bg-ce-surface border border-ce-border text-[11px] text-ce-text-primary rounded px-2 py-1.5 font-mono focus:outline-none focus:border-ce-brand focus:ring-1 focus:ring-ce-brand cursor-pointer"
                      title="Switch Participating Organization Context"
                    >
                      {Object.values(organizations || {}).map((org) => (
                        <option key={org.id} value={org.id}>
                          {org.name}
                        </option>
                      ))}
                    </select>
                    <div className="text-[10px] text-ce-text-muted font-sans mt-0.5 truncate">
                      Scope: {currentOrg?.function || 'Forensic Lab'}
                    </div>
                  </div>

                  {/* RBAC Role Selector (WHAT the user is allowed to do) */}
                  <div className="pt-2 border-t border-ce-border/60">
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-[10px] font-mono font-bold text-ce-text-muted uppercase tracking-wider">
                        Role
                      </label>
                      <span className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded border ${currentRole.badgeColor}`}>
                        RBAC
                      </span>
                    </div>
                    <select
                      value={currentRole.id}
                      onChange={(e) => switchRole(e.target.value)}
                      className="w-full bg-ce-surface border border-ce-border text-[11px] text-ce-text-primary rounded px-2 py-1.5 font-mono focus:outline-none focus:border-ce-brand focus:ring-1 focus:ring-ce-brand cursor-pointer"
                      title="Switch Role-Based Access Control Role"
                    >
                      <option value="FIRST_RESPONDER">First Responder</option>
                      <option value="FORENSIC_ANALYST">Forensic Analyst</option>
                      <option value="EVIDENCE_CUSTODIAN">Evidence Custodian</option>
                      <option value="INVESTIGATOR">Investigator</option>
                      <option value="AUDITOR">Auditor</option>
                      <option value="ADMINISTRATOR">Organization Administrator</option>
                    </select>
                  </div>

                  {/* Decentralized Identifier (DID) */}
                  <div className="pt-2 border-t border-ce-border/60">
                    <span className="block text-[10px] font-mono font-bold text-ce-text-muted uppercase tracking-wider mb-1">
                      DID
                    </span>
                    {walletAddress ? (
                      <div className="text-[10px] font-mono text-ce-blockchain bg-ce-blockchain/10 border border-ce-blockchain/20 rounded p-1.5 truncate flex items-center gap-1.5" title={did}>
                        <Wallet className="w-3 h-3 shrink-0" />
                        <span className="truncate">{did}</span>
                      </div>
                    ) : (
                      <button 
                        onClick={connectWallet}
                        className="w-full flex items-center justify-center gap-1.5 bg-ce-brand/10 hover:bg-ce-brand/20 text-ce-brand border border-ce-brand/30 text-xs font-medium py-1.5 rounded transition-colors"
                      >
                        <Wallet className="w-3 h-3" />
                        Connect Wallet
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 py-2">
              <div className="w-8 h-8 rounded-md bg-ce-surface-subtle border border-ce-border-strong flex items-center justify-center relative" title={`${currentOrg?.shortName || 'Org'} • ${currentRole?.name || 'Role'}`}>
                <Building2 className="w-4 h-4 text-ce-brand" />
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-ce-success border-2 border-ce-surface" />
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-3 px-3 space-y-4">
          {/* Primary Navigation - 8 Core Items */}
          <div className="space-y-1">
            {!isCollapsed && (
              <div className="text-[10px] font-mono uppercase tracking-widest text-ce-text-muted px-3 pb-1 font-semibold flex items-center justify-between">
                <span>Platform Navigation</span>
                <span className="text-[9px] text-ce-brand font-bold">8 CORE</span>
              </div>
            )}
            {primaryNavigation.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  title={isCollapsed ? item.name : undefined}
                  className={({ isActive }) => `
                    flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-all relative group
                    ${isActive 
                      ? 'bg-ce-surface-subtle text-ce-text-primary' 
                      : 'text-ce-text-secondary hover:bg-ce-surface-subtle/50 hover:text-ce-text-primary'}
                    ${isCollapsed ? 'justify-center px-0' : ''}
                  `}
                >
                  {({ isActive }) => (
                    <>
                      {isActive && (
                        <div className="absolute left-0 top-1 bottom-1 w-1 bg-ce-brand rounded-r-full" />
                      )}
                      <Icon className={`w-[18px] h-[18px] shrink-0 ${isActive ? 'text-ce-brand' : 'text-ce-text-muted group-hover:text-ce-text-primary'}`} />
                      
                      {!isCollapsed && (
                        <span className="truncate flex-1">{item.name}</span>
                      )}

                      {!isCollapsed && item.alert && (
                        <span className="shrink-0 text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-ce-danger/10 text-ce-danger border border-ce-danger/20 animate-pulse">
                          ALERT
                        </span>
                      )}
                      
                      {/* Alert dot for collapsed state */}
                      {isCollapsed && item.alert && (
                        <span className="absolute top-1 right-2 w-2 h-2 rounded-full bg-ce-danger animate-pulse" />
                      )}
                    </>
                  )}
                </NavLink>
              );
            })}
          </div>

          {/* Secondary Operations & Tools */}
          <div className="pt-2 border-t border-ce-border/60 space-y-1">
            {!isCollapsed && (
              <button
                onClick={() => setShowSecondaryOps(!showSecondaryOps)}
                className="w-full flex items-center justify-between text-[10px] font-mono uppercase tracking-widest text-ce-text-muted px-3 py-1 font-semibold hover:text-ce-text-primary transition-colors cursor-pointer"
              >
                <span>Forensic Operations</span>
                <span className="text-[10px] text-ce-text-muted">{showSecondaryOps ? '▲' : '▼'}</span>
              </button>
            )}

            {(showSecondaryOps || isCollapsed) && secondaryNavigation.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  title={isCollapsed ? item.name : undefined}
                  className={({ isActive }) => `
                    flex items-center gap-3 px-3 py-1.5 rounded-md text-xs font-medium transition-all relative group
                    ${isActive 
                      ? 'bg-ce-surface-subtle text-ce-text-primary font-bold' 
                      : 'text-ce-text-muted hover:bg-ce-surface-subtle/40 hover:text-ce-text-secondary'}
                    ${isCollapsed ? 'justify-center px-0' : ''}
                  `}
                >
                  {({ isActive }) => (
                    <>
                      <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-ce-brand' : 'text-ce-text-muted group-hover:text-ce-text-secondary'}`} />
                      {!isCollapsed && (
                        <span className="truncate flex-1">{item.name}</span>
                      )}
                    </>
                  )}
                </NavLink>
              );
            })}
          </div>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-ce-border bg-ce-surface shrink-0 space-y-3">
          {!isCollapsed ? (
            <div className="flex items-center justify-between text-[11px] font-mono text-ce-text-secondary">
              <div className="flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-ce-success" />
                <span>Audit Ledger</span>
              </div>
              <span className="text-ce-success">SYNCED</span>
            </div>
          ) : (
            <Lock className="w-4 h-4 text-ce-success mx-auto" title="Ledger Synced" />
          )}

          <button
            onClick={() => {
              localStorage.removeItem('cee_auth_token');
              localStorage.removeItem('cee_user');
              localStorage.removeItem('cee_is_sandbox');
              window.location.href = '#/login';
            }}
            className={`w-full flex items-center justify-center gap-2 bg-ce-surface-subtle hover:bg-ce-danger/10 text-ce-text-secondary hover:text-ce-danger border border-ce-border py-1.5 rounded transition-colors text-xs font-mono ${isCollapsed ? 'px-0' : ''}`}
            title="Disconnect & Terminate Session"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            {!isCollapsed && <span>Terminate Session</span>}
          </button>
        </div>
      </aside>
    </>
  );
};

