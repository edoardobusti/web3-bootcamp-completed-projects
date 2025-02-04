/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/*.{js,ts,jsx,tsx}",
    "./src/components/ui/*.{js,ts,jsx,tsx}",
    "./src/components/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      width: {
        400: "400px",
      },
    },
  },
  plugins: [],
};
