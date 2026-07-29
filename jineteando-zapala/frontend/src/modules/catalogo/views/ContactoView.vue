<script setup lang="ts">
import { useConfiguracionStore } from '../../../stores/configuracion'
import NavegacionPublica from '../components/NavegacionPublica.vue'
import FooterPublico from '../components/FooterPublico.vue'
import { generarUrlWhatsApp } from '../../../shared/utils/whatsapp'
import { computed } from 'vue'

const configStore = useConfiguracionStore()
const config = computed(() => configStore.config)
const whatsappLink = computed(() => generarUrlWhatsApp('Hola, quisiera información.', config.value?.whatsapp))
</script>

<template>
  <div class="min-h-screen bg-fondo text-texto flex flex-col">
    <NavegacionPublica />
    <main class="flex-1 max-w-7xl mx-auto px-6 py-24 w-full">
      <h1 class="font-serif text-4xl mb-12">Contacto</h1>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <!-- Bloque Dirección -->
        <div class="bg-superficie rounded-card shadow-sm p-8 flex flex-col items-start">
          <div class="w-12 h-12 bg-primario/10 rounded-full flex items-center justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-primario" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
            </svg>
          </div>
          <h3 class="font-medium text-lg mb-2">Dirección</h3>
          <p class="text-texto-secundario">{{ config?.direccion || 'Bernardo Houssay 686, Zapala, Neuquén' }}</p>
        </div>
        <!-- Bloque Horarios -->
        <div class="bg-superficie rounded-card shadow-sm p-8 flex flex-col items-start">
          <div class="w-12 h-12 bg-primario/10 rounded-full flex items-center justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-primario" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
          <h3 class="font-medium text-lg mb-2">Horarios</h3>
          <p class="text-texto-secundario whitespace-pre-line">{{ config?.horarios || 'Lunes a sábado: 09:00-13:00 / 16:30-20:30' }}</p>
        </div>
        <!-- Bloque WhatsApp -->
        <div class="bg-superficie rounded-card shadow-sm p-8 flex flex-col items-start">
          <div class="w-12 h-12 bg-whatsapp/20 rounded-full flex items-center justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-whatsapp" fill="currentColor" viewBox="0 0 16 16">
              <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z"/>
            </svg>
          </div>
          <h3 class="font-medium text-lg mb-2">WhatsApp</h3>
          <a :href="whatsappLink" target="_blank" class="text-whatsapp font-medium hover:underline">
            {{ config?.whatsapp || '+5493413107891' }}
          </a>
        </div>
      </div>

      <!-- Redes sociales -->
      <div v-if="config?.instagram || config?.facebook || config?.tiktok" class="mt-12 flex gap-6">
        <!-- Instagram -->
        <a v-if="config.instagram" :href="`https://instagram.com/${config.instagram}`" target="_blank" class="text-texto-secundario hover:text-primario transition-colors" aria-label="Instagram">
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
        </a>
        <!-- Facebook -->
        <a v-if="config.facebook" :href="`https://facebook.com/${config.facebook}`" target="_blank" class="text-texto-secundario hover:text-primario transition-colors" aria-label="Facebook">
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/></svg>
        </a>
        <!-- TikTok -->
        <a v-if="config.tiktok" :href="`https://tiktok.com/@${config.tiktok}`" target="_blank" class="text-texto-secundario hover:text-primario transition-colors" aria-label="TikTok">
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg>
        </a>
      </div>
    </main>
    <FooterPublico />
  </div>
</template>