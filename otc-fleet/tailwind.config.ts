import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Brand yellow — OTC Fleet's primary accent
        brand: {
          DEFAULT: '#FFD400',
          dark: '#e6bf00',
          light: '#ffe066',
          50: '#fffbe6',
          100: '#fff3b3',
          200: '#ffe066',
          300: '#FFD400',
          400: '#FFD400',
          500: '#FFD400',
          600: '#e6bf00',
          700: '#ccaa00',
        },
        // Charcoal dark backgrounds
        charcoal: {
          DEFAULT: '#111111',
          950: '#0a0a0a',
          900: '#111111',
          800: '#1a1a1a',
          700: '#222222',
          600: '#2d2d2d',
          500: '#3a3a3a',
          400: '#4a4a4a',
        },
        steel: '#1e293b',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'Liberation Mono', 'Courier New', 'monospace'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'diamond-plate': "repeating-linear-gradient(45deg, rgba(255,212,0,0.03) 0, rgba(255,212,0,0.03) 1px, transparent 0, transparent 50%)",
        'grid-overlay': "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
      },
      backgroundSize: {
        'grid-sm': '20px 20px',
        'grid-md': '40px 40px',
      },
      animation: {
        'fade-up': 'fadeUp 0.6s ease-out forwards',
        'slide-in': 'slideIn 0.5s ease-out forwards',
        'counter': 'counter 2s ease-out forwards',
        'float': 'float 3s ease-in-out infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(40px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          '0%': { opacity: '0', transform: 'translateX(-20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
      },
      boxShadow: {
        'glow-brand': '0 0 30px rgba(255,212,0,0.25)',
        'glow-charcoal': '0 0 30px rgba(10,10,10,0.5)',
        'card-hover': '0 20px 60px rgba(0,0,0,0.4)',
      },
      screens: {
        xs: '480px',
      },
    },
  },
  plugins: [],
}

export default config
