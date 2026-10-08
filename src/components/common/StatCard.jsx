import React from 'react';

export const StatCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  variant = 'default',
  badgeText,
  onClick
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'verified':
        return 'bg-ce-success/5 border-ce-success/20 hover:border-ce-success/40';
      case 'warning':
        return 'bg-ce-warning/5 border-ce-warning/20 hover:border-ce-warning/40';
      case 'danger':
        return 'bg-ce-danger/5 border-ce-danger/30 shadow-[0_0_15px_rgba(239,68,68,0.1)] hover:border-ce-danger/50';
      default:
        return 'bg-ce-surface border-ce-border hover:border-ce-brand/50';
    }
  };

  const getValueColor = () => {
    switch (variant) {
      case 'verified': return 'text-ce-success';
      case 'warning': return 'text-ce-warning';
      case 'danger': return 'text-ce-danger';
      default: return 'text-ce-text-primary';
    }
  };

  return (
    <div
      onClick={onClick}
      className={`relative p-5 rounded-lg border transition-colors ${getVariantStyles()} ${
        onClick ? 'cursor-pointer hover:bg-ce-surface-subtle' : ''
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-mono font-bold tracking-wider text-ce-text-secondary uppercase">
          {title}
        </span>
        {Icon && (
          <div className="text-ce-text-muted">
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      <div className="flex items-end justify-between">
        <span className={`text-4xl font-light font-sans tracking-tight ${getValueColor()}`}>
          {value}
        </span>
        {badgeText && (
          <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-ce-bg text-ce-text-muted border border-ce-border uppercase tracking-wider mb-1">
            {badgeText}
          </span>
        )}
      </div>

      {subtitle && (
        <p className="mt-3 text-[11px] text-ce-text-muted font-mono truncate">
          {subtitle}
        </p>
      )}
    </div>
  );
};
