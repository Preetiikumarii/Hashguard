import React, { useState } from 'react';
import {
  FlaskConical,
  ShieldAlert,
  Play,
  RotateCcw,
  CheckCircle2,
  Clock,
  UserX,
  ArrowRightLeft,
  FileSpreadsheet,
  AlertOctagon,
  Terminal,
  Activity,
  Layers
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PageHeader } from '../../components/layout/PageHeader';

export const SecurityLabPage = () => {
  const { runSecurityLabTest, toggleTamperSimulation, restoreRevokedIdentity } = useApp();

  const [testResults, setTestResults] = useState({});
  const [runningTests, setRunningTests] = useState({});
  const [isRunningAll, setIsRunningAll] = useState(false);

  const securityTests = [
    {
      id: 'TEST_01',
      title: 'Test 01: Tampered Evidence',
      category: 'Cryptographic Integrity Failure',
      targetAsset: 'EV-DDXOEY / EV-001',
      icon: AlertOctagon,
      color: 'rose',
      description: 'Simulates bit-flip data alteration in off-chain evidence payload. Recomputes SHA-256 digest against immutable on-chain sealed root and enforces download block.',
      invariants: 'Off-chain bitstream digest MUST strictly match on-chain root seal. Off-chain bytes altered -> verification fails.'
    },
    {
      id: 'TEST_02',
      title: 'Test 02: Unauthorized Custody Transfer',
      category: 'Access & Governance Enforcement',
      targetAsset: 'EV-001 (LockBit 3.0 Encryptor)',
      icon: ArrowRightLeft,
      color: 'amber',
      description: 'Simulates unauthenticated actor attempting custody transfer dispatch on Critical asset without required Application-Level Quorum Gate approval.',
      invariants: 'Critical assets require explicit Application-Level Quorum Gate (2-of-3) sign-off before custody dispatch status transition is permitted.'
    },
    {
      id: 'TEST_03',
      title: 'Test 03: Revoked Identity',
      category: 'Consortium Revocation Cascade',
      targetAsset: 'EV-002 (CobaltStrike C2 Capture)',
      icon: UserX,
      color: 'purple',
      description: 'Triggers revocation cascade for an identity DID. Verifies that role privileges are instantly zeroed, all active access leases invalidated, and asset operations blocked.',
      invariants: 'Revoked DID status terminates all downstream permissions across all nodes while preserving prior historical audit trail.'
    },
    {
      id: 'TEST_04',
      title: 'Test 04: Expired Temporary Access',
      category: 'Temporal Token Boundary',
      targetAsset: 'EV-003 (Domain Controller RAM Dump)',
      icon: Clock,
      color: 'blue',
      description: 'Simulates asset request using a time-bound lease whose validity duration has elapsed. Enforces temporal access cutoff.',
      invariants: 'Time-bound access leases automatically expire based on monotonically increasing timestamps without requiring manual revocation.'
    }
  ];

  const handleRunSingleTest = async (testId) => {
    setRunningTests(prev => ({ ...prev, [testId]: true }));
    try {
      const res = await runSecurityLabTest(testId);
      setTestResults(prev => ({ ...prev, [testId]: res }));
    } catch (err) {
      console.error(`Error running ${testId}:`, err);
    } finally {
      setRunningTests(prev => ({ ...prev, [testId]: false }));
    }
  };

  const handleRunAllTests = async () => {
    setIsRunningAll(true);
    for (const test of securityTests) {
      setRunningTests(prev => ({ ...prev, [test.id]: true }));
      try {
        const res = await runSecurityLabTest(test.id);
        setTestResults(prev => ({ ...prev, [test.id]: res }));
      } catch (e) {
        console.error(e);
      } finally {
        setRunningTests(prev => ({ ...prev, [test.id]: false }));
      }
      // Brief pause between tests for smooth UI progression
      await new Promise(r => setTimeout(r, 400));
    }
    setIsRunningAll(false);
  };

  const handleResetTest = (testId) => {
    if (testId === 'TEST_01') {
      toggleTamperSimulation(false, 'EV-001');
      toggleTamperSimulation(false, 'EV-DDXOEY');
    } else if (testId === 'TEST_03') {
      restoreRevokedIdentity('did:ethr:0xRevokedActor9999999999999999999999');
    }
    setTestResults(prev => {
      const copy = { ...prev };
      delete copy[testId];
      return copy;
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        title="HashGuard Security Lab"
        subtitle="Deterministic validation suite verifying the 4 core trust invariants: DETECTED → BLOCKED → AUDITED."
        breadcrumbs={['Dashboard', 'Security Lab']}
        badge={
          <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-md bg-rose-500/10 text-rose-400 border border-rose-500/30 flex items-center gap-1.5 uppercase tracking-wider">
            <FlaskConical className="w-3.5 h-3.5" />
            <span>SECURITY VALIDATION LAB</span>
          </span>
        }
      />

      {/* Control Banner */}
      <div className="p-5 rounded-2xl bg-ce-surface border border-ce-border flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-ce-brand" />
            <h2 className="text-sm font-mono font-bold text-ce-text-primary uppercase tracking-wider">
              Verification State Machine
            </h2>
          </div>
          <p className="text-xs text-ce-text-muted mt-1">
            Every test deterministically proves that unauthorized actions or corrupted payloads are identified, prohibited, and anchored to the audit ledger.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleRunAllTests}
            disabled={isRunningAll}
            className="px-4 py-2.5 text-xs font-mono font-bold rounded-xl bg-ce-brand text-ce-surface hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center gap-2"
          >
            {isRunningAll ? (
              <>
                <Activity className="w-4 h-4 animate-spin" />
                <span>Running Suite...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>Execute All 4 Security Tests</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* The 4 Test Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {securityTests.map((test) => {
          const Icon = test.icon;
          const result = testResults[test.id];
          const isRunning = runningTests[test.id];

          return (
            <div
              key={test.id}
              className={`p-6 rounded-2xl bg-ce-surface border transition-all flex flex-col justify-between ${
                result
                  ? 'border-emerald-500/40 bg-gradient-to-b from-emerald-950/10 to-ce-surface'
                  : 'border-ce-border'
              }`}
            >
              <div>
                {/* Top Card Info */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2.5 rounded-lg bg-ce-surface-subtle border border-ce-border text-ce-text-primary">
                      <Icon className="w-5 h-5 text-ce-brand" />
                    </div>
                    <div>
                      <span className="text-[10px] font-mono text-ce-text-muted uppercase tracking-wider block">
                        {test.category}
                      </span>
                      <h3 className="text-sm font-bold text-ce-text-primary font-mono">
                        {test.title}
                      </h3>
                    </div>
                  </div>

                  {result ? (
                    <span className="text-[10px] font-mono font-extrabold px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>VALIDATED</span>
                    </span>
                  ) : (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-ce-surface-subtle text-ce-text-muted border border-ce-border">
                      IDLE
                    </span>
                  )}
                </div>

                <p className="text-xs text-ce-text-muted leading-relaxed mb-4">
                  {test.description}
                </p>

                {/* Target & Invariant */}
                <div className="p-3 rounded-lg bg-ce-surface-subtle border border-ce-border space-y-1.5 text-xs font-mono mb-4">
                  <div>
                    <span className="text-ce-text-muted text-[10px] uppercase block tracking-wider">Target Specimen:</span>
                    <span className="text-ce-text-primary font-bold">{test.targetAsset}</span>
                  </div>
                  <div>
                    <span className="text-ce-text-muted text-[10px] uppercase block tracking-wider">Security Invariant:</span>
                    <span className="text-ce-text-secondary text-[11px] leading-relaxed block font-sans">
                      {test.invariants}
                    </span>
                  </div>
                </div>

                {/* Tri-State Visual Pipeline Indicator */}
                <div className="space-y-1.5 mb-4">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-ce-text-muted font-bold block">
                    Execution State Transition:
                  </span>
                  <div className="grid grid-cols-3 gap-1.5 text-center font-mono text-[10px]">
                    <div
                      className={`p-2 rounded border font-semibold ${
                        result
                          ? 'bg-amber-100 text-amber-950 border-amber-300 dark:bg-amber-500/20 dark:text-amber-300 dark:border-amber-500/40 font-bold'
                          : 'bg-ce-surface-subtle text-ce-text-muted border-ce-border'
                      }`}
                    >
                      1. DETECTED
                    </div>
                    <div
                      className={`p-2 rounded border font-semibold ${
                        result
                          ? 'bg-rose-100 text-rose-950 border-rose-300 dark:bg-rose-500/20 dark:text-rose-300 dark:border-rose-500/40 font-bold'
                          : 'bg-ce-surface-subtle text-ce-text-muted border-ce-border'
                      }`}
                    >
                      2. BLOCKED
                    </div>
                    <div
                      className={`p-2 rounded border font-semibold ${
                        result
                          ? 'bg-emerald-100 text-emerald-950 border-emerald-300 dark:bg-emerald-500/20 dark:text-emerald-300 dark:border-emerald-500/40 font-bold'
                          : 'bg-ce-surface-subtle text-ce-text-muted border-ce-border'
                      }`}
                    >
                      3. AUDITED
                    </div>
                  </div>
                </div>

                {/* Result Logs (if run) */}
                {result && (
                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono space-y-2.5 mb-4 shadow-inner">
                    <div className="flex items-center justify-between text-[11px] text-emerald-400 font-bold border-b border-slate-800/80 pb-2">
                      <span className="flex items-center gap-1.5">
                        <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Tri-State Guard Invariant Enforced</span>
                      </span>
                      <span className="px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/40 text-[9px]">
                        {result.badge}
                      </span>
                    </div>

                    <ul className="space-y-1.5 text-[11px]">
                      {result.steps?.map((st, idx) => (
                        <li key={idx} className="flex items-start gap-1.5 text-slate-200 leading-snug">
                          <span className="text-emerald-400 font-bold shrink-0">›</span>
                          <span>{st}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[10px]">
                      <span className="text-slate-400">Audit Reference:</span>
                      <span className="text-cyan-300 font-mono font-bold">{result.auditRef}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-2 border-t border-ce-border">
                <button
                  onClick={() => handleRunSingleTest(test.id)}
                  disabled={isRunning}
                  className="flex-1 py-2 text-xs font-mono font-bold rounded-lg bg-ce-surface-subtle hover:bg-ce-border text-ce-text-primary border border-ce-border transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50"
                >
                  {isRunning ? (
                    <>
                      <Activity className="w-3.5 h-3.5 animate-spin" />
                      <span>Executing...</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 text-ce-brand fill-current" />
                      <span>Run {test.title.split(':')[0]}</span>
                    </>
                  )}
                </button>

                {result && (
                  <button
                    onClick={() => handleResetTest(test.id)}
                    className="p-2 text-xs font-mono rounded-lg border border-ce-border hover:bg-ce-surface-subtle text-ce-text-muted hover:text-ce-text-primary transition-colors"
                    title="Reset Test State"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

