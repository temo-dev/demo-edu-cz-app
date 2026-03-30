/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Be Vietnam Pro"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        brand: {
          green: '#58CC02',
          'green-dark': '#46A302',
          blue: '#1CB0F6',
          'blue-dark': '#0B8DC9',
          red: '#FF4B4B',
          yellow: '#FFC800',
          purple: '#CE82FF',
          'purple-dark': '#A560E8',
          orange: '#FF9600',
        },
        babbel: {
          orange: '#E05A2B',
          'orange-dark': '#C44E22',
          cream: '#F2EDE4',
          'cream-dark': '#E8E0D4',
          bg: '#FAFAF8',
          text: '#1A1A1A',
          muted: '#6B6B6B',
          border: '#E8E4DC',
        },
      },
      keyframes: {
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
      },
      animation: {
        wiggle: 'wiggle 0.3s ease-in-out',
      },
    },
  },
  plugins: [],
}
