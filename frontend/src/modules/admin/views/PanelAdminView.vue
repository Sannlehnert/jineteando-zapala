<script setup lang="ts">
import { useAuthStore } from '../../../stores/auth'
import { useRouter } from 'vue-router'
import { onMounted, ref } from 'vue'
import { obtenerProductos } from '../../../infrastructure/productos'
import { obtenerCategorias } from '../../../infrastructure/categorias'
import type { Producto } from '../../../domain/types'

const authStore = useAuthStore()
const router = useRouter()

const totalProductos = ref(0)
const totalCategorias = ref(0)
const productosActivos = ref(0)
const ultimosProductos = ref<Producto[]>([])

onMounted(async () => {
  const [productos, categorias] = await Promise.all([
    obtenerProductos(true),
    obtenerCategorias(true)
  ])
  totalProductos.value = productos.length
  productosActivos.value = productos.filter(p => p.activo).length
  totalCategorias.value = categorias.length
  ultimosProductos.value = productos
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5)
})

async function cerrarSesion() {
  await authStore.signOut()
  router.push('/admin/login')
}
</script>

<template>
  <div class="min-h-screen bg-fondo text-texto">
    <header class="bg-superficie shadow-sm px-6 py-4 flex items-center justify-between">
      <h1 class="text-lg font-semibold text-primario">Panel</h1>
      <span class="text-sm text-texto-secundario">{{ authStore.user?.email }}</span>
    </header>
    <main class="max-w-7xl mx-auto px-6 py-8 space-y-8">
      <!-- KPIs -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <div class="bg-superficie rounded-card shadow-sm p-6">
          <p class="text-3xl font-serif text-primario">{{ totalProductos }}</p>
          <p class="text-sm text-texto-secundario mt-1">Total productos</p>
        </div>
        <div class="bg-superficie rounded-card shadow-sm p-6">
          <p class="text-3xl font-serif text-primario">{{ totalCategorias }}</p>
          <p class="text-sm text-texto-secundario mt-1">Categorías</p>
        </div>
        <div class="bg-superficie rounded-card shadow-sm p-6">
          <p class="text-3xl font-serif text-exito">{{ productosActivos }}</p>
          <p class="text-sm text-texto-secundario mt-1">Activos</p>
        </div>
        <div class="bg-superficie rounded-card shadow-sm p-6">
          <p class="text-3xl font-serif text-error">{{ totalProductos - productosActivos }}</p>
          <p class="text-sm text-texto-secundario mt-1">Inactivos</p>
        </div>
      </div>

      <!-- Acciones rápidas -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <router-link to="/admin/productos/nuevo" class="bg-primario text-white rounded-card shadow-sm p-5 text-center font-medium hover:shadow-md transition-all">Nuevo producto</router-link>
        <router-link to="/admin/categorias" class="bg-secundario text-texto rounded-card shadow-sm p-5 text-center font-medium hover:shadow-md transition-all">Gestionar categorías</router-link>
        <router-link to="/admin/productos" class="bg-superficie rounded-card shadow-sm p-5 text-center font-medium hover:shadow-md transition-all">Ver productos</router-link>
        <router-link to="/admin/configuracion" class="bg-superficie rounded-card shadow-sm p-5 text-center font-medium hover:shadow-md transition-all">Configuración</router-link>
      </div>

      <!-- Últimos productos -->
      <div class="bg-superficie rounded-card shadow-sm p-6">
        <h2 class="font-medium text-lg mb-4">Últimos productos agregados</h2>
        <div v-if="ultimosProductos.length === 0" class="text-texto-secundario text-sm">No hay productos aún.</div>
        <div v-else class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead class="border-b border-borde">
              <tr class="text-left text-texto-secundario">
                <th class="py-2 pr-4 font-medium">Producto</th>
                <th class="py-2 pr-4 font-medium">Código</th>
                <th class="py-2 pr-4 font-medium">Precio</th>
                <th class="py-2 font-medium">Estado</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="prod in ultimosProductos" :key="prod.id" class="border-b border-borde/50 last:border-0 hover:bg-fondo/50 transition-colors">
                <td class="py-2 pr-4">{{ prod.nombre }}</td>
                <td class="py-2 pr-4 font-mono text-xs">{{ prod.codigo }}</td>
                <td class="py-2 pr-4">${{ prod.precio_minorista.toLocaleString() }}</td>
                <td class="py-2">
                  <span :class="prod.activo ? 'text-exito' : 'text-error'" class="text-xs font-medium">{{ prod.activo ? 'Activo' : 'Inactivo' }}</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="text-right">
        <button @click="cerrarSesion" class="text-sm text-error hover:underline">Cerrar sesión</button>
      </div>
    </main>
  </div>
</template>