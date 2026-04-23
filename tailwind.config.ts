import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./client/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
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
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
        treksure: {
          blue: "#2563eb",
          "blue-dark": "#1d4ed8",
          "blue-light": "#3b82f6",
          yellow: "#f59e0b",
          green: "#10b981",
          red: "#ef4444",
          gray: {
            50: "#f9fafb",
            100: "#f3f4f6",
            200: "#e5e7eb",
            300: "#d1d5db",
            400: "#9ca3af",
            500: "#6b7280",
            600: "#4b5563",
            700: "#374151",
            800: "#1f2937",
            900: "#111827",
          },
        },
        vibrant: {
          purple: {
            400: "#a855f7",
            500: "#9333ea",
            600: "#7c3aed",
            700: "#6d28d9",
          },
          pink: {
            400: "#f472b6",
            500: "#ec4899",
            600: "#db2777",
            700: "#be185d",
          },
          orange: {
            400: "#fb923c",
            500: "#f97316",
            600: "#ea580c",
            700: "#c2410c",
          },
          teal: {
            400: "#2dd4bf",
            500: "#14b8a6",
            600: "#0d9488",
            700: "#0f766e",
          },
          lime: {
            400: "#a3e635",
            500: "#84cc16",
            600: "#65a30d",
            700: "#4d7c0f",
          },
          cyan: {
            400: "#22d3ee",
            500: "#06b6d4",
            600: "#0891b2",
            700: "#0e7490",
          },
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      fontSize: {
        xs: "0.75rem",
        sm: "0.875rem",
        base: "1rem",
        lg: "1.125rem",
        xl: "1.25rem",
        "2xl": "1.5rem",
        "3xl": "1.875rem",
        "4xl": "2.25rem",
        "5xl": "3rem",
      },
      spacing: {
        "18": "4.5rem",
        "88": "22rem",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "gradient-vibrant": "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        "gradient-purple-pink":
          "linear-gradient(135deg, #a855f7 0%, #ec4899 100%)",
        "gradient-blue-purple":
          "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)",
        "gradient-teal-blue":
          "linear-gradient(135deg, #14b8a6 0%, #3b82f6 100%)",
        "gradient-orange-pink":
          "linear-gradient(135deg, #f97316 0%, #ec4899 100%)",
        "gradient-lime-cyan":
          "linear-gradient(135deg, #84cc16 0%, #06b6d4 100%)",
        "mesh-gradient":
          "linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #f5576c 75%, #4facfe 100%)",
      },
      boxShadow: {
        glow: "0 0 20px rgba(168, 85, 247, 0.4)",
        "glow-blue": "0 0 20px rgba(59, 130, 246, 0.4)",
        "glow-pink": "0 0 20px rgba(236, 72, 153, 0.4)",
        "glow-teal": "0 0 20px rgba(20, 184, 166, 0.4)",
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
        "gradient-x": {
          "0%, 100%": {
            "background-size": "200% 200%",
            "background-position": "left center",
          },
          "50%": {
            "background-size": "200% 200%",
            "background-position": "right center",
          },
        },
        "gradient-y": {
          "0%, 100%": {
            "background-size": "200% 200%",
            "background-position": "center top",
          },
          "50%": {
            "background-size": "200% 200%",
            "background-position": "center bottom",
          },
        },
        "gradient-xy": {
          "0%, 100%": {
            "background-size": "400% 400%",
            "background-position": "left center",
          },
          "50%": {
            "background-size": "200% 200%",
            "background-position": "right center",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "bounce-slow": "bounce 2s infinite",
        "gradient-x": "gradient-x 3s ease infinite",
        "gradient-y": "gradient-y 3s ease infinite",
        "gradient-xy": "gradient-xy 3s ease infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
