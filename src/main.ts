import 'flatpickr/dist/flatpickr.css'
import 'jsvectormap/dist/jsvectormap.css'
// App styles last so they override vendor CSS
import './assets/main.css'

import * as Sentry from '@sentry/vue'
import { createSentryPiniaPlugin } from '@sentry/vue'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import VueApexCharts from 'vue3-apexcharts'
import App from './App.vue'
import { i18n } from './i18n'
import router from './router'
import { initRTL } from './composables/useRTL'

initRTL()

const app = createApp(App)
const pinia = createPinia()
pinia.use(createSentryPiniaPlugin())

const dsn = import.meta.env.VITE_SENTRY_DSN
if (dsn) {
  Sentry.init({
    app,
    dsn,
    environment: import.meta.env.MODE,
    integrations: [
      Sentry.browserTracingIntegration({ router }),
      Sentry.replayIntegration(),
      Sentry.feedbackIntegration({ colorScheme: 'system' }),
    ],
    tracesSampleRate: import.meta.env.PROD ? 0.1 : 1,
    tracePropagationTargets: ['localhost', /^http:\/\/localhost:8080/],
    replaysSessionSampleRate: import.meta.env.PROD ? 0.1 : 1,
    replaysOnErrorSampleRate: 1,
  })
}

app.use(pinia)
app.use(i18n)
app.use(router)
app.use(VueApexCharts)

app.mount('#app')
