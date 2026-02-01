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
        // Modern Dark Mode - Vercel/Linear style with oklch
        background: "oklch(6 0.01 0.02)",
        foreground: "oklch(50 0.01 0.95)",
        card: "oklch(20 0.02 0.04)",
        "card-hover": "oklch(25 0.02 0.05)",
        border: "oklch(30 0.02 0.06)",
        "primary": "oklch(60 0.8 0.45)", // Vibrant purple/pink gradient
        "primary-light": "oklch(70 0.6 0.5)",
        "primary-dark": "oklch(50 1 0.4)",
        "secondary": "oklch(200 0.7 0.45)", // Muted purple/blue
        "accent": "oklch(150 0.7 0.5)", // Cyan/teal accent
        "success": "oklch(140 0.6 0.45)", // Green
        "warning": "oklch(40 0.8 0.5)", // Orange/amber
        "danger": "oklch(20 0.8 0.5)", // Red/pink
        "muted": "oklch(40 0.02 0.1)",
        "muted-light": "oklch(60 0.02 0.15)",
        "muted-foreground": "oklch(50 0.02 0.2)",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        "xs": "0.375rem",
        "sm": "0.5rem",
        "md": "0.75rem",
        "lg": "1rem",
        "xl": "1.5rem",
        "2xl": "2rem",
        "3xl": "3rem",
      },
      spacing: {
        "18": "4.5rem",
        "22": "5.5rem",
        "26": "6.5rem",
      },
      boxShadow: {
        "soft": "0 4px 6px -1px oklch(0 0 0 0 / 0.05)",
        "medium": "0 10px 15px -3px oklch(0 0 0 0 / 0.05)",
        "glow": "0 0 20px oklch(60 0.8 0.45 / 0.15)",
        "card": "0 4px 20px oklch(0 0 0 0 / 0.1)",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-out",
        "slide-up": "slideUp 0.5s ease-out",
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1)",
        "bounce-subtle": "bounce 1s infinite",
        "shake": "shake 0.5s ease-in-out",
        "scale-in": "scaleIn 0.3s ease-out",
        "shimmer": "shimmer 2s linear infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-1000px 0" },
          "100%": { backgroundPosition: "1000px 0" },
        },
        shake: {
          "0%, 100%": { transform: "translateX(0)" },
          "10%, 30%, 50%, 70%, 90%": { transform: "translateX(-5px)" },
          "20%, 40%, 60%, 80%": { transform: "translateX(5px)" },
        },
      },
      backdropBlur: {
        xs: "2px",
        sm: "4px",
        md: "8px",
        lg: "12px",
        xl: "20px",
      },
    },
  },
  plugins: [],
};

export default config;
