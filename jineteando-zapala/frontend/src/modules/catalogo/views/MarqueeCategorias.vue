<script setup lang="ts">
import { computed } from 'vue'
import type { Categoria } from '../../../domain/types'

const props = defineProps<{
  categorias: Categoria[]
  cargando: boolean
  error: string | null
}>()

// Duplicamos las categorías para el efecto marquee infinito
const items = computed(() => [...props.categorias, ...props.categorias])
</script>

<template>
  <div class="overflow-hidden relative">
    <div
      v-if="cargando"
      class="flex gap-6 px-6"
    >
      <div v-for="n in 4" :key="n" class="skeleton min-w-[200px] h-32 rounded-card flex-shrink-0" />
    </div>
    <div v-else-if="error" class="text-center text-error px-6">{{ error }}</div>
    <div
      v-else
      class="flex gap-6 animate-marquee hover:pause-animation"
      @mouseenter="(e) => (e.currentTarget as HTMLElement).classList.add('pause-animation')"
      @mouseleave="(e) => (e.currentTarget as HTMLElement).classList.remove('pause-animation')"
    >
      <router-link
        v-for="(cat, idx) in items"
        :key="`${cat.id}-${idx}`"
        :to="`/catalogo/${cat.slug}`"
        class="flex-shrink-0 w-52 bg-superficie rounded-card shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 overflow-hidden"
      >
        <div class="h-28 bg-secundario/20 flex items-center justify-center">
          <img v-if="cat.imagen_url" :src="cat.imagen_url" :alt="cat.nombre" class="w-full h-full object-cover" />
          <span v-else class="font-serif text-3xl text-primario/50">{{ cat.nombre.charAt(0) }}</span>
        </div>
        <div class="p-4 text-center">
          <p class="font-medium text-sm text-texto">{{ cat.nombre }}</p>
        </div>
      </router-link>
    </div>
  </div>
</template>