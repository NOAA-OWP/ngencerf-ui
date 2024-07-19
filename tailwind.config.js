/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./app.vue",
    "./error.vue",
  ],
  theme: {
    colors: {
      "buttonBackground": "#105d8e",
    },
    extend: {
      fontFamily: {
        "ObjektivMk2_Bd": ['ObjektivMk2_Bd', 'sans-serif'],
        "ObjektivMk2_Lt": ["ObjektivMk2_Lt", 'sans-serif'],
        "ObjektivMk2_Rg": ["ObjektivMk2_Rg", 'sans-serif'],
        "NeueFrutigerWorld-Bold": ["NeueFrutigerWorld-Bold", 'sans-serif'],
        "NeueFrutigerWorld-Book": ["NeueFrutigerWorld-Book", 'sans-serif'],
        "NeueFrutigerWorld-BookIt": ["NeueFrutigerWorld-BookIt", 'sans-serif'],
        "NeueFrutigerWorld-Medium": ["NeueFrutigerWorld-Medium", 'sans-serif'],
        "NeueFrutigerWorld-MediumIt": ["NeueFrutigerWorld-MediumIt", 'sans-serif'],
      },
    },
  },
  plugins: [],
};



