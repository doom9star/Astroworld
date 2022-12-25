/** @type {import('tailwindcss').Config} */
const colors = require("tailwindcss/colors");
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    colors: {
      awblack: "#484340",
      awred: "#d33d2f",
      awgreen: "#78c23b",
      ...colors,
    },
    extend: {},
  },
  plugins: [],
};
