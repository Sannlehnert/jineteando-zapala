const WHATSAPP_DEFAULT = '+5493413107891'

export function generarUrlWhatsApp(mensaje: string, numero?: string) {
  const phone = numero || WHATSAPP_DEFAULT
  const encoded = encodeURIComponent(mensaje)
  return `https://wa.me/${phone}?text=${encoded}`
}

export function mensajeProducto(nombre: string, codigo: string) {
  return `Hola, vi en el catálogo de Jineteando Zapala el producto:\n${nombre}\nCódigo: ${codigo}\nQuisiera consultar por disponibilidad y más información.`
}

export function generarUrlGoogleMaps(direccion: string): string {
  const encoded = encodeURIComponent(direccion)
  return `https://www.google.com/maps/search/?api=1&query=${encoded}`
}