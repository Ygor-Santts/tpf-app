import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'node:path'
export default defineConfig({
  plugins: [vue()],
  server: { host: true, port: 5173 },
  resolve: { alias: {
    '@app': path.resolve(__dirname, 'src/application'),
    '@domain': path.resolve(__dirname, 'src/domain'),
    '@infra': path.resolve(__dirname, 'src/infra'),
    '@shared': path.resolve(__dirname, 'src/shared'),
    '@ui': path.resolve(__dirname, 'src/presentation')
  } }
})
