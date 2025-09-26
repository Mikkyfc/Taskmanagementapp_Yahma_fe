/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    screens: {
      sm: "380px",
      md: "680px",
      lg: "980px",
      xl: "1180px"
    },
    extend: {
      
      keyframes: {
        move: {
          '50%': { transform: "translateY(-1rem)" },
        },
        rotate: {
          '0%': { transform: "rotate(0deg)" },
          '100%': { transform: "rotate(360deg)" },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scaleUp: {
          '0%': { transform: "scale(0.8)" },
          '50%': { transform: "scale(1.2)" },
          '100%': { transform: "scale(0.8)" },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInLeft: {
          '0%': { opacity: '0', transform: 'translateX(-30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        fadeInRight: {
          '0%': { opacity: '0', transform: 'translateX(30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        fadeInScale: {
          '0%': { opacity: '0', transform: 'scale(0.8)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        fadeInRotate: {
          '0%': { opacity: '0', transform: 'rotate(-10deg) scale(0.9)' },
          '100%': { opacity: '1', transform: 'rotate(0deg) scale(1)' },
        }
      },
      animation: {
        movingY: "move 3s linear infinite",
        rotating: "rotate 15s linear infinite",
        scalingUp: "scaleUp 3s linear infinite",
        fadeIn: 'fadeIn 0.7s ease-out',
        fadeInUp: 'fadeInUp 0.7s ease-out',
        fadeInLeft: 'fadeInLeft 0.7s ease-out',
        fadeInRight: 'fadeInRight 0.7s ease-out',
        fadeInScale: 'fadeInScale 0.7s ease-out',
        fadeInRotate: 'fadeInRotate 0.7s ease-out',
      },
      fontFamily: {
        jost: ["Jost", "serif"],
        lobster: ["Lobster", "sans-serif"],
        arial: ["Arial", "sans-serif"],
        lato: ["Lato", "sans-serif"],
        Montserrat: ["Montserrat", "sans-serif"],
        MonteCarlo: ["MonteCarlo", "cursive"],
      },
      container: {
        center: true,
        padding: {
          DEFAULT: '12px',
          md: '32px',
        },
      },
    },
  },
  plugins: [],
}
