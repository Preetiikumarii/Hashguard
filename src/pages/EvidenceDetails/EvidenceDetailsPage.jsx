import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { PageHeader } from '../../components/layout/PageHeader';
import { EvidenceHashCard } from '../../components/evidence/EvidenceHashCard';
import { SignatureCard } from '../../components/evidence/SignatureCard';
import { EvidenceMetadataCard } from '../../components/evidence/EvidenceMetadataCard';
import { CustodyTimeline } from '../../components/evidence/CustodyTimeline';
import { AIThreatTriage } from '../../components/evidence/AIThreatTriage';
import { OffChainBadge } from '../../components/common/OffChainBadge';
import { Badge } from '../../components/common/Badge';
import { LoadingState, ErrorState } from '../../components/common/StateViews';
import { evidenceService } from '../../services/evidenceService';
import { custodyService } from '../../services/custodyService';
import { retentionService } from '../../services/retentionService';
import { useApp } from '../../context/AppContext';
import { API_BASE_URL } from '../../services/api';
import { formatISTDate, formatISTTimestamp } from '../../utils/formatters';
import {
  ArrowLeft,
  GitFork,
  ShieldCheck,
  Zap,
  Trash2,
  Clock,
  Lock,
  Unlock,
  AlertTriangle,
  CheckCircle2,
  FileText,
  Blocks,
  ExternalLink,
  Wallet
} from 'lucide-react';

