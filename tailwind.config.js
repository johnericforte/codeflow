/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Brand palette from project_plan.md
        primary: {
          DEFAULT: "#2463EB",
          light: "#4A85F2",
          dark: "#1A4FBF",
        },
        accent: {
          DEFAULT: "#06D6A0",
          light: "#34E0B5",
          dark: "#04B386",
        },
        bg: {
          primary: "#0A0E17",
          secondary: "#111827",
          tertiary: "#1F2937",
        },
        brand: {
          text: "#F9FAFB",
          muted: "#9CA3AF",
          subtle: "#6B7280",
        },
        editor: {
          bg: "#0D1117",
          gutter: "#161B22",
          highlight: "#1A2233",
        },
      },
      fontFamily: {
        sans: ["var(--font-dm-sans)", "sans-serif"],
        mono: ["var(--font-jetbrains-mono)", "monospace"],
        display: ["var(--font-syne)", "sans-serif"],
      },
    },
  },
  plugins: [],
};
