/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          blue: '#1E90FF',
          blueHover: '#1873CC',
          blueLight: '#E8F4FD',
          blueDark: '#0D5FB8',
        },
        secondary: {
          gold: '#D4AF37',
          goldHover: '#B8962E',
        },
        neutrals: {
          black: '#000000',
          darkGray: '#2B2B2B',
          mediumGray: '#4A4A4A',
          lightGray: '#F5F5F5',
          borderGray: '#E0E0E0',
          white: '#FFFFFF',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'button': '0 4px 12px rgba(30, 144, 255, 0.25)',
        'button-hover': '0 6px 16px rgba(30, 144, 255, 0.35)',
      },
    },
  },
  plugins: [],
}

