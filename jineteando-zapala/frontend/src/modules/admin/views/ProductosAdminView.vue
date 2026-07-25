<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useProductosAdmin } from '../composables/useProductos'
import type { Producto } from '../../../domain/types'

const { productos, cargando, error, cargarProductos, cambiarEstado } = useProductosAdmin()
const router = useRouter()

onMounted(() => {
  cargarProductos()
})

const irANuevo = () => {
  router.push('/admin/productos/nuevo')
}

const irAEditar = (id: string) => {
  router.push(`/admin/productos/${id}/editar`)
}

const alternarEstado = async (prod: Producto) => {
  try {
    await cambiarEstado(prod.id, !prod.activo)
  } catch (e: any) {
    error.value = e.message
  }
}
</script>

<template>
  <div class="min-h-screen bg-[#FDFBF7] text-[#2C2A28]">
    <header class="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
      <h1 class="text-xl font-semibold">Productos</h1>
      <router-link to="/admin" class="text-sm text-amber-800 hover:underline">Volver al panel</router-link>
    </header>

    <main class="max-w-5xl mx-auto px-6 py-8">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-lg font-medium">Listado de productos</h2>
        <button @click="irANuevo" class="bg-amber-800 text-white px-4 py-2 text-sm font-medium hover:bg-amber-900 transition">
          Agregar producto
        </button>
      </div>

      <div v-if="error" class="mb-4 p-3 bg-red-50 border border-red-200 text-red-800 text-sm">
        {{ error }}
      </div>

      <div v-if="cargando" class="text-gray-500">Cargando...</div>

      <div v-else class="bg-white border border-gray-200 overflow-x-auto">
        <table v-if="productos.length > 0" class="w-full text-sm">
          <thead class="bg-gray-50">
            <tr>
              <th class="p-3 text-left">Imagen</th>
              <th class="p-3 text-left">Nombre</th>
              <th class="p-3 text-left">Código</th>
              <th class="p-3 text-left">Categoría</th>
              <th class="p-3 text-left">Precio Min.</th>
              <th class="p-3 text-left">Estado</th>
              <th class="p-3 text-left">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="prod in productos"
              :key="prod.id"
              class="border-b border-gray-100"
            >
              <td class="p-3">
                <img
                  v-if="prod.imagen_principal_url"
                  :src="prod.imagen_principal_url"
                  class="w-10 h-10 object-cover"
                  alt=""
                />
                <span v-else class="text-gray-400 text-xs">Sin imagen</span>
              </td>
              <td class="p-3 font-medium">{{ prod.nombre }}</td>
              <td class="p-3">{{ prod.codigo }}</td>
              <td class="p-3">{{ (prod as any).categoria?.nombre || '—' }}</td>
              <td class="p-3">${{ prod.precio_minorista }}</td>
              <td class="p-3">
                <span :class="prod.activo ? 'text-green-700' : 'text-red-600'">
                  {{ prod.activo ? 'Activo' : 'Inactivo' }}
                </span>
              </td>
              <td class="p-3 space-x-2">
                <button @click="irAEditar(prod.id)" class="text-amber-800 hover:underline">Editar</button>
                <button @click="alternarEstado(prod)" class="text-gray-600 hover:underline">
                  {{ prod.activo ? 'Desactivar' : 'Activar' }}
                </button>
              </td>
            </tr>
          </tbody>
        </table>
        <div v-else class="p-6 text-gray-500 text-center">No hay productos todavía.</div>
      </div>
    </main>
  </div>
</template>