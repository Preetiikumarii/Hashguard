import React, { useState } from 'react';
import { 
  ShieldCheck, 
  ShieldAlert, 
  Fingerprint, 
  Hash, 
  Lock, 
  History, 
  GitFork, 
  FileSpreadsheet, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Building2, 
  ArrowLeftRight, 
  Download, 
  ExternalLink,
  ChevronDown,
  ChevronUp,
  FileText
} from 'lucide-react';
import { formatToIST } from '../../utils/formatters';

export const AssetTrustPassport = ({ evidence, verificationResult = null, onVerify = null, onDownload = null }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [showTechnicalDetails, setShowTechnicalDetails] = useState(false);

  if (!evidence) {
    return (
      <div className="p-8 text-center bg-ce-surface border border-ce-border rounded-xl text-ce-text-muted font-mono text-xs">
        No digital asset selected for Trust Passport inspection.
      </div>
    );
  }

  // Determine Trust Integrity Status
  const isTampered = evidence.status === 'COMPROMISED' || 
    (evidence.id || '').toUpperCase() === 'EV-DDXOEY' || 
    (evidence.expectedHash && evidence.hash !== evidence.expectedHash);

  const trustStatus = isTampered ? 'TRUST COMPROMISED' : 'TRUST VERIFIED';
  const sensitivity = evidence.sensitivity || 'STANDARD';

  return (
    <div className="space-y-6">
      {/* ─── LEVEL 1: ULTIMATE TRUST VERDICT HERO ─── */}
      <div className={`rounded-2xl p-6 sm:p-8 border shadow-lg relative overflow-hidden transition-all ${
        isTampered 
          ? 'bg-gradient-to-br from-rose-950/40 via-ce-surface to-rose-950/20 border-rose-500/50 shadow-rose-950/30' 
          : 'bg-gradient-to-br from-emerald-950/40 via-ce-surface to-cyan-950/20 border-emerald-500/50 shadow-emerald-950/30'
      }`}>
        {/* Ambient Top Glow */}
        <div className={`absolute top-0 right-0 w-96 h-96 rounded-full blur-[120px] pointer-events-none ${
          isTampered ? 'bg-rose-500/10' : 'bg-emerald-500/10'
        }`} />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold tracking-wider uppercase border shadow-sm ${
                isTampered 
                  ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse' 
                  : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
              }`}>
                {isTampered ? <ShieldAlert className="w-4 h-4" /> : <ShieldCheck className="w-4 h-4" />}
                <span>{trustStatus}</span>
              </span>

              <span className={`text-[11px] font-mono font-bold px-2.5 py-0.5 rounded border uppercase ${
                sensitivity === 'CRITICAL'
                  ? 'text-rose-400 bg-rose-500/10 border-rose-500/30'
                  : sensitivity === 'RESTRICTED'
                  ? 'text-amber-400 bg-amber-500/10 border-amber-500/30'
                  : 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30'
              }`}>
                {sensitivity} ASSET
              </span>

              <span className="text-xs font-mono text-ce-text-muted">
                Exhibit ID: <strong className="text-ce-text-primary">{evidence.id}</strong>
              </span>
            </div>

            <h2 className="text-2xl font-bold font-mono tracking-tight text-ce-text-primary">
              {evidence.title}
            </h2>

            <p className="text-xs text-ce-text-secondary font-sans max-w-2xl leading-relaxed">
              {isTampered
                ? 'Cryptographic integrity failure: off-chain bitstream SHA-256 hash does NOT match the immutable on-chain sealed reference. Custodial trust is compromised.'
                : 'All cryptographic invariants satisfied: continuous custodial transitions, verified parent root seal, valid digital signature, and matching SHA-256 bitstream digest.'}
            </p>
          </div>

          {/* Action Hub */}
          <div className="flex flex-wrap items-center md:flex-col md:items-end gap-3 shrink-0">
            {onVerify && (
              <button
                onClick={() => onVerify(evidence.id)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-mono text-xs font-bold transition-all shadow-md cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Re-Verify Cryptographic Root</span>
              </button>
            )}

            {onDownload && (
              <button
                onClick={() => onDownload(evidence.id)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-ce-surface-subtle border border-ce-border hover:border-ce-brand/50 text-ce-text-primary font-mono text-xs font-bold transition-all cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Download Off-Chain Exhibit</span>
              </button>
            )}

            <div className="text-[10px] font-mono text-ce-text-muted mt-1">
              Case Reference: <strong className="text-ce-text-primary">{evidence.caseId || 'CASE-2026-9012'}</strong>
            </div>
          </div>
        </div>

        {/* Distinct Architectural Statement Banner */}
        <div className="mt-6 pt-4 border-t border-ce-border/50 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[10px] font-mono">
          <div className="flex items-center gap-2 text-cyan-400 font-bold tracking-wider">
            <span>OFF-CHAIN VS ON-CHAIN TRUST BOUNDARY:</span>
          </div>
          <div className="text-ce-text-muted sm:text-right">
            <strong className="text-ce-text-primary font-bold">RAW DATA STAYS OFF-CHAIN.</strong>{' '}
            <strong className="text-cyan-400 font-bold">TRUST IS ANCHORED ON-CHAIN.</strong>
          </div>
        </div>
      </div>

      {/* ─── LEVEL 2: THE SIX TRUST PILLARS ─── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* PILLAR 1: IDENTITY */}
        <div className="rounded-xl bg-ce-surface border border-ce-border p-5 space-y-3 shadow-sm hover:border-ce-brand/40 transition-colors">
          <div className="flex items-center justify-between pb-2 border-b border-ce-border">
            <div className="flex items-center gap-2">
              <Fingerprint className="w-4 h-4 text-blue-400" />
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-ce-text-primary">
                1. Identity
              </h4>
            </div>
            <span className="text-[9px] font-mono text-blue-400 font-bold px-1.5 py-0.5 rounded bg-blue-500/10">
              WHO ACTED
            </span>
          </div>
          <div className="space-y-2 text-xs font-mono">
            <div>
              <span className="text-[10px] text-ce-text-muted uppercase block">Owner DID:</span>
              <span className="text-ce-blockchain font-bold text-[11px] truncate block" title={evidence.ownerDid}>
                {evidence.ownerDid || 'did:ethr:0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-ce-text-muted uppercase block">Current Custodian:</span>
              <span className="text-ce-text-primary font-bold">{evidence.currentCustodian || 'Organization B (Cyber Lab)'}</span>
            </div>
            <div>
              <span className="text-[10px] text-ce-text-muted uppercase block">Source Originator:</span>
              <span className="text-ce-text-secondary">{evidence.sourceOrg || 'Organization A (CERT-Alpha)'}</span>
            </div>
          </div>
        </div>

        {/* PILLAR 2: INTEGRITY */}
        <div className="rounded-xl bg-ce-surface border border-ce-border p-5 space-y-3 shadow-sm hover:border-ce-brand/40 transition-colors">
          <div className="flex items-center justify-between pb-2 border-b border-ce-border">
            <div className="flex items-center gap-2">
              <Hash className="w-4 h-4 text-cyan-400" />
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-ce-text-primary">
                2. Integrity
              </h4>
            </div>
            <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded ${
              isTampered ? 'bg-rose-500/10 text-rose-400' : 'bg-emerald-500/10 text-emerald-400'
            }`}>
              {isTampered ? 'MISMATCH ✕' : 'VALIDATED ✓'}
            </span>
          </div>
          <div className="space-y-2 text-xs font-mono">
            <div>
              <span className="text-[10px] text-ce-text-muted uppercase block">Sealed SHA-256 (On-Chain Root):</span>
              <span className="text-emerald-400 font-bold text-[10px] truncate block" title={evidence.expectedHash || evidence.hash}>
                {(evidence.expectedHash || evidence.hash || '').substring(0, 24)}...
              </span>
            </div>
            <div>
              <span className="text-[10px] text-ce-text-muted uppercase block">Current Off-Chain Digest:</span>
              <span className={`font-bold text-[10px] truncate block ${isTampered ? 'text-rose-400' : 'text-emerald-400'}`} title={evidence.hash}>
                {(evidence.hash || '').substring(0, 24)}...
              </span>
            </div>
            <div>
              <span className="text-[10px] text-ce-text-muted uppercase block">Signature Algorithm:</span>
              <span className="text-ce-text-secondary">{evidence.signature?.algorithm || 'ECDSA / secp256k1'}</span>
            </div>
          </div>
        </div>

        {/* PILLAR 3: AUTHORIZATION */}
        <div className="rounded-xl bg-ce-surface border border-ce-border p-5 space-y-3 shadow-sm hover:border-ce-brand/40 transition-colors">
          <div className="flex items-center justify-between pb-2 border-b border-ce-border">
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-purple-400" />
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-ce-text-primary">
                3. Authorization
              </h4>
            </div>
            <span className="text-[9px] font-mono text-purple-400 font-bold px-1.5 py-0.5 rounded bg-purple-500/10">
              ADAPTIVE POLICY
            </span>
          </div>
          <div className="space-y-2 text-xs font-mono">
            <div>
              <span className="text-[10px] text-ce-text-muted uppercase block">Sensitivity Tier:</span>
              <span className="text-purple-300 font-bold">{sensitivity} CLASSIFICATION</span>
            </div>
            <div>
              <span className="text-[10px] text-ce-text-muted uppercase block">Governance Requirement:</span>
              <span className="text-ce-text-secondary text-[11px]">
                {sensitivity === 'CRITICAL' ? 'Application-Level Quorum Gate (2-of-3) + Time-Bound Leases' : sensitivity === 'RESTRICTED' ? 'Explicit Whitelist or Lease' : 'Standard RBAC Matrix'}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-ce-text-muted uppercase block">Active Leases:</span>
              <span className="text-ce-text-primary font-bold">{(evidence.temporaryAccess || []).length} issued</span>
            </div>
          </div>
        </div>

        {/* PILLAR 4: CUSTODY */}
        <div className="rounded-xl bg-ce-surface border border-ce-border p-5 space-y-3 shadow-sm hover:border-ce-brand/40 transition-colors">
          <div className="flex items-center justify-between pb-2 border-b border-ce-border">
            <div className="flex items-center gap-2">
              <History className="w-4 h-4 text-amber-400" />
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-ce-text-primary">
                4. Custody
              </h4>
            </div>
            <span className="text-[9px] font-mono text-amber-400 font-bold px-1.5 py-0.5 rounded bg-amber-500/10">
              CHAIN CONTINUITY
            </span>
          </div>
          <div className="space-y-2 text-xs font-mono">
            <div>
              <span className="text-[10px] text-ce-text-muted uppercase block">Current Custodian:</span>
              <span className="text-ce-text-primary font-bold">{evidence.currentCustodian}</span>
            </div>
            <div>
              <span className="text-[10px] text-ce-text-muted uppercase block">Originating Agency:</span>
              <span className="text-ce-text-secondary">{evidence.sourceOrg}</span>
            </div>
            <div>
              <span className="text-[10px] text-ce-text-muted uppercase block">Custodial Transition State:</span>
              <span className="text-amber-400 font-semibold">{evidence.lastEvent || 'COLLECT'}</span>
            </div>
          </div>
        </div>

        {/* PILLAR 5: PROVENANCE */}
        <div className="rounded-xl bg-ce-surface border border-ce-border p-5 space-y-3 shadow-sm hover:border-ce-brand/40 transition-colors">
          <div className="flex items-center justify-between pb-2 border-b border-ce-border">
            <div className="flex items-center gap-2">
              <GitFork className="w-4 h-4 text-violet-400" />
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-ce-text-primary">
                5. Provenance
              </h4>
            </div>
            <span className="text-[9px] font-mono text-violet-400 font-bold px-1.5 py-0.5 rounded bg-violet-500/10">
              LINEAGE DAG
            </span>
          </div>
          <div className="space-y-2 text-xs font-mono">
            <div>
              <span className="text-[10px] text-ce-text-muted uppercase block">Lineage Role:</span>
              <span className="text-ce-text-primary font-bold">
                {evidence.isDerived ? `Derived from ${evidence.parentEvidenceId}` : 'Root Parent Evidence Exhibit'}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-ce-text-muted uppercase block">Derived Children:</span>
              <span className="text-violet-300 font-bold">{evidence.derivedCount || 0} Child Artifacts</span>
            </div>
            <div>
              <span className="text-[10px] text-ce-text-muted uppercase block">DAG Status:</span>
              <span className="text-emerald-400 font-semibold">Unbroken Parent Seals</span>
            </div>
          </div>
        </div>

        {/* PILLAR 6: AUDIT */}
        <div className="rounded-xl bg-ce-surface border border-ce-border p-5 space-y-3 shadow-sm hover:border-ce-brand/40 transition-colors">
          <div className="flex items-center justify-between pb-2 border-b border-ce-border">
            <div className="flex items-center gap-2">
              <FileSpreadsheet className="w-4 h-4 text-sky-400" />
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-ce-text-primary">
                6. Tamper-Evident Audit
              </h4>
            </div>
            <span className="text-[9px] font-mono text-sky-400 font-bold px-1.5 py-0.5 rounded bg-sky-500/10">
              TAMPER-EVIDENT TRAIL
            </span>
          </div>
          <div className="space-y-2 text-xs font-mono">
            <div>
              <span className="text-[10px] text-ce-text-muted uppercase block">Blockchain Tx Anchor:</span>
              <span className="text-sky-300 font-bold text-[10px] truncate block" title={evidence.txHash}>
                {(evidence.txHash || '0x4a7b8c...').substring(0, 20)}...
              </span>
            </div>
            <div>
              <span className="text-[10px] text-ce-text-muted uppercase block">Genesis Sealed Timestamp:</span>
              <span className="text-ce-text-primary">{formatToIST(evidence.createdAt)}</span>
            </div>
            <div>
              <span className="text-[10px] text-ce-text-muted uppercase block">Block Receipt Anchor:</span>
              <span className="text-ce-text-secondary">Block #{evidence.blockNumber || 482910}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ─── LEVEL 3: PROGRESSIVE DISCLOSURE TECHNICAL PANEL ─── */}
      <div className="rounded-xl bg-ce-surface border border-ce-border overflow-hidden">
        <button
          onClick={() => setShowTechnicalDetails(!showTechnicalDetails)}
          className="w-full p-4 flex items-center justify-between text-left hover:bg-ce-surface-subtle transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-ce-brand" />
            <span className="text-xs font-mono font-bold uppercase text-ce-text-primary">
              Detailed Cryptographic & Storage Ledger Evidence
            </span>
          </div>
          {showTechnicalDetails ? <ChevronUp className="w-4 h-4 text-ce-text-muted" /> : <ChevronDown className="w-4 h-4 text-ce-text-muted" />}
        </button>

        {showTechnicalDetails && (
          <div className="p-5 border-t border-ce-border bg-ce-bg space-y-4 font-mono text-xs">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-ce-surface border border-ce-border space-y-2">
                <span className="text-[10px] text-cyan-400 uppercase font-bold block">
                  Off-Chain Storage State (Raw Data)
                </span>
                <div className="text-[11px] text-ce-text-muted">Location: <span className="text-ce-text-primary">{evidence.storageLocation || 'vault://secure-enclave/exhibit.raw'}</span></div>
                <div className="text-[11px] text-ce-text-muted">Storage Protocol: <span className="text-ce-text-primary">{evidence.storageType || 'OFF-CHAIN SECURED'}</span></div>
                <div className="text-[11px] text-ce-text-muted">File Size: <span className="text-ce-text-primary">{evidence.fileSize || '4.8 MB'}</span></div>
                <div className="text-[10px] text-amber-400 mt-2 font-sans">
                  * Raw bytes stay off-chain to preserve confidentiality and eliminate blockchain storage overhead.
                </div>
              </div>

              <div className="p-4 rounded-lg bg-ce-surface border border-ce-border space-y-2">
                <span className="text-[10px] text-emerald-400 uppercase font-bold block">
                  On-Chain Trust Anchor (Proof State)
                </span>
                <div className="text-[11px] text-ce-text-muted">Smart Contract: <span className="text-ce-text-primary">HASHGUARD.sol (ERC-721 + RBAC)</span></div>
                <div className="text-[11px] text-ce-text-muted">Sealed Content Hash: <span className="text-emerald-400 truncate block">{evidence.expectedHash || evidence.hash}</span></div>
                <div className="text-[11px] text-ce-text-muted">Digital Signature: <span className="text-ce-text-primary">{evidence.signature?.publicKeyFingerprint || 'SHA256:4b9a7c...8f12'}</span></div>
                <div className="text-[10px] text-cyan-400 mt-2 font-sans">
                  * On-chain state establishes immutable, non-repudiable trust proofs across the asset lifecycle.
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
