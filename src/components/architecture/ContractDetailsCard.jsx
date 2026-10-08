import React from 'react';
import {
  Boxes,
  ExternalLink,
  CheckCircle2,
  Copy,
  Layers,
  Sparkles,
  Lock,
  FileCode
} from 'lucide-react';

export const ContractDetailsCard = () => {
  const contractAddress = "0x3592925Cf64E7C3c68d4911b2ebC722c2Ea67052";
  const chainId = "11155111";
  const networkName = "Ethereum Sepolia Testnet";
  const etherscanUrl = `https://sepolia.etherscan.io/address/${contractAddress}`;

  const [copied, setCopied] = React.useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(contractAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const keyFunctions = [
    { name: 'mintAssetNFT(address to, string assetId, bytes32 contentHash, bytes32 metaHash)', role: 'Tokenizes evidence as ERC-721 NFT' },
    { name: 'transferCustody(uint256 tokenId, address newCustodian)', role: 'Atomically updates exhibit custodian' },
    { name: 'registerDID(string didURI, bytes32 didDocumentHash)', role: 'Binds address to W3C DID document' },
    { name: 'grantRole(bytes32 role, address account)', role: 'Assigns on-chain RBAC privileges' },
    { name: 'applyRetentionPolicy(uint256 tokenId, uint256 retentionYears, bool isLegalHold)', role: 'Anchors court legal hold order' }
  ];

  const keyEvents = [
    { name: 'AssetNFTMinted(tokenId, assetId, to, contentHash, timestamp)', desc: 'Emitted upon exhibit registration' },
    { name: 'CustodyTransferred(tokenId, from, to)', desc: 'Emitted upon verified custody handover' },
    { name: 'HashVerified(tokenId, expectedHash, observedHash, valid)', desc: 'Emitted upon independent hash verification' },
    { name: 'DIDIdentityRegistered(user, didURI, didDocumentHash, timestamp)', desc: 'Emitted upon DID onboarding' }
  ];

  return (
    <div className="w-full bg-[#040812]/90 border border-amber-500/30 rounded-2xl p-4 sm:p-6 lg:p-8 backdrop-blur-xl shadow-2xl space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-widest">
              SMART CONTRACT DEPLOYMENT
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-mono font-black text-white">
            EVM CONTRACT SPECIFICATIONS
          </h3>
          <p className="text-xs text-slate-400 font-sans mt-0.5">
            Verified smart contract deployment anchoring immutable state transitions.
          </p>
        </div>

        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-xs font-bold self-start md:self-auto">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>VERIFIED ON SEPOLIA</span>
        </span>
      </div>

      {/* Contract Telemetry Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
          <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block">Network</span>
          <span className="text-sm font-mono font-bold text-white block">{networkName}</span>
          <span className="text-[10px] font-mono text-cyan-400">Public EVM Testnet</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
          <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block">Chain ID</span>
          <span className="text-sm font-mono font-bold text-white block">{chainId}</span>
          <span className="text-[10px] font-mono text-amber-400">Sepolia (11155111)</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
          <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block">Standards</span>
          <span className="text-sm font-mono font-bold text-white block">ERC-721 + AccessControl</span>
          <span className="text-[10px] font-mono text-purple-400">OpenZeppelin v5.6.1</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
          <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block">Target Architecture</span>
          <span className="text-sm font-mono font-bold text-white block">Hyperledger Besu</span>
          <span className="text-[10px] font-mono text-slate-400">Permissioned Consortium</span>
        </div>
      </div>

      {/* Contract Address & Explorer */}
      <div className="p-4 sm:p-5 rounded-xl bg-slate-950/90 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1 overflow-hidden">
          <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block">
            LIVE CONTRACT ADDRESS (HASHGUARD.sol)
          </span>
          <div className="flex items-center gap-2">
            <code className="text-xs sm:text-sm font-mono font-bold text-cyan-300 truncate select-all">
              {contractAddress}
            </code>
            <button
              onClick={copyToClipboard}
              className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer shrink-0"
              title="Copy Contract Address"
            >
              <Copy className="w-3.5 h-3.5" />
            </button>
            {copied && <span className="text-[10px] font-mono text-emerald-400 font-bold">Copied!</span>}
          </div>
        </div>

        <a
          href={etherscanUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/30 text-cyan-300 font-mono text-xs font-bold transition-all shrink-0 cursor-pointer shadow-sm"
        >
          <span>View on Etherscan</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* Key Functions & Events Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2.5">
          <span className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
            <FileCode className="w-3.5 h-3.5" />
            <span>PRIMARY SMART CONTRACT METHODS</span>
          </span>
          <div className="space-y-2 font-mono text-xs">
            {keyFunctions.map((fn, idx) => (
              <div key={idx} className="p-2 rounded bg-slate-900/60 border border-slate-800/80">
                <span className="font-bold text-white text-[11px] block truncate text-cyan-300">{fn.name}</span>
                <span className="text-[10px] text-slate-400">{fn.role}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2.5">
          <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
            <Boxes className="w-3.5 h-3.5" />
            <span>IMMUTABLE AUDIT EVENTS EMITTED</span>
          </span>
          <div className="space-y-2 font-mono text-xs">
            {keyEvents.map((ev, idx) => (
              <div key={idx} className="p-2 rounded bg-slate-900/60 border border-slate-800/80">
                <span className="font-bold text-white text-[11px] block truncate text-amber-300">{ev.name}</span>
                <span className="text-[10px] text-slate-400">{ev.desc}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
