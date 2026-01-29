/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        kraft: "#C4A77D",
        charcoal: "#2D2D2D",
        "border-neutral": "#E8E4DE",
        muted: "#5A5A5A",
        "footer-muted": "#A0A0A0",
        "footer-border": "#3D3D3D",
        "green-accent": "#5B8C5A",
        background: "#FAFAF8",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        heading: ["DM Sans", "Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
