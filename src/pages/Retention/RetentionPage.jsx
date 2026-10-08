import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PageHeader } from '../../components/layout/PageHeader';
import { 
  Clock, 
  ShieldAlert, 
  ArchiveX, 
  CheckCircle2, 
  Loader2, 
  Save, 
  Lock, 
  Unlock, 
  ShieldCheck, 
  FileText, 
  AlertTriangle, 
  PlusCircle, 
  ExternalLink,
  Edit2,
  Power,
  RotateCcw
} from 'lucide-react';
import { retentionService, DEFAULT_RETENTION_POLICIES } from '../../services/retentionService';
import { evidenceService } from '../../services/evidenceService';
import { useApp } from '../../context/AppContext';

export const RetentionPage = () => {
  const { currentOrg, currentRole, hasPermission, refreshTrigger, triggerRefresh } = useApp();
  
  const [policies, setPolicies] = useState(DEFAULT_RETENTION_POLICIES);
  const [legalHolds, setLegalHolds] = useState([]);
  const [availableEvidence, setAvailableEvidence] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [newPolicy, setNewPolicy] = useState({
    name: 'Active Investigation Evidence',
    retention_period_days: 365,
    trigger_event: 'evidence_sealed',
    action_on_expiry: 'ARCHIVE_COLD',
    allow_legal_hold: true
  });

  const [editingPolicyId, setEditingPolicyId] = useState(null);

  // Legal Hold Modal State
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [holdTargetId, setHoldTargetId] = useState('');
  const [holdReason, setHoldReason] = useState('Court-ordered evidence hold pending Section 65B forensic verification.');
  const [isSubmittingHold, setIsSubmittingHold] = useState(false);

  // Release Hold Modal State
  const [showReleaseModal, setShowReleaseModal] = useState(false);
  const [releasingItem, setReleasingItem] = useState(null);
  const [releaseReason, setReleaseReason] = useState('Judicial proceedings concluded. Evidence released to normal retention countdown.');
  const [isReleasingHold, setIsReleasingHold] = useState(false);

  const canManageRetention = currentRole.permissions?.canManageRetention || currentRole.id === 'ADMINISTRATOR' || currentRole.id === 'EVIDENCE_CUSTODIAN';

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');
      const [policiesData, holdsData, allEvData] = await Promise.all([
        retentionService.getPolicies(),
        retentionService.getLegalHolds(),
        evidenceService.getAllEvidence()
      ]);

      setPolicies(policiesData && policiesData.length > 0 ? policiesData : DEFAULT_RETENTION_POLICIES);
      setLegalHolds(holdsData || []);
      setAvailableEvidence(allEvData || []);
    } catch (err) {
      console.warn('Failed to load retention data:', err);
      setError('Using local retention repository state.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [refreshTrigger]);

  const handleCreateOrUpdatePolicy = async (e) => {
    e.preventDefault();
    if (!canManageRetention) {
      alert(`Permission Denied: Role '${currentRole.name}' does not have authority to define retention policies. Please switch to Administrator or Evidence Custodian role.`);
      return;
    }

    try {
      if (editingPolicyId) {
        await retentionService.updatePolicy(
          editingPolicyId,
          newPolicy,
          `${currentRole.name} (${currentOrg.shortName})`,
          currentOrg.name
        );
        setEditingPolicyId(null);
      } else {
        await retentionService.createPolicy(
          newPolicy,
          `${currentRole.name} (${currentOrg.shortName})`,
          currentOrg.name
        );
      }
      
      setNewPolicy({
        name: 'Active Investigation Evidence',
        retention_period_days: 365,
        trigger_event: 'evidence_sealed',
        action_on_expiry: 'ARCHIVE_COLD',
        allow_legal_hold: true
      });
      loadData();
      triggerRefresh();
    } catch (err) {
      alert('Failed to save policy: ' + err.message);
    }
  };

  const handleTogglePolicyStatus = async (policyId) => {
    if (!canManageRetention) {
      alert(`Permission Denied: Role '${currentRole.name}' cannot alter retention policy state.`);
      return;
    }
    try {
      await retentionService.togglePolicyStatus(
        policyId,
        `${currentRole.name} (${currentOrg.shortName})`,
        currentOrg.name
      );
      loadData();
      triggerRefresh();
    } catch (err) {
      alert('Failed to toggle policy status: ' + err.message);
    }
  };

  const handleEditPolicy = (p) => {
    setEditingPolicyId(p.id);
    setNewPolicy({
      name: p.name,
      retention_period_days: p.retention_period_days,
      trigger_event: p.trigger_event,
      action_on_expiry: p.action_on_expiry,
      allow_legal_hold: p.allow_legal_hold !== false
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleApplyHoldSubmit = async (e) => {
    e.preventDefault();
    if (!holdTargetId) {
      alert('Please select an evidence exhibit to place on legal hold.');
      return;
    }
    try {
      setIsSubmittingHold(true);
      await retentionService.applyLegalHold(
        holdTargetId,
        holdReason,
        `${currentRole.name} (${currentOrg.shortName})`,
        currentOrg.name
      );
      setShowApplyModal(false);
      setHoldTargetId('');
      loadData();
      triggerRefresh();
    } catch (err) {
      alert(`Failed to apply legal hold: ${err.message}`);
    } finally {
      setIsSubmittingHold(false);
    }
  };

  const handleReleaseHoldSubmit = async (e) => {
    e.preventDefault();
    if (!releasingItem) return;
    try {
      setIsReleasingHold(true);
      await retentionService.releaseLegalHold(
        releasingItem.id || releasingItem.evidenceId,
        releaseReason,
        `${currentRole.name} (${currentOrg.shortName})`,
        currentOrg.name
      );
      setShowReleaseModal(false);
      setReleasingItem(null);
      loadData();
      triggerRefresh();
    } catch (err) {
      alert(`Failed to release legal hold: ${err.message}`);
    } finally {
      setIsReleasingHold(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Evidence Retention & Legal Hold Governance"
        subtitle="Manage cryptographic lifecycle rules, automated retention countdowns, and court-ordered Legal Hold preservation orders."
        breadcrumbs={['Dashboard', 'Admin', 'Retention']}
      />

      {/* RBAC Role Notice Banner */}
      {!canManageRetention && (
        <div className="p-3.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-900 dark:text-amber-200 text-xs font-mono flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">READ-ONLY ACCESS:</span> Current role <strong>{currentRole.name}</strong> has inspection rights over retention policies and legal hold orders, but policy modification and creation are restricted to <strong>Administrator</strong> and <strong>Evidence Custodian</strong>.
          </div>
        </div>
      )}

      {/* Grid: Define Policy Form + Active Policies List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Retention Policy Form */}
        <div className="lg:col-span-1 rounded-lg bg-ce-surface border border-ce-border shadow-sm flex flex-col">
          <div className="p-4 border-b border-ce-border bg-ce-surface-subtle flex items-center justify-between">
            <h2 className="text-xs font-mono font-bold text-ce-text-primary flex items-center gap-2 uppercase tracking-wider">
              <ShieldAlert className="w-4 h-4 text-ce-warning" />
              <span>{editingPolicyId ? 'Edit Retention Policy' : 'Define Retention Policy'}</span>
            </h2>
            {editingPolicyId && (
              <button
                onClick={() => {
                  setEditingPolicyId(null);
                  setNewPolicy({
                    name: 'Active Investigation Evidence',
                    retention_period_days: 365,
                    trigger_event: 'evidence_sealed',
                    action_on_expiry: 'ARCHIVE_COLD',
                    allow_legal_hold: true
                  });
                }}
                className="text-[10px] font-mono text-ce-text-muted hover:text-ce-text-primary flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Cancel</span>
              </button>
            )}
          </div>
          
          <form onSubmit={handleCreateOrUpdatePolicy} className="p-4 space-y-4 font-mono text-xs flex-1">
            {/* Policy Name with Preset Suggestions */}
            <div>
              <label className="block text-ce-text-secondary font-bold mb-1.5 uppercase">
                Policy Name
              </label>
              <input
                type="text"
                required
                disabled={!canManageRetention}
                value={newPolicy.name}
                onChange={(e) => setNewPolicy({...newPolicy, name: e.target.value})}
                placeholder="e.g. Active Investigation Evidence"
                className="w-full bg-ce-bg border border-ce-border rounded p-2 text-ce-text-primary focus:border-ce-brand outline-none disabled:opacity-50"
              />
              <div className="mt-1.5 flex flex-wrap gap-1">
                {[
                  'Active Investigation Evidence',
                  'Closed Case Evidence',
                  'Forensic / Malware Evidence',
                  'Temporary / Unverified Evidence'
                ].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    disabled={!canManageRetention}
                    onClick={() => {
                      let days = 365;
                      let trigger = 'evidence_sealed';
                      let expiry = 'ARCHIVE_COLD';
                      let hold = true;
                      if (preset === 'Closed Case Evidence') {
                        days = 180;
                        trigger = 'case_closed';
                        expiry = 'ARCHIVE_COLD';
                      } else if (preset === 'Forensic / Malware Evidence') {
                        days = 1825;
                        trigger = 'evidence_sealed';
                        expiry = 'LONG_TERM_ARCHIVE';
                      } else if (preset === 'Temporary / Unverified Evidence') {
                        days = 30;
                        trigger = 'evidence_uploaded';
                        expiry = 'MARK_FOR_REVIEW';
                        hold = false;
                      }
                      setNewPolicy({
                        name: preset,
                        retention_period_days: days,
                        trigger_event: trigger,
                        action_on_expiry: expiry,
                        allow_legal_hold: hold
                      });
                    }}
                    className="text-[9px] px-1.5 py-0.5 rounded bg-ce-surface-subtle border border-ce-border text-ce-text-muted hover:text-ce-brand hover:border-ce-brand/40 transition-colors"
                  >
                    + {preset.split(' ')[0]}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Retention Period (Days) */}
            <div>
              <label className="block text-ce-text-secondary font-bold mb-1.5 uppercase">
                Retention Period (Days)
              </label>
              <input
                type="number"
                required
                min="1"
                disabled={!canManageRetention}
                value={newPolicy.retention_period_days}
                onChange={(e) => setNewPolicy({...newPolicy, retention_period_days: parseInt(e.target.value) || 1})}
                className="w-full bg-ce-bg border border-ce-border rounded p-2 text-ce-text-primary focus:border-ce-brand outline-none disabled:opacity-50"
              />
            </div>

            {/* Trigger Event dropdown */}
            <div>
              <label className="block text-ce-text-secondary font-bold mb-1.5 uppercase">
                Trigger Event
              </label>
              <select
                disabled={!canManageRetention}
                value={newPolicy.trigger_event}
                onChange={(e) => setNewPolicy({...newPolicy, trigger_event: e.target.value})}
                className="w-full bg-ce-bg border border-ce-border rounded p-2 text-ce-text-primary focus:border-ce-brand outline-none cursor-pointer disabled:opacity-50"
              >
                <option value="evidence_sealed">Evidence Sealed (Creation)</option>
                <option value="evidence_uploaded">Evidence Uploaded</option>
                <option value="case_closed">Case Closed</option>
                <option value="investigation_closed">Investigation Closed</option>
              </select>
            </div>

            {/* Action on Expiry dropdown */}
            <div>
              <label className="block text-ce-text-secondary font-bold mb-1.5 uppercase">
                Action on Expiry
              </label>
              <select
                disabled={!canManageRetention}
                value={newPolicy.action_on_expiry}
                onChange={(e) => setNewPolicy({...newPolicy, action_on_expiry: e.target.value})}
                className="w-full bg-ce-bg border border-ce-border rounded p-2 text-ce-text-primary focus:border-ce-brand outline-none cursor-pointer disabled:opacity-50"
              >
                <option value="ARCHIVE_COLD">Archive to Cold Storage</option>
                <option value="LONG_TERM_ARCHIVE">Move to Long-Term Archive</option>
                <option value="MARK_FOR_REVIEW">Mark for Review</option>
                <option value="SECURE_DELETION">Secure Deletion</option>
              </select>
            </div>

            {/* Legal Hold Checkbox */}
            <div className="pt-2 border-t border-ce-border">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  disabled={!canManageRetention}
                  checked={newPolicy.allow_legal_hold}
                  onChange={(e) => setNewPolicy({...newPolicy, allow_legal_hold: e.target.checked})}
                  className="rounded border-ce-border text-ce-brand focus:ring-ce-brand"
                />
                <span className="text-xs font-bold text-ce-text-primary">
                  Allow Legal Hold Override
                </span>
              </label>
              <p className="text-[10px] text-ce-text-muted mt-1 leading-relaxed">
                When enabled, judicial preservation orders can suspend retention countdown and block automated purging.
              </p>
            </div>
            
            <div className="pt-4 mt-auto">
              <button
                type="submit"
                disabled={!canManageRetention}
                className={`w-full flex items-center justify-center gap-2 bg-ce-brand hover:bg-ce-brand-hover text-white py-2 rounded transition-colors font-bold shadow-sm ${!canManageRetention ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <Save className="w-4 h-4" />
                <span>{editingPolicyId ? 'UPDATE RETENTION POLICY' : 'CREATE POLICY'}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Existing Active Policies List */}
        <div className="lg:col-span-2 rounded-lg bg-ce-surface border border-ce-border shadow-sm flex flex-col">
          <div className="p-4 border-b border-ce-border bg-ce-surface-subtle flex items-center justify-between">
            <h2 className="text-xs font-mono font-bold text-ce-text-primary flex items-center gap-2 uppercase tracking-wider">
              <Clock className="w-4 h-4 text-ce-brand" />
              <span>ACTIVE POLICIES</span>
            </h2>
            <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-ce-brand/10 border border-ce-brand/20 text-ce-brand">
              {policies.length} Defined
            </span>
          </div>
          
          <div className="p-4 flex-1">
            {loading ? (
              <div className="flex flex-col items-center justify-center h-48 text-ce-text-muted gap-2">
                <Loader2 className="w-6 h-6 animate-spin text-ce-brand" />
                <span className="text-xs font-mono">Loading Policies...</span>
              </div>
            ) : error ? (
              <div className="bg-ce-danger/10 text-ce-danger border border-ce-danger/30 p-3 rounded text-xs font-mono font-bold text-center">
                {error}
              </div>
            ) : (
              <div className="grid gap-3">
                {policies.map(p => {
                  const isActive = p.is_active !== false;
                  return (
                    <div 
                      key={p.id} 
                      className={`bg-ce-bg border rounded-md p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm transition-all ${
                        isActive ? 'border-ce-border hover:border-ce-brand/40' : 'border-ce-border/40 opacity-60'
                      }`}
                    >
                      <div className="space-y-1.5 flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-bold text-ce-text-primary truncate">
                            {p.name}
                          </span>
                          <span className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded border ${
                            isActive 
                              ? 'bg-ce-success/10 text-ce-success border-ce-success/30' 
                              : 'bg-ce-surface-subtle text-ce-text-muted border-ce-border'
                          }`}>
                            {isActive ? 'ACTIVE' : 'DISABLED'}
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 text-[10px] font-mono text-ce-text-muted">
                          <span className="bg-ce-surface-subtle px-2 py-0.5 rounded border border-ce-border text-ce-text-primary font-semibold">
                            {p.retention_period_days} Days
                          </span>
                          <span className="bg-ce-surface-subtle px-2 py-0.5 rounded border border-ce-border">
                            Trigger: {p.trigger_event?.replace(/_/g, ' ')}
                          </span>
                          <span className="bg-ce-surface-subtle px-2 py-0.5 rounded border border-ce-border">
                            Expiry Action: {p.action_on_expiry?.replace(/_/g, ' ')}
                          </span>
                          <span className={`px-2 py-0.5 rounded border font-semibold ${
                            p.allow_legal_hold 
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' 
                              : 'bg-ce-surface-subtle text-ce-text-muted border-ce-border'
                          }`}>
                            Legal Hold: {p.allow_legal_hold ? 'Enabled' : 'Disabled'}
                          </span>
                        </div>
                      </div>
                      
                      {/* Action Controls */}
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => handleEditPolicy(p)}
                          disabled={!canManageRetention}
                          className="px-2.5 py-1 rounded bg-ce-surface-subtle border border-ce-border hover:bg-ce-border text-ce-text-secondary hover:text-ce-text-primary text-xs font-mono flex items-center gap-1 transition-colors disabled:opacity-50"
                          title="Edit Policy"
                        >
                          <Edit2 className="w-3 h-3 text-ce-brand" />
                          <span>Edit</span>
                        </button>

                        <button
                          onClick={() => handleTogglePolicyStatus(p.id)}
                          disabled={!canManageRetention}
                          className={`px-2.5 py-1 rounded border text-xs font-mono flex items-center gap-1 transition-colors disabled:opacity-50 ${
                            isActive
                              ? 'bg-ce-danger/10 hover:bg-ce-danger/20 text-ce-danger border-ce-danger/30'
                              : 'bg-ce-success/10 hover:bg-ce-success/20 text-ce-success border-ce-success/30'
                          }`}
                          title={isActive ? 'Disable Policy' : 'Enable Policy'}
                        >
                          <Power className="w-3 h-3" />
                          <span>{isActive ? 'Disable' : 'Enable'}</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* C. LEGAL HOLDS SECTION (ACTIVE PRESERVATION ORDERS)       */}
      {/* ========================================================= */}
      <div className="rounded-lg bg-ce-surface border border-ce-border shadow-sm">
        <div className="p-4 border-b border-ce-border bg-ce-surface-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-500">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-xs font-mono font-bold text-ce-text-primary uppercase tracking-wider flex items-center gap-2">
                <span>LEGAL HOLDS (ACTIVE PRESERVATION ORDERS)</span>
                <span className="text-[10px] font-mono px-2 py-0.2 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30 font-bold">
                  {legalHolds.length} PROTECTED
                </span>
              </h2>
              <p className="text-[11px] text-ce-text-muted mt-0.5">
                Evidence exhibits under active judicial hold. Retention countdown is SUSPENDED and automated expiry / deletion is BLOCKED.
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowApplyModal(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-amber-500/15 hover:bg-amber-500/25 text-amber-400 border border-amber-500/30 font-mono text-xs font-bold transition-colors shadow-sm self-start sm:self-auto cursor-pointer"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Apply Legal Hold</span>
          </button>
        </div>

        <div className="p-4">
          {legalHolds.length === 0 ? (
            <div className="py-10 text-center text-ce-text-muted font-mono text-xs border border-dashed border-ce-border rounded">
              <Unlock className="w-6 h-6 mx-auto mb-2 opacity-40 text-ce-text-muted" />
              <span>No evidence currently under Legal Hold. Click "Apply Legal Hold" to protect an exhibit.</span>
            </div>
          ) : (
            <div className="grid gap-3">
              {legalHolds.map((item) => (
                <div
                  key={item.id || item.evidenceId}
                  className="bg-ce-bg border border-amber-500/30 rounded-lg p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm hover:border-amber-500/50 transition-colors"
                >
                  <div className="space-y-2 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-bold text-ce-brand">
                        {item.evidenceId || item.id}
                      </span>
                      <span className="text-xs text-ce-text-primary font-semibold truncate max-w-sm">
                        {item.title}
                      </span>
                      <span className="text-[10px] font-mono text-ce-text-muted bg-ce-surface px-1.5 py-0.5 rounded border border-ce-border">
                        {item.caseId || 'CASE-2026-4410'}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 text-[10px] font-mono">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-500/15 text-amber-400 border border-amber-500/40 font-bold">
                        <Lock className="w-3 h-3" />
                        Status: ON HOLD
                      </span>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20 font-semibold">
                        Retention: SUSPENDED
                      </span>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/30 font-bold">
                        Deletion: BLOCKED
                      </span>
                      <span className="text-ce-text-muted">
                        Applied by: {item.appliedBy || 'Magistrate Court'}
                      </span>
                    </div>

                    {item.reason && (
                      <div className="text-[11px] font-mono text-ce-text-secondary bg-ce-surface-subtle p-2 rounded border border-ce-border">
                        <span className="text-amber-400 font-bold uppercase mr-1">Hold Justification:</span>
                        <span>{item.reason}</span>
                      </div>
                    )}
                  </div>

                  {/* Legal Hold Actions */}
                  <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                    <Link
                      to={`/evidence/${item.evidenceId || item.id}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-ce-surface border border-ce-border text-ce-text-secondary hover:text-ce-text-primary text-xs font-mono transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5 text-ce-brand" />
                      <span>View Evidence</span>
                    </Link>

                    <button
                      onClick={() => {
                        setReleasingItem(item);
                        setShowReleaseModal(true);
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 border border-emerald-500/30 text-xs font-mono font-bold transition-colors shadow-sm"
                      title="Release preservation order and resume retention countdown"
                    >
                      <Unlock className="w-3.5 h-3.5" />
                      <span>Release Hold</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ========================================================= */}
      {/* MODAL: APPLY LEGAL HOLD                                   */}
      {/* ========================================================= */}
      {showApplyModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-ce-surface border border-ce-border rounded-xl shadow-2xl max-w-lg w-full p-6 space-y-4 font-mono text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-ce-border">
              <h3 className="text-sm font-bold uppercase text-ce-text-primary flex items-center gap-2">
                <Lock className="w-4 h-4 text-amber-500" />
                <span>Issue Legal Hold Preservation Order</span>
              </h3>
              <button 
                onClick={() => setShowApplyModal(false)}
                className="text-ce-text-muted hover:text-ce-text-primary text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleApplyHoldSubmit} className="space-y-4">
              <div>
                <label className="block text-ce-text-muted uppercase mb-1 font-bold">
                  Select Evidence Exhibit:
                </label>
                <select
                  required
                  value={holdTargetId}
                  onChange={(e) => setHoldTargetId(e.target.value)}
                  className="w-full bg-ce-bg border border-ce-border rounded px-3 py-2 text-ce-text-primary focus:outline-none focus:border-ce-brand"
                >
                  <option value="">-- Choose Exhibit to Protect --</option>
                  {availableEvidence.map(ev => (
                    <option key={ev.id} value={ev.id} disabled={ev.legalHold}>
                      {ev.id} - {ev.title} {ev.legalHold ? '(Already on Hold)' : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-ce-text-muted uppercase mb-1 font-bold">
                  Preservation Justification / Court Docket:
                </label>
                <textarea
                  rows={3}
                  required
                  value={holdReason}
                  onChange={(e) => setHoldReason(e.target.value)}
                  placeholder="e.g. Subpoena Ref #JD-2026-881 issued by High Court Registry pending Section 65B verification."
                  className="w-full bg-ce-bg border border-ce-border rounded p-2 text-ce-text-primary focus:outline-none focus:border-ce-brand font-sans text-xs"
                />
              </div>

              <div className="p-3 rounded bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[11px] leading-relaxed">
                <strong>Legal Hold Enforcement:</strong> Applying this preservation order will immediately pause retention expiration countdowns, block automated deletion, and log a permanent <code>LEGAL_HOLD_APPLIED</code> entry to the Immutable Audit Ledger.
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowApplyModal(false)}
                  className="px-4 py-2 rounded bg-ce-surface-subtle border border-ce-border text-ce-text-secondary hover:text-ce-text-primary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingHold}
                  className="px-4 py-2 rounded bg-amber-500 hover:bg-amber-600 text-black font-bold shadow-sm flex items-center gap-1.5"
                >
                  {isSubmittingHold ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Lock className="w-3.5 h-3.5" />}
                  <span>Enact Preservation Order</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: RELEASE LEGAL HOLD                                 */}
      {/* ========================================================= */}
      {showReleaseModal && releasingItem && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-ce-surface border border-ce-border rounded-xl shadow-2xl max-w-lg w-full p-6 space-y-4 font-mono text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-ce-border">
              <h3 className="text-sm font-bold uppercase text-ce-text-primary flex items-center gap-2">
                <Unlock className="w-4 h-4 text-emerald-500" />
                <span>Release Legal Hold on {releasingItem.evidenceId || releasingItem.id}</span>
              </h3>
              <button 
                onClick={() => setShowReleaseModal(false)}
                className="text-ce-text-muted hover:text-ce-text-primary text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleReleaseHoldSubmit} className="space-y-4">
              <div>
                <label className="block text-ce-text-muted uppercase mb-1 font-bold">
                  Release Justification / Disposition Order:
                </label>
                <textarea
                  rows={3}
                  required
                  value={releaseReason}
                  onChange={(e) => setReleaseReason(e.target.value)}
                  placeholder="e.g. Case trial concluded; judgment delivered. Evidence restored to standard retention countdown."
                  className="w-full bg-ce-bg border border-ce-border rounded p-2 text-ce-text-primary focus:outline-none focus:border-ce-brand font-sans text-xs"
                />
              </div>

              <div className="p-3 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[11px] leading-relaxed">
                <strong>Resumption Notice:</strong> Releasing the hold will restore the original retention policy, calculate the remaining retention window, and record a <code>LEGAL_HOLD_RELEASED</code> event in the Immutable Audit Ledger.
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowReleaseModal(false)}
                  className="px-4 py-2 rounded bg-ce-surface-subtle border border-ce-border text-ce-text-secondary hover:text-ce-text-primary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isReleasingHold}
                  className="px-4 py-2 rounded bg-emerald-500 hover:bg-emerald-600 text-black font-bold shadow-sm flex items-center gap-1.5"
                >
                  {isReleasingHold ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Unlock className="w-3.5 h-3.5" />}
                  <span>Confirm Hold Release</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
