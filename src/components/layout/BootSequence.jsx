import React, { useState, useEffect } from 'react';
import { LogoIcon } from '../common/Logo';

export const BootSequence = ({ onComplete }) => {
  const [isFading, setIsFading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("Authenticating...");

  useEffect(() => {
    const statuses = [
      "Authenticating Secure Enclave...",
      "Initializing HASHGUARD Protocol...",
      "Synchronizing Distributed Ledger...",
      "System Online"
    ];
    
    let currentStep = 0;
    
    // Smooth progress bar simulation
    const startTime = Date.now();
    const duration = 1800; // Snappy loading time for evaluations
    
    const animateProgress = () => {
      const elapsed = Date.now() - startTime;
      const percentage = Math.min((elapsed / duration) * 100, 100);
      
      setProgress(percentage);
      
      if (percentage < 25) {
        if (currentStep !== 0) { currentStep = 0; setStatus(statuses[0]); }
      } else if (percentage < 60) {
        if (currentStep !== 1) { currentStep = 1; setStatus(statuses[1]); }
      } else if (percentage < 90) {
        if (currentStep !== 2) { currentStep = 2; setStatus(statuses[2]); }
      } else {
        if (currentStep !== 3) { currentStep = 3; setStatus(statuses[3]); }
      }

      if (percentage < 100) {
        requestAnimationFrame(animateProgress);
      } else {
        setTimeout(() => {
          setIsFading(true);
          setTimeout(onComplete, 1200);
        }, 800);
      }
    };
    
    requestAnimationFrame(animateProgress);
    
  }, [onComplete]);

  return (
    <div className={`fixed inset-0 z-50 bg-[#020617] flex flex-col items-center justify-center transition-opacity duration-1000 ${isFading ? 'opacity-0' : 'opacity-100'}`}>
      
      {/* Ultra-subtle background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-600/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center">
        
        {/* Minimal Logo */}
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-cyan-400/25 blur-2xl rounded-full animate-pulse" />
          <LogoIcon className="w-16 h-16 text-cyan-400 relative z-10 drop-shadow-[0_0_25px_rgba(6,182,212,0.6)]" />
        </div>
        
        {/* Typography */}
        <h1 className="text-4xl font-light tracking-[0.3em] text-white uppercase font-sans mb-1">
          HASH<span className="font-bold text-cyan-400">GUARD</span>
        </h1>
        
        <p className="text-slate-500 font-mono text-[10px] tracking-[0.4em] uppercase mb-16">
          National Cyber Evidence Exchange
        </p>

        {/* Minimal Progress Bar */}
        <div className="w-64 flex flex-col items-center">
          <div className="h-[2px] w-full bg-slate-800/50 rounded-full overflow-hidden mb-4">
            <div 
              className="h-full bg-gradient-to-r from-cyan-600 to-cyan-400 transition-all duration-[50ms] ease-linear"
              style={{ width: `${progress}%` }}
            />
          </div>
          
          <div className="text-cyan-500/60 font-mono text-[10px] tracking-widest h-4 animate-pulse">
            {status}
          </div>
        </div>

      </div>
    </div>
  );
};
