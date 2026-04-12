/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        maroon: { DEFAULT: '#6B1F2A', light: '#8B2F3E', dark: '#4A1520' },
        gold: { DEFAULT: '#C9A028', light: '#E0B84A', dark: '#A07A18' },
        cream: { DEFAULT: '#F7F2EA', dark: '#EDE5D5' },
        heritage: '#1A0E08',
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['"Jost"', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
