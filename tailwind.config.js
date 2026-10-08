/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        /* Legacy colors */
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        surface: {
          DEFAULT: "hsl(var(--card))",
          subtle: "hsl(var(--muted))",
          border: "hsl(var(--border))",
          hover: "hsl(var(--accent))",
          card: "hsl(var(--card))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        /* CYBER EVIDENCE DESIGN SYSTEM TOKENS */
        'ce-bg': "hsl(var(--color-background))",
        'ce-surface': "hsl(var(--color-surface))",
        'ce-surface-elevated': "hsl(var(--color-surface-elevated))",
        'ce-surface-subtle': "hsl(var(--color-surface-subtle))",
        
        'ce-border': "hsl(var(--color-border))",
        'ce-border-strong': "hsl(var(--color-border-strong))",
        
        'ce-text-primary': "hsl(var(--color-text-primary))",
        'ce-text-secondary': "hsl(var(--color-text-secondary))",
        'ce-text-muted': "hsl(var(--color-text-muted))",
        
        'ce-brand': "hsl(var(--color-brand))",
        'ce-brand-hover': "hsl(var(--color-brand-hover))",
        'ce-brand-subtle': "hsl(var(--color-brand-subtle))",
        
        'ce-success': "hsl(var(--color-success))",
        'ce-success-subtle': "hsl(var(--color-success-subtle))",
        
        'ce-warning': "hsl(var(--color-warning))",
        'ce-warning-subtle': "hsl(var(--color-warning-subtle))",
        
        'ce-danger': "hsl(var(--color-danger))",
        'ce-danger-subtle': "hsl(var(--color-danger-subtle))",
        
        'ce-info': "hsl(var(--color-info))",
        'ce-info-subtle': "hsl(var(--color-info-subtle))",
        
        'ce-verification': "hsl(var(--color-verification))",
        'ce-integrity': "hsl(var(--color-integrity))",
        'ce-blockchain': "hsl(var(--color-blockchain))",
        'ce-off-chain': "hsl(var(--color-off-chain))",
        'ce-tampered': "hsl(var(--color-tampered))",
        'ce-pending': "hsl(var(--color-pending))",
      },
      boxShadow: {
        'premium': '0 1px 3px rgba(15, 23, 42, 0.05), 0 8px 24px -4px rgba(15, 23, 42, 0.06)',
        'premium-lg': '0 2px 6px rgba(15, 23, 42, 0.06), 0 20px 40px -10px rgba(15, 23, 42, 0.09)',
        'card': '0 1px 2px rgba(15, 23, 42, 0.04), 0 0 0 1px rgba(15, 23, 42, 0.03)',
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      animation: {
        'grid-flow': 'gridFlow 20s linear infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'tamper-flash': 'tamperFlash 2s infinite',
      },
      keyframes: {
        gridFlow: {
          '0%': { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(32px)' },
        },
        tamperFlash: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.7, backgroundColor: 'rgba(225, 29, 72, 0.2)' },
        }
      }
    },
  },
  plugins: [],
}
