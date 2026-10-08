import React from 'react';

export const PageHeader = ({
  title,
  subtitle,
  badge,
  breadcrumbs = [],
  actionButton
}) => {
  return (
    <div className="mb-6 flex flex-col md:flex-row md:items-start md:justify-between gap-4 pb-4 border-b border-ce-border">
      <div className="flex-1 min-w-0">
        {breadcrumbs.length > 0 && (
          <nav className="flex items-center gap-2 text-[11px] font-mono text-ce-text-muted mb-2">
            {breadcrumbs.map((crumb, idx) => (
              <React.Fragment key={idx}>
                {idx > 0 && <span className="opacity-50">/</span>}
                <span className={`truncate ${idx === breadcrumbs.length - 1 ? 'text-ce-text-primary font-semibold' : ''}`}>
                  {crumb}
                </span>
              </React.Fragment>
            ))}
          </nav>
        )}

        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-semibold text-ce-text-primary tracking-tight truncate">
            {title}
          </h1>
          {badge && <div className="shrink-0">{badge}</div>}
        </div>

        {subtitle && (
          <p className="text-sm text-ce-text-secondary mt-1.5 max-w-3xl leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>

      {actionButton && (
        <div className="flex items-center gap-3 shrink-0 md:mt-0 mt-2">
          {actionButton}
        </div>
      )}
    </div>
  );
};
