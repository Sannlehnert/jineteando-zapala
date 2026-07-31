import { ref, onMounted } from 'vue'
import { obtenerCategorias } from '../../../infrastructure/categorias'
import type { Categoria } from '../../../domain/types'

export function useCatalogo() {
  const categorias = ref<Categoria[]>([])
  const cargando = ref(false)
  const error = ref<string | null>(null)

  const cargar = async () => {
    cargando.value = true
    error.value = null
    try {
      categorias.value = await obtenerCategorias(false) // solo activas
    } catch (e: any) {
      error.value = e.message
    } finally {
      cargando.value = false
    }
  }

  onMounted(cargar)
  return { categorias, cargando, error, recargar: cargar }
}