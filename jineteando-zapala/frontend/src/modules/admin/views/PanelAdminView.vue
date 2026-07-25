<script setup lang="ts">
import { useAuthStore } from '../../../stores/auth'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

async function cerrarSesion() {
  await authStore.signOut()
  router.push('/admin/login')
}
</script>

<template>
  <div class="min-h-screen bg-[#FDFBF7] text-[#2C2A28]">
    <header class="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
      <h1 class="text-xl font-semibold">Panel de administración</h1>
      <span class="text-sm text-gray-600">{{ authStore.user?.email }}</span>
    </header>

    <main class="max-w-7xl mx-auto px-6 py-12 space-y-8">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <router-link to="/" class="bg-white border border-gray-200 p-6 hover:bg-gray-50 transition-colors">
          <h2 class="text-lg font-medium mb-1">Ver catálogo público</h2>
          <p class="text-sm text-gray-500">Cómo ven los visitantes tu negocio</p>
        </router-link>

        <router-link to="/admin/productos" class="bg-white border border-gray-200 p-6 hover:bg-gray-50 transition-colors">
          <h2 class="text-lg font-medium mb-1">Gestionar productos</h2>
          <p class="text-sm text-gray-500">Administrá todos los productos</p>
        </router-link>

        <router-link to="/admin/categorias" class="bg-white border border-gray-200 p-6 hover:bg-gray-50 transition-colors">
          <h2 class="text-lg font-medium mb-1">Gestionar categorías</h2>
          <p class="text-sm text-gray-500">Organizá las categorías</p>
        </router-link>

        <!-- NUEVO -->
        <router-link to="/admin/configuracion" class="bg-white border border-gray-200 p-6 hover:bg-gray-50 transition-colors">
          <h2 class="text-lg font-medium mb-1">Configuración del negocio</h2>
          <p class="text-sm text-gray-500">Nombre, logo, contacto y redes</p>
        </router-link>
      </div>

      <div class="pt-4">
        <button @click="cerrarSesion" class="text-sm text-red-700 hover:text-red-900 underline underline-offset-2">
          Cerrar sesión
        </button>
      </div>
    </main>
  </div>
</template>