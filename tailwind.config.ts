import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        trust: "#0F766E",
        "trust-hover": "#0D9488",
        ink: "#0F172A",
        muted: "#64748B",
        priority: "#D97706",
        danger: "#DC2626",
        mint: "#ECFDF5",
        border: "#E2E8F0",
        surface: "#F8FAFC"
      },
      boxShadow: {
        card: "0 1px 3px rgba(15,23,42,.05), 0 8px 24px rgba(15,23,42,.04)"
      }
    }
  },
  plugins: []
};

export default config;