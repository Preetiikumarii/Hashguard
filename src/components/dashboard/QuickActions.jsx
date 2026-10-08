import React from 'react';
import { Zap, Plus, ArrowRightLeft, ShieldCheck, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';

export const QuickActions = ({ onRegister }) => {
  return (
    <div className="bg-ce-surface border border-ce-border rounded-lg overflow-hidden flex flex-col h-full">
      <div className="flex items-center gap-2 p-4 border-b border-ce-border text-ce-text-primary font-medium">
        <Zap className="w-4 h-4 text-ce-brand" />
        <span className="text-sm">Command Pad</span>
      </div>

      <div className="p-4 grid grid-cols-2 gap-3 flex-1">
        <button 
          onClick={onRegister}
          className="flex flex-col items-center justify-center gap-2 p-3 rounded-md border border-ce-border bg-ce-surface-subtle hover:border-ce-brand/50 hover:bg-ce-brand/5 transition-all group"
        >
          <div className="w-8 h-8 rounded border border-ce-brand/20 bg-ce-brand/10 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Plus className="w-4 h-4 text-ce-brand" />
          </div>
          <span className="text-[10px] uppercase font-mono tracking-wider font-semibold text-ce-text-secondary group-hover:text-ce-text-primary">Register</span>
        </button>
        
        <Link 
          to="/transfers"
          className="flex flex-col items-center justify-center gap-2 p-3 rounded-md border border-ce-border bg-ce-surface-subtle hover:border-ce-warning/50 hover:bg-ce-warning/5 transition-all group"
        >
          <div className="w-8 h-8 rounded border border-ce-warning/20 bg-ce-warning/10 flex items-center justify-center group-hover:scale-110 transition-transform">
            <ArrowRightLeft className="w-4 h-4 text-ce-warning" />
          </div>
          <span className="text-[10px] uppercase font-mono tracking-wider font-semibold text-ce-text-secondary group-hover:text-ce-text-primary">Transfer</span>
        </Link>
        
        <Link 
          to="/verification"
          className="flex flex-col items-center justify-center gap-2 p-3 rounded-md border border-ce-border bg-ce-surface-subtle hover:border-ce-success/50 hover:bg-ce-success/5 transition-all group"
        >
          <div className="w-8 h-8 rounded border border-ce-success/20 bg-ce-success/10 flex items-center justify-center group-hover:scale-110 transition-transform">
            <ShieldCheck className="w-4 h-4 text-ce-success" />
          </div>
          <span className="text-[10px] uppercase font-mono tracking-wider font-semibold text-ce-text-secondary group-hover:text-ce-text-primary">Verify</span>
        </Link>
        
        <Link 
          to="/audit"
          className="flex flex-col items-center justify-center gap-2 p-3 rounded-md border border-ce-border bg-ce-surface-subtle hover:border-ce-info/50 hover:bg-ce-info/5 transition-all group"
        >
          <div className="w-8 h-8 rounded border border-ce-info/20 bg-ce-info/10 flex items-center justify-center group-hover:scale-110 transition-transform">
            <FileText className="w-4 h-4 text-ce-info" />
          </div>
          <span className="text-[10px] uppercase font-mono tracking-wider font-semibold text-ce-text-secondary group-hover:text-ce-text-primary">Audit Log</span>
        </Link>
      </div>
    </div>
  );
};
