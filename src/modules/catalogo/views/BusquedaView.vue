<script setup lang="ts">
import { useBusqueda } from '../composables/useBusqueda'
import NavegacionPublica from '../components/NavegacionPublica.vue'
import FooterPublico from '../components/FooterPublico.vue'
import TarjetaProducto from '../../../shared/components/TarjetaProducto.vue'
import { useHead } from '../../../shared/composables/useHead'
import { computed } from 'vue'

const { termino, categoriaId, precioMin, precioMax, resultados, cargando, error, categorias, actualizarTermino } = useBusqueda()

const headOptions = computed(() => ({
  title: termino.value ? `Buscando "${termino.value}"` : 'Buscar productos',
  description: termino.value ? `Resultados de búsqueda para ${termino.value} en Jineteando Zapala.` : 'Buscar productos regionales y de campo en nuestro catálogo.',
}))
useHead(headOptions)
</script>

<template>
  <div class="min-h-screen bg-fondo text-texto flex flex-col">
    <NavegacionPublica />
    <main class="flex-1 max-w-7xl mx-auto px-6 py-24 w-full">
      <h1 class="font-serif text-4xl mb-8">Buscar</h1>
      <div class="flex flex-col sm:flex-row gap-4 mb-8">
        <input
          v-model="termino"
          @input="actualizarTermino(($event.target as HTMLInputElement).value)"
          type="search"
          placeholder="¿Qué producto buscás?"
          class="flex-1 bg-superficie border border-borde rounded-full px-6 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primario"
        />
        <select v-model="categoriaId" class="bg-superficie border border-borde rounded-full px-4 py-3 text-sm">
          <option :value="null">Todas las categorías</option>
          <option v-for="cat in categorias" :key="cat.id" :value="cat.id">{{ cat.nombre }}</option>
        </select>
        <input v-model.number="precioMin" type="number" placeholder="Precio min." class="bg-superficie border border-borde rounded-full px-4 py-3 text-sm w-32" />
        <input v-model.number="precioMax" type="number" placeholder="Precio max." class="bg-superficie border border-borde rounded-full px-4 py-3 text-sm w-32" />
      </div>

      <div v-if="cargando" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        <div v-for="n in 3" :key="n" class="skeleton h-64 rounded-card" />
      </div>
      <div v-else-if="error" class="text-error text-center py-12">{{ error }}</div>
      <div v-else-if="resultados.length === 0 && (termino || categoriaId || precioMin !== undefined || precioMax !== undefined)" class="text-center py-20 bg-superficie rounded-card shadow-sm text-texto-secundario">
        No se encontraron productos con esos criterios.
      </div>
      <div v-else-if="resultados.length === 0 && !termino && !categoriaId && precioMin === undefined && precioMax === undefined" class="text-center py-20 bg-superficie rounded-card shadow-sm text-texto-secundario">
        Empezá escribiendo el nombre de un producto o elegí una categoría.
      </div>
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        <TarjetaProducto v-for="prod in resultados" :key="prod.id" :producto="prod" />
      </div>
    </main>
    <FooterPublico />
  </div>
</template>