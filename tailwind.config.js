/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        app: {
          primary: '#1a472a',
          accent: '#2d6a4f',
          highlight: '#52b788',
          background: '#0d1117',
          surface: '#161b22',
          elevated: '#21262d',
          border: '#30363d',
          'text-primary': '#f0f6fc',
          'text-secondary': '#8b949e',
          'halal-green': '#238636',
          'halal-amber': '#9e6a03',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

