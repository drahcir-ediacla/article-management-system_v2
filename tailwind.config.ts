/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        'dark-blue': '#01132b',
        'navy-blue': '#19568c',
        'very-light-green': '#ecf4e7',
        'reddish-pink': '#ff0046',
        'light-gray': '#f9f9f9',
        'gray-101': '#f5f5f5',
      },
      fontSize: {
        'h1': '2rem'
      },
    },
  },
  plugins: [],
};
