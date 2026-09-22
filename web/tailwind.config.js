/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx}', './components/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        maroon: {
          950: '#2A070E',
          900: '#3A0A15',
          800: '#4A0E1B',
          700: '#5B1423',
          600: '#6E1B2B',
          500: '#7E2233',
          400: '#9C3A4A',
        },
        gold: {
          50: '#FDF6E3',
          100: '#FAEDC8',
          200: '#F3DD9B',
          300: '#EBC55F',
          400: '#DFAF3F',
          500: '#C9942C',
          600: '#A97A24',
          700: '#8C651C',
          800: '#6E4F14',
        },
        ivory: {
          50: '#FEFBF4',
          100: '#FBF6EC',
          200: '#F4ECDB',
          300: '#EBDFC6',
          400: '#D9C8A6',
        },
        charcoal: {
          900: '#1C1711',
          800: '#241D15',
          700: '#31281C',
          600: '#4A3E2E',
          500: '#6B5F4F',
          400: '#8A7D6B',
          300: '#A99C8A',
        },
      },
      fontFamily: {
        display: ['Cormorant Garamond', 'Noto Serif Devanagari', 'Georgia', 'serif'],
        hindi: ['Noto Serif Devanagari', 'Cormorant Garamond', 'Georgia', 'serif'],
        body: ['Inter', 'Noto Sans Devanagari', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 10px 40px -12px rgba(60, 20, 30, 0.18)',
        gold: '0 10px 30px -10px rgba(201, 148, 44, 0.55)',
        card: '0 2px 12px rgba(36, 29, 21, 0.07)',
      },
      maxWidth: {
        prose: '68ch',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(18px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-400px 0' },
          '100%': { backgroundPosition: '400px 0' },
        },
        'pulse-dot': {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.45', transform: 'scale(0.82)' },
        },
        'spin-slow': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
      },
      animation: {
        'fade-up': 'fade-up .7s cubic-bezier(.16,1,.3,1) both',
        'fade-in': 'fade-in .6s ease both',
        shimmer: 'shimmer 1.4s linear infinite',
        'pulse-dot': 'pulse-dot 1.8s ease-in-out infinite',
        'spin-slow': 'spin-slow 14s linear infinite',
      },
    },
  },
  plugins: [],
};