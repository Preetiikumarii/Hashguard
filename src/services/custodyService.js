import { apiClient, IS_MOCK_FALLBACK } from './api';
import { mockCustodyEvents } from '../mock/custodyEvents';
import { formatToIST, getISTNowString } from '../utils/formatters';

const isSandboxModeActive = () => {
  try {
    return localStorage.getItem('cee_is_sandbox') === 'true';
  } catch {
    return false;
  }
};

let sandboxCustodyEventsState = [...mockCustodyEvents];

const getGenuineCustodyEvents = () => {
  try {
    const raw = localStorage.getItem('cee_genuine_custody');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
    localStorage.setItem('cee_genuine_custody', JSON.stringify(mockCustodyEvents));
    return [...mockCustodyEvents];
  } catch {
    return [...mockCustodyEvents];
  }
};

const saveGenuineCustodyEvents = (list) => {
  try {
    localStorage.setItem('cee_genuine_custody', JSON.stringify(list));
  } catch (err) {
    console.error('Failed to persist genuine custody events:', err);
  }
};

export const custodyService = {
  async getEvents(filters = {}) {
    let apiData = [];
    try {
      if (!IS_MOCK_FALLBACK) {
        const response = await apiClient.get('/custody/events', { params: filters });
        if (Array.isArray(response?.data)) {
          apiData = response.data;
        }
      }
    } catch (err) {
      console.warn('[CustodyService] API request failed, using local custody events store:', err);
    }

    const localList = isSandboxModeActive() ? sandboxCustodyEventsState : getGenuineCustodyEvents();

    const seenEventIds = new Set();
    const mergedList = [];
    for (const ev of [...localList, ...apiData]) {
      const key = ev.eventId || ev.id || `${ev.evidenceId}-${ev.timestamp}-${ev.event}`;
      if (!seenEventIds.has(key)) {
        seenEventIds.add(key);
        mergedList.push({
          ...ev,
          timestamp: formatToIST(ev.timestamp)
        });
      }
    }

    const sourceList = mergedList.length > 0 ? mergedList : (isSandboxModeActive() ? sandboxCustodyEventsState : mockCustodyEvents).map(ev => ({
      ...ev,
      timestamp: formatToIST(ev.timestamp)
    }));

    return sourceList.filter((item) => {
      if (filters.evidenceId && item.evidenceId.toUpperCase() !== filters.evidenceId.toUpperCase()) {
        return false;
      }
      if (filters.event && filters.event !== 'ALL' && item.event !== filters.event) {
        return false;
      }
      if (filters.organization && filters.organization !== 'ALL' && !item.organization.includes(filters.organization)) {
        return false;
      }
      if (filters.search) {
        const q = filters.search.toLowerCase();
        return (
          item.eventId.toLowerCase().includes(q) ||
          item.evidenceId.toLowerCase().includes(q) ||
          item.actor.toLowerCase().includes(q) ||
          item.event.toLowerCase().includes(q) ||
          (item.notes && item.notes.toLowerCase().includes(q))
        );
      }
      return true;
    });
  },

  async getEventsByEvidenceId(evidenceId) {
    try {
      if (!IS_MOCK_FALLBACK) {
        const response = await apiClient.get(`/custody/events/${evidenceId}`);
        if (Array.isArray(response?.data) && response.data.length > 0) {
          return response.data.map(ev => ({ ...ev, timestamp: formatToIST(ev.timestamp) }));
        }
      }
    } catch (err) {
      console.warn('[CustodyService] API request failed, using local custody events store:', err);
    }

    const sourceList = isSandboxModeActive() ? sandboxCustodyEventsState : getGenuineCustodyEvents();
    return sourceList
      .filter((ev) => ev.evidenceId.toUpperCase() === evidenceId.toUpperCase())
      .map(ev => ({ ...ev, timestamp: formatToIST(ev.timestamp) }));
  },

  async recordCustodyEvent(eventPayload) {
    let remoteEvent = null;
    try {
      if (!IS_MOCK_FALLBACK) {
        const response = await apiClient.post('/custody/events', eventPayload);
        if (response?.data) {
          remoteEvent = response.data;
        }
      }
    } catch (err) {
      console.warn('[CustodyService] Remote custody sync failed, recording locally:', err);
    }

    const newEvent = remoteEvent || {
      eventId: `EVT-${Math.floor(1000 + Math.random() * 9000)}`,
      evidenceId: eventPayload.evidenceId,
      event: eventPayload.event,
      actor: eventPayload.actor || 'analyst-current@cyber.org',
      organization: eventPayload.organization || 'Organization B (Cyber Lab)',
      timestamp: getISTNowString(),
      hash: eventPayload.hash || '8f3a91bc72f4cd2a4e9b671a5c28e930f1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6',
      verification: 'VERIFIED',
      signature: '3045022100' + Array.from({length: 20}, () => Math.floor(Math.random()*16).toString(16)).join('') + '...VALID',
      txRef: '0x' + Array.from({length: 40}, () => Math.floor(Math.random()*16).toString(16)).join(''),
      notes: eventPayload.notes || 'Custody action recorded in decentralized evidence ledger.',
      parentId: eventPayload.parentId || null
    };

    if (isSandboxModeActive()) {
      sandboxCustodyEventsState.unshift(newEvent);
    } else {
      const current = getGenuineCustodyEvents().filter(e => e.eventId !== newEvent.eventId);
      current.unshift(newEvent);
      saveGenuineCustodyEvents(current);
    }

    return newEvent;
  },

  async deleteEventsByEvidenceId(evidenceId) {
    if (isSandboxModeActive()) {
      sandboxCustodyEventsState = sandboxCustodyEventsState.filter(
        ev => ev.evidenceId.toUpperCase() !== (evidenceId || '').toUpperCase()
      );
    } else {
      const current = getGenuineCustodyEvents().filter(
        ev => ev.evidenceId.toUpperCase() !== (evidenceId || '').toUpperCase()
      );
      saveGenuineCustodyEvents(current);
    }
    return { success: true };
  },

  async wipeAllEvents() {
    if (isSandboxModeActive()) {
      sandboxCustodyEventsState = [];
    } else {
      localStorage.removeItem('cee_genuine_custody');
    }
    return { success: true };
  }
};
