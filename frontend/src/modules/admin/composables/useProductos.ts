import { ref } from 'vue'
import {
  obtenerProductos as obtenerProductosService,
  crearProducto as crearProductoService,
  actualizarProducto as actualizarProductoService,
  cambiarEstadoProducto,
} from '../../../infrastructure/productos'
import type { Producto, ProductoFormData } from '../../../domain/types'

export function useProductosAdmin() {
  const productos = ref<(Producto & { categoria: { nombre: string } })[]>([])
  const cargando = ref(false)
  const error = ref<string | null>(null)

  const cargarProductos = async () => {
    cargando.value = true
    error.value = null
    try {
      productos.value = await obtenerProductosService(true) as any
    } catch (e: any) {
      error.value = e.message
    } finally {
      cargando.value = false
    }
  }

  const crear = async (data: ProductoFormData) => {
    const nuevo = await crearProductoService(data)
    await cargarProductos()
    return nuevo
  }

  const actualizar = async (id: string, data: Partial<ProductoFormData>) => {
    const actualizado = await actualizarProductoService(id, data)
    await cargarProductos()
    return actualizado
  }

  const cambiarEstado = async (id: string, activo: boolean) => {
    await cambiarEstadoProducto(id, activo)
    await cargarProductos()
  }

  return {
    productos,
    cargando,
    error,
    cargarProductos,
    crear,
    actualizar,
    cambiarEstado,
  }
}