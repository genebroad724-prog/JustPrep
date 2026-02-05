import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // 关键设置1：使用相对路径，确保在 Netlify 等平台部署后能找到图片和 CSS
  base: './', 
  build: {
    // 关键设置2：保持 ES2015 标准，兼容性最好，能覆盖绝大多数 iOS/Android 版本
    target: 'es2015', 
    // 确保 CSS 也兼容较旧的渲染引擎
    cssTarget: 'chrome61',
    outDir: 'dist',
    // 提高警告阈值，防止无关紧要的警告干扰
    chunkSizeWarningLimit: 2000,
    // 确保生成 sourcemap (可选，但在排查白屏时有帮助)
    sourcemap: false,
  }
})
