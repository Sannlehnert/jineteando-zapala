import { clienteSupabase } from './supabase'

const BUCKET_NAME = 'productos'

const MIME_PERMITIDOS = ['image/jpeg', 'image/png', 'image/webp']
const TAMANO_MAXIMO = 5 * 1024 * 1024 // 5 MB

export function validarImagen(file: File): string | null {
  if (!MIME_PERMITIDOS.includes(file.type)) {
    return 'El archivo debe ser una imagen (JPEG, PNG o WebP).'
  }
  if (file.size > TAMANO_MAXIMO) {
    return 'La imagen no puede superar los 5 MB.'
  }
  return null
}

export async function subirImagenProducto(file: File): Promise<string> {
  const nombreArchivo = `${Date.now()}-${file.name}`
  const { error } = await clienteSupabase.storage
    .from(BUCKET_NAME)
    .upload(nombreArchivo, file, {
      cacheControl: '3600',
      upsert: false,
    })
  if (error) throw new Error(`Error al subir imagen: ${error.message}`)

  const { data: urlData } = clienteSupabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(nombreArchivo)

  return urlData.publicUrl
}