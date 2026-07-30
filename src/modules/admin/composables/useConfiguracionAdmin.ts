import { ref, onMounted } from 'vue'
import { obtenerConfiguracion, actualizarConfiguracion } from '../../../infrastructure/configuracion'
import type { Configuracion, ConfiguracionFormData } from '../../../domain/types'
import { subirImagenProducto } from '../../../infrastructure/storage'

export function useConfiguracionAdmin() {
  const config = ref<Configuracion | null>(null)
  const cargando = ref(false)
  const error = ref<string | null>(null)
  const guardando = ref(false)

  const cargar = async () => {
    cargando.value = true
    error.value = null
    try {
      config.value = await obtenerConfiguracion()
    } catch (e: any) {
      error.value = e.message
    } finally {
      cargando.value = false
    }
  }

  const guardar = async (data: ConfiguracionFormData, archivoLogo?: File | null) => {
    guardando.value = true
    error.value = null
    try {
      let logoUrl = config.value?.logo_url ?? null
      if (archivoLogo) {
        logoUrl = await subirImagenProducto(archivoLogo)
      } else if (archivoLogo === null) {
        // Si se pasa null explícitamente, mantenemos el logo actual
        logoUrl = config.value?.logo_url ?? null
      }
      const updated = await actualizarConfiguracion(data, logoUrl)
      config.value = updated
      return updated
    } catch (e: any) {
      error.value = e.message
      throw e
    } finally {
      guardando.value = false
    }
  }

  onMounted(cargar)

  return { config, cargando, error, guardando, guardar, recargar: cargar }
}