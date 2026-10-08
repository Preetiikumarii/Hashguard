import { apiClient, IS_MOCK_FALLBACK } from './api';
import { auditService } from './auditService';
import { evidenceService } from './evidenceService';

export const DEFAULT_RETENTION_POLICIES = [
  {
    id: 'POL-001',
    name: 'Active Investigation Evidence',
    retention_period_days: 365,
    trigger_event: 'evidence_sealed',
    action_on_expiry: 'ARCHIVE_COLD',
    allow_legal_hold: true,
    is_active: true,
    created_by: 'Platform Governance Authority'
  },
  {
    id: 'POL-002',
    name: 'Closed Case Evidence',
    retention_period_days: 180,
    trigger_event: 'case_closed',
    action_on_expiry: 'ARCHIVE_COLD',
    allow_legal_hold: true,
    is_active: true,
    created_by: 'Platform Governance Authority'
  },
  {
    id: 'POL-003',
    name: 'Forensic / Malware Evidence',
    retention_period_days: 1825,
    trigger_event: 'evidence_sealed',
    action_on_expiry: 'LONG_TERM_ARCHIVE',
    allow_legal_hold: true,
    is_active: true,
    created_by: 'Platform Governance Authority'
  },
  {
    id: 'POL-004',
    name: 'Temporary / Unverified Evidence',
    retention_period_days: 30,
    trigger_event: 'evidence_uploaded',
    action_on_expiry: 'MARK_FOR_REVIEW',
    allow_legal_hold: false,
    is_active: true,
    created_by: 'Platform Governance Authority'
  }
];

const getStoredPolicies = () => {
  try {
    const raw = localStorage.getItem('cee_retention_policies');
    return raw ? JSON.parse(raw) : DEFAULT_RETENTION_POLICIES;
  } catch {
    return DEFAULT_RETENTION_POLICIES;
  }
};

const saveStoredPolicies = (policies) => {
  try {
    localStorage.setItem('cee_retention_policies', JSON.stringify(policies));
  } catch (err) {
    console.error('Failed to save retention policies to localStorage:', err);
  }
};

