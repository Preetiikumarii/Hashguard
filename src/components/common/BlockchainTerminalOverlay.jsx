import React, { useState, useEffect, useRef } from 'react';
import { Loader2, CheckCircle2 } from 'lucide-react';
import { formatISTTime } from '../../utils/formatters';

export const BlockchainTerminalOverlay = ({ isOpen, title, steps = [], onComplete }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [logs, setLogs] = useState([]);
  const hasTriggeredRef = useRef(false);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);
  
  useEffect(() => {
    if (!isOpen) {
      setCurrentStepIndex(0);
      setLogs([]);
      hasTriggeredRef.current = false;
      return;
    }

    if (currentStepIndex < steps.length) {
      const timer = setTimeout(() => {
        setLogs(prev => [...prev, steps[currentStepIndex]]);
        setCurrentStepIndex(prev => prev + 1);
      }, Math.random() * 400 + 300); // 300-700ms per step
      return () => clearTimeout(timer);
    } else if (!hasTriggeredRef.current) {
      hasTriggeredRef.current = true;
      const finishTimer = setTimeout(() => {
        if (onCompleteRef.current) onCompleteRef.current();
      }, 1000);
      return () => clearTimeout(finishTimer);
    }
  }, [isOpen, currentStepIndex, steps.length]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 transition-all">
      <div className="w-full max-w-2xl bg-ce-surface border border-ce-brand/30 rounded-md shadow-[0_0_40px_rgba(6,182,212,0.15)] overflow-hidden">
        
        {/* Terminal Header */}
        <div className="bg-ce-brand/10 border-b border-ce-brand/20 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Loader2 className="w-4 h-4 text-ce-brand animate-spin" />
            <span className="text-ce-brand text-xs font-mono font-bold tracking-widest uppercase">
              {title}
            </span>
          </div>
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-ce-brand/20" />
            <div className="w-2.5 h-2.5 rounded-full bg-ce-brand/20" />
            <div className="w-2.5 h-2.5 rounded-full bg-ce-brand/20" />
          </div>
        </div>

        {/* Terminal Body */}
        <div className="p-6 font-mono text-sm min-h-[300px] flex flex-col justify-end relative">
          {/* Grid background */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.02)_1px,transparent_1px)] bg-[size:20px_20px]"></div>
          
          <div className="relative z-10 flex flex-col gap-3">
            {logs.map((log, i) => (
              <div key={i} className="flex gap-3">
                <span className="text-ce-brand/50" title="Timezone: Asia/Kolkata (IST)">[{formatISTTime(new Date())}]</span>
                <span className={i === steps.length - 1 && currentStepIndex === steps.length ? 'text-ce-success font-bold' : 'text-ce-text-secondary'}>
                  {log}
                </span>
                {i === steps.length - 1 && currentStepIndex === steps.length && (
                  <CheckCircle2 className="w-4 h-4 text-ce-success inline ml-2" />
                )}
              </div>
            ))}
            {currentStepIndex < steps.length && (
              <div className="flex gap-3 animate-pulse">
                <span className="text-ce-brand/50" title="Timezone: Asia/Kolkata (IST)">[{formatISTTime(new Date())}]</span>
                <span className="text-ce-brand/80">Processing...</span>
                <div className="w-2 h-4 bg-ce-brand ml-1 mt-0.5" />
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
