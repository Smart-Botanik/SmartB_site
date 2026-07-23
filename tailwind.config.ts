import type { Config } from "tailwindcss";

/** Theme CSS vars with working `/opacity` modifiers (color-mix). */
function themeColor(cssVar: `--${string}`) {
  return `color-mix(in srgb, var(${cssVar}) calc(100% * <alpha-value>), transparent)`;
}

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  darkMode: ["selector", '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        background: themeColor("--color-background"),
        surface: themeColor("--color-surface"),
        "surface-container-lowest": themeColor("--color-surface-container-lowest"),
        "surface-container-low": themeColor("--color-surface-container-low"),
        "surface-container": themeColor("--color-surface-container"),
        "surface-container-high": themeColor("--color-surface-container-high"),
        "surface-container-highest": themeColor("--color-surface-container-highest"),
        "on-surface": themeColor("--color-on-surface"),
        "on-background": themeColor("--color-on-surface"),
        "on-surface-variant": themeColor("--color-on-surface-variant"),
        outline: themeColor("--color-outline"),
        "outline-variant": themeColor("--color-outline-variant"),
        "surface-tint": themeColor("--color-surface-tint"),
        primary: themeColor("--color-primary"),
        "on-primary": themeColor("--color-on-primary"),
        "primary-container": themeColor("--color-primary-container"),
        "on-primary-container": themeColor("--color-on-primary-container"),
        "primary-fixed-dim": themeColor("--color-primary-fixed-dim"),
        secondary: themeColor("--color-secondary"),
        "secondary-container": themeColor("--color-secondary-container"),
        "secondary-fixed-dim": themeColor("--color-secondary-fixed-dim"),
        "tertiary-container": themeColor("--color-tertiary-container"),
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
