/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./resources/views/**/*.blade.php",
    "./resources/js/**/*.{js,jsx,ts,tsx}",
  ],
  safelist: [
    // Semua warna yang mungkin dikirim dari backend
    'bg-cyan-500',
    'bg-red-500',
    'bg-blue-500',
    'bg-yellow-500',
    'bg-teal-500',
    'bg-pink-500',
    'bg-purple-500',
    'text-cyan-500',
    'text-red-500',
    'text-blue-500',
    'text-yellow-500',
    'text-teal-500',
    'text-purple-500',
    'text-pink-500',
  ],
  theme: {
    extend: {
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
      },
      keyframes: {
        wave: {
          '0%': { transform: 'rotate(0deg)' },
          '10%': { transform: 'rotate(14deg)' },
          '20%': { transform: 'rotate(-8deg)' },
          '30%': { transform: 'rotate(14deg)' },
          '40%': { transform: 'rotate(-4deg)' },
          '50%': { transform: 'rotate(10deg)' },
          '60%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(0deg)' },
        },
      },
      animation: {
        wave: 'wave 2s infinite ease-in-out',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}