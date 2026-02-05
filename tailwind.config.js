/** @type {import('tailwindcss').Config} */
export default {
  // 关键在这里：告诉它去 index.html 和 src 文件夹里找代码
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // 这里的颜色配置必须有，否则App里的 'bg-khaki' 等颜色会失效
      colors: {
        khaki: '#D7C4A6',
        navy: '#2C3E66', 
        bronze: '#B8860B',
        silver: '#F5F5F7',
        charcoal: '#333333'
      }
    },
  },
  plugins: [],
}