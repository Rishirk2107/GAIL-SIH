// tailwind.config.js
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#004d40',
        secondary: '#00796b',
      },
      fontFamily: {
        verdana: ['Verdana', 'sans-serif'],
      },
      keyframes: {
        vibrate: {
          '0%': { transform: 'translateX(0)' },
          '20%': { transform: 'translateX(-4px)' },
          '40%': { transform: 'translateX(4px)' },
          '60%': { transform: 'translateX(-4px)' },
          '80%': { transform: 'translateX(4px)' },
          '100%': { transform: 'translateX(0)' },
        },
      },
      animation: {
        vibrate: 'vibrate 0.6s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
