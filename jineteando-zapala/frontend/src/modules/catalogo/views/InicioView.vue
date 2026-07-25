<script setup lang="ts">
import { useCatalogo } from '../composables/useCatalogo'
import { useConfiguracionPublica } from '../composables/useConfiguracionPublica'
import NavegacionPublica from '../components/NavegacionPublica.vue'
import { generarUrlWhatsApp } from '../../../shared/utils/whatsapp'
import { computed } from 'vue'

const { categorias, cargando, error, recargar } = useCatalogo()
const { config } = useConfiguracionPublica()

const whatsappLink = computed(() =>
  generarUrlWhatsApp(
    'Hola, quisiera información sobre sus productos.',
    config.value?.whatsapp
  )
)
</script>

<template>
  <div class="min-h-screen bg-[#FDFBF7] text-[#2C2A28]">
    <NavegacionPublica />

    <!-- Hero -->
    <header class="py-16 px-5 text-center">
      <h1 class="text-4xl md:text-5xl font-serif font-bold mb-4">
        {{ config?.nombre || 'Jineteando Zapala' }}
      </h1>
      <p class="text-lg text-gray-600 max-w-2xl mx-auto">
        {{ config?.descripcion || 'Productos regionales y de campo. Calidad, tradición y autenticidad desde Zapala, Neuquén.' }}
      </p>
    </header>

    <!-- Categorías -->
    <section class="max-w-6xl mx-auto px-5 pb-16">
      <h2 class="text-2xl font-serif font-medium mb-8 text-center">Nuestro catálogo</h2>

      <div v-if="cargando" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="n in 6" :key="n" class="bg-gray-100 h-40 animate-pulse" />
      </div>

      <div v-else-if="error" class="text-center text-red-600">
        <p>{{ error }}</p>
        <button @click="recargar" class="mt-2 text-amber-800 underline">Reintentar</button>
      </div>

      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <router-link
          v-for="cat in categorias"
          :key="cat.id"
          :to="`/catalogo/${cat.slug}`"
          class="group block bg-white border border-gray-200 overflow-hidden hover:border-amber-800 transition-colors"
        >
          <div class="h-40 bg-gray-100 flex items-center justify-center">
            <img v-if="cat.imagen_url" :src="cat.imagen_url" :alt="cat.nombre" class="w-full h-full object-cover" />
            <span v-else class="text-gray-400 text-sm">Sin imagen</span>
          </div>
          <div class="p-4">
            <h3 class="text-lg font-medium group-hover:text-amber-900 transition">{{ cat.nombre }}</h3>
          </div>
        </router-link>
      </div>
    </section>

    <!-- Contacto rápido -->
    <section class="bg-white border-t border-gray-200 py-12">
      <div class="max-w-4xl mx-auto px-5 text-center">
        <h2 class="text-xl font-serif font-medium mb-4">Visitá nuestro local</h2>
        <p class="text-gray-600">{{ config?.direccion || 'Bernardo Houssay 686, Zapala, Neuquén' }}</p>
        <p class="text-gray-600 mt-1">{{ config?.horarios || 'Lunes a sábado: 09:00–13:00 y 16:30–20:30' }}</p>
        <a
          :href="whatsappLink"
          target="_blank"
          class="inline-block mt-6 bg-green-600 text-white px-6 py-3 font-medium hover:bg-green-700 transition"
        >
          Consultar por WhatsApp
        </a>
        <div v-if="config" class="mt-8 flex justify-center gap-4 text-sm text-gray-500">
          <a v-if="config.instagram" :href="`https://instagram.com/${config.instagram}`" target="_blank" class="hover:text-amber-800">Instagram</a>
          <a v-if="config.facebook" :href="`https://facebook.com/${config.facebook}`" target="_blank" class="hover:text-amber-800">Facebook</a>
          <a v-if="config.tiktok" :href="`https://tiktok.com/@${config.tiktok}`" target="_blank" class="hover:text-amber-800">TikTok</a>
        </div>
      </div>
    </section>
  </div>
</template>