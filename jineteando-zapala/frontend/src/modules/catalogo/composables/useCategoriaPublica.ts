import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { obtenerCategoriaPorSlug } from '../../../infrastructure/categorias'
import { obtenerProductosActivosPorCategoria } from '../../../infrastructure/productos'
import type { Categoria, Producto } from '../../../domain/types'

export function useCategoriaPublica() {
  const route = useRoute()
  const categoria = ref<Categoria | null>(null)
  const productos = ref<Producto[]>([])
  const cargando = ref(false)
  const error = ref<string | null>(null)

  const slug = ref(route.params.categoriaSlug as string)

  async function cargarDatos(slugValue: string) {
    cargando.value = true
    error.value = null
    categoria.value = null
    productos.value = []
    try {
      const cat = await obtenerCategoriaPorSlug(slugValue)
      categoria.value = cat
      const prods = await obtenerProductosActivosPorCategoria(cat.id)
      productos.value = prods
    } catch (e: any) {
      error.value = e.message
    } finally {
      cargando.value = false
    }
  }

  // Cargar al montar y cuando cambia el slug
  watch(slug, (newSlug) => {
    cargarDatos(newSlug)
  }, { immediate: true })

  // También si la ruta cambia (por si se navega entre categorías)
  watch(() => route.params.categoriaSlug, (newSlug) => {
    if (newSlug) slug.value = newSlug as string
  })

  return { categoria, productos, cargando, error }
}