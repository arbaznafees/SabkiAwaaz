import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      hmr: true,
      proxy: {
        '/api': {
          target: 'http://localhost:8000',
          changeOrigin: true,
          configure: (proxy) => {
            proxy.on('error', (err, _req, res) => {
              // Silently ignore connection refused errors when backend is offline
              if ((err as any).code === 'ECONNREFUSED') {
                if (res && typeof (res as any).writeHead === 'function') {
                  (res as any).writeHead(503, { 'Content-Type': 'application/json' });
                  (res as any).end(JSON.stringify({ error: 'Backend offline — running in demo mode', offline: true }));
                }
              }
            });
          },
        },
      },
    },
  };
});
