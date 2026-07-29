<script setup lang="ts">
defineProps<{
  producto: {
    id: string
    slug: string
    nombre: string
    precio_minorista: number
    precio_mayorista?: number | null
    imagen_principal_url?: string | null
  }
}>()
</script>

<template>
  <router-link
    :to="`/producto/${producto.slug}`"
    class="group bg-superficie rounded-card shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 overflow-hidden flex flex-col"
  >
    <div class="aspect-[4/3] bg-secundario/20 overflow-hidden">
      <img
        v-if="producto.imagen_principal_url"
        :src="producto.imagen_principal_url"
        :alt="producto.nombre"
        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
      />
      <div v-else class="flex items-center justify-center h-full text-texto-secundario/40 text-6xl font-serif">JZ</div>
    </div>
    <div class="p-5 flex flex-col justify-between flex-1">
      <h3 class="font-medium text-texto group-hover:text-primario transition-colors">{{ producto.nombre }}</h3>
      <div class="mt-2">
        <p class="text-xl font-serif text-primario">${{ producto.precio_minorista.toLocaleString() }}</p>
        <p v-if="producto.precio_mayorista" class="text-sm text-texto-secundario mt-1">
          Mayorista ${{ producto.precio_mayorista.toLocaleString() }}
        </p>
      </div>
    </div>
  </router-link>
</template>