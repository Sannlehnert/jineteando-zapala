export type RolAdmin = 'admin'

export interface Categoria {
  id: string
  nombre: string
  slug: string
  imagen_url: string | null
  activa: boolean
  padre_id: string | null
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
  atributos?: AtributosProducto | null    // NUEVO
  created_at: string
  updated_at: string
}

export interface CategoriaFormData {
  nombre: string
  activa: boolean
  padre_id?: string | null
}

export interface ProductoFormData {
  nombre: string
  codigo: string
  descripcion: string
  precio_minorista: number
  precio_mayorista: number | null
  categoria_id: string
  imagen_principal_url: string | null
  activo: boolean
  atributos?: AtributosProducto | null    // NUEVO
}

// NUEVOS TIPOS
export interface ImagenProducto {
  id: string
  producto_id: string
  url: string
  path_storage: string
  orden: number
  created_at: string
}

export interface AtributosProducto {
  talles?: string[]
  colores?: string[]
  materiales?: string[]
}