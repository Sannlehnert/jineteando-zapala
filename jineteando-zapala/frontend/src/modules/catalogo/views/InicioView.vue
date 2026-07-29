<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useCatalogo } from '../composables/useCatalogo'
import { useConfiguracionStore } from '../../../stores/configuracion'
import { obtenerProductos } from '../../../infrastructure/productos'
import NavegacionPublica from '../components/NavegacionPublica.vue'
import FooterPublico from '../components/FooterPublico.vue'
import TarjetaProducto from '../../../shared/components/TarjetaProducto.vue'
import MarqueeCategorias from './MarqueeCategorias.vue'
import type { Producto } from '../../../domain/types'

const { categorias, cargando, error } = useCatalogo()
const config = useConfiguracionStore().config
const whatsappLink = `https://wa.me/${config?.whatsapp || '5493413107891'}?text=Hola%2C%20quisiera%20informaci%C3%B3n.`

const productosDestacados = ref<Producto[]>([])
const cargandoDestacados = ref(false)

onMounted(async () => {
  cargandoDestacados.value = true
  try {
    const todos = await obtenerProductos(false)
    productosDestacados.value = todos.slice(0, 6)
  } catch (e) { /* vacío */ }
  finally { cargandoDestacados.value = false }
})
</script>

<template>
  <div class="min-h-screen bg-fondo text-texto">
    <NavegacionPublica />

    <!-- Hero editorial -->
    <header class="relative pt-32 pb-24 md:pt-48 md:pb-36 px-6 max-w-7xl mx-auto">
      <div class="max-w-2xl">
        <p class="text-xs tracking-[0.2em] uppercase text-texto-secundario mb-4">Desde Zapala, Neuquén</p>
        <h1 class="font-serif text-5xl md:text-7xl font-semibold leading-[1.1] text-texto mb-6">
          {{ config?.nombre || 'Jineteando Zapala' }}
        </h1>
        <p class="text-lg text-texto-secundario leading-relaxed mb-10 max-w-xl">
          {{ config?.descripcion || 'Productos regionales y de campo. Calidad, tradición y autenticidad desde la Patagonia.' }}
        </p>
        <div class="flex flex-wrap gap-4">
          <router-link to="/catalogo" class="bg-primario text-white px-8 py-3.5 rounded-full text-sm font-medium hover:scale-105 transition-transform shadow-md">
            Explorar catálogo
          </router-link>
          <a :href="whatsappLink" target="_blank" class="bg-whatsapp text-white px-8 py-3.5 rounded-full text-sm font-medium hover:scale-105 transition-transform shadow-md inline-flex items-center gap-2">
            WhatsApp
          </a>
        </div>
      </div>
      <!-- Indicador para bajar -->
      <div class="mt-24 flex justify-center">
        <span class="animate-bounce text-texto-secundario opacity-40">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 5v14M5 12l7 7 7-7"/></svg>
        </span>
      </div>
    </header>

    <!-- Categorías con marquee -->
    <section class="py-16 border-b border-borde">
      <div class="max-w-7xl mx-auto px-6 mb-8">
        <h2 class="font-serif text-3xl">Categorías</h2>
      </div>
      <MarqueeCategorias :categorias="categorias" :cargando="cargando" :error="error" />
    </section>

    <!-- Productos destacados -->
    <section class="py-20 px-6 max-w-7xl mx-auto">
      <div class="mb-10">
        <h2 class="font-serif text-3xl mb-2">Productos destacados</h2>
        <p class="text-texto-secundario text-sm">Nuestros productos más elegidos</p>
      </div>
      <div v-if="cargandoDestacados" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        <div v-for="n in 3" :key="n" class="skeleton h-80 rounded-card" />
      </div>
      <div v-else-if="productosDestacados.length === 0" class="text-center py-20 text-texto-secundario bg-superficie rounded-card shadow-sm">
        No hay productos publicados aún.
      </div>
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        <TarjetaProducto v-for="prod in productosDestacados" :key="prod.id" :producto="prod" />
      </div>
    </section>

    <FooterPublico />
  </div>
</template>