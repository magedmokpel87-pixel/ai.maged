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
        navy: {
          900: '#121218',
          800: '#1a1a24',
          700: '#1e1e2a',
          600: '#2a2a38',
        },
        electric: {
          500: '#8575ff',
          600: '#6b5ce7',
          400: '#a090ff',
          300: '#c4b8ff',
        },
      },
    },
  },
  plugins: [],
};
