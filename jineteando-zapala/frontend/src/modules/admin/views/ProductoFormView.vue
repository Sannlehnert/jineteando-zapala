<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useProductosAdmin } from '../composables/useProductos'
import { useCategoriasAdmin } from '../composables/useCategorias'
import { productoSchema, type ProductoForm } from '../../../domain/schemas'
import { generarCodigoProducto } from '../../../infrastructure/codigo'
import { subirImagenProducto, validarImagen } from '../../../infrastructure/storage'
import { obtenerProductoPorId } from '../../../infrastructure/productos'

const route = useRoute()
const router = useRouter()

const { crear, actualizar } = useProductosAdmin()
const { categorias, cargarCategorias } = useCategoriasAdmin()

interface ProductoFormLocal extends Omit<ProductoForm, 'precio_mayorista'> {
  precio_mayorista: number | null | string
}

const esEdicion = computed(() => route.params.id !== undefined)
const productoId = computed(() => route.params.id as string)

const formulario = ref<ProductoFormLocal>({
  nombre: '',
  codigo: '',
  descripcion: '',
  precio_minorista: 0,
  precio_mayorista: null,
  categoria_id: '',
  imagen_principal_url: null,
  activo: true,
})

const errores = ref<Record<string, string>>({})
const guardando = ref(false)
const errorFormulario = ref<string | null>(null)
const previewImagen = ref<string | null>(null)
const archivoImagen = ref<File | null>(null)

onMounted(async () => {
  await cargarCategorias() // sin argumento
  if (esEdicion.value) {
    try {
      const producto = await obtenerProductoPorId(productoId.value)
      formulario.value = {
        nombre: producto.nombre,
        codigo: producto.codigo,
        descripcion: producto.descripcion || '',
        precio_minorista: producto.precio_minorista,
        precio_mayorista: producto.precio_mayorista ?? null,
        categoria_id: producto.categoria_id,
        imagen_principal_url: producto.imagen_principal_url,
        activo: producto.activo,
      }
      previewImagen.value = producto.imagen_principal_url
    } catch (e: any) {
      errorFormulario.value = 'No se pudo cargar el producto.'
    }
  } else {
    try {
      formulario.value.codigo = await generarCodigoProducto()
    } catch (e: any) {
      errorFormulario.value = 'No se pudo generar el código automático.'
    }
  }
})

const manejarImagen = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (!input.files || input.files.length === 0) return
  const file = input.files[0]
  const errorValidacion = validarImagen(file)
  if (errorValidacion) {
    errores.value.imagen = errorValidacion
    return
  }
  delete errores.value.imagen
  archivoImagen.value = file
  previewImagen.value = URL.createObjectURL(file)
}

