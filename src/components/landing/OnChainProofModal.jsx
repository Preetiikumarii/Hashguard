import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  Copy, 
  Check, 
  ArrowRight
} from 'lucide-react';
import { formatISTTimestamp } from '../../utils/formatters';

export const OnChainProofModal = ({ isOpen, onClose, onLaunchSandbox }) => {
  const [copiedField, setCopiedField] = useState(null);

  if (!isOpen) return null;

  const proofData = {
    contractAddress: '0x3592925Cf64E7C3c68d4911b2ebC722c2Ea67052',
    contractName: 'HASHGUARD.sol (ERC-721 Custody Ledger)',
    txHash: '0x3a7c89f2d1e40b719f2c81e7d9a3b04c81f2e5a6d7c8b9a0e1f2a3b4c5d6e7f8',
    blockNumber: '1845201',
    chainId: '31337 (Local Anvil EVM - Besu Target)',
    gasUsed: '42,109 Units (0.00084 ETH)',
    timestamp: '2026-09-27T02:35:10Z (RFC 3161 Certified)',
    sealedHash: '8f3a91bc4e8d2f6a7c1e2d9fe4b6c3a77d210984a9e52c801e0a2b8e3a4f6d8c',
    signers: [
      { role: 'Collector (CERT-Alpha)', address: '0x71C83956424b9F321890B752A18f92', status: 'ECDSA secp256k1 Signed' },
      { role: 'Consensus Validator Node', address: '0x90F79bf6EB2c4f870365E785982E1f101E93b906', status: 'Block Inclusion Confirmed' }
    ]
  };

  const handleCopy = (text, fieldName) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-2xl rounded-2xl bg-[#091122] border border-cyan-500/40 shadow-[0_0_50px_rgba(6,182,212,0.25)] p-6 text-white font-sans overflow-hidden">
        {/* Glow ambient */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold font-mono text-white tracking-wide">
                  ON-CHAIN INTEGRITY PROOF RECEIPT
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold">
                  VERIFIED • ON-CHAIN
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                Block #1845201 • Local Anvil EVM Consensus Anchor
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg border border-slate-700 bg-slate-800/60 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body Proof Details */}
        <div className="mt-5 space-y-4 font-mono text-xs">
          {/* Transaction Hash */}
          <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 text-[11px]">TRANSACTION HASH</span>
              <button
                onClick={() => handleCopy(proofData.txHash, 'tx')}
                className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 text-[11px] cursor-pointer"
              >
                {copiedField === 'tx' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedField === 'tx' ? 'Copied' : 'Copy Tx'}</span>
              </button>
            </div>
            <div className="text-cyan-300 font-bold break-all">{proofData.txHash}</div>
          </div>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
              <span className="text-slate-500 text-[10px] uppercase block">BLOCK HEIGHT</span>
              <span className="text-white font-bold text-sm">#{proofData.blockNumber}</span>
              <span className="text-[10px] text-emerald-400 block mt-0.5">✓ 12 Confirmations</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
              <span className="text-slate-500 text-[10px] uppercase block">CONSENSUS CHAIN</span>
              <span className="text-white font-bold text-sm">Anvil (31337)</span>
              <span className="text-[10px] text-slate-400 block mt-0.5">Besu Testnet Ready</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
              <span className="text-slate-500 text-[10px] uppercase block">GAS CONSUMED</span>
              <span className="text-white font-bold text-sm">42,109 Units</span>
              <span className="text-[10px] text-cyan-400 block mt-0.5">0.00084 ETH</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
              <span className="text-slate-500 text-[10px] uppercase block">BLOCK TIMESTAMP (IST)</span>
              <span 
                className="text-white font-bold text-xs truncate block mt-1"
                title={`Source timestamp: UTC (${proofData.timestamp})`}
              >
                {formatISTTimestamp(proofData.timestamp)}
              </span>
              <span className="text-[10px] text-cyan-400 block mt-0.5">RFC 3161 Certified</span>
            </div>
          </div>

          {/* Sealed Hash Root */}
          <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 text-[11px]">COMMITTED SHA-256 DIGEST ROOT</span>
              <button
                onClick={() => handleCopy(proofData.sealedHash, 'hash')}
                className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 text-[11px] cursor-pointer"
              >
                {copiedField === 'hash' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedField === 'hash' ? 'Copied' : 'Copy Digest'}</span>
              </button>
            </div>
            <div className="text-emerald-400 font-bold break-all">{proofData.sealedHash}</div>
          </div>

          {/* Smart Contract Binding */}
          <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
            <span className="text-slate-400 text-[11px] block">SMART CONTRACT ARCHITECTURE</span>
            <div className="flex items-center justify-between text-slate-300">
              <span>Contract:</span>
              <span className="text-cyan-300 font-bold">{proofData.contractAddress}</span>
            </div>
            <div className="flex items-center justify-between text-slate-300">
              <span>Standard:</span>
              <span>OpenZeppelin ERC-721 with AccessControl & Merkle Verification</span>
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-slate-700 bg-slate-900 text-slate-300 hover:text-white text-xs font-mono cursor-pointer transition-colors"
          >
            Close Receipt
          </button>

          <button
            onClick={() => {
              onClose();
              onLaunchSandbox('ORG_B', '/dashboard', true);
            }}
            className="px-5 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-mono font-bold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <span>Launch Evaluation Sandbox</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
