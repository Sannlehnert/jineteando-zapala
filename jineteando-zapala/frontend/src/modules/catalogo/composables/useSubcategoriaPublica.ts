import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { obtenerCategoriaPorSlug } from '../../../infrastructure/categorias'
import { obtenerProductosActivosPorCategoria } from '../../../infrastructure/productos'
import type { Categoria, Producto } from '../../../domain/types'

export function useSubcategoriaPublica() {
  const route = useRoute()
  const categoria = ref<Categoria | null>(null)
  const productos = ref<Producto[]>([])
  const cargando = ref(false)
  const error = ref<string | null>(null)

  const slug = ref(route.params.subcategoriaSlug as string)

  async function cargarDatos(slugValue: string) {
    cargando.value = true
    error.value = null
    categoria.value = null
    productos.value = []
    try {
      const cat = await obtenerCategoriaPorSlug(slugValue)
      categoria.value = cat
      productos.value = await obtenerProductosActivosPorCategoria(cat.id)
    } catch (e: any) {
      error.value = e.message
    } finally {
      cargando.value = false
    }
  }

  watch(slug, (newSlug) => {
    cargarDatos(newSlug)
  }, { immediate: true })

  watch(() => route.params.subcategoriaSlug, (newSlug) => {
    if (newSlug) slug.value = newSlug as string
  })

  return { categoria, productos, cargando, error }
}