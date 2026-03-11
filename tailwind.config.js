/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          orange: '#F97316',
          red: '#EF4444',
        },
        session: {
          run: '#3B82F6',
          crossfit: '#F97316',
          hyrox: '#A855F7',
          recovery: '#22C55E',
        },
      },
    },
  },
  plugins: [],
}
