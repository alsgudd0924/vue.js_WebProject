import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { inject as vercelAnalytics } from '@vercel/analytics'

vercelAnalytics()

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.mount('#app')