import React, { useState } from 'react';
import {
  X,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowRight,
  Code2,
  Shield,
  Layers,
  Sparkles,
  ExternalLink,
  Lock,
  Boxes,
  Cpu,
  Fingerprint,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

export const ArchitectureDetailDrawer = ({ selectedNode, onClose }) => {
  const [openSection, setOpenSection] = useState({
    purpose: true,
    tech: true,
    security: true,
    flow: true,
    related: false
  });

  if (!selectedNode) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-6 text-center text-slate-400 bg-slate-900/40 border border-slate-800 rounded-2xl">
        <div className="w-12 h-12 rounded-xl bg-slate-800/80 border border-slate-700 flex items-center justify-center mb-3">
          <Layers className="w-6 h-6 text-cyan-400" />
        </div>
        <h4 className="text-sm font-mono font-bold text-white uppercase tracking-wider mb-1">
          Select an Architecture Node
        </h4>
        <p className="text-xs text-slate-400 max-w-xs font-sans">
          Click any component or flow block on the diagram to inspect its technical implementation, flow, and verification properties.
        </p>
      </div>
    );
  }

  const toggleSection = (sec) => {
    setOpenSection(prev => ({ ...prev, [sec]: !prev[sec] }));
  };

  const isImplemented = selectedNode.status === 'IMPLEMENTED';
  const isFuture = selectedNode.status === 'FUTURE EXTENSION';
  const isConceptual = selectedNode.status === 'CONCEPTUAL';

  return (
    <div className="h-full flex flex-col bg-[#030712] border border-slate-800 rounded-2xl overflow-hidden shadow-2xl animate-in fade-in slide-in-from-right-4 duration-200">
      {/* Drawer Header */}
      <div className="p-4 border-b border-slate-800/90 bg-slate-900/80 flex items-start justify-between gap-3 shrink-0">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono font-bold text-cyan-400 tracking-wider uppercase">
              LAYER {selectedNode.layerNumber || '00'}
            </span>
            <span
              className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-full border ${
                isImplemented
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                  : isFuture
                  ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                  : 'bg-slate-800 text-slate-400 border-slate-700'
              }`}
            >
              {isImplemented ? '✓ IMPLEMENTED' : isFuture ? 'FUTURE EXTENSION' : 'CONCEPTUAL'}
            </span>
          </div>
          <h3 className="text-base font-mono font-bold text-white leading-tight">
            {selectedNode.name}
          </h3>
          <p className="text-[11px] font-mono text-slate-400 mt-0.5">
            {selectedNode.badge}
          </p>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
            aria-label="Close component details"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Drawer Content Body with Expandable Sections */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 text-xs font-sans scrollbar-thin scrollbar-thumb-slate-800">
        {/* SECTION 1: PURPOSE */}
        <div className="rounded-xl border border-slate-800/80 bg-slate-900/40 overflow-hidden">
          <button
            onClick={() => toggleSection('purpose')}
            className="w-full p-3 flex items-center justify-between text-left font-mono font-bold text-cyan-400 text-xs hover:bg-slate-800/40 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Shield className="w-3.5 h-3.5" />
              <span>PURPOSE & FUNCTION</span>
            </div>
            {openSection.purpose ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
          {openSection.purpose && (
            <div className="p-3 pt-0 border-t border-slate-800/60 text-slate-300 leading-relaxed font-sans text-xs">
              {selectedNode.summary}
            </div>
          )}
        </div>

        {/* SECTION 2: TECHNOLOGY */}
        {selectedNode.technologies && selectedNode.technologies.length > 0 && (
          <div className="rounded-xl border border-slate-800/80 bg-slate-900/40 overflow-hidden">
            <button
              onClick={() => toggleSection('tech')}
              className="w-full p-3 flex items-center justify-between text-left font-mono font-bold text-blue-400 text-xs hover:bg-slate-800/40 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Cpu className="w-3.5 h-3.5" />
                <span>VERIFIED TECHNOLOGIES ({selectedNode.technologies.length})</span>
              </div>
              {openSection.tech ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
            {openSection.tech && (
              <div className="p-3 pt-0 border-t border-slate-800/60 space-y-1.5 font-mono text-[11px]">
                {selectedNode.technologies.map((t, idx) => (
                  <div key={idx} className="p-2 rounded bg-slate-900/90 border border-slate-800/80 flex items-center justify-between">
                    <span className="font-bold text-slate-200">{t.name}</span>
                    <span className="text-[10px] text-slate-400">{t.role}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* SECTION 3: SECURITY ROLE & RESPONSIBILITIES */}
        {selectedNode.responsibilities && selectedNode.responsibilities.length > 0 && (
          <div className="rounded-xl border border-slate-800/80 bg-slate-900/40 overflow-hidden">
            <button
              onClick={() => toggleSection('security')}
              className="w-full p-3 flex items-center justify-between text-left font-mono font-bold text-emerald-400 text-xs hover:bg-slate-800/40 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Lock className="w-3.5 h-3.5" />
                <span>SECURITY RESPONSIBILITIES</span>
              </div>
              {openSection.security ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
            {openSection.security && (
              <div className="p-3 pt-0 border-t border-slate-800/60 space-y-1 text-slate-300 font-sans text-xs">
                {selectedNode.responsibilities.map((r, idx) => (
                  <div key={idx} className="flex items-start gap-2 py-0.5">
                    <span className="text-emerald-400 mt-0.5">▪</span>
                    <span>{r}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* SECTION 4: DATA FLOW */}
        {selectedNode.flow && selectedNode.flow.length > 0 && (
          <div className="rounded-xl border border-slate-800/80 bg-slate-900/40 overflow-hidden">
            <button
              onClick={() => toggleSection('flow')}
              className="w-full p-3 flex items-center justify-between text-left font-mono font-bold text-purple-400 text-xs hover:bg-slate-800/40 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Layers className="w-3.5 h-3.5" />
                <span>DATA FLOW STAGES</span>
              </div>
              {openSection.flow ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
            {openSection.flow && (
              <div className="p-3 pt-0 border-t border-slate-800/60 space-y-1.5 font-mono text-[11px]">
                {selectedNode.flow.map((st, idx) => (
                  <div key={idx} className="flex items-start gap-2 p-1.5 rounded bg-slate-900/60 border border-slate-800/60">
                    <span className="w-4 h-4 rounded-full bg-purple-500/20 text-purple-400 font-bold flex items-center justify-center shrink-0 mt-0.5 text-[9px]">
                      {idx + 1}
                    </span>
                    <span className="text-slate-300">{st}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* SECTION 5: RELATED COMPONENTS & REPOSITORY ARTIFACTS */}
        {selectedNode.codeReferences && selectedNode.codeReferences.length > 0 && (
          <div className="rounded-xl border border-slate-800/80 bg-slate-900/40 overflow-hidden">
            <button
              onClick={() => toggleSection('related')}
              className="w-full p-3 flex items-center justify-between text-left font-mono font-bold text-slate-300 text-xs hover:bg-slate-800/40 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Code2 className="w-3.5 h-3.5 text-cyan-400" />
                <span>REPOSITORY CODE ARTIFACTS ({selectedNode.codeReferences.length})</span>
              </div>
              {openSection.related ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
            {openSection.related && (
              <div className="p-3 pt-0 border-t border-slate-800/60 space-y-1 font-mono text-[11px]">
                {selectedNode.codeReferences.map((ref, idx) => (
                  <div key={idx} className="p-1.5 rounded bg-black/60 border border-slate-800 text-cyan-300 break-all select-all">
                    {ref}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
