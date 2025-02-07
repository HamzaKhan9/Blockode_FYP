/** @type {import('tailwindcss').Config} */

export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: "var(--color-primary)",
        primaryLight: "var(--color-primary-light)",
        primaryDark: "var(--color-primary-dark)",
        secondary: "var(--color-secondary)",
        secondaryLight: "var(--color-secondary-light)",
        secondaryDark: "var(--color-secondary-dark)",
        bgFirst: "var(--color-bg-primary)",
        bgSecond: "var(--color-bg-secondary)",
        text: "var(--color-text)",
        textLight: "var(--color-text-light)",
        success: "var(--color-success)",
        successDark: "var(--color-success-dark)",
        danger: "var(--color-danger)",
        transparent: "transparent",
        current: "currentColor",
        light: "var(--color-light)",
      },
      fontFamily: {
        heading: ["Cherry Bomb One", "cursive"],
      },
      scale: {
        "-100": "-1",
      },
    },
    screens: {
      "2xl": { max: "1535px" },

      xl: { max: "1279px" },

      lg: { max: "1137px" },

      md: { max: "780px" },

      sm: { max: "639px" },
      xs: { max: "400px" },
    },
  },
  plugins: [require("flowbite/plugin")],
};
