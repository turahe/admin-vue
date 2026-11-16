import { fileURLToPath, URL } from 'node:url'

import { sentryVitePlugin } from '@sentry/vite-plugin'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'

const sentryAuthToken = process.env.SENTRY_AUTH_TOKEN
const uploadSourceMaps = Boolean(sentryAuthToken)

// https://vite.dev/config/
export default defineConfig({
  build: {
    sourcemap: 'hidden',
  },
  plugins: [
    vue(),
    vueJsx(),
    vueDevTools(),
    sentryVitePlugin({
      org: process.env.SENTRY_ORG,
      project: process.env.SENTRY_PROJECT,
      authToken: sentryAuthToken,
      telemetry: false,
      sourcemaps: {
        // Debug IDs are always injected. Upload only when a build token is present.
        disable: uploadSourceMaps ? false : 'disable-upload',
        filesToDeleteAfterUpload: uploadSourceMaps ? ['./dist/**/*.map'] : undefined,
      },
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
})
