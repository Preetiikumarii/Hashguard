import React, { useState, useEffect } from 'react';
import {
  Layers,
  Activity,
  ShieldCheck,
  Cpu,
  Boxes,
  Lock,
  Menu,
  X,
  ExternalLink,
  GitFork,
  FileSpreadsheet,
  Shield
} from 'lucide-react';
import { LogoIcon } from '../common/Logo';
import { ThemeToggle } from '../common/ThemeToggle';

export const ArchitectureNavbar = ({ activeSection = 'overview', onNavigate }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { id: 'overview', label: 'OVERVIEW' },
    { id: 'architecture', label: 'ARCHITECTURE' },
    { id: 'data-flow', label: 'DATA FLOW' },
    { id: 'trust-boundaries', label: 'TRUST BOUNDARIES' },
    { id: 'verification', label: 'VERIFICATION' },
    { id: 'lineage', label: 'LINEAGE' },
    { id: 'audit', label: 'AUDIT' },
    { id: 'security', label: 'SECURITY' },
    { id: 'tech-stack', label: 'TECH STACK' }
  ];

  const handleLinkClick = (id) => {
    if (onNavigate) {
      onNavigate(id);
    } else {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-[#040812]/92 border-b border-slate-800 shadow-lg shadow-slate-950/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
        {/* Brand & Live System Status */}
        <div className="flex items-center gap-3 shrink-0">
          <button 
            onClick={() => handleLinkClick('overview')}
            className="flex items-center gap-2.5 group cursor-pointer"
          >
            <div className="rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/40 p-1.5 shadow-[0_0_15px_rgba(6,182,212,0.25)] group-hover:border-cyan-400/80 transition-all">
              <LogoIcon className="w-5 h-5" />
            </div>
            <div className="leading-tight text-left">
              <span className="font-mono font-bold text-sm text-white tracking-wider block">
                HASH<span className="text-cyan-400">GUARD</span>
              </span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-mono text-[9px] text-slate-400 uppercase tracking-widest block">
                  SYSTEM MAP
                </span>
              </div>
            </div>
          </button>
        </div>

        {/* Center Desktop Navigation Links */}
        <nav className="hidden xl:flex items-center gap-1">
          {navLinks.map((link) => {
            const active = activeSection === link.id;
            return (
              <button
                key={link.id}
                onClick={() => handleLinkClick(link.id)}
                className={`px-2.5 py-1.5 rounded-md text-[11px] font-mono transition-all cursor-pointer whitespace-nowrap ${
                  active
                    ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 font-bold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent font-medium'
                }`}
              >
                {link.label}
              </button>
            );
          })}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <ThemeToggle size="sm" />

          <a
            href="https://sepolia.etherscan.io/address/0x3592925Cf64E7C3c68d4911b2ebC722c2Ea67052"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-cyan-400 to-sky-500 hover:from-cyan-300 hover:to-sky-400 text-slate-950 font-mono font-bold text-xs shadow-[0_0_18px_rgba(6,182,212,0.35)] transition-all cursor-pointer"
          >
            <span>Sepolia Contract</span>
            <ExternalLink className="w-3 h-3" />
          </a>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="xl:hidden p-2 rounded-lg border border-slate-800 bg-slate-900 text-slate-400 hover:text-white"
            aria-label="Toggle navigation"
          >
            {mobileMenuOpen ? <X className="w-4 h-4 text-cyan-400" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-t border-slate-800 bg-[#040812]/98 px-4 py-3 space-y-1 font-mono text-xs max-h-[80vh] overflow-y-auto">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => handleLinkClick(link.id)}
              className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer text-left"
            >
              <span>{link.label}</span>
              {activeSection === link.id && <span className="text-cyan-400">●</span>}
            </button>
          ))}
          <div className="pt-2 border-t border-slate-800">
            <a
              href="https://sepolia.etherscan.io/address/0x3592925Cf64E7C3c68d4911b2ebC722c2Ea67052"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2 rounded-lg bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 font-bold flex items-center justify-center gap-1.5"
            >
              <span>Sepolia Contract</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