const guardarProducto = async () => {
  errores.value = {}
  errorFormulario.value = null

  // Convertir precio_mayorista antes de validar
  const mayoristaInput = formulario.value.precio_mayorista
  const mayoristaParsed = (mayoristaInput === '' || mayoristaInput === null) ? null : Number(mayoristaInput)

  const resultado = productoSchema.safeParse({
    ...formulario.value,
    precio_mayorista: mayoristaParsed,
  })

  if (!resultado.success) {
    const fieldErrors = resultado.error.flatten().fieldErrors
    for (const key of Object.keys(fieldErrors) as Array<keyof typeof fieldErrors>) {
      const messages = fieldErrors[key]
      if (messages && messages.length > 0) {
        errores.value[key] = messages[0]
      }
    }
    return
  }

  guardando.value = true
  try {
    let urlImagen = formulario.value.imagen_principal_url
    if (archivoImagen.value) {
      urlImagen = await subirImagenProducto(archivoImagen.value)
    }

    const datos = {
      ...resultado.data,
      imagen_principal_url: urlImagen,
    }

    if (esEdicion.value) {
      await actualizar(productoId.value, datos)
    } else {
      await crear(datos)
    }
    router.push('/admin/productos')
  } catch (e: any) {
    errorFormulario.value = e.message
  } finally {
    guardando.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-[#FDFBF7] text-[#2C2A28]">
    <header class="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
      <h1 class="text-xl font-semibold">{{ esEdicion ? 'Editar producto' : 'Nuevo producto' }}</h1>
      <router-link to="/admin/productos" class="text-sm text-amber-800 hover:underline">Volver al listado</router-link>
    </header>

    <main class="max-w-2xl mx-auto px-6 py-8">
      <div v-if="errorFormulario" class="mb-6 p-3 bg-red-50 border border-red-200 text-red-800 text-sm">
        {{ errorFormulario }}
      </div>

      <form @submit.prevent="guardarProducto" class="space-y-8">
        <!-- Información básica -->
        <section class="bg-white border border-gray-200 p-6">
          <h2 class="text-md font-medium mb-4">Información básica</h2>
          <div class="grid grid-cols-1 gap-4">
            <div>
              <label for="nombre" class="block text-sm font-medium mb-1">Nombre</label>
              <input id="nombre" v-model="formulario.nombre" type="text" class="w-full border border-gray-300 px-3 py-2" :disabled="guardando" />
              <p v-if="errores.nombre" class="text-sm text-red-600 mt-1">{{ errores.nombre }}</p>
            </div>
            <div>
              <label for="codigo" class="block text-sm font-medium mb-1">Código</label>
              <input id="codigo" v-model="formulario.codigo" type="text" class="w-full border border-gray-300 px-3 py-2" :disabled="guardando" />
              <p v-if="errores.codigo" class="text-sm text-red-600 mt-1">{{ errores.codigo }}</p>
            </div>
            <div>
              <label for="descripcion" class="block text-sm font-medium mb-1">Descripción</label>
              <textarea id="descripcion" v-model="formulario.descripcion" rows="3" class="w-full border border-gray-300 px-3 py-2" :disabled="guardando"></textarea>
            </div>
          </div>
        </section>

        <!-- Categoría y Precios -->
        <section class="bg-white border border-gray-200 p-6">
          <h2 class="text-md font-medium mb-4">Categoría y precios</h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label for="categoria" class="block text-sm font-medium mb-1">Categoría</label>
              <select id="categoria" v-model="formulario.categoria_id" class="w-full border border-gray-300 px-3 py-2 bg-white" :disabled="guardando">
                <option value="" disabled>Seleccionar categoría</option>
                <option v-for="cat in categorias" :key="cat.id" :value="cat.id">{{ cat.nombre }}</option>
              </select>
              <p v-if="errores.categoria_id" class="text-sm text-red-600 mt-1">{{ errores.categoria_id }}</p>
            </div>
            <div>
              <label for="precio_minorista" class="block text-sm font-medium mb-1">Precio minorista</label>
              <input id="precio_minorista" v-model.number="formulario.precio_minorista" type="number" step="0.01" min="0" class="w-full border border-gray-300 px-3 py-2" :disabled="guardando" />
              <p v-if="errores.precio_minorista" class="text-sm text-red-600 mt-1">{{ errores.precio_minorista }}</p>
            </div>
            <div>
              <label for="precio_mayorista" class="block text-sm font-medium mb-1">Precio mayorista (opcional)</label>
              <input id="precio_mayorista" v-model.number="formulario.precio_mayorista" type="number" step="0.01" min="0" class="w-full border border-gray-300 px-3 py-2" :disabled="guardando" placeholder="Dejar vacío si no tiene" />
              <p v-if="errores.precio_mayorista" class="text-sm text-red-600 mt-1">{{ errores.precio_mayorista }}</p>
            </div>
          </div>
        </section>

        <!-- Imagen -->
        <section class="bg-white border border-gray-200 p-6">
          <h2 class="text-md font-medium mb-4">Imagen principal</h2>
          <div class="flex flex-col sm:flex-row items-start gap-4">
            <div class="w-40 h-40 bg-gray-100 border border-gray-200 flex items-center justify-center overflow-hidden">
              <img v-if="previewImagen" :src="previewImagen" class="object-contain w-full h-full" alt="Vista previa" />
              <span v-else class="text-gray-400 text-sm">Sin imagen</span>
            </div>
            <div class="flex-1">
              <input type="file" accept="image/jpeg,image/png,image/webp" @change="manejarImagen" :disabled="guardando" class="text-sm" />
              <p v-if="errores.imagen" class="text-sm text-red-600 mt-1">{{ errores.imagen }}</p>
              <p class="text-xs text-gray-500 mt-2">JPEG, PNG o WebP. Máximo 5 MB.</p>
            </div>
          </div>
        </section>

        <!-- Publicación -->
        <section class="bg-white border border-gray-200 p-6">
          <h2 class="text-md font-medium mb-4">Publicación</h2>
          <label class="flex items-center space-x-2">
            <input type="checkbox" v-model="formulario.activo" :disabled="guardando" />
            <span class="text-sm">Producto activo (visible en el catálogo público)</span>
          </label>
        </section>

        <div class="flex justify-end space-x-3">
          <router-link to="/admin/productos" class="px-4 py-2 border border-gray-300 text-sm hover:bg-gray-50">Cancelar</router-link>
          <button type="submit" :disabled="guardando" class="bg-amber-800 text-white px-6 py-2 text-sm font-medium hover:bg-amber-900 disabled:opacity-60">
            <span v-if="guardando">Guardando...</span>
            <span v-else>Guardar producto</span>
          </button>
        </div>
      </form>
    </main>
  </div>
</template>