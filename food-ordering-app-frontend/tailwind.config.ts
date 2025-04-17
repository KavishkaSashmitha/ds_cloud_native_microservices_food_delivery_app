import type { Config } from "tailwindcss"

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
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
        // Light Theme
        border: "hsl(25, 30%, 85%)",               // Warm beige border
        input: "hsl(0, 0%, 100%)",                 // White input
        ring: "hsl(8, 78%, 56%)",                 // Tomato red focus ring
        background: "hsl(45, 50%, 98%)",           // Warm creamy white
        foreground: "hsl(25, 30%, 20%)",           // Warm dark brown text
        primary: {
          DEFAULT: "hsl(8, 78%, 56%)",             // Vibrant tomato red
          foreground: "hsl(0, 0%, 100%)",          // White text
        },
        secondary: {
          DEFAULT: "hsl(154, 48%, 49%)",           // Fresh herb green
          foreground: "hsl(0, 0%, 100%)",          // White text
        },
        destructive: {
          DEFAULT: "hsl(0, 84%, 60%)",            // Bright red
          foreground: "hsl(0, 0%, 100%)",          // White text
        },
        muted: {
          DEFAULT: "hsl(45, 30%, 95%)",           // Soft cream
          foreground: "hsl(25, 15%, 45%)",         // Warm gray text
        },
        accent: {
          DEFAULT: "hsl(42, 94%, 55%)",            // Golden yellow
          foreground: "hsl(25, 30%, 20%)",         // Dark brown text
        },
        popover: {
          DEFAULT: "hsl(0, 0%, 100%)",             // White
          foreground: "hsl(25, 30%, 20%)",         // Dark brown text
        },
        card: {
          DEFAULT: "hsl(0, 0%, 100%)",            // White
          foreground: "hsl(25, 30%, 20%)",        // Dark brown text
        },
        
        // Dark Theme
        dark: {
          border: "hsl(25, 15%, 25%)",             // Dark warm gray
          input: "hsl(25, 20%, 15%)",              // Deep brown
          ring: "hsl(8, 82%, 65%)",               // Brighter tomato
          background: "hsl(25, 20%, 10%)",        // Rich dark brown
          foreground: "hsl(45, 50%, 90%)",        // Creamy text
          primary: {
            DEFAULT: "hsl(8, 82%, 65%)",          // Brighter tomato
            foreground: "hsl(0, 0%, 100%)",       // White
          },
          secondary: {
            DEFAULT: "hsl(154, 58%, 59%)",        // Brighter green
            foreground: "hsl(25, 20%, 10%)",      // Dark brown
          },
          destructive: {
            DEFAULT: "hsl(0, 89%, 70%)",          // Brighter red
            foreground: "hsl(0, 0%, 100%)",       // White
          },
          muted: {
            DEFAULT: "hsl(25, 15%, 20%)",         // Dark muted
            foreground: "hsl(45, 30%, 80%)",     // Light cream
          },
          accent: {
            DEFAULT: "hsl(42, 94%, 65%)",        // Brighter gold
            foreground: "hsl(25, 20%, 10%)",     // Dark brown
          },
          popover: {
            DEFAULT: "hsl(25, 20%, 15%)",        // Dark card
            foreground: "hsl(45, 50%, 90%)",     // Cream text
          },
          card: {
            DEFAULT: "hsl(25, 20%, 12%)",         // Slightly darker
            foreground: "hsl(45, 50%, 90%)",      // Cream text
          },
        },
        
        // Restaurant-specific colors
        food: {
          red: "hsl(8, 78%, 56%)",                // Tomato
          green: "hsl(154, 48%, 49%)",           // Herb
          yellow: "hsl(42, 94%, 55%)",           // Spice
          brown: "hsl(25, 50%, 40%)",             // Wood/rustic
          cream: "hsl(45, 50%, 95%)",             // Plate color
        },
      },
      borderRadius: {
        lg: "0.75rem",  // Slightly rounded for softness
        md: "0.5rem",
        sm: "0.25rem",
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
        "pulse-slow": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.8" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "pulse-slow": "pulse-slow 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      fontFamily: {
        heading: ["var(--font-playfair)", "serif"],  // Elegant for headings
        body: ["var(--font-inter)", "sans-serif"],  // Clean for body
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config
