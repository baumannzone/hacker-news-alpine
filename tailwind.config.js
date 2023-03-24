/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["*.html", "assets/*.js"],
  theme: { extend: {}, },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
