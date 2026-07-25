<script setup lang="ts">
import NavegacionPublica from '../components/NavegacionPublica.vue'
import { generarUrlWhatsApp } from '../../../shared/utils/whatsapp'
</script>

<template>
  <div class="min-h-screen bg-[#FDFBF7] text-[#2C2A28]">
    <NavegacionPublica />
    <main class="max-w-2xl mx-auto px-5 py-12">
      <h1 class="text-3xl font-serif font-bold mb-8">Contacto</h1>
      
      <div class="bg-white border border-gray-200 p-8 space-y-6">
        <div>
          <h2 class="text-lg font-medium mb-2">Dirección</h2>
          <p class="text-gray-700">Bernardo Houssay 686, Zapala, Neuquén</p>
        </div>
        
        <div>
          <h2 class="text-lg font-medium mb-2">Horarios</h2>
          <p class="text-gray-700">Lunes a sábado</p>
          <p class="text-gray-700">09:00 a 13:00</p>
          <p class="text-gray-700">16:30 a 20:30</p>
        </div>
        
        <div>
          <h2 class="text-lg font-medium mb-2">WhatsApp</h2>
          <a
            :href="generarUrlWhatsApp('Hola, quisiera información.')"
            target="_blank"
            class="text-green-700 hover:underline"
          >
            +54 9 341 310-7891
          </a>
        </div>
        
        <div>
          <h2 class="text-lg font-medium mb-2">Redes sociales</h2>
          <div class="flex gap-4">
            <a href="https://instagram.com/Jineteandozapala" target="_blank" class="text-amber-800 hover:underline">Instagram</a>
            <a href="https://facebook.com/Jineteandozapala" target="_blank" class="text-amber-800 hover:underline">Facebook</a>
            <a href="https://tiktok.com/@Jineteandozapala" target="_blank" class="text-amber-800 hover:underline">TikTok</a>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>