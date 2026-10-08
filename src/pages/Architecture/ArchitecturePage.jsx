import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogoIcon } from '../../components/common/Logo';
import { ThemeToggle } from '../../components/common/ThemeToggle';
import { useApp } from '../../context/AppContext';
import { TrustModelSection } from '../../components/architecture/TrustModelSection';
import { DataTrustSplitSection } from '../../components/architecture/DataTrustSplitSection';
import { AssetLifecycleSection } from '../../components/architecture/AssetLifecycleSection';
import { IndependentVerificationSection } from '../../components/architecture/IndependentVerificationSection';
import { TechnicalDeepDiveSection } from '../../components/architecture/TechnicalDeepDiveSection';
import {
  ArrowLeft,
  Layers,
  Activity,
  ShieldCheck,
  Cpu,
  Boxes,
  Lock,
  Zap,
  LogIn,
  Menu,
  X,
  ExternalLink,
  ChevronRight,
  GitFork,
  ArrowRightLeft
} from 'lucide-react';

export const ArchitecturePage = () => {
  const navigate = useNavigate();
  const { switchRole, setSandbox } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('trust-model');

  const token = localStorage.getItem('cee_auth_token');
  const isLoggedIn = Boolean(token);

  const launchSandbox = () => {
    if (switchRole) switchRole('FORENSIC_ANALYST');
    if (setSandbox) setSandbox(true);
    localStorage.setItem('cee_is_sandbox', 'true');
    const mockUser = {
      id: 'EVAL-001',
      email: 'analyst-lead@cyberlab.local',
      name: 'Lead Forensic Evaluator',
      organization_id: 'ORG_B',
      role: 'FORENSIC_ANALYST'
    };
    localStorage.setItem('cee_auth_token', 'mock_jwt_session_' + Date.now());
    localStorage.setItem('cee_user', JSON.stringify(mockUser));
    navigate('/dashboard');
  };

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setActiveSection(id);
    setMobileMenuOpen(false);
  };

  const navLinks = [
    { id: 'trust-model', label: '01. Trust Model', icon: Layers },
    { id: 'data-split', label: '02. Data/Trust Split', icon: ShieldCheck },
    { id: 'asset-lifecycle', label: '03. Asset Lifecycle', icon: GitFork },
    { id: 'verification', label: '04. Verification', icon: ShieldCheck },
    { id: 'deep-dive', label: '05. Technical Deep Dive', icon: Boxes },
  ];

  return (
    <div className="min-h-screen bg-ce-bg text-ce-text-primary font-sans relative overflow-x-hidden selection:bg-slate-900 selection:text-white dark:selection:bg-cyan-500/30 dark:selection:text-cyan-200 transition-colors duration-200">
      {/* Background Ambience & Fine Banknote Technical Grid */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="hidden dark:block absolute top-0 left-1/4 w-[700px] h-[450px] bg-cyan-500/5 rounded-full blur-[140px]" />
        <div className="hidden dark:block absolute top-1/3 right-0 w-[600px] h-[550px] bg-blue-600/5 rounded-full blur-[160px]" />
        <div className="hidden dark:block absolute bottom-20 left-1/3 w-[500px] h-[350px] bg-purple-500/4 rounded-full blur-[140px]" />
        <div className="absolute inset-0 bg-[radial-gradient(#0e1a2f_0.8px,transparent_0.8px)] [background-size:24px_24px] opacity-[0.05] dark:opacity-100 dark:bg-[linear-gradient(to_right,rgba(100,116,139,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(100,116,139,0.06)_1px,transparent_1px)] dark:[background-size:28px_28px]" />
      </div>

      {/* ─── STICKY TOPBAR / NAVBAR ─── */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-white/90 dark:bg-slate-950/90 border-b border-ce-border shadow-xs">
        <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 h-16 relative flex items-center justify-between gap-3">
          {/* Left: Return + Branding */}
          <div className="flex items-center gap-3 shrink-0 z-10">
            <button
              onClick={() => navigate(isLoggedIn ? '/dashboard' : '/')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-ce-border bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-950 text-xs font-mono transition-all cursor-pointer group shadow-xs dark:bg-slate-900 dark:text-slate-400 dark:hover:text-white"
              title="Return to HashGuard Application"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-slate-700 dark:text-cyan-400 group-hover:-translate-x-0.5 transition-transform" />
              <span className="hidden sm:inline font-semibold">
                {isLoggedIn ? '← Return to Console' : '← HashGuard Home'}
              </span>
              <span className="sm:hidden">Back</span>
            </button>

            <div className="hidden sm:block h-5 w-px bg-ce-border" />

            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="rounded-lg bg-slate-900 dark:bg-gradient-to-br dark:from-cyan-500/20 dark:to-blue-600/20 border border-slate-700 dark:border-cyan-500/40 p-1.5 shadow-xs dark:shadow-[0_0_15px_rgba(6,182,212,0.25)] transition-all">
                <LogoIcon className="w-5 h-5 text-white dark:text-cyan-400" />
              </div>
              <div className="leading-none">
                <span className="font-mono font-bold text-sm text-slate-950 dark:text-white tracking-wider">
                  HASH<span className="text-blue-700 dark:text-cyan-400">GUARD</span>
                </span>
                <span className="block font-mono text-[9px] text-slate-500 dark:text-slate-400 uppercase tracking-widest mt-0.5">
                  System Architecture Explorer
                </span>
              </div>
            </Link>
          </div>

          {/* Center: Absolute 5-Section Navigation (Mathematically Centered) */}
          <nav className="hidden lg:flex items-center gap-1.5 absolute left-1/2 -translate-x-1/2 z-0 pointer-events-auto">
            {navLinks.map((link) => {
              const active = activeSection === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => scrollTo(link.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer whitespace-nowrap ${
                    active
                      ? 'bg-slate-950 text-white font-bold shadow-xs dark:bg-cyan-500/20 dark:text-cyan-300 dark:border dark:border-cyan-500/30'
                      : 'text-slate-600 hover:text-slate-950 hover:bg-slate-100 border border-transparent dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800/60'
                  }`}
                >
                  <span>{link.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right: Actions */}
          <div className="flex items-center gap-2.5 shrink-0 ml-auto z-10">
            <ThemeToggle size="sm" />
            {isLoggedIn ? (
              <button
                onClick={() => navigate('/dashboard')}
                className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono font-bold text-xs shadow-[0_0_15px_rgba(6,182,212,0.4)] transition-all cursor-pointer"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Open Console</span>
              </button>
            ) : (
              <button
                onClick={launchSandbox}
                className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-cyan-400 to-sky-500 hover:from-cyan-300 hover:to-sky-400 text-slate-950 font-mono font-bold text-xs shadow-[0_0_15px_rgba(6,182,212,0.35)] transition-all cursor-pointer"
              >
                <Zap className="w-3.5 h-3.5 fill-slate-950" />
                <span>Launch Live App</span>
              </button>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg border border-ce-border bg-ce-surface text-ce-text-secondary hover:text-ce-text-primary dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400 dark:hover:text-white cursor-pointer"
              aria-label="Toggle navigation"
            >
              {mobileMenuOpen ? <X className="w-4 h-4 text-cyan-600 dark:text-cyan-400" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-ce-border bg-ce-surface/98 text-ce-text-primary dark:border-slate-800 dark:bg-[#030611]/98 px-4 py-3 space-y-1 font-mono text-xs shadow-lg">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => scrollTo(link.id)}
                className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-ce-surface-subtle text-ce-text-secondary hover:text-ce-text-primary dark:hover:bg-slate-800/80 dark:text-slate-300 dark:hover:text-white transition-colors cursor-pointer text-left"
              >
                <span>{link.label}</span>
                <ChevronRight className="w-3.5 h-3.5 text-ce-text-muted dark:text-slate-600" />
              </button>
            ))}
            <div className="pt-2 border-t border-ce-border dark:border-slate-800">
              <button
                onClick={isLoggedIn ? () => navigate('/dashboard') : launchSandbox}
                className="w-full py-2.5 rounded-lg bg-cyan-500/15 border border-cyan-500/30 text-cyan-700 dark:text-cyan-300 font-bold text-center"
              >
                {isLoggedIn ? 'Open Console' : 'Launch Evaluation Sandbox'}
              </button>
            </div>
          </div>
        )}
      </header>

      {/* ─── MAIN CONTENT: THE 5 REQUIRED ARCHITECTURAL SECTIONS ─── */}
      <main className="relative z-10">
        {/* SECTION 01 — TRUST MODEL & MAIN ARCHITECTURE MAP */}
        <TrustModelSection />

        {/* SECTION 02 — DATA / TRUST SPLIT */}
        <DataTrustSplitSection />

        {/* SECTION 03 — ASSET LIFECYCLE (HORIZONTAL CONNECTED TIMELINE) */}
        <AssetLifecycleSection />

        {/* SECTION 04 — INDEPENDENT VERIFICATION (PROGRESSIVE DISCLOSURE) */}
        <IndependentVerificationSection />

        {/* SECTION 05 — TECHNICAL DEEP DIVE (12 EXPANDABLE MODULES + TELEMETRY) */}
        <TechnicalDeepDiveSection />

        {/* ─── JURY FOOTER CALL-TO-ACTION ─── */}
        <section className="py-16 text-center max-w-4xl mx-auto px-4 border-t border-ce-border dark:border-slate-800/80">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-800 dark:bg-cyan-950/40 dark:text-cyan-300 font-mono text-[10px] font-bold tracking-wider uppercase mb-4">
            <span>READY FOR TECHNICAL DEFENSE &amp; JURY EVALUATION</span>
          </div>

          <h3 className="text-3xl sm:text-4xl font-extrabold text-ce-text-primary dark:text-white font-mono mb-3">
            Inspect the Live HashGuard Prototype
          </h3>
          <p className="text-xs sm:text-sm text-ce-text-secondary dark:text-slate-400 font-mono mb-8 max-w-xl mx-auto">
            "HASHGUARD gives a digital asset a verifiable trust history."
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={launchSandbox}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-cyan-400 to-sky-500 hover:from-cyan-300 hover:to-sky-400 text-slate-950 font-mono font-bold text-sm shadow-[0_0_25px_rgba(6,182,212,0.4)] transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Zap className="w-4 h-4 fill-slate-950" />
              <span>Launch Live Prototype (Forensic Analyst)</span>
            </button>
            <button
              onClick={() => navigate('/passport')}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-ce-surface hover:bg-ce-surface-subtle border border-ce-border text-ce-text-primary dark:bg-slate-900 dark:hover:bg-slate-800 dark:border-slate-700 dark:text-slate-200 font-mono font-bold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
            >
              <ShieldCheck className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
              <span>Inspect Trust Passport</span>
            </button>
          </div>
        </section>

        {/* ─── TECHNICAL FOOTER ─── */}
        <footer className="border-t border-ce-border bg-ce-surface py-10 font-mono text-xs text-ce-text-secondary dark:border-slate-800/80 dark:bg-[#02050f] dark:text-slate-400 transition-colors">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <LogoIcon className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
              <span className="text-ce-text-primary dark:text-white font-bold tracking-wider">
                HASH<span className="text-cyan-600 dark:text-cyan-400">GUARD</span>
              </span>
              <span className="text-ce-text-muted dark:text-slate-600">|</span>
              <span className="text-ce-text-secondary dark:text-slate-300">Verifiable Trust Infrastructure for Digital Assets</span>
            </div>

            <div className="flex items-center gap-4 text-[11px] flex-wrap justify-center">
              <a
                href="https://sepolia.etherscan.io/address/0x3592925Cf64E7C3c68d4911b2ebC722c2Ea67052"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-cyan-600 dark:hover:text-cyan-300 transition-colors flex items-center gap-1"
              >
                <span>Sepolia Contract (0x3592...)</span>
                <ExternalLink className="w-3 h-3" />
              </a>
              <span>•</span>
              <button
                onClick={() => navigate(isLoggedIn ? '/dashboard' : '/')}
                className="hover:text-cyan-600 dark:hover:text-cyan-300 transition-colors cursor-pointer"
              >
                ← Return to App
              </button>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
};
