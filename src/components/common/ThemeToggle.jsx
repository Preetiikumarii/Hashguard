import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export const ThemeToggle = ({ 
  variant = 'icon', 
  size = 'md',
  className = '',
  showLabel = false 
}) => {
  const { theme, isDark, toggleTheme } = useTheme();

  const sizeClasses = {
    sm: 'p-1.5 text-xs',
    md: 'p-2 text-sm',
    lg: 'p-2.5 text-base',
  };

  const iconSizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  if (variant === 'pill') {
    return (
      <div 
        onClick={toggleTheme}
        className={`inline-flex items-center p-1 rounded-full bg-ce-surface-subtle border border-ce-border cursor-pointer select-none transition-colors ${className}`}
        role="button"
        tabIndex={0}
        aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggleTheme();
          }
        }}
      >
        <div 
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-medium transition-all ${
            !isDark 
              ? 'bg-amber-500 text-white shadow-sm' 
              : 'text-ce-text-muted hover:text-ce-text-primary'
          }`}
        >
          <Sun className="w-3.5 h-3.5 shrink-0" />
          <span>Light</span>
        </div>
        <div 
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-medium transition-all ${
            isDark 
              ? 'bg-ce-brand text-white shadow-sm' 
              : 'text-ce-text-muted hover:text-ce-text-primary'
          }`}
        >
          <Moon className="w-3.5 h-3.5 shrink-0" />
          <span>Dark</span>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={toggleTheme}
      type="button"
      className={`inline-flex items-center justify-center gap-2 rounded-lg bg-ce-surface-subtle/80 hover:bg-ce-surface-subtle border border-ce-border text-ce-text-secondary hover:text-ce-text-primary transition-all duration-200 cursor-pointer shadow-sm group active:scale-95 ${sizeClasses[size] || sizeClasses.md} ${className}`}
      title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
      aria-label={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
    >
      <div className="relative w-4 h-4 flex items-center justify-center">
        {isDark ? (
          <Sun className={`${iconSizes[size] || iconSizes.md} text-amber-400 group-hover:rotate-45 transition-transform duration-300`} />
        ) : (
          <Moon className={`${iconSizes[size] || iconSizes.md} text-indigo-500 group-hover:-rotate-12 transition-transform duration-300`} />
        )}
      </div>

      {showLabel && (
        <span className="text-xs font-mono font-medium">
          {isDark ? 'Light' : 'Dark'}
        </span>
      )}
    </button>
  );
};

export default ThemeToggle;
