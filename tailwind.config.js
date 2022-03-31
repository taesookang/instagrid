module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      minHeight: {
        section: "calc(100vh - 60px)",
      },

      dropShadow: {
        menu: "0 0px 3px rgba(0, 0, 0, 0.2)",
      },
      fontSize: {
        "2xs": "10px",
      },
      colors: {
        basic: {
          black: "#262626",
        },
        button: {
          primary: "#0096F6",
          disabled: "#C0DFFD",
        },
        ocean: "#375185",
      },
      keyframes: {
        scaleDown: {
          "0%": { transform: "scale(1.5)" },
          "100%": { transform: "scale(1)" },
        },
        scaleUp: {
          "0%": { transform: "scale(0)" },
          "100%": { transform: "scale(1)" },
        },
        scaleUpToDown: {
          "0%": { transform: "scale(1)" },
          "33%": { transform: "scale(1.2)" },
          "66%": { transform: "scale(0.8)" },
          "100%": { transform: "scale(1)" },
        },
      },
      animation: {
        scaleDown: "scaleDown .1s ease-out",
        scaleUp: "scaleUp .5s ease-out",
        scaleUpToDown: "scaleUpToDown .4s ease-out",
      },
      linearBorderGradients: {
        directions: {
          // defaults to these values
          t: "to top",
          tr: "to top right",
          r: "to right",
          br: "to bottom right",
          b: "to bottom",
          bl: "to bottom left",
          l: "to left",
          tl: "to top left",
        },
        colors: {
          "yellow-red-purple": ["#FFFB27","#FF0101", "#AB01FF"],
        },
        background: {
          "gray-50": "#F9FAFB",
        },
        borders: {
          // defaults to these values (optional)
          1: "1px",
          2: "2px",
          4: "4px",
        },
      },
    },
  },
  plugins: [
    require("@tailwindcss/line-clamp"),
    require("tailwindcss-border-gradient-radius"),
  ],
};
