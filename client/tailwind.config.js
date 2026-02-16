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
          50: '#fef7ee',
          100: '#fdedd6',
          200: '#fad7ad',
          300: '#f6ba79',
          400: '#f19343',
          500: '#ed751f',
          600: '#de5b15',
          700: '#b84313',
          800: '#933517',
          900: '#772e16',
          950: '#401409',
        },
        bazaar: {
          gold: '#D4AF37',
          amber: '#F59E0B',
        }
      },
      fontFamily: {
        'display': ['Playfair Display', 'serif'],
        'sans': ['Outfit', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
