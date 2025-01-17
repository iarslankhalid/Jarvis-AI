/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Your original palette
        primary: "#E7BAB7",
        secondary: "#100F18",
        accent: "#D6945B",
        highlight: "#D65E9C",
        info: "#1227B3",
        light: "#D2D2D3",
        
        // Futuristic neon palette
        neonPink: "#ff007c",
        neonBlue: "#00d4ff",
        neonPurple: "#9d00ff",
        neonTeal: "#00ffcc",
      },
      boxShadow: {
        // Futuristic glowing shadows
        neon: '0 0 20px 4px rgba(255, 0, 124, 0.6)', // Neon pink
        neonBlue: '0 0 20px 4px rgba(0, 212, 255, 0.6)', // Neon blue
      },
      backgroundImage: {
        // Gradient backgrounds for futuristic style
        'neon-gradient': 'linear-gradient(90deg, #ff007c, #00d4ff)',
      },
      textShadow: {
        // Add glowing text effect
        glow: '0 0 5px #ff007c, 0 0 10px #ff007c, 0 0 20px #ff007c',
      },
    },
  },
  plugins: [
    require('tailwindcss-textshadow') // Add text-shadow utility for glowing text
  ],
};
