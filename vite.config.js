import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // 关键设置1：使用相对路径，确保在 Netlify 等平台部署后能找到图片和 CSS
  base: './', 
  // 关键设置2：针对 iOS Safari 的特殊补丁，防止因 global 变量缺失导致的白屏
  define: {
    global: 'window',
  },
  build: {
    // 关键设置3：单一目标策略。
    // 放弃多目标混合，强制降级到 es2015，这是目前兼容性最稳的方案
    target: 'es2015', 
    // 确保 CSS 也兼容较旧的渲染引擎
    cssTarget: 'chrome61',
    outDir: 'dist',
    // 防止代码分包过碎导致加载失败
    chunkSizeWarningLimit: 1000,
  }
})
