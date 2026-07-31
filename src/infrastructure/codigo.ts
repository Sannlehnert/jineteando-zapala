import { clienteSupabase } from './supabase'

export async function generarCodigoProducto(): Promise<string> {
  try {
    const { data, error } = await clienteSupabase.rpc('generar_codigo_producto')
    if (!error && data) {
      return data as string
    }
  } catch (e) {
    console.error('Falló RPC generar_codigo_producto, usando código temporal:', e)
  }
  const timestamp = Date.now().toString(36).toUpperCase()
  return `JZ-${timestamp}`
}