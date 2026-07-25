export type RolAdmin = 'admin'

export interface Categoria {
  id: string
  nombre: string
  slug: string
  imagen_url: string | null
  activa: boolean
  created_at: string
  updated_at: string
}

export interface Producto {
  id: string
  nombre: string
  slug: string
  codigo: string
  descripcion: string | null
  precio_minorista: number
  precio_mayorista: number | null
  categoria_id: string
  imagen_principal_url: string | null
  activo: boolean
  created_at: string
  updated_at: string
}

// Tipo para formularios (datos a enviar)
export interface CategoriaFormData {
  nombre: string
  activa: boolean
  // slug se genera en backend, no se envía manualmente
}

export interface ProductoFormData {
  nombre: string
  codigo: string          // puede ser auto-generado o manual
  descripcion: string
  precio_minorista: number
  precio_mayorista: number | null
  categoria_id: string
  imagen_principal_url: string | null
  activo: boolean
}