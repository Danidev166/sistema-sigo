// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],

  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },

  server: {
    host: '0.0.0.0',   // permite acceso desde la red
    port: 5174,
    strictPort: false,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false,
      }
    }
  },

  css: {
    postcss: './postcss.config.js',
  },

  // Vitest (si lo usas)
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
    // Puedes dejar deps como lo tienes, o simplificar.
    // deps: { inline: ['axios'] } también funciona.
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
    terserOptions: {
      compress: { drop_console: true, drop_debugger: true }
    },
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'ui-libs': ['@headlessui/react', '@heroicons/react', 'lucide-react'],
          'router': ['react-router-dom'],
          'charts': ['recharts'],
          'utils': ['date-fns', 'axios'],
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
      'date-fns',
    ]
  }
})
