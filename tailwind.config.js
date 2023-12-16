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
      backgroundImage: {
        'gold-metallic': 'linear-gradient(45deg, #ffd700 0%, #f8d568 50%, #ffd700 100%)',
        'silver-metallic': 'linear-gradient(45deg, #c0c0c0 0%, #e6e6e6 50%, #c0c0c0 100%)',
        'bronze-metallic': 'linear-gradient(45deg, #cd7f32 0%, #e5be8e 50%, #cd7f32 100%)',
      },
    },
  },
  plugins: [
    require('@egoist/tailwindcss-icons'),
  ],
}