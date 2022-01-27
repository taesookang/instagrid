module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        button: {
          primary: "#0096F6",
          disabled: "#C0DFFD",
        },
        ocean: "#375185"
      },
    },
  },
  plugins: [],
};
