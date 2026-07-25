import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { obtenerProductoPorSlug } from '../../../infrastructure/productos'
import type { Producto } from '../../../domain/types'

export function useProductoPublico() {
  const route = useRoute()
  const producto = ref<Producto | null>(null)
  const cargando = ref(false)
  const error = ref<string | null>(null)

  const slug = ref(route.params.productoSlug as string)

  async function cargarDatos(slugValue: string) {
    cargando.value = true
    error.value = null
    producto.value = null
    try {
      producto.value = await obtenerProductoPorSlug(slugValue)
    } catch (e: any) {
      error.value = e.message
    } finally {
      cargando.value = false
    }
  }

  watch(slug, (newSlug) => {
    cargarDatos(newSlug)
  }, { immediate: true })

  watch(() => route.params.productoSlug, (newSlug) => {
    if (newSlug) slug.value = newSlug as string
  })

  return { producto, cargando, error }
}