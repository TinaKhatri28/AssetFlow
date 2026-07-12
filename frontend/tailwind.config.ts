import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/features/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        black: "#111110",
        white: "#FAFAF6",
        paper: "#F2F1E9",
        yellow: "#FFD400",
        gray: "#726f66",
      },
    },
  },
  plugins: [],
};

export default config;