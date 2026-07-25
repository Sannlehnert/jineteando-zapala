export type RolAdmin = 'admin'

export interface Categoria {
  id: string
  nombre: string
  slug: string
  imagen_url: string | null
  activa: boolean
  padre_id: string | null   // nuevo
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

export interface CategoriaFormData {
  nombre: string
  activa: boolean
  padre_id?: string | null   // nuevo, opcional
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
}