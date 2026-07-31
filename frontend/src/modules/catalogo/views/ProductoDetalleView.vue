<script setup lang="ts">
import { ref, watch, computed, onMounted } from 'vue'
import { useProductoPublico } from '../composables/useProductoPublico'
import { obtenerImagenesProducto } from '../../../infrastructure/imagenes'
import NavegacionPublica from '../components/NavegacionPublica.vue'
import FooterPublico from '../components/FooterPublico.vue'
import { generarUrlWhatsApp, mensajeProducto } from '../../../shared/utils/whatsapp'
import { useHead } from '../../../shared/composables/useHead'
import type { ImagenProducto, AtributosProducto } from '../../../domain/types'

const { producto, cargando, error } = useProductoPublico()
const recargar = () => window.location.reload()
const imagenes = ref<ImagenProducto[]>([])
const imagenSeleccionada = ref<string | null>(null)
const copiado = ref(false)

watch(producto, async (prod) => {
  if (prod) {
    imagenes.value = await obtenerImagenesProducto(prod.id)
    imagenSeleccionada.value = imagenes.value[0]?.url ?? prod.imagen_principal_url ?? null
  }
}, { immediate: true })

const atributos = computed<AtributosProducto | null>(() => {
  if (!producto.value?.atributos) return null
  const a = producto.value.atributos as any
  return { talles: a.talles, colores: a.colores, materiales: a.materiales }
})

const headOptions = computed(() => ({
  title: producto.value?.nombre,
  description: producto.value?.descripcion || `Descubrí ${producto.value?.nombre} en Jineteando Zapala.`,
}))
useHead(headOptions)

onMounted(() => {
  if (!producto.value) return
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: producto.value.nombre,
    description: producto.value.descripcion,
    sku: producto.value.codigo,
    image: producto.value.imagen_principal_url,
    offers: {
      '@type': 'Offer',
      price: producto.value.precio_minorista,
      priceCurrency: 'ARS',
      availability: producto.value.activo ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
    },
  }
  const script = document.createElement('script')
  script.type = 'application/ld+json'
  script.textContent = JSON.stringify(schema)
  document.head.appendChild(script)
})

const compartirProducto = async () => {
  const url = window.location.href
  if (navigator.share) {
    try {
      await navigator.share({
        title: producto.value?.nombre,
        text: `Mirá este producto de Jineteando Zapala: ${producto.value?.nombre}`,
        url,
      })
    } catch (e) {}
  } else {
    await navigator.clipboard.writeText(url)
    copiado.value = true
    setTimeout(() => { copiado.value = false }, 2000)
  }
}
</script>

<template>
  <div class="min-h-screen bg-fondo text-texto flex flex-col">
    <NavegacionPublica />
    <main class="flex-1 max-w-7xl mx-auto px-6 py-24 w-full">
      <router-link to="/catalogo" class="text-primario text-sm hover:underline mb-8 inline-block">&larr; Volver</router-link>
      <div v-if="cargando" class="animate-pulse space-y-6">
        <div class="skeleton h-96 w-full rounded-card" />
        <div class="skeleton h-8 w-2/3" />
      </div>
      <div v-else-if="error" class="text-center py-20 text-error">
        <p class="text-lg">{{ error }}</p>
        <button @click="recargar" class="mt-4 bg-primario text-white px-6 py-2 rounded-full text-sm font-medium hover:scale-105 transition-transform">
          Reintentar
        </button>
      </div>
      <template v-else-if="producto">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <div class="rounded-card overflow-hidden bg-secundario/20 aspect-4/3 flex items-center justify-center">
              <img v-if="imagenSeleccionada" :src="imagenSeleccionada" :alt="producto.nombre" class="w-full h-full object-contain" loading="lazy" decoding="async" />
              <span v-else class="text-texto-secundario/40 text-6xl font-serif">Sin imagen</span>
            </div>
            <div v-if="imagenes.length > 1" class="flex gap-3 mt-4 overflow-x-auto">
              <button v-for="img in imagenes" :key="img.id" @click="imagenSeleccionada = img.url"
                class="shrink-0 w-20 h-20 rounded-2xl border-2 overflow-hidden"
                :class="img.url === imagenSeleccionada ? 'border-primario' : 'border-borde'">
                <img :src="img.url" class="w-full h-full object-cover" loading="lazy" decoding="async" />
              </button>
            </div>
          </div>
          <div class="flex flex-col justify-center">
            <p class="text-sm text-texto-secundario font-mono">{{ producto.codigo }}</p>
            <h1 class="font-serif text-4xl mt-2 mb-4">{{ producto.nombre }}</h1>
            <p class="text-3xl font-price text-primario">${{ producto.precio_minorista.toLocaleString() }}</p>
            <p v-if="producto.precio_mayorista" class="text-lg text-texto-secundario mt-1">Mayorista ${{ producto.precio_mayorista.toLocaleString() }}</p>
            <div v-if="atributos" class="mt-6 space-y-2 text-sm text-texto-secundario">
              <p v-if="atributos.talles?.length"><span class="font-medium text-texto">Talles:</span> {{ atributos.talles.join(' · ') }}</p>
              <p v-if="atributos.colores?.length"><span class="font-medium text-texto">Colores:</span> {{ atributos.colores.join(' · ') }}</p>
              <p v-if="atributos.materiales?.length"><span class="font-medium text-texto">Materiales:</span> {{ atributos.materiales.join(' · ') }}</p>
            </div>
            <p class="mt-6 text-texto-secundario leading-relaxed">{{ producto.descripcion }}</p>
            <a
              :href="generarUrlWhatsApp(mensajeProducto(producto.nombre, producto.codigo))"
              target="_blank"
              class="mt-8 inline-flex items-center gap-2 border-2 border-whatsapp text-whatsapp hover:bg-whatsapp hover:text-white px-8 py-3.5 rounded-full text-sm font-medium transition-all duration-200 shadow-card self-start"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16"><path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z"/></svg>
              Consultar por WhatsApp
            </a>
            <div class="mt-4 flex items-center gap-3">
              <button
                @click="compartirProducto"
                class="text-sm text-texto-secundario hover:text-primario transition-colors flex items-center gap-1"
                aria-label="Compartir producto"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/></svg>
                Compartir
              </button>
              <span v-if="copiado" class="text-xs text-exito animate-fade-in">Enlace copiado</span>
            </div>
          </div>
        </div>
      </template>
    </main>
    <FooterPublico />
  </div>
</template>