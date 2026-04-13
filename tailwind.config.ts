import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#141312", // Deep charcoal
        foreground: "#E6E2DF", // Off-white
        card: {
          DEFAULT: "rgba(25, 24, 23, 0.6)",
          foreground: "#E6E2DF",
        },
        primary: {
          DEFAULT: "#A3B18A", // Soft Sage Green
          glow: "rgba(163, 177, 138, 0.3)",
        },
        secondary: {
          DEFAULT: "#588157", // Deeper Sage
          glow: "rgba(88, 129, 87, 0.3)",
        },
        accent: {
          DEFAULT: "#A3B18A",
          glow: "rgba(163, 177, 138, 0.3)",
        },
        muted: "rgba(230, 226, 223, 0.4)",
        border: "rgba(230, 226, 223, 0.1)",
      },
      fontFamily: {
        serif: ["var(--font-playfair)", "serif"],
        sans: ["var(--font-manrope)", "sans-serif"],
      },
      backgroundImage: {
        "garden-gradient": "radial-gradient(circle at 50% -20%, rgba(163, 177, 138, 0.15) 0%, transparent 50%), radial-gradient(circle at 0% 100%, rgba(88, 129, 87, 0.1) 0%, transparent 50%)",
      },
      animation: {
        "pulse-slow": "pulse 6s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "fade-in": "fadeIn 1s ease-out forwards",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
