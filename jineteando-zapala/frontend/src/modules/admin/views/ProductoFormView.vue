<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useProductosAdmin } from '../composables/useProductos'
import { useCategoriasAdmin } from '../composables/useCategorias'
import { useImagenesProducto } from '../composables/useImagenesProducto'
import { productoSchema, type ProductoForm, atributosSchema, type AtributosForm } from '../../../domain/schemas'
import { generarCodigoProducto } from '../../../infrastructure/codigo'
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

// Formulario base
const formulario = ref<ProductoFormLocal>({
  nombre: '',
  codigo: '',
  descripcion: '',
  precio_minorista: 0,
  precio_mayorista: null,
  categoria_id: '',
  imagen_principal_url: null, // mantenido por compatibilidad
  activo: true,
})

// Atributos
const atributos = ref<AtributosForm>({
  talles: [],
  colores: [],
  materiales: [],
})
const activarTalles = ref(false)
const activarColores = ref(false)
const activarMateriales = ref(false)

// Imágenes
const archivosNuevos = ref<File[]>([])
const previewsNuevos = ref<string[]>([])

// Errores
const errores = ref<Record<string, string>>({})
const guardando = ref(false)
const errorFormulario = ref<string | null>(null)

// Composable de imágenes (solo en edición)
const { imagenes, eliminar: eliminarImagenExistente, guardarNuevas, reordenar } = useImagenesProducto(
  () => productoId.value || null
)

const categoriasConJerarquia = computed(() =>
  categorias.value.map(cat => {
    if (cat.padre_id) {
      const padre = categorias.value.find(c => c.id === cat.padre_id)
      return { ...cat, nombreMostrado: padre ? `${padre.nombre} → ${cat.nombre}` : cat.nombre }
    }
    return { ...cat, nombreMostrado: cat.nombre }
  })
)

onMounted(async () => {
  await cargarCategorias()
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
      // Cargar atributos
      if (producto.atributos) {
        const attrs = producto.atributos as any
        if (attrs.talles?.length) {
          activarTalles.value = true
          atributos.value.talles = attrs.talles
        }
        if (attrs.colores?.length) {
          activarColores.value = true
          atributos.value.colores = attrs.colores
        }
        if (attrs.materiales?.length) {
          activarMateriales.value = true
          atributos.value.materiales = attrs.materiales
        }
      }
      // Las imágenes se cargan automáticamente por el composable
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

// Manejo de imágenes locales
const seleccionarImagenes = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (!input.files) return
  for (let i = 0; i < input.files.length; i++) {
    const file = input.files[i]
    const error = validarImagenLocal(file)
    if (error) {
      errores.value.imagenes = error
      return
    }
    archivosNuevos.value.push(file)
    previewsNuevos.value.push(URL.createObjectURL(file))
  }
  input.value = ''
}

const validarImagenLocal = (file: File) => {
  const tipos = ['image/jpeg', 'image/png', 'image/webp']
  if (!tipos.includes(file.type)) return 'Solo se permiten JPEG, PNG o WebP.'
  if (file.size > 5 * 1024 * 1024) return 'La imagen no puede superar 5 MB.'
  return null
}

const quitarImagenNueva = (index: number) => {
  archivosNuevos.value.splice(index, 1)
  previewsNuevos.value.splice(index, 1)
}

const moverImagen = async (index: number, direccion: 'arriba' | 'abajo') => {
  if (!imagenes.value.length) return
  const nuevas = [...imagenes.value]
  const swapIdx = direccion === 'arriba' ? index - 1 : index + 1
  if (swapIdx < 0 || swapIdx >= nuevas.length) return
  ;[nuevas[index], nuevas[swapIdx]] = [nuevas[swapIdx], nuevas[index]]
  const ids = nuevas.map(img => img.id)
  await reordenar(ids)
}

// Atributos: agregar/quitar
const agregarValor = (tipo: 'talles' | 'colores' | 'materiales') => {
  const valor = prompt(`Agregar ${tipo.slice(0, -1)}:`)
  if (valor && valor.trim()) {
    atributos.value[tipo]!.push(valor.trim())
  }
}
const quitarValor = (tipo: 'talles' | 'colores' | 'materiales', index: number) => {
  atributos.value[tipo]!.splice(index, 1)
}

// Guardar
const guardarProducto = async () => {
  errores.value = {}
  errorFormulario.value = null

  // Validar formulario base
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
      if (messages && messages.length > 0) errores.value[key] = messages[0]
    }
    return
  }

  // Validar atributos
  const attrs: any = {}
  if (activarTalles.value && atributos.value.talles?.length) attrs.talles = atributos.value.talles
  if (activarColores.value && atributos.value.colores?.length) attrs.colores = atributos.value.colores
  if (activarMateriales.value && atributos.value.materiales?.length) attrs.materiales = atributos.value.materiales
  const attrsValidados = atributosSchema.safeParse(attrs)
  if (!attrsValidados.success) {
    errores.value.atributos = 'Revisá los atributos ingresados.'
    return
  }

  guardando.value = true
  try {
    const datos = {
      ...resultado.data,
      atributos: attrs,
    }
    let productoCreadoId = productoId.value
    if (esEdicion.value) {
      await actualizar(productoId.value, datos)
    } else {
      const nuevo = await crear(datos)
      productoCreadoId = nuevo.id
    }

    // Guardar nuevas imágenes
    if (archivosNuevos.value.length > 0 && productoCreadoId) {
      await guardarNuevas(archivosNuevos.value)
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
                <option v-for="cat in categoriasConJerarquia" :key="cat.id" :value="cat.id">{{ cat.nombreMostrado }}</option>
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

        <!-- Imágenes -->
        <section class="bg-white border border-gray-200 p-6">
          <h2 class="text-md font-medium mb-4">Imágenes</h2>
          <!-- Imágenes existentes -->
          <div v-if="imagenes.length" class="grid grid-cols-3 sm:grid-cols-4 gap-4 mb-4">
            <div v-for="(img, idx) in imagenes" :key="img.id" class="relative group border border-gray-200">
              <img :src="img.url" class="w-full h-24 object-cover" />
              <div class="absolute top-1 right-1 flex gap-1 opacity-0 group-hover:opacity-100 transition">
                <button type="button" @click="moverImagen(idx, 'arriba')" :disabled="idx === 0" class="bg-white p-1 rounded text-xs shadow" title="Mover arriba">↑</button>
                <button type="button" @click="moverImagen(idx, 'abajo')" :disabled="idx === imagenes.length - 1" class="bg-white p-1 rounded text-xs shadow" title="Mover abajo">↓</button>
                <button type="button" @click="eliminarImagenExistente(img)" class="bg-red-500 text-white p-1 rounded text-xs shadow" title="Eliminar">×</button>
              </div>
              <span v-if="idx === 0" class="absolute bottom-1 left-1 bg-black/50 text-white text-xs px-1 rounded">Principal</span>
            </div>
          </div>
          <!-- Nuevas imágenes a subir -->
          <div class="flex flex-wrap gap-4 mb-4">
            <div v-for="(preview, idx) in previewsNuevos" :key="'new-'+idx" class="relative w-24 h-24 border border-gray-200">
              <img :src="preview" class="w-full h-full object-cover" />
              <button type="button" @click="quitarImagenNueva(idx)" class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center" title="Quitar">×</button>
            </div>
          </div>
          <input type="file" accept="image/jpeg,image/png,image/webp" multiple @change="seleccionarImagenes" :disabled="guardando" class="text-sm" />
          <p v-if="errores.imagenes" class="text-sm text-red-600 mt-1">{{ errores.imagenes }}</p>
        </section>

        <!-- Atributos -->
        <section class="bg-white border border-gray-200 p-6">
          <h2 class="text-md font-medium mb-4">Atributos</h2>
          <div class="space-y-4">
            <!-- Talles -->
            <div>
              <label class="flex items-center gap-2">
                <input type="checkbox" v-model="activarTalles" :disabled="guardando" />
                <span class="text-sm font-medium">Talles</span>
              </label>
              <div v-if="activarTalles" class="mt-2 flex flex-wrap gap-2">
                <span v-for="(talle, idx) in atributos.talles" :key="idx" class="bg-gray-100 px-2 py-1 text-sm flex items-center gap-1">
                  {{ talle }}
                  <button type="button" @click="quitarValor('talles', idx)" class="text-red-500 ml-1">&times;</button>
                </span>
                <button type="button" @click="agregarValor('talles')" class="text-sm text-amber-800 hover:underline">+ Agregar talle</button>
              </div>
            </div>
            <!-- Colores -->
            <div>
              <label class="flex items-center gap-2">
                <input type="checkbox" v-model="activarColores" :disabled="guardando" />
                <span class="text-sm font-medium">Colores</span>
              </label>
              <div v-if="activarColores" class="mt-2 flex flex-wrap gap-2">
                <span v-for="(color, idx) in atributos.colores" :key="idx" class="bg-gray-100 px-2 py-1 text-sm flex items-center gap-1">
                  {{ color }}
                  <button type="button" @click="quitarValor('colores', idx)" class="text-red-500 ml-1">&times;</button>
                </span>
                <button type="button" @click="agregarValor('colores')" class="text-sm text-amber-800 hover:underline">+ Agregar color</button>
              </div>
            </div>
            <!-- Materiales -->
            <div>
              <label class="flex items-center gap-2">
                <input type="checkbox" v-model="activarMateriales" :disabled="guardando" />
                <span class="text-sm font-medium">Materiales</span>
              </label>
              <div v-if="activarMateriales" class="mt-2 flex flex-wrap gap-2">
                <span v-for="(material, idx) in atributos.materiales" :key="idx" class="bg-gray-100 px-2 py-1 text-sm flex items-center gap-1">
                  {{ material }}
                  <button type="button" @click="quitarValor('materiales', idx)" class="text-red-500 ml-1">&times;</button>
                </span>
                <button type="button" @click="agregarValor('materiales')" class="text-sm text-amber-800 hover:underline">+ Agregar material</button>
              </div>
            </div>
            <p v-if="errores.atributos" class="text-sm text-red-600 mt-1">{{ errores.atributos }}</p>
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