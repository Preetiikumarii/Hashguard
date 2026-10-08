import React from 'react';
import { ShieldAlert, FolderSearch, AlertTriangle, RefreshCw } from 'lucide-react';

export const EmptyState = ({
  title = "No Evidence Found",
  description = "Evidence collected or transferred to this organization will appear here.",
  icon: Icon = FolderSearch,
  actionButton
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center rounded-xl bg-ce-surface border border-ce-border shadow-sm">
      <div className="p-3.5 rounded-full bg-ce-surface-subtle border border-ce-border text-ce-text-muted mb-4">
        <Icon className="w-8 h-8" />
      </div>
      <h4 className="text-base font-semibold text-ce-text-primary">
        {title}
      </h4>
      <p className="text-xs text-ce-text-muted max-w-sm mt-1 mb-4 leading-relaxed">
        {description}
      </p>
      {actionButton}
    </div>
  );
};

export const LoadingState = ({ message = "Querying cryptographic audit layer..." }) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 space-y-4 rounded-xl bg-ce-surface/50 border border-ce-border">
      <div className="relative">
        <div className="w-10 h-10 rounded-full border-2 border-ce-brand/20 border-t-ce-brand animate-spin" />
      </div>
      <div className="text-xs font-mono text-ce-brand tracking-wider font-semibold">
        {message}
      </div>
    </div>
  );
};

export const ErrorState = ({
  title = "Unable to load evidence",
  description = "Please verify connection to audit ledger nodes and try again.",
  onRetry
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center rounded-xl bg-rose-500/5 border border-rose-500/20">
      <div className="p-3 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 mb-3">
        <AlertTriangle className="w-6 h-6" />
      </div>
      <h4 className="text-base font-semibold text-rose-700 dark:text-rose-300">
        {title}
      </h4>
      <p className="text-xs text-ce-text-muted max-w-md mt-1 mb-4">
        {description}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-ce-surface border border-ce-border text-xs font-mono font-medium text-ce-text-primary hover:bg-ce-surface-subtle transition-colors shadow-sm"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Retry Connection</span>
        </button>
      )}
    </div>
  );
};
