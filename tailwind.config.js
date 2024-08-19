/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["*.{html,js}"],
  theme: {
    fontFamily: {
      'Poppins': ['Poppins', 'sans-serif'],
    },
  },
  plugins: [
    require('daisyui'),
  ],
}

