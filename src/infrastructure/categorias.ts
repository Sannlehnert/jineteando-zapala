import { clienteSupabase } from './supabase'
import type { Categoria, CategoriaFormData } from '../domain/types'

export async function obtenerCategorias(admin: boolean = false) {
  let query = clienteSupabase.from('categorias').select('*')
  if (!admin) {
    query = query.eq('activa', true)
  }
  const { data, error } = await query.order('nombre')
  if (error) {
    console.error('obtenerCategorias:', error)
    throw new Error(`Error al obtener categorías: ${error.message}`)
  }
  return data as Categoria[]
}

export async function obtenerCategoriasPrincipales(admin: boolean = false) {
  let query = clienteSupabase.from('categorias').select('*').is('padre_id', null)
  if (!admin) {
    query = query.eq('activa', true)
  }
  const { data, error } = await query.order('nombre')
  if (error) {
    console.error('obtenerCategoriasPrincipales:', error)
    throw new Error(`Error al obtener categorías principales: ${error.message}`)
  }
  return data as Categoria[]
}

export async function obtenerSubcategorias(padreId: string, admin: boolean = false) {
  let query = clienteSupabase.from('categorias').select('*').eq('padre_id', padreId)
  if (!admin) {
    query = query.eq('activa', true)
  }
  const { data, error } = await query.order('nombre')
  if (error) {
    console.error('obtenerSubcategorias:', error)
    throw new Error(`Error al obtener subcategorías: ${error.message}`)
  }
  return data as Categoria[]
}

export async function obtenerCategoriaPorSlug(slug: string) {
  const { data, error } = await clienteSupabase
    .from('categorias')
    .select('*')
    .eq('slug', slug)
    .eq('activa', true)
    .single()
  if (error) {
    console.error('obtenerCategoriaPorSlug:', error)
    throw new Error(`Categoría no encontrada: ${error.message}`)
  }
  return data as Categoria
}

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
  if (error) {
    console.error('crearCategoria:', error)
    throw new Error(`Error al crear categoría: ${error.message}`)
  }
  return creada as Categoria
}

export async function actualizarCategoria(id: string, data: Partial<CategoriaFormData>) {
  const payload: any = { ...data }
  if (data.padre_id === undefined) delete payload.padre_id
  const { data: actualizada, error } = await clienteSupabase
    .from('categorias')
    .update(payload)
    .eq('id', id)
    .select()
    .single()
  if (error) {
    console.error('actualizarCategoria:', error)
    throw new Error(`Error al actualizar categoría: ${error.message}`)
  }
  return actualizada as Categoria
}

export async function cambiarEstadoCategoria(id: string, activa: boolean) {
  return actualizarCategoria(id, { activa })
}