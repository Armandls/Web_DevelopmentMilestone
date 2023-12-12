/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Añade tus keyframes y animaciones aquí
      keyframes: {
        smoothBounce: {
          '0%, 100%': { transform: 'translateY(-10px)' },
          '50%': { transform: 'translateY(10px)' },
        },
      },
      animation: {
        'smooth-bounce': 'smoothBounce 2s ease-in-out infinite',
      },
    },
  },
  plugins: [
    require('@egoist/tailwindcss-icons'),
  ],
}