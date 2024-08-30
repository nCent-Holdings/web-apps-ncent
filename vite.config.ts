import { defineConfig, loadEnv } from 'vite';
import { fileURLToPath } from 'url';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());
  const allowedPaths = env.VITE_UI_LIB_PATH ? ['', env.VITE_UI_LIB_PATH] : [''];

  return {
    plugins: [svgr({ exportAsDefault: true }), react()],
    server: {
      host: true,
      fs: {
        allow: [...allowedPaths],
      },
    },
    resolve: {
      alias: {
        '@src': path.resolve(__dirname, 'src'),
        '@icons': path.resolve(__dirname, 'public/icons'),
        '@components': path.resolve(__dirname, 'src/components'),
        '@actions': path.resolve(__dirname, 'src/actions'),
        '@assets': path.resolve(__dirname, 'src/assets'),
      },
    },
  };
});
