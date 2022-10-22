/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        'dark-blue-1': '#102857',
        'dark-blue-2': '#021334',
        'dark-blue-3': '#0b2450',
        'dark-blue-4': '#0a234d',
        'dark-blue-5': '#031a3e',
        'light-gray-1': '#fbfcfb'
      }
    },
  },
  plugins: [],
}
