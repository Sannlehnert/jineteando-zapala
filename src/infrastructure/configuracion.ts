import { clienteSupabase } from './supabase'
import type { Configuracion, ConfiguracionFormData } from '../domain/types'

export async function obtenerConfiguracion(): Promise<Configuracion> {
  const { data, error } = await clienteSupabase
    .from('configuracion')
    .select('*')
    .eq('id', 1)
    .single()
  if (error) throw new Error(`Error al cargar configuración: ${error.message}`)
  return data as Configuracion
}

export async function actualizarConfiguracion(
  data: ConfiguracionFormData,
  logoUrl?: string | null
): Promise<Configuracion> {
  const payload: any = { ...data }
  if (logoUrl !== undefined) payload.logo_url = logoUrl
  const { data: updated, error } = await clienteSupabase
    .from('configuracion')
    .update(payload)
    .eq('id', 1)
    .select()
    .single()
  if (error) throw new Error(`Error al guardar configuración: ${error.message}`)
  return updated as Configuracion
}