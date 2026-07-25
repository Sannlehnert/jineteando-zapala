<script setup lang="ts">
import { useProductoPublico } from '../composables/useProductoPublico'
import NavegacionPublica from '../components/NavegacionPublica.vue'
import { generarUrlWhatsApp, mensajeProducto } from '../../../shared/utils/whatsapp'

const { producto, cargando, error } = useProductoPublico()
</script>

<template>
  <div class="min-h-screen bg-[#FDFBF7] text-[#2C2A28]">
    <NavegacionPublica />
    <main class="max-w-4xl mx-auto px-5 py-12">
      <router-link to="/catalogo" class="text-amber-800 text-sm hover:underline mb-6 inline-block">&larr; Volver al catálogo</router-link>

      <div v-if="cargando" class="animate-pulse space-y-6">
        <div class="h-64 bg-gray-200" />
        <div class="h-8 bg-gray-200 w-2/3" />
        <div class="h-6 bg-gray-200 w-1/4" />
        <div class="h-4 bg-gray-200 w-3/4" />
      </div>

      <div v-else-if="error" class="text-center text-red-600 py-12">
        <p class="text-lg">{{ error }}</p>
        <router-link to="/" class="mt-4 inline-block text-amber-800 underline">Ir al inicio</router-link>
      </div>

      <template v-else-if="producto">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div class="bg-gray-100 flex items-center justify-center h-80 md:h-96">
            <img
              v-if="producto.imagen_principal_url"
              :src="producto.imagen_principal_url"
              :alt="producto.nombre"
              class="w-full h-full object-contain"
            />
            <span v-else class="text-gray-400">Sin imagen disponible</span>
          </div>
          
          <div>
            <p class="text-sm text-gray-500 mb-1">{{ producto.codigo }}</p>
            <h1 class="text-3xl font-serif font-bold mb-4">{{ producto.nombre }}</h1>
            <p class="text-2xl font-serif text-amber-900 mb-1">${{ producto.precio_minorista.toLocaleString() }}</p>
            <p v-if="producto.precio_mayorista" class="text-lg text-gray-700 mb-4">
              <span class="font-medium">Precio mayorista:</span> ${{ producto.precio_mayorista.toLocaleString() }}
            </p>
            
            <p class="text-gray-700 mb-8">{{ producto.descripcion }}</p>

            <a
              :href="generarUrlWhatsApp(mensajeProducto(producto.nombre, producto.codigo))"
              target="_blank"
              class="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-3 font-medium hover:bg-green-700 transition"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16"><path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z"/></svg>
              Consultar por WhatsApp
            </a>
          </div>
        </div>
      </template>
    </main>
  </div>
</template>