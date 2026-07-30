import { ref, onMounted } from 'vue'
import { obtenerConfiguracion } from '../../../infrastructure/configuracion'
import type { Configuracion } from '../../../domain/types'

export function useConfiguracionPublica() {
  const config = ref<Configuracion | null>(null)
  const cargando = ref(false)
  const error = ref<string | null>(null)

  const cargar = async () => {
    cargando.value = true
    try {
      config.value = await obtenerConfiguracion()
    } catch (e: any) {
      error.value = e.message
    } finally {
      cargando.value = false
    }
  }

  onMounted(cargar)

  return { config, cargando, error, recargar: cargar }
}