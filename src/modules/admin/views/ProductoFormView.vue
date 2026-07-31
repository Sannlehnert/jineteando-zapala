<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useProductosAdmin } from '../composables/useProductos'
import { useCategoriasAdmin } from '../composables/useCategorias'
import { useImagenesProducto } from '../composables/useImagenesProducto'
import { productoSchema, type ProductoForm, atributosSchema, type AtributosForm } from '../../../domain/schemas'
import { generarCodigoProducto } from '../../../infrastructure/codigo'
import { obtenerProductoPorId } from '../../../infrastructure/productos'
import { guardarImagenesProducto } from '../../../infrastructure/imagenes'

const route = useRoute()
const router = useRouter()
const { crear, actualizar } = useProductosAdmin()
const { categorias, cargarCategorias } = useCategoriasAdmin()

interface ProductoFormLocal extends Omit<ProductoForm, 'precio_mayorista' | 'codigo'> {
  precio_mayorista: number | null | string
  codigo?: string
}

const esEdicion = computed(() => route.params.id !== undefined)
const productoId = computed(() => route.params.id as string)

const formulario = ref<ProductoFormLocal>({
  nombre: '',
  descripcion: '',
  precio_minorista: 0,
  precio_mayorista: null,
  categoria_id: '',
  imagen_principal_url: null,
  activo: true,
  codigo: '',
})

const atributos = ref<AtributosForm>({ talles: [], colores: [], materiales: [] })
const activarTalles = ref(false)
const activarColores = ref(false)
const activarMateriales = ref(false)

const nuevoTalle = ref('')
const nuevoColor = ref('')
const nuevoMaterial = ref('')

const archivosNuevos = ref<File[]>([])
const previewsNuevos = ref<string[]>([])

const errores = ref<Record<string, string>>({})
const guardando = ref(false)
const errorFormulario = ref<string | null>(null)
const subiendoImagenes = ref(false)

const { imagenes, eliminar: eliminarImagenExistente, reordenar } = useImagenesProducto(
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

const hayCategorias = computed(() => categorias.value.length > 0)

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

const agregarValorInline = (tipo: 'talles' | 'colores' | 'materiales') => {
  if (tipo === 'talles' && nuevoTalle.value.trim()) {
    atributos.value.talles!.push(nuevoTalle.value.trim())
    nuevoTalle.value = ''
  } else if (tipo === 'colores' && nuevoColor.value.trim()) {
    atributos.value.colores!.push(nuevoColor.value.trim())
    nuevoColor.value = ''
  } else if (tipo === 'materiales' && nuevoMaterial.value.trim()) {
    atributos.value.materiales!.push(nuevoMaterial.value.trim())
    nuevoMaterial.value = ''
  }
}

const quitarValor = (tipo: 'talles' | 'colores' | 'materiales', index: number) => {
  atributos.value[tipo]!.splice(index, 1)
}

const guardarProducto = async () => {
  errores.value = {}
  errorFormulario.value = null

  const mayoristaInput = formulario.value.precio_mayorista
  const mayoristaParsed = (mayoristaInput === '' || mayoristaInput === null) ? null : Number(mayoristaInput)

  const resultado = productoSchema.safeParse({
    nombre: formulario.value.nombre,
    codigo: formulario.value.codigo ?? '',
    descripcion: formulario.value.descripcion,
    precio_minorista: formulario.value.precio_minorista,
    precio_mayorista: mayoristaParsed,
    categoria_id: formulario.value.categoria_id,
    imagen_principal_url: formulario.value.imagen_principal_url,
    activo: formulario.value.activo,
  })

  if (!resultado.success) {
    const fieldErrors = resultado.error.flatten().fieldErrors
    for (const key of Object.keys(fieldErrors) as Array<keyof typeof fieldErrors>) {
      const messages = fieldErrors[key]
      if (messages && messages.length > 0) errores.value[key] = messages[0]
    }
    return
  }

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
      codigo: formulario.value.codigo ?? '',
    }
    let productoCreadoId = productoId.value
    if (esEdicion.value) {
      await actualizar(productoId.value, datos)
    } else {
      const nuevo = await crear(datos)
      productoCreadoId = nuevo.id
    }

    if (archivosNuevos.value.length > 0 && productoCreadoId) {
      subiendoImagenes.value = true
      await guardarImagenesProducto(productoCreadoId, archivosNuevos.value, [])
      subiendoImagenes.value = false
      const { obtenerImagenesProducto } = await import('../../../infrastructure/imagenes')
      const imagenesRecienGuardadas = await obtenerImagenesProducto(productoCreadoId)
      if (imagenesRecienGuardadas.length > 0) {
        await actualizar(productoCreadoId, { imagen_principal_url: imagenesRecienGuardadas[0].url } as any)
      }
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
  <div class="min-h-screen bg-fondo text-texto">
    <header class="bg-superficie shadow-sm px-6 py-4 flex items-center justify-between">
      <h1 class="text-lg font-semibold text-primario">{{ esEdicion ? 'Editar producto' : 'Nuevo producto' }}</h1>
      <router-link to="/admin/productos" class="text-sm text-primario hover:underline">Volver al listado</router-link>
    </header>

    <main class="max-w-3xl mx-auto px-6 py-8">
      <div v-if="errorFormulario" class="mb-6 p-3 bg-red-50 border border-red-200 text-red-800 text-sm rounded-xl">
        {{ errorFormulario }}
      </div>

      <div v-if="!hayCategorias" class="mb-6 p-6 bg-amber-50 border border-amber-200 text-center rounded-2xl">
        <p class="text-amber-900 font-medium mb-2">No hay categorías disponibles.</p>
        <p class="text-sm text-amber-700 mb-4">Antes de crear un producto, necesitás al menos una categoría.</p>
        <router-link to="/admin/categorias" class="inline-block bg-primario text-white px-5 py-2.5 rounded-full text-sm font-medium hover:scale-105 transition-transform">
          Ir a crear categorías
        </router-link>
      </div>

      <form v-else @submit.prevent="guardarProducto" class="space-y-8">
        <section class="bg-superficie rounded-card shadow-sm p-6">
          <h2 class="font-sans text-lg font-medium mb-4">Información básica</h2>
          <div class="grid grid-cols-1 gap-4">
            <div>
              <label for="nombre" class="block text-sm font-medium text-texto mb-1">Nombre</label>
              <input id="nombre" v-model="formulario.nombre" type="text" class="w-full border border-borde rounded-full px-4 py-2.5 text-sm focus:ring-2 focus:ring-primario focus:border-transparent" :disabled="guardando" />
              <p v-if="errores.nombre" class="text-error text-sm mt-1">{{ errores.nombre }}</p>
            </div>
            <div>
              <label for="descripcion" class="block text-sm font-medium text-texto mb-1">Descripción</label>
              <textarea id="descripcion" v-model="formulario.descripcion" rows="3" class="w-full border border-borde rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-primario focus:border-transparent" :disabled="guardando"></textarea>
            </div>
          </div>
        </section>

        <section class="bg-superficie rounded-card shadow-sm p-6">
          <h2 class="font-sans text-lg font-medium mb-4">Categoría y precios</h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label for="categoria" class="block text-sm font-medium text-texto mb-1">Categoría</label>
              <select id="categoria" v-model="formulario.categoria_id" class="w-full border border-borde rounded-full px-4 py-2.5 text-sm bg-superficie focus:ring-2 focus:ring-primario focus:border-transparent" :disabled="guardando">
                <option value="" disabled>Seleccionar categoría</option>
                <option v-for="cat in categoriasConJerarquia" :key="cat.id" :value="cat.id">{{ cat.nombreMostrado }}</option>
              </select>
              <p v-if="errores.categoria_id" class="text-error text-sm mt-1">{{ errores.categoria_id }}</p>
            </div>
            <div>
              <label for="precio_minorista" class="block text-sm font-medium text-texto mb-1">Precio minorista</label>
              <input id="precio_minorista" v-model.number="formulario.precio_minorista" type="number" step="0.01" min="0" class="w-full border border-borde rounded-full px-4 py-2.5 text-sm focus:ring-2 focus:ring-primario focus:border-transparent" :disabled="guardando" />
              <p v-if="errores.precio_minorista" class="text-error text-sm mt-1">{{ errores.precio_minorista }}</p>
            </div>
            <div>
              <label for="precio_mayorista" class="block text-sm font-medium text-texto mb-1">Precio mayorista (opcional)</label>
              <input id="precio_mayorista" v-model.number="formulario.precio_mayorista" type="number" step="0.01" min="0" class="w-full border border-borde rounded-full px-4 py-2.5 text-sm focus:ring-2 focus:ring-primario focus:border-transparent" :disabled="guardando" placeholder="Dejar vacío si no tiene" />
              <p v-if="errores.precio_mayorista" class="text-error text-sm mt-1">{{ errores.precio_mayorista }}</p>
            </div>
          </div>
        </section>

        <section class="bg-superficie rounded-card shadow-sm p-6">
          <h2 class="font-sans text-lg font-medium mb-4">Imágenes</h2>
          <div v-if="imagenes.length" class="grid grid-cols-3 sm:grid-cols-4 gap-4 mb-4">
            <div v-for="(img, idx) in imagenes" :key="img.id" class="relative group rounded-xl overflow-hidden border border-borde">
              <img :src="img.url" class="w-full h-24 object-cover" />
              <div class="absolute top-1 right-1 flex gap-1 opacity-0 group-hover:opacity-100 transition">
                <button type="button" @click="moverImagen(idx, 'arriba')" :disabled="idx === 0" class="bg-white p-1 rounded-full text-xs shadow">↑</button>
                <button type="button" @click="moverImagen(idx, 'abajo')" :disabled="idx === imagenes.length - 1" class="bg-white p-1 rounded-full text-xs shadow">↓</button>
                <button type="button" @click="eliminarImagenExistente(img)" class="bg-red-500 text-white p-1 rounded-full text-xs shadow">×</button>
              </div>
              <span v-if="idx === 0" class="absolute bottom-1 left-1 bg-black/50 text-white text-xs px-2 py-0.5 rounded-full">Principal</span>
            </div>
          </div>
          <div class="flex flex-wrap gap-4 mb-4">
            <div v-for="(preview, idx) in previewsNuevos" :key="'new-'+idx" class="relative w-24 h-24 rounded-xl overflow-hidden border border-borde">
              <img :src="preview" class="w-full h-full object-cover" />
              <button type="button" @click="quitarImagenNueva(idx)" class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">×</button>
            </div>
          </div>
          <input type="file" accept="image/jpeg,image/png,image/webp" multiple @change="seleccionarImagenes" :disabled="guardando" class="text-sm" />
          <p v-if="subiendoImagenes" class="text-sm text-primario mt-2">Subiendo imágenes...</p>
          <p v-if="errores.imagenes" class="text-error text-sm mt-1">{{ errores.imagenes }}</p>
        </section>

        <section class="bg-superficie rounded-card shadow-sm p-6">
          <h2 class="font-sans text-lg font-medium mb-4">Atributos</h2>
          <div class="space-y-4">
            <div>
              <label class="flex items-center gap-2">
                <input type="checkbox" v-model="activarTalles" :disabled="guardando" class="rounded border-borde text-primario focus:ring-primario" />
                <span class="text-sm font-medium">Talles</span>
              </label>
              <div v-if="activarTalles" class="mt-2">
                <div class="flex flex-wrap gap-2 mb-2">
                  <span v-for="(talle, idx) in atributos.talles" :key="idx" class="bg-secundario/20 px-3 py-1 rounded-full text-sm flex items-center gap-1">
                    {{ talle }}
                    <button type="button" @click="quitarValor('talles', idx)" class="text-error ml-1">&times;</button>
                  </span>
                </div>
                <div class="flex gap-2">
                  <input v-model="nuevoTalle" type="text" placeholder="Nuevo talle" class="border border-borde rounded-full px-3 py-1 text-sm flex-1" @keyup.enter="agregarValorInline('talles')" />
                  <button type="button" @click="agregarValorInline('talles')" class="text-sm text-primario hover:underline">Agregar</button>
                </div>
              </div>
            </div>
            <div>
              <label class="flex items-center gap-2">
                <input type="checkbox" v-model="activarColores" :disabled="guardando" class="rounded border-borde text-primario focus:ring-primario" />
                <span class="text-sm font-medium">Colores</span>
              </label>
              <div v-if="activarColores" class="mt-2">
                <div class="flex flex-wrap gap-2 mb-2">
                  <span v-for="(color, idx) in atributos.colores" :key="idx" class="bg-secundario/20 px-3 py-1 rounded-full text-sm flex items-center gap-1">
                    {{ color }}
                    <button type="button" @click="quitarValor('colores', idx)" class="text-error ml-1">&times;</button>
                  </span>
                </div>
                <div class="flex gap-2">
                  <input v-model="nuevoColor" type="text" placeholder="Nuevo color" class="border border-borde rounded-full px-3 py-1 text-sm flex-1" @keyup.enter="agregarValorInline('colores')" />
                  <button type="button" @click="agregarValorInline('colores')" class="text-sm text-primario hover:underline">Agregar</button>
                </div>
              </div>
            </div>
            <div>
              <label class="flex items-center gap-2">
                <input type="checkbox" v-model="activarMateriales" :disabled="guardando" class="rounded border-borde text-primario focus:ring-primario" />
                <span class="text-sm font-medium">Materiales</span>
              </label>
              <div v-if="activarMateriales" class="mt-2">
                <div class="flex flex-wrap gap-2 mb-2">
                  <span v-for="(material, idx) in atributos.materiales" :key="idx" class="bg-secundario/20 px-3 py-1 rounded-full text-sm flex items-center gap-1">
                    {{ material }}
                    <button type="button" @click="quitarValor('materiales', idx)" class="text-error ml-1">&times;</button>
                  </span>
                </div>
                <div class="flex gap-2">
                  <input v-model="nuevoMaterial" type="text" placeholder="Nuevo material" class="border border-borde rounded-full px-3 py-1 text-sm flex-1" @keyup.enter="agregarValorInline('materiales')" />
                  <button type="button" @click="agregarValorInline('materiales')" class="text-sm text-primario hover:underline">Agregar</button>
                </div>
              </div>
            </div>
            <p v-if="errores.atributos" class="text-error text-sm mt-1">{{ errores.atributos }}</p>
          </div>
        </section>

        <section class="bg-superficie rounded-card shadow-sm p-6">
          <h2 class="font-sans text-lg font-medium mb-4">Publicación</h2>
          <label class="flex items-center space-x-2">
            <input type="checkbox" v-model="formulario.activo" :disabled="guardando" class="rounded border-borde text-primario focus:ring-primario" />
            <span class="text-sm">Producto activo (visible en el catálogo público)</span>
          </label>
        </section>

        <div class="flex justify-end space-x-3">
          <router-link to="/admin/productos" class="px-5 py-2.5 border border-borde rounded-full text-sm hover:bg-fondo transition-colors">Cancelar</router-link>
          <button type="submit" :disabled="guardando" class="bg-primario text-white px-6 py-2.5 rounded-full text-sm font-medium hover:scale-105 transition-transform disabled:opacity-60 shadow-sm">
            <span v-if="guardando || subiendoImagenes">Guardando...</span>
            <span v-else>Guardar producto</span>
          </button>
        </div>
      </form>
    </main>
  </div>
</template>