import type { Config } from "tailwindcss"

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Define a consistent color palette
        primary: "#4CAF50", // Green
        secondary: "#FF9800", // Orange
        accent: "#9C27B0", // Purple
        background: "#f0f0f0", // Light Gray
        foreground: "#333333", // Dark Gray
        muted: "#999999", // Medium Gray
        card: "#FFFFFF", // White
        "card-foreground": "#333333", // Dark Gray
        popover: "#FFFFFF", // White
        "popover-foreground": "#333333", // Dark Gray
        border: "#E0E0E0", // Light Gray
        input: "#E0E0E0", // Light Gray
        ring: "#4CAF50", // Green
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
export default config
