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
        forest: {
          950: '#0a180b',
          900: '#0f2010',
          800: '#162a18',
          700: '#1e3820',
          600: '#275230',
          500: '#2d6035',
          400: '#3d7848',
          300: '#5a9a65',
          200: '#82bb8a',
          100: '#b4d8b8',
          50:  '#e0f0e2',
        },
        sage: {
          700: '#3a6645',
          600: '#4a7c59',
          500: '#5e9470',
          400: '#75aa84',
          300: '#96c2a0',
          200: '#b8d8be',
          100: '#d6ead8',
          50:  '#eef6ef',
        },
        cream: {
          900: '#7a6a50',
          800: '#9a8464',
          700: '#b8a07a',
          600: '#d0bc96',
          500: '#e4d4b2',
          400: '#ede0c4',
          300: '#f3ebd6',
          200: '#f7f2e6',
          100: '#faf7f0',
          50:  '#fdfcf8',
        },
        tan: {
          800: '#7a5a0a',
          700: '#9a7414',
          600: '#b88820',
          500: '#d4a030',
          400: '#e0b848',
          300: '#eacc70',
          200: '#f2df9e',
          100: '#f8eec8',
          50:  '#fdf7e8',
        },
      },
      fontFamily: {
        display: ['var(--font-playfair)', 'Georgia', 'serif'],
        body: ['var(--font-plus-jakarta)', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        hero: ['clamp(2.5rem,6vw,5rem)', { lineHeight: '1.05', letterSpacing: '-0.02em' }],
        display: ['clamp(2rem,4vw,3.25rem)', { lineHeight: '1.1', letterSpacing: '-0.015em' }],
        title: ['clamp(1.5rem,3vw,2.25rem)', { lineHeight: '1.15' }],
      },
      boxShadow: {
        'lodge': '0 4px 30px -8px rgba(45,96,53,0.25)',
        'lodge-lg': '0 12px 48px -12px rgba(45,96,53,0.35)',
        'card': '0 2px 20px -4px rgba(0,0,0,0.08), 0 1px 4px -1px rgba(0,0,0,0.04)',
        'card-hover': '0 8px 40px -8px rgba(0,0,0,0.14), 0 2px 8px -2px rgba(0,0,0,0.06)',
        'tan': '0 8px 32px -8px rgba(212,160,48,0.5)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'float-slow': 'float 9s ease-in-out infinite',
        'paw-drift': 'pawDrift 12s ease-in-out infinite',
        'counter': 'counter 2s ease-out forwards',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-18px) rotate(5deg)' },
        },
        pawDrift: {
          '0%': { transform: 'translateY(0px) translateX(0px) rotate(0deg)', opacity: '0' },
          '10%': { opacity: '0.4' },
          '90%': { opacity: '0.2' },
          '100%': { transform: 'translateY(-120px) translateX(40px) rotate(30deg)', opacity: '0' },
        },
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(160deg, rgba(15,32,16,0.85) 0%, rgba(15,32,16,0.45) 50%, rgba(15,32,16,0.7) 100%)',
        'section-gradient': 'linear-gradient(180deg, #fdfcf8 0%, #f7f2e6 100%)',
        'green-gradient': 'linear-gradient(135deg, #1e3820 0%, #2d6035 100%)',
      },
    },
  },
  plugins: [],
}

export default config
