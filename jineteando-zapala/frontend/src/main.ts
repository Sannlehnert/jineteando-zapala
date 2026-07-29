import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import App from './App.vue'
import './style.css'
import { useAuthStore } from './stores/auth'
import { useConfiguracionStore } from './stores/configuracion'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

const authStore = useAuthStore()
authStore.initialize().then(() => {
  app.mount('#app')
  // Inicializar configuración pública después del montaje
  useConfiguracionStore().cargar()
})