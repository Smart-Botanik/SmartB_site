import type { Config } from "tailwindcss";



const config: Config = {

  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],

  theme: {

    extend: {

      colors: {

        background: "var(--color-background)",

        surface: "var(--color-surface)",

        "surface-container-lowest": "var(--color-surface-container-lowest)",

        "surface-container-low": "var(--color-surface-container-low)",

        "surface-container": "var(--color-surface-container)",

        "surface-container-high": "var(--color-surface-container-high)",

        "surface-container-highest": "var(--color-surface-container-highest)",

        "on-surface": "var(--color-on-surface)",

        "on-background": "var(--color-on-surface)",

        "on-surface-variant": "var(--color-on-surface-variant)",

        outline: "var(--color-outline)",

        "outline-variant": "var(--color-outline-variant)",

        "surface-tint": "var(--color-surface-tint)",

        primary: "var(--color-primary)",

        "on-primary": "var(--color-on-primary)",

        "primary-container": "var(--color-primary-container)",

        "on-primary-container": "var(--color-on-primary-container)",

        "primary-fixed-dim": "var(--color-primary-fixed-dim)",

        secondary: "var(--color-secondary)",

        "secondary-container": "var(--color-secondary-container)",

        "secondary-fixed-dim": "var(--color-secondary-fixed-dim)",

        "tertiary-container": "var(--color-tertiary-container)",

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

      boxShadow: {

        "accent-sm": "0 0 20px var(--color-accent-glow)",

        "accent-md": "0 0 30px var(--color-accent-glow-strong)",

        "card-hover": "0 20px 40px var(--color-shadow-soft)",

      },

    },

  },

  plugins: [],

};



export default config;


