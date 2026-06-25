/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        base: "#0B0B0F",
        surface: "#15151C",
        violet: "#6D5EF5",
        neon: "#00F0D8",
        cyan: "#00F0D8",
        accent2: "#8B5CF6",
        ink: "#F5F5F7",
        graymuted: "#8A8A94",
        hairline: "#24242E",
      },
      fontFamily: {
        display: ["Space Grotesk", "sans-serif"],
        body: ["Inter", "sans-serif"],
      },
      boxShadow: {
        'glow-violet': '0 0 40px rgba(109, 94, 245, 0.15)',
        'glow-neon': '0 0 40px rgba(0, 240, 216, 0.15)',
        'glow-cyan': '0 0 40px rgba(0, 240, 216, 0.15)',
      },
      borderRadius: {
        'card': '8px',
        'subcard': '8px',
        'btn': '9999px',
      },
      letterSpacing: {
        tagline: "0.35em",
      },
    },
  },
  plugins: [],
}
