import React, { useState } from 'react';
import { PageHeader } from '../../components/layout/PageHeader';
import { useApp } from '../../context/AppContext';
import { useTheme } from '../../context/ThemeContext';
import { 
  Building2, 
  ShieldCheck, 
  Blocks, 
  CheckCircle2, 
  KeyRound, 
  UserCheck, 
  PlusCircle, 
  Fingerprint, 
  Lock, 
  ArrowRightLeft, 
  Eye, 
  FileCheck,
  Sun,
  Moon,
  Palette,
  Users,
  UserPlus,
  ShieldAlert
} from 'lucide-react';

export const SettingsPage = () => {
  const { theme, isDark, setTheme } = useTheme();
  const { 
    currentOrg,
    switchOrg,
    organizations,
    currentRole, 
    switchRole, 
    roles, 
    walletAddress, 
    did, 
    connectWallet,
    registeredIdentities, 
    registerDIDIdentity, 
    assignRoleToAddress,
    orgUsers,
    addOrgUser,
    updateOrgUserRole,
    toggleOrgUserStatus,
    getUsersForOrg
  } = useApp();

  const [showAddModal, setShowAddModal] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserAddress, setNewUserAddress] = useState('');
  const [newUserRole, setNewUserRole] = useState('FIRST_RESPONDER');

  // Tenant / Organization Scoped User Management State
  const [showAddOrgUserModal, setShowAddOrgUserModal] = useState(false);
  const [newOrgUserName, setNewOrgUserName] = useState('');
  const [newOrgUserEmail, setNewOrgUserEmail] = useState('');
  const [newOrgUserRole, setNewOrgUserRole] = useState('FORENSIC_ANALYST');
  const [userActionSuccess, setUserActionSuccess] = useState('');

  const currentOrgUsers = getUsersForOrg ? getUsersForOrg(currentOrg?.id) : [];

  const sessionUser = React.useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem('cee_user') || '{}');
    } catch {
      return {};
    }
  }, [currentOrg, currentRole]);

  // Being an Admin in one organization does not automatically make the user an Admin in another organization
  const isOrgAdmin = (currentRole.id === 'ADMINISTRATOR' || currentRole.id === 'ADMIN' || Boolean(currentRole?.permissions?.isAdministrator)) &&
                     (!sessionUser.orgId || sessionUser.orgId === currentOrg?.id || sessionUser.organization_id === currentOrg?.code || sessionUser.organization_id === currentOrg?.id);
  const isAdmin = isOrgAdmin;

  const handleCreateOrgUser = (e) => {
    e.preventDefault();
    if (!newOrgUserName.trim() || !newOrgUserEmail.trim()) return;
    addOrgUser({
      name: newOrgUserName.trim(),
      email: newOrgUserEmail.trim(),
      role: newOrgUserRole,
      orgId: currentOrg?.id
    });
    setUserActionSuccess(`Successfully provisioned ${newOrgUserName.trim()} in ${currentOrg?.name}`);
    setTimeout(() => setUserActionSuccess(''), 4500);
    setNewOrgUserName('');
    setNewOrgUserEmail('');
    setNewOrgUserRole('FORENSIC_ANALYST');
    setShowAddOrgUserModal(false);
  };

  const handleRegisterNewUser = (e) => {
    e.preventDefault();
    if (!newUserAddress.trim()) return;
    registerDIDIdentity(
      newUserAddress.trim(),
      `did:ethr:${newUserAddress.trim()}`,
      newUserName.trim() || `Identity ${newUserAddress.substring(0, 6)}`,
      newUserRole
    );
    setNewUserName('');
    setNewUserAddress('');
    setShowAddModal(false);
  };

  const rbacMatrix = [
    {
      action: 'Collect & Ingest Evidence',
      description: 'Initial seizure, bitstream acquisition, and cryptographic hashing',
      ADMIN: true,
      CUSTODIAN: false,
      INVESTIGATOR: true,
      FORENSIC: false,
      RESPONDER: true,
      AUDITOR: false
    },
    {
      action: 'Generate SHA-256 Digest',
      description: 'Compute verifiable cryptographic bitstream hash over exhibit files',
      ADMIN: true,
      CUSTODIAN: true,
      INVESTIGATOR: true,
      FORENSIC: true,
      RESPONDER: true,
      AUDITOR: true
    },
    {
      action: 'Seal Evidence Manifest',
      description: 'Sign and seal evidence metadata with HSM/mTLS cryptographic signature',
      ADMIN: true,
      CUSTODIAN: true,
      INVESTIGATOR: true,
      FORENSIC: false,
      RESPONDER: true,
      AUDITOR: false
    },
    {
      action: 'Transfer Custody',
      description: 'Sign and execute monotonic custody transfer between agencies',
      ADMIN: true,
      CUSTODIAN: true,
      INVESTIGATOR: true,
      FORENSIC: true,
      RESPONDER: true,
      AUDITOR: false
    },
    {
      action: 'Sandbox Malware Analysis',
      description: 'Perform reverse engineering and analysis in isolated environments',
      ADMIN: true,
      CUSTODIAN: false,
      INVESTIGATOR: false,
      FORENSIC: true,
      RESPONDER: false,
      AUDITOR: false
    },
    {
      action: 'Derive Child Artifacts',
      description: 'Create child evidence exhibits (e.g. memory dump extracts, PCAP slices)',
      ADMIN: true,
      CUSTODIAN: false,
      INVESTIGATOR: false,
      FORENSIC: true,
      RESPONDER: false,
      AUDITOR: false
    },
    {
      action: 'Zero-Trust Root Verification',
      description: 'Cryptographically verify observed SHA-256 hash vs on-chain root',
      ADMIN: true,
      CUSTODIAN: true,
      INVESTIGATOR: true,
      FORENSIC: true,
      RESPONDER: true,
      AUDITOR: true
    },
    {
      action: 'Manage Retention Policies',
      description: 'Define, update, and toggle retention schedules and expiry actions',
      ADMIN: true,
      CUSTODIAN: true,
      INVESTIGATOR: false,
      FORENSIC: false,
      RESPONDER: false,
      AUDITOR: false
    },
    {
      action: 'Apply Legal Hold',
      description: 'Impose legal hold preservation orders, pausing countdown and blocking deletion',
      ADMIN: true,
      CUSTODIAN: true,
      INVESTIGATOR: true,
      FORENSIC: false,
      RESPONDER: false,
      AUDITOR: false
    },
    {
      action: 'Release Legal Hold',
      description: 'Lift preservation orders upon official court/custodian decree',
      ADMIN: true,
      CUSTODIAN: true,
      INVESTIGATOR: false,
      FORENSIC: false,
      RESPONDER: false,
      AUDITOR: false
    },
    {
      action: 'Delete Evidence Exhibit',
      description: 'Permanently remove expired or unauthorized exhibits (BLOCKED on Legal Hold)',
      ADMIN: true,
      CUSTODIAN: false,
      INVESTIGATOR: false,
      FORENSIC: false,
      RESPONDER: false,
      AUDITOR: false
    },
    {
      action: 'Read Ledger & Lineage DAG',
      description: 'Inspect immutable blockchain event streams, lineage DAG, and custody records',
      ADMIN: true,
      CUSTODIAN: true,
      INVESTIGATOR: true,
      FORENSIC: true,
      RESPONDER: true,
      AUDITOR: true
    }
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings & RBAC Governance"
        subtitle="Manage Decentralized Identifiers (DIDs), Separate Organizations from Role-Based Access Control, and Smart Contract Permissions."
        breadcrumbs={['Dashboard', 'Settings & Governance']}
      />

      {/* Active Identity & Perspective Switcher */}
      <div className="rounded-lg bg-ce-surface border border-ce-border p-6 shadow-sm space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-ce-border">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-ce-brand" />
            <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-ce-text-primary">
              Active Decentralized Identity & Context
            </h3>
          </div>
          <span className="text-[11px] font-mono px-2.5 py-0.5 rounded bg-ce-brand/10 border border-ce-brand/30 text-ce-brand font-semibold">
            W3C Compliant DID
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
          <div className="p-4 rounded-md bg-ce-bg border border-ce-border shadow-sm">
            <span className="text-[10px] uppercase text-ce-text-muted block font-bold tracking-wider">
              Active Organization (WHERE):
            </span>
            <span className="text-ce-text-primary font-bold text-sm mt-1.5 block">
              {currentOrg?.name || currentRole.orgName}
            </span>
            <span className="text-[10px] text-ce-text-muted mt-1 block">
              Jurisdiction: {currentOrg?.function || 'Cyber Evidence Exchange'}
            </span>
          </div>

          <div className="p-4 rounded-md bg-ce-bg border border-ce-border shadow-sm">
            <span className="text-[10px] uppercase text-ce-text-muted block font-bold tracking-wider">
              Assigned Role (WHAT):
            </span>
            <span className="text-ce-brand font-bold text-sm mt-1.5 block">
              {currentRole.name || currentRole.roleName}
            </span>
            <span className="text-[10px] text-ce-text-muted mt-1 block">
              Authority: {currentRole.id === 'ADMINISTRATOR' ? 'Platform Administrator' : currentRole.id === 'AUDITOR' ? 'Independent Verifier' : 'Agency Operator'}
            </span>
          </div>

          <div className="p-4 rounded-md bg-ce-bg border border-ce-border shadow-sm flex flex-col justify-between">
            <div>
              <span className="text-[10px] uppercase text-ce-text-muted block font-bold tracking-wider">
                Decentralized Identifier (DID):
              </span>
              <span className="text-ce-blockchain font-bold text-xs mt-1.5 block truncate" title={did || `did:ethr:${walletAddress}`}>
                {did || `did:ethr:${walletAddress || '0x...'}`}
              </span>
            </div>
            <button
              onClick={connectWallet}
              className="mt-2 text-[10px] font-sans font-bold text-ce-brand hover:underline self-start flex items-center gap-1"
            >
              <KeyRound className="w-3 h-3" />
              <span>Connect / Re-authenticate Wallet</span>
            </button>
          </div>
        </div>

        {/* 1. Organization Switcher */}
        <div className="p-4 rounded-md bg-ce-surface-subtle border border-ce-border/60 space-y-2">
          <label className="text-[10px] uppercase font-mono text-ce-text-muted block font-bold tracking-wider">
            1. Switch Active Organization (Data Scope / Agency Jurisdiction):
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2">
            {Object.values(organizations || {}).map((org) => {
              const isCurrent = currentOrg?.id === org.id;
              return (
                <button
                  key={org.id}
                  onClick={() => switchOrg(org.id)}
                  className={`p-2.5 rounded-md border text-left text-xs font-mono transition-all shadow-sm ${
                    isCurrent
                      ? 'bg-ce-brand/10 border-ce-brand text-ce-brand font-bold ring-1 ring-ce-brand/30'
                      : 'bg-ce-bg border-ce-border text-ce-text-secondary hover:text-ce-text-primary hover:border-ce-brand/50'
                  }`}
                >
                  <div className="text-[11px] font-bold truncate">{org.shortName}</div>
                  <div className="text-[9px] opacity-75 mt-0.5 truncate">{org.code}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. RBAC Role Switcher */}
        <div className="p-4 rounded-md bg-ce-surface-subtle border border-ce-border/60 space-y-2">
          <label className="text-[10px] uppercase font-mono text-ce-text-muted block font-bold tracking-wider">
            2. Switch RBAC Role (Operational Permissions & Privileges):
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            {Object.values(roles || {}).map((r) => {
              const isCurrent = currentRole.id === r.id;
              return (
                <button
                  key={r.id}
                  onClick={() => switchRole(r.id)}
                  className={`p-2.5 rounded-md border text-left text-xs font-mono transition-all shadow-sm ${
                    isCurrent
                      ? 'bg-ce-brand/10 border-ce-brand text-ce-brand font-bold ring-1 ring-ce-brand/30'
                      : 'bg-ce-bg border-ce-border text-ce-text-secondary hover:text-ce-text-primary hover:border-ce-brand/50'
                  }`}
                >
                  <div className="text-[11px] font-bold truncate">{r.name}</div>
                  <div className="text-[9px] opacity-75 mt-0.5 truncate">{r.id}</div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Appearance & Theme Mode Switcher */}
      <div className="rounded-lg bg-ce-surface border border-ce-border p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-ce-border">
          <div className="flex items-center gap-2">
            <Palette className="w-4 h-4 text-ce-brand" />
            <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-ce-text-primary">
              Appearance & Interface Theme
            </h3>
          </div>
          <span className="text-[11px] font-mono px-2.5 py-0.5 rounded bg-ce-surface-subtle border border-ce-border text-ce-text-secondary font-semibold">
            {theme === 'dark' ? 'Dark SOC Mode Active' : 'Light Forensic Mode Active'}
          </span>
        </div>

        <p className="text-xs text-ce-text-secondary leading-relaxed">
          Select your preferred display theme. The selected mode is automatically stored locally and applies to the entire forensics and chain-of-custody dashboard.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
          {/* Light Theme Option Card */}
          <div
            onClick={() => setTheme('light')}
            className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-3.5 select-none ${
              !isDark
                ? 'bg-amber-500/5 border-amber-500/50 shadow-sm ring-1 ring-amber-500/30'
                : 'bg-ce-bg border-ce-border hover:border-ce-text-muted/60 opacity-80 hover:opacity-100'
            }`}
          >
            <div className={`p-2.5 rounded-lg border shrink-0 ${
              !isDark ? 'bg-amber-500/10 border-amber-500/30 text-amber-600' : 'bg-ce-surface-subtle border-ce-border text-ce-text-muted'
            }`}>
              <Sun className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-mono font-bold text-ce-text-primary uppercase tracking-wide">
                  Light Theme
                </span>
                {!isDark && (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-300 font-bold border border-amber-500/30">
                    ACTIVE
                  </span>
                )}
              </div>
              <p className="text-xs text-ce-text-secondary mt-1 leading-relaxed">
                Crisp off-white surfaces with deep navy typography. Ideal for daylight analysis, courtroom projection, and audit documentation.
              </p>
            </div>
          </div>

          {/* Dark Theme Option Card */}
          <div
            onClick={() => setTheme('dark')}
            className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-3.5 select-none ${
              isDark
                ? 'bg-ce-brand/5 border-ce-brand/50 shadow-sm ring-1 ring-ce-brand/30'
                : 'bg-ce-bg border-ce-border hover:border-ce-text-muted/60 opacity-80 hover:opacity-100'
            }`}
          >
            <div className={`p-2.5 rounded-lg border shrink-0 ${
              isDark ? 'bg-ce-brand/10 border-ce-brand/30 text-ce-brand' : 'bg-ce-surface-subtle border-ce-border text-ce-text-muted'
            }`}>
              <Moon className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-mono font-bold text-ce-text-primary uppercase tracking-wide">
                  Dark Theme
                </span>
                {isDark && (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-ce-brand/15 text-ce-brand font-bold border border-ce-brand/30">
                    ACTIVE
                  </span>
                )}
              </div>
              <p className="text-xs text-ce-text-secondary mt-1 leading-relaxed">
                Deep cybersecurity SOC mode with high-contrast neon telemetry accents. Ideal for low-light command centers and security operations.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Organization Scoped User Management */}
      <div className="rounded-lg bg-ce-surface border border-ce-border p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-ce-border gap-3">
          <div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-ce-brand" />
              <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-ce-text-primary">
                USER MANAGEMENT — {currentOrg?.name || 'Cyber Defense Lab'}
              </h3>
            </div>
            <p className="text-xs text-ce-text-muted mt-1">
              Personnel directory and RBAC authority strictly scoped to <span className="text-ce-text-primary font-bold">{currentOrg?.name}</span>.
              Organization is WHERE the user belongs; Role is WHAT operational privileges they hold.
            </p>
          </div>
          
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[10px] font-mono px-2.5 py-1 rounded bg-ce-surface-subtle border border-ce-border text-ce-text-secondary font-semibold">
              Scope: {currentOrg?.code || currentOrg?.id} ({currentOrgUsers.length} Users)
            </span>
            {isAdmin && (
              <button
                onClick={() => setShowAddOrgUserModal(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-ce-brand text-ce-bg font-mono text-xs font-bold hover:bg-ce-brand/90 transition-colors cursor-pointer shadow-sm"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Add User to Organization</span>
              </button>
            )}
          </div>
        </div>

        {!isAdmin && (
          <div className="p-3 rounded-md bg-amber-500/10 border border-amber-500/30 flex items-center gap-2 text-xs font-mono text-amber-400">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>Read-Only Scope: Only <strong>Organization Administrators</strong> can provision, modify roles, or disable users in {currentOrg?.shortName || currentOrg?.name}.</span>
          </div>
        )}

        {userActionSuccess && (
          <div className="p-3 rounded-md bg-ce-success/10 border border-ce-success/30 flex items-center gap-2 text-xs font-mono text-ce-success">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{userActionSuccess}</span>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs border border-ce-border rounded-md overflow-hidden">
            <thead className="bg-ce-surface-subtle text-ce-text-muted uppercase text-[10px] tracking-wider border-b border-ce-border">
              <tr>
                <th className="p-3">Personnel / Email</th>
                <th className="p-3">Decentralized Identifier (DID)</th>
                <th className="p-3">Assigned RBAC Role</th>
                <th className="p-3">Account Status</th>
                {isAdmin && <th className="p-3 text-right">Admin Privileges</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-ce-border bg-ce-bg">
              {currentOrgUsers.length === 0 ? (
                <tr>
                  <td colSpan={isAdmin ? 5 : 4} className="p-6 text-center text-ce-text-muted">
                    No users provisioned for {currentOrg?.name} yet.
                  </td>
                </tr>
              ) : (
                currentOrgUsers.map((usr) => (
                  <tr key={usr.id} className="hover:bg-ce-surface-subtle/50 transition-colors">
                    <td className="p-3 font-semibold text-ce-text-primary">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-ce-brand/10 border border-ce-brand/30 flex items-center justify-center text-[11px] font-bold text-ce-brand shrink-0">
                          {usr.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-bold text-xs">{usr.name}</div>
                          <div className="text-[10px] text-ce-text-muted font-normal">{usr.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-3 text-ce-blockchain text-[11px] truncate max-w-[200px]" title={usr.did}>
                      {usr.did}
                    </td>
                    <td className="p-3">
                      <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold border ${
                        usr.role === 'ADMINISTRATOR' || usr.role === 'ADMIN'
                          ? 'text-rose-400 bg-rose-500/10 border-rose-500/30'
                          : usr.role === 'EVIDENCE_CUSTODIAN' || usr.role === 'MANAGER'
                          ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30'
                          : usr.role === 'INVESTIGATOR'
                          ? 'text-amber-400 bg-amber-500/10 border-amber-500/30'
                          : usr.role === 'FORENSIC_ANALYST'
                          ? 'text-purple-400 bg-purple-500/10 border-purple-500/30'
                          : usr.role === 'AUDITOR'
                          ? 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30'
                          : 'text-blue-400 bg-blue-500/10 border-blue-500/30'
                      }`}>
                        {roles[usr.role]?.name || usr.role}
                      </span>
                    </td>
                    <td className="p-3">
                      <span className={`inline-flex items-center gap-1.5 text-[10px] font-semibold px-2 py-0.5 rounded border ${
                        usr.status === 'ACTIVE' 
                          ? 'text-ce-success bg-ce-success/10 border-ce-success/20' 
                          : 'text-ce-danger bg-ce-danger/10 border-ce-danger/20'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${usr.status === 'ACTIVE' ? 'bg-ce-success' : 'bg-ce-danger'}`} />
                        {usr.status || 'ACTIVE'}
                      </span>
                    </td>
                    {isAdmin && (
                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <select
                            value={usr.role}
                            onChange={(e) => updateOrgUserRole(usr.id, e.target.value)}
                            className="bg-ce-surface border border-ce-border rounded px-2 py-1 text-[11px] text-ce-text-primary focus:outline-none focus:border-ce-brand cursor-pointer"
                            title="Update Role"
                          >
                            <option value="ADMINISTRATOR">Organization Administrator</option>
                            <option value="FORENSIC_ANALYST">Forensic Analyst</option>
                            <option value="EVIDENCE_CUSTODIAN">Evidence Custodian</option>
                            <option value="INVESTIGATOR">Investigator</option>
                            <option value="AUDITOR">Auditor</option>
                            <option value="FIRST_RESPONDER">First Responder</option>
                          </select>

                          <button
                            onClick={() => toggleOrgUserStatus(usr.id)}
                            className={`px-2 py-1 rounded text-[10px] font-bold border transition-colors cursor-pointer ${
                              usr.status === 'ACTIVE'
                                ? 'border-ce-danger/30 text-ce-danger hover:bg-ce-danger/10'
                                : 'border-ce-success/30 text-ce-success hover:bg-ce-success/10'
                            }`}
                            title={usr.status === 'ACTIVE' ? 'Disable Account' : 'Enable Account'}
                          >
                            {usr.status === 'ACTIVE' ? 'Disable' : 'Enable'}
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* DID Registry & Smart Contract RBAC Manager */}
      <div className="rounded-lg bg-ce-surface border border-ce-border p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-ce-border">
          <div className="flex items-center gap-2">
            <Fingerprint className="w-4 h-4 text-ce-blockchain" />
            <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-ce-text-primary">
              Decentralized Identity (DID) & Smart Contract RBAC Registry
            </h3>
          </div>
          {(currentRole.id === 'ADMIN' || currentRole.id === 'ADMINISTRATOR' || currentRole?.permissions?.isAdministrator) && (
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-ce-brand text-ce-bg font-mono text-xs font-bold hover:bg-ce-brand/90 transition-colors"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Register New Identity</span>
            </button>
          )}
        </div>

        <p className="text-xs text-ce-text-muted">
          Each identity represents a cryptographically verifiable participant authenticated via public-key cryptography.
          Administrators govern role assignments on the smart contract to restrict minting, allocation, and verification.
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs border border-ce-border rounded-md overflow-hidden">
            <thead className="bg-ce-surface-subtle text-ce-text-muted uppercase text-[10px] tracking-wider border-b border-ce-border">
              <tr>
                <th className="p-3">Identity Name / Agency</th>
                <th className="p-3">Decentralized Identifier (DID)</th>
                <th className="p-3">EVM Wallet Address</th>
                <th className="p-3">Smart Contract Role</th>
                <th className="p-3">On-Chain Status</th>
                {(currentRole.id === 'ADMIN' || currentRole.id === 'ADMINISTRATOR' || currentRole?.permissions?.isAdministrator) && (
                  <th className="p-3 text-right">Admin Role Control</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-ce-border bg-ce-bg">
              {registeredIdentities.map((item, idx) => (
                <tr key={idx} className="hover:bg-ce-surface-subtle/50 transition-colors">
                  <td className="p-3 font-semibold text-ce-text-primary">
                    <div className="flex items-center gap-1.5">
                      <UserCheck className="w-3.5 h-3.5 text-ce-brand" />
                      <span>{item.name}</span>
                    </div>
                  </td>
                  <td className="p-3 text-ce-blockchain text-[11px] truncate max-w-[200px]" title={item.didURI}>
                    {item.didURI}
                  </td>
                  <td className="p-3 text-ce-text-muted text-[11px]">
                    {item.address.substring(0, 8)}...{item.address.substring(item.address.length - 6)}
                  </td>
                  <td className="p-3">
                    <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold border ${
                      item.role === 'ADMIN' || item.role === 'ADMINISTRATOR'
                        ? 'text-rose-400 bg-rose-500/10 border-rose-500/30'
                        : item.role === 'MANAGER' || item.role === 'EVIDENCE_CUSTODIAN'
                        ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30'
                        : item.role === 'INVESTIGATOR'
                        ? 'text-amber-400 bg-amber-500/10 border-amber-500/30'
                        : item.role === 'FORENSIC_ANALYST'
                        ? 'text-purple-400 bg-purple-500/10 border-purple-500/30'
                        : item.role === 'AUDITOR'
                        ? 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30'
                        : 'text-blue-400 bg-blue-500/10 border-blue-500/30'
                    }`}>
                      {item.role}
                    </span>
                  </td>
                  <td className="p-3">
                    <span className="inline-flex items-center gap-1 text-[10px] text-ce-success font-semibold">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>VERIFIED</span>
                    </span>
                  </td>
                  {(currentRole.id === 'ADMIN' || currentRole.id === 'ADMINISTRATOR' || currentRole?.permissions?.isAdministrator) && (
                    <td className="p-3 text-right">
                      <select
                        value={item.role}
                        onChange={(e) => assignRoleToAddress(item.address, e.target.value)}
                        className="bg-ce-surface border border-ce-border rounded px-2 py-1 text-[11px] text-ce-text-primary focus:outline-none focus:border-ce-brand"
                      >
                        <option value="FIRST_RESPONDER">First Responder</option>
                        <option value="FORENSIC_ANALYST">Forensic Analyst</option>
                        <option value="EVIDENCE_CUSTODIAN">Evidence Custodian</option>
                        <option value="INVESTIGATOR">Investigator</option>
                        <option value="AUDITOR">Auditor</option>
                        <option value="ADMINISTRATOR">Administrator</option>
                      </select>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* RBAC Governance Matrix */}
      <div className="rounded-lg bg-ce-surface border border-ce-border p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-ce-border">
          <Lock className="w-4 h-4 text-ce-warning" />
          <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-ce-text-primary">
            Smart Contract Role Permissions Matrix (OpenZeppelin AccessControl)
          </h3>
        </div>

        <p className="text-xs text-ce-text-muted">
          All operations are enforced by bytecode-level modifiers (e.g. <code>onlyRole(ROLE_ADMIN)</code>, <code>onlyRole(ROLE_AUDITOR)</code>).
          Unauthorized invocations trigger EVM reverts, preserving tamper-proof access boundaries.
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs border border-ce-border rounded-md overflow-hidden">
            <thead className="bg-ce-surface-subtle text-ce-text-muted uppercase text-[10px] tracking-wider border-b border-ce-border">
              <tr>
                <th className="p-3">Operation / Capability</th>
                <th className="p-3">Security Governance Rule</th>
                <th className="p-3 text-center text-rose-400 font-bold">Admin</th>
                <th className="p-3 text-center text-emerald-400 font-bold">Custodian</th>
                <th className="p-3 text-center text-amber-400 font-bold">Investigator</th>
                <th className="p-3 text-center text-purple-400 font-bold">Forensic</th>
                <th className="p-3 text-center text-blue-400 font-bold">Responder</th>
                <th className="p-3 text-center text-cyan-400 font-bold">Auditor</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ce-border bg-ce-bg">
              {rbacMatrix.map((m, idx) => (
                <tr key={idx} className="hover:bg-ce-surface-subtle/50 transition-colors">
                  <td className="p-3 font-semibold text-ce-text-primary">{m.action}</td>
                  <td className="p-3 text-ce-text-muted text-[11px]">{m.description}</td>
                  <td className="p-3 text-center">
                    {m.ADMIN ? <span className="text-ce-success font-bold">✓ ALLOWED</span> : <span className="text-ce-text-muted opacity-40">✕ DENIED</span>}
                  </td>
                  <td className="p-3 text-center">
                    {m.CUSTODIAN ? <span className="text-ce-success font-bold">✓ ALLOWED</span> : <span className="text-ce-text-muted opacity-40">✕ DENIED</span>}
                  </td>
                  <td className="p-3 text-center">
                    {m.INVESTIGATOR ? <span className="text-ce-success font-bold">✓ ALLOWED</span> : <span className="text-ce-text-muted opacity-40">✕ DENIED</span>}
                  </td>
                  <td className="p-3 text-center">
                    {m.FORENSIC ? <span className="text-ce-success font-bold">✓ ALLOWED</span> : <span className="text-ce-text-muted opacity-40">✕ DENIED</span>}
                  </td>
                  <td className="p-3 text-center">
                    {m.RESPONDER ? <span className="text-ce-success font-bold">✓ ALLOWED</span> : <span className="text-ce-text-muted opacity-40">✕ DENIED</span>}
                  </td>
                  <td className="p-3 text-center">
                    {m.AUDITOR ? <span className="text-ce-success font-bold">✓ ALLOWED</span> : <span className="text-ce-text-muted opacity-40">✕ DENIED</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Network & Consensus Section */}
      <div className="rounded-lg bg-ce-surface border border-ce-border p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-ce-border">
          <Blocks className="w-4 h-4 text-ce-blockchain" />
          <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-ce-text-primary">
            Blockchain Ledger & Smart Contract Deployment Status
          </h3>
        </div>

        <div className="space-y-3 font-mono text-xs">
          <div className="p-4 rounded-md bg-ce-bg border border-ce-border flex items-center justify-between shadow-sm">
            <div>
              <div className="font-bold text-ce-text-primary">Smart Contract Standard</div>
              <div className="text-ce-text-muted text-[11px] font-sans mt-1">
                ERC-721 (Unique NFT Asset Tokens) + OpenZeppelin AccessControl (RBAC) + DID Registry
              </div>
            </div>
            <span className="px-3 py-1.5 rounded-sm bg-ce-blockchain/10 text-ce-blockchain border border-ce-blockchain/30 font-bold tracking-wider">
              HASHGUARD.sol v2.0
            </span>
          </div>

          <div className="p-4 rounded-md bg-ce-bg border border-ce-border flex items-center justify-between shadow-sm">
            <div>
              <div className="font-bold text-ce-text-primary">Contract Deployment Address</div>
              <div className="text-ce-text-muted text-[11px] font-sans mt-1">
                Local Anvil / Hardhat Node (Chain ID: 31337 / 1337)
              </div>
            </div>
            <span className="font-mono text-xs text-ce-brand font-bold bg-ce-brand/10 px-2.5 py-1 rounded border border-ce-brand/20">
              0x5FbDB2315678afecb367f032d93F642f64180aa3
            </span>
          </div>

          <div className="p-4 rounded-md bg-ce-bg border border-ce-border flex items-center justify-between shadow-sm">
            <div>
              <div className="font-bold text-ce-text-primary">Audit Trail Immutability</div>
              <div className="text-ce-text-muted text-[11px] font-sans mt-1">
                Cryptographic hashing (SHA-256) + ECDSA secp256k1 signatures anchored to block receipts
              </div>
            </div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm bg-ce-success/10 text-ce-success border border-ce-success/30 font-bold tracking-wider">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Tamper-Evident Active</span>
            </span>
          </div>
        </div>
      </div>

      {/* Add New Identity Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-ce-surface border border-ce-border rounded-xl shadow-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-ce-border">
              <h4 className="text-sm font-mono font-bold uppercase text-ce-text-primary flex items-center gap-2">
                <Fingerprint className="w-4 h-4 text-ce-brand" />
                <span>Register User DID Identity</span>
              </h4>
              <button 
                onClick={() => setShowAddModal(false)}
                className="text-ce-text-muted hover:text-ce-text-primary font-mono text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleRegisterNewUser} className="space-y-4 text-xs font-mono">
              <div>
                <label className="block text-[11px] text-ce-text-muted uppercase mb-1 font-bold">
                  User / Agency Name:
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Cyber Crime Unit 4"
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  className="w-full bg-ce-bg border border-ce-border rounded px-3 py-2 text-ce-text-primary focus:outline-none focus:border-ce-brand"
                />
              </div>

              <div>
                <label className="block text-[11px] text-ce-text-muted uppercase mb-1 font-bold">
                  EVM Wallet Address (0x...):
                </label>
                <input
                  type="text"
                  required
                  placeholder="0x1234567890abcdef..."
                  value={newUserAddress}
                  onChange={(e) => setNewUserAddress(e.target.value)}
                  className="w-full bg-ce-bg border border-ce-border rounded px-3 py-2 text-ce-text-primary focus:outline-none focus:border-ce-brand"
                />
              </div>

              <div>
                <label className="block text-[11px] text-ce-text-muted uppercase mb-1 font-bold">
                  Initial RBAC Role:
                </label>
                <select
                  value={newUserRole}
                  onChange={(e) => setNewUserRole(e.target.value)}
                  className="w-full bg-ce-bg border border-ce-border rounded px-3 py-2 text-ce-text-primary focus:outline-none focus:border-ce-brand"
                >
                  <option value="FIRST_RESPONDER">First Responder (CERT / Incident Intake)</option>
                  <option value="FORENSIC_ANALYST">Forensic Analyst (Lab / Reverse Engineering)</option>
                  <option value="EVIDENCE_CUSTODIAN">Evidence Custodian (Court / Vault Governance)</option>
                  <option value="INVESTIGATOR">Investigator (Cyber Police LEA / FIR)</option>
                  <option value="AUDITOR">Auditor (Independent Oversight)</option>
                  <option value="ADMINISTRATOR">Administrator (Platform Governance)</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded bg-ce-surface-subtle border border-ce-border text-ce-text-secondary hover:text-ce-text-primary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-ce-brand text-ce-bg font-bold hover:bg-ce-brand/90 shadow-sm"
                >
                  Anchor DID on Ledger
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add User to Organization Modal */}
      {showAddOrgUserModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-ce-surface border border-ce-border rounded-xl shadow-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-ce-border">
              <h4 className="text-sm font-mono font-bold uppercase text-ce-text-primary flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-ce-brand" />
                <span>Add Personnel to Organization</span>
              </h4>
              <button 
                onClick={() => setShowAddOrgUserModal(false)}
                className="text-ce-text-muted hover:text-ce-text-primary font-mono text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateOrgUser} className="space-y-4 text-xs font-mono">
              <div>
                <label className="block text-[11px] text-ce-text-muted uppercase mb-1 font-bold">
                  Organization Scope:
                </label>
                <input
                  type="text"
                  disabled
                  value={`${currentOrg?.name} (${currentOrg?.code || currentOrg?.id})`}
                  className="w-full bg-ce-surface-subtle border border-ce-border rounded px-3 py-2 text-ce-text-muted cursor-not-allowed"
                />
                <span className="text-[10px] text-ce-text-muted mt-1 block">
                  New users are strictly registered to {currentOrg?.name}.
                </span>
              </div>

              <div>
                <label className="block text-[11px] text-ce-text-muted uppercase mb-1 font-bold">
                  Full Name:
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Jennifer Cruz"
                  value={newOrgUserName}
                  onChange={(e) => setNewOrgUserName(e.target.value)}
                  className="w-full bg-ce-bg border border-ce-border rounded px-3 py-2 text-ce-text-primary focus:outline-none focus:border-ce-brand"
                />
              </div>

              <div>
                <label className="block text-[11px] text-ce-text-muted uppercase mb-1 font-bold">
                  Work Email:
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. jcruz@cyberlab.local"
                  value={newOrgUserEmail}
                  onChange={(e) => setNewOrgUserEmail(e.target.value)}
                  className="w-full bg-ce-bg border border-ce-border rounded px-3 py-2 text-ce-text-primary focus:outline-none focus:border-ce-brand"
                />
              </div>

              <div>
                <label className="block text-[11px] text-ce-text-muted uppercase mb-1 font-bold">
                  Assigned RBAC Role:
                </label>
                <select
                  value={newOrgUserRole}
                  onChange={(e) => setNewOrgUserRole(e.target.value)}
                  className="w-full bg-ce-bg border border-ce-border rounded px-3 py-2 text-ce-text-primary focus:outline-none focus:border-ce-brand cursor-pointer"
                >
                  <option value="FORENSIC_ANALYST">Forensic Analyst (Evidence analysis, malware sandbox)</option>
                  <option value="EVIDENCE_CUSTODIAN">Evidence Custodian (Vault governance, sealed custody)</option>
                  <option value="INVESTIGATOR">Investigator (Raid seizure, FIR logging)</option>
                  <option value="AUDITOR">Auditor (Independent zero-trust attestation)</option>
                  <option value="FIRST_RESPONDER">First Responder (Incident triage, intake)</option>
                  <option value="ADMINISTRATOR">Organization Administrator (Full tenant governance)</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddOrgUserModal(false)}
                  className="px-4 py-2 rounded bg-ce-surface-subtle border border-ce-border text-ce-text-secondary hover:text-ce-text-primary cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-ce-brand text-ce-bg font-bold hover:bg-ce-brand/90 shadow-sm flex items-center gap-1.5 cursor-pointer"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Provision Officer</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
