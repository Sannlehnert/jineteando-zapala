import { clienteSupabase } from './supabase'
import type { Producto, ProductoFormData, ImagenProducto } from '../domain/types'

function extraerImagenPrincipal(producto: any): Producto {
  const imagenes: ImagenProducto[] = producto.imagenes_producto || []
  const primeraImagen = imagenes.length
    ? [...imagenes].sort((a, b) => a.orden - b.orden)[0]
    : null

  return {
    ...producto,
    imagen_principal_url: producto.imagen_principal_url || primeraImagen?.url || null,
  }
}

export async function obtenerProductos(admin: boolean = false) {
  let query = clienteSupabase
    .from('productos')
    .select('*, categoria:categorias(nombre), imagenes_producto(orden, url)')

  if (!admin) {
    query = query.eq('activo', true)
  }
  const { data, error } = await query.order('nombre')
  if (error) {
    console.error('obtenerProductos:', error)
    throw new Error(`Error al obtener productos: ${error.message}`)
  }
  return (data as any[]).map(extraerImagenPrincipal) as (Producto & { categoria: { nombre: string } })[]
}

export async function obtenerProductosActivosPorCategoria(categoriaId: string) {
  const { data, error } = await clienteSupabase
    .from('productos')
    .select('*, imagenes_producto(orden, url)')
    .eq('categoria_id', categoriaId)
    .eq('activo', true)
    .order('nombre')
  if (error) {
    console.error('obtenerProductosActivosPorCategoria:', error)
    throw new Error(`Error al obtener productos: ${error.message}`)
  }
  return (data as any[]).map(extraerImagenPrincipal) as Producto[]
}

export async function obtenerProductoPorId(id: string) {
  const { data, error } = await clienteSupabase
    .from('productos')
    .select('*, imagenes_producto(orden, url)')
    .eq('id', id)
    .single()
  if (error) {
    console.error('obtenerProductoPorId:', error)
    throw new Error(`Error al obtener producto: ${error.message}`)
  }
  return extraerImagenPrincipal(data) as Producto
}

export async function obtenerProductoPorSlug(slug: string) {
  const { data, error } = await clienteSupabase
    .from('productos')
    .select('*, imagenes_producto(orden, url)')
    .eq('slug', slug)
    .eq('activo', true)
    .single()
  if (error) {
    console.error('obtenerProductoPorSlug:', error)
    throw new Error(`Producto no encontrado: ${error.message}`)
  }

  const { data: categoria } = await clienteSupabase
    .from('categorias')
    .select('activa')
    .eq('id', data.categoria_id)
    .single()
  if (!categoria || !categoria.activa) throw new Error('Producto no disponible')

  return extraerImagenPrincipal(data) as Producto
}

export async function crearProducto(data: ProductoFormData) {
  const { data: creado, error } = await clienteSupabase
    .from('productos')
    .insert({
      ...data,
      atributos: data.atributos ?? {},
    })
    .select()
    .single()
  if (error) {
    console.error('crearProducto:', error)
    throw new Error(`Error al crear producto: ${error.message}`)
  }
  return creado as Producto
}

export async function actualizarProducto(id: string, data: Partial<ProductoFormData>) {
  const payload: any = { ...data }
  if (data.atributos !== undefined) payload.atributos = data.atributos
  const { data: actualizado, error } = await clienteSupabase
    .from('productos')
    .update(payload)
    .eq('id', id)
    .select()
    .single()
  if (error) {
    console.error('actualizarProducto:', error)
    throw new Error(`Error al actualizar producto: ${error.message}`)
  }
  return actualizado as Producto
}

export async function cambiarEstadoProducto(id: string, activo: boolean) {
  return actualizarProducto(id, { activo })
}