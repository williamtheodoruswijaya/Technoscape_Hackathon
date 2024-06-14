/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}",],
  theme: {
    extend: {
      colors: {
        'background': '#EEF5FF',
        'blues': '#170072',
        'bluesa': '#D2DAFF',
        'bluesk': '#4663AC',
        'bluesi': '#FFFFFF',
        'darkblue': '#170072',
        'lgtblue': '#0070E0',
        'lgtbluebg': '#D3E4F4',
        'darkbluebg': '#C5D7EB',
        'lightpurple': '#8D90FF',
        'reds': '#E00000', 
        'lightblue': '#00B3FF',
      },
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
      },
      fontWeight: {
        thin: 100,
        extralight: 200,
        light: 300,
        regular: 400,
        medium: 500,
        semibold: 600,
        bold: 700,
        extrabold: 800,
        black: 900,
      },
      fontStyle: {
        italic: 'italic',
        normal: 'normal',
      },
    },
  },
  plugins: [],
}

