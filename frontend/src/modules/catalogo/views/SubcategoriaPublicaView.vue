<script setup lang="ts">
import { watch } from 'vue'
import { useSubcategoriaPublica } from '../composables/useSubcategoriaPublica'
import { useRoute } from 'vue-router'
import NavegacionPublica from '../components/NavegacionPublica.vue'
import FooterPublico from '../components/FooterPublico.vue'
import TarjetaProducto from '../../../shared/components/TarjetaProducto.vue'
import { useHead } from '../../../shared/composables/useHead'
import { computed } from 'vue'

const route = useRoute()
const { categoria, productos, cargando, error } = useSubcategoriaPublica()

const headOptions = computed(() => ({
  title: categoria.value?.nombre || 'Subcategoría',
  description: `Productos en ${categoria.value?.nombre || ''}. Descubrí la mejor selección de Jineteando Zapala.`,
}))
useHead(headOptions)

const insertarBreadcrumb = () => {
  if (!categoria.value) return
  const items = [
    { '@type': 'ListItem', position: 1, name: 'Inicio', item: `${window.location.origin}/` },
    { '@type': 'ListItem', position: 2, name: 'Catálogo', item: `${window.location.origin}/catalogo` },
    { '@type': 'ListItem', position: 3, name: route.params.categoriaSlug as string, item: `${window.location.origin}/catalogo/${route.params.categoriaSlug}` },
    { '@type': 'ListItem', position: 4, name: categoria.value.nombre, item: window.location.href },
  ]
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items,
  }
  const script = document.createElement('script')
  script.type = 'application/ld+json'
  script.textContent = JSON.stringify(schema)
  document.head.appendChild(script)
}

watch(categoria, (cat) => {
  if (cat) insertarBreadcrumb()
})
</script>

<template>
  <div class="min-h-screen bg-fondo text-texto flex flex-col">
    <NavegacionPublica />
    <main class="flex-1 max-w-7xl mx-auto px-6 py-24 w-full">
      <nav class="text-sm text-texto-secundario mb-4">
        <router-link to="/" class="hover:text-primario">Inicio</router-link> /
        <router-link v-if="categoria?.padre_id" :to="`/catalogo/${route.params.categoriaSlug}`" class="hover:text-primario">{{ route.params.categoriaSlug }}</router-link> /
        <span class="text-texto">{{ categoria?.nombre }}</span>
      </nav>
      <div v-if="cargando" class="space-y-4">
        <div class="skeleton h-8 w-1/3" />
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <div v-for="n in 4" :key="n" class="skeleton h-64 rounded-card" />
        </div>
      </div>
      <div v-else-if="error" class="text-error text-center py-12">{{ error }}</div>
      <template v-else-if="categoria">
        <h1 class="font-serif text-4xl mb-8">{{ categoria.nombre }}</h1>
        <div v-if="productos.length === 0" class="text-center py-20 bg-superficie rounded-card shadow-sm text-texto-secundario">
          No hay productos en esta subcategoría.
        </div>
        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <TarjetaProducto v-for="prod in productos" :key="prod.id" :producto="prod" />
        </div>
      </template>
    </main>
    <FooterPublico />
  </div>
</template>