import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#111827",
        brand: "#6d5dfc",
        accent: "#22c55e"
      },
      boxShadow: {
        soft: "0 24px 80px rgba(17, 24, 39, 0.12)"
      }
    }
  },
  plugins: []
};

export default config;
