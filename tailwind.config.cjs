/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {},
  },
  plugins: [require('@tailwindcss/typography')], // eslint-disable-line @typescript-eslint/no-require-imports
}; 