import { ref } from 'vue'
import {
  obtenerCategorias as obtenerCategoriasService,
  crearCategoria as crearCategoriaService,
  actualizarCategoria as actualizarCategoriaService,
  cambiarEstadoCategoria,
} from '../../../infrastructure/categorias'
import type { Categoria, CategoriaFormData } from '../../../domain/types'

export function useCategoriasAdmin() {
  const categorias = ref<Categoria[]>([])
  const cargando = ref(false)
  const error = ref<string | null>(null)

  const cargarCategorias = async () => {
    cargando.value = true
    error.value = null
    try {
      categorias.value = await obtenerCategoriasService(true) // admin: incluye inactivas
    } catch (e: any) {
      error.value = e.message
    } finally {
      cargando.value = false
    }
  }

  const crear = async (data: CategoriaFormData) => {
    const nueva = await crearCategoriaService(data)
    await cargarCategorias()
    return nueva
  }

  const actualizar = async (id: string, data: Partial<CategoriaFormData>) => {
    const actualizada = await actualizarCategoriaService(id, data)
    await cargarCategorias()
    return actualizada
  }

  const cambiarEstado = async (id: string, activa: boolean) => {
    await cambiarEstadoCategoria(id, activa)
    await cargarCategorias()
  }

  return {
    categorias,
    cargando,
    error,
    cargarCategorias,
    crear,
    actualizar,
    cambiarEstado,
  }
}