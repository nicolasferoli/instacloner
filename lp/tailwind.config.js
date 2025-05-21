/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        instagram: {
          purple: '#8a3ab9',
          pink: '#e95950',
          yellow: '#fccc63',
          blue: '#5851db',
        },
        dark: {
          100: '#2d3748',
          200: '#1a202c',
          300: '#171923',
          400: '#0d1117',
        }
      },
      backgroundImage: {
        'insta-gradient': 'linear-gradient(45deg, #8a3ab9, #e95950, #fccc63, #5851db)',
        'dark-gradient': 'linear-gradient(to bottom, #1a202c, #0d1117)',
      },
      fontFamily: {
        sans: ['Inter var', 'sans-serif'],
      },
      boxShadow: {
        'insta': '0 4px 14px 0 rgba(138, 58, 185, 0.2)',
      },
    },
  },
  plugins: [],
};