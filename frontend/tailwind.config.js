/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      // bghit l3aks dyal had  color for dark
      colors: {
        primary: "#FF4500", // Vibrant Orange-Red for large titles
        secondary: "#FFD700", // Gold for key highlights
        paragraph: "#E0E0E0", // Light Gray for small paragraphs
        subtle: "#B0B0B0", // Soft Silver for subtle text
        backgroundDark: "#1A1A1A", // Charcoal Black for dark background cards
        backgroundLight: "#F5F5F5", // Off-White for light background cards
        accentBright: "#FF6347", // Tomato Red for buttons and links
        accentSubtle: "#FFA500", // Soft Orange for gentle highlights
      },
    },
  },
  plugins: [],
};
