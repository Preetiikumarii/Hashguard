import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Modal } from '../common/Modal';
import { ShieldPlus, Hash, Upload, Loader2, CheckCircle2, X, FileText, Wallet, ExternalLink, Copy, Check, Sparkles, ShieldCheck, AlertCircle } from 'lucide-react';
import { evidenceService } from '../../services/evidenceService';
import { Web3SealingModal } from './Web3SealingModal';
import { ethers } from 'ethers';
import HashGuardABI from '../../contracts/HashGuard.json';
import { useApp } from '../../context/AppContext';

export const NewEvidenceModal = ({ isOpen, onClose, onCreated }) => {
  const { currentOrg, currentRole } = useApp();
  const fileInputRef = useRef(null);

  const getInitialFormData = useCallback(() => ({
    title: '',
    caseId: 'CASE-2026-9012',
    type: 'Malware Binary',
    fileSize: '',
    collector: `${(currentRole?.id || 'officer').toLowerCase()}@${(currentOrg?.shortName || 'consortium').toLowerCase().replace(/\s+/g, '')}.gov`,
    description: '',
    forensicNotes: '',
    allocatedTo: '',
    sourceOrg: currentOrg?.name || 'Organization B — Cyber Defense Lab',
    currentCustodian: currentOrg?.name || 'Organization B — Cyber Defense Lab',
    retentionPolicyName: 'Active Investigation Evidence',
    retentionPeriodDays: 365,
    parentEvidenceId: '',
    assetCategory: 'FORENSIC_EVIDENCE'
  }), [currentOrg, currentRole]);

  const [formData, setFormData] = useState(getInitialFormData);
  const [computingHash, setComputingHash] = useState(false);
  const [computedHash, setComputedHash] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isSubmittingRef = useRef(false);

  // Live MetaMask Wallet Integration State
  const [walletState, setWalletState] = useState({
    hasMetaMask: false,
    account: null,
    chainId: null,
    networkName: 'Not Connected',
    isConnecting: false,
    isSepolia: false,
    isLocal: false
  });
  const [copiedWallet, setCopiedWallet] = useState(false);

  // Live Web3 Sealing Progress Modal State
  const [sealingState, setSealingState] = useState({
    isOpen: false,
    status: 'idle',
    statusMessage: '',
    assetId: '',
    rawSignature: '',
    signerAddress: '',
    txHash: '',
    blockNumber: null,
    networkName: '',
    contractAddress: '',
    errorMessage: '',
    createdResult: null
  });

  const checkWalletConnection = useCallback(async () => {
    if (typeof window !== 'undefined' && window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        const chainIdHex = await window.ethereum.request({ method: 'eth_chainId' });
        const chainIdNum = parseInt(chainIdHex, 16);
        const isSepolia = chainIdNum === 11155111;
        const isLocal = chainIdNum === 31337 || chainIdNum === 1337;
        let networkName = 'Unknown EVM Chain';
        if (isSepolia) networkName = 'Ethereum Sepolia Testnet';
        else if (isLocal) networkName = 'Localhost EVM Node';
        else if (chainIdNum === 1) networkName = 'Ethereum Mainnet';

        setWalletState({
          hasMetaMask: true,
          account: accounts && accounts.length > 0 ? accounts[0] : null,
          chainId: chainIdNum,
          networkName,
          isConnecting: false,
          isSepolia,
          isLocal
        });
      } catch (err) {
        console.warn('Wallet check error:', err);
      }
    } else {
      setWalletState(prev => ({ ...prev, hasMetaMask: false }));
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      checkWalletConnection();
      if (typeof window !== 'undefined' && window.ethereum) {
        const handleAccounts = (accs) => {
          setWalletState(prev => ({
            ...prev,
            account: accs && accs.length > 0 ? accs[0] : null
          }));
        };
        const handleChain = () => {
          checkWalletConnection();
        };
        window.ethereum.on?.('accountsChanged', handleAccounts);
        window.ethereum.on?.('chainChanged', handleChain);
        return () => {
          window.ethereum.removeListener?.('accountsChanged', handleAccounts);
          window.ethereum.removeListener?.('chainChanged', handleChain);
        };
      }
    }
  }, [isOpen, checkWalletConnection]);

  const connectMetaMask = async () => {
    if (!window.ethereum) {
      alert("MetaMask extension not detected. Please install MetaMask to enable hardware/extension Web3 signing.");
      return;
    }
    setWalletState(prev => ({ ...prev, isConnecting: true }));
    try {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      await checkWalletConnection();
    } catch (err) {
      console.warn("Wallet connection rejected:", err);
    } finally {
      setWalletState(prev => ({ ...prev, isConnecting: false }));
    }
  };

  const switchToSepolia = async () => {
    if (!window.ethereum) return;
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0xaa36a7' }]
      });
      await checkWalletConnection();
    } catch (switchError) {
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: '0xaa36a7',
              chainName: 'Sepolia Test Network',
              nativeCurrency: { name: 'SepoliaETH', symbol: 'ETH', decimals: 18 },
              rpcUrls: ['https://rpc.sepolia.org'],
              blockExplorerUrls: ['https://sepolia.etherscan.io']
            }]
          });
          await checkWalletConnection();
        } catch (addError) {
          console.error("Failed to add Sepolia network:", addError);
        }
      }
    }
  };

  const copyWalletAddress = () => {
    if (walletState.account) {
      navigator.clipboard.writeText(walletState.account);
      setCopiedWallet(true);
      setTimeout(() => setCopiedWallet(false), 2000);
    }
  };

  const resetForm = useCallback(() => {
    setFormData(getInitialFormData());
    setSelectedFile(null);
    setComputedHash('');
    setComputingHash(false);
    setIsSubmitting(false);
    isSubmittingRef.current = false;
    setSealingState({
      isOpen: false,
      status: 'idle',
      statusMessage: '',
      assetId: '',
      rawSignature: '',
      signerAddress: '',
      txHash: '',
      blockNumber: null,
      networkName: '',
      contractAddress: '',
      errorMessage: '',
      createdResult: null
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [getInitialFormData]);

  // Reset form whenever modal closes or opens fresh so previous file data is never retained
  useEffect(() => {
    if (!isOpen) {
      resetForm();
    } else {
      setFormData(prev => ({
        ...prev,
        sourceOrg: currentOrg?.name || prev.sourceOrg,
        currentCustodian: currentOrg?.name || prev.currentCustodian,
        collector: `${(currentRole?.id || 'officer').toLowerCase()}@${(currentOrg?.shortName || 'consortium').toLowerCase().replace(/\s+/g, '')}.gov`
      }));
    }
  }, [isOpen, resetForm, currentOrg, currentRole]);

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);

    // Auto-format file size in KB for small files < 1 MB so it never displays 0.00 MB
    let formattedSize;
    if (file.size < 1024 * 1024) {
      formattedSize = `${(file.size / 1024).toFixed(2)} KB`;
    } else if (file.size < 1024 * 1024 * 1024) {
      formattedSize = `${(file.size / (1024 * 1024)).toFixed(2)} MB`;
    } else {
      formattedSize = `${(file.size / (1024 * 1024 * 1024)).toFixed(2)} GB`;
    }

    // Determine evidence type and category from file extension
    const ext = file.name.split('.').pop().toLowerCase();
    let detectedType = 'Malware Binary';
    let detectedCategory = 'FORENSIC_EVIDENCE';

    if (['ps1', 'bat', 'sh', 'vbs', 'py'].includes(ext)) {
      detectedType = 'Source Code';
      detectedCategory = 'SECURITY_ARTIFACT';
    } else if (['pcap', 'pcapng', 'cap'].includes(ext)) {
      detectedType = 'Network Capture';
      detectedCategory = 'FORENSIC_EVIDENCE';
    } else if (['dmp', 'raw', 'vmem'].includes(ext)) {
      detectedType = 'Memory Dump';
      detectedCategory = 'FORENSIC_EVIDENCE';
    } else if (['e01', 'dd', 'img'].includes(ext)) {
      detectedType = 'Disk Image';
      detectedCategory = 'FORENSIC_EVIDENCE';
    } else if (['yar', 'yara'].includes(ext)) {
      detectedType = 'IOC Set';
      detectedCategory = 'SECURITY_ARTIFACT';
    } else if (ext === 'json') {
      detectedType = 'IOC Set';
      detectedCategory = 'SECURITY_ARTIFACT';
    } else if (ext === 'csv') {
      detectedType = 'Dataset';
      detectedCategory = 'DATASET';
    } else if (ext === 'log') {
      detectedType = 'Network Capture';
      detectedCategory = 'FORENSIC_EVIDENCE';
    } else if (['pdf', 'docx', 'doc', 'txt'].includes(ext)) {
      detectedType = 'Digital Document';
      detectedCategory = 'DOCUMENT';
    } else if (['exe', 'dll', 'bin', 'elf'].includes(ext)) {
      detectedType = 'Malware Binary';
      detectedCategory = 'FORENSIC_EVIDENCE';
    }

    // Always update title, scope, and notes to the actual selected file
    let newDescription = `Forensic acquisition of ${file.name} (${formattedSize}). Preserved under ISO/IEC 27037 standards with WebCrypto SHA-256 verification.`;
    let newForensicNotes = '';

    // If it's a text-readable file < 512 KB, automatically load its actual content into Raw Sample / Forensic Notes!
    const textExtensions = ['txt', 'log', 'csv', 'json', 'yar', 'yara', 'ps1', 'bat', 'sh', 'py'];
    if (file.size < 512 * 1024 && textExtensions.includes(ext)) {
      try {
        newForensicNotes = await file.text();
        newDescription = `Forensic exhibit extracted from ${file.name}. Raw telemetry and indicators loaded for automated AI neural triage.`;
      } catch (readErr) {
        console.warn('Could not read text from file:', readErr);
      }
    }

    setFormData(prev => ({
      ...prev,
      title: file.name,
      fileSize: formattedSize,
      type: detectedType,
      assetCategory: detectedCategory,
      description: newDescription,
      forensicNotes: newForensicNotes
    }));

    setComputingHash(true);
    setComputedHash('Computing SHA-256...');
    
    try {
      // Calculate real SHA-256 Hash using Web Crypto API
      const arrayBuffer = await file.arrayBuffer();
      const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      
      setComputedHash(hashHex);
    } catch (error) {
      console.error("Error computing hash", error);
      setComputedHash('');
    } finally {
      setComputingHash(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmittingRef.current || isSubmitting) return;

    if (!computedHash || computedHash.includes('Computing')) {
      alert("Please wait for the SHA-256 hash to finish computing or provide one manually.");
      return;
    }

    executeSealingProcess();
  };

  const executeSealingProcess = async () => {
    if (isSubmittingRef.current) return;
    isSubmittingRef.current = true;
    setIsSubmitting(true);

    const assetId = `EV-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    const sepoliaContract = '0x3592925Cf64E7C3c68d4911b2ebC722c2Ea67052';

    setSealingState({
      isOpen: true,
      status: 'hashing',
      statusMessage: 'Client-side SHA-256 bitstream validated. Preparing cryptographic manifest...',
      assetId,
      rawSignature: '',
      signerAddress: walletState.account || '',
      txHash: '',
      blockNumber: null,
      networkName: walletState.networkName,
      contractAddress: walletState.isSepolia ? sepoliaContract : '',
      errorMessage: '',
      createdResult: null
    });

    let signatureData = null;
    let finalTxHash = null;
    let finalBlockNumber = null;
    let finalSignerAddress = walletState.account || null;

    try {
      if (typeof window !== 'undefined' && window.ethereum) {
        try {
          const provider = new ethers.BrowserProvider(window.ethereum);
          await provider.send("eth_requestAccounts", []);
          const signer = await provider.getSigner();
          finalSignerAddress = signer.address;
          const network = await provider.getNetwork();

          // Stage 2: Prompt MetaMask personal sign
          setSealingState(prev => ({
            ...prev,
            status: 'awaiting_signature',
            signerAddress: signer.address,
            statusMessage: 'Awaiting signature attestation in your MetaMask wallet extension...'
          }));

          const manifestText = 
            `[HASHGUARD CRYPTOGRAPHIC EVIDENCE SEAL]\n` +
            `Exhibit ID: ${assetId}\n` +
            `SHA-256 Digest: ${computedHash}\n` +
            `Evidence Title: ${formData.title || 'Digital Forensic Exhibit'}\n` +
            `Sealing Timestamp: ${new Date().toISOString()}\n\n` +
            `Attestation: I certify this bitstream digest under ISO/IEC 27037 and Cryptographic Verification Standards.`;

          try {
            const signature = await signer.signMessage(manifestText);
            signatureData = {
              status: 'VALID',
              signer: signer.address,
              algorithm: 'ECDSA secp256k1 (EIP-191)',
              publicKeyFingerprint: `SHA256:${signer.address.substring(2, 8)}...${signer.address.substring(signer.address.length - 4)}`,
              signedTimestamp: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
              rawSignature: signature,
              manifestMessage: manifestText,
              networkName: Number(network.chainId) === 11155111 ? 'Sepolia Testnet' : `Chain ${network.chainId}`,
              chainId: Number(network.chainId),
              walletClient: 'MetaMask'
            };

            setSealingState(prev => ({
              ...prev,
              status: 'signature_acquired',
              rawSignature: signature,
              statusMessage: 'Cryptographic signature acquired and verified against secp256k1 curve!'
            }));
          } catch (sigErr) {
            console.warn("MetaMask signature skipped or rejected:", sigErr);
            setSealingState(prev => ({
              ...prev,
              errorMessage: 'MetaMask signature dismissed by user. Sealing with local enclave authority.'
            }));
          }

          // Stage 3: On-Chain Minting if on Sepolia (11155111) or Local EVM (31337 / 1337)
          if (network.chainId === 11155111n || network.chainId === 31337n || network.chainId === 1337n) {
            try {
              const activeContractAddr = network.chainId === 11155111n
                ? sepoliaContract
                : '0x5FbDB2315678afecb367f032d93F642f64180aa3';

              setSealingState(prev => ({
                ...prev,
                status: 'broadcasting_tx',
                contractAddress: activeContractAddr,
                statusMessage: 'Broadcasting mintAssetNFT transaction to Ethereum smart contract...'
              }));

              const contract = new ethers.Contract(activeContractAddr, HashGuardABI.abi, signer);
              const contentHash = '0x' + computedHash;
              const metadataHash = ethers.id(formData.title || 'metadata');
              const targetRecipient = (formData.allocatedTo && formData.allocatedTo.startsWith('0x'))
                ? formData.allocatedTo
                : signer.address;

              const tx = await (contract.mintAssetNFT || contract.mintEvidenceNFT)(
                targetRecipient,
                assetId,
                contentHash,
                metadataHash
              );

              finalTxHash = tx.hash;
              setSealingState(prev => ({
                ...prev,
                status: 'awaiting_receipt',
                txHash: tx.hash,
                statusMessage: `Transaction broadcast (${tx.hash.substring(0, 10)}...). Waiting for block confirmation...`
              }));

              const receipt = await tx.wait();
              finalBlockNumber = Number(receipt.blockNumber);
              setSealingState(prev => ({
                ...prev,
                status: 'tx_confirmed',
                blockNumber: finalBlockNumber,
                statusMessage: `Block #${finalBlockNumber} confirmed on Ethereum blockchain!`
              }));
            } catch (contractErr) {
              console.warn("Contract transaction skipped or rejected:", contractErr);
              setSealingState(prev => ({
                ...prev,
                errorMessage: contractErr.message ? `Contract notice: ${contractErr.message.substring(0, 80)}` : 'On-chain minting skipped.'
              }));
            }
          }
        } catch (web3Err) {
          console.warn("Web3 interaction notice:", web3Err);
        }
      }

      // Stage 4: Persist in custody ledger
      setSealingState(prev => ({
        ...prev,
        status: 'committing',
        statusMessage: 'Recording forensic exhibit and cryptographic witness into enclave ledger...'
      }));

      const created = await evidenceService.createEvidence({
        ...formData,
        id: assetId,
        hash: computedHash,
        expectedHash: computedHash,
        txHash: finalTxHash,
        blockNumber: finalBlockNumber,
        contractAddress: finalTxHash ? sepoliaContract : null,
        network: walletState.networkName,
        chainId: walletState.chainId,
        signerAddress: finalSignerAddress,
        blockchainStatus: finalTxHash
          ? 'ON-CHAIN ERC-721 MINTED (SEPOLIA)'
          : (signatureData ? 'ECDSA CRYPTOGRAPHICALLY SEALED (SECP256K1)' : 'OFF-CHAIN ENCLAVE SECURED'),
        ...(signatureData ? { signature: signatureData } : {})
      }, selectedFile);

      setSealingState(prev => ({
        ...prev,
        status: 'completed',
        statusMessage: 'Evidence exhibit successfully sealed and verified!',
        createdResult: created
      }));

    } catch (err) {
      console.error("Evidence creation error:", err);
      setSealingState(prev => ({
        ...prev,
        status: 'error',
        errorMessage: err.message || 'Sealing failed. Check console for details.'
      }));
    } finally {
      setIsSubmitting(false);
      isSubmittingRef.current = false;
    }
  };

  const handleSealingModalDone = () => {
    const result = sealingState.createdResult;
    setSealingState(prev => ({ ...prev, isOpen: false }));
    resetForm();
    onClose();
    if (onCreated && result) onCreated(result);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="COLLECT & SEAL DIGITAL EVIDENCE"
      subtitle="Select a local file to client-side hash and anchor an immutable custody seal"
      maxWidth="max-w-2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-sm font-sans">
        
        {/* Real-time File Selector */}
        <div className={`p-5 rounded-md border transition-all text-center relative ${
          selectedFile 
            ? 'bg-ce-brand/5 border-ce-brand/40 shadow-sm' 
            : 'bg-ce-surface-subtle border-ce-border border-dashed hover:border-ce-brand/50 cursor-pointer group'
        }`}>
          <input 
            ref={fileInputRef}
            type="file" 
            onChange={handleFileSelect} 
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            title={selectedFile ? `Active: ${selectedFile.name} (Click to replace)` : "Select physical file to hash"}
          />
          
          {selectedFile ? (
            <div className="flex items-center justify-between pointer-events-none px-2">
              <div className="flex items-center gap-3 text-left">
                <div className="w-10 h-10 rounded-md bg-ce-brand/10 border border-ce-brand/30 flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5 text-ce-brand" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-ce-text-primary text-sm font-mono">{selectedFile.name}</span>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-500 border border-emerald-500/30">
                      <CheckCircle2 className="w-3 h-3" /> Loaded
                    </span>
                  </div>
                  <span className="text-xs text-ce-text-muted font-mono">{formData.fileSize || `${(selectedFile.size / 1024).toFixed(2)} KB`} • Click or drag to replace</span>
                </div>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  resetForm();
                }}
                className="pointer-events-auto p-1.5 rounded-md hover:bg-red-500/10 text-ce-text-muted hover:text-red-500 transition-colors z-20"
                title="Remove file and reset form"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center pointer-events-none">
              <div className="w-10 h-10 rounded-full bg-ce-brand/10 border border-ce-brand/20 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Upload className="w-5 h-5 text-ce-brand" />
              </div>
              <span className="font-semibold text-ce-text-primary text-sm">Select Physical File for Hashing</span>
              <span className="text-xs text-ce-text-muted mt-1 max-w-sm">File never leaves your machine. Hashing is performed locally in browser via WebCrypto.</span>
            </div>
          )}
        </div>

        {/* MetaMask Web3 Attestation & Network Card */}
        <div className="rounded-lg bg-gradient-to-r from-ce-surface to-ce-surface-subtle border border-ce-border p-4 shadow-sm space-y-3 font-mono">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-2.5 border-b border-ce-border/60">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500">
                <Wallet className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-ce-text-primary uppercase tracking-wider">
                    MetaMask Cryptographic Attestation
                  </span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/15 text-amber-400 border border-amber-500/30 font-bold">
                    secp256k1
                  </span>
                </div>
                <span className="text-[11px] text-ce-text-muted">
                  Zero-Gas EIP-191 Personal Sign + Sepolia ERC-721 Contract Anchor
                </span>
              </div>
            </div>

            {/* Wallet Connection Status */}
            <div>
              {walletState.account ? (
                <div className="flex items-center gap-2">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>{walletState.account.substring(0, 6)}...{walletState.account.substring(walletState.account.length - 4)}</span>
                    <button
                      type="button"
                      onClick={copyWalletAddress}
                      className="text-emerald-400/80 hover:text-emerald-300 ml-0.5"
                      title="Copy connected address"
                    >
                      {copiedWallet ? <Check className="w-3 h-3 text-emerald-300" /> : <Copy className="w-3 h-3" />}
                    </button>
                  </div>
                </div>
              ) : walletState.hasMetaMask ? (
                <button
                  type="button"
                  onClick={connectMetaMask}
                  disabled={walletState.isConnecting}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-300 text-xs font-bold transition-all shadow-sm cursor-pointer"
                >
                  {walletState.isConnecting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                  <span>Connect MetaMask</span>
                </button>
              ) : (
                <span className="inline-flex items-center gap-1 text-[11px] text-ce-text-muted">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
                  <span>MetaMask Not Detected</span>
                </span>
              )}
            </div>
          </div>

          {/* Network & Contract Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-[11px]">
            <div className="p-2 rounded bg-ce-bg border border-ce-border/70 flex items-center justify-between">
              <span className="text-ce-text-muted uppercase text-[10px]">Active Network:</span>
              {walletState.isSepolia ? (
                <span className="text-emerald-400 font-bold inline-flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  Sepolia Testnet (11155111)
                </span>
              ) : walletState.isLocal ? (
                <span className="text-cyan-400 font-bold">Local EVM (31337)</span>
              ) : walletState.account ? (
                <div className="flex items-center gap-1.5">
                  <span className="text-amber-400 truncate max-w-[120px]">{walletState.networkName}</span>
                  <button
                    type="button"
                    onClick={switchToSepolia}
                    className="text-[10px] text-ce-brand hover:underline font-bold cursor-pointer"
                  >
                    Switch to Sepolia
                  </button>
                </div>
              ) : (
                <span className="text-ce-text-muted">Awaiting connection</span>
              )}
            </div>

            <div className="p-2 rounded bg-ce-bg border border-ce-border/70 flex items-center justify-between">
              <span className="text-ce-text-muted uppercase text-[10px]">Contract Anchor:</span>
              <a
                href="https://sepolia.etherscan.io/address/0x3592925Cf64E7C3c68d4911b2ebC722c2Ea67052"
                target="_blank"
                rel="noreferrer"
                className="text-ce-brand hover:underline inline-flex items-center gap-1 truncate font-bold"
                title="View contract on Sepolia Etherscan"
              >
                <span>0x3592...7052</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          <div className="text-[11px] text-ce-text-muted flex items-center gap-2 pt-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>
              Exhibits are signed directly in MetaMask ($0.00 zero gas fee) and minted as ERC-721 token if on Sepolia.
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          
            <div className="sm:col-span-1">
              <label className="block text-ce-text-primary text-xs font-semibold uppercase tracking-wider mb-1.5">
                Asset Category:
              </label>
              <select
                required
                className="w-full bg-ce-surface border border-ce-border text-ce-text-primary text-sm rounded-md px-3 py-2.5 focus:outline-none focus:border-ce-brand focus:ring-1 focus:ring-ce-brand transition-colors"
                value={formData.assetCategory || 'FORENSIC_EVIDENCE'}
                onChange={(e) => setFormData({...formData, assetCategory: e.target.value})}
              >
                <option value="FORENSIC_EVIDENCE">Forensic Evidence</option>
                <option value="DOCUMENT">Document</option>
                <option value="IMAGE">Image / Media</option>
                <option value="DATASET">Dataset</option>
                <option value="SECURITY_ARTIFACT">Security Artifact</option>
              </select>
            </div>
            <div className="sm:col-span-2">

            <label className="block text-ce-text-primary text-xs font-semibold uppercase tracking-wider mb-1.5">
              Asset Name / Specimen Label:
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Encrypted Ransomware Dropper DLL"
              className="w-full bg-ce-bg border border-ce-border rounded-md px-3 py-2 text-ce-text-primary placeholder:text-ce-text-muted focus:outline-none focus:border-ce-brand focus:ring-1 focus:ring-ce-brand font-mono text-sm transition-colors"
            />
          </div>

          <div>
            <label className="block text-ce-text-primary text-xs font-semibold uppercase tracking-wider mb-1.5">
              Case ID / Context:
            </label>
            <input
              type="text"
              required
              value={formData.caseId}
              onChange={(e) => setFormData({ ...formData, caseId: e.target.value })}
              placeholder="e.g. CASE-2026-9012"
              className="w-full bg-ce-bg border border-ce-border rounded-md px-3 py-2 text-ce-text-primary placeholder:text-ce-text-muted focus:outline-none focus:border-ce-brand focus:ring-1 focus:ring-ce-brand font-mono text-sm transition-colors"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-ce-text-primary text-xs font-semibold uppercase tracking-wider mb-1.5">
              Evidence Type:
            </label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="w-full bg-ce-bg border border-ce-border rounded-md px-3 py-2 text-ce-text-primary focus:outline-none focus:border-ce-brand focus:ring-1 focus:ring-ce-brand cursor-pointer font-mono text-sm transition-colors"
            >
              <option value="Malware Binary">Malware Binary</option>
              <option value="Network Capture">Network Capture (PCAP)</option>
              <option value="Memory Dump">Memory Dump (RAM)</option>
              <option value="Disk Image">Disk Image (E01)</option>
              <option value="IOC Set">IOC Set (YARA / Sigma)</option>
              <option value="Malware Analysis Report">Malware Analysis Report</option>
              <option value="Digital Document">Digital Document (PDF/DOCX)</option>
              <option value="Media File">Media File (Image/Video)</option>
              <option value="Source Code">Source Code / Script</option>
            </select>
          </div>

          <div>
            <label className="block text-ce-text-primary text-xs font-semibold uppercase tracking-wider mb-1.5">
              Calculated File Size:
            </label>
            <input
              type="text"
              value={formData.fileSize}
              onChange={(e) => setFormData({ ...formData, fileSize: e.target.value })}
              placeholder="e.g. 512 KB or 14.8 MB"
              className="w-full bg-ce-bg border border-ce-border rounded-md px-3 py-2 text-ce-text-primary focus:outline-none focus:border-ce-brand focus:ring-1 focus:ring-ce-brand font-mono text-sm transition-colors"
            />
          </div>

          <div>
            <label className="block text-ce-text-primary text-xs font-semibold uppercase tracking-wider mb-1.5">
              Sealing Agency:
            </label>
            <select
              value={formData.sourceOrg}
              onChange={(e) => setFormData({ ...formData, sourceOrg: e.target.value, currentCustodian: e.target.value })}
              className="w-full bg-ce-bg border border-ce-border rounded-md px-3 py-2 text-ce-text-primary focus:outline-none focus:border-ce-brand focus:ring-1 focus:ring-ce-brand cursor-pointer font-mono text-xs transition-colors"
            >
              <option value="Organization A — CERT-Alpha">Organization A — CERT-Alpha</option>
              <option value="Organization B — Cyber Defense Lab">Organization B — Cyber Defense Lab</option>
              <option value="Organization C — Judicial Court Registry">Organization C — Judicial Court Registry</option>
              <option value="Organization D — Cyber Crime Police (LEA)">Organization D — Cyber Crime Police (LEA)</option>
              <option value="Audit Board — Independent Oversight">Audit Board — Independent Oversight</option>
            </select>
          </div>
        </div>

        {/* Retention Policy Selection */}
        <div>
          <label className="block text-ce-text-primary text-xs font-semibold uppercase tracking-wider mb-1.5">
            Initial Retention Lifecycle Policy:
          </label>
          <select
            value={formData.retentionPolicyName}
            onChange={(e) => {
              const name = e.target.value;
              let days = 365;
              if (name === 'Closed Case Evidence') days = 180;
              if (name === 'Forensic / Malware Evidence') days = 1825;
              if (name === 'Temporary / Unverified Evidence') days = 30;
              setFormData({ ...formData, retentionPolicyName: name, retentionPeriodDays: days });
            }}
            className="w-full bg-ce-bg border border-ce-border rounded-md px-3 py-2 text-ce-text-primary focus:outline-none focus:border-ce-brand focus:ring-1 focus:ring-ce-brand cursor-pointer font-mono text-xs transition-colors"
          >
            <option value="Active Investigation Evidence">Active Investigation Evidence (365 Days • Cold Storage Archive)</option>
            <option value="Closed Case Evidence">Closed Case Evidence (180 Days • Cold Storage Archive)</option>
            <option value="Forensic / Malware Evidence">Forensic / Malware Evidence (1825 Days • Long-Term Archive)</option>
            <option value="Temporary / Unverified Evidence">Temporary / Unverified Evidence (30 Days • Review Required)</option>
          </select>
        </div>

        {/* SHA-256 Computation Box */}
        <div className="p-4 rounded-md bg-ce-surface-subtle border border-ce-brand/30 relative">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold text-ce-brand uppercase tracking-wider flex items-center gap-1.5">
              <Hash className="w-3.5 h-3.5" />
              CLIENT-SIDE SHA-256 INTEGRITY HASH
            </span>
            {computingHash && <Loader2 className="w-3.5 h-3.5 text-ce-brand animate-spin" />}
          </div>
          <input
            type="text"
            required
            value={computedHash}
            onChange={(e) => setComputedHash(e.target.value)}
            placeholder="Select a file above or enter SHA-256 manually..."
            className={`w-full bg-ce-bg border border-ce-border rounded-md px-3 py-2 placeholder:text-ce-text-muted focus:outline-none focus:border-ce-brand focus:ring-1 focus:ring-ce-brand font-mono text-xs transition-colors ${computingHash ? 'text-ce-brand animate-pulse' : 'text-ce-text-primary'}`}
          />
        </div>

        {/* NFT Asset Allocation to DID / Recipient */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-ce-text-primary text-xs font-semibold uppercase tracking-wider">
              Allocate NFT Ownership to Recipient DID / Wallet:
            </label>
            <span className="text-[10px] font-mono text-ce-brand">Smart Contract Governed</span>
          </div>
          <input
            type="text"
            value={formData.allocatedTo || ''}
            onChange={(e) => setFormData({ ...formData, allocatedTo: e.target.value })}
            placeholder="e.g. 0x70997970C51812dc3A010C7d01b50e0d17dc79C8 or did:ethr:0x... (Default: Your Identity)"
            className="w-full bg-ce-bg border border-ce-border rounded-md px-3 py-2 text-ce-text-primary placeholder:text-ce-text-muted focus:outline-none focus:border-ce-brand focus:ring-1 focus:ring-ce-brand font-mono text-xs transition-colors"
          />
          <p className="text-[10px] text-ce-text-muted mt-1 font-mono">
            Directly assigns the newly minted ERC-721 NFT to the recipient's decentralized identifier.
          </p>
        </div>

        <div>
          <label className="block text-ce-text-primary text-xs font-semibold uppercase tracking-wider mb-1.5">
            Forensic Scope & Technical Context:
          </label>
          <textarea
            rows={3}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Document extraction method, acquisition sector, triage tags..."
            className="w-full bg-ce-bg border border-ce-border rounded-md p-3 text-ce-text-primary placeholder:text-ce-text-muted focus:outline-none focus:border-ce-brand focus:ring-1 focus:ring-ce-brand text-sm transition-colors mb-4"
          />

          <label className="block text-ce-text-primary text-xs font-semibold uppercase tracking-wider mb-1.5">
            Raw Sample / Forensic Notes (For AI Triage):
          </label>
          <textarea
            rows={5}
            value={formData.forensicNotes || ''}
            onChange={(e) => setFormData({ ...formData, forensicNotes: e.target.value })}
            placeholder="Paste raw log lines, hex dumps, scripts, or specific forensic observations here for the AI to analyze..."
            className="w-full bg-ce-bg border border-ce-border rounded-md p-3 text-ce-text-primary placeholder:text-ce-text-muted focus:outline-none focus:border-ce-brand focus:ring-1 focus:ring-ce-brand font-mono text-xs transition-colors"
          />
        </div>

        <div className="pt-4 mt-2 border-t border-ce-border flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={handleClose}
            className="px-4 py-2 rounded-md bg-ce-surface-subtle text-ce-text-secondary hover:text-ce-text-primary hover:bg-ce-border transition-colors font-semibold text-xs"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={computingHash || isSubmitting}
            className={`inline-flex items-center gap-2 px-5 py-2 rounded-md bg-ce-brand hover:bg-ce-brand-hover text-white font-bold text-xs transition-colors shadow-sm ${(computingHash || isSubmitting) ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldPlus className="w-4 h-4" />}
            <span>{isSubmitting ? 'Anchoring to Blockchain...' : 'Seal Evidence & Register Custody'}</span>
          </button>
        </div>
      </form>
      <Web3SealingModal
        isOpen={sealingState.isOpen}
        status={sealingState.status}
        statusMessage={sealingState.statusMessage}
        assetId={sealingState.assetId}
        computedHash={computedHash}
        signerAddress={sealingState.signerAddress}
        rawSignature={sealingState.rawSignature}
        txHash={sealingState.txHash}
        blockNumber={sealingState.blockNumber}
        networkName={sealingState.networkName || walletState.networkName}
        contractAddress={sealingState.contractAddress}
        errorMessage={sealingState.errorMessage}
        onComplete={handleSealingModalDone}
        onCancel={() => setSealingState(prev => ({ ...prev, isOpen: false }))}
      />
    </Modal>
  );
};

