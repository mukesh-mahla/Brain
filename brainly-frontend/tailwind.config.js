/** @type {import('tailwindcss').Config} */
export default {
  content: [ "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors:{
        purple : {
          200:"#e1e9ff",
          400:"#9da0cb",
          600:"#4b49db"
        },
        grey:{
          200:"#eeeeef",
          400:"#818181"
        }
      }
    },
  },
  plugins: [],
}

