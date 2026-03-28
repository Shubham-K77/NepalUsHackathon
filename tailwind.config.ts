import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "1rem",
      screens: { "2xl": "1400px" },
    },
    extend: {
      fontFamily: {
        devanagari: ["Noto Sans Devanagari", "sans-serif"],
        sans: ["Noto Sans Devanagari", "Inter", "sans-serif"],
      },
      fontSize: {
        "body-ne": ["20px", { lineHeight: "1.75" }],
        "body-sm-ne": ["18px", { lineHeight: "1.7" }],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        maroon: {
          DEFAULT: "#8B1A1A",
          50: "#FDF0F0",
          100: "#F9D5D5",
          200: "#F0ABAB",
          300: "#E47B7B",
          400: "#D44F4F",
          500: "#C44545",
          600: "#A83232",
          700: "#8B1A1A",
          800: "#6B1313",
          900: "#4A0D0D",
        },
        gold: {
          DEFAULT: "#C8962A",
          50: "#FDF8ED",
          100: "#F8EECB",
          200: "#F0D899",
          300: "#E6C068",
          400: "#DAAB3D",
          500: "#C8962A",
          600: "#A67A20",
          700: "#845F17",
          800: "#61440F",
          900: "#3F2C07",
        },
        sage: {
          DEFAULT: "#5B8C5A",
          50: "#EFF5EF",
          100: "#D5E8D4",
          200: "#AACFA9",
          300: "#80B67F",
          400: "#6AA068",
          500: "#5B8C5A",
          600: "#4A7248",
          700: "#385836",
          800: "#273E25",
          900: "#162315",
        },
        cream: {
          DEFAULT: "#FAF3E0",
          100: "#FAF3E0",
          200: "#F5E9C5",
          300: "#EFDDA8",
          400: "#E8CF8A",
        },
        warmBrown: "#8B5E3C",
        darkText: "#2C1810",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        fadeIn: {
          from: { opacity: "0", transform: "translateY(12px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        slideUp: {
          from: { opacity: "0", transform: "translateY(24px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fadeIn 0.5s ease-out",
        "slide-up": "slideUp 0.6s ease-out",
      },
    },
  },
  plugins: [animate],
};

export default config;
