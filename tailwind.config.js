export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'bebas': ['Bebas Neue', 'sans-serif'],
        "manrope": ['Manrope, sans-serif' ]
      },
      cursor: {
        // 'fancy': url("https://www.flaticon.com/free-icon/mouse_1536479"),
      },
      colors: {
        'primary': '#D8D8D8',
        'secondary': '#999FBB',
        'white': '#FFFFFF',
        'LightBlue': '#A8BAFF',
        'LightBlue2': '#B9BDD6',
        'highGreen': '#D3E97A',
        'danger': '#dc3545',
        'matblue2': '#CBD0EF',
        'dark1': '#484848',
        // Add more custom colors as needed
      },
    },
    
    
  },
  plugins: [],
}