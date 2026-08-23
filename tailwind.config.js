/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        playfair: ['"Playfair Display"', 'serif'],
        poppins: ['Poppins', 'sans-serif'],
      },
      colors: {
        navy: '#040c21',
        'footer-dark': '#111315',
        'text-light': '#c4cfe1',
        'accent-blue': '#165dff',
        'accent-purple': '#6f71ed',
      },
    },
  },
  plugins: [],
}
