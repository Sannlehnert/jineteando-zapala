import { clienteSupabase } from './supabase'
import type { Producto, ProductoFormData } from '../domain/types'

export async function obtenerProductos(admin: boolean = false) {
  let query = clienteSupabase.from('productos').select('*, categoria:categorias(nombre)')
  if (!admin) {
    query = query.eq('activo', true)
  }
  const { data, error } = await query.order('nombre')
  if (error) throw new Error(`Error al obtener productos: ${error.message}`)
  return data as (Producto & { categoria: { nombre: string } } | null)[]
}

export async function obtenerProductoPorId(id: string) {
  const { data, error } = await clienteSupabase
    .from('productos')
    .select('*')
    .eq('id', id)
    .single()
  if (error) throw new Error(`Error al obtener producto: ${error.message}`)
  return data as Producto
}

export async function crearProducto(data: ProductoFormData) {
  // Se envía todo, la DB se encarga de generar código si es necesario (en el trigger)
  // Pero aquí ya viene el código del frontend (auto-generado o manual), respetamos el campo.
  const { data: creado, error } = await clienteSupabase
    .from('productos')
    .insert(data)
    .select()
    .single()
  if (error) throw new Error(`Error al crear producto: ${error.message}`)
  return creado as Producto
}

export async function actualizarProducto(id: string, data: Partial<ProductoFormData>) {
  const { data: actualizado, error } = await clienteSupabase
    .from('productos')
    .update(data)
    .eq('id', id)
    .select()
    .single()
  if (error) throw new Error(`Error al actualizar producto: ${error.message}`)
  return actualizado as Producto
}

export async function cambiarEstadoProducto(id: string, activo: boolean) {
  return actualizarProducto(id, { activo })
}