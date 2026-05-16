/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          dark: '#3D2B1F',
        },
        secondary: {
          brown: '#7A4E2D',
        },
        accent: {
          gold: '#B5863A',
        },
        cream: '#F5F0E8',
        text: {
          dark: '#1C1A14',
          muted: '#6B6555',
        }
      },
      fontFamily: {
        heading: ['Playfair Display', 'serif'],
        body: ['DM Sans', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
