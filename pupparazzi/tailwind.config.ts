import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        rose: {
          950: '#1a0810', 900: '#3d0f20', 800: '#6b1535',
          700: '#8f1d44', 600: '#b02456', 500: '#c4365f',
          400: '#d4607e', 300: '#e090a8', 200: '#eebecb',
          100: '#f7dfe6', 50: '#fdf0f3',
        },
        warm: {
          950: '#1a1612', 900: '#2a2218', 800: '#3e3228',
          700: '#5a4a38', 600: '#7a6a58', 500: '#9a8a78',
          400: '#baaa98', 300: '#d4c8b8', 200: '#e8e0d4',
          100: '#f3ede6', 50: '#faf7f3',
        },
        blush: {
          700: '#b06878', 600: '#c87888', 500: '#d89098',
          400: '#e4a8b0', 300: '#eec0c6', 200: '#f4d4d8',
          100: '#f9e8ea', 50: '#fdf4f5',
        },
      },
      fontFamily: {
        display: ['var(--font-playfair)', 'Georgia', 'serif'],
        body: ['var(--font-dm-sans)', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        hero: ['clamp(2.6rem,5.5vw,4.5rem)', { lineHeight: '1.06', letterSpacing: '-0.02em' }],
        display: ['clamp(1.9rem,3.8vw,3rem)', { lineHeight: '1.12', letterSpacing: '-0.015em' }],
        title: ['clamp(1.4rem,2.5vw,2rem)', { lineHeight: '1.2' }],
      },
      boxShadow: {
        'soft': '0 2px 20px rgba(0,0,0,0.06), 0 1px 4px rgba(0,0,0,0.03)',
        'medium': '0 4px 32px rgba(0,0,0,0.1), 0 2px 8px rgba(0,0,0,0.04)',
        'large': '0 8px 48px rgba(0,0,0,0.12), 0 4px 16px rgba(0,0,0,0.06)',
        'rose': '0 8px 32px rgba(196,54,95,0.3)',
      },
      borderRadius: { '2xl': '1rem', '3xl': '1.5rem', '4xl': '2rem' },
    },
  },
  plugins: [],
}
export default config
