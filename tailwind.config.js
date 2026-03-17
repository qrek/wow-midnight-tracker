/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        void: {
          50:  '#f0f2ff',
          100: '#dde4f0',
          200: '#b8c5e0',
          300: '#8a9dc0',
          400: '#6b7a99',
          500: '#4a5572',
          600: '#2e3a55',
          700: '#1a2644',
          800: '#0f1730',
          900: '#070d1c',
          950: '#030711',
        },
        gold: {
          300: '#f0d060',
          400: '#e8c060',
          500: '#c89b3c',
          600: '#a07830',
          700: '#7a5820',
        },
        arcane: {
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
          700: '#6d28d9',
        },
      },
      backgroundImage: {
        'card-gradient': 'linear-gradient(135deg, rgba(10,18,40,0.95) 0%, rgba(7,13,28,0.98) 100%)',
      },
      animation: {
        'fill-bar': 'fillBar 1s ease-out forwards',
        shimmer: 'shimmer 1.5s linear infinite',
      },
      keyframes: {
        fillBar: {
          '0%': { width: '0%' },
          '100%': { width: 'var(--fill-w)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
}
