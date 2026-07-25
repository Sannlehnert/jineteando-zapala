<script setup lang="ts">
import { useSubcategoriaPublica } from '../composables/useSubcategoriaPublica'
import { useRoute } from 'vue-router'
import NavegacionPublica from '../components/NavegacionPublica.vue'

const route = useRoute()
const { categoria, productos, cargando, error } = useSubcategoriaPublica()
</script>

<template>
  <div class="min-h-screen bg-[#FDFBF7] text-[#2C2A28]">
    <NavegacionPublica />
    <main class="max-w-6xl mx-auto px-5 py-12">
      <!-- Breadcrumb -->
      <nav class="text-sm text-gray-500 mb-4">
        <router-link to="/" class="hover:text-amber-800">Inicio</router-link>
        <span class="mx-2">/</span>
        <router-link
          v-if="categoria?.padre_id"
          :to="`/catalogo/${route.params.categoriaSlug}`"
          class="hover:text-amber-800"
        >
          {{ route.params.categoriaSlug }}
        </router-link>
        <span class="mx-2">/</span>
        <span class="text-gray-700">{{ categoria?.nombre }}</span>
      </nav>

      <div v-if="cargando" class="space-y-4">
        <div class="h-8 bg-gray-200 w-1/3 animate-pulse rounded" />
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="n in 4" :key="n" class="bg-gray-100 h-60 animate-pulse" />
        </div>
      </div>

      <div v-else-if="error" class="text-center text-red-600 py-12">
        <p class="text-lg">{{ error }}</p>
        <router-link to="/catalogo" class="mt-4 inline-block text-amber-800 underline">Ver todas las categorías</router-link>
      </div>

      <template v-else-if="categoria">
        <h1 class="text-3xl font-serif font-bold mb-8">{{ categoria.nombre }}</h1>

        <div v-if="productos.length === 0" class="text-gray-500 text-center py-12 border border-dashed border-gray-300 bg-white">
          <p>Todavía no hay productos publicados en esta categoría.</p>
        </div>
        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <router-link
            v-for="prod in productos"
            :key="prod.id"
            :to="`/producto/${prod.slug}`"
            class="group bg-white border border-gray-200 overflow-hidden hover:border-amber-800 transition-colors"
          >
            <div class="h-48 bg-gray-100 flex items-center justify-center">
              <img
                v-if="prod.imagen_principal_url"
                :src="prod.imagen_principal_url"
                :alt="prod.nombre"
                class="w-full h-full object-cover"
              />
              <span v-else class="text-gray-400 text-sm">Sin imagen</span>
            </div>
            <div class="p-4">
              <h2 class="font-medium group-hover:text-amber-900 transition">{{ prod.nombre }}</h2>
              <p class="text-lg font-serif mt-2">${{ prod.precio_minorista.toLocaleString() }}</p>
              <p v-if="prod.precio_mayorista" class="text-sm text-gray-600">Mayorista: ${{ prod.precio_mayorista.toLocaleString() }}</p>
            </div>
          </router-link>
        </div>
      </template>
    </main>
  </div>
</template>