<script setup lang="ts">
import { computed } from 'vue'
import type { Categoria } from '../../../domain/types'

const props = defineProps<{
  categorias: Categoria[]
  cargando: boolean
  error: string | null
}>()

const items = computed(() => [...props.categorias, ...props.categorias])
</script>

<template>
  <div class="overflow-hidden relative">
    <div v-if="cargando" class="flex gap-4 px-6">
      <div v-for="n in 3" :key="n" class="skeleton min-w-40 h-28 rounded-card shrink-0" />
    </div>
    <div v-else-if="error" class="text-center text-error px-6">{{ error }}</div>
    <div
      v-else
      class="flex gap-4 animate-marquee-mobile sm:animate-marquee hover:pause-animation touch-pause"
      @mouseenter="(e) => (e.currentTarget as HTMLElement).classList.add('pause-animation')"
      @mouseleave="(e) => (e.currentTarget as HTMLElement).classList.remove('pause-animation')"
      @touchstart="(e) => (e.currentTarget as HTMLElement).classList.add('pause-animation')"
      @touchend="(e) => (e.currentTarget as HTMLElement).classList.remove('pause-animation')"
    >
      <router-link
        v-for="(cat, idx) in items"
        :key="`${cat.id}-${idx}`"
        :to="`/catalogo/${cat.slug}`"
        class="shrink-0 w-40 sm:w-52 bg-superficie rounded-card shadow-card hover:shadow-hover transition-all duration-200 transform hover:-translate-y-0.5 overflow-hidden"
      >
        <div class="h-24 sm:h-28 bg-secundario/20 flex items-center justify-center">
          <img v-if="cat.imagen_url" :src="cat.imagen_url" :alt="cat.nombre" class="w-full h-full object-cover" />
          <span v-else class="font-serif text-2xl sm:text-3xl text-primario/50">{{ cat.nombre.charAt(0) }}</span>
        </div>
        <div class="p-3 text-center">
          <p class="font-medium text-xs sm:text-sm text-texto truncate">{{ cat.nombre }}</p>
        </div>
      </router-link>
    </div>
  </div>
</template>

<style scoped>
.animate-marquee {
  animation: marquee 120s linear infinite;
}
.animate-marquee-mobile {
  animation: marquee 20s linear infinite;
}
@keyframes marquee {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}
.pause-animation {
  animation-play-state: paused;
}
.touch-pause {
  touch-action: pan-y;
}
</style>