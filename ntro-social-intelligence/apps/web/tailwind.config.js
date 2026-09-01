/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        ink: '#040817', // Deep Midnight Obsidian
        surface: '#080E24', // Frosted Glass Surface
        panel: '#0D1536', // Translucent Royal Panel
        panelHover: '#131E4A',
        border: '#1B2A63', // Subtle Cobalt Glass Border
        borderFocus: '#2D449E',
        accent: '#1D63FF', // Electric Royal Cobalt
        cobalt: '#0062FF',
        blue: {
          DEFAULT: '#1D63FF',
          400: '#60A5FA',
          500: '#3B82F6',
          600: '#1D63FF',
          700: '#0052FF',
        },
        violet: {
          DEFAULT: '#8B5CF6',
          300: '#C4B5FD',
          400: '#A78BFA',
          500: '#8B5CF6',
          600: '#7C3AED',
          700: '#6D28D9',
        },
        indigo: {
          DEFAULT: '#6366F1',
          400: '#818CF8',
          500: '#6366F1',
          600: '#4F46E5',
        },
        cyan: '#38BDF8', // Icy Sky Blue
        sky: '#38BDF8',
        neonCyan: '#38BDF8',
        teal: '#38BDF8',
        emerald: '#10B981', // Emerald Positive
        positive: '#10B981',
        success: '#10B981',
        highlight: '#F59E0B', // Amber
        amber: '#F59E0B',
        warning: '#F59E0B',
        text: '#F8FAFC',
        muted: '#94A3B8',
        negative: '#EF4444', // Crimson
        critical: '#EF4444',
        neutral: '#94A3B8',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        glow: '0 0 24px rgba(29, 99, 255, 0.4)',
        glowBlue: '0 0 28px rgba(0, 98, 255, 0.45)',
        glowViolet: '0 0 28px rgba(139, 92, 246, 0.45)',
        glowCyan: '0 0 24px rgba(56, 189, 248, 0.35)',
        glowAmber: '0 0 24px rgba(245, 158, 11, 0.35)',
        glass: '0 8px 32px 0 rgba(0, 0, 0, 0.5), inset 0 1px 1px 0 rgba(255, 255, 255, 0.15)',
        glassPill: '0 4px 20px 0 rgba(0, 98, 255, 0.2), inset 0 1px 1px 0 rgba(255, 255, 255, 0.25)',
        panel: '0 8px 32px rgba(4, 8, 23, 0.7), inset 0 1px 1px 0 rgba(255, 255, 255, 0.1)',
        card: '0 4px 24px rgba(0, 0, 0, 0.4), inset 0 1px 1px 0 rgba(255, 255, 255, 0.08)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'brand-gradient': 'linear-gradient(135deg, #0062FF 0%, #6366F1 50%, #8B5CF6 100%)',
        'brand-gradient-hover': 'linear-gradient(135deg, #1D63FF 0%, #7C3AED 50%, #A855F7 100%)',
        'cyber-glass': 'linear-gradient(135deg, rgba(13, 21, 54, 0.8) 0%, rgba(8, 14, 36, 0.9) 100%)',
        'neon-glow': 'radial-gradient(circle at 50% 0%, rgba(0, 98, 255, 0.2), transparent 70%)',
        'violet-glow': 'radial-gradient(circle at 50% 0%, rgba(139, 92, 246, 0.2), transparent 70%)',
      },
    },
  },
  plugins: [],
};
