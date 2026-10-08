import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, 
  ShieldAlert, 
  Lock, 
  Fingerprint, 
  GitFork, 
  ArrowRight, 
  Database, 
  Sparkles, 
  Eye, 
  Zap, 
  FileCheck2, 
  Clock, 
  AlertTriangle, 
  UserPlus, 
  LogIn, 
  ChevronRight, 
  PlayCircle, 
  Menu, 
  X,
  ExternalLink,
  Layers,
  Server,
  Activity,
  Boxes
} from 'lucide-react';
import { useApp, ROLES } from '../../context/AppContext';
import { Logo, LogoIcon } from '../../components/common/Logo';
import { ThemeToggle } from '../../components/common/ThemeToggle';
import { HeroEvidenceDiagram } from '../../components/landing/HeroEvidenceDiagram';
import { OnChainProofModal } from '../../components/landing/OnChainProofModal';
import { TamperBreachModal } from '../../components/landing/TamperBreachModal';
import { DemoWalkthroughModal } from '../../components/landing/DemoWalkthroughModal';

const SYSTEM_ARCHITECTURE_URL = 'https://hash-guard-system-achitecture.vercel.app/';

export const LandingPage = () => {
  const navigate = useNavigate();
  const { switchRole, setSandbox } = useApp();
  const [interactiveTampered, setInteractiveTampered] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [videoPlaying, setVideoPlaying] = useState(false);

  // Modals state
  const [onChainModalOpen, setOnChainModalOpen] = useState(false);
  const [tamperModalOpen, setTamperModalOpen] = useState(false);
  const [demoModalOpen, setDemoModalOpen] = useState(false);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  // Instant login helper for evaluators (Sandbox Mode)
  const launchConsole = (targetRole = 'ORG_B', targetPath = '/dashboard', isSandbox = true) => {
    const roleConfig = ROLES[targetRole] || ROLES.ORG_B;
    switchRole(targetRole);
    setSandbox(isSandbox);
    localStorage.setItem('cee_is_sandbox', isSandbox ? 'true' : 'false');

    const mockUser = {
      id: 'EVAL-001',
      email: targetRole === 'AUDITOR' ? 'auditor@cyber-audit.gov' : 'analyst-lead@cyberlab.local',
      name: isSandbox ? 'Lead Forensic Evaluator / Lead Auditor' : roleConfig.roleName,
      organization_id: targetRole || 'ORG_B',
      role: targetRole === 'AUDITOR' ? 'AUDITOR' : 'ADMIN'
    };

    localStorage.setItem('cee_auth_token', 'mock_jwt_session_' + Date.now());
    localStorage.setItem('cee_user', JSON.stringify(mockUser));
    navigate(targetPath);
  };

  const sampleOriginalHash = '8f3a91bc72f4cd2a4e9b671a5c28e930f1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6';
  const sampleTamperedHash = '759eee0f9d4163fe5422020789d7034a17bb14b747f648c8390e03b25437afaf';

  return (
    <div className="min-h-screen bg-ce-bg dark:bg-[#040812] text-slate-950 dark:text-slate-100 selection:bg-slate-900 selection:text-white dark:selection:bg-cyan-500/30 dark:selection:text-cyan-200 relative overflow-hidden font-sans transition-colors duration-200">
      {/* Background Ambience & Fine Technical Dot Grid */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="hidden dark:block absolute top-0 left-1/4 w-[700px] h-[550px] bg-cyan-500/10 rounded-full blur-[150px]" />
        <div className="hidden dark:block absolute top-1/3 right-10 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[170px]" />
        <div className="hidden dark:block absolute bottom-10 left-1/3 w-[600px] h-[400px] bg-emerald-500/5 rounded-full blur-[150px]" />
        <div 
          className="absolute inset-0 bg-[radial-gradient(#0e1a2f_0.8px,transparent_0.8px)] [background-size:24px_24px] opacity-[0.06] dark:opacity-[0.12] dark:bg-[radial-gradient(currentColor_1px,transparent_1px)] dark:[background-size:22px_22px]"
        />
      </div>

      {/* TOP NAVBAR */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-white/90 dark:bg-[#040812]/90 border-b border-slate-200/90 dark:border-slate-800/80 transition-all shadow-xs dark:shadow-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Logo Branding */}
          <Logo 
            size="md" 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} 
          />

          {/* Navigation Links (Desktop) */}
          <nav className="hidden lg:flex items-center gap-5 xl:gap-8 text-xs font-mono tracking-wider text-slate-700 dark:text-slate-300 shrink-0">
            <button 
              onClick={() => scrollToSection('evidence-flow')}
              className="hover:text-blue-900 dark:hover:text-cyan-400 transition-colors whitespace-nowrap cursor-pointer font-semibold"
            >
              Evidence Flow
            </button>
            <button 
              onClick={() => scrollToSection('demo-video')}
              className="hover:text-blue-900 dark:hover:text-cyan-400 transition-colors whitespace-nowrap cursor-pointer font-semibold"
            >
              Demo Video
            </button>
            <button 
              onClick={() => scrollToSection('tamper-testbed')}
              className="hover:text-blue-900 dark:hover:text-cyan-400 transition-colors whitespace-nowrap cursor-pointer font-semibold"
            >
              Tamper Testbed
            </button>
            <button 
              onClick={() => scrollToSection('roles')}
              className="hover:text-blue-900 dark:hover:text-cyan-400 transition-colors whitespace-nowrap cursor-pointer font-semibold"
            >
              Agency Roles
            </button>
            <button
              onClick={() => navigate('/architecture')}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-blue-50 text-blue-900 hover:text-blue-950 dark:bg-cyan-500/10 dark:text-cyan-400 dark:hover:text-cyan-300 border border-blue-200 dark:border-cyan-500/20 transition-all whitespace-nowrap cursor-pointer font-bold group shadow-xs"
            >
              <span>System Architecture</span>
              <Layers className="w-3 h-3 group-hover:scale-110 transition-transform" />
            </button>
          </nav>

          {/* Action CTAs + Theme Toggle */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <ThemeToggle size="sm" />

            <button
              onClick={() => navigate('/login')}
              className="hidden sm:flex px-3.5 py-1.5 rounded-lg border border-slate-200/90 dark:border-slate-700/80 bg-white dark:bg-[#091122] hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-900 dark:text-slate-300 hover:text-black dark:hover:text-white text-xs font-mono transition-all cursor-pointer items-center gap-1.5 shrink-0 whitespace-nowrap shadow-xs font-semibold"
            >
              <LogIn className="w-3.5 h-3.5 text-slate-600 dark:text-slate-400" />
              <span>Sign In / Register</span>
            </button>

            <button
              onClick={() => launchConsole('ORG_B', '/dashboard', true)}
              className="flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg bg-gradient-to-r from-cyan-400 to-sky-500 hover:from-cyan-300 hover:to-sky-400 text-slate-950 font-mono font-bold text-xs shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all cursor-pointer shrink-0 whitespace-nowrap group"
            >
              <Zap className="w-3.5 h-3.5 text-slate-950 fill-slate-950 group-hover:scale-110 transition-transform" />
              <span>Launch Evaluation Sandbox</span>
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900/70 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer shrink-0"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-cyan-500 dark:text-cyan-400" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 dark:border-slate-800/90 bg-white/98 dark:bg-[#040812]/98 backdrop-blur-xl px-4 py-4 space-y-3 shadow-2xl transition-all">
            <div className="flex flex-col space-y-1 text-xs font-mono uppercase tracking-wider">
              <button
                onClick={() => scrollToSection('evidence-flow')}
                className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer text-left"
              >
                <span>Evidence Flow</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
              </button>

              <button
                onClick={() => scrollToSection('demo-video')}
                className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer text-left"
              >
                <span>Demo Video</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
              </button>

              <button
                onClick={() => scrollToSection('tamper-testbed')}
                className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer text-left"
              >
                <span>Tamper Testbed</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
              </button>

              <button
                onClick={() => scrollToSection('roles')}
                className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer text-left"
              >
                <span>Agency Roles</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
              </button>

              <button
                onClick={() => navigate('/architecture')}
                className="flex items-center justify-between px-3 py-2 rounded-lg bg-blue-50 text-blue-900 dark:bg-cyan-500/10 dark:text-cyan-400 font-bold transition-colors cursor-pointer text-left"
              >
                <span>System Architecture</span>
                <Layers className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="pt-2 border-t border-slate-200 dark:border-slate-800/80 flex flex-col gap-2 font-mono">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigate('/login');
                }}
                className="w-full py-2 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs flex items-center justify-center gap-1.5"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In / Register</span>
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  launchConsole('ORG_B', '/dashboard', true);
                }}
                className="w-full py-2.5 rounded-lg bg-gradient-to-r from-cyan-400 to-sky-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-md"
              >
                <Zap className="w-3.5 h-3.5 fill-slate-950" />
                <span>Launch Evaluation Sandbox</span>
              </button>
            </div>
          </div>
        )}
      </header>

      {/* HERO SECTION */}
      <section className="relative z-10 pt-8 sm:pt-12 pb-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Headlines & Primary Actions */}
          <div className="lg:col-span-5 flex flex-col items-start text-left">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-blue-600/20 bg-blue-50 text-blue-900 dark:border-cyan-500/30 dark:bg-cyan-500/10 dark:text-cyan-400 text-xs font-mono mb-4 shadow-xs font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-700 dark:bg-cyan-400 animate-pulse" />
              <span className="tracking-wider">BLOCKCHAIN-ANCHORED DIGITAL FORENSICS</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-[40px] xl:text-[44px] font-black tracking-tight leading-[1.1] text-slate-950 dark:text-white">
              Digital Evidence<br />
              <span className="bg-gradient-to-r from-blue-700 via-indigo-600 to-cyan-600 dark:from-cyan-400 dark:via-sky-300 dark:to-blue-400 bg-clip-text text-transparent">
                That Stays True
              </span>
            </h1>

            {/* Subtitle */}
            <p className="mt-4 text-sm text-slate-600 dark:text-slate-400 max-w-sm leading-relaxed">
              Register, track, and verify digital evidence with
              cryptographic integrity and a complete chain of custody
              across organizations.
            </p>

            {/* Action Buttons */}
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button
                onClick={() => launchConsole('ORG_B', '/dashboard', true)}
                className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-cyan-400 to-sky-500 hover:from-cyan-300 hover:to-sky-400 text-slate-950 font-mono font-bold text-xs shadow-[0_0_22px_rgba(6,182,212,0.45)] transition-all flex items-center gap-2 cursor-pointer group"
              >
                <Zap className="w-3.5 h-3.5 text-slate-950 fill-slate-950 group-hover:scale-110 transition-transform" />
                <span>Launch Evaluation Sandbox</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </button>

              <button
                onClick={() => {
                  const el = document.getElementById('demo-video');
                  if (el) {
                    el.scrollIntoView({ behavior: 'smooth' });
                  } else {
                    setDemoModalOpen(true);
                  }
                }}
                className="px-4 py-2.5 rounded-lg border border-slate-200/90 dark:border-slate-700 text-slate-900 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white bg-white dark:bg-transparent hover:bg-slate-50 dark:hover:bg-slate-800 font-mono text-xs transition-all flex items-center gap-2 cursor-pointer shadow-xs font-semibold group"
              >
                <PlayCircle className="w-3.5 h-3.5 text-blue-700 group-hover:text-cyan-500 dark:text-cyan-400 transition-colors" />
                <span>Watch Demo (2 min)</span>
              </button>
            </div>
          </div>

          {/* Right Column: borderless hero illustration */}
          <div className="lg:col-span-7 flex items-center justify-end -mr-4 sm:-mr-6 lg:-mr-8">
            <div className="w-full">
              <HeroEvidenceDiagram 
                onOpenOnChainProof={() => setOnChainModalOpen(true)}
                onOpenTamperBreach={() => setTamperModalOpen(true)}
                onLaunchSandbox={launchConsole}
              />
            </div>
          </div>
        </div>
      </section>

      {/* 4 PROCESS STEP CARDS */}
      <section id="evidence-flow" className="relative z-10 pt-2 pb-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* CARD 01 */}
          <div 
            onClick={() => launchConsole('ORG_A', '/evidence', true)}
            className="p-4 pt-5 rounded-xl border border-slate-200/90 dark:border-slate-800/70 bg-white dark:bg-[#070e1c]/80 hover:border-blue-600 dark:hover:border-cyan-500/40 hover:shadow-premium shadow-card transition-all cursor-pointer group flex flex-col items-start gap-3"
          >
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono font-bold text-blue-700 dark:text-cyan-400">01</span>
              <h4 className="text-sm font-bold text-slate-950 dark:text-white">Register Evidence</h4>
            </div>
            <div className="w-full flex items-center justify-center flex-1 py-1">
              <img 
                src="/assets/step-01-register.png" 
                alt="Register Evidence"
                className="h-20 object-contain filter drop-shadow-[0_0_14px_rgba(6,182,212,0.3)] group-hover:scale-105 transition-transform"
              />
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-snug font-medium">Upload &amp; cryptographically seal forensic exhibits</p>
          </div>

          {/* CARD 02 */}
          <div 
            onClick={() => launchConsole('ORG_B', '/transfers', true)}
            className="p-4 pt-5 rounded-xl border border-slate-200/90 dark:border-slate-800/70 bg-white dark:bg-[#070e1c]/80 hover:border-blue-600 dark:hover:border-cyan-500/40 hover:shadow-premium shadow-card transition-all cursor-pointer group flex flex-col items-start gap-3"
          >
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono font-bold text-blue-700 dark:text-cyan-400">02</span>
              <h4 className="text-sm font-bold text-slate-950 dark:text-white">Track Custody</h4>
            </div>
            <div className="w-full flex items-center justify-center flex-1 py-1">
              <img 
                src="/assets/step-02-custody.png" 
                alt="Track Custody"
                className="h-20 object-contain filter drop-shadow-[0_0_14px_rgba(6,182,212,0.3)] group-hover:scale-105 transition-transform"
              />
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-snug font-medium">Monitor inter-agency transfers in real time</p>
          </div>

          {/* CARD 03 */}
          <div 
            onClick={() => launchConsole('ORG_B', '/lineage', true)}
            className="p-4 pt-5 rounded-xl border border-slate-200/90 dark:border-slate-800/70 bg-white dark:bg-[#070e1c]/80 hover:border-blue-600 dark:hover:border-cyan-500/40 hover:shadow-premium shadow-card transition-all cursor-pointer group flex flex-col items-start gap-3"
          >
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono font-bold text-blue-700 dark:text-cyan-400">03</span>
              <h4 className="text-sm font-bold text-slate-950 dark:text-white">Verify Lineage</h4>
            </div>
            <div className="w-full flex items-center justify-center flex-1 py-1">
              <img 
                src="/assets/step-03-lineage.png" 
                alt="Verify Lineage"
                className="h-20 object-contain filter drop-shadow-[0_0_14px_rgba(6,182,212,0.3)] group-hover:scale-105 transition-transform"
              />
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-snug font-medium">Inspect artifact trees and parent derivations</p>
          </div>

          {/* CARD 04 */}
          <div 
            onClick={() => launchConsole('AUDITOR', '/verification', true)}
            className="p-4 pt-5 rounded-xl border border-slate-200/90 dark:border-slate-800/70 bg-white dark:bg-[#070e1c]/80 hover:border-blue-600 dark:hover:border-cyan-500/40 hover:shadow-premium shadow-card transition-all cursor-pointer group flex flex-col items-start gap-3"
          >
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono font-bold text-blue-700 dark:text-cyan-400">04</span>
              <h4 className="text-sm font-bold text-slate-950 dark:text-white">Maintain Trust</h4>
            </div>
            <div className="w-full flex items-center justify-center flex-1 py-1">
              <img 
                src="/assets/step-04-trust.png" 
                alt="Maintain Trust"
                className="h-20 object-contain filter drop-shadow-[0_0_14px_rgba(6,182,212,0.3)] group-hover:scale-105 transition-transform"
              />
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-snug font-medium">Support legal, audit, and judicial oversight</p>
          </div>
        </div>
      </section>

      {/* PLATFORM DEMO VIDEO SHOWCASE SECTION */}
      <section id="demo-video" className="relative z-10 py-12 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-mono text-xs font-bold mb-3 shadow-[0_0_15px_rgba(6,182,212,0.15)]">
            <PlayCircle className="w-3.5 h-3.5" />
            <span>PLATFORM DEMO VIDEO</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            See HashGuard in Action
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-mono">
            Watch the full walkthrough of cryptographic evidence sealing, inter-agency custody transfers, and zero-trust independent verification.
          </p>
        </div>

        {/* Video Player Card */}
        <div className="relative rounded-2xl bg-gradient-to-b from-slate-900 via-[#070e1c] to-[#040812] border border-cyan-500/40 p-2 sm:p-4 shadow-[0_0_50px_rgba(6,182,212,0.2)] overflow-hidden">
          {/* Top Bar / Terminal style header */}
          <div className="flex items-center justify-between px-3 py-2 border-b border-slate-800/90 mb-3 bg-slate-950/60 rounded-t-xl">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
              <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
              <span className="text-[11px] font-mono text-slate-400 ml-2">hashguard-demo-walkthrough.mp4</span>
            </div>
            <div className="flex items-center gap-2 text-[10px] font-mono text-cyan-400">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              <span>OFFICIAL PRODUCT DEMO</span>
            </div>
          </div>

          {/* YouTube Video Embed with Custom Product Demo Thumbnail */}
          <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-slate-950 border border-slate-800/80 shadow-inner group">
            {videoPlaying ? (
              <iframe
                className="w-full h-full"
                src="https://www.youtube-nocookie.com/embed/jQ7otleJOcU?autoplay=1&rel=0&modestbranding=1"
                title="HashGuard - Cyber Evidence Exchange Platform Demo"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            ) : (
              <div
                onClick={() => setVideoPlaying(true)}
                className="relative w-full h-full cursor-pointer overflow-hidden flex items-center justify-center select-none"
              >
                <img
                  src="/assets/video-thumbnail.jpg"
                  alt="HashGuard Demonstration Video Thumbnail"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.015]"
                />
                {/* Subtle vignette on hover */}
                <div className="absolute inset-0 bg-slate-950/15 group-hover:bg-transparent transition-colors duration-300" />
                
                {/* Corner indicator badge */}
                <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 px-3 py-1.5 rounded-lg bg-slate-950/85 backdrop-blur-md border border-slate-700/80 text-xs font-mono text-slate-200 flex items-center gap-2 shadow-lg group-hover:border-cyan-500/50 transition-colors">
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                  <span>Click anywhere to play demo</span>
                </div>
              </div>
            )}
          </div>

          {/* Quick Info & Sandbox CTA Below Video */}
          <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 px-2">
            <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>Demonstration covers: Seizure • Sealing • Lineage DAG • Adversarial Tamper Containment</span>
            </div>
            <div className="flex items-center gap-2.5">
              <button
                onClick={() => setDemoModalOpen(true)}
                className="px-3.5 py-2 rounded-lg border border-slate-700 bg-slate-800/60 hover:bg-slate-700 text-slate-300 hover:text-white font-mono text-xs transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <span>4-Stage Breakdown</span>
              </button>
              <button
                onClick={() => launchConsole('ORG_B', '/dashboard', true)}
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-400 to-sky-500 hover:from-cyan-300 hover:to-sky-400 text-slate-950 font-mono font-bold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
              >
                <Zap className="w-3.5 h-3.5 fill-slate-950" />
                <span>Launch Sandbox</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* LIVE 1-BIT ADVERSARIAL TAMPER TESTBED */}
      <section id="tamper-testbed" className="relative z-10 py-12 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#080e1c] border border-slate-800 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-xl">
          {/* Header */}
          <div className="bg-slate-900/90 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-rose-500/80" />
              <div className="w-3 h-3 rounded-full bg-amber-500/80" />
              <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
              <span className="text-xs font-mono text-slate-400 ml-2">hashguard-tamper-containment.soc</span>
            </div>
            <div className="flex items-center gap-1.5 bg-slate-950 px-2.5 py-1 rounded border border-slate-800 text-[11px] font-mono text-cyan-400">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
              <span>LIVE INTEGRITY TESTBED</span>
            </div>
          </div>

          <div className="p-6 md:p-8 space-y-6">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Live 1-Bit Adversary Tamper Demonstration
              </h3>
              <p className="text-xs text-slate-400 font-mono leading-relaxed">
                Simulate an adversary modifying a single byte in off-chain evidence storage. Observe how on-chain mathematical invariants instantly trigger an automated breach containment revert.
              </p>
            </div>

            {/* Interactive Specimen Box */}
            <div className={`p-5 rounded-xl border transition-all ${
              interactiveTampered 
                ? 'bg-rose-950/20 border-rose-500/50 shadow-[0_0_30px_rgba(244,63,94,0.2)]' 
                : 'bg-slate-900/50 border-slate-800'
            }`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
                <div>
                  <span className="text-xs font-mono text-slate-400">Target Exhibit: </span>
                  <span className="text-xs font-mono font-bold text-white">EV-001 (LockBit 3.0 Ransomware Encryptor Payload - 4.2 GB)</span>
                </div>
                <button
                  onClick={() => setInteractiveTampered(!interactiveTampered)}
                  className={`px-4 py-2 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-2 ${
                    interactiveTampered
                      ? 'bg-rose-500 hover:bg-rose-400 text-white shadow-lg shadow-rose-500/30'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                  }`}
                >
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>{interactiveTampered ? 'Reset to Clean State' : '🚨 Simulate 1-Bit Tamper'}</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 text-xs font-mono">
                {/* On-Chain Sealed Hash */}
                <div className="p-3.5 bg-slate-950 rounded-lg border border-slate-800/80">
                  <div className="text-slate-500 uppercase tracking-wider text-[10px]">On-Chain Sealed Cryptographic Root:</div>
                  <div className="text-emerald-400 font-bold break-all mt-1">{sampleOriginalHash}</div>
                  <div className="text-[10px] text-slate-500 mt-1">Immutable Root Sealed in Block #1845201</div>
                </div>

                {/* Off-Chain Computed Hash */}
                <div className={`p-3.5 bg-slate-950 rounded-lg border ${interactiveTampered ? 'border-rose-500/60' : 'border-slate-800/80'}`}>
                  <div className="text-slate-500 uppercase tracking-wider text-[10px]">Current Off-Chain Specimen Hash:</div>
                  <div className={`font-bold break-all mt-1 ${interactiveTampered ? 'text-rose-400 animate-pulse' : 'text-emerald-400'}`}>
                    {interactiveTampered ? sampleTamperedHash : sampleOriginalHash}
                  </div>
                  <div className={`text-[10px] mt-1 font-bold ${interactiveTampered ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {interactiveTampered ? '✕ INTEGRITY MISMATCH DETECTED: SMART CONTRACT REVERT' : '✓ 100% BIT-LEVEL MATCH CONFIRMED'}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 border-t border-slate-800/80">
              <span className="text-xs text-slate-400 font-mono">
                Adversary modified byte 0x00FF in off-chain disk image. WebCrypto recomputation triggers immediate smart contract revert.
              </span>
              <button
                onClick={() => launchConsole('AUDITOR', '/verification', true)}
                className="px-5 py-2.5 rounded-lg bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-mono font-bold text-xs transition-all cursor-pointer flex items-center gap-2 shadow-md shrink-0"
              >
                <span>Test Live Verification in Sandbox</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* THE FORENSIC CHALLENGE: LEGACY VS HASHGUARD */}
      <section id="challenge" className="relative z-10 py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-slate-200 dark:border-slate-800/80">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-xs font-mono uppercase tracking-widest text-cyan-600 dark:text-cyan-400 font-semibold mb-2">The Forensic Challenge</h2>
          <h3 className="text-2xl sm:text-4xl font-extrabold text-slate-950 dark:text-white">Why Existing Chain-of-Custody Fails in Court</h3>
          <p className="mt-3 text-sm text-slate-600 dark:text-slate-400 font-sans">
            Cross-organization evidence transfers between law enforcement, CERT teams, defense labs, and courts remain vulnerable to tampering disputes and lack of mathematical provenance.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Traditional */}
          <div className="p-6 rounded-2xl bg-rose-50/70 dark:bg-rose-950/10 border border-rose-200 dark:border-rose-900/30 space-y-4 shadow-card">
            <div className="flex items-center gap-2 text-rose-800 dark:text-rose-400 font-mono text-xs uppercase font-bold">
              <ShieldAlert className="w-4 h-4 text-rose-700 dark:text-rose-400" />
              <span>Legacy Custody Process (Vulnerable)</span>
            </div>
            <ul className="space-y-3 text-xs text-slate-800 dark:text-slate-300 font-mono">
              <li className="flex items-start gap-2">
                <span className="text-rose-600 font-bold">✕</span>
                <span>Paper forms and spreadsheets easily edited or forged post-seizure.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-600 font-bold">✕</span>
                <span>Derivative malware decompilations lack cryptographic parent linkage.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-600 font-bold">✕</span>
                <span>Transfers over insecure FTP or cloud shares risk MITM substitution.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-600 font-bold">✕</span>
                <span>Defense attorneys contest bit integrity due to lack of independent audit logs.</span>
              </li>
            </ul>
          </div>

          {/* HashGuard Solution */}
          <div className="p-6 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/10 border border-emerald-300 dark:border-emerald-500/30 space-y-4 shadow-card dark:shadow-[0_0_25px_rgba(16,185,129,0.08)]">
            <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-400 font-mono text-xs uppercase font-bold">
              <ShieldCheck className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
              <span>HashGuard Protocol (Cryptographic Proof)</span>
            </div>
            <ul className="space-y-3 text-xs text-slate-800 dark:text-slate-300 font-mono">
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold">✓</span>
                <span>Deterministic SHA-256 bit digests locked to append-only blockchain blocks.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold">✓</span>
                <span>Directed Acyclic Graph (DAG) records parent-to-child forensic lineage.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold">✓</span>
                <span>mTLS encrypted transfers with dual-signed cryptographic transfer manifests.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold">✓</span>
                <span>1-click Section 65B certified evidence dossiers with full block verification proofs.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* SYSTEM ARCHITECTURE TEASER CARD */}
      <section id="architecture" className="relative z-10 py-16 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-slate-200/90 dark:border-slate-800/80">
        <div className="p-8 rounded-2xl bg-gradient-to-br from-slate-900 via-[#070e1c] to-[#0c1324] text-white border border-cyan-500/40 shadow-2xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs uppercase font-bold">
                <Layers className="w-4 h-4 text-cyan-400" />
                <span>4-TIER SECURITY BLUEPRINT</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white mt-1">Enterprise System Architecture</h3>
              <p className="text-xs text-slate-400 font-mono mt-1">
                Air-Gapped Off-Chain Enclaves • EVM Smart Contracts • Permissioned Consensus
              </p>
            </div>
            <button
              onClick={() => navigate('/architecture')}
              className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-cyan-400 to-sky-500 hover:from-cyan-300 hover:to-sky-400 text-slate-950 font-mono font-bold text-xs transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)] cursor-pointer flex items-center gap-2 self-start sm:self-auto shrink-0 group"
            >
              <span>Explore Detailed Architecture</span>
              <Layers className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
            </button>
          </div>

          {/* 4 Tier Overview Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 font-mono text-xs">
            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
              <span className="text-[10px] text-cyan-400 font-bold">TIER 01</span>
              <h5 className="font-bold text-white text-sm">Client Tier</h5>
              <p className="text-slate-400 text-[11px] leading-relaxed font-sans">
                Deterministic client-side WebCrypto SHA-256 hashing. Zero raw payload transmission before sealing.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
              <span className="text-[10px] text-blue-400 font-bold">TIER 02</span>
              <h5 className="font-bold text-white text-sm">Storage Enclave</h5>
              <p className="text-slate-400 text-[11px] leading-relaxed font-sans">
                Air-gapped MinIO S3 object storage with AES-256-GCM envelope encryption isolating multi-GB disk images.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
              <span className="text-[10px] text-purple-400 font-bold">TIER 03</span>
              <h5 className="font-bold text-white text-sm">Custody Engine</h5>
              <p className="text-slate-400 text-[11px] leading-relaxed font-sans">
                Solidity smart contracts executing on EVM. Enforces custody handoffs and parent-child derivation DAGs.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
              <span className="text-[10px] text-emerald-400 font-bold">TIER 04</span>
              <h5 className="font-bold text-white text-sm">Consensus &amp; Audit</h5>
              <p className="text-slate-400 text-[11px] leading-relaxed font-sans">
                Permissioned validator nodes with zero-knowledge proof verification and Section 65B court attestation exports.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* MULTI-AGENCY STAKEHOLDER ROLES */}
      <section id="roles" className="relative z-10 py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-slate-200/90 dark:border-slate-800/80">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-xs font-mono uppercase tracking-widest text-blue-700 dark:text-cyan-400 font-bold mb-2">Role-Based Access Control</h2>
          <h3 className="text-2xl sm:text-4xl font-extrabold text-slate-950 dark:text-white">Role-Based Evidence Governance</h3>
          <p className="mt-3 text-sm text-slate-600 dark:text-slate-400 max-w-2xl mx-auto font-sans">
            Distinct tenant boundaries isolate agency evidence stores, while on-chain smart contract roles govern operational permissions. Select a persona below to enter the evaluation sandbox with pre-configured credentials.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {/* Role 1: CERT-Alpha */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/70 border border-slate-200/90 dark:border-slate-800 hover:border-blue-500/40 shadow-card hover:shadow-premium transition-all flex flex-col justify-between">
            <div className="space-y-3">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-50 text-blue-800 dark:bg-blue-500/10 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20 font-bold uppercase">
                ORGANIZATION A
              </span>
              <h4 className="text-base font-bold text-slate-950 dark:text-white">CERT-Alpha (Collector)</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-sans">
                Initial seizure of disk images, memory dumps, and network logs. Performs bit-level hashing, cryptographic signing, and mTLS dispatch.
              </p>
            </div>
            <button
              onClick={() => launchConsole('ORG_A', '/evidence', true)}
              className="mt-6 w-full py-2.5 rounded-lg bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-800 dark:bg-blue-500/10 dark:hover:bg-blue-500/20 dark:border-blue-500/30 dark:text-blue-300 text-xs font-mono font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              <span>Launch as CERT-Alpha</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Role 2: Cyber Defense Lab */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/70 border border-blue-500/40 dark:border-cyan-500/40 shadow-premium ring-1 ring-blue-500/20 dark:ring-transparent flex flex-col justify-between">
            <div className="space-y-3">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-50 text-blue-900 dark:bg-cyan-500/10 dark:text-cyan-400 border border-blue-200 dark:border-cyan-500/20 font-bold uppercase">
                ORGANIZATION B (RECOMMENDED ENTRY)
              </span>
              <h4 className="text-base font-bold text-slate-950 dark:text-white">Cyber Defense Lab (Analyst)</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-sans">
                Receipt verification, air-gapped sandboxing, artifact derivation, dynamic execution, and child report generation.
              </p>
            </div>
            <button
              onClick={() => launchConsole('ORG_B', '/dashboard', true)}
              className="mt-6 w-full py-2.5 rounded-lg bg-gradient-to-r from-cyan-400 to-sky-500 hover:from-cyan-300 hover:to-sky-400 text-slate-950 text-xs font-mono font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-md"
            >
              <span>Launch as Forensic Analyst (Recommended)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Role 3: Independent Auditor */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/70 border border-slate-200/90 dark:border-slate-800 hover:border-emerald-500/40 shadow-card hover:shadow-premium transition-all flex flex-col justify-between">
            <div className="space-y-3">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 dark:bg-emerald-500/10 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20 font-bold uppercase">
                INDEPENDENT AUDITOR
              </span>
              <h4 className="text-base font-bold text-slate-950 dark:text-white">National Cyber Audit Board</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-sans">
                Independent cryptographic verification of custody ledger and artifact lineage without raw file exposure. Exports Section 65B legal certificates.
              </p>
            </div>
            <button
              onClick={() => launchConsole('AUDITOR', '/verification', true)}
              className="mt-6 w-full py-2.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 dark:bg-emerald-500/10 dark:hover:bg-emerald-500/20 dark:border-emerald-500/30 dark:text-emerald-300 text-xs font-mono font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              <span>Launch as Auditor</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* BOTTOM CTA BANNER */}
      <section className="relative z-10 py-16 text-center max-w-4xl mx-auto px-4">
        <h3 className="text-2xl sm:text-4xl font-extrabold text-slate-950 dark:text-white">
          Ready to Inspect the Evidence Ledger?
        </h3>
        <p className="mt-4 text-sm text-slate-600 dark:text-slate-400 font-mono">
          Interactive evaluator sandbox configured. Zero installation required.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => launchConsole('ORG_B', '/dashboard', true)}
            className="px-8 py-4 rounded-xl bg-gradient-to-r from-cyan-400 to-sky-500 hover:from-cyan-300 hover:to-sky-400 text-slate-950 font-mono font-bold text-sm shadow-[0_0_30px_rgba(6,182,212,0.4)] transition-all flex items-center gap-2 cursor-pointer"
          >
            <Zap className="w-5 h-5 text-slate-950 fill-slate-950" />
            <span>Launch Evaluation Sandbox</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => navigate('/login')}
            className="px-6 py-4 rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-300 font-mono font-bold text-sm transition-all flex items-center gap-2 cursor-pointer shadow-card"
          >
            <UserPlus className="w-4 h-4 text-blue-700 dark:text-cyan-400" />
            <span>Sign In / Agency Register</span>
          </button>
        </div>
      </section>

      {/* ENTERPRISE FOOTER */}
      <footer className="relative z-10 border-t border-slate-200/90 dark:border-slate-800/80 bg-white/90 dark:bg-[#03060e]/90 py-10 font-mono text-xs text-slate-600 dark:text-slate-400 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <LogoIcon className="w-5 h-5 text-blue-700 dark:text-cyan-400" />
            <span className="text-slate-950 dark:text-white font-bold tracking-wider">HASH<span className="text-blue-700 dark:text-cyan-400">GUARD</span></span>
            <span className="text-slate-300 dark:text-slate-600">|</span>
            <span className="text-slate-600 dark:text-slate-400">Cyber Evidence Exchange Platform</span>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-slate-500 flex-wrap">
            <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Local EVM Nodes Synced</span>
            </span>
            <span>•</span>
            <span>NIST SP 800-86</span>
            <span>•</span>
            <span>Section 65B Admissibility</span>
            <span>•</span>
            <span>ISO/IEC 27037</span>
          </div>
        </div>
      </footer>

      {/* INTERACTIVE MODALS */}
      <OnChainProofModal 
        isOpen={onChainModalOpen} 
        onClose={() => setOnChainModalOpen(false)}
        onLaunchSandbox={launchConsole}
      />

      <TamperBreachModal 
        isOpen={tamperModalOpen} 
        onClose={() => setTamperModalOpen(false)}
        onLaunchSandbox={launchConsole}
        onScrollToTamperEngine={() => scrollToSection('tamper-testbed')}
      />

      <DemoWalkthroughModal 
        isOpen={demoModalOpen} 
        onClose={() => setDemoModalOpen(false)}
        onLaunchSandbox={launchConsole}
      />
    </div>
  );
};