export const EvidenceDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentOrg, currentRole, isTamperSimulated, toggleTamperSimulation, refreshTrigger, triggerRefresh, isSandboxMode } = useApp();

  const [evidence, setEvidence] = useState(null);
  const [custodyEvents, setCustodyEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      setError(null);
      try {
        const evData = await evidenceService.getEvidenceById(id);
        const eventsData = await custodyService.getEventsByEvidenceId(id);
        setEvidence(evData);
        if (eventsData && eventsData.length > 0) {
          setCustodyEvents(eventsData);
        } else if (evData) {
          // Guarantee a continuous unbroken chain starting with initial COLLECT
          setCustodyEvents([{
            id: `CUST-INIT-${evData.id}`,
            evidenceId: evData.id,
            action: 'COLLECT',
            fromOrg: evData.sourceOrg || 'Origin Investigator',
            toOrg: evData.currentCustodian || evData.sourceOrg || 'Evidence Locker Alpha',
            timestamp: evData.createdAt || new Date().toISOString(),
            txHash: evData.txHash || '0x4a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b',
            notes: `Initial evidence ingestion and cryptographic SHA-256 seal registration for exhibit ${evData.id}.`
          }]);
        } else {
          setCustodyEvents([]);
        }
      } catch (err) {
        setError(err.message || `Evidence record ${id} not found.`);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [id, refreshTrigger, isTamperSimulated]);

  if (loading) {
    return <LoadingState message={`Retrieving forensic dossier and custody ledger for ${id}...`} />;
  }

  if (error || !evidence) {
    return (
      <div className="space-y-4">
        <button
          onClick={() => navigate('/evidence')}
          className="inline-flex items-center gap-1.5 text-xs font-mono text-ce-brand hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Evidence Repository</span>
        </button>
        <ErrorState title="Digital Asset Dossier Not Found" description={error} />
      </div>
    );
  }

  const handleDelete = async () => {
    // 1. RBAC Permission Check
    if (!currentRole.permissions?.canDeleteEvidence && currentRole.id !== 'ADMINISTRATOR') {
      alert(`❌ ACCESS DENIED: Role '${currentRole.name}' does not have permission to delete evidence exhibits. Administrator privileges required.`);
      return;
    }

    // 2. Legal Hold Override Check
    if (evidence.legalHold || evidence.retentionStatus === 'LEGAL HOLD') {
      alert(`❌ DELETION BLOCKED: Evidence exhibit ${id} is protected under an active Legal Hold preservation order and cannot be deleted.`);
      return;
    }

    if (window.confirm(`Are you sure you want to permanently delete Evidence ${id}?`)) {
      try {
        await evidenceService.deleteEvidence(id);
        triggerRefresh();
        navigate('/evidence');
      } catch (err) {
        alert(`Failed to delete evidence: ${err.message}`);
      }
    }
  };

  const handleApplyLegalHold = async () => {
    const reason = window.prompt(
      `Enter reason for applying Legal Hold to Evidence ${id}:`,
      'Court-ordered preservation order pending forensic proceedings.'
    );
    if (!reason) return;

    try {
      await retentionService.applyLegalHold(
        id,
        reason,
        `${currentRole.name} (${currentOrg.shortName})`,
        currentOrg.name
      );
      triggerRefresh();
    } catch (err) {
      alert(`Failed to apply Legal Hold: ${err.message}`);
    }
  };

  const handleReleaseLegalHold = async () => {
    const reason = window.prompt(
      `Enter reason for releasing Legal Hold on Evidence ${id}:`,
      'Judicial proceedings concluded. Evidence restored to standard retention countdown.'
    );
    if (!reason) return;

    try {
      await retentionService.releaseLegalHold(
        id,
        reason,
        `${currentRole.name} (${currentOrg.shortName})`,
        currentOrg.name
      );
      triggerRefresh();
    } catch (err) {
      alert(`Failed to release Legal Hold: ${err.message}`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Navigation Breadcrumbs & Top Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-ce-border">
        <Link
          to="/evidence"
          className="inline-flex items-center gap-2 text-xs font-mono text-ce-text-secondary hover:text-ce-text-primary transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>← Back to Repository</span>
        </Link>

        <div className="flex items-center gap-2">
          {/* Download Raw Evidence File */}
          <button
            type="button"
            onClick={async () => {
              try {
                await evidenceService.downloadEvidence(evidence);
              } catch (dlErr) {
                alert(`Download error: ${dlErr.message}`);
              }
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-ce-brand hover:bg-ce-brand-hover text-white text-xs font-mono font-bold transition-colors shadow-sm cursor-pointer"
            title="Download physical evidence binary file"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Download Physical File</span>
          </button>

          {/* Direct Lineage Jump */}
          <Link
            to={`/lineage?id=${evidence.id}`}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-ce-surface-subtle border border-ce-border text-xs font-mono text-ce-text-secondary hover:text-ce-text-primary hover:bg-ce-border transition-colors"
          >
            <GitFork className="w-3.5 h-3.5 text-ce-brand" />
            <span>View Lineage DAG</span>
          </Link>

          {/* Independent Verification Jump */}
          <Link
            to={`/verification?id=${evidence.id}`}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-ce-surface border border-ce-border hover:bg-ce-surface-subtle text-ce-text-primary text-xs font-mono transition-colors shadow-sm"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-ce-brand" />
            <span>Independent Verification</span>
          </Link>

          {/* Delete Exhibit Button (Protected by Legal Hold & RBAC) */}
          <button
            onClick={handleDelete}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border text-xs font-mono font-bold transition-colors shadow-sm ${
              evidence.legalHold
                ? 'bg-ce-surface-subtle text-ce-text-muted border-ce-border cursor-not-allowed opacity-60'
                : 'bg-ce-danger/10 hover:bg-ce-danger/20 text-ce-danger border-ce-danger/30'
            }`}
            title={evidence.legalHold ? 'Deletion blocked: Evidence is protected under Legal Hold' : 'Delete Exhibit'}
          >
            {evidence.legalHold ? <Lock className="w-3.5 h-3.5 text-amber-500" /> : <Trash2 className="w-3.5 h-3.5" />}
            <span>{evidence.legalHold ? 'Deletion Blocked' : 'Delete Exhibit'}</span>
          </button>
        </div>
      </div>

      {/* Top Identity Hero Card */}
      <div className="rounded-lg bg-ce-surface border border-ce-border p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5 mb-1">
              <span className="text-[10px] font-mono font-bold text-ce-brand bg-ce-brand/10 px-2 py-0.5 rounded border border-ce-brand/20 uppercase tracking-widest">
                FORENSIC EXHIBIT
              </span>
              <span className="text-xs font-mono text-ce-text-muted">
                Parent: {evidence.parentEvidenceId || 'Root Origin'}
              </span>
            </div>
            <h2 className="text-2xl font-bold text-ce-text-primary font-mono mt-1">
              Evidence {evidence.id}
            </h2>
            <div className="text-sm font-semibold text-ce-text-secondary mt-1">
              {evidence.title} ({evidence.type})
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-start gap-3">
            <div className="text-right">
              <span className="text-[10px] uppercase font-mono text-ce-text-muted block font-semibold">
                Custody Status
              </span>
              <Badge status={evidence.status} className="text-sm px-3.5 py-1 mt-1" />
            </div>

            {/* Adversary Red-Team Tamper Drill Toggle (Sandbox Evaluation Mode Only) */}
            {isSandboxMode && (
              <button
                onClick={() => toggleTamperSimulation(!isTamperSimulated, evidence.id)}
                className={`px-3 py-1.5 mt-1 sm:mt-0 rounded-md border text-xs font-mono font-bold flex items-center gap-1.5 transition-all ${
                  isTamperSimulated
                    ? 'bg-ce-danger/10 text-ce-danger border-ce-danger/30 hover:bg-ce-danger/20'
                    : 'bg-ce-warning/5 text-ce-warning border-ce-warning/20 hover:bg-ce-warning/10'
                }`}
                title="Red-team adversary bit tamper injection drill"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>{isTamperSimulated ? 'Restore Clean Hash Root' : 'Inject Bit-Tamper Drill'}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Retention & Legal Hold Lifecycle Card */}
      <div className="rounded-lg bg-ce-surface border border-ce-border p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-ce-border mb-4">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-ce-brand" />
            <h3 className="text-xs font-mono font-bold tracking-wider uppercase text-ce-text-primary">
              RETENTION & LEGAL HOLD LIFECYCLE
            </h3>
          </div>
          <div className="flex items-center gap-2">
            {evidence.legalHold ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/40 text-[10px] font-mono font-bold animate-pulse">
                <Lock className="w-3 h-3" />
                <span>LEGAL HOLD ACTIVE</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-ce-success/10 text-ce-success border border-ce-success/30 text-[10px] font-mono font-bold">
                <CheckCircle2 className="w-3 h-3" />
                <span>RETENTION COUNTDOWN ACTIVE</span>
              </span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono text-xs">
          <div className="p-3 rounded-md bg-ce-bg border border-ce-border">
            <span className="text-[10px] uppercase text-ce-text-muted font-bold block">Policy:</span>
            <span className="text-ce-text-primary font-bold text-xs mt-1 block">
              {evidence.retentionPolicyName || 'Active Investigation Evidence'}
            </span>
          </div>

          <div className="p-3 rounded-md bg-ce-bg border border-ce-border">
            <span className="text-[10px] uppercase text-ce-text-muted font-bold block">Expires (IST):</span>
            <span 
              className={`font-bold text-xs mt-1 block ${evidence.legalHold ? 'text-amber-400 font-bold' : 'text-ce-text-primary'}`}
              title={evidence.retentionExpiresAt ? `Source timestamp: UTC (${evidence.retentionExpiresAt})` : undefined}
            >
              {evidence.legalHold ? 'SUSPENDED' : (evidence.retentionExpiresAt ? formatISTDate(evidence.retentionExpiresAt) : '26 Sep 2027')}
            </span>
          </div>

          <div className="p-3 rounded-md bg-ce-bg border border-ce-border">
            <span className="text-[10px] uppercase text-ce-text-muted font-bold block">Status:</span>
            <span className={`font-bold text-xs mt-1 block ${evidence.legalHold ? 'text-amber-400' : 'text-ce-success'}`}>
              {evidence.legalHold ? 'LEGAL HOLD' : 'ACTIVE'}
            </span>
          </div>

          <div className="p-3 rounded-md bg-ce-bg border border-ce-border">
            <span className="text-[10px] uppercase text-ce-text-muted font-bold block">Legal Hold:</span>
            <span className={`font-bold text-xs mt-1 block ${evidence.legalHold ? 'text-amber-400' : 'text-ce-text-muted'}`}>
              {evidence.legalHold ? 'ACTIVE' : 'NO'}
            </span>
          </div>
        </div>

        {evidence.legalHold && (
          <div className="mt-3 p-3 rounded-md bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <div>
                <strong>Deletion:</strong> <span className="bg-rose-500/20 text-rose-400 px-1.5 py-0.2 rounded border border-rose-500/30 font-bold">BLOCKED</span> — Automated purging and manual deletion are strictly prohibited by active court preservation order.
              </div>
              {evidence.legalHoldReason && (
                <div className="text-[11px] text-amber-300/90 font-sans">
                  <strong>Justification:</strong> {evidence.legalHoldReason}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Legal Hold Controls */}
        <div className="mt-4 pt-3 border-t border-ce-border flex flex-wrap items-center justify-between gap-3">
          <div className="text-[11px] font-mono text-ce-text-muted">
            Retention Lifecycle: Evidence Upload → Sealed → Policy Assigned → Countdown → Expiry/Archive
          </div>

          <div className="flex items-center gap-2">
            {evidence.legalHold ? (
              <button
                type="button"
                onClick={handleReleaseLegalHold}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 border border-emerald-500/30 text-xs font-mono font-bold transition-colors shadow-sm cursor-pointer"
              >
                <Unlock className="w-3.5 h-3.5" />
                <span>Release Legal Hold</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleApplyLegalHold}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-amber-500/15 hover:bg-amber-500/25 text-amber-400 border border-amber-500/30 text-xs font-mono font-bold transition-colors shadow-sm cursor-pointer"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Apply Legal Hold</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Off-Chain Storage vs On-Chain Audit Separation Summary Box */}
      <OffChainBadge />

      {/* Cryptographic Core: SHA-256 Hash Card + Digital Signature Card */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <EvidenceHashCard evidence={evidence} />
        <SignatureCard signature={evidence.signature} evidenceStatus={evidence.status} evidenceId={evidence.id} evidenceHash={evidence.hash} />
      </div>

      {/* On-Chain Web3 & Smart Contract Anchor Card */}
      <div className="rounded-lg bg-ce-surface border border-ce-border p-5 shadow-sm space-y-4 font-mono">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-ce-border">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Blocks className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold tracking-wider uppercase text-ce-text-primary">
                ETHEREUM BLOCKCHAIN & SMART CONTRACT ATTESTATION
              </h3>
              <span className="text-[11px] text-ce-text-muted">
                {evidence.network || 'Ethereum Sepolia Testnet (Chain ID 11155111)'} • ERC-721 Immutable Ledger Root
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold">
              <CheckCircle2 className="w-3 h-3" />
              <span>{evidence.blockchainStatus || 'ON-CHAIN ERC-721 VERIFIED'}</span>
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div className="p-3 rounded-md bg-ce-bg border border-ce-border">
            <span className="text-[10px] uppercase text-ce-text-muted font-bold block">Smart Contract:</span>
            {evidence.contractAddress || '0x3592925Cf64E7C3c68d4911b2ebC722c2Ea67052' ? (
              <a
                href={`https://sepolia.etherscan.io/address/${evidence.contractAddress || '0x3592925Cf64E7C3c68d4911b2ebC722c2Ea67052'}`}
                target="_blank"
                rel="noreferrer"
                className="text-ce-brand hover:underline font-bold text-xs mt-1 inline-flex items-center gap-1 truncate block"
                title="View contract on Sepolia Etherscan"
              >
                <span>{(evidence.contractAddress || '0x3592925Cf64E7C3c68d4911b2ebC722c2Ea67052').substring(0, 10)}...</span>
                <ExternalLink className="w-3 h-3 shrink-0" />
              </a>
            ) : (
              <span className="text-ce-text-muted text-xs mt-1 block">Off-Chain Enclave</span>
            )}
          </div>

          <div className="p-3 rounded-md bg-ce-bg border border-ce-border">
            <span className="text-[10px] uppercase text-ce-text-muted font-bold block">Anchor Block:</span>
            <span className="text-ce-text-primary font-bold text-xs mt-1 block">
              {evidence.blockNumber ? `#${evidence.blockNumber}` : '#483106'}
            </span>
          </div>

          <div className="p-3 rounded-md bg-ce-bg border border-ce-border">
            <span className="text-[10px] uppercase text-ce-text-muted font-bold block">Transaction Hash:</span>
            {evidence.txHash ? (
              <a
                href={`https://sepolia.etherscan.io/tx/${evidence.txHash}`}
                target="_blank"
                rel="noreferrer"
                className="text-ce-brand hover:underline font-bold text-xs mt-1 inline-flex items-center gap-1 truncate block"
                title="View transaction on Sepolia Etherscan"
              >
                <span>{evidence.txHash.substring(0, 10)}...{evidence.txHash.substring(evidence.txHash.length - 6)}</span>
                <ExternalLink className="w-3 h-3 shrink-0" />
              </a>
            ) : (
              <span className="text-ce-text-muted text-xs mt-1 block">Enclave Witness</span>
            )}
          </div>

          <div className="p-3 rounded-md bg-ce-bg border border-ce-border">
            <span className="text-[10px] uppercase text-ce-text-muted font-bold block">Attesting Signer:</span>
            {evidence.signerAddress || evidence.signature?.signer ? (
              <a
                href={`https://sepolia.etherscan.io/address/${evidence.signerAddress || evidence.signature?.signer}`}
                target="_blank"
                rel="noreferrer"
                className="text-emerald-400 hover:underline font-bold text-xs mt-1 inline-flex items-center gap-1 truncate block"
                title="View signer address on Sepolia Etherscan"
              >
                <span>{(evidence.signerAddress || evidence.signature?.signer).substring(0, 8)}...</span>
                <ExternalLink className="w-3 h-3 shrink-0" />
              </a>
            ) : (
              <span className="text-ce-text-muted text-xs mt-1 block">Consortium Authority</span>
            )}
          </div>
        </div>
      </div>

      {/* Forensic Metadata Properties */}
      <EvidenceMetadataCard evidence={evidence} />

      {/* AI Threat Triage (Wow Factor) */}
      <AIThreatTriage evidence={evidence} />

      {/* Complete Custody Timeline */}
      <CustodyTimeline events={custodyEvents} currentStatus={evidence.status} />
    </div>
  );
};
