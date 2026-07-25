<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { useCategoriasAdmin } from '../composables/useCategorias'
import type { Categoria, CategoriaFormData } from '../../../domain/types'
import { categoriaSchema } from '../../../domain/schemas'

const { categorias, cargando, error, cargarCategorias, crear, actualizar, cambiarEstado } = useCategoriasAdmin()

const mostrarFormulario = ref(false)
const editandoId = ref<string | null>(null)
const formulario = ref<CategoriaFormData>({ nombre: '', activa: true, padre_id: null })
const erroresValidacion = ref<Record<string, string>>({})
const guardando = ref(false)
const errorFormulario = ref<string | null>(null)

const categoriasPrincipales = computed(() =>
  categorias.value.filter(c => c.padre_id === null && c.id !== editandoId.value)
)

onMounted(() => {
  cargarCategorias()
})

const abrirFormularioCrear = () => {
  editandoId.value = null
  formulario.value = { nombre: '', activa: true, padre_id: null }
  erroresValidacion.value = {}
  errorFormulario.value = null
  mostrarFormulario.value = true
}

const abrirFormularioEditar = (categoria: Categoria) => {
  editandoId.value = categoria.id
  formulario.value = {
    nombre: categoria.nombre,
    activa: categoria.activa,
    padre_id: categoria.padre_id,
  }
  erroresValidacion.value = {}
  errorFormulario.value = null
  mostrarFormulario.value = true
}

const cerrarFormulario = () => {
  mostrarFormulario.value = false
}

const guardarCategoria = async () => {
  erroresValidacion.value = {}
  errorFormulario.value = null

  const resultado = categoriaSchema.safeParse(formulario.value)
  if (!resultado.success) {
    const fieldErrors = resultado.error.flatten().fieldErrors
    for (const key of Object.keys(fieldErrors) as Array<keyof typeof fieldErrors>) {
      const messages = fieldErrors[key]
      if (messages && messages.length > 0) {
        erroresValidacion.value[key] = messages[0]
      }
    }
    return
  }

  guardando.value = true
  try {
    if (editandoId.value) {
      await actualizar(editandoId.value, resultado.data)
    } else {
      await crear(resultado.data)
    }
    cerrarFormulario()
  } catch (e: any) {
    errorFormulario.value = e.message
  } finally {
    guardando.value = false
  }
}

const alternarEstado = async (categoria: Categoria) => {
  try {
    await cambiarEstado(categoria.id, !categoria.activa)
  } catch (e: any) {
    error.value = e.message
  }
}
</script>

<template>
  <div class="min-h-screen bg-[#FDFBF7] text-[#2C2A28]">
    <header class="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
      <h1 class="text-xl font-semibold">Categorías</h1>
      <router-link to="/admin" class="text-sm text-amber-800 hover:underline">Volver al panel</router-link>
    </header>

    <main class="max-w-4xl mx-auto px-6 py-8">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-lg font-medium">Listado de categorías</h2>
        <button @click="abrirFormularioCrear" class="bg-amber-800 text-white px-4 py-2 text-sm font-medium hover:bg-amber-900 transition">
          Agregar categoría
        </button>
      </div>

      <div v-if="error" class="mb-4 p-3 bg-red-50 border border-red-200 text-red-800 text-sm">
        {{ error }}
      </div>

      <div v-if="cargando" class="text-gray-500">Cargando...</div>

      <div v-else class="bg-white border border-gray-200">
        <div v-if="categorias.length === 0" class="p-6 text-gray-500 text-center">
          No hay categorías todavía.
        </div>
        <ul>
          <li
            v-for="cat in categorias"
            :key="cat.id"
            class="flex items-center justify-between p-4 border-b border-gray-100 last:border-b-0"
          >
            <div>
              <span :class="{ 'pl-4': cat.padre_id }" class="font-medium">
                {{ cat.padre_id ? '↳ ' : '' }}{{ cat.nombre }}
              </span>
              <span :class="cat.activa ? 'text-green-700' : 'text-red-600'" class="ml-2 text-sm">
                {{ cat.activa ? 'Activa' : 'Inactiva' }}
              </span>
            </div>
            <div class="flex space-x-2">
              <button @click="abrirFormularioEditar(cat)" class="text-sm text-amber-800 hover:underline">Editar</button>
              <button @click="alternarEstado(cat)" class="text-sm text-gray-600 hover:underline">
                {{ cat.activa ? 'Desactivar' : 'Activar' }}
              </button>
            </div>
          </li>
        </ul>
      </div>

      <!-- Modal formulario -->
      <div v-if="mostrarFormulario" class="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
        <div class="bg-white p-6 w-full max-w-md border border-gray-200">
          <h3 class="text-lg font-medium mb-4">{{ editandoId ? 'Editar categoría' : 'Nueva categoría' }}</h3>
          <div v-if="errorFormulario" class="mb-4 p-3 bg-red-50 border border-red-200 text-red-800 text-sm">
            {{ errorFormulario }}
          </div>
          <form @submit.prevent="guardarCategoria">
            <div class="mb-4">
              <label for="tipoCategoria" class="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
              <select id="tipoCategoria" v-model="formulario.padre_id" class="w-full border border-gray-300 px-3 py-2 bg-white">
                <option :value="null">Categoría principal</option>
                <option v-for="padre in categoriasPrincipales" :key="padre.id" :value="padre.id">
                  Subcategoría de: {{ padre.nombre }}
                </option>
              </select>
            </div>
            <div class="mb-4">
              <label for="nombre" class="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
              <input
                id="nombre"
                v-model="formulario.nombre"
                type="text"
                class="w-full border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-700"
                :disabled="guardando"
              />
              <p v-if="erroresValidacion.nombre" class="mt-1 text-sm text-red-600">{{ erroresValidacion.nombre }}</p>
            </div>
            <div class="mb-4 flex items-center">
              <input
                id="activa"
                v-model="formulario.activa"
                type="checkbox"
                class="mr-2"
                :disabled="guardando"
              />
              <label for="activa" class="text-sm">Categoría activa</label>
            </div>
            <div class="flex justify-end space-x-3">
              <button
                type="button"
                @click="cerrarFormulario"
                class="px-4 py-2 text-sm border border-gray-300 hover:bg-gray-50"
                :disabled="guardando"
              >
                Cancelar
              </button>
              <button
                type="submit"
                class="px-4 py-2 text-sm bg-amber-800 text-white hover:bg-amber-900 disabled:opacity-60"
                :disabled="guardando"
              >
                <span v-if="guardando">Guardando...</span>
                <span v-else>Guardar</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  </div>
</template>