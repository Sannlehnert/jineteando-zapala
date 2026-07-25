import { clienteSupabase } from './supabase'
import type { Categoria, CategoriaFormData } from '../domain/types'

// Obtener todas las categorías (admin puede ver inactivas)
export async function obtenerCategorias(admin: boolean = false) {
  let query = clienteSupabase.from('categorias').select('*')
  if (!admin) {
    query = query.eq('activa', true)
  }
  const { data, error } = await query.order('nombre')
  if (error) throw new Error(`Error al obtener categorías: ${error.message}`)
  return data as Categoria[]
}

// Obtener solo categorías principales (padre_id IS NULL)
export async function obtenerCategoriasPrincipales(admin: boolean = false) {
  let query = clienteSupabase.from('categorias').select('*').is('padre_id', null)
  if (!admin) {
    query = query.eq('activa', true)
  }
  const { data, error } = await query.order('nombre')
  if (error) throw new Error(`Error al obtener categorías principales: ${error.message}`)
  return data as Categoria[]
}

// Obtener subcategorías de una categoría padre
export async function obtenerSubcategorias(padreId: string, admin: boolean = false) {
  let query = clienteSupabase.from('categorias').select('*').eq('padre_id', padreId)
  if (!admin) {
    query = query.eq('activa', true)
  }
  const { data, error } = await query.order('nombre')
  if (error) throw new Error(`Error al obtener subcategorías: ${error.message}`)
  return data as Categoria[]
}

// Obtener una categoría por slug (activa)
export async function obtenerCategoriaPorSlug(slug: string) {
  const { data, error } = await clienteSupabase
    .from('categorias')
    .select('*')
    .eq('slug', slug)
    .eq('activa', true)
    .single()
  if (error) throw new Error(`Categoría no encontrada: ${error.message}`)
  return data as Categoria
}

// Crear categoría
export async function crearCategoria(data: CategoriaFormData) {
  const { data: creada, error } = await clienteSupabase
    .from('categorias')
    .insert({
      nombre: data.nombre,
      activa: data.activa,
      padre_id: data.padre_id ?? null,
    })
    .select()
    .single()
  if (error) throw new Error(`Error al crear categoría: ${error.message}`)
  return creada as Categoria
}

// Actualizar categoría
export async function actualizarCategoria(id: string, data: Partial<CategoriaFormData>) {
  const payload: any = { ...data }
  if (data.padre_id === undefined) delete payload.padre_id
  const { data: actualizada, error } = await clienteSupabase
    .from('categorias')
    .update(payload)
    .eq('id', id)
    .select()
    .single()
  if (error) throw new Error(`Error al actualizar categoría: ${error.message}`)
  return actualizada as Categoria
}

// Cambiar estado activo/inactivo
export async function cambiarEstadoCategoria(id: string, activa: boolean) {
  return actualizarCategoria(id, { activa })
}