import React, { useState, useEffect } from 'react';
import { PageHeader } from '../../components/layout/PageHeader';
import { TransferQueue } from '../../components/transfer/TransferQueue';
import { TransferWorkflowVisualizer } from '../../components/transfer/TransferWorkflowVisualizer';
import { NewTransferModal } from '../../components/transfer/NewTransferModal';
import { LoadingState } from '../../components/common/StateViews';
import { transferService } from '../../services/transferService';
import { evidenceService } from '../../services/evidenceService';
import { useApp } from '../../context/AppContext';
import { Send } from 'lucide-react';
import { BlockchainTerminalOverlay } from '../../components/common/BlockchainTerminalOverlay';

export const TransfersPage = () => {
  const { refreshTrigger, triggerRefresh } = useApp();
  const [transfers, setTransfers] = useState([]);
  const [evidenceList, setEvidenceList] = useState([]);
  const [selectedTransfer, setSelectedTransfer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showTerminal, setShowTerminal] = useState(false);
  const [acceptingId, setAcceptingId] = useState(null);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [t, e] = await Promise.all([
          transferService.getTransfers(),
          evidenceService.getAllEvidence()
        ]);
        setTransfers(t);
        setEvidenceList(e);
        if (t.length > 0 && !selectedTransfer) {
          setSelectedTransfer(t[0]);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshTrigger]);

  const handleAcceptTransfer = (transferId) => {
    setAcceptingId(transferId);
    setShowTerminal(true);
  };

  const executeAccept = async () => {
    try {
      if (acceptingId) {
        await transferService.verifyAndAcceptTransfer(acceptingId);
        triggerRefresh();
      }
    } catch (err) {
      console.error(err);
      alert("Failed to accept transfer: " + err.message);
    } finally {
      setShowTerminal(false);
      setAcceptingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Cross-Organization Transfers"
        subtitle="Manage inter-agency evidence transfers."
        breadcrumbs={['Dashboard', 'Transfers']}
        actionButton={
          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-ce-brand hover:bg-ce-brand-hover text-white text-xs font-mono font-bold transition-all shadow-sm"
          >
            <Send className="w-4 h-4" />
            <span>Initiate Transfer</span>
          </button>
        }
      />

      {/* Workflow Diagram */}
      <TransferWorkflowVisualizer selectedTransfer={selectedTransfer} />

      {/* Main Transfer Queue */}
      {loading ? (
        <LoadingState message="Loading inter-organization evidence transmission queue..." />
      ) : (
        <TransferQueue
          transfers={transfers}
          selectedTransferId={selectedTransfer?.id}
          onSelectTransfer={(t) => setSelectedTransfer(t)}
          onAcceptTransfer={handleAcceptTransfer}
        />
      )}

      {/* New Transfer Modal */}
      <NewTransferModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        evidenceList={evidenceList}
        onCreated={() => triggerRefresh()}
      />

      {/* Terminal Overlay for Receiving Custody */}
      <BlockchainTerminalOverlay 
        isOpen={showTerminal} 
        title="EVM NODE: VERIFY & ACCEPT PROTOCOL"
        onComplete={executeAccept}
        steps={[
          "Authenticating multi-sig wallet identity...",
          "Validating cryptographic payload signatures...",
          "Decoding manifest from Organization A...",
          "Checking on-chain registry for evidence ID lock...",
          "Executing smart contract: transferAsset(assetId, newOwner)",
          "Awaiting Proof-of-Authority block confirmation...",
          "Custody Transferred successfully! Ledger updated."
        ]}
      />
    </div>
  );
};
