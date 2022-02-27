const colors = require("tailwindcss/colors");
const path = require("path");

module.exports = {
  content: ["./index.html", "src/**/*.tsx"].map((str) =>
    path.relative(process.cwd(), path.resolve(__dirname, str))
  ),
  theme: {
    colors: {
      charcoal: '#343837',
      'ocean-blue': '#03719C',
      'blue-green': '#0F8B8E',
      butterscotch: '#FDB147',
      transparent: "transparent",
      gray: colors.gray,
      red: colors.rose,
      green: colors.teal,
      blue: colors.cyan,
      orange: colors.amber,
      white: colors.white,
      black: colors.black,
    },
    fontFamily: {
      sans: [
        "-apple-system",
        "BlinkMacSystemFont",
        "Segoe UI",
        "Roboto",
        "Oxygen",
        "Ubuntu",
        "Cantarell",
        "Fira Sans",
        "Droid Sans",
        "Helvetica Neue",
        "sans-serif",
      ],
    },
    extend: {},
  },
  plugins: [require("@tailwindcss/forms")],
};
