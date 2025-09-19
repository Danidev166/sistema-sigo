import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // Permitir conexiones desde cualquier IP
    port: 5174,
    strictPort: false
  },
  css: {
    postcss: './postcss.config.js',
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/setupTests.js'],
    css: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/stories/',
        'src/__mocks__/',
        '**/*.stories.js',
        '**/*.config.js'
      ]
    },
    deps: {
      optimizer: {
        web: {
          include: ['axios']
        }
      }
    }
  },
  build: {
    minify: 'terser',
    sourcemap: false,
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    },
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'ui-libs': ['@headlessui/react', '@heroicons/react', 'lucide-react'],
          'router': ['react-router-dom'],
          'charts': ['recharts'],
          'utils': ['date-fns', 'axios']
        }
      }
    }
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'axios',
      'date-fns'
    ]
  }
}) 