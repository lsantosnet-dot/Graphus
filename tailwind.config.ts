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
        background: "#050505",
        foreground: "#ededed",
        card: {
          DEFAULT: "rgba(10, 10, 10, 0.8)",
          foreground: "#ffffff",
        },
        primary: {
          DEFAULT: "#00f3ff", // Neon Cyan
          glow: "rgba(0, 243, 255, 0.5)",
        },
        secondary: {
          DEFAULT: "#0070f3", // Deep Blue
          glow: "rgba(0, 112, 243, 0.5)",
        },
        accent: {
          DEFAULT: "#ffea00", // Cyber Yellow
          glow: "rgba(255, 234, 0, 0.5)",
        },
        muted: "rgba(255, 255, 255, 0.4)",
        border: "rgba(255, 255, 255, 0.15)",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "cyber-grid": "linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)",
      },
      animation: {
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "glow-pulse": "glow 2s ease-in-out infinite",
      },
      keyframes: {
        glow: {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.5", transform: "scale(1.05)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
