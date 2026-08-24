/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#0c0c0c',
        foreground: '#f4f4f4',
        accent: '#ffffff',
        muted: '#888888',
        'muted-dark': '#222222',
        border: 'rgba(255, 255, 255, 0.15)',
        'border-light': 'rgba(255, 255, 255, 0.25)',
        'border-dim': 'rgba(255, 255, 255, 0.08)',
        card: '#121212',
        'card-hover': '#181818',
        tag: '#202020',
      },
      fontFamily: {
        head: ['Syne', 'sans-serif'],
        accent: ['"Playfair Display"', 'serif'],
        body: ['Manrope', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace', 'sans-serif'],
      },
      letterSpacing: {
        tightest: '-0.06em',
        tighter: '-0.04em',
        widest: '0.25em',
        superwide: '0.4em',
      },
      animation: {
        'marquee': 'marquee 25s linear infinite',
        'marquee-reverse': 'marquee-reverse 25s linear infinite',
        'pulse-subtle': 'pulse-subtle 3s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'marquee-reverse': {
          '0%': { transform: 'translateX(-50%)' },
          '100%': { transform: 'translateX(0%)' },
        },
        'pulse-subtle': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        }
      }
    },
  },
  plugins: [],
}
