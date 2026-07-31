import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { obtenerCategoriaPorSlug, obtenerSubcategorias } from '../../../infrastructure/categorias'
import { obtenerProductosActivosPorCategoria } from '../../../infrastructure/productos'
import type { Categoria, Producto } from '../../../domain/types'

export function useCategoriaPublica() {
  const route = useRoute()
  const categoria = ref<Categoria | null>(null)
  const subcategorias = ref<Categoria[]>([])
  const productos = ref<Producto[]>([])
  const cargando = ref(false)
  const error = ref<string | null>(null)

  const slug = ref(route.params.categoriaSlug as string)

  async function cargarDatos(slugValue: string) {
    cargando.value = true
    error.value = null
    categoria.value = null
    subcategorias.value = []
    productos.value = []
    try {
      const cat = await obtenerCategoriaPorSlug(slugValue)
      categoria.value = cat
      if (cat.padre_id) {
        // Si es subcategoría, cargar productos directamente
        productos.value = await obtenerProductosActivosPorCategoria(cat.id)
      } else {
        // Si es categoría principal, buscar subcategorías activas
        const subs = await obtenerSubcategorias(cat.id, false)
        if (subs.length > 0) {
          subcategorias.value = subs
        } else {
          // Si no tiene subcategorías, cargar productos directamente
          productos.value = await obtenerProductosActivosPorCategoria(cat.id)
        }
      }
    } catch (e: any) {
      error.value = e.message
    } finally {
      cargando.value = false
    }
  }

  watch(slug, (newSlug) => {
    cargarDatos(newSlug)
  }, { immediate: true })

  watch(() => route.params.categoriaSlug, (newSlug) => {
    if (newSlug) slug.value = newSlug as string
  })

  return { categoria, subcategorias, productos, cargando, error }
}