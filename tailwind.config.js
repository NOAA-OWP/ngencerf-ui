/** @type {import('tailwindcss').Config} */
export default {
  purge: ["./index.html", "./pages/**/*.{vue,js,ts,jsx,tsx}"],
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./app.vue",
    "./error.vue",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
