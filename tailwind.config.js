/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      colors: {
        zrok: {
          50:  '#edfcf4',
          100: '#d3f8e3',
          200: '#aaf0cb',
          300: '#73e3ac',
          400: '#39ce87',
          500: '#16b46c',
          600: '#0a9258',
          700: '#097449',
          800: '#0b5c3b',
          900: '#0a4c31',
          950: '#042b1c',
        },
        midnight: {
          900: '#060b14',
          800: '#090f1b',
          700: '#0d1525',
          600: '#111c30',
          500: '#16243e',
        }
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'hero-glow': 'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(22,180,108,0.25), transparent)',
        'grid-pattern': "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke='rgb(22 180 108 / 0.06)'%3e%3cpath d='M0 .5H31.5V32'/%3e%3c/svg%3e\")",
      },
      animation: {
        'fade-in':   'fadeIn 0.6s ease-out forwards',
        'slide-up':  'slideUp 0.6s ease-out forwards',
        'glow':      'glow 3s ease-in-out infinite alternate',
        'pulse-glow':'pulseGlow 2s ease-in-out infinite',
        'float':     'float 6s ease-in-out infinite',
        'beam':      'beam 4s linear infinite',
        'spin-slow': 'spin 8s linear infinite',
        'typewriter':'typewriter 2s steps(40, end)',
        'blink':     'blink 1s step-end infinite',
        'shimmer':   'shimmer 2.5s linear infinite',
      },
      keyframes: {
        fadeIn:    { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        slideUp:   { '0%': { opacity: '0', transform: 'translateY(30px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        glow:      { '0%': { textShadow: '0 0 20px rgba(22,180,108,0.4)' }, '100%': { textShadow: '0 0 60px rgba(22,180,108,0.8)' } },
        pulseGlow: { '0%,100%': { boxShadow: '0 0 20px rgba(22,180,108,0.2)' }, '50%': { boxShadow: '0 0 50px rgba(22,180,108,0.5)' } },
        float:     { '0%,100%': { transform: 'translateY(0px)' }, '50%': { transform: 'translateY(-12px)' } },
        beam:      { '0%': { transform: 'translateX(-100%)', opacity: '0' }, '50%': { opacity: '1' }, '100%': { transform: 'translateX(100vw)', opacity: '0' } },
        typewriter:{ '0%': { width: '0' }, '100%': { width: '100%' } },
        blink:     { '0%,100%': { borderColor: 'transparent' }, '50%': { borderColor: 'rgb(22 180 108)' } },
        shimmer:   { '0%': { backgroundPosition: '-200% 0' }, '100%': { backgroundPosition: '200% 0' } },
      },
    },
  },
  plugins: [],
}
