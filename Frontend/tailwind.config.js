

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        bounce: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      },
      animation: {
        float: 'float 4s ease-in-out infinite',
        bounce: 'bounce 2s ease-in-out infinite',
        'spin-slow': 'spin 20s linear infinite',
        pulse: 'pulse 2s infinite',
      },
    },
  },
  plugins: [require('daisyui')],
  daisyui: {
    themes: [
      "light",     
      "synthwave", 
      "dark",      
      "cupcake",   
    ],
  },
}
