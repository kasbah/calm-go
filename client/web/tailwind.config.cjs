const colors = require("tailwindcss/colors");
const path = require("path");

module.exports = {
  content: ["./index.html", "src/**/*.tsx"].map((str) =>
    path.relative(process.cwd(), path.resolve(__dirname, str))
  ),
  theme: {},
  variants: {},
  plugins: [require("@tailwindcss/forms")],
};