export const retentionService = {
  async getPolicies() {
    try {
      if (!IS_MOCK_FALLBACK) {
        const res = await apiClient.get('/admin/retention/policies');
        if (res?.data && res.data.length > 0) {
          saveStoredPolicies(res.data);
          return res.data;
        }
      }
    } catch (err) {
      console.warn('[RetentionService] Backend policies API unreachable, using local store:', err);
    }
    return getStoredPolicies();
  },

  async createPolicy(policyData, actor = 'System Administrator', organization = 'Platform Governance Authority') {
    const newPolicy = {
      id: `POL-00${Math.floor(10 + Math.random() * 90)}`,
      name: policyData.name,
      retention_period_days: parseInt(policyData.retention_period_days) || 365,
      trigger_event: policyData.trigger_event || 'evidence_sealed',
      action_on_expiry: policyData.action_on_expiry || 'ARCHIVE_COLD',
      allow_legal_hold: policyData.allow_legal_hold !== false,
      is_active: true,
      created_by: actor,
      created_at: new Date().toISOString()
    };

    try {
      if (!IS_MOCK_FALLBACK) {
        const res = await apiClient.post('/admin/retention/policies', newPolicy);
        if (res?.data) {
          const current = getStoredPolicies();
          const updated = [res.data, ...current];
          saveStoredPolicies(updated);
          return res.data;
        }
      }
    } catch (err) {
      console.warn('[RetentionService] Remote createPolicy failed, persisting locally:', err);
    }

    const current = getStoredPolicies();
    const updated = [newPolicy, ...current];
    saveStoredPolicies(updated);

    // Record Audit Event
    await auditService.logEvent({
      event: 'RETENTION_POLICY_CREATED',
      actor,
      organization,
      evidenceId: newPolicy.id,
      verification: 'VERIFIED',
      reference: `POL-ROOT-${newPolicy.id}`,
      details: `Retention policy '${newPolicy.name}' created (${newPolicy.retention_period_days} Days, Trigger: ${newPolicy.trigger_event}, Expiry Action: ${newPolicy.action_on_expiry}, Legal Hold: ${newPolicy.allow_legal_hold ? 'Enabled' : 'Disabled'}).`
    });

    return newPolicy;
  },

  async updatePolicy(policyId, updateData, actor = 'System Administrator', organization = 'Platform Governance Authority') {
    try {
      if (!IS_MOCK_FALLBACK) {
        await apiClient.patch(`/admin/retention/policies/${policyId}`, updateData);
      }
    } catch (err) {
      console.warn('[RetentionService] Remote updatePolicy failed, persisting locally:', err);
    }

    const current = getStoredPolicies();
    const updated = current.map((p) => {
      if (p.id === policyId) {
        return { ...p, ...updateData };
      }
      return p;
    });
    saveStoredPolicies(updated);

    // Record Audit Event
    await auditService.logEvent({
      event: 'RETENTION_POLICY_UPDATED',
      actor,
      organization,
      evidenceId: policyId,
      verification: 'VERIFIED',
      reference: `POL-ROOT-${policyId}`,
      details: `Retention policy ${policyId} updated. Fields: ${Object.keys(updateData).join(', ')}.`
    });

    return updated.find(p => p.id === policyId);
  },

  async togglePolicyStatus(policyId, actor = 'System Administrator', organization = 'Platform Governance Authority') {
    const current = getStoredPolicies();
    const target = current.find(p => p.id === policyId);
    if (!target) return null;

    const newStatus = !target.is_active;
    return this.updatePolicy(policyId, { is_active: newStatus }, actor, organization);
  },

  async getLegalHolds() {
    try {
      if (!IS_MOCK_FALLBACK) {
        const res = await apiClient.get('/admin/retention/legal-holds');
        if (res?.data) {
          return res.data;
        }
      }
    } catch (err) {
      console.warn('[RetentionService] Remote legal-holds API unreachable, querying local evidence store:', err);
    }

    // Query evidence with legalHold === true
    const allEvidence = await evidenceService.getAllEvidence();
    return allEvidence.filter(e => e.legalHold === true).map(e => ({
      id: e.id,
      evidenceId: e.id,
      title: e.title,
      caseId: e.caseId || 'CASE-2026-9012',
      type: e.type,
      sourceOrg: e.sourceOrg,
      currentCustodian: e.currentCustodian,
      policyName: e.retentionPolicyName || 'Active Investigation Evidence',
      status: 'ON HOLD',
      retention: 'SUSPENDED',
      deletion: 'BLOCKED',
      appliedBy: e.legalHoldAppliedBy || 'lead-investigator@org-b.lab',
      appliedAt: e.legalHoldAppliedAt || e.createdAt || '2026-08-16 09:45:00 UTC',
      reason: e.legalHoldReason || 'Court-ordered preservation order pending Cryptographic Evidence Verification.'
    }));
  },

  async applyLegalHold(evidenceId, reason = 'Judicial preservation order pending forensic proceedings.', actor = 'Investigator / Lead Counsel', organization = 'Organization B (Cyber Lab)') {
    const cleanId = (evidenceId || '').trim().toUpperCase();

    try {
      if (!IS_MOCK_FALLBACK) {
        await apiClient.post(`/admin/retention/evidence/${cleanId}/legal-hold`, {
          reason,
          actor,
          organization
        });
      }
    } catch (err) {
      console.warn('[RetentionService] Remote legal-hold apply failed, using local update:', err);
    }

    // Update in evidenceService
    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC';
    const ev = await evidenceService.getEvidenceById(cleanId);
    if (!ev) throw new Error(`Evidence ${cleanId} not found`);

    ev.legalHold = true;
    ev.legalHoldReason = reason;
    ev.legalHoldAppliedBy = actor;
    ev.legalHoldAppliedAt = nowStr;
    ev.previousRetentionStatus = ev.retentionStatus || 'ACTIVE';
    ev.previousExpiry = ev.retentionExpiresAt;
    ev.retentionStatus = 'LEGAL HOLD';
    ev.retentionExpiresAt = 'SUSPENDED';

    // Persist in local storage if genuine evidence
    try {
      const raw = localStorage.getItem('cee_genuine_evidence');
      if (raw) {
        const list = JSON.parse(raw);
        const idx = list.findIndex(item => (item.id || '').toUpperCase() === cleanId);
        if (idx !== -1) {
          list[idx] = { ...list[idx], ...ev };
          localStorage.setItem('cee_genuine_evidence', JSON.stringify(list));
        }
      }
    } catch (e) {
      console.warn('Failed to update genuine evidence legal hold:', e);
    }

    // Record Audit Event
    await auditService.logEvent({
      event: 'LEGAL_HOLD_APPLIED',
      actor,
      organization,
      evidenceId: cleanId,
      verification: 'VERIFIED',
      reference: `HOLD-ORDER-${cleanId}`,
      details: `Legal Hold preservation order applied to evidence ${cleanId}. Reason: ${reason}. Retention countdown SUSPENDED, deletion BLOCKED.`
    });

    return { success: true, evidence: ev };
  },

  async releaseLegalHold(evidenceId, reason = 'Judicial preservation order concluded or dismissed.', actor = 'Evidence Custodian / Magistrate', organization = 'Organization C (Judicial Court Registry)') {
    const cleanId = (evidenceId || '').trim().toUpperCase();

    try {
      if (!IS_MOCK_FALLBACK) {
        await apiClient.post(`/admin/retention/evidence/${cleanId}/release-hold`, {
          reason,
          actor,
          organization
        });
      }
    } catch (err) {
      console.warn('[RetentionService] Remote legal-hold release failed, using local update:', err);
    }

    const ev = await evidenceService.getEvidenceById(cleanId);
    if (!ev) throw new Error(`Evidence ${cleanId} not found`);

    ev.legalHold = false;
    ev.legalHoldReason = null;
    ev.retentionStatus = 'ACTIVE';

    // Recalculate expiry date
    const days = ev.retentionPeriodDays || 365;
    const baseDate = new Date();
    baseDate.setDate(baseDate.getDate() + days);
    ev.retentionExpiresAt = baseDate.toISOString().replace('T', ' ').substring(0, 19) + ' UTC';

    // Persist in genuine evidence store if applicable
    try {
      const raw = localStorage.getItem('cee_genuine_evidence');
      if (raw) {
        const list = JSON.parse(raw);
        const idx = list.findIndex(item => (item.id || '').toUpperCase() === cleanId);
        if (idx !== -1) {
          list[idx] = { ...list[idx], ...ev };
          localStorage.setItem('cee_genuine_evidence', JSON.stringify(list));
        }
      }
    } catch (e) {
      console.warn('Failed to update genuine evidence release hold:', e);
    }

    // Record Audit Event
    await auditService.logEvent({
      event: 'LEGAL_HOLD_RELEASED',
      actor,
      organization,
      evidenceId: cleanId,
      verification: 'VERIFIED',
      reference: `HOLD-RELEASE-${cleanId}`,
      details: `Legal Hold released for evidence ${cleanId}. Reason: ${reason}. Original retention countdown resumed (New expiry: ${ev.retentionExpiresAt}).`
    });

    return { success: true, evidence: ev };
  },

  async assignPolicyToEvidence(evidenceId, policyId, actor = 'System Administrator', organization = 'Cyber Defense Lab') {
    const cleanId = (evidenceId || '').trim().toUpperCase();
    const policies = await this.getPolicies();
    const policy = policies.find(p => p.id === policyId);
    if (!policy) throw new Error(`Policy ${policyId} not found`);

    const ev = await evidenceService.getEvidenceById(cleanId);
    if (!ev) throw new Error(`Evidence ${cleanId} not found`);

    const days = policy.retention_period_days || 365;
    const baseDate = new Date();
    baseDate.setDate(baseDate.getDate() + days);
    const expiresAt = baseDate.toISOString().replace('T', ' ').substring(0, 19) + ' UTC';

    ev.retentionPolicyId = policy.id;
    ev.retentionPolicyName = policy.name;
    ev.retentionPeriodDays = days;
    ev.retentionStartAt = new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC';
    if (!ev.legalHold) {
      ev.retentionStatus = 'ACTIVE';
      ev.retentionExpiresAt = expiresAt;
    }

    // Record Audit Event
    await auditService.logEvent({
      event: 'RETENTION_STARTED',
      actor,
      organization,
      evidenceId: cleanId,
      verification: 'VERIFIED',
      reference: `POL-ASSIGN-${policy.id}`,
      details: `Retention policy '${policy.name}' assigned to exhibit ${cleanId}. Retention period: ${days} days (Expires: ${expiresAt}). Expiry action: ${policy.action_on_expiry}.`
    });

    return { success: true, evidence: ev };
  }
};
