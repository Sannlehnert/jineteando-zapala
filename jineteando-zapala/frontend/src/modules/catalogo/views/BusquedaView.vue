<script setup lang="ts">
import { useBusqueda } from '../composables/useBusqueda'
import NavegacionPublica from '../components/NavegacionPublica.vue'
import { useConfiguracionPublica } from '../composables/useConfiguracionPublica'

const {
  termino,
  categoriaId,
  precioMin,
  precioMax,
  resultados,
  cargando,
  error,
  categorias,
  actualizarTermino,
} = useBusqueda()

const { config } = useConfiguracionPublica()
</script>

<template>
  <div class="min-h-screen bg-[#FDFBF7] text-[#2C2A28]">
    <NavegacionPublica />
    <main class="max-w-6xl mx-auto px-5 py-12">
      <h1 class="text-3xl font-serif font-bold mb-8">Buscar productos</h1>

      <!-- Barra de búsqueda -->
      <div class="mb-6">
        <input
          v-model="termino"
          @input="actualizarTermino(($event.target as HTMLInputElement).value)"
          type="search"
          placeholder="Nombre, código o descripción..."
          class="w-full border border-gray-300 px-4 py-3 text-lg"
        />
      </div>

      <!-- Filtros básicos -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div>
          <label class="block text-sm font-medium mb-1">Categoría</label>
          <select v-model="categoriaId" class="w-full border border-gray-300 px-3 py-2 bg-white">
            <option :value="null">Todas</option>
            <option v-for="cat in categorias" :key="cat.id" :value="cat.id">{{ cat.nombre }}</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Precio mínimo</label>
          <input
            v-model.number="precioMin"
            type="number"
            min="0"
            step="1"
            class="w-full border border-gray-300 px-3 py-2"
            placeholder="$"
          />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Precio máximo</label>
          <input
            v-model.number="precioMax"
            type="number"
            min="0"
            step="1"
            class="w-full border border-gray-300 px-3 py-2"
            placeholder="$"
          />
        </div>
      </div>

      <!-- Resultados -->
      <div v-if="cargando" class="text-gray-500">Buscando...</div>
      <div v-else-if="error" class="text-red-600">{{ error }}</div>
      <div
        v-else-if="resultados.length === 0 && (termino || categoriaId || precioMin !== undefined || precioMax !== undefined)"
        class="text-gray-500 text-center py-12"
      >
        No se encontraron productos con esos criterios.
      </div>
      <div v-else-if="resultados.length === 0 && !termino && !categoriaId && precioMin === undefined && precioMax === undefined" class="text-gray-500 text-center py-12">
        Utilizá los campos para buscar productos.
      </div>

      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <router-link
          v-for="prod in resultados"
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
            <p class="text-sm text-gray-500">{{ prod.codigo }}</p>
            <p class="text-lg font-serif mt-2">${{ prod.precio_minorista.toLocaleString() }}</p>
          </div>
        </router-link>
      </div>
    </main>
  </div>
</template>