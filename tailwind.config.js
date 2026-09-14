/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        void: '#060810',
        panel: '#0c0f1c',
        'panel-2': '#10142a',
        frost: '#ECEFF6',
        muted: '#8891A8',
        'muted-2': '#5A6278',
        gold: {
          DEFAULT: '#C6A15B',
          bright: '#E9CD8C',
        },
        signal: '#5B7FFF',
        electric: {
          DEFAULT: '#5B7FFF',
          400: '#7B94FF',
          500: '#5B7FFF',
          600: '#4A6EEE',
        },
        navy: {
          900: '#121218',
          800: '#1a1a24',
          700: '#1e1e2a',
          600: '#2a2a38',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Space Grotesk', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      borderRadius: {
        'motion': '14px',
      },
    },
  },
  plugins: [],
};
