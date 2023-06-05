/** @type {import('tailwindcss').Config} */
const config = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        'primary': '#121130',
        'primary2': '#409E85',
        'primary2-m': '#4CC39B',
        'primary3': '#ff9100',
        'dark': '#252525'
      }
    },
  },
  plugins: [],
};

module.exports = config;
