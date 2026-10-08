import React, { useState, useCallback, useMemo, useEffect } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { LineageCustomNode } from './LineageCustomNode';
import { LineageNodeDetailsDrawer } from './LineageNodeDetailsDrawer';
import { LineageVerificationModal } from './LineageVerificationModal';
import { DeriveArtifactModal } from './DeriveArtifactModal';
import { ShieldCheck, GitFork, RefreshCw, Info } from 'lucide-react';
import { lineageService } from '../../services/lineageService';
import { useApp } from '../../context/AppContext';

export const LineageFlowGraph = ({ initialGraph }) => {
  const { isTamperSimulated } = useApp();

  const nodeTypes = useMemo(
    () => ({
      lineageNode: LineageCustomNode,
    }),
    []
  );

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNode, setSelectedNode] = useState(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState(null);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [showDeriveModal, setShowDeriveModal] = useState(false);
  const [deriveParentNode, setDeriveParentNode] = useState(null);

  // Sync graph with tamper simulation
  useEffect(() => {
    if (initialGraph && initialGraph.nodes) {
      const updatedNodes = initialGraph.nodes.map((n) => {
        if (n.data.id === 'EV-001' && isTamperSimulated) {
          return {
            ...n,
            data: {
              ...n.data,
              verificationState: 'COMPROMISED',
              hash: '7a21f9c82e04192b47e301293840192830192840192830192830192830192830',
            },
          };
        }
        return n;
      });
      setNodes(updatedNodes);
      setEdges(initialGraph.edges || []);
    }
  }, [initialGraph, isTamperSimulated, setNodes, setEdges]);

  const onNodeClick = useCallback((event, node) => {
    setSelectedNode(node);
  }, []);

  const handleVerifyLineage = async () => {
    setIsVerifying(true);
    const targetId = initialGraph?.evidenceId || 'EV-001';
    try {
      const result = await lineageService.verifyLineageChain(targetId);
      setVerificationResult(result);
      setShowVerificationModal(true);
    } catch (err) {
      console.error(err);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleOpenDerive = (nodeData) => {
    setDeriveParentNode(nodeData);
    setShowDeriveModal(true);
  };

  const handleDerivedComplete = (res) => {
    setNodes((prev) => [...prev, res.node]);
    setEdges((prev) => [...prev, res.edge]);
    setSelectedNode(res.node);
  };

  return (
    <div className="relative w-full h-[640px] rounded-lg bg-ce-bg border border-ce-border overflow-hidden shadow-md">
      {/* Top Action Floating Toolbar */}
      <div className="absolute top-4 left-4 z-10 flex flex-wrap items-center gap-3 bg-ce-surface/90 backdrop-blur p-2.5 rounded-md border border-ce-border shadow-sm font-mono text-xs">
        <button
          onClick={handleVerifyLineage}
          disabled={isVerifying}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-md bg-ce-success hover:bg-ce-success-hover text-white font-bold transition-colors disabled:opacity-50 shadow-sm"
        >
          {isVerifying ? (
            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <ShieldCheck className="w-3.5 h-3.5" />
          )}
          <span>{isVerifying ? 'Verifying Hashes...' : 'Verify Lineage'}</span>
        </button>

        <button
          onClick={() => handleOpenDerive(nodes[0]?.data)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-ce-surface-subtle border border-ce-border text-ce-text-secondary hover:text-ce-text-primary hover:border-ce-brand/50 transition-colors"
        >
          <GitFork className="w-3.5 h-3.5" />
          <span>Derive Artifact</span>
        </button>

        <div className="hidden sm:flex items-center gap-2 pl-3 border-l border-ce-border text-ce-text-muted text-[11px]">
          <Info className="w-4 h-4 text-ce-brand" />
          <span>Click any node to inspect immutable derivation proofs</span>
        </div>
      </div>

      {/* React Flow Viewport */}
      {nodes.length === 0 ? (
        <div className="w-full h-full flex flex-col items-center justify-center bg-ce-bg p-6 text-center">
          <GitFork className="w-12 h-12 text-ce-text-muted mb-3 opacity-60" />
          <h3 className="text-sm font-bold font-mono text-ce-text-primary uppercase tracking-wider">No Lineage Tree Active</h3>
          <p className="text-xs text-ce-text-secondary mt-1.5 max-w-sm font-sans">
            Lineage DAG automatically maps root evidence exhibits and derived forensic artifacts. Ingest your first exhibit to begin.
          </p>
        </div>
      ) : (
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={onNodeClick}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{ padding: 0.2 }}
          minZoom={0.4}
          maxZoom={1.5}
          attributionPosition="bottom-left"
        >
          <Background color="#2a303c" gap={24} size={1} />
          <Controls showInteractive={false} className="bg-ce-surface text-ce-text-muted border-ce-border fill-ce-text-muted" />
          <MiniMap
            nodeColor={(n) => (n.data?.isRoot ? 'var(--color-brand)' : 'var(--color-success)')}
            maskColor="rgba(0, 0, 0, 0.7)"
            className="bg-ce-surface border border-ce-border rounded-md"
          />
        </ReactFlow>
      )}

      {/* Selected Node Details Drawer */}
      {selectedNode && (
        <LineageNodeDetailsDrawer
          node={selectedNode}
          onClose={() => setSelectedNode(null)}
          onDeriveFromNode={handleOpenDerive}
        />
      )}

      {/* Lineage Verification Modal */}
      <LineageVerificationModal
        isOpen={showVerificationModal}
        onClose={() => setShowVerificationModal(false)}
        verificationResult={verificationResult}
      />

      {/* Derive Child Artifact Modal */}
      <DeriveArtifactModal
        isOpen={showDeriveModal}
        onClose={() => setShowDeriveModal(false)}
        parentNode={deriveParentNode}
        onDerived={handleDerivedComplete}
      />
    </div>
  );
};
