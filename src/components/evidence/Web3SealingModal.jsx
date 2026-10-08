import React from 'react';
import { Loader2, CheckCircle2, ShieldCheck, ExternalLink, AlertTriangle, Key, Blocks, FileCheck } from 'lucide-react';
import { formatISTTime } from '../../utils/formatters';

export const Web3SealingModal = ({
  isOpen,
  status, // 'idle' | 'hashing' | 'awaiting_signature' | 'signature_acquired' | 'broadcasting_tx' | 'awaiting_receipt' | 'tx_confirmed' | 'committing' | 'completed' | 'error'
  statusMessage,
  assetId,
  computedHash,
  signerAddress,
  rawSignature,
  txHash,
  blockNumber,
  networkName,
  contractAddress,
  errorMessage,
  onComplete,
  onCancel
}) => {
  if (!isOpen) return null;

  const isCompleted = status === 'completed';
  const isError = status === 'error';

  return (
    <div className="fixed inset-0 z-[120] bg-black/85 backdrop-blur-md flex items-center justify-center p-4 transition-all">
      <div className="w-full max-w-xl bg-ce-surface border border-ce-brand/40 rounded-xl shadow-[0_0_50px_rgba(6,182,212,0.2)] overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="bg-ce-surface-subtle/80 border-b border-ce-border px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-ce-brand/10 border border-ce-brand/30 flex items-center justify-center">
              {isCompleted ? (
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
              ) : isError ? (
                <AlertTriangle className="w-5 h-5 text-rose-400" />
              ) : (
                <Loader2 className="w-5 h-5 text-ce-brand animate-spin" />
              )}
            </div>
            <div>
              <h3 className="text-sm font-mono font-bold tracking-wider uppercase text-ce-text-primary">
                {isCompleted
                  ? 'Cryptographic Evidence Sealed'
                  : isError
                  ? 'Attestation Warning'
                  : 'Live Web3 Attestation Engine'}
              </h3>
              <p className="text-[11px] font-mono text-ce-text-muted">
                {isCompleted
                  ? `Exhibit ${assetId} anchored with authentic secp256k1 key`
                  : 'Securing bitstream integrity via Ethereum & ISO/IEC 27037'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-ce-brand/10 text-ce-brand border border-ce-brand/30 font-semibold">
              {networkName || 'Web3 Enclave'}
            </span>
          </div>
        </div>

        {/* Real-Time Execution Pipeline */}
        <div className="p-6 space-y-4 font-mono text-xs">
          
          {/* Step 1: WebCrypto SHA-256 Digest */}
          <div className="p-3.5 rounded-lg bg-ce-bg border border-ce-border flex items-start gap-3">
            <div className="mt-0.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-ce-text-primary text-[11px] uppercase tracking-wider">
                  1. Client-Side SHA-256 Digest
                </span>
                <span className="text-[10px] text-emerald-400 font-bold">COMPUTED</span>
              </div>
              <div className="text-[11px] text-ce-text-muted break-all select-all font-mono bg-ce-surface-subtle p-1.5 rounded border border-ce-border/60">
                {computedHash || 'Calculating WebCrypto SHA-256...'}
              </div>
            </div>
          </div>

          {/* Step 2: MetaMask ECDSA Personal Signature */}
          <div className={`p-3.5 rounded-lg border transition-all flex items-start gap-3 ${
            status === 'awaiting_signature'
              ? 'bg-amber-500/10 border-amber-500/40 shadow-[0_0_15px_rgba(245,158,11,0.15)] animate-pulse'
              : rawSignature
              ? 'bg-ce-bg border-ce-border'
              : 'bg-ce-bg/40 border-ce-border/40 text-ce-text-muted'
          }`}>
            <div className="mt-0.5">
              {status === 'awaiting_signature' ? (
                <Loader2 className="w-4 h-4 text-amber-400 animate-spin shrink-0" />
              ) : rawSignature ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              ) : (
                <Key className="w-4 h-4 text-ce-text-muted shrink-0" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-ce-text-primary text-[11px] uppercase tracking-wider flex items-center gap-1.5">
                  2. MetaMask ECDSA secp256k1 Attestation
                </span>
                <span className={`text-[10px] font-bold ${
                  rawSignature
                    ? 'text-emerald-400'
                    : status === 'awaiting_signature'
                    ? 'text-amber-400'
                    : 'text-ce-text-muted'
                }`}>
                  {rawSignature ? 'SIGNED' : status === 'awaiting_signature' ? 'WAITING FOR METAMASK' : 'PENDING'}
                </span>
              </div>

              {status === 'awaiting_signature' && (
                <div className="mt-1 text-[11px] text-amber-300 bg-amber-500/15 p-2 rounded border border-amber-500/30">
                  Please review and click <strong>"Sign"</strong> in your MetaMask extension popup to generate the cryptographic witness seal.
                </div>
              )}

              {signerAddress && (
                <div className="mt-1 text-[11px] text-ce-text-secondary flex items-center justify-between">
                  <span>Signer:</span>
                  <span className="text-ce-brand font-bold">{signerAddress.substring(0, 8)}...{signerAddress.substring(signerAddress.length - 6)}</span>
                </div>
              )}

              {rawSignature && (
                <div className="mt-1 text-[10px] text-ce-text-muted break-all font-mono bg-ce-surface-subtle p-1.5 rounded border border-ce-border/60">
                  Sig: {rawSignature.substring(0, 36)}...{rawSignature.substring(rawSignature.length - 12)}
                </div>
              )}
            </div>
          </div>

          {/* Step 3: Smart Contract Minting (Sepolia / Localhost) */}
          <div className={`p-3.5 rounded-lg border transition-all flex items-start gap-3 ${
            ['broadcasting_tx', 'awaiting_receipt'].includes(status)
              ? 'bg-cyan-500/10 border-cyan-500/40 shadow-[0_0_15px_rgba(6,182,212,0.15)] animate-pulse'
              : txHash
              ? 'bg-ce-bg border-ce-border'
              : 'bg-ce-bg/40 border-ce-border/40 text-ce-text-muted'
          }`}>
            <div className="mt-0.5">
              {['broadcasting_tx', 'awaiting_receipt'].includes(status) ? (
                <Loader2 className="w-4 h-4 text-cyan-400 animate-spin shrink-0" />
              ) : txHash ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              ) : (
                <Blocks className="w-4 h-4 text-ce-text-muted shrink-0" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-ce-text-primary text-[11px] uppercase tracking-wider">
                  3. On-Chain Smart Contract Minting (ERC-721)
                </span>
                <span className={`text-[10px] font-bold ${
                  txHash
                    ? 'text-emerald-400'
                    : ['broadcasting_tx', 'awaiting_receipt'].includes(status)
                    ? 'text-cyan-400'
                    : 'text-ce-text-muted'
                }`}>
                  {txHash ? 'MINED' : ['broadcasting_tx', 'awaiting_receipt'].includes(status) ? 'CONFIRMING' : 'OFF-CHAIN ENCLAVE'}
                </span>
              </div>

              {contractAddress && (
                <div className="text-[10px] text-ce-text-muted mb-1 truncate">
                  Contract: {contractAddress}
                </div>
              )}

              {txHash ? (
                <div className="mt-1 space-y-1">
                  <div className="text-[11px] text-ce-text-secondary flex items-center justify-between">
                    <span>Tx Hash:</span>
                    <a
                      href={`https://sepolia.etherscan.io/tx/${txHash}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-ce-brand hover:underline inline-flex items-center gap-1 font-bold"
                    >
                      <span>{txHash.substring(0, 10)}...{txHash.substring(txHash.length - 8)}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                  {blockNumber && (
                    <div className="text-[10px] text-emerald-400">
                      Confirmed in Ethereum Block #{blockNumber}
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-[10px] text-ce-text-muted italic">
                  Cryptographic ECDSA seal stored securely in custody enclave with zero gas expenditure.
                </div>
              )}
            </div>
          </div>

          {/* Step 4: Custody Ledger & Audit Persistence */}
          <div className="p-3.5 rounded-lg bg-ce-bg border border-ce-border flex items-start gap-3">
            <div className="mt-0.5">
              {isCompleted ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              ) : (
                <Loader2 className="w-4 h-4 text-ce-brand animate-spin shrink-0" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-ce-text-primary text-[11px] uppercase tracking-wider">
                  4. Enclave Custody Ledger Seal
                </span>
                <span className="text-[10px] text-emerald-400 font-bold">
                  {isCompleted ? 'ANCHORED' : 'PROCESSING'}
                </span>
              </div>
              <div className="text-[11px] text-ce-text-secondary">
                {statusMessage || 'Recording immutable genesis custody event in enclave ledger...'}
              </div>
            </div>
          </div>

          {errorMessage && (
            <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <strong>Notice:</strong> {errorMessage}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="bg-ce-surface-subtle/80 border-t border-ce-border px-6 py-4 flex items-center justify-between">
          <div className="text-[11px] font-mono text-ce-text-muted">
            IST Timestamp: {formatISTTime(new Date())}
          </div>

          <div className="flex items-center gap-3">
            {isError && (
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 rounded-md bg-ce-surface border border-ce-border text-ce-text-secondary hover:text-ce-text-primary text-xs font-mono font-bold transition-colors"
              >
                Close
              </button>
            )}

            {isCompleted && (
              <button
                type="button"
                onClick={onComplete}
                className="inline-flex items-center gap-2 px-5 py-2 rounded-md bg-emerald-500 hover:bg-emerald-600 text-black font-mono font-bold text-xs transition-colors shadow-sm"
              >
                <FileCheck className="w-4 h-4" />
                <span>Complete & View Dossier</span>
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
