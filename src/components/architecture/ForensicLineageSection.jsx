import React, { useState } from 'react';
import {
  GitFork,
  HardDrive,
  FileCode,
  ShieldCheck,
  Search,
  KeyRound,
  FileSpreadsheet,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Maximize2
} from 'lucide-react';

export const ForensicLineageSection = () => {
  const [selectedNode, setSelectedNode] = useState('root');
  const [zoomLevel, setZoomLevel] = useState(1);

  const lineageNodes = [
    {
      id: 'root',
      step: '01',
      title: 'ROOT EVIDENCE (SEIZED DISK)',
      badge: 'Parent Exhibit',
      artifact: 'EV-2026-0891_sda.E01',
      hash: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
      analyst: 'Detective Sharma (LEA)',
      icon: HardDrive,
      color: 'blue',
      detail: 'Original raw forensic bitstream acquired using hardware write-blocker from suspect endpoint.'
    },
    {
      id: 'memory',
      step: '02',
      title: 'VOLATILE MEMORY DUMP',
      badge: 'Derived Child',
      artifact: 'memdump_win11_22h2.raw',
      hash: '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8',
      analyst: 'Dr. Sarah Lin (Forensic Lab)',
      icon: FileCode,
      color: 'cyan',
      detail: 'Extracted volatile RAM image acquired during live triage before endpoint cold shutdown.'
    },
    {
      id: 'extracted',
      step: '03',
      title: 'EXTRACTED INJECTED DLL',
      badge: 'Extracted Artifact',
      artifact: 'payload_beacon_x64.dll',
      hash: '4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a',
      analyst: 'Analyst K. Verma (Detonation Enclave)',
      icon: Search,
      color: 'indigo',
      detail: 'Malicious payload binary isolated from unmapped memory page via Volatility 3 malfind plugin.'
    },
    {
      id: 'analysis',
      step: '04',
      title: 'DISASSEMBLY & C2 TELEMETRY',
      badge: 'Analysis Result',
      artifact: 'c2_network_config.json',
      hash: 'ef2d127de37b942baad06145e54b0c619a1f22327b2ebbcfbec78f5564afe39d',
      analyst: 'Reverse Engineering Suite',
      icon: KeyRound,
      color: 'purple',
      detail: 'Extracted AES configuration block revealing hardcoded command-and-control IP endpoints.'
    },
    {
      id: 'derived',
      step: '05',
      title: 'DERIVED YARA IOC SIGNATURE',
      badge: 'Court Exhibit',
      artifact: 'APT_GhostBeacon_v2.yar',
      hash: '8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4',
      analyst: 'Court Custodian Registry',
      icon: ShieldCheck,
      color: 'emerald',
      detail: 'Forensic YARA detection signature produced as statutory court trial exhibit with cryptographic link to root.'
    }
  ];

  const current = lineageNodes.find(n => n.id === selectedNode) || lineageNodes[0];

  return (
    <section id="lineage" className="relative py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-800/80">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-[11px] font-mono font-bold text-cyan-400 uppercase tracking-widest">
              PROVENANCE CONTINUITY
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-mono font-black text-white">
            FORENSIC EVIDENCE LINEAGE DAG
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 font-sans mt-1 max-w-3xl">
            A cryptographically linked Directed Acyclic Graph (DAG) guaranteeing that secondary forensic extractions, decompilations, and YARA signatures trace unbroken back to the primary seized exhibit.
          </p>
        </div>

        {/* Zoom Controls */}
        <div className="flex items-center gap-1.5 p-1 rounded-lg bg-slate-900 border border-slate-800 font-mono text-xs text-slate-400">
          <button 
            onClick={() => setZoomLevel(prev => Math.max(0.8, prev - 0.1))} 
            className="p-1 hover:text-white rounded hover:bg-slate-800 cursor-pointer"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="px-2 text-[11px] text-cyan-300 font-bold">{Math.round(zoomLevel * 100)}%</span>
          <button 
            onClick={() => setZoomLevel(prev => Math.min(1.3, prev + 0.1))} 
            className="p-1 hover:text-white rounded hover:bg-slate-800 cursor-pointer"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button 
            onClick={() => setZoomLevel(1)} 
            className="p-1 hover:text-white rounded hover:bg-slate-800 cursor-pointer ml-1"
            title="Reset Zoom"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Forensic Lineage Tree Canvas */}
      <div className="p-6 rounded-2xl bg-[#030712]/95 border border-slate-800 shadow-[0_0_30px_rgba(6,182,212,0.06)] overflow-hidden">
        <div 
          className="transition-transform duration-300 origin-top-left"
          style={{ transform: `scale(${zoomLevel})` }}
        >
          {/* Vertical/Horizontal Tree Nodes */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3 relative">
            {lineageNodes.map((node, index) => {
              const Icon = node.icon;
              const isSelected = selectedNode === node.id;

              return (
                <div
                  key={node.id}
                  onClick={() => setSelectedNode(node.id)}
                  className={`group relative p-4 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-slate-900 border-cyan-400 shadow-[0_0_25px_rgba(6,182,212,0.25)] -translate-y-1'
                      : 'bg-slate-950/80 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/40'
                  }`}
                >
                  {/* Subtle Node Pulse Indicator */}
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-[9px] font-black text-cyan-400">
                      STEP {node.step}
                    </span>
                    <span className="flex h-2 w-2 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500" />
                    </span>
                  </div>

                  <div className="w-7 h-7 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center mb-2">
                    <Icon className="w-3.5 h-3.5" />
                  </div>

                  <span className="font-mono text-[10px] text-slate-400 uppercase font-semibold block">
                    {node.badge}
                  </span>
                  <h4 className="font-mono text-xs font-bold text-white mt-0.5 leading-snug">
                    {node.title}
                  </h4>
                  <p className="font-mono text-[10px] text-cyan-300 mt-2 truncate">
                    {node.artifact}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Lineage Node Deep Inspector */}
        <div className="mt-8 pt-6 border-t border-slate-800">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-800/80 gap-2 mb-4">
            <div className="flex items-center gap-2">
              <GitFork className="w-4 h-4 text-cyan-400" />
              <span className="font-mono text-xs font-bold text-white uppercase">
                CRYPTOGRAPHIC PROVENANCE INSPECTOR: {current.title}
              </span>
            </div>
            <span className="font-mono text-[11px] text-emerald-400">
              Parent-Child Cryptographic Link Validated
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
            <div className="p-3 rounded-lg bg-slate-900/90 border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase block mb-1">Artifact File</span>
              <span className="text-white font-bold">{current.artifact}</span>
              <span className="text-[10px] text-slate-400 block mt-1">Responsible: {current.analyst}</span>
            </div>

            <div className="p-3 rounded-lg bg-slate-900/90 border border-slate-800 md:col-span-2">
              <span className="text-[10px] text-slate-400 uppercase block mb-1">
                Parent-Child Binding SHA-256 Digest
              </span>
              <span className="text-cyan-300 text-[11px] break-all select-all block">
                {current.hash}
              </span>
              <p className="text-[11px] text-slate-400 font-sans mt-2">
                {current.detail}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
