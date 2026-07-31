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

const tieneSubcategorias = computed(() => {
  if (!editandoId.value) return false
  return categorias.value.some(c => c.padre_id === editandoId.value)
})

onMounted(() => cargarCategorias())

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

const cerrarFormulario = () => { mostrarFormulario.value = false }

const guardarCategoria = async () => {
  erroresValidacion.value = {}
  errorFormulario.value = null
  const resultado = categoriaSchema.safeParse(formulario.value)
  if (!resultado.success) {
    const fieldErrors = resultado.error.flatten().fieldErrors
    for (const key of Object.keys(fieldErrors) as Array<keyof typeof fieldErrors>) {
      const messages = fieldErrors[key]
      if (messages && messages.length > 0) erroresValidacion.value[key] = messages[0]
    }
    return
  }
  guardando.value = true
  try {
    if (editandoId.value) await actualizar(editandoId.value, resultado.data)
    else await crear(resultado.data)
    cerrarFormulario()
  } catch (e: any) { errorFormulario.value = e.message }
  finally { guardando.value = false }
}

const alternarEstado = async (categoria: Categoria) => {
  try { await cambiarEstado(categoria.id, !categoria.activa) } catch (e: any) { error.value = e.message }
}
</script>

<template>
  <div class="min-h-screen bg-fondo text-texto">
    <header class="bg-superficie shadow-sm px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
      <h1 class="text-lg font-semibold text-primario">Categorías</h1>
      <div class="flex items-center gap-3 w-full sm:w-auto">
        <button @click="abrirFormularioCrear" class="bg-primario text-white px-5 py-2.5 rounded-full text-sm font-medium hover:scale-105 transition-transform w-full sm:w-auto text-center">Agregar</button>
        <router-link to="/admin" class="text-sm text-primario hover:underline self-center">Panel</router-link>
      </div>
    </header>
    <main class="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <div v-if="error" class="text-error mb-4">{{ error }}</div>
      <div v-if="cargando" class="text-texto-secundario">Cargando...</div>
      <div v-else class="bg-superficie rounded-card shadow-sm overflow-hidden">
        <ul>
          <li v-for="cat in categorias" :key="cat.id" class="flex items-center justify-between p-4 border-b border-borde last:border-0 hover:bg-fondo/50 transition-colors">
            <div class="flex-1 min-w-0">
              <span :class="{ 'pl-4': cat.padre_id }" class="font-medium truncate block">{{ cat.padre_id ? '↳ ' : '' }}{{ cat.nombre }}</span>
              <span :class="cat.activa ? 'text-exito' : 'text-error'" class="ml-0 sm:ml-2 text-xs font-medium">{{ cat.activa ? 'Activa' : 'Inactiva' }}</span>
            </div>
            <div class="flex gap-3 ml-2">
              <button @click="abrirFormularioEditar(cat)" class="text-primario hover:underline text-sm">Editar</button>
              <button @click="alternarEstado(cat)" class="text-texto-secundario hover:underline text-sm">{{ cat.activa ? 'Desactivar' : 'Activar' }}</button>
            </div>
          </li>
        </ul>
        <div v-if="categorias.length === 0" class="p-6 text-center text-texto-secundario">No hay categorías.</div>
      </div>

      <!-- Modal -->
      <div v-if="mostrarFormulario" class="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">
        <div class="bg-superficie p-6 rounded-card shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
          <h3 class="font-serif text-xl mb-4">{{ editandoId ? 'Editar' : 'Nueva' }} categoría</h3>
          <form @submit.prevent="guardarCategoria" class="space-y-4">
            <div>
              <label class="block text-sm font-medium mb-1">Tipo</label>
              <select
                v-model="formulario.padre_id"
                :disabled="!!editandoId && tieneSubcategorias"
                class="w-full border border-borde rounded-full px-3 py-2 text-sm bg-fondo"
              >
                <option :value="null">Principal</option>
                <option v-for="padre in categoriasPrincipales" :key="padre.id" :value="padre.id">Subcategoría de {{ padre.nombre }}</option>
              </select>
              <p v-if="editandoId && tieneSubcategorias" class="text-xs text-amber-700 mt-1">
                No se puede cambiar el tipo porque esta categoría tiene subcategorías.
              </p>
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Nombre</label>
              <input v-model="formulario.nombre" type="text" class="w-full border border-borde rounded-full px-3 py-2 text-sm" :disabled="guardando" />
              <p v-if="erroresValidacion.nombre" class="text-error text-xs mt-1">{{ erroresValidacion.nombre }}</p>
            </div>
            <div class="flex items-center gap-2">
              <input v-model="formulario.activa" type="checkbox" :disabled="guardando" />
              <label class="text-sm">Activa</label>
            </div>
            <div class="flex justify-end gap-3 pt-2">
              <button type="button" @click="cerrarFormulario" class="px-4 py-2 rounded-full border border-borde text-sm">Cancelar</button>
              <button type="submit" :disabled="guardando" class="bg-primario text-white px-4 py-2 rounded-full text-sm font-medium">Guardar</button>
            </div>
          </form>
        </div>
      </div>
    </main>
  </div>
</template>