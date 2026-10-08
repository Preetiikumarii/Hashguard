import React from 'react';
import { Building2, ArrowRight, ShieldCheck, Lock } from 'lucide-react';

export const TransferWorkflowVisualizer = ({ selectedTransfer }) => {
  const steps = [
    {
      id: 'ORG_A',
      title: selectedTransfer?.fromOrg || 'ORGANIZATION A (CERT)',
      subtitle: 'Seals & Signs Manifest',
      icon: Building2,
      color: 'border-ce-info/40 bg-ce-info/10 text-ce-info',
      badge: 'HSM ECDSA Signed'
    },
    {
      id: 'TRANSIT',
      title: 'SECURE TRANSFER CHANNEL',
      subtitle: 'mTLS Encrypted Payload & Checksums',
      icon: Lock,
      color: 'border-ce-brand/40 bg-ce-brand/10 text-ce-brand',
      badge: 'AES-256 Encrypted'
    },
    {
      id: 'ORG_B',
      title: selectedTransfer?.toOrg || 'ORGANIZATION B (LAB)',
      subtitle: 'Verifies Bit Hash & Cert',
      icon: Building2,
      color: 'border-ce-blockchain/40 bg-ce-blockchain/10 text-ce-blockchain',
      badge: 'Zero-Trust Check'
    },
    {
      id: 'RECEIVE',
      title: 'CUSTODY RECEIPT ANCHOR',
      subtitle: 'On-Chain Event Recorded',
      icon: ShieldCheck,
      color: selectedTransfer?.status === 'FAILED'
        ? 'border-ce-danger/50 bg-ce-danger/10 text-ce-danger shadow-[0_0_15px_rgba(239,68,68,0.15)]'
        : 'border-ce-success/40 bg-ce-success/10 text-ce-success shadow-[0_0_15px_rgba(16,185,129,0.1)]',
      badge: selectedTransfer?.status === 'FAILED' ? '✕ REJECTED: TAMPER' : '✓ RECEIVE EVENT'
    }
  ];

  return (
    <div className="rounded-lg bg-ce-surface border border-ce-border p-5 shadow-sm">
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-ce-border">
        <div>
          <h3 className="text-xs font-mono font-bold tracking-wider uppercase text-ce-text-primary">
            CROSS-ORGANIZATION TRANSFER PROTOCOL WORKFLOW
          </h3>
          <p className="text-xs text-ce-text-muted mt-0.5">
            Cryptographic handshake and chain-of-custody transfer lifecycle
          </p>
        </div>
        {selectedTransfer && (
          <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-ce-brand/10 text-ce-brand border border-ce-brand/30">
            Selected: {selectedTransfer.id} ({selectedTransfer.evidenceId})
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative my-3">
        {steps.map((st, idx) => {
          const Icon = st.icon;
          return (
            <div
              key={st.id}
              className={`p-4 rounded-md border flex flex-col justify-between relative ${st.color}`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 rounded-md bg-ce-bg border border-ce-border">
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded-sm bg-ce-bg border border-ce-border font-bold">
                    STEP 0{idx + 1}
                  </span>
                </div>

                <div className="text-xs font-bold font-mono tracking-tight text-ce-text-primary mt-1 truncate">
                  {st.title}
                </div>
                <div className="text-[11px] text-ce-text-secondary font-sans mt-1">
                  {st.subtitle}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-ce-border flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold tracking-wider">
                  {st.badge}
                </span>
                {idx < 3 && (
                  <ArrowRight className="hidden md:block w-3.5 h-3.5 text-ce-text-muted" />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
