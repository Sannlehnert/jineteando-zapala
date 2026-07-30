import { ref, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { buscarProductos } from '../../../infrastructure/busqueda'
import type { Producto, Categoria } from '../../../domain/types'
import { obtenerCategorias } from '../../../infrastructure/categorias'

export function useBusqueda() {
  const route = useRoute()
  const router = useRouter()

  // Término y filtros reactivos (sincronizados con la URL)
  const termino = ref<string>((route.query.q as string) || '')
  const categoriaId = ref<string | null>((route.query.categoria as string) || null)
  const precioMin = ref<number | undefined>(
    route.query.precioMin ? Number(route.query.precioMin) : undefined
  )
  const precioMax = ref<number | undefined>(
    route.query.precioMax ? Number(route.query.precioMax) : undefined
  )

  const resultados = ref<Producto[]>([])
  const cargando = ref(false)
  const error = ref<string | null>(null)

  // Categorías disponibles para el filtro (solo activas)
  const categorias = ref<Categoria[]>([])
  onMounted(async () => {
    try {
      categorias.value = await obtenerCategorias(false)
    } catch (e: any) {
      console.error('Error al cargar categorías para filtro:', e)
    }
  })

  // Debounce
  let timeout: ReturnType<typeof setTimeout> | null = null

  async function ejecutarBusqueda() {
    cargando.value = true
    error.value = null
    try {
      resultados.value = await buscarProductos(termino.value, {
        categoriaId: categoriaId.value ?? undefined,
        precioMin: precioMin.value,
        precioMax: precioMax.value,
      })
    } catch (e: any) {
      error.value = e.message
      resultados.value = []
    } finally {
      cargando.value = false
    }
  }

  function sincronizarURL() {
    router.replace({
      query: {
        q: termino.value || undefined,
        categoria: categoriaId.value || undefined,
        precioMin: precioMin.value !== undefined ? String(precioMin.value) : undefined,
        precioMax: precioMax.value !== undefined ? String(precioMax.value) : undefined,
      },
    })
  }

  // Al cambiar cualquier parámetro, actualizamos URL y buscamos tras un debounce
  function onFiltroChange() {
    if (timeout) clearTimeout(timeout)
    sincronizarURL()
    timeout = setTimeout(ejecutarBusqueda, 300)
  }

  // Observamos los cambios
  watch([termino, categoriaId, precioMin, precioMax], onFiltroChange)

  // Primera carga: si hay query, ya se ejecutó en el constructor, lanzamos búsqueda inicial
  if (termino.value || categoriaId.value || precioMin.value !== undefined || precioMax.value !== undefined) {
    ejecutarBusqueda()
  }

  return {
    termino,
    categoriaId,
    precioMin,
    precioMax,
    resultados,
    cargando,
    error,
    categorias,  // para el select
    actualizarTermino: (nuevo: string) => {
      termino.value = nuevo
    },
  }
}