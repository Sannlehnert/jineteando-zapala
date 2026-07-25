import { clienteSupabase } from './supabase'
import type { Categoria, CategoriaFormData } from '../domain/types'

export async function obtenerCategorias(admin: boolean = false) {
  let query = clienteSupabase.from('categorias').select('*')
  if (!admin) {
    query = query.eq('activa', true)
  }
  const { data, error } = await query.order('nombre')
  if (error) throw new Error(`Error al obtener categorías: ${error.message}`)
  return data as Categoria[]
}

export async function crearCategoria(data: CategoriaFormData) {
  // slug y timestamps los maneja la DB, solo enviamos nombre y activa
  const { data: creada, error } = await clienteSupabase
    .from('categorias')
    .insert({ nombre: data.nombre, activa: data.activa })
    .select()
    .single()
  if (error) throw new Error(`Error al crear categoría: ${error.message}`)
  return creada as Categoria
}

export async function actualizarCategoria(id: string, data: Partial<CategoriaFormData>) {
  const { data: actualizada, error } = await clienteSupabase
    .from('categorias')
    .update(data)
    .eq('id', id)
    .select()
    .single()
  if (error) throw new Error(`Error al actualizar categoría: ${error.message}`)
  return actualizada as Categoria
}

export async function cambiarEstadoCategoria(id: string, activa: boolean) {
  return actualizarCategoria(id, { activa })
}

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