import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#0d131f",
        surface: "#0d131f",
        "surface-container-lowest": "#080e1a",
        "surface-container-low": "#161c27",
        "surface-container": "#1a202c",
        "surface-container-high": "#242a36",
        "surface-container-highest": "#2f3542",
        "on-surface": "#dde2f3",
        "on-surface-variant": "#b9cbbc",
        outline: "#849587",
        "outline-variant": "#3b4a3f",
        "surface-tint": "#00e38b",
        primary: "#f4fff3",
        "on-primary": "#00391f",
        "primary-container": "#00ff9d",
        "on-primary-container": "#007143",
        "primary-fixed-dim": "#00e38b",
        secondary: "#94d3c1",
        "secondary-container": "#0b5345",
        "secondary-fixed-dim": "#94d3c1",
        "tertiary-container": "#ffdd65",
      },
      borderRadius: {
        DEFAULT: "0.5rem",
        lg: "0.75rem",
        xl: "1rem",
      },
      spacing: {
        gutter: "24px",
        "container-max": "1440px",
      },
      maxWidth: {
        "container-max": "1440px",
      },
      fontFamily: {
        display: ["var(--font-hanken)", "system-ui", "sans-serif"],
        headline: ["var(--font-hanken)", "system-ui", "sans-serif"],
        body: ["var(--font-inter)", "system-ui", "sans-serif"],
        label: ["var(--font-jetbrains)", "monospace"],
      },
      fontSize: {
        display: ["48px", { lineHeight: "56px", letterSpacing: "-0.02em", fontWeight: "700" }],
        "display-mobile": ["36px", { lineHeight: "44px", letterSpacing: "-0.02em", fontWeight: "700" }],
        headline: ["32px", { lineHeight: "40px", letterSpacing: "-0.01em", fontWeight: "600" }],
        "headline-mobile": ["24px", { lineHeight: "32px", fontWeight: "600" }],
        label: ["12px", { lineHeight: "16px", letterSpacing: "0.05em", fontWeight: "500" }],
      },
    },
  },
  plugins: [],
};

export default config;
