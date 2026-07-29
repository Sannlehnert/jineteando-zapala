import { clienteSupabase } from './supabase'

export async function generarCodigoProducto(): Promise<string> {
  try {
    // Intentar usar la función RPC
    const { data, error } = await clienteSupabase.rpc('generar_codigo_producto')
    if (!error && data) {
      return data as string
    }
  } catch (e) {
    console.warn('Falló RPC generar_codigo_producto, usando código temporal:', e)
  }
  // Fallback: generar un código único con timestamp
  const timestamp = Date.now().toString(36).toUpperCase()
  return `JZ-${timestamp}`
}