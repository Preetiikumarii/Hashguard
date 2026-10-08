import React from 'react';

/**
 * HashGuard / Cyber Evidence Exchange Official Brand Logo
 * 
 * Scalable SVG emblem combining:
 * - Cybernetic Defense Shield
 * - Merkle DAG / SHA-256 Hash Graph Nodes
 * - Immutable Custody Lock Core
 * - Dynamic Tamper State indicator
 */
export const LogoIcon = ({ className = "w-6 h-6", tampered = false }) => {
  const primaryGlow = tampered ? "#ef4444" : "#22d3ee";
  const primaryStroke = tampered ? "url(#tamperGrad)" : "url(#shieldBorderGrad)";
  const coreFill = tampered ? "rgba(239, 68, 68, 0.25)" : "rgba(6, 182, 212, 0.2)";
  const nodeColor1 = tampered ? "#f87171" : "#22d3ee";
  const nodeColor2 = tampered ? "#ef4444" : "#38bdf8";
  const nodeColor3 = tampered ? "#dc2626" : "#818cf8";
  const nodeColor4 = tampered ? "#b91c1c" : "#a855f7";

  return (
    <svg 
      viewBox="0 0 64 64" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 transition-transform duration-300 group-hover:scale-105 ${className}`}
    >
      <defs>
        <linearGradient id="shieldBorderGrad" x1="12" y1="8" x2="52" y2="56" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#22d3ee" />
          <stop offset="50%" stopColor="#0284c7" />
          <stop offset="100%" stopColor="#4f46e5" />
        </linearGradient>

        <linearGradient id="tamperGrad" x1="12" y1="8" x2="52" y2="56" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#f87171" />
          <stop offset="50%" stopColor="#ef4444" />
          <stop offset="100%" stopColor="#b91c1c" />
        </linearGradient>

        <linearGradient id="bgGrad" x1="32" y1="8" x2="32" y2="56" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#08101e" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#020617" stopOpacity="0.95" />
        </linearGradient>

        <filter id="shieldGlowFilter" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Ambient Pulsing Glow Underlay */}
      <path 
        d="M32 9 L51 18.5 C51 38 32 53.5 32 53.5 C32 53.5 13 38 13 18.5 Z" 
        fill={primaryGlow} 
        fillOpacity="0.18" 
        filter="url(#shieldGlowFilter)" 
      />

      {/* Outer Armor Shield */}
      <path 
        d="M32 10 L50 19 C50 37.5 32 52 32 52 C32 52 14 37.5 14 19 Z" 
        fill="url(#bgGrad)" 
        stroke={primaryStroke} 
        strokeWidth="2.4" 
        strokeLinejoin="round" 
      />

      {/* Inner Cyber Bevel (dashed telemetry accent) */}
      <path 
        d="M32 14 L45 20.8 C45 34.5 32 46.5 32 46.5 C32 46.5 19 34.5 19 20.8 Z" 
        stroke={tampered ? "#f87171" : "#0ea5e9"} 
        strokeWidth="1" 
        strokeOpacity="0.45" 
        strokeDasharray="3 2" 
        fill="none" 
      />

      {/* Hexagonal Merkle / Cryptographic Core */}
      <path 
        d="M32 24 L24 30 L24 36 L32 41 L40 36 L40 30 Z" 
        stroke={nodeColor2} 
        strokeWidth="1.4" 
        fill={coreFill} 
      />

      {/* Merkle Hash Block Nodes */}
      <circle cx="32" cy="24" r="2.2" fill={nodeColor1} />
      <circle cx="24" cy="30" r="1.8" fill={nodeColor2} />
      <circle cx="40" cy="30" r="1.8" fill={nodeColor2} />
      <circle cx="24" cy="36" r="1.8" fill={nodeColor3} />
      <circle cx="40" cy="36" r="1.8" fill={nodeColor3} />
      <circle cx="32" cy="41" r="2.2" fill={nodeColor4} />

      {/* Internal Hash Bus Routing */}
      <line x1="32" y1="26" x2="32" y2="33" stroke={nodeColor2} strokeWidth="1.2" strokeLinecap="round" />
      <line x1="26" y1="31" x2="38" y2="31" stroke={nodeColor2} strokeWidth="1" strokeOpacity="0.6" />

      {/* Custody Padlock Core */}
      <circle cx="32" cy="33.5" r="2" fill={nodeColor1} />
      <path d="M31 34.5 L33 34.5 L33.5 38 L30.5 38 Z" fill={nodeColor1} />

      {/* Fingerprint / Biometric Waves */}
      <path d="M28 20 C30 18.5 34 18.5 36 20" stroke={nodeColor1} strokeWidth="1.2" strokeLinecap="round" opacity="0.8" />
      <path d="M26 44 C29 46.5 35 46.5 38 44" stroke={nodeColor2} strokeWidth="1.2" strokeLinecap="round" opacity="0.7" />
    </svg>
  );
};

export const Logo = ({ 
  size = "md", 
  variant = "full", 
  showSubtitle = true, 
  tampered = false,
  className = "",
  onClick = null
}) => {
  const sizeMap = {
    sm: { icon: "w-6 h-6", title: "text-xs tracking-wider", subtitle: "text-[8px] tracking-widest", box: "w-8 h-8" },
    md: { icon: "w-7 h-7", title: "text-sm tracking-wider", subtitle: "text-[9px] tracking-widest", box: "w-10 h-10" },
    lg: { icon: "w-10 h-10", title: "text-lg tracking-widest", subtitle: "text-[11px] tracking-widest", box: "w-14 h-14" },
    xl: { icon: "w-16 h-16", title: "text-2xl tracking-[0.25em]", subtitle: "text-xs tracking-[0.3em]", box: "w-24 h-24" },
  };

  const currentSize = sizeMap[size] || sizeMap.md;

  if (variant === "icon") {
    return (
      <div 
        onClick={onClick}
        className={`rounded-lg bg-gradient-to-br from-cyan-500/15 to-blue-600/15 border border-cyan-500/30 flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.15)] hover:border-cyan-400/60 hover:shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all ${currentSize.box} ${className}`}
      >
        <LogoIcon className={currentSize.icon} tampered={tampered} />
      </div>
    );
  }

  return (
    <div 
      onClick={onClick}
      className={`flex items-center gap-3 shrink-0 select-none group ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      <div className={`rounded-lg bg-gradient-to-br from-cyan-500/15 to-blue-600/15 border border-cyan-500/30 flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.2)] group-hover:border-cyan-400/70 group-hover:shadow-[0_0_22px_rgba(6,182,212,0.35)] transition-all shrink-0 ${currentSize.box}`}>
        <LogoIcon className={currentSize.icon} tampered={tampered} />
      </div>

      <div className="shrink-0 leading-tight">
        <span className={`font-mono font-bold text-ce-text-primary block ${currentSize.title}`}>
          HASH<span className={tampered ? "text-red-500" : "text-cyan-600 dark:text-cyan-400"}>GUARD</span>
        </span>
        {showSubtitle && (
          <p className={`font-mono text-ce-text-muted font-medium tracking-wider uppercase ${currentSize.subtitle}`}>
            Cyber Evidence Exchange
          </p>
        )}
      </div>
    </div>
  );
};

export default Logo;
