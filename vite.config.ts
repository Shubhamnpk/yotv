import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ command }) => {
  return {
    base: command === 'build' ? '/yotv/' : '/',
    plugins: [react()],
    optimizeDeps: {
      include: ['lucide-react'],
    },
    build: {
      target: 'esnext',
      minify: 'esbuild',
      rollupOptions: {
        output: {
          manualChunks: {
            'react-vendor': ['react', 'react-dom'],
            'player-vendor': ['hls.js', 'react-player'],
            'ui-vendor': ['@radix-ui/react-dialog', '@radix-ui/react-tabs', 'framer-motion'],
          },
        },
      },
    },
    server: {
      port: 5173,
      strictPort: false,
      hmr: true,
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
      },
    },
  };
});
