import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import { router } from './router'
import { createBootstrap } from 'bootstrap-vue-next'
import '@/assets/scss/custom.scss'
import 'bootstrap-icons/font/bootstrap-icons.css'

const bootstrap = createBootstrap()

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(bootstrap)
app.mount('#app')
