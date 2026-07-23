/** @type {import('tailwindcss').Config} */
/**
 * ═══════════════════════════════════════════════════════════════════════════
 * Tailwind config — ToolPool black + safety-yellow workshop look
 * ═══════════════════════════════════════════════════════════════════════════
 * WHY: We extend Tailwind with brand colors instead of default purple/blue.
 * Fonts: Oswald (display) + IBM Plex Sans (body) — not Inter/Roboto.
 */
export default {
  content: [
    // Scan these files for class names so Tailwind keeps only what we use
    './index.html',
    './src/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        ink: '#0A0A0A',          // near-black
        paper: '#F5F2E8',        // warm off-white
        signal: {
          DEFAULT: '#F5C518',    // safety yellow
          dark: '#C9A012',       // hover
        },
        steel: '#3D3D3D',        // secondary text / borders
        danger: '#B91C1C',
        ok: '#166534',
      },
      fontFamily: {
        display: ['Oswald', 'Impact', 'sans-serif'],
        sans: ['"IBM Plex Sans"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        // flat, hard offset — workshop sticker vibe (not soft AI glow)
        stamp: '4px 4px 0 0 #0A0A0A',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.4s ease-out both',
      },
    },
  },
  plugins: [],
}
