/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{html,js}',  // Adjust these paths as needed
    './index.html',          // Include your main HTML file
  ],
  theme: {
    extend: {
      colors: {
        scarlet: '#FF2400',  // Custom scarlet color
      },
    },
  },
  plugins: [],
}

