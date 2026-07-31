<script setup lang="ts">
import { watch } from 'vue'
import { useCategoriaPublica } from '../composables/useCategoriaPublica'
import NavegacionPublica from '../components/NavegacionPublica.vue'
import FooterPublico from '../components/FooterPublico.vue'
import TarjetaProducto from '../../../shared/components/TarjetaProducto.vue'
import { useHead } from '../../../shared/composables/useHead'
import { computed } from 'vue'

const { categoria, subcategorias, productos, cargando, error } = useCategoriaPublica()

const headOptions = computed(() => ({
  title: categoria.value?.nombre || 'Categoría',
  description: `Productos en la categoría ${categoria.value?.nombre || ''}. Descubrí la mejor selección de Jineteando Zapala.`,
}))
useHead(headOptions)

const insertarBreadcrumb = () => {
  if (!categoria.value) return
  const items = [
    { '@type': 'ListItem', position: 1, name: 'Inicio', item: `${window.location.origin}/` },
    { '@type': 'ListItem', position: 2, name: 'Catálogo', item: `${window.location.origin}/catalogo` },
    { '@type': 'ListItem', position: 3, name: categoria.value.nombre, item: window.location.href },
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
      <router-link to="/catalogo" class="text-primario text-sm hover:underline mb-6 inline-block">&larr; Catálogo</router-link>
      <div v-if="cargando" class="space-y-4">
        <div class="skeleton h-8 w-1/3" />
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <div v-for="n in 4" :key="n" class="skeleton h-64 rounded-card" />
        </div>
      </div>
      <div v-else-if="error" class="text-error text-center py-12">{{ error }}</div>
      <template v-else-if="categoria">
        <h1 class="font-serif text-4xl mb-8">{{ categoria.nombre }}</h1>
        <div v-if="subcategorias.length > 0" class="flex flex-wrap gap-3 mb-10">
          <router-link
            v-for="sub in subcategorias"
            :key="sub.id"
            :to="`/catalogo/${categoria.slug}/${sub.slug}`"
            class="bg-superficie rounded-full px-5 py-2 text-sm shadow-sm hover:shadow-md transition-all"
          >
            {{ sub.nombre }}
          </router-link>
        </div>
        <div v-if="productos.length === 0" class="text-center py-20 bg-superficie rounded-card shadow-sm text-texto-secundario">
          No hay productos en esta categoría.
        </div>
        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <TarjetaProducto v-for="prod in productos" :key="prod.id" :producto="prod" />
        </div>
      </template>
    </main>
    <FooterPublico />
  </div>
</template>