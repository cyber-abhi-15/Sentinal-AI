/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          900: '#0a0f1e',
          800: '#0d1530',
          700: '#111827',
        },
        charcoal: {
          900: '#161b26',
          800: '#1e2538',
          700: '#283149',
        },
        electric: {
          500: '#3b82f6',
          400: '#60a5fa',
        },
        teal: {
          500: '#14b8a6',
          400: '#2dd4bf',
        }
      }
    },
  },
  plugins: [],
}

