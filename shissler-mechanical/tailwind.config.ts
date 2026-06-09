import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#020810',
          900: '#040d1a',
          800: '#0a1628',
          700: '#0d1f3c',
          600: '#122952',
          500: '#1a3a6e',
          400: '#2952a3',
          300: '#4472c8',
          200: '#7aa0e0',
          100: '#c5d8f4',
          50:  '#eaf1fb',
        },
        electric: {
          700: '#0040a8',
          600: '#0052cc',
          500: '#0066ff',
          400: '#3385ff',
          300: '#66aaff',
          200: '#99ccff',
          100: '#d6eaff',
        },
        steel: {
          950: '#080c14',
          900: '#0f172a',
          800: '#1e293b',
          700: '#2d3f55',
          600: '#475569',
          500: '#64748b',
          400: '#94a3b8',
          300: '#cbd5e1',
          200: '#e2e8f0',
          100: '#f1f5f9',
          50:  '#f8fafc',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        hero: ['clamp(2.5rem,6vw,4.5rem)', { lineHeight: '1.1', fontWeight: '800' }],
        display: ['clamp(2rem,4vw,3rem)', { lineHeight: '1.15', fontWeight: '700' }],
      },
      boxShadow: {
        'blue-glow': '0 0 40px rgba(0,102,255,0.25)',
        'blue-sm': '0 4px 20px rgba(0,102,255,0.3)',
        'dark': '0 20px 60px rgba(0,0,0,0.5)',
        'card': '0 4px 24px rgba(0,0,0,0.3)',
      },
    },
  },
  plugins: [],
}
export default config
