import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './styles/**/*.css'
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        base: '#0a0b0f',
        surface: '#0f1117',
        accent: '#00FFC6',
        magenta: '#FF00E5',
        cyber: '#7DF9FF',
        neon: '#39FF14'
      },
      boxShadow: {
        glow: '0 0 25px rgba(0, 255, 198, 0.35)',
        neon: '0 0 30px rgba(255, 0, 229, 0.35)'
      },
      backgroundImage: {
        grid: 'radial-gradient(circle at 1px 1px, rgba(125,249,255,0.12) 1px, transparent 1px)',
      },
      backgroundSize: {
        grid: '40px 40px'
      }
    }
  },
  plugins: []
};

export default config;
