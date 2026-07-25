import { clienteSupabase } from './supabase'
import { validarImagen, subirImagenProducto } from './storage'
import type { ImagenProducto } from '../domain/types'

export async function obtenerImagenesProducto(productoId: string) {
  const { data, error } = await clienteSupabase
    .from('imagenes_producto')
    .select('*')
    .eq('producto_id', productoId)
    .order('orden', { ascending: true })
  if (error) throw new Error(`Error al obtener imágenes: ${error.message}`)
  return data as ImagenProducto[]
}

export async function eliminarImagen(id: string, pathStorage: string) {
  // Eliminar de Storage
  const { error: storageError } = await clienteSupabase.storage
    .from('productos')
    .remove([pathStorage])
  if (storageError) throw new Error(`Error al eliminar archivo: ${storageError.message}`)

  // Eliminar registro
  const { error } = await clienteSupabase
    .from('imagenes_producto')
    .delete()
    .eq('id', id)
  if (error) throw new Error(`Error al eliminar imagen: ${error.message}`)
}

export async function reordenarImagenes(idsOrdenadas: string[]) {
  const updates = idsOrdenadas.map((id, index) => ({
    id,
    orden: index,
  }))
  const { error } = await clienteSupabase
    .from('imagenes_producto')
    .upsert(updates, { onConflict: 'id' })
  if (error) throw new Error(`Error al reordenar imágenes: ${error.message}`)
}

export async function guardarImagenesProducto(
  productoId: string,
  archivos: File[],
  imagenesExistentes: ImagenProducto[]
) {
  const nuevasUrls: { url: string; pathStorage: string }[] = []
  for (const archivo of archivos) {
    const error = validarImagen(archivo)
    if (error) throw new Error(error)
    const path = `${Date.now()}-${archivo.name}`
    const url = await subirImagenProducto(archivo, path)
    nuevasUrls.push({ url, pathStorage: path })
  }

  const maxOrden = imagenesExistentes.reduce((max, img) => Math.max(max, img.orden), -1)
  let ordenSiguiente = maxOrden + 1

  const inserts = nuevasUrls.map(({ url, pathStorage }) => ({
    producto_id: productoId,
    url,
    path_storage: pathStorage,
    orden: ordenSiguiente++,
  }))

  if (inserts.length > 0) {
    const { error } = await clienteSupabase.from('imagenes_producto').insert(inserts)
    if (error) throw new Error(`Error al guardar imágenes: ${error.message}`)
  }
}