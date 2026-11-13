import type { Config } from "tailwindcss";

// Palette ported straight from the existing Stacks dashboard artifact, so the
// app and the dashboard never visually drift apart.
const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        paper: "var(--paper)",
        surface: "var(--surface)",
        "surface-soft": "var(--surface-soft)",
        line: "var(--line)",
        ink: "var(--ink)",
        "ink-soft": "var(--ink-soft)",
        "ink-faint": "var(--ink-faint)",
        accent: "var(--accent)",
        "accent-ink": "var(--accent-ink)",
        brass: "var(--brass)",
        cat: {
          finance: "var(--cat-finance)",
          ai: "var(--cat-ai)",
          sysdesign: "var(--cat-sysdesign)",
          interview: "var(--cat-interview)",
          other: "var(--cat-other)",
        },
        danger: "var(--danger)",
      },
      fontFamily: {
        sans: ["IBM Plex Sans", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["IBM Plex Mono", "ui-monospace", "SF Mono", "monospace"],
        display: ["Fraunces", "Georgia", "Times New Roman", "serif"],
      },
    },
  },
  plugins: [],
};

export default config;
