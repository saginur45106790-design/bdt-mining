/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brandDark: '#0A0D14',
        brandCard: '#131822',
        brandGold: '#E5A93C',
        brandGoldLight: '#FFC857',
        brandGreen: '#00C853',
      }
    },
  },
  plugins: [],
}
