import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { PageHeader } from '../../components/layout/PageHeader';
import { LineageFlowGraph } from '../../components/lineage/LineageFlowGraph';
import { LoadingState } from '../../components/common/StateViews';
import { lineageService } from '../../services/lineageService';
import { evidenceService } from '../../services/evidenceService';
import { useApp } from '../../context/AppContext';

export const LineagePage = () => {
  const [searchParams] = useSearchParams();
  const queryId = (searchParams.get('id') || searchParams.get('evidenceId') || '').trim();
  const { isTamperSimulated, isSandboxMode, refreshTrigger } = useApp();
  const [graphData, setGraphData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadGraph() {
      setLoading(true);
      try {
        const allEv = await evidenceService.getAllEvidence();
        const rootId = queryId || (isSandboxMode ? 'EV-001' : (allEv && allEv[0]?.id ? allEv[0].id : null));
        const data = await lineageService.getLineageGraph(rootId);
        setGraphData(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadGraph();
  }, [queryId, refreshTrigger, isTamperSimulated, isSandboxMode]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Evidence Lineage & Derivation DAG"
        subtitle="View the derivation tree for forensic artifacts."
        breadcrumbs={['Dashboard', 'Evidence Lineage']}
        badge={
          <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-md bg-ce-brand/10 text-ce-brand border border-ce-brand/30">
            DIRECTED ACYCLIC GRAPH (DAG)
          </span>
        }
      />

      {/* Main Flow Graph */}
      {loading ? (
        <LoadingState message="Constructing multi-organization evidence lineage graph..." />
      ) : (
        <LineageFlowGraph initialGraph={graphData} />
      )}

      {/* Forensic Lineage Legend & Principles */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-md bg-ce-surface border border-ce-border shadow-sm">
          <div className="text-xs font-bold font-mono text-ce-brand uppercase tracking-wider mb-2">
            01. Root Seizure Anchor
          </div>
          <p className="text-xs text-ce-text-secondary leading-relaxed font-sans">
            The root node represents original off-chain raw evidence bitstream with an immutable SHA-256 seal anchored on-chain.
          </p>
        </div>

        <div className="p-4 rounded-md bg-ce-surface border border-ce-border shadow-sm">
          <div className="text-xs font-bold font-mono text-ce-success uppercase tracking-wider mb-2">
            02. Zero-Drift Derivations
          </div>
          <p className="text-xs text-ce-text-secondary leading-relaxed font-sans">
            Every child artifact (YARA rule, IOC set, reverse-engineering report) commits parent hash header in its signed manifest.
          </p>
        </div>

        <div className="p-4 rounded-md bg-ce-surface border border-ce-border shadow-sm">
          <div className="text-xs font-bold font-mono text-ce-blockchain uppercase tracking-wider mb-2">
            03. Independent Verifiability
          </div>
          <p className="text-xs text-ce-text-secondary leading-relaxed font-sans">
            Court auditors can verify the entire cryptographic proof lineage without needing physical access to sensitive raw payload files.
          </p>
        </div>
      </div>
    </div>
  );
};
