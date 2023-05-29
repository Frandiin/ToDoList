const plugins = require("tailwindcss/plugin");

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [
    plugins(({ addBase }) => {
      addBase({
        "*": {
          fontFamily: "Roboto",
        },
      });
    }),
  ],
};
