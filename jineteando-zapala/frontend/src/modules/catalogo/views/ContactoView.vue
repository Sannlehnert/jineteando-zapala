<script setup lang="ts">
import { useConfiguracionPublica } from '../composables/useConfiguracionPublica'
import NavegacionPublica from '../components/NavegacionPublica.vue'
import { generarUrlWhatsApp } from '../../../shared/utils/whatsapp'
import { computed } from 'vue'

const { config } = useConfiguracionPublica()
const whatsappLink = computed(() => generarUrlWhatsApp('Hola, quisiera información.', config.value?.whatsapp))
</script>

<template>
  <div class="min-h-screen bg-[#FDFBF7] text-[#2C2A28]">
    <NavegacionPublica />
    <main class="max-w-2xl mx-auto px-5 py-12">
      <h1 class="text-3xl font-serif font-bold mb-8">Contacto</h1>

      <div class="bg-white border border-gray-200 p-8 space-y-6">
        <div>
          <h2 class="text-lg font-medium mb-2">Dirección</h2>
          <p class="text-gray-700">{{ config?.direccion || 'Bernardo Houssay 686, Zapala, Neuquén' }}</p>
        </div>

        <div>
          <h2 class="text-lg font-medium mb-2">Horarios</h2>
          <p class="text-gray-700">{{ config?.horarios || 'Lunes a sábado: 09:00–13:00 y 16:30–20:30' }}</p>
        </div>

        <div>
          <h2 class="text-lg font-medium mb-2">WhatsApp</h2>
          <a
            :href="whatsappLink"
            target="_blank"
            class="text-green-700 hover:underline"
          >
            {{ config?.whatsapp || '+54 9 341 310-7891' }}
          </a>
        </div>

        <div v-if="config">
          <h2 class="text-lg font-medium mb-2">Redes sociales</h2>
          <div class="flex gap-4">
            <a v-if="config.instagram" :href="`https://instagram.com/${config.instagram}`" target="_blank" class="text-amber-800 hover:underline">Instagram</a>
            <a v-if="config.facebook" :href="`https://facebook.com/${config.facebook}`" target="_blank" class="text-amber-800 hover:underline">Facebook</a>
            <a v-if="config.tiktok" :href="`https://tiktok.com/@${config.tiktok}`" target="_blank" class="text-amber-800 hover:underline">TikTok</a>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>