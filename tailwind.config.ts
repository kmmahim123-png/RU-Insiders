import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        ru: {
          crimson: "#881337",
          maroon: "#4c0519",
          red: "#be123c",
          gold: "#f59e0b",
          goldDark: "#d97706",
          navy: "#0f172a",
          surface: "#020617",
          card: "#0f172a",
          border: "#1e293b",
          emerald: "#10b981",
        },
      },
      fontFamily: {
        sans: ["var(--font-plus-jakarta)", "sans-serif"],
        bengali: ["var(--font-hind-siliguri)", "sans-serif"],
      },
      borderRadius: {
        squircle: "1.25rem",
      },
      boxShadow: {
        glow: "0 0 25px -5px rgba(245, 158, 11, 0.25)",
        emeraldGlow: "0 0 25px -5px rgba(16, 185, 129, 0.25)",
        crimsonGlow: "0 0 25px -5px rgba(190, 18, 60, 0.35)",
      },
    },
  },
  plugins: [],
};
export default config;
