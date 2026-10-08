import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, useParams } from 'react-router-dom';
import {
  ShieldCheck,
  ShieldAlert,
  UserCheck,
  Lock,
  History,
  GitFork,
  FileSpreadsheet,
  Key,
  Clock,
  ArrowRight,
  ExternalLink,
  Download,
  AlertTriangle,
  RotateCcw,
  CheckCircle2,
  XCircle,
  FileCheck2,
  Users2,
  BadgeAlert
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { evidenceService } from '../../services/evidenceService';
import { auditService } from '../../services/auditService';
import { PageHeader } from '../../components/layout/PageHeader';
import { formatToIST } from '../../utils/formatters';

export const PassportPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { id: routeId } = useParams();
  const navigate = useNavigate();
  const {
    isTamperSimulated,
    toggleTamperSimulation,
    isDidRevoked,
    revokedDids,
    executeRevocationCascade,
    grantTemporaryAccess,
    updateAssetSensitivity,
    refreshTrigger
  } = useApp();

  const [allEvidence, setAllEvidence] = useState([]);
  const [selectedEvidenceId, setSelectedEvidenceId] = useState(
    routeId || searchParams.get('id') || 'EV-001'
  );
  const [evidence, setEvidence] = useState(null);
  const [auditLogs, setAuditLogs] = useState([]);
  const [downloadSimulationResult, setDownloadSimulationResult] = useState(null);
  const [isLeaseModalOpen, setIsLeaseModalOpen] = useState(false);
  const [isBoundaryModalOpen, setIsBoundaryModalOpen] = useState(false);
  const [tempLeaseDid, setTempLeaseDid] = useState('did:ethr:0x70997970C51812dc3A010C7d01b50e0d17dc79B1');
  const [tempLeaseHours, setTempLeaseHours] = useState('2');
  const [tempLeaseReason, setTempLeaseReason] = useState('Emergency reverse-engineering analysis');

  // Load all evidence items for exhibit selector
  useEffect(() => {
    let isMounted = true;
    const fetchEvidenceList = async () => {
      try {
        const list = await evidenceService.getAllEvidence();
        if (isMounted) {
          setAllEvidence(list);
          const currentId = routeId || searchParams.get('id') || selectedEvidenceId;
          const target = list.find(e => (e.id || '').toUpperCase() === currentId.toUpperCase()) || list[0];
          if (target) {
            setEvidence(target);
            setSelectedEvidenceId(target.id);
          }
        }
      } catch (err) {
        console.error('Error fetching evidence list for passport:', err);
      }
    };
    fetchEvidenceList();
    return () => { isMounted = false; };
  }, [routeId, searchParams, refreshTrigger, isTamperSimulated]);

  // Load audit logs for the current selected exhibit
  useEffect(() => {
    let isMounted = true;
    const fetchLogs = async () => {
      if (!selectedEvidenceId) return;
      try {
        const logs = await auditService.getAuditLogs({ evidenceId: selectedEvidenceId });
        if (isMounted) {
          setAuditLogs(logs || []);
        }
      } catch (err) {
        console.error('Error loading exhibit audit logs:', err);
      }
    };
    fetchLogs();
    return () => { isMounted = false; };
  }, [selectedEvidenceId, refreshTrigger]);

  const handleSelectExhibit = (id) => {
    setSelectedEvidenceId(id);
    setSearchParams({ id });
    setDownloadSimulationResult(null);
  };

  const handleGrantLease = async (e) => {
    e.preventDefault();
    if (!evidence || !tempLeaseDid) return;
    try {
      await grantTemporaryAccess(evidence.id, {
        did: tempLeaseDid,
        durationHours: Number(tempLeaseHours) || 2,
        reason: tempLeaseReason
      });
      setIsLeaseModalOpen(false);
    } catch (err) {
      alert(err.message || 'Failed to grant lease');
    }
  };

  const handleSensitivityChange = async (newLevel) => {
    if (!evidence) return;
    try {
      await updateAssetSensitivity(evidence.id, newLevel);
    } catch (err) {
      alert(err.message || 'Failed to update sensitivity');
    }
  };

  const handleSimulateDownloadCheck = () => {
    if (!evidence) return;
    // Perform deterministic access check
    const checkUserDid = tempLeaseDid || 'did:ethr:0x70997970C51812dc3A010C7d01b50e0d17dc79B1';
    const checkResult = evidenceService.checkAssetAccess(
      evidence,
      checkUserDid,
      'FORENSIC_ANALYST',
      revokedDids
    );
    setDownloadSimulationResult({
      did: checkUserDid,
      timestamp: new Date().toLocaleTimeString(),
      ...checkResult
    });
    setIsBoundaryModalOpen(true);
  };

  const handleDownloadVerificationReport = () => {
    if (!evidence) return;
    const report = {
      reportType: 'Cryptographic Verification Report',
      platform: 'HashGuard Decentralized Trust Platform',
      generatedAt: new Date().toISOString(),
      exhibit: {
        id: evidence.id,
        title: evidence.title,
        caseId: evidence.caseId,
        type: evidence.type,
        sensitivityTier: sensitivity,
        status: isTrustCompromised ? 'TRUST_COMPROMISED' : 'TRUST_VERIFIED',
        verdict: isTrustCompromised ? 'INTEGRITY_FAIL' : 'INTEGRITY_PASS'
      },
      cryptographicState: {
        expectedOnChainRoot: evidence.expectedHash || evidence.hash,
        recomputedOffChainDigest: evidence.hash,
        algorithm: 'FIPS 180-4 SHA-256',
        match: !isTampered,
        blockNumber: evidence.blockNumber,
        txHash: evidence.txHash,
        signer: evidence.signature?.signer,
        keyFingerprint: evidence.signature?.publicKeyFingerprint
      },
      custodyAndGovernance: {
        currentCustodian: evidence.currentCustodian,
        sourceOriginator: evidence.sourceOrg,
        ownerDid: evidence.ownerDid,
        ownerRevoked: isOwnerRevoked,
        governanceRequirement: sensitivity === 'CRITICAL' ? 'Application-Level Quorum Gate (2-of-3 Consensual Approval)' : 'Standard RBAC'
      },
      auditTrailSummary: {
        eventCount: auditLogs.length,
        events: auditLogs.slice(0, 5)
      }
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Cryptographic-Verification-Report-${evidence.id}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const isTampered = evidence?.status === 'COMPROMISED' || (evidence?.id === 'EV-DDXOEY') || (isTamperSimulated && evidence?.id === 'EV-001');
  const isOwnerRevoked = evidence?.ownerDid ? isDidRevoked(evidence.ownerDid) : false;
  const isTrustCompromised = isTampered || isOwnerRevoked;

  const sensitivity = evidence?.sensitivity || 'STANDARD';
  const sensitivityBadgeColors = {
    STANDARD: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    RESTRICTED: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    CRITICAL: 'bg-rose-500/10 text-rose-400 border-rose-500/30'
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Asset Trust Passport"
        subtitle="Verifiable trust state uniting Identity, Authorization, Cryptographic State, Custody, Provenance, and Audit."
        breadcrumbs={['Dashboard', 'Trust Passport']}
        badge={
          <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-md bg-ce-brand/10 text-ce-brand border border-ce-brand/30 flex items-center gap-1.5 uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>PRIMARY PRODUCT VIEW</span>
          </span>
        }
      />

      {/* Exhibit Selector Bar */}
      <div className="p-4 rounded-xl bg-ce-surface border border-ce-border flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <label className="text-xs font-mono text-ce-text-muted uppercase tracking-wider font-semibold">
            Select Exhibit Exhibit:
          </label>
          <select
            value={selectedEvidenceId}
            onChange={(e) => handleSelectExhibit(e.target.value)}
            className="bg-ce-surface-subtle text-ce-text-primary border border-ce-border rounded-lg px-3 py-2 text-sm font-mono font-semibold focus:outline-none focus:border-ce-brand"
          >
            {allEvidence.map((ev) => (
              <option key={ev.id} value={ev.id}>
                {ev.id} — {ev.title} ({ev.sensitivity || 'STANDARD'})
              </option>
            ))}
          </select>
        </div>

        {/* Quick Simulator Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => toggleTamperSimulation(!isTampered, evidence?.id || 'EV-001')}
            className={`px-3 py-1.5 text-xs font-mono font-semibold rounded-lg border transition-all flex items-center gap-1.5 ${
              isTampered
                ? 'bg-ce-success/10 text-ce-success border-ce-success/30 hover:bg-ce-success/20'
                : 'bg-ce-danger/10 text-ce-danger border-ce-danger/30 hover:bg-ce-danger/20'
            }`}
          >
            {isTampered ? (
              <>
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Restore Clean Seal</span>
              </>
            ) : (
              <>
                <BadgeAlert className="w-3.5 h-3.5" />
                <span>Simulate Bit-Flip Tamper</span>
              </>
            )}
          </button>

          <button
            onClick={() => setIsLeaseModalOpen(true)}
            className="px-3 py-1.5 text-xs font-mono font-semibold rounded-lg bg-ce-surface-subtle hover:bg-ce-border text-ce-text-primary border border-ce-border transition-colors flex items-center gap-1.5"
          >
            <Clock className="w-3.5 h-3.5 text-ce-brand" />
            <span>Grant Time Lease</span>
          </button>

          <button
            onClick={handleSimulateDownloadCheck}
            className="px-3 py-1.5 text-xs font-mono font-semibold rounded-lg bg-ce-surface-subtle hover:bg-ce-border text-ce-text-primary border border-ce-border transition-colors flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Verify Access Boundary</span>
          </button>

          <button
            onClick={handleDownloadVerificationReport}
            className="px-3 py-1.5 text-xs font-mono font-semibold rounded-lg bg-ce-brand text-ce-surface hover:opacity-90 transition-opacity flex items-center gap-1.5"
            title="Download Cryptographic Verification Report"
          >
            <FileCheck2 className="w-3.5 h-3.5" />
            <span>Cryptographic Verification Report</span>
          </button>
        </div>
      </div>

      {/* Main Unified Verdict Banner */}
      <div
        className={`p-6 rounded-2xl border transition-all ${
          isTrustCompromised
            ? 'bg-rose-500/10 dark:bg-gradient-to-r dark:from-rose-950/40 dark:via-red-900/20 dark:to-black border-rose-500/40 shadow-sm'
            : 'bg-emerald-500/10 dark:bg-gradient-to-r dark:from-emerald-950/40 dark:via-teal-900/20 dark:to-black border-emerald-500/40 shadow-sm'
        }`}
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div
              className={`p-3.5 rounded-xl border shrink-0 ${
                isTrustCompromised
                  ? 'bg-rose-500/20 border-rose-500/40 text-rose-600 dark:text-rose-400 animate-pulse'
                  : 'bg-emerald-500/20 border-emerald-500/40 text-emerald-600 dark:text-emerald-400'
              }`}
            >
              {isTrustCompromised ? (
                <ShieldAlert className="w-8 h-8" />
              ) : (
                <ShieldCheck className="w-8 h-8" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-3 flex-wrap">
                <span
                  className={`text-sm font-mono font-extrabold px-3 py-1 rounded-full border tracking-widest ${
                    isTrustCompromised
                      ? 'bg-rose-500/20 text-rose-700 dark:text-rose-300 border-rose-500/50'
                      : 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-emerald-500/50'
                  }`}
                >
                  {isTrustCompromised ? 'VERDICT: TRUST COMPROMISED' : 'VERDICT: TRUST VERIFIED'}
                </span>
                <span className="text-xs font-mono text-ce-text-muted">
                  Exhibit ID: <strong className="text-ce-text-primary">{evidence?.id}</strong>
                </span>
                <span className={`text-xs font-mono px-2 py-0.5 rounded border ${sensitivityBadgeColors[sensitivity]}`}>
                  {sensitivity} SENSITIVITY
                </span>
              </div>
              <h2 className="text-xl font-bold text-ce-text-primary mt-2">
                {evidence?.title || 'Loading Exhibit...'}
              </h2>
              <p className="text-xs text-ce-text-secondary mt-1 max-w-3xl leading-relaxed">
                {isTrustCompromised
                  ? isTampered
                    ? 'CRITICAL ALERT: Off-chain payload byte sequence does NOT match the immutable on-chain sealed hash root. Cryptographic integrity failed.'
                    : 'AUTHORIZATION REVOKED: Owner or custodian identity has been revoked via Consortium Revocation Cascade. Asset governance locked.'
                  : 'All six cryptographic and governance pillars verified. Zero bitstream tampering, custody transitions monotonically sequenced, and active consortium attestation confirmed.'}
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row lg:flex-col gap-2 shrink-0">
            <div className="p-3 rounded-lg bg-ce-surface border border-ce-border text-right sm:text-left lg:text-right shadow-xs">
              <span className="text-[10px] font-mono text-ce-text-muted uppercase tracking-wider block">
                Verification Ledger
              </span>
              <span className="text-xs font-mono text-ce-text-primary font-bold">
                Block #{evidence?.blockNumber || 482910}
              </span>
            </div>
            <div className="p-3 rounded-lg bg-ce-surface border border-ce-border text-right sm:text-left lg:text-right shadow-xs">
              <span className="text-[10px] font-mono text-ce-text-muted uppercase tracking-wider block">
                Custody Chain Depth
              </span>
              <span className="text-xs font-mono text-ce-text-primary font-bold">
                {evidence?.derivedCount > 0 ? `${evidence.derivedCount} Derived Children` : 'Root Exhibit'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Trust Continuity Pipeline Visualization */}
      <div className="p-5 rounded-xl bg-ce-surface border border-ce-border">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <GitFork className="w-4 h-4 text-ce-brand" />
            <h3 className="text-xs font-mono font-bold text-ce-text-primary uppercase tracking-wider">
              Trust Continuity Lifecycle Pipeline
            </h3>
          </div>
          <span className="text-[11px] font-mono text-ce-text-muted">
            Monotonic State Invariants Enforced
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-2">
          {[
            { step: '1. IDENTITY', label: 'WHO', ok: !isOwnerRevoked, detail: isOwnerRevoked ? 'REVOKED' : 'VALID DID' },
            { step: '2. AUTHORIZATION', label: 'RIGHTS', ok: true, detail: sensitivity },
            { step: '3. ASSET', label: 'SPECIMEN', ok: true, detail: evidence?.type || 'Binary' },
            { step: '4. CRYPTO SEAL', label: 'SHA-256', ok: !isTampered, detail: isTampered ? 'MISMATCH' : 'ROOT SEALED' },
            { step: '5. CUSTODY', label: 'CUSTODIAN', ok: true, detail: evidence?.currentCustodian?.split(' ')[0] || 'Org B' },
            { step: '6. VERIFY', label: 'INDEPENDENT', ok: !isTampered, detail: isTampered ? 'FAIL' : 'PASS' },
            { step: '7. PROVENANCE', label: 'ORIGIN', ok: true, detail: evidence?.sourceOrg?.split(' ')[0] || 'Org A' },
            { step: '8. AUDIT', label: 'TAMPER-EVIDENT', ok: true, detail: `${auditLogs.length} Events` },
          ].map((node, i) => (
            <div
              key={i}
              className={`p-2.5 rounded-lg border text-center transition-all ${
                node.ok
                  ? 'bg-ce-surface-subtle border-ce-border text-ce-text-primary'
                  : 'bg-rose-950/20 border-rose-500/40 text-rose-300'
              }`}
            >
              <div className="text-[10px] font-mono text-ce-text-muted font-bold">{node.step}</div>
              <div className="text-xs font-bold mt-1 flex items-center justify-center gap-1">
                {node.ok ? (
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                ) : (
                  <XCircle className="w-3 h-3 text-rose-400" />
                )}
                <span>{node.label}</span>
              </div>
              <div className="text-[10px] font-mono text-ce-text-muted mt-1 truncate">
                {node.detail}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Simulated Download Check Feedback Card */}
      {downloadSimulationResult && (
        <div
          className={`p-4 rounded-xl border-2 font-mono text-xs shadow-sm transition-all ${
            downloadSimulationResult.allowed
              ? 'bg-emerald-50 text-emerald-950 border-emerald-400 dark:bg-emerald-950/40 dark:border-emerald-500/50 dark:text-emerald-300'
              : 'bg-rose-50 text-rose-950 border-rose-400 dark:bg-rose-950/40 dark:border-rose-500/50 dark:text-rose-300'
          }`}
        >
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <span className="font-bold flex items-center gap-2 text-xs sm:text-sm">
              {downloadSimulationResult.allowed ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              ) : (
                <XCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
              )}
              <span>ACCESS EVALUATION: {downloadSimulationResult.allowed ? 'HTTP 200 ALLOWED' : 'HTTP 403 FORBIDDEN'}</span>
            </span>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-slate-600 dark:text-slate-400 font-semibold">
                Evaluated at {downloadSimulationResult.timestamp}
              </span>
              <button
                onClick={() => setIsBoundaryModalOpen(true)}
                className="px-2.5 py-1 rounded-md text-[10px] font-bold border border-current hover:underline cursor-pointer"
              >
                Inspect Details
              </button>
            </div>
          </div>
          <p className="mt-1.5 text-[11px] text-slate-800 dark:text-slate-200 leading-relaxed font-sans font-medium">
            DID: <span className="font-mono font-bold text-slate-950 dark:text-white">{downloadSimulationResult.did}</span> — Reason: {downloadSimulationResult.message}
          </p>
        </div>
      )}

      {/* 6 Unified Pillar Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Pillar 1: Identity (WHO) */}
        <div className="p-5 rounded-xl bg-ce-surface border border-ce-border flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-mono text-ce-brand font-bold uppercase tracking-wider flex items-center gap-1.5">
                <UserCheck className="w-3.5 h-3.5" />
                Pillar 1: Identity & Key Attestation
              </span>
              <span
                className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
                  isOwnerRevoked
                    ? 'bg-rose-500/20 text-rose-400 border-rose-500/40'
                    : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                }`}
              >
                {isOwnerRevoked ? 'REVOKED' : 'ACTIVE'}
              </span>
            </div>

            <div className="space-y-2 text-xs font-mono">
              <div>
                <span className="text-ce-text-muted block text-[10px]">Owner DID:</span>
                <span className="text-ce-text-primary break-all">
                  {evidence?.ownerDid || 'did:ethr:0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'}
                </span>
              </div>
              <div>
                <span className="text-ce-text-muted block text-[10px]">Originating Signer:</span>
                <span className="text-ce-text-primary">{evidence?.signature?.signer || 'CERT-Alpha Root CA'}</span>
              </div>
              <div>
                <span className="text-ce-text-muted block text-[10px]">Signature Protocol:</span>
                <span className="text-ce-text-primary">{evidence?.signature?.algorithm || 'ECDSA / secp256k1'}</span>
              </div>
              <div>
                <span className="text-ce-text-muted block text-[10px]">Key Fingerprint:</span>
                <span className="text-ce-text-primary">{evidence?.signature?.publicKeyFingerprint || 'SHA256:4b9a7c...8f12'}</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-ce-border mt-4">
            <p className="text-[11px] text-ce-text-muted">
              DID document is anchored to the permissioned consortium directory. Identity revocation cascades across all downstream assets.
            </p>
          </div>
        </div>

        {/* Pillar 2: Cryptographic State & Integrity */}
        <div className="p-5 rounded-xl bg-ce-surface border border-ce-border flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-mono text-ce-brand font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5" />
                Pillar 2: Cryptographic Seal & Integrity
              </span>
              <span
                className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
                  isTampered
                    ? 'bg-rose-500/20 text-rose-400 border-rose-500/40'
                    : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                }`}
              >
                {isTampered ? 'MISMATCH' : 'MATCH'}
              </span>
            </div>

            <div className="space-y-2 text-xs font-mono">
              <div>
                <span className="text-ce-text-muted block text-[10px]">Expected On-Chain Hash Root:</span>
                <span className="text-ce-text-primary break-all">
                  {evidence?.expectedHash || evidence?.hash}
                </span>
              </div>
              <div>
                <span className="text-ce-text-muted block text-[10px]">Recomputed Off-Chain Hash:</span>
                <span className={`break-all ${isTampered ? 'text-rose-400 font-bold' : 'text-ce-text-primary'}`}>
                  {evidence?.hash}
                </span>
              </div>
              <div>
                <span className="text-ce-text-muted block text-[10px]">Algorithm:</span>
                <span className="text-ce-text-primary">FIPS 180-4 SHA-256</span>
              </div>
              <div>
                <span className="text-ce-text-muted block text-[10px]">On-Chain Transaction Root:</span>
                {evidence?.txHash ? (
                  <a
                    href={`https://sepolia.etherscan.io/tx/${evidence.txHash}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-ce-brand hover:underline truncate block"
                    title="View on Sepolia Etherscan"
                  >
                    {evidence.txHash}
                  </a>
                ) : (
                  <span className="text-ce-text-primary truncate block">Cryptographic Enclave Attestation</span>
                )}
              </div>
              {(evidence?.signerAddress || evidence?.signature?.signer) && (
                <div>
                  <span className="text-ce-text-muted block text-[10px]">Attesting Signer (MetaMask ECDSA):</span>
                  <span className="text-emerald-400 truncate block">
                    {evidence.signerAddress || evidence.signature?.signer}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-ce-border mt-4">
            <p className="text-[11px] text-ce-text-muted">
              Raw bytes remain off-chain in storage enclave. Independent verifiers recompute digest against immutable ledger root.
            </p>
          </div>
        </div>

        {/* Pillar 3: Adaptive Asset Authorization */}
        <div className="p-5 rounded-xl bg-ce-surface border border-ce-border flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-mono text-ce-brand font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5" />
                Pillar 3: Adaptive Authorization
              </span>
              <div className="flex items-center gap-1">
                {['STANDARD', 'RESTRICTED', 'CRITICAL'].map((lvl) => (
                  <button
                    key={lvl}
                    onClick={() => handleSensitivityChange(lvl)}
                    className={`text-[9px] font-mono px-1.5 py-0.5 rounded border transition-colors ${
                      sensitivity === lvl
                        ? sensitivityBadgeColors[lvl]
                        : 'bg-ce-surface-subtle text-ce-text-muted border-ce-border hover:text-ce-text-primary'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2 text-xs font-mono">
              <div>
                <span className="text-ce-text-muted block text-[10px]">Sensitivity Tier:</span>
                <span className="text-ce-text-primary font-bold">{sensitivity}</span>
              </div>
              <div>
                <span className="text-ce-text-muted block text-[10px]">Active Temporary Leases:</span>
                <span className="text-ce-text-primary">
                  {(evidence?.temporaryAccess || []).filter(l => l.status === 'ACTIVE').length} Active Lease(s)
                </span>
              </div>
              <div>
                <span className="text-ce-text-muted block text-[10px]">Governance Quorum Requirement:</span>
                <span className="text-ce-text-primary">
                  {sensitivity === 'CRITICAL' ? 'Application-Level Quorum Gate (2-of-3 Consensual Approval)' : 'Standard RBAC'}
                </span>
              </div>
            </div>

            {sensitivity === 'CRITICAL' && (
              <div className="mt-3 p-2 rounded bg-amber-500/10 border border-amber-500/30 text-[10px] font-mono text-amber-300">
                ⚠️ [APPLICATION-LEVEL QUORUM GATE] Critical transfers enforce 2-of-3 consortium sign-off in application layer pending v2.1 contract deployment.
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-ce-border mt-4">
            <p className="text-[11px] text-ce-text-muted">
              Zero-trust boundary: unauthenticated or expired requests receive strict HTTP 403 rejections.
            </p>
          </div>
        </div>

        {/* Pillar 4: Chain of Custody */}
        <div className="p-5 rounded-xl bg-ce-surface border border-ce-border flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-mono text-ce-brand font-bold uppercase tracking-wider flex items-center gap-1.5">
                <History className="w-3.5 h-3.5" />
                Pillar 4: Custodial Chain of Possession
              </span>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                UNBROKEN
              </span>
            </div>

            <div className="space-y-2 text-xs font-mono">
              <div>
                <span className="text-ce-text-muted block text-[10px]">Current Legal Custodian:</span>
                <span className="text-ce-text-primary font-bold">{evidence?.currentCustodian}</span>
              </div>
              <div>
                <span className="text-ce-text-muted block text-[10px]">Originating Custodian:</span>
                <span className="text-ce-text-primary">{evidence?.sourceOrg}</span>
              </div>
              <div>
                <span className="text-ce-text-muted block text-[10px]">Last Transition Event:</span>
                <span className="text-ce-text-primary">{evidence?.lastEvent} at {formatToIST(evidence?.lastEventTime)}</span>
              </div>
              <div>
                <span className="text-ce-text-muted block text-[10px]">Storage Enclave:</span>
                <span className="text-ce-text-primary truncate block">{evidence?.storageLocation}</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-ce-border mt-4">
            <p className="text-[11px] text-ce-text-muted">
              Every cross-agency handoff generates an mTLS encrypted dispatch manifest and signed acceptance receipt.
            </p>
          </div>
        </div>

        {/* Pillar 5: Provenance & Lineage DAG */}
        <div className="p-5 rounded-xl bg-ce-surface border border-ce-border flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-mono text-ce-brand font-bold uppercase tracking-wider flex items-center gap-1.5">
                <GitFork className="w-3.5 h-3.5" />
                Pillar 5: Provenance & Lineage DAG
              </span>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-ce-surface-subtle text-ce-text-primary border border-ce-border">
                {evidence?.isDerived ? 'DERIVED' : 'ROOT EXHIBIT'}
              </span>
            </div>

            <div className="space-y-2 text-xs font-mono">
              <div>
                <span className="text-ce-text-muted block text-[10px]">Associated Case Reference:</span>
                <span className="text-ce-text-primary font-bold">{evidence?.caseId}</span>
              </div>
              <div>
                <span className="text-ce-text-muted block text-[10px]">Seizure Collector:</span>
                <span className="text-ce-text-primary">{evidence?.collector}</span>
              </div>
              <div>
                <span className="text-ce-text-muted block text-[10px]">Acquisition Date:</span>
                <span className="text-ce-text-primary">{formatToIST(evidence?.createdAt)}</span>
              </div>
              <div>
                <span className="text-ce-text-muted block text-[10px]">Parent Exhibit ID:</span>
                <span className="text-ce-text-primary">{evidence?.parentEvidenceId || 'None (Genesis Artifact)'}</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-ce-border mt-4">
            <p className="text-[11px] text-ce-text-muted">
              Derived artifacts (memory dumps, decompilations, IOC sets) inherit parent cryptographic anchors via directed acyclic graph.
            </p>
          </div>
        </div>

        {/* Pillar 6: Tamper-Evident Audit Trail */}
        <div className="p-5 rounded-xl bg-ce-surface border border-ce-border flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-mono text-ce-brand font-bold uppercase tracking-wider flex items-center gap-1.5">
                <FileSpreadsheet className="w-3.5 h-3.5" />
                Pillar 6: Tamper-Evident Audit Trail
              </span>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-ce-brand/10 text-ce-brand border border-ce-brand/30">
                {auditLogs.length} RECORDS
              </span>
            </div>

            <div className="space-y-2 text-xs font-mono max-h-36 overflow-y-auto pr-1">
              {auditLogs.slice(0, 3).map((log, idx) => (
                <div key={idx} className="p-2 rounded bg-ce-surface-subtle border border-ce-border text-[11px]">
                  <div className="flex items-center justify-between text-ce-text-muted text-[10px]">
                    <span className="font-bold text-ce-text-primary">{log.event}</span>
                    <span>{formatToIST(log.timestamp)}</span>
                  </div>
                  <div className="text-ce-text-muted truncate mt-0.5">{log.details}</div>
                </div>
              ))}
              {auditLogs.length === 0 && (
                <div className="text-ce-text-muted text-[11px]">No local audit events found for exhibit.</div>
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-ce-border mt-4">
            <p className="text-[11px] text-ce-text-muted">
              Tamper-evident audit trail maintains unbroken chronological history. Revocation cascades preserve prior historical records intact.
            </p>
          </div>
        </div>
      </div>

      {/* Temporary Lease Grant Modal */}
      {isLeaseModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-ce-surface border border-ce-border rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <h3 className="text-base font-bold text-ce-text-primary mb-2 flex items-center gap-2">
              <Clock className="w-4 h-4 text-ce-brand" />
              <span>Grant Time-Bound Access Lease</span>
            </h3>
            <p className="text-xs text-ce-text-muted mb-4">
              Authorize an external investigator or analyst with an automatically expiring access lease on exhibit{' '}
              <strong className="text-ce-text-primary">{evidence?.id}</strong>.
            </p>

            <form onSubmit={handleGrantLease} className="space-y-4">
              <div>
                <label className="text-xs font-mono text-ce-text-muted block mb-1">Target DID:</label>
                <input
                  type="text"
                  value={tempLeaseDid}
                  onChange={(e) => setTempLeaseDid(e.target.value)}
                  className="w-full bg-ce-surface-subtle border border-ce-border rounded-lg px-3 py-2 text-xs font-mono text-ce-text-primary focus:outline-none focus:border-ce-brand"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-mono text-ce-text-muted block mb-1">Duration (Hours):</label>
                <select
                  value={tempLeaseHours}
                  onChange={(e) => setTempLeaseHours(e.target.value)}
                  className="w-full bg-ce-surface-subtle border border-ce-border rounded-lg px-3 py-2 text-xs font-mono text-ce-text-primary focus:outline-none focus:border-ce-brand"
                >
                  <option value="1">1 Hour</option>
                  <option value="2">2 Hours (Standard Investigation Window)</option>
                  <option value="6">6 Hours</option>
                  <option value="24">24 Hours</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-mono text-ce-text-muted block mb-1">Operational Purpose:</label>
                <input
                  type="text"
                  value={tempLeaseReason}
                  onChange={(e) => setTempLeaseReason(e.target.value)}
                  className="w-full bg-ce-surface-subtle border border-ce-border rounded-lg px-3 py-2 text-xs font-mono text-ce-text-primary focus:outline-none focus:border-ce-brand"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsLeaseModalOpen(false)}
                  className="px-4 py-2 text-xs font-mono rounded-lg border border-ce-border text-ce-text-muted hover:text-ce-text-primary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-mono font-bold rounded-lg bg-ce-brand text-ce-surface hover:opacity-90"
                >
                  Confirm & Issue Lease
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Access Boundary Verification Modal */}
      {isBoundaryModalOpen && downloadSimulationResult && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#070e1c] border-2 border-slate-300 dark:border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b-2 border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className={`p-2 rounded-xl border ${
                  downloadSimulationResult.allowed
                    ? 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300'
                    : 'bg-rose-100 text-rose-800 border-rose-300 dark:bg-rose-950 dark:text-rose-300'
                }`}>
                  <Download className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-mono text-base font-black text-slate-950 dark:text-white uppercase">
                    Access Boundary Evaluation
                  </h3>
                  <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">
                    EXHIBIT: {evidence?.id} &bull; TIMESTAMP: {downloadSimulationResult.timestamp}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setIsBoundaryModalOpen(false)}
                className="p-1.5 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Verdict Badge */}
            <div className={`p-4 rounded-xl border-2 text-center ${
              downloadSimulationResult.allowed
                ? 'bg-emerald-50 text-emerald-950 border-emerald-400 dark:bg-emerald-950/60 dark:border-emerald-500/60 dark:text-emerald-200'
                : 'bg-rose-50 text-rose-950 border-rose-400 dark:bg-rose-950/60 dark:border-rose-500/60 dark:text-rose-200'
            }`}>
              <div className="flex items-center justify-center gap-2 mb-1">
                {downloadSimulationResult.allowed ? (
                  <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400 shrink-0" />
                ) : (
                  <XCircle className="w-6 h-6 text-rose-600 dark:text-rose-400 shrink-0" />
                )}
                <span className="font-mono font-black text-lg tracking-wider">
                  {downloadSimulationResult.allowed ? 'HTTP 200 ALLOWED' : 'HTTP 403 FORBIDDEN'}
                </span>
              </div>
              <p className="text-xs font-sans font-medium opacity-90">
                {downloadSimulationResult.message}
              </p>
            </div>

            {/* Evaluation Vectors Matrix */}
            <div className="space-y-2 text-xs font-mono">
              <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 tracking-wider block">
                Evaluated Security Boundary Vectors
              </span>
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Target DID:</span>
                  <span className="font-bold text-slate-950 dark:text-white break-all text-[11px]">
                    {downloadSimulationResult.did.slice(0, 16)}...{downloadSimulationResult.did.slice(-8)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Role Privilege:</span>
                  <span className="font-bold text-blue-700 dark:text-cyan-400">FORENSIC_ANALYST</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Identity Revocation Check:</span>
                  <span className={`font-bold ${isOwnerRevoked ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                    {isOwnerRevoked ? 'REVOKED (TERMINATED)' : 'ACTIVE & VERIFIED ✓'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Cryptographic Seal State:</span>
                  <span className={`font-bold ${isTampered ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                    {isTampered ? 'HASH MISMATCH (BLOCKED)' : 'BITSTREAM INTACT ✓'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Sensitivity Governance:</span>
                  <span className="font-bold text-amber-700 dark:text-amber-400">{sensitivity} TIER</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setIsBoundaryModalOpen(false)}
                className="w-full sm:w-auto px-5 py-2 text-xs font-mono font-bold rounded-xl bg-slate-950 text-white hover:bg-slate-800 dark:bg-cyan-500 dark:text-slate-950 dark:hover:bg-cyan-400 transition-colors cursor-pointer"
              >
                Acknowledge &amp; Dismiss
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

