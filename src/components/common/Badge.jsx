import React from 'react';
import { getStatusBadgeVariant } from '../../utils/formatters';

export const Badge = ({ status, customLabel, className = '' }) => {
  const variant = getStatusBadgeVariant(status);
  const text = customLabel || variant.iconText;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-xs font-mono font-semibold border ${variant.bg} ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${variant.dot}`} />
      <span>{text}</span>
    </span>
  );
};
