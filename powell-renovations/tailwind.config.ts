import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          50:  '#FBF7EC',
          100: '#F5EBD0',
          200: '#EAD5A3',
          300: '#DFBE76',
          400: '#D4A747',
          500: '#C4922A',
          600: '#A37322',
          700: '#7A5519',
          800: '#523810',
          900: '#291C08',
        },
        dark: {
          50:  '#F2F2F2',
          100: '#E5E5E5',
          200: '#CCCCCC',
          300: '#B3B3B3',
          400: '#999999',
          500: '#666666',
          600: '#4D4D4D',
          700: '#333333',
          800: '#1A1A1A',
          900: '#0D0D0D',
          950: '#080808',
        },
      },
      fontFamily: {
        display: ['var(--font-playfair)', 'Georgia', 'serif'],
        body:    ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'hero': ['clamp(2.8rem, 7vw, 6rem)', { lineHeight: '1.05', letterSpacing: '-0.02em' }],
        'display': ['clamp(2rem, 4.5vw, 4rem)', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'title': ['clamp(1.5rem, 3vw, 2.5rem)', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
      },
      animation: {
        'fade-up':    'fadeUp 0.7s cubic-bezier(0.16,1,0.3,1) forwards',
        'fade-in':    'fadeIn 0.6s ease forwards',
        'gold-pulse': 'goldPulse 3s ease-in-out infinite',
        'shimmer':    'shimmer 2.5s linear infinite',
        'float':      'float 6s ease-in-out infinite',
      },
      keyframes: {
        fadeUp: {
          '0%':   { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        goldPulse: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(196,146,42,0.4)' },
          '50%':      { boxShadow: '0 0 0 12px rgba(196,146,42,0)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%':      { transform: 'translateY(-10px)' },
        },
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #C4922A 0%, #E8C547 35%, #C4922A 65%, #A37322 100%)',
        'dark-gradient': 'linear-gradient(180deg, #0D0D0D 0%, #1A1A1A 100%)',
        'hero-overlay':  'linear-gradient(to bottom, rgba(8,8,8,0.7) 0%, rgba(8,8,8,0.5) 40%, rgba(8,8,8,0.85) 100%)',
      },
      boxShadow: {
        'gold':    '0 4px 24px rgba(196,146,42,0.25)',
        'gold-lg': '0 8px 40px rgba(196,146,42,0.35)',
        'dark':    '0 4px 24px rgba(0,0,0,0.5)',
        'dark-lg': '0 12px 60px rgba(0,0,0,0.7)',
      },
    },
  },
  plugins: [],
}

export default config
