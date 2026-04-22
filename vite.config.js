import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [react()],
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            // Core React — must be single chunk
            if (id.includes('node_modules/react/') || id.includes('node_modules/react-dom/') || id.includes('node_modules/react-router-dom/')) {
              return 'vendor-react';
            }
            // Redux ecosystem
            if (id.includes('@reduxjs/toolkit') || id.includes('react-redux')) {
              return 'vendor-redux';
            }
            // Animation library — heavy, lazy-paginated
            if (id.includes('framer-motion')) {
              return 'vendor-motion';
            }
            // Maps — only loaded on map pages
            if (id.includes('leaflet') || id.includes('react-leaflet')) {
              return 'vendor-maps';
            }
            // Charts — only admin/seller pages
            if (id.includes('apexcharts') || id.includes('react-apexcharts') || id.includes('recharts')) {
              return 'vendor-charts';
            }
            // Bootstrap CSS bundled separately
            if (id.includes('bootstrap')) {
              return 'vendor-bootstrap';
            }
            // Icons — large, split out
            if (id.includes('react-icons')) {
              return 'vendor-icons';
            }
            // React Query
            if (id.includes('@tanstack')) {
              return 'vendor-query';
            }
            // Socket.io
            if (id.includes('socket.io-client')) {
              return 'vendor-socket';
            }
          },
        },
      },
      chunkSizeWarningLimit: 1000,
      // Minify to reduce payload on mobile
      minify: 'esbuild',
      // Auto-remove all console.* and debugger statements in production
      // No need to manually hunt them down in code
      esbuildOptions: {
        drop: ['console', 'debugger'],
      },
      // Reduce inline threshold so assets are cached separately
      assetsInlineLimit: 4096,
    },
    server: {
      proxy: {
        '/api': {
          target: env.VITE_API_URL || 'http://127.0.0.1:5000',
          changeOrigin: true,
        },
      },
    },
  };
})
