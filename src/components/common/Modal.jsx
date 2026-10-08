import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export const Modal = ({ isOpen, onClose, title, subtitle, children, maxWidth = 'max-w-2xl' }) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Container */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? "modal-title" : undefined}
        className={`relative w-full ${maxWidth} rounded-md bg-ce-surface border border-ce-border shadow-xl overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-150 motion-reduce:transition-none motion-reduce:animate-none`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-ce-border bg-ce-surface-subtle">
          <div>
            <h3 id="modal-title" className="text-base font-bold text-ce-text-primary tracking-wide">
              {title}
            </h3>
            {subtitle && (
              <p className="text-xs text-ce-text-secondary mt-1">
                {subtitle}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-md text-ce-text-muted hover:text-ce-text-primary hover:bg-ce-surface-hover transition-colors focus:outline-none focus:ring-2 focus:ring-ce-brand"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[80vh] overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
};
