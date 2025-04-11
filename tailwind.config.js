module.exports = {
    darkMode: 'class',
    content: [
      './app/**/*.{js,ts,jsx,tsx}',
      './components/**/*.{js,ts,jsx,tsx}',
    ],
    theme: {
      extend: {
        colors: {
          dark: {
            800: '#1e293b',
            900: '#0f172a',
          },
        },
      },
    },
    plugins: [],
  }