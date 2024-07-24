module.exports = {
  mode: "jit",
  purge: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "var(--color-primary)",
        "primary-variant": "var(--color-primary-variant)",
        "on-primary": "var(--color-on-primary)",
        secondary: "var(--color-secondary)",
        "secondary-variant": "var(--color-secondary-variant)",
        "on-secondary": "var(--color-on-secondary-variant)",

        background: "var(--color-background)",
        "on-background": "var(--color-on-background)",
        //dark: "var(--color-dark)",
        "on-dark": "var(--color-on-dark)",
        surface: "var(--color-surface)",
        "on-surface": "var(--color-on-surface)",
        light: "var(--color-text-light)",
        error: "var(--color-error)",
        "on-error": "var(--color-on-error)",
        dark: {
          300: "var(--color-dark-300)",
          700: "var(--color-dark-700)",
          900: "var(--color-dark-900)",
        },
        orange:"#D98500",
        orangelight:"var(--color-orange-light)",
        orangebg:"#FFD162",
      },
      transitionProperty: {
        height: "height",
        spacing: "margin, padding",
      },
      gridTemplateRows: {
        page: "5vh calc(90vh)",
      },
      gridTemplateColumns: {
        page: "250px auto",
        "page-sm": "4rem auto",
      },
      
    },
    fontSize: {
      "2xs": ["11px", { lineHeight: "1.3", letterSpacing: "-0.3px", fontWeight: "300" }],
      xs: ["0.75rem", { lineHeight: "1rem", letterSpacing: "-0.36px", fontWeight: "300" }],
      sm: ["0.875rem", { lineHeight: "1.25rem", letterSpacing: "-0.42px" }],
      base: ["1rem", { lineHeight: "1.6", letterSpacing: "-0.48px" }],
      lg: ["1.125rem", { lineHeight: "1.75rem", letterSpacing: "-0.72px" }],
      xl: ["1.25rem", { lineHeight: "1.75rem", letterSpacing: "-0.8px" }],
      "2xl": ["1.5rem", { lineHeight: "2rem", letterSpacing: "-1.04px" }],
      "3xl": ["2rem", { lineHeight: "2.25rem", letterSpacing: "-1.2px" }],
      "4xl": ["2.25rem", { lineHeight: "2.5rem", letterSpacing: "-1.44px" }],
      "5xl": ["3rem", { letterSpacing: "-1.6px" }],
      "6xl": ["3.75rem", { letterSpacing: "-1.8px" }],
      "7xl": ["4.5rem", { letterSpacing: "-2px" }],
      "8xl": ["6rem", { letterSpacing: "-2.4px" }],
      "9xl": ["8rem", { letterSpacing: "-3.2px" }],
    },
  },
  plugins: [],
};
