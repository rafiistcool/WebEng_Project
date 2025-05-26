/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{vue,ts}'
  ],
  theme: {
    extend: {
      colors: {
        primary: '#6FB98F',
        secondary: '#2C7873',
        'background-1': '#021C1E',
        'background-2': '#004445',
        text: '#FFF',
        blackBackground: '#0000007F',
        boxShadow: '#00000033',
        grayBackground: '#FFFFFF26',
        sidebarBackground: '#333',
        toggleContainer: '#343434'
      },
      fontFamily: {
        sans: ['Arial', 'sans-serif']
      }
    }
  },
  plugins: []
}
