const WHATSAPP_NUMBER = '+5493413107891'

export function generarUrlWhatsApp(mensaje: string) {
  const encoded = encodeURIComponent(mensaje)
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encoded}`
}

export function mensajeProducto(nombre: string, codigo: string) {
  return `Hola, vi en el catálogo de Jineteando Zapala el producto:\n${nombre}\nCódigo: ${codigo}\nQuisiera consultar por disponibilidad y más información.`
}