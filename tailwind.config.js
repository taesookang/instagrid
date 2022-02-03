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
        ocean: "#375185",
      },
      keyframes: {
        scaleDown: {
          '0%': { transform: 'scale(1.5)' },
          '100%': { transform: 'scale(1)' },
        },
        scaleUp: {
          '0%': { transform: 'scale(0)'},
          '100%': { transform: 'scale(1)' },
        },
        
      },
      animation: {
        scaleDown: 'scaleDown .1s ease-out',
        scaleUp: 'scaleUp .5s ease-out',
      }
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
        // defaults to {}
        red: "#f00",
        "red-blue": ["#f00", "#00f"],
        "red-green-blue": ["#f00", "#0f0", "#00f"],
        "black-white-with-stops": ["#000", "#000 45%", "#fff 55%", "#fff"],
      },
    },
    repeatingLinearBorderGradients: (theme) => ({
      directions: theme("linearBorderGradients.directions"), // defaults to the same values as linearBorderGradients’ directions
      colors: theme("linearBorderGradients.colors"), // defaults to {}
      lengths: {
        // defaults to {}
        sm: "25px",
        md: "50px",
        lg: "100px",
      },
    }),
  },
  plugins: [require("tailwindcss-border-gradients")()],
};
