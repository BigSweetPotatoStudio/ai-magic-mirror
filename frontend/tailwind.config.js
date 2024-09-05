/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      // keyframes: {
      //   shimmer: {
      //     "0%": { left: "-100%" },
      //     "100%": { left: "100%" },
      //   },
      // },
      // animation: {
      //   shimmer: "shimmer 0.5s linear",
      // },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      const newUtilities = {
        ".bg-button": {
          overflow: "hidden",
          "&::before": {
            content: '""',
            position: "absolute",
            top: "0",
            left: "-100%",
            width: "100%",
            height: "100%",
            background:
              "linear-gradient(120deg, transparent, rgba(255, 255, 255, 0.3), transparent)",
            transition: "all 0.5s",
          },
          "&:hover::before": {
            left: "100%",
          },
        },
      };
      addUtilities(newUtilities, ["hover"]);
    },
  ],
};
