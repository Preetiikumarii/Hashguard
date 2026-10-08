import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { useApp } from '../../context/AppContext';
import { AlertOctagon, ShieldAlert, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const AppShell = () => {
  const { isTamperSimulated } = useApp();
  const [isMobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex h-screen bg-ce-bg text-ce-text-primary antialiased font-sans overflow-hidden">
      <Sidebar isMobileOpen={isMobileOpen} setMobileOpen={setMobileOpen} />
      
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Topbar setMobileOpen={setMobileOpen} />

        {/* Global Tamper Alert Banner when Tamper Simulation is active */}
        {isTamperSimulated && (
          <div className="bg-ce-danger/10 border-b border-ce-danger/30 px-6 py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-ce-danger animate-tamper-flash shrink-0 z-10">
            <div className="flex items-start sm:items-center gap-2.5">
              <ShieldAlert className="w-5 h-5 shrink-0 mt-0.5 sm:mt-0" />
              <div className="text-xs font-mono leading-relaxed">
                <span className="font-bold uppercase tracking-wider">
                  TAMPER DETECTED [Integrity Breach Simulation]:
                </span>{' '}
                Evidence <strong className="text-ce-text-primary">EV-001</strong> hash altered from{' '}
                <code className="text-ce-success bg-ce-success/10 px-1 rounded">8f3a91bc...91bc</code> to{' '}
                <code className="font-bold bg-ce-danger/20 px-1 rounded">7a21f9c8...c82e</code>. Custody seal compromised!
              </div>
            </div>
            <Link
              to="/verification"
              className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded bg-ce-danger text-white text-xs font-mono font-bold hover:bg-ce-danger/90 transition-colors shrink-0 shadow-sm"
            >
              <span>View Independent Verification</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}

        <main className="flex-1 overflow-y-auto w-full">
          <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto w-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};
