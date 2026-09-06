/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#FA9114',
          dark: '#E07D0A',
          light: '#FFB04D',
        },
        secondary: {
          DEFAULT: '#4A4A4A',
          dark: '#333333',
          light: '#6B6B6B',
        },
        bg: {
          DEFAULT: '#FFFFFF',
          alt: '#F5F5F5',
        },
        text: {
          DEFAULT: '#4A4A4A',
          light: '#6B6B6B',
        },
        border: {
          DEFAULT: '#E0E0E0',
        },
      },
      fontFamily: {
        serif: ['Playfair Display', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
