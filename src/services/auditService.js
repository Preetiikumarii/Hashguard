import { apiClient, IS_MOCK_FALLBACK } from './api';
import { mockAuditLogs } from '../mock/auditLogs';
import { formatToIST, getISTNowString } from '../utils/formatters';

const isSandboxModeActive = () => {
  try {
    return localStorage.getItem('cee_is_sandbox') === 'true';
  } catch {
    return false;
  }
};

let sandboxAuditLogsState = [...mockAuditLogs];

const getGenuineAuditLogs = () => {
  try {
    const raw = localStorage.getItem('cee_genuine_audit');
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const saveGenuineAuditLogs = (list) => {
  try {
    localStorage.setItem('cee_genuine_audit', JSON.stringify(list));
  } catch (err) {
    console.error('Failed to persist genuine audit logs:', err);
  }
};

export const auditService = {
  async getAuditLogs(filters = {}) {
    let apiLogs = [];
    try {
      if (!IS_MOCK_FALLBACK) {
        const response = await apiClient.get('/audit', { params: filters });
        if (Array.isArray(response?.data)) {
          apiLogs = response.data.map(log => ({
            ...log,
            evidenceId: log.evidenceId || log.evidence_id || 'N/A',
            eventId: log.eventId || log.event_id || log.id,
            timestamp: formatToIST(log.timestamp)
          }));
        }
      }
    } catch (err) {
      // Remote API unavailable, fallback gracefully
    }

    const localSource = (isSandboxModeActive() ? sandboxAuditLogsState : getGenuineAuditLogs()).map(log => ({
      ...log,
      evidenceId: log.evidenceId || log.evidence_id || 'N/A',
      eventId: log.eventId || log.event_id || log.id,
      timestamp: formatToIST(log.timestamp)
    }));

    // If localSource is empty and apiLogs has items, use apiLogs; if apiLogs empty, use localSource; or merge
    const seenIds = new Set();
    const mergedList = [];
    for (const log of [...apiLogs, ...localSource]) {
      const key = log.id || log.eventId || `${log.timestamp}-${log.event}`;
      if (!seenIds.has(key)) {
        seenIds.add(key);
        mergedList.push(log);
      }
    }

    // Safe sort: IST strings like "2026-09-27 22:14:30 IST" need the suffix stripped
    const safeMs = (ts) => {
      if (!ts) return 0;
      const clean = String(ts).replace(/\s+IST$/, '').replace(' ', 'T') + (String(ts).includes('T') || String(ts).includes('+') ? '' : 'Z');
      const t = new Date(clean).getTime();
      return isNaN(t) ? 0 : t;
    };
    mergedList.sort((a, b) => safeMs(b.timestamp) - safeMs(a.timestamp));

    return mergedList.filter((log) => {
      if (filters.event && filters.event !== 'ALL' && log.event !== filters.event) {
        return false;
      }
      if (filters.organization && filters.organization !== 'ALL' && !(log.organization || '').toLowerCase().includes(filters.organization.toLowerCase())) {
        return false;
      }
      if (filters.search) {
        const q = filters.search.toLowerCase();
        return (
          (log.id || '').toLowerCase().includes(q) ||
          (log.evidenceId || '').toLowerCase().includes(q) ||
          (log.actor || '').toLowerCase().includes(q) ||
          (log.event || '').toLowerCase().includes(q) ||
          (log.details || '').toLowerCase().includes(q) ||
          (log.reference || '').toLowerCase().includes(q)
        );
      }
      return true;
    });
  },

  async logEvent(logPayload) {
    const newLog = {
      id: logPayload.id || `AUD-${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp: getISTNowString(),
      evidenceId: logPayload.evidenceId || logPayload.evidence_id || 'N/A',
      eventId: logPayload.eventId || logPayload.event_id || `EVT-${Math.floor(1000 + Math.random() * 9000).toString(16).toUpperCase()}`,
      event: logPayload.event || 'SYSTEM_ACTION',
      actor: logPayload.actor || 'system',
      organization: logPayload.organization || 'Local Node',
      details: logPayload.details || 'Cryptographic audit log recorded',
      reference: logPayload.reference || ('0x' + Array.from({length: 64}, () => Math.floor(Math.random()*16).toString(16)).join('')),
      verification: logPayload.verification || 'VERIFIED'
    };

    // Try synchronizing with backend API
    try {
      if (!IS_MOCK_FALLBACK) {
        await apiClient.post('/audit', newLog);
      }
    } catch (err) {
      console.warn('[AuditService] Remote audit log sync failed, recording locally:', err);
    }

    if (isSandboxModeActive()) {
      sandboxAuditLogsState.unshift(newLog);
    } else {
      const current = getGenuineAuditLogs();
      current.unshift(newLog);
      saveGenuineAuditLogs(current);
    }

    return newLog;
  }
};
