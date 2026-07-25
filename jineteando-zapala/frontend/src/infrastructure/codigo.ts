import { clienteSupabase } from './supabase'

export async function generarCodigoProducto(): Promise<string> {
  // Llamamos a una función RPC que crearemos en la DB (opcional)
  // Alternativamente podemos hacer una consulta al max código, pero mejor con RPC.
  const { data, error } = await clienteSupabase.rpc('generar_codigo_producto')
  if (error) throw new Error(`Error al generar código: ${error.message}`)
  return data as string
}