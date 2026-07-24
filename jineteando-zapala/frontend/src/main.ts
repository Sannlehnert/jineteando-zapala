import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import App from './App.vue'
import './style.css'
import { useAuthStore } from './stores/auth'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

// Inicializar sesión antes de montar para evitar redirecciones prematuras
const authStore = useAuthStore()
authStore.initialize().then(() => {
  app.mount('#app')
})