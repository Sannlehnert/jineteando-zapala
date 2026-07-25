import { ref, watch } from 'vue'
import {
  obtenerImagenesProducto,
  eliminarImagen,
  guardarImagenesProducto,
  reordenarImagenes,
} from '../../../infrastructure/imagenes'
import type { ImagenProducto } from '../../../domain/types'

export function useImagenesProducto(productoIdRef: () => string | null) {
  const imagenes = ref<ImagenProducto[]>([])
  const cargando = ref(false)
  const error = ref<string | null>(null)

  const cargarImagenes = async () => {
    const id = productoIdRef()
    if (!id) return
    cargando.value = true
    error.value = null
    try {
      imagenes.value = await obtenerImagenesProducto(id)
    } catch (e: any) {
      error.value = e.message
    } finally {
      cargando.value = false
    }
  }

  const eliminar = async (imagen: ImagenProducto) => {
    const id = productoIdRef()
    if (!id) return
    try {
      await eliminarImagen(imagen.id, imagen.path_storage)
      await cargarImagenes()
    } catch (e: any) {
      error.value = e.message
    }
  }

  const guardarNuevas = async (archivos: File[]) => {
    const id = productoIdRef()
    if (!id) return
    try {
      await guardarImagenesProducto(id, archivos, imagenes.value)
      await cargarImagenes()
    } catch (e: any) {
      error.value = e.message
    }
  }

  const reordenar = async (idsOrdenadas: string[]) => {
    try {
      await reordenarImagenes(idsOrdenadas)
      await cargarImagenes()
    } catch (e: any) {
      error.value = e.message
    }
  }

  // Cargar imágenes al inicializar si hay un productoId
  watch(
    () => productoIdRef(),
    (newId) => {
      if (newId) cargarImagenes()
    },
    { immediate: true }
  )

  return {
    imagenes,
    cargando,
    error,
    cargarImagenes,
    eliminar,
    guardarNuevas,
    reordenar,
  }
}