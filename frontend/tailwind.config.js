/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#0d9488", // teal-600
          light: "#5eead4",   // teal-300
          dark: "#115e59",    // teal-800
        },
      },
    },
  },
  plugins: [],
};
