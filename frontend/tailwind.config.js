/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Host Grotesk', 'DM Sans', 'ui-sans-serif', 'system-ui', 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', 'Apple Color Emoji', 'Segoe UI Emoji'],
      },
      colors: {
        bias: {
          ideological: '#7c3aed',
          factual: '#10b981',
          framing: '#f59e0b',
          emotional: '#ef4444',
          transparency: '#06b6d4',
        },
      },
    },
  },
  plugins: [],
}