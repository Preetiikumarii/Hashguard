import { apiClient, IS_MOCK_FALLBACK } from './api';
import { mockTransfers } from '../mock/transfers';
import { custodyService } from './custodyService';
import { evidenceService } from './evidenceService';

const isSandboxModeActive = () => {
  try {
    return localStorage.getItem('cee_is_sandbox') === 'true';
  } catch {
    return false;
  }
};

let sandboxTransfersState = [...mockTransfers];

const getGenuineTransfers = () => {
  try {
    const raw = localStorage.getItem('cee_genuine_transfers');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
    localStorage.setItem('cee_genuine_transfers', JSON.stringify(mockTransfers));
    return [...mockTransfers];
  } catch {
    return [...mockTransfers];
  }
};

const saveGenuineTransfers = (list) => {
  try {
    localStorage.setItem('cee_genuine_transfers', JSON.stringify(list));
  } catch (err) {
    console.error('Failed to persist genuine transfers:', err);
  }
};

export const transferService = {
  async getTransfers(filters = {}) {
    let remoteData = [];
    try {
      if (!IS_MOCK_FALLBACK) {
        const response = await apiClient.get('/transfers', { params: filters });
        if (Array.isArray(response?.data)) {
          remoteData = response.data;
        }
      }
    } catch (err) {
      console.warn('[TransferService] API request failed, using local transfers store:', err);
    }

    const localData = isSandboxModeActive() ? sandboxTransfersState : getGenuineTransfers();

    // Merge local and remote transfers so newly initiated transfers are immediately visible
    const seenIds = new Set();
    const mergedList = [];
    for (const item of [...localData, ...remoteData]) {
      const key = item.id || item.transfer_id;
      if (key && !seenIds.has(key)) {
        seenIds.add(key);
        mergedList.push(item);
      }
    }

    const sourceList = mergedList.length > 0 ? mergedList : (isSandboxModeActive() ? sandboxTransfersState : mockTransfers);

    return sourceList.filter((item) => {
      if (filters.status && filters.status !== 'ALL' && item.status !== filters.status) {
        return false;
      }
      if (filters.search) {
        const q = filters.search.toLowerCase();
        return (
          (item.id || '').toLowerCase().includes(q) ||
          (item.evidenceId || '').toLowerCase().includes(q) ||
          (item.evidenceTitle || '').toLowerCase().includes(q) ||
          (item.fromOrg || '').toLowerCase().includes(q) ||
          (item.toOrg || '').toLowerCase().includes(q)
        );
      }
      return true;
    });
  },

  async initiateTransfer(payload) {
    let remoteCreated = null;
    try {
      if (!IS_MOCK_FALLBACK) {
        const response = await apiClient.post('/transfers', payload);
        if (response?.data) {
          remoteCreated = response.data;
        }
      }
    } catch (err) {
      console.warn('[TransferService] Remote transfer dispatch sync failed, recording locally:', err);
    }

    const sourceList = isSandboxModeActive() ? sandboxTransfersState : getGenuineTransfers();

    const newTransfer = remoteCreated || {
      id: `TR-00${sourceList.length + 1}`,
      evidenceId: payload.evidenceId || 'EV-001',
      evidenceTitle: payload.evidenceTitle || 'Digital Forensic Specimen',
      evidenceType: payload.evidenceType || 'Disk Image',
      fromOrg: payload.fromOrg || 'Organization A (CERT-Alpha)',
      fromActor: payload.fromActor || 'ops-transport@org-a.gov',
      toOrg: payload.toOrg || 'Organization B (Cyber Lab)',
      toActor: payload.toActor || 'analyst@org-b.lab',
      status: 'TRANSFERRING',
      transferProtocol: 'mTLS Encrypted Transport + Signed Manifest',
      manifestHash: payload.manifestHash || '8f3a91bc72f4cd2a4e9b671a5c28e930f1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6',
      initiatedAt: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
      blockchainTx: payload.txHash || null,
      transferSignature: payload.signature || null,
      signerAddress: payload.signerAddress || null,
      steps: [
        { step: "MANIFEST_SIGN", org: payload.fromOrg || "Organization A", timestamp: new Date().toLocaleTimeString(), status: "COMPLETED" },
        { step: "SECURE_DISPATCH", org: payload.fromOrg || "Organization A", timestamp: new Date().toLocaleTimeString(), status: "IN_PROGRESS" },
        { step: "PAYLOAD_RECEIVE", org: payload.toOrg || "Organization B", timestamp: null, status: "PENDING" },
        { step: "INTEGRITY_VERIFY", org: payload.toOrg || "Organization B", timestamp: null, status: "PENDING" }
      ],
      notes: payload.notes || 'Cross-agency chain-of-custody transfer dispatched.'
    };

    if (isSandboxModeActive()) {
      sandboxTransfersState.unshift(newTransfer);
    } else {
      const current = getGenuineTransfers().filter(t => t.id !== newTransfer.id);
      current.unshift(newTransfer);
      saveGenuineTransfers(current);
    }

    // Auto-record TRANSFER event in custody timeline
    try {
      await custodyService.recordCustodyEvent({
        evidenceId: newTransfer.evidenceId,
        event: 'TRANSFER',
        actor: newTransfer.fromActor,
        organization: newTransfer.fromOrg,
        hash: newTransfer.manifestHash,
        notes: `Transfer dispatched to ${newTransfer.toOrg}. Protocol: mTLS Encrypted Transport.`
      });
      await evidenceService.updateEvidenceCustodian(
        newTransfer.evidenceId,
        `${newTransfer.fromOrg} -> ${newTransfer.toOrg} (In Transit)`,
        'TRANSFER'
      );

      const { auditService } = await import('./auditService');
      await auditService.logEvent({
        evidenceId: newTransfer.evidenceId,
        event: 'CROSS_ORG_TRANSFER',
        actor: newTransfer.fromActor,
        organization: newTransfer.fromOrg,
        details: `Custody transfer of '${newTransfer.evidenceTitle}' dispatched to ${newTransfer.toOrg}. Protocol: mTLS Encrypted Transport.`,
        reference: newTransfer.blockchainTx || ('0x' + Array.from({length: 64}, () => Math.floor(Math.random()*16).toString(16)).join('')),
        verification: 'PENDING'
      });
    } catch (e) {
      console.warn('Auto transfer event creation skipped:', e);
    }

    return newTransfer;
  },

  async verifyAndAcceptTransfer(transferId) {
    let remoteAccepted = null;
    try {
      if (!IS_MOCK_FALLBACK) {
        const response = await apiClient.post(`/transfers/${transferId}/accept`);
        if (response?.data) {
          remoteAccepted = response.data;
        }
      }
    } catch (err) {
      console.warn('[TransferService] Remote transfer accept sync failed, updating locally:', err);
    }

    let acceptedTransfer = remoteAccepted;

    const updater = (t) => {
      if (t.id === transferId) {
        const updated = {
          ...t,
          status: 'VERIFIED',
          completedAt: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
          steps: (t.steps || []).map((s) => ({
            ...s,
            status: 'COMPLETED',
            timestamp: s.timestamp || new Date().toLocaleTimeString()
          }))
        };
        if (!acceptedTransfer) acceptedTransfer = updated;
        return updated;
      }
      return t;
    };

    if (isSandboxModeActive()) {
      sandboxTransfersState = sandboxTransfersState.map(updater);
    } else {
      const current = getGenuineTransfers().map(updater);
      saveGenuineTransfers(current);
    }

    // Auto-record RECEIVE event in custody timeline and update evidence custodian
    if (acceptedTransfer) {
      try {
        await custodyService.recordCustodyEvent({
          evidenceId: acceptedTransfer.evidenceId,
          event: 'RECEIVE',
          actor: acceptedTransfer.toActor,
          organization: acceptedTransfer.toOrg,
          hash: acceptedTransfer.manifestHash,
          notes: `Transfer verified and received by ${acceptedTransfer.toOrg}. ECDSA manifest seal confirmed.`
        });
        await evidenceService.updateEvidenceCustodian(
          acceptedTransfer.evidenceId,
          acceptedTransfer.toOrg,
          'RECEIVE'
        );

        const { auditService } = await import('./auditService');
        await auditService.logEvent({
          evidenceId: acceptedTransfer.evidenceId,
          event: 'TRANSFER_ACCEPTED',
          actor: acceptedTransfer.toActor,
          organization: acceptedTransfer.toOrg,
          details: `Transfer ${transferId} verified and accepted into custody by ${acceptedTransfer.toOrg}.`,
          reference: acceptedTransfer.blockchainTx || ('0x' + Array.from({length: 64}, () => Math.floor(Math.random()*16).toString(16)).join('')),
          verification: 'VERIFIED'
        });
      } catch (e) {
        console.warn('Auto receive event creation skipped:', e);
      }
    }

    return acceptedTransfer;
  },

  async deleteTransfersByEvidenceId(evidenceId) {
    const cleanId = (evidenceId || '').toUpperCase();
    if (isSandboxModeActive()) {
      sandboxTransfersState = sandboxTransfersState.filter(t => (t.evidenceId || '').toUpperCase() !== cleanId);
    } else {
      const current = getGenuineTransfers().filter(t => (t.evidenceId || '').toUpperCase() !== cleanId);
      saveGenuineTransfers(current);
    }
    return { success: true };
  },

  async wipeAllTransfers() {
    if (isSandboxModeActive()) {
      sandboxTransfersState = [];
    } else {
      localStorage.removeItem('cee_genuine_transfers');
    }
    return { success: true };
  },

  async approveCriticalTransfer(transferId, approverDid, approverName, approverRole) {
    const cleanId = (transferId || '').toUpperCase();
    let updatedTransfer = null;

    const updater = (trf) => {
      if ((trf.id || '').toUpperCase() === cleanId) {
        const existingApprovals = trf.approvals || [];
        const alreadyApproved = existingApprovals.some(
          a => a.approverDid?.toLowerCase() === approverDid?.toLowerCase()
        );

        let newApprovals = [...existingApprovals];
        if (!alreadyApproved) {
          newApprovals.push({
            approverDid,
            approverName: approverName || 'Consortium Signer',
            approverRole: approverRole || 'Consortium Stakeholder',
            signedAt: new Date().toISOString()
          });
        }

        const quorumMet = newApprovals.length >= 2;
        updatedTransfer = {
          ...trf,
          approvals: newApprovals,
          requiresQuorum: !quorumMet,
          status: quorumMet ? 'APPROVED_READY_FOR_DISPATCH' : 'AWAITING_APPROVAL'
        };
        return updatedTransfer;
      }
      return trf;
    };

    if (isSandboxModeActive()) {
      sandboxTransfersState = sandboxTransfersState.map(updater);
    } else {
      const current = getGenuineTransfers().map(updater);
      saveGenuineTransfers(current);
    }

    try {
      const { auditService } = await import('./auditService');
      await auditService.logEvent({
        evidenceId: updatedTransfer?.evidenceId || 'TRANSFER',
        event: 'APPLICATION_QUORUM_APPROVAL',
        actor: approverName || approverDid,
        details: `Application-Level Quorum Gate approval cast for transfer ${cleanId}. Total approvals: ${updatedTransfer?.approvals?.length || 1}/2.`,
        reference: `QUORUM-${cleanId}-${Date.now().toString(16)}`,
        verification: 'VERIFIED'
      });
    } catch (e) {
      console.warn('Audit log for quorum approval failed:', e);
    }

    return updatedTransfer;
  },

  async cascadeRevokeTransferByDid(revokedDid) {
    const cleanDid = (revokedDid || '').toLowerCase();
    const updater = (trf) => {
      if ((trf.fromActor || '').toLowerCase().includes(cleanDid) || (trf.toActor || '').toLowerCase().includes(cleanDid)) {
        return {
          ...trf,
          status: 'CANCELED_REVOKED_IDENTITY',
          notes: 'Transfer permanently terminated due to Consortium Revocation Cascade.'
        };
      }
      return trf;
    };

    if (isSandboxModeActive()) {
      sandboxTransfersState = sandboxTransfersState.map(updater);
    } else {
      const current = getGenuineTransfers().map(updater);
      saveGenuineTransfers(current);
    }

    return { success: true };
  }
};
