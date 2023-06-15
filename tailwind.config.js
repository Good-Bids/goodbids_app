const defaultTheme = require("tailwindcss/defaultTheme");

/** @type {import('tailwindcss').Config} */
const config = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        black: "#000000",
        white: "#ffffff",
        "outerSpace-900": "#232826",
        "outerSpace-800": "#393d3c",
        "outerSpace-700": "#4f5351",
        "outerSpace-600": "#656967",
        "outerSpace-500": "#7b7e7d",
        "outerSpace-400": "#919493",
        "outerSpace-300": "#a7a9a8",
        "outerSpace-200": "#bdbfbe",
        "outerSpace-100": "#d3d4d4",
        "outerSpace-50": "#e9eae9",
        bottleGreen: "#0a3624",
        screaminGreen: "#70FF8F",
        hintOfGreen: "#D9FFD2",
        pompadour: "#68004B",
        cornflowerLilac: "#FFB3B3",
        fairPink: "#FFE7EF",
        "cw-blue": "#003366",
        "bo-red": "#CC2126",
      },
      fontFamily: {
        sans: ["Inter var", ...defaultTheme.fontFamily.sans],
      },
      keyframes: {
        slideDown: {
          from: { height: "0", width: "0" },
          to: {
            height: "var(--radix-accordion-content-height)",
            width: "var(--radix-accordion-content-width)",
          },
        },
        slideUp: {
          from: {
            height: "var(--radix-accordion-content-height)",
            width: "var(--radix-accordion-content-width)",
          },
          to: { height: "0", width: "0" },
        },
      },
      animation: {
        slideDown: "slideDown 300ms cubic-bezier(0.87, 0, 0.13, 1)",
        slideUp: "slideUp 300ms cubic-bezier(0.87, 0, 0.13, 1)",
      },
    },
  },
  // @ts-ignore
  plugins: [require("tailwindcss-animate")],
};

module.exports = config;
