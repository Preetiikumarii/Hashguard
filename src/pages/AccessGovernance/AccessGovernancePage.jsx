import React, { useState, useEffect } from 'react';
import { PageHeader } from '../../components/layout/PageHeader';
import { useApp } from '../../context/AppContext';
import { evidenceService } from '../../services/evidenceService';
import { transferService } from '../../services/transferService';
import { TrustContinuityBanner } from '../../components/common/TrustContinuityBanner';
import { 
  ShieldCheck, 
  ShieldAlert, 
  Clock, 
  UserX, 
  UserCheck, 
  CheckCircle2, 
  AlertTriangle, 
  Send, 
  KeyRound, 
  Building2, 
  Lock, 
  Unlock, 
  Users, 
  Plus, 
  RefreshCw,
  FileCheck2,
  FileWarning
} from 'lucide-react';

export const AccessGovernancePage = () => {
  const { 
    currentOrg, 
    currentRole, 
    did, 
    registeredIdentities, 
    revokedDids, 
    isDidRevoked,
    executeRevocationCascade, 
    restoreRevokedIdentity, 
    grantTemporaryAccess, 
    updateAssetSensitivity, 
    approveCriticalTransfer, 
    refreshTrigger, 
    triggerRefresh 
  } = useApp();

  const [evidenceList, setEvidenceList] = useState([]);
  const [transfers, setTransfers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form States
  const [leaseAssetId, setLeaseAssetId] = useState('');
  const [leaseTargetDid, setLeaseTargetDid] = useState('');
  const [leaseHours, setLeaseHours] = useState(2);
  const [leaseReason, setLeaseReason] = useState('Dynamic sandbox triage and forensic analysis');
  const [leaseSubmitting, setLeaseSubmitting] = useState(false);
  const [leaseSuccess, setLeaseSuccess] = useState('');

  // Revocation Form State
  const [revokeTargetDid, setRevokeTargetDid] = useState('');
  const [revokeReason, setRevokeReason] = useState('Consortium credential compromise protocol');
  const [revokeSubmitting, setRevokeSubmitting] = useState(false);
  const [revokeSuccess, setRevokeSuccess] = useState('');

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [ev, trf] = await Promise.all([
          evidenceService.getAllEvidence(),
          transferService.getTransfers()
        ]);
        setEvidenceList(ev || []);
        setTransfers(trf || []);
        if (ev && ev.length > 0 && !leaseAssetId) {
          setLeaseAssetId(ev[0].id);
        }
        if (registeredIdentities && registeredIdentities.length > 0 && !leaseTargetDid) {
          setLeaseTargetDid(registeredIdentities[1]?.didURI || registeredIdentities[0]?.didURI);
        }
      } catch (err) {
        console.error('Failed to load governance data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [refreshTrigger]);

  // Handle Temporary Access Submission
  const handleGrantLease = async (e) => {
    e.preventDefault();
    if (!leaseAssetId || !leaseTargetDid) return;
    setLeaseSubmitting(true);
    setLeaseSuccess('');
    try {
      await grantTemporaryAccess(leaseAssetId, {
        targetDid: leaseTargetDid,
        durationHours: Number(leaseHours) || 2,
        reason: leaseReason
      });
      setLeaseSuccess(`Time-bound ${leaseHours}-hour lease successfully issued for ${leaseAssetId} to ${leaseTargetDid.substring(0, 16)}...`);
      setTimeout(() => setLeaseSuccess(''), 6000);
      triggerRefresh();
    } catch (err) {
      alert(`Failed to grant lease: ${err.message}`);
    } finally {
      setLeaseSubmitting(false);
    }
  };

  // Handle Revocation Cascade
  const handleRevokeCascade = async (targetDidToRevoke, customReason) => {
    const target = targetDidToRevoke || revokeTargetDid;
    const reason = customReason || revokeReason;
    if (!target) return;

    if (!window.confirm(`Are you sure you want to trigger a REVOCATION CASCADE for identity: ${target}?\n\nThis will permanently invalidate active roles, drop temporary leases, and block pending custody transfers while preserving historical audit logs.`)) {
      return;
    }

    setRevokeSubmitting(true);
    setRevokeSuccess('');
    try {
      const res = await executeRevocationCascade(target, reason);
      setRevokeSuccess(`Revocation cascade successfully executed for ${target}. All dependent privileges dropped.`);
      setRevokeTargetDid('');
      setTimeout(() => setRevokeSuccess(''), 6000);
      triggerRefresh();
    } catch (err) {
      alert(`Failed to execute revocation cascade: ${err.message}`);
    } finally {
      setRevokeSubmitting(false);
    }
  };

  // Predefined consortium signers for 2-of-3 quorum demo
  const CONSORTIUM_AUTHORITIES = [
    {
      did: 'did:ethr:0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
      name: 'Cmdr. Rajesh Kumar',
      role: 'CERT-Alpha Commander (Org A)',
      org: 'Organization A — CERT-Alpha'
    },
    {
      did: 'did:ethr:0x70997970C51812dc3A010C7d01b50e0d17dc79C8',
      name: 'Dr. Sarah Chen',
      role: 'Cyber Defense Lab Lead (Org B)',
      org: 'Organization B — Cyber Defense Lab'
    },
    {
      did: 'did:ethr:0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC',
      name: 'Hon. Registrar Joshi',
      role: 'Judicial Court Custodian (Org C)',
      org: 'Organization C — Judicial Court Registry'
    }
  ];

  // Critical transfers requiring 2-of-3 quorum
  const criticalTransfers = transfers.filter(t => t.requiresQuorum || t.status === 'AWAITING_APPROVAL');

  // Collect all active temporary leases across evidence items
  const allTemporaryLeases = [];
  evidenceList.forEach(ev => {
    (ev.temporaryAccess || []).forEach(l => {
      allTemporaryLeases.push({
        ...l,
        evidenceId: ev.id,
        evidenceTitle: ev.title,
        sensitivity: ev.sensitivity || 'STANDARD'
      });
    });
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Adaptive Asset Authorization & Access Governance"
        subtitle="Manage Asset Sensitivity, Time-Bound Temporary Leases, 2-of-3 Quorum Approvals, and Revocation Cascades."
        breadcrumbs={['Dashboard', 'Access & Approvals']}
        badge={
          <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-md bg-purple-500/10 text-purple-400 border border-purple-500/30 flex items-center gap-1.5 uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>ADAPTIVE ACCESS ENGINE</span>
          </span>
        }
      />

      {/* Trust Continuity Pipeline Component */}
      <TrustContinuityBanner activeStage="authorization" />

      {/* SECTION 1: ASSET SENSITIVITY GOVERNANCE */}
      <div className="rounded-xl bg-ce-surface border border-ce-border p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-ce-border gap-2">
          <div>
            <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-ce-text-primary flex items-center gap-2">
              <Lock className="w-4 h-4 text-cyan-400" />
              <span>1. Asset Sensitivity & Adaptive Policy Classification</span>
            </h3>
            <p className="text-xs text-ce-text-muted mt-1 font-sans">
              Each asset carries a sensitivity tier. <strong>Critical</strong> assets require time-bound leases and application-level 2-of-3 quorum approval before custody transfer.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded bg-ce-surface-subtle border border-ce-border text-ce-text-secondary">
              TIERS: STANDARD &bull; RESTRICTED &bull; CRITICAL
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs border border-ce-border rounded-lg overflow-hidden">
            <thead className="bg-ce-surface-subtle text-ce-text-muted uppercase text-[10px] tracking-wider border-b border-ce-border">
              <tr>
                <th className="p-3">Asset Exhibit</th>
                <th className="p-3">Asset Category</th>
                <th className="p-3">Current Custodian</th>
                <th className="p-3">Owner DID</th>
                <th className="p-3">Sensitivity Classification</th>
                <th className="p-3 text-right">Adaptive Policy Rule</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ce-border bg-ce-bg">
              {evidenceList.map((ev) => {
                const sensitivity = ev.sensitivity || 'STANDARD';
                return (
                  <tr key={ev.id} className="hover:bg-ce-surface-subtle/50 transition-colors">
                    <td className="p-3 font-semibold text-ce-text-primary">
                      <div className="font-bold text-xs">{ev.id}</div>
                      <div className="text-[10px] text-ce-text-muted truncate max-w-[220px]">{ev.title}</div>
                    </td>
                    <td className="p-3 text-ce-text-secondary text-[11px]">{ev.type}</td>
                    <td className="p-3 text-ce-text-muted text-[11px]">{ev.currentCustodian || ev.sourceOrg}</td>
                    <td className="p-3 text-ce-blockchain text-[10px] truncate max-w-[140px]" title={ev.ownerDid || 'Unassigned'}>
                      {(ev.ownerDid || 'did:ethr:...').substring(0, 14)}...
                    </td>
                    <td className="p-3">
                      <select
                        value={sensitivity}
                        onChange={(e) => updateAssetSensitivity(ev.id, e.target.value)}
                        className={`bg-ce-surface border rounded px-2.5 py-1 text-[11px] font-bold focus:outline-none cursor-pointer ${
                          sensitivity === 'CRITICAL'
                            ? 'text-rose-400 border-rose-500/40 bg-rose-500/10'
                            : sensitivity === 'RESTRICTED'
                            ? 'text-amber-400 border-amber-500/40 bg-amber-500/10'
                            : 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10'
                        }`}
                        title="Reclassify Sensitivity Tier"
                      >
                        <option value="STANDARD">STANDARD</option>
                        <option value="RESTRICTED">RESTRICTED</option>
                        <option value="CRITICAL">CRITICAL</option>
                      </select>
                    </td>
                    <td className="p-3 text-right text-[10px] text-ce-text-muted">
                      {sensitivity === 'CRITICAL' && (
                        <span className="text-rose-400 font-bold flex items-center justify-end gap-1">
                          <ShieldAlert className="w-3 h-3" />
                          <span>Requires 2-of-3 Quorum + Leases</span>
                        </span>
                      )}
                      {sensitivity === 'RESTRICTED' && (
                        <span className="text-amber-400 font-bold flex items-center justify-end gap-1">
                          <Lock className="w-3 h-3" />
                          <span>Explicit DID or Temp Lease</span>
                        </span>
                      )}
                      {sensitivity === 'STANDARD' && (
                        <span className="text-emerald-400 font-semibold flex items-center justify-end gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Standard RBAC Policy</span>
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* SECTION 2: TIME-BOUND TEMPORARY ACCESS LEASES */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form: Issue New Temporary Lease */}
        <div className="rounded-xl bg-ce-surface border border-ce-border p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-ce-border">
            <Clock className="w-4 h-4 text-purple-400" />
            <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-ce-text-primary">
              Issue Time-Bound Lease
            </h3>
          </div>

          <p className="text-xs text-ce-text-muted font-sans leading-relaxed">
            Grant temporary, expiring read/analysis access to a specific DID without assigning permanent privileges. Automatically expires.
          </p>

          {leaseSuccess && (
            <div className="p-3 rounded-md bg-ce-success/10 border border-ce-success/30 flex items-center gap-2 text-xs font-mono text-ce-success">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{leaseSuccess}</span>
            </div>
          )}

          <form onSubmit={handleGrantLease} className="space-y-3 font-mono text-xs">
            <div>
              <label className="block text-[10px] text-ce-text-muted uppercase mb-1 font-bold">Target Digital Asset:</label>
              <select
                value={leaseAssetId}
                onChange={(e) => setLeaseAssetId(e.target.value)}
                className="w-full bg-ce-bg border border-ce-border rounded px-3 py-2 text-ce-text-primary focus:outline-none focus:border-ce-brand"
              >
                {evidenceList.map(ev => (
                  <option key={ev.id} value={ev.id}>
                    {ev.id} &mdash; {ev.title} ({ev.sensitivity || 'STANDARD'})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] text-ce-text-muted uppercase mb-1 font-bold">Target Participant DID:</label>
              <select
                value={leaseTargetDid}
                onChange={(e) => setLeaseTargetDid(e.target.value)}
                className="w-full bg-ce-bg border border-ce-border rounded px-3 py-2 text-ce-text-primary focus:outline-none focus:border-ce-brand"
              >
                {registeredIdentities.map(id => (
                  <option key={id.address} value={id.didURI}>
                    {id.name} ({id.role}) {isDidRevoked(id.didURI) ? '[REVOKED]' : ''}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] text-ce-text-muted uppercase mb-1 font-bold">Lease Expiry Duration:</label>
              <select
                value={leaseHours}
                onChange={(e) => setLeaseHours(Number(e.target.value))}
                className="w-full bg-ce-bg border border-ce-border rounded px-3 py-2 text-ce-text-primary focus:outline-none focus:border-ce-brand"
              >
                <option value={1}>1 Hour (Quick Forensic Inspection)</option>
                <option value={2}>2 Hours (Standard Evaluation Lease)</option>
                <option value={4}>4 Hours (Deep Sandbox Reverse Engineering)</option>
                <option value={8}>8 Hours (Full Shift Work Session)</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] text-ce-text-muted uppercase mb-1 font-bold">Justification / Reason:</label>
              <input
                type="text"
                required
                value={leaseReason}
                onChange={(e) => setLeaseReason(e.target.value)}
                className="w-full bg-ce-bg border border-ce-border rounded px-3 py-2 text-ce-text-primary focus:outline-none focus:border-ce-brand"
              />
            </div>

            <button
              type="submit"
              disabled={leaseSubmitting}
              className="w-full mt-2 py-2.5 rounded-lg bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-400 hover:to-indigo-500 text-white font-mono text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Clock className="w-3.5 h-3.5" />
              <span>{leaseSubmitting ? 'Issuing Lease...' : `Grant ${leaseHours}h Time-Bound Access`}</span>
            </button>
          </form>
        </div>

        {/* Table: Active Temporary Access Leases */}
        <div className="lg:col-span-2 rounded-xl bg-ce-surface border border-ce-border p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-ce-border">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-purple-400" />
              <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-ce-text-primary">
                Active Temporary Access Leases ({allTemporaryLeases.length})
              </h3>
            </div>
            <span className="text-[10px] font-mono text-ce-text-muted">
              Auto-expires on timestamp
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs border border-ce-border rounded-lg overflow-hidden">
              <thead className="bg-ce-surface-subtle text-ce-text-muted uppercase text-[10px] tracking-wider border-b border-ce-border">
                <tr>
                  <th className="p-3">Asset</th>
                  <th className="p-3">Delegated DID</th>
                  <th className="p-3">Granted Time</th>
                  <th className="p-3">Expires At</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ce-border bg-ce-bg">
                {allTemporaryLeases.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-6 text-center text-ce-text-muted">
                      No temporary leases currently issued. Use the form to grant a time-bound lease.
                    </td>
                  </tr>
                ) : (
                  allTemporaryLeases.map((lease, idx) => {
                    const isExpired = new Date(lease.expiresAt).getTime() <= Date.now() || lease.status === 'EXPIRED';
                    const isRevoked = lease.status === 'REVOKED';
                    return (
                      <tr key={idx} className="hover:bg-ce-surface-subtle/50 transition-colors">
                        <td className="p-3 font-semibold text-ce-text-primary">
                          <div>{lease.evidenceId}</div>
                          <div className="text-[10px] text-ce-text-muted truncate max-w-[150px]">{lease.evidenceTitle}</div>
                        </td>
                        <td className="p-3 text-ce-blockchain text-[11px] truncate max-w-[150px]" title={lease.did}>
                          {lease.did}
                        </td>
                        <td className="p-3 text-ce-text-muted text-[10px]">
                          {new Date(lease.grantedAt).toLocaleTimeString()}
                        </td>
                        <td className="p-3 text-[10px] font-bold text-ce-text-primary">
                          {new Date(lease.expiresAt).toLocaleTimeString()}
                        </td>
                        <td className="p-3">
                          {isRevoked ? (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/30">
                              REVOKED
                            </span>
                          ) : isExpired ? (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
                              EXPIRED
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                              ACTIVE LEASE
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* SECTION 3: CONSORTIUM 2-OF-3 CRITICAL ACTION APPROVAL QUEUE */}
      <div className="rounded-xl bg-ce-surface border border-ce-border p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-ce-border gap-2">
          <div>
            <div className="flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-amber-400" />
              <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-ce-text-primary">
                3. Critical Action Quorum Approval Queue
              </h3>
              <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30">
                [Application-Level Quorum Gate (2-of-3 Consensual Approval)]
              </span>
            </div>
            <p className="text-xs text-ce-text-muted mt-1 font-sans">
              Critical forensic transfers require at least <strong>2 out of 3</strong> consortium authorities to sign approvals before inter-agency dispatch is authorized.
              <span className="text-amber-400/90 ml-1.5 font-mono text-[10px]">
                (Enforced at Application & Consortium Trust Layer. On-Chain Smart Contract Multi-Sig available in v2.1 migration spec.)
              </span>
            </p>
          </div>
        </div>

        {criticalTransfers.length === 0 ? (
          <div className="p-8 text-center bg-ce-bg rounded-lg border border-ce-border space-y-2">
            <CheckCircle2 className="w-8 h-8 text-ce-text-muted mx-auto opacity-40" />
            <div className="text-xs font-mono font-bold text-ce-text-primary uppercase">No Transfers Currently Awaiting Quorum Approval</div>
            <p className="text-xs text-ce-text-muted font-sans max-w-md mx-auto">
              When an asset marked <strong>CRITICAL</strong> (e.g. EV-001 or EV-003) is transferred between agencies, it is automatically routed here for multi-stakeholder consensus.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {criticalTransfers.map((trf) => {
              const approvals = trf.approvals || [];
              const quorumMet = approvals.length >= 2;
              return (
                <div key={trf.id} className="p-4 rounded-lg bg-ce-bg border border-ce-border space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-ce-border/60">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-ce-text-primary text-xs">{trf.id}</span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/30 font-bold">
                          CRITICAL ASSET TRANSFER
                        </span>
                        <span className="text-xs font-mono text-ce-text-secondary">&mdash; {trf.evidenceTitle} ({trf.evidenceId})</span>
                      </div>
                      <div className="text-[11px] text-ce-text-muted mt-1 font-mono">
                        Route: <span className="text-ce-text-primary">{trf.fromOrg}</span> &rarr; <span className="text-ce-text-primary">{trf.toOrg}</span>
                      </div>
                    </div>
                    <div>
                      <span className={`px-2.5 py-1 rounded text-xs font-mono font-bold border ${
                        quorumMet 
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' 
                          : 'bg-amber-500/10 text-amber-400 border-amber-500/30 animate-pulse'
                      }`}>
                        QUORUM STATUS: {approvals.length}/2 VOTES {quorumMet ? '(QUORUM MET &mdash; APPROVED)' : '(PENDING)'}
                      </span>
                    </div>
                  </div>

                  {/* 1-Click Persona Approvals for Jury Demo */}
                  <div>
                    <span className="text-[10px] font-mono text-ce-text-muted uppercase font-bold block mb-2 tracking-wider">
                      Consortium Signers (Click to cast approval signature):
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {CONSORTIUM_AUTHORITIES.map((auth) => {
                        const hasSigned = approvals.some(a => a.approverDid?.toLowerCase() === auth.did.toLowerCase());
                        return (
                          <div
                            key={auth.did}
                            className={`p-3 rounded-lg border flex flex-col justify-between transition-all ${
                              hasSigned
                                ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400'
                                : 'bg-ce-surface border-ce-border hover:border-ce-brand/50'
                            }`}
                          >
                            <div>
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-mono font-bold">{auth.name}</span>
                                {hasSigned ? (
                                  <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                                    SIGNED ✓
                                  </span>
                                ) : (
                                  <span className="text-[9px] font-mono text-ce-text-muted">AWAITING</span>
                                )}
                              </div>
                              <div className="text-[10px] text-ce-text-muted mt-0.5">{auth.role}</div>
                              <div className="text-[9px] text-ce-blockchain font-mono mt-1 truncate" title={auth.did}>
                                {auth.did.substring(0, 18)}...
                              </div>
                            </div>

                            <button
                              disabled={hasSigned}
                              onClick={() => approveCriticalTransfer(trf.id, {
                                approverDid: auth.did,
                                approverName: auth.name,
                                approverOrg: auth.org
                              })}
                              className={`mt-3 py-1 px-2.5 rounded text-[11px] font-mono font-bold transition-all cursor-pointer ${
                                hasSigned
                                  ? 'opacity-40 cursor-not-allowed bg-emerald-500/20 text-emerald-400'
                                  : 'bg-ce-brand hover:bg-ce-brand-hover text-white shadow-sm'
                              }`}
                            >
                              {hasSigned ? 'Approval Signed' : 'Sign & Cast Approval'}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* SECTION 4: REVOCATION CASCADE CONTROLLER */}
      <div className="rounded-xl bg-ce-surface border border-ce-border p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-ce-border gap-2">
          <div>
            <div className="flex items-center gap-2">
              <UserX className="w-4 h-4 text-rose-400" />
              <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-ce-text-primary">
                4. Identity Revocation Cascade Engine
              </h3>
            </div>
            <p className="text-xs text-ce-text-muted mt-1 font-sans">
              When a DID is compromised or de-provisioned, the revocation cascade automatically terminates effective role permissions, invalidates active leases, and halts pending transfers. <strong>Historical audit logs remain completely preserved.</strong>
            </p>
          </div>
        </div>

        {revokeSuccess && (
          <div className="p-3 rounded-md bg-ce-success/10 border border-ce-success/30 flex items-center gap-2 text-xs font-mono text-ce-success">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{revokeSuccess}</span>
          </div>
        )}

        {/* Revocation Trigger Form */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="p-4 rounded-lg bg-ce-bg border border-ce-border space-y-3 font-mono text-xs">
            <span className="text-[10px] text-ce-text-muted uppercase font-bold block tracking-wider">
              Trigger New Revocation Cascade:
            </span>

            <div>
              <label className="block text-[10px] text-ce-text-muted uppercase mb-1">Target Identity / DID:</label>
              <select
                value={revokeTargetDid}
                onChange={(e) => setRevokeTargetDid(e.target.value)}
                className="w-full bg-ce-surface border border-ce-border rounded px-3 py-2 text-ce-text-primary focus:outline-none focus:border-rose-500"
              >
                <option value="">-- Select Identity to Revoke --</option>
                {registeredIdentities.map(id => (
                  <option key={id.address} value={id.didURI}>
                    {id.name} &mdash; {id.didURI.substring(0, 18)}... {isDidRevoked(id.didURI) ? '(ALREADY REVOKED)' : ''}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] text-ce-text-muted uppercase mb-1">Incident / Revocation Reason:</label>
              <input
                type="text"
                value={revokeReason}
                onChange={(e) => setRevokeReason(e.target.value)}
                className="w-full bg-ce-surface border border-ce-border rounded px-3 py-2 text-ce-text-primary focus:outline-none focus:border-rose-500"
              />
            </div>

            <button
              disabled={!revokeTargetDid || revokeSubmitting || isDidRevoked(revokeTargetDid)}
              onClick={() => handleRevokeCascade(revokeTargetDid, revokeReason)}
              className="w-full py-2.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-mono text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40"
            >
              <UserX className="w-3.5 h-3.5" />
              <span>{revokeSubmitting ? 'Cascading...' : 'Execute Revocation Cascade'}</span>
            </button>
          </div>

          {/* Revoked Identities Table & Restore Controls */}
          <div className="lg:col-span-2 overflow-x-auto">
            <span className="text-[10px] text-ce-text-muted uppercase font-bold block mb-2 font-mono tracking-wider">
              Currently Revoked Identities ({revokedDids.length}):
            </span>
            <table className="w-full text-left font-mono text-xs border border-ce-border rounded-lg overflow-hidden">
              <thead className="bg-ce-surface-subtle text-ce-text-muted uppercase text-[10px] tracking-wider border-b border-ce-border">
                <tr>
                  <th className="p-3">Revoked DID</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Effective Privileges</th>
                  <th className="p-3 text-right">Administrative Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ce-border bg-ce-bg">
                {revokedDids.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="p-6 text-center text-ce-text-muted">
                      No identities are currently in revoked status. All consortium identities are active.
                    </td>
                  </tr>
                ) : (
                  revokedDids.map((revDid) => {
                    const match = registeredIdentities.find(i => i.didURI?.toLowerCase() === revDid.toLowerCase() || i.address?.toLowerCase() === revDid.toLowerCase());
                    return (
                      <tr key={revDid} className="hover:bg-ce-surface-subtle/50 transition-colors">
                        <td className="p-3 font-semibold text-ce-text-primary">
                          <div className="text-rose-400 font-bold">{match ? match.name : 'Participant Identity'}</div>
                          <div className="text-[10px] text-ce-text-muted truncate max-w-[200px]" title={revDid}>
                            {revDid}
                          </div>
                        </td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/30">
                            REVOKED
                          </span>
                        </td>
                        <td className="p-3 text-ce-text-muted text-[11px]">
                          <span className="text-rose-400 font-semibold">0 Privileges</span> &bull; All leases dropped
                        </td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => restoreRevokedIdentity(revDid)}
                            className="px-2.5 py-1 rounded bg-ce-surface border border-ce-border hover:border-emerald-500/50 text-emerald-400 font-mono text-[10px] font-bold cursor-pointer transition-colors"
                          >
                            Restore Identity
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
