<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useProductosAdmin } from '../composables/useProductos'
import type { Producto } from '../../../domain/types'

const { productos, cargando, error, cargarProductos, cambiarEstado } = useProductosAdmin()
const router = useRouter()

onMounted(() => cargarProductos())
const irANuevo = () => router.push('/admin/productos/nuevo')
const irAEditar = (id: string) => router.push(`/admin/productos/${id}/editar`)
const alternarEstado = async (prod: Producto) => {
  try { await cambiarEstado(prod.id, !prod.activo) } catch (e: any) { error.value = e.message }
}
</script>

<template>
  <div class="min-h-screen bg-fondo text-texto">
    <header class="bg-superficie shadow-sm px-6 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
      <h1 class="text-lg font-semibold text-primario">Productos</h1>
      <div class="flex items-center gap-3 w-full sm:w-auto">
        <button @click="irANuevo" class="bg-primario text-white px-4 py-2 rounded-full text-sm font-medium hover:scale-105 transition-transform w-full sm:w-auto text-center">Nuevo</button>
        <router-link to="/admin" class="text-sm text-primario hover:underline self-center">Panel</router-link>
      </div>
    </header>
    <main class="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div v-if="cargando" class="text-texto-secundario">Cargando...</div>
      <div v-else-if="error" class="text-error">{{ error }}</div>
      <div v-else class="bg-superficie rounded-card shadow-sm overflow-hidden">
        <!-- Vista de tabla en desktop -->
        <div class="hidden sm:block">
          <table class="w-full text-sm">
            <thead class="bg-secundario/10 border-b border-borde">
              <tr>
                <th class="p-4 text-left font-medium">Producto</th>
                <th class="p-4 text-left font-medium">Código</th>
                <th class="p-4 text-left font-medium">Categoría</th>
                <th class="p-4 text-left font-medium">Precio</th>
                <th class="p-4 text-left font-medium">Estado</th>
                <th class="p-4 text-left font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="prod in productos" :key="prod.id" class="border-b border-borde/50 hover:bg-fondo/50 transition-colors">
                <td class="p-4 font-medium">{{ prod.nombre }}</td>
                <td class="p-4 font-mono text-xs">{{ prod.codigo }}</td>
                <td class="p-4">{{ (prod as any).categoria?.nombre || '—' }}</td>
                <td class="p-4">${{ prod.precio_minorista.toLocaleString() }}</td>
                <td class="p-4">
                  <span :class="prod.activo ? 'text-exito' : 'text-error'" class="text-xs font-medium">{{ prod.activo ? 'Activo' : 'Inactivo' }}</span>
                </td>
                <td class="p-4 flex gap-2">
                  <button @click="irAEditar(prod.id)" class="text-primario hover:underline text-xs">Editar</button>
                  <button @click="alternarEstado(prod)" class="text-texto-secundario hover:underline text-xs">{{ prod.activo ? 'Desactivar' : 'Activar' }}</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Vista de tarjetas en mobile -->
        <div class="sm:hidden divide-y divide-borde">
          <div v-for="prod in productos" :key="prod.id" class="p-4 space-y-2">
            <div class="flex justify-between items-start">
              <div>
                <p class="font-medium">{{ prod.nombre }}</p>
                <p class="text-xs text-texto-secundario font-mono">{{ prod.codigo }}</p>
              </div>
              <span :class="prod.activo ? 'text-exito' : 'text-error'" class="text-xs font-medium px-2 py-0.5 rounded-full bg-opacity-10">{{ prod.activo ? 'Activo' : 'Inactivo' }}</span>
            </div>
            <p class="text-sm">{{ (prod as any).categoria?.nombre || '—' }}</p>
            <p class="text-sm font-medium">${{ prod.precio_minorista.toLocaleString() }}</p>
            <div class="flex gap-3 pt-1">
              <button @click="irAEditar(prod.id)" class="text-primario hover:underline text-xs">Editar</button>
              <button @click="alternarEstado(prod)" class="text-texto-secundario hover:underline text-xs">{{ prod.activo ? 'Desactivar' : 'Activar' }}</button>
            </div>
          </div>
        </div>

        <div v-if="productos.length === 0" class="p-6 text-center text-texto-secundario">No hay productos.</div>
      </div>
    </main>
  </div>
</template>