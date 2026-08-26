/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cyber: {
          bg: '#0a0d14',
          panel: '#111726',
          card: '#161e31',
          surface: '#1c263d',
          border: 'rgba(255, 255, 255, 0.08)',
          'border-bright': 'rgba(0, 240, 255, 0.3)',
          cyan: '#00f0ff',
          'cyan-glow': 'rgba(0, 240, 255, 0.25)',
          emerald: '#10b981',
          'emerald-glow': 'rgba(16, 185, 129, 0.25)',
          amber: '#f59e0b',
          'amber-glow': 'rgba(245, 158, 11, 0.25)',
          crimson: '#ef4444',
          'crimson-glow': 'rgba(239, 68, 68, 0.25)',
          purple: '#8b5cf6',
          'purple-glow': 'rgba(139, 92, 246, 0.25)',
        },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
        display: ['"Outfit"', 'sans-serif'],
      },
      boxShadow: {
        'cyan-glow': '0 0 20px -5px rgba(0, 240, 255, 0.4)',
        'emerald-glow': '0 0 20px -5px rgba(16, 185, 129, 0.4)',
        'amber-glow': '0 0 20px -5px rgba(245, 158, 11, 0.4)',
        'panel': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      },
      animation: {
        'radar-sweep': 'radarSweep 4s linear infinite',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'scan-line': 'scanLine 3s ease-in-out infinite',
      },
      keyframes: {
        radarSweep: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '0.9' },
        },
        scanLine: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(1000%)' },
        },
      },
    },
  },
  plugins: [],
}
