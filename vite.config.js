import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // 关键设置1：使用相对路径，确保在 Netlify 等平台部署后能找到图片和 CSS
  base: './', 
  build: {
    // 关键设置2：降低代码打包标准
    // 'es2015' 和 'ios12' 确保代码能翻译成旧手机也能读懂的格式
    // 这就是解决 iPhone 13 白屏的核心代码
    target: ['es2015', 'ios12'], 
    cssTarget: ['chrome61', 'firefox60', 'safari11', 'edge18'],
    outDir: 'dist',
  }
})
