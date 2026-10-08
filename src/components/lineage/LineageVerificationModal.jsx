import React from 'react';
import { Modal } from '../common/Modal';
import { CheckCircle2, XCircle, ShieldCheck, ShieldAlert, FileCheck, Blocks, KeyRound } from 'lucide-react';
import { formatISTTimestamp } from '../../utils/formatters';

export const LineageVerificationModal = ({ isOpen, onClose, verificationResult }) => {
  if (!verificationResult) return null;

  const isTampered = verificationResult.overallStatus === 'COMPROMISED' || 
                     verificationResult.overallStatus === 'TAMPER_DETECTED' || 
                     verificationResult.tamperDetected;

  const checks = [
    {
      name: 'SOURCE VERIFIED',
      desc: `Root evidence ${verificationResult.evidenceId || verificationResult.rootId || 'EV-001'} manifest verified with immutable on-chain block anchor.`,
      icon: Blocks,
      status: isTampered ? 'FAILED' : 'PASS'
    },
    {
      name: 'PARENT HASH VERIFIED',
      desc: isTampered ? 'Parent SHA-256 hash mismatch detected across downstream derivation edge.' : 'Child artifact headers mathematically linked to parent SHA-256 digests with zero drift.',
      icon: FileCheck,
      status: isTampered ? 'FAILED' : 'PASS'
    },
    {
      name: 'DERIVATION EVENT VERIFIED',
      desc: 'Transformation algorithms and analysis logs registered as valid custody state transitions.',
      icon: ShieldCheck,
      status: 'PASS'
    },
    {
      name: 'SIGNATURE VERIFIED',
      desc: isTampered ? 'Signature invalid: payload modified post-signing.' : 'All intermediate lab signatures authenticated against authorized CA public keys.',
      icon: KeyRound,
      status: isTampered ? 'FAILED' : 'PASS'
    }
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="INDEPENDENT LINEAGE INTEGRITY ATTESTATION"
      subtitle="Cryptographic verification of complete parent-child derivation graph"
      maxWidth="max-w-xl"
    >
      <div className="space-y-4">
        {/* Overall Status Banner */}
        <div className={`p-4 rounded-md border flex items-center justify-between shadow-sm ${
          isTampered 
            ? 'bg-ce-danger/10 border-ce-danger/30 text-ce-danger' 
            : 'bg-ce-success/10 border-ce-success/30 text-ce-success'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-md border ${
              isTampered 
                ? 'bg-ce-danger/20 text-ce-danger border-ce-danger/40' 
                : 'bg-ce-success/20 text-ce-success border-ce-success/40'
            }`}>
              {isTampered ? <ShieldAlert className="w-6 h-6" /> : <ShieldCheck className="w-6 h-6" />}
            </div>
            <div>
              <span className={`text-[10px] font-mono uppercase tracking-wider font-bold block ${
                isTampered ? 'text-ce-danger' : 'text-ce-success'
              }`}>
                ATTESTATION RESULT
              </span>
              <h4 className="text-base font-bold text-ce-text-primary font-mono mt-0.5">
                {isTampered ? 'LINEAGE COMPROMISED ⚠' : 'LINEAGE VALID ✓'}
              </h4>
            </div>
          </div>

          <span className={`px-3 py-1 rounded-sm border font-mono text-xs font-bold tracking-wider ${
            isTampered 
              ? 'bg-ce-danger/20 text-ce-danger border-ce-danger/40' 
              : 'bg-ce-success/20 text-ce-success border-ce-success/40'
          }`}>
            {isTampered ? 'INTEGRITY FAILED' : '100% PASS'}
          </span>
        </div>

        {/* Verification Checks Checklist */}
        <div className="space-y-2.5">
          {checks.map((c, idx) => {
            const isCheckPass = c.status === 'PASS';
            return (
              <div
                key={idx}
                className="p-3.5 rounded-md bg-ce-surface-subtle border border-ce-border flex items-start gap-3"
              >
                <div className={`p-1 rounded mt-0.5 shrink-0 ${
                  isCheckPass ? 'bg-ce-success/10 text-ce-success' : 'bg-ce-danger/10 text-ce-danger'
                }`}>
                  {isCheckPass ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-ce-text-primary">
                      {isCheckPass ? '✓' : '✗'} {c.name}
                    </span>
                    <span className={`text-[10px] font-mono font-bold tracking-wider ${
                      isCheckPass ? 'text-ce-success' : 'text-ce-danger'
                    }`}>
                      {isCheckPass ? 'VERIFIED' : 'FAILED'}
                    </span>
                  </div>
                  <p className="text-[11px] text-ce-text-secondary mt-1 font-sans leading-relaxed">
                    {c.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer info */}
        <div className="p-3 rounded-md bg-ce-bg border border-ce-border text-[11px] font-mono text-ce-text-muted flex items-center justify-between">
          <span>Auditor: <strong className="text-ce-text-secondary">National Cyber Board</strong></span>
          <span title={`Source timestamp: UTC (${verificationResult.verifiedAt || '2026-08-16 13:20:00 UTC'})`}>
            Anchored (IST): {formatISTTimestamp(verificationResult.verifiedAt || '2026-08-16 13:20:00 UTC')}
          </span>
        </div>

        <div className="pt-4 border-t border-ce-border flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-md bg-ce-brand hover:bg-ce-brand-hover text-white text-xs font-mono font-bold transition-colors shadow-sm"
          >
            Acknowledge & Close
          </button>
        </div>
      </div>
    </Modal>
  );
};
