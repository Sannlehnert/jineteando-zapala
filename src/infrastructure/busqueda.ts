import { clienteSupabase } from './supabase'
import type { Producto } from '../domain/types'

export async function buscarProductos(
  termino: string,
  filtros?: { categoriaId?: string; precioMin?: number; precioMax?: number }
): Promise<Producto[]> {
  let query = clienteSupabase.from('productos').select('*')

  if (termino) {
    const pattern = `%${termino}%`
    query = query.or(`nombre.ilike.${pattern},codigo.ilike.${pattern},descripcion.ilike.${pattern}`)
  }

  query = query.eq('activo', true)

  if (filtros?.categoriaId) {
    query = query.eq('categoria_id', filtros.categoriaId)
  }
  if (filtros?.precioMin !== undefined) {
    query = query.gte('precio_minorista', filtros.precioMin)
  }
  if (filtros?.precioMax !== undefined) {
    query = query.lte('precio_minorista', filtros.precioMax)
  }

  const { data, error } = await query.order('nombre').limit(50)
  if (error) {
    console.error('buscarProductos:', error)
    throw new Error(`Error en la búsqueda: ${error.message}`)
  }
  return data as Producto[]
}