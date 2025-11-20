import type { Config } from "tailwindcss"

const c = (v: string) => `hsl(var(${v}))`

export default {
  content: ["./index.html","./src/**/*.{ts,tsx}"],
  darkMode: ["class"],
  theme: {
    container: { center: true, padding: "1rem", screens: { lg: "1024px", xl: "1200px", "2xl": "1400px" } },
    extend: {
      fontFamily: {
        sans: ["Inter","ui-sans-serif","system-ui","-apple-system","Segoe UI","Roboto","Helvetica","Arial"],
        display: ["DM Sans","Inter","ui-sans-serif","system-ui","-apple-system","Segoe UI","Roboto","Helvetica","Arial"]
      },
      colors: {
        background: c("--background"),
        foreground: c("--foreground"),
        muted: c("--muted"),
        "muted-foreground": c("--muted-foreground"),
        card: c("--card"),
        "card-foreground": c("--card-foreground"),
        popover: c("--popover"),
        "popover-foreground": c("--popover-foreground"),
        primary: c("--primary"),
        "primary-foreground": c("--primary-foreground"),
        secondary: c("--secondary"),
        "secondary-foreground": c("--secondary-foreground"),
        accent: c("--accent"),
        "accent-foreground": c("--accent-foreground"),
        destructive: c("--destructive"),
        "destructive-foreground": c("--destructive-foreground"),
        border: c("--border"),
        input: c("--input"),
        ring: c("--ring")
      },
      borderRadius: {
        xs: "var(--radius-xs)",
        sm: "var(--radius-sm)",
        md: "var(--radius-md)",
        lg: "var(--radius-lg)",
        "2xl": "var(--radius-2xl)"
      }
    }
  },
  plugins: []
} satisfies Config
