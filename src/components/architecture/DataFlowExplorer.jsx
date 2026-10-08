import React, { useState } from 'react';
import {
  FileCode,
  Fingerprint,
  KeyRound,
  ShieldCheck,
  Database,
  Blocks,
  History,
  ArrowLeftRight,
  CheckCircle2,
  FileSpreadsheet,
  ArrowRight,
  Shield
} from 'lucide-react';

export const DataFlowExplorer = ({ onHighlightComponent }) => {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      num: '01',
      label: 'SELECT',
      title: 'Digital Evidence Selected',
      componentTarget: 'presentation',
      icon: FileCode,
      color: 'blue',
      input: 'Forensic operator selects raw file (.E01 disk image, .pcap capture, .raw memory dump) in Operator UI.',
      action: 'File handle read into browser memory chunk stream via WebCrypto / HTML5 File API.',
      output: 'Binary bitstream stream initialized in isolated local acquisition buffer.'
    },
    {
      num: '02',
      label: 'HASH',
      title: 'SHA-256 Bitstream Hashing',
      componentTarget: 'cryptographic_integrity',
      icon: Fingerprint,
      color: 'cyan',
      input: 'Full binary stream from the local acquisition buffer.',
      action: 'Browser calculates deterministic 256-bit SHA-256 cryptographic digest (FIPS 180-4).',
      output: '32-byte contentHash hexadecimal string (e.g. e3b0c44298fc1c149afbf4c8...); any 1-bit alteration completely changes this value.'
    },
    {
      num: '03',
      label: 'AUTHENTICATE',
      title: 'Identity Authenticated via DID',
      componentTarget: 'identity_rbac',
      icon: KeyRound,
      color: 'indigo',
      input: 'Operator private key (secp256k1) and session challenge payload.',
      action: 'Resolves decentralized identifier did:ethr:<address> and verifies cryptographic ECDSA signature.',
      output: 'Cryptographically verified actor identity root bound to acquisition manifest.'
    },
    {
      num: '04',
      label: 'AUTHORIZE',
      title: 'RBAC & Tenant Scoping Checked',
      componentTarget: 'identity_rbac',
      icon: ShieldCheck,
      color: 'purple',
      input: 'Actor DID, active organization context (e.g. ORG_B Cyber Defense Lab), and requested action.',
      action: 'Evaluates RBAC role matrix (e.g. FORENSIC_ANALYST possesses canGenerateHash & canSealEvidence permissions).',
      output: 'Signed authorization token permitting exhibit registration.'
    },
    {
      num: '05',
      label: 'STORE',
      title: 'Off-Chain Storage Ingestion',
      componentTarget: 'off_chain_storage',
      icon: Database,
      color: 'emerald',
      input: 'Heavy raw evidence payload (.E01/.pcap) + signed authorization token.',
      action: 'Payload encrypted via AES-256-GCM and stored in agency MinIO S3 object bucket.',
      output: 'Presigned storage URI and verified storage receipt. Zero raw bytes exposed to blockchain.'
    },
    {
      num: '06',
      label: 'MINT',
      title: 'Smart Contract NFT Tokenization',
      componentTarget: 'blockchain_layer',
      icon: Blocks,
      color: 'amber',
      input: 'assetId, 32-byte contentHash, metadataHash, and custodian DID address.',
      action: 'Executes mintAssetNFT() transaction on Ethereum Sepolia contract HASHGUARD.sol.',
      output: 'ERC-721 Token ID minted on-chain; irreversible block proof of existence created.'
    },
    {
      num: '07',
      label: 'CUSTODY',
      title: 'Custody State Initialized',
      componentTarget: 'custody_lifecycle',
      icon: History,
      color: 'blue',
      input: 'Token ID and registering organization DID.',
      action: 'Updates contract assetCustodian[tokenId] mapping to registering agency DID.',
      output: 'Immutably established initial legal custodian on public ledger.'
    },
    {
      num: '08',
      label: 'TRANSFER',
      title: 'Cross-Agency Custody Transfer',
      componentTarget: 'custody_lifecycle',
      icon: ArrowLeftRight,
      color: 'cyan',
      input: 'Transfer dispatch manifest signed by sender DID + receiver acceptance signature.',
      action: 'Executes transferCustody(tokenId, newCustodian) contract transaction with dual-authorization.',
      output: 'Atomic on-chain custodian state transition from sender to receiver agency.'
    },
    {
      num: '09',
      label: 'VERIFY',
      title: 'Independent Inbound Verification',
      componentTarget: 'verification_layer',
      icon: CheckCircle2,
      color: 'emerald',
      input: 'Transferred payload binary + expected contentHash from smart contract token.',
      action: 'Receiving party re-hashes binary and performs 5-point cryptographic equality check.',
      output: 'Mathematical verification certificate: 100% bit-level preservation confirmed.'
    },
    {
      num: '10',
      label: 'AUDIT',
      title: 'Immutable Audit Stream Updated',
      componentTarget: 'audit_stream',
      icon: FileSpreadsheet,
      color: 'purple',
      input: 'Verification outcome, actor DID, and block transaction hash.',
      action: 'Emits HashVerified and CustodyTransferred EVM events and logs relational audit entry.',
      output: 'Permanent court-admissible audit record; forensic Lineage DAG updated.'
    }
  ];

  const current = steps[activeStep];

  const handleStepSelect = (idx) => {
    setActiveStep(idx);
    if (onHighlightComponent && steps[idx].componentTarget) {
      onHighlightComponent(steps[idx].componentTarget);
    }
  };

  return (
    <section id="data-flow" className="relative py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-800/80">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-[11px] font-mono font-bold text-cyan-400 uppercase tracking-widest">
              END-TO-END EXECUTION TRACE
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-mono font-black text-white">
            10-STEP CONTINUOUS DATA FLOW
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 font-sans mt-1 max-w-3xl">
            Tracing the deterministic lifecycle of digital evidence from raw forensic selection through off-chain encryption, on-chain minting, custody transfers, and zero-trust verification.
          </p>
        </div>
        <div className="text-xs font-mono text-cyan-400">
          SELECT STEP TO HIGHLIGHT PIPELINE
        </div>
      </div>

      {/* Continuous 10-Step Visual Flow Ribbon */}
      <div className="relative overflow-x-auto pb-4 pt-2">
        <div className="min-w-[840px]">
          {/* Continuous visual path line */}
          <div className="relative h-1 bg-slate-800 rounded-full mb-6 mx-4">
            <div 
              className="absolute top-0 left-0 h-1 bg-gradient-to-r from-cyan-400 via-purple-400 to-emerald-400 rounded-full transition-all duration-300"
              style={{ width: `${((activeStep + 1) / steps.length) * 100}%` }}
            />
          </div>

          <div className="grid grid-cols-10 gap-1.5">
            {steps.map((st, idx) => {
              const Icon = st.icon;
              const isSelected = activeStep === idx;
              const isPast = activeStep >= idx;

              return (
                <button
                  key={st.num}
                  onClick={() => handleStepSelect(idx)}
                  className={`group relative flex flex-col items-center p-2 rounded-xl border transition-all text-center cursor-pointer ${
                    isSelected
                      ? 'bg-slate-900 border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.3)] -translate-y-1'
                      : isPast
                      ? 'bg-slate-950/80 border-slate-700/80 hover:border-slate-600'
                      : 'bg-slate-950/50 border-slate-800/80 opacity-60 hover:opacity-100'
                  }`}
                >
                  <span className={`text-[9px] font-mono font-bold mb-1 ${isSelected ? 'text-cyan-400' : 'text-slate-400'}`}>
                    {st.num}
                  </span>

                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center mb-1.5 transition-all ${
                    isSelected
                      ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-400/50'
                      : 'bg-slate-900 text-slate-400'
                  }`}>
                    <Icon className="w-3.5 h-3.5" />
                  </div>

                  <span className={`font-mono text-[10px] font-bold tracking-wider truncate max-w-full ${
                    isSelected ? 'text-white' : 'text-slate-300'
                  }`}>
                    {st.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Clean 3-Part Step Box: INPUT | ACTION | OUTPUT */}
      <div className="mt-4 p-6 rounded-2xl bg-[#030712]/95 border border-slate-800 shadow-[0_0_30px_rgba(6,182,212,0.06)] font-mono text-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-800 gap-2 mb-5">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs px-2.5 py-1 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 font-bold">
              STEP {current.num}: {current.label}
            </span>
            <h3 className="font-mono text-sm sm:text-base font-bold text-white">
              {current.title}
            </h3>
          </div>
          <span className="text-[11px] text-slate-400">
            Target Tier: <span className="text-cyan-300 font-bold uppercase">{current.componentTarget}</span>
          </span>
        </div>

        {/* The 3 strict sections: INPUT | ACTION | OUTPUT */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* INPUT */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-blue-500/20">
            <div className="flex items-center gap-2 text-blue-400 font-bold text-[10px] uppercase tracking-wider mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
              <span>01. INPUT</span>
            </div>
            <p className="text-xs text-slate-300 font-sans leading-relaxed">
              {current.input}
            </p>
          </div>

          {/* ACTION */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-cyan-500/20">
            <div className="flex items-center gap-2 text-cyan-400 font-bold text-[10px] uppercase tracking-wider mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              <span>02. ACTION</span>
            </div>
            <p className="text-xs text-slate-300 font-sans leading-relaxed">
              {current.action}
            </p>
          </div>

          {/* OUTPUT */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-emerald-500/20">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-[10px] uppercase tracking-wider mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>03. OUTPUT</span>
            </div>
            <p className="text-xs text-slate-300 font-sans leading-relaxed">
              {current.output}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
