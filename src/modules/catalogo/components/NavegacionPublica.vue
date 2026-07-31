<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useConfiguracionStore } from '../../../stores/configuracion'

const configStore = useConfiguracionStore()
const logoUrl = computed(() => configStore.config?.logo_url ?? null)
const whatsappUrl = computed(() => {
  const numero = configStore.config?.whatsapp || '5493413107891'
  return `https://wa.me/${numero}?text=Hola%2C%20quisiera%20informaci%C3%B3n.`
})

const scrolled = ref(false)
const menuAbierto = ref(false)

const handleScroll = () => {
  scrolled.value = window.scrollY > 20
}

onMounted(() => window.addEventListener('scroll', handleScroll, { passive: true }))
onUnmounted(() => window.removeEventListener('scroll', handleScroll))
</script>

<template>
  <nav
    :class="[
      'fixed top-0 inset-x-0 z-50 transition-colors duration-500',
      scrolled ? 'bg-white/80 backdrop-blur-xl shadow-sm border-b border-borde' : 'bg-transparent'
    ]"
  >
    <div class="max-w-7xl mx-auto px-6 h-18 flex items-center justify-between">
      <router-link to="/" class="flex items-center gap-2 shrink-0">
        <img v-if="logoUrl" :src="logoUrl" alt="Jineteando Zapala" class="h-8 w-auto" />
        <span v-else class="font-serif text-2xl text-texto font-semibold tracking-tight">Jineteando Zapala</span>
      </router-link>

      <div class="hidden md:flex items-center gap-8 text-sm font-medium">
        <router-link to="/" class="text-texto hover:text-primario transition-colors">Inicio</router-link>
        <router-link to="/catalogo" class="text-texto hover:text-primario transition-colors">Catálogo</router-link>
        <router-link to="/buscar" class="text-texto hover:text-primario transition-colors">Buscar</router-link>
        <router-link to="/contacto" class="text-texto hover:text-primario transition-colors">Contacto</router-link>
        <a
          :href="whatsappUrl"
          target="_blank"
          class="bg-whatsapp text-white px-4 py-2 rounded-full text-xs font-semibold hover:scale-105 transition-transform shadow-sm"
        >
          WhatsApp
        </a>
      </div>

      <button
        @click="menuAbierto = !menuAbierto"
        class="md:hidden p-2 rounded-full hover:bg-borde/50 transition-colors"
        aria-label="Menú"
      >
        <svg v-if="!menuAbierto" xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
        </svg>
        <svg v-else xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>
    </div>

    <div
      v-if="menuAbierto"
      class="md:hidden bg-superficie/95 backdrop-blur-md border-t border-borde px-6 py-4 animate-fade-in"
    >
      <div class="flex flex-col space-y-3">
        <router-link @click="menuAbierto = false" to="/" class="text-texto font-medium py-2">Inicio</router-link>
        <router-link @click="menuAbierto = false" to="/catalogo" class="text-texto font-medium py-2">Catálogo</router-link>
        <router-link @click="menuAbierto = false" to="/buscar" class="text-texto font-medium py-2">Buscar</router-link>
        <router-link @click="menuAbierto = false" to="/contacto" class="text-texto font-medium py-2">Contacto</router-link>
        <a
          :href="whatsappUrl"
          target="_blank"
          class="bg-whatsapp text-white px-4 py-2 rounded-full text-sm font-semibold self-start"
        >
          WhatsApp
        </a>
      </div>
    </div>
  </nav>
</template>