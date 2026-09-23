export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: "#FFF5E1",
        card: "#EFE2C6",
        burgundy: "#3B0A12",
        accent: "#9B1D30",
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'serif'],
        mono: ['"Courier Prime"', 'monospace'],
        script: ['"Caveat"', 'cursive'],
      },
    },
  },
  plugins: [],
}