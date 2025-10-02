import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'node:path';
import vueI18n from '@intlify/unplugin-vue-i18n/vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [
      vue(),
      vueI18n({
        include: path.resolve(__dirname, './src/locales/**'),
        runtimeOnly: false,
      }),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      proxy: {
        '/API': {
          target: env.VITE_API_BASE_URL || 'http://localhost:3000',
          changeOrigin: true,
          rewrite: (p) => p.replace(/^\/API/, '/api'),
        },
      },
    },
  };
});
