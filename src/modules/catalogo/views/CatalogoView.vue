<script setup lang="ts">
import { useCatalogo } from '../composables/useCatalogo'
import NavegacionPublica from '../components/NavegacionPublica.vue'
import FooterPublico from '../components/FooterPublico.vue'
import { useHead } from '../../../shared/composables/useHead'

const { categorias, cargando, error } = useCatalogo()

useHead({ title: 'Catálogo', description: 'Explorá todas nuestras categorías de productos regionales y de campo.' })
</script>

<template>
  <div class="min-h-screen bg-fondo text-texto flex flex-col">
    <NavegacionPublica />
    <main class="flex-1 max-w-7xl mx-auto px-6 py-24 w-full">
      <h1 class="font-serif text-4xl mb-8">Catálogo</h1>
      <div v-if="cargando" class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
        <div v-for="n in 8" :key="n" class="skeleton h-40 rounded-card" />
      </div>
      <div v-else-if="error" class="text-error text-center">{{ error }}</div>
      <div v-else class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
        <router-link
          v-for="cat in categorias"
          :key="cat.id"
          :to="`/catalogo/${cat.slug}`"
          class="bg-superficie rounded-card shadow-sm hover:shadow-md transition-all p-6 flex flex-col items-center text-center"
        >
          <div class="w-16 h-16 rounded-full bg-secundario/20 flex items-center justify-center mb-3 overflow-hidden">
            <img v-if="cat.imagen_url" :src="cat.imagen_url" :alt="cat.nombre" class="w-full h-full object-cover" />
            <span v-else class="font-serif text-2xl text-primario/60">{{ cat.nombre.charAt(0) }}</span>
          </div>
          <span class="font-medium text-sm">{{ cat.nombre }}</span>
        </router-link>
      </div>
    </main>
    <FooterPublico />
  </div>
</template>