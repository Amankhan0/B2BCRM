/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"], // ✅ Include your project files
  theme: {
    extend: {
      colors: {
        themeBlue: "#432A77",
      },
    },
  },
  plugins: [],
};
