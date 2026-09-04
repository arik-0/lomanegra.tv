import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", "sans-serif"],
        display: ["var(--font-display)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      colors: {
        background: "#08080a",
        "background-deep": "#050507",
        surface: "#0c0c10",
        "surface-02": "#101015",
        "surface-05": "#181822",
        "surface-raised": "#16161f",
        "border-subtle": "rgba(255, 255, 255, 0.07)",
        border: "#202026",
        primary: {
          DEFAULT: "#dc2626", // Red 600
          hover: "#ef4444",   // Red 500
          dark: "#991b1b",    // Red 800
          light: "#fee2e2",   // Red 100
        },
      },
      animation: {
        pulse: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "pulse-fast": "pulse 1.2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "forg1-dot": "pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
    },
  },
  plugins: [],
};

export default config;
