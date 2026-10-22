/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        parchment: {
          50: '#fcfaf6',
          100: '#f7f2ea',
          200: '#efe6d5',
          300: '#e5d6be',
          400: '#d5be9e',
          500: '#c2a57e',
          800: '#544332',
          900: '#352b20',
        },
        ink: {
          light: '#5c544c',
          DEFAULT: '#2c2523',
          dark: '#1b1716',
        },
        vermilion: {
          DEFAULT: '#c93f28',
          light: '#e0533c',
          dark: '#a22d1b',
        },
        jade: {
          DEFAULT: '#2d8b68',
          light: '#3ea880',
          dark: '#1e684d',
        },
        gold: {
          DEFAULT: '#b8860b',
          light: '#d4af37',
          dark: '#996515',
        }
      },
      fontFamily: {
        serif: ['"Noto Serif SC"', '"Songti SC"', '"STSong"', '"Source Han Serif CN"', 'SimSun', 'serif'],
        sans: ['"PingFang SC"', '"Hiragino Sans GB"', '"Microsoft YaHei"', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
