<script setup lang="ts">
import { reactive, ref, watch } from 'vue'
import { useConfiguracionAdmin } from '../composables/useConfiguracionAdmin'
import { configuracionSchema, type ConfiguracionForm } from '../../../domain/schemas'
import { validarImagen } from '../../../infrastructure/storage'

const { config, cargando, error, guardando, guardar } = useConfiguracionAdmin()

const form = reactive<ConfiguracionForm>({
  nombre: '',
  descripcion: '',
  whatsapp: '',
  direccion: '',
  horarios: '',
  instagram: '',
  facebook: '',
  tiktok: '',
})

const errores = ref<Record<string, string>>({})
const exito = ref(false)
const archivoLogo = ref<File | null>(null)
const previewLogo = ref<string | null>(null)

watch(
  () => config.value,
  (newConfig) => {
    if (newConfig) {
      form.nombre = newConfig.nombre
      form.descripcion = newConfig.descripcion || ''
      form.whatsapp = newConfig.whatsapp
      form.direccion = newConfig.direccion
      form.horarios = newConfig.horarios
      form.instagram = newConfig.instagram || ''
      form.facebook = newConfig.facebook || ''
      form.tiktok = newConfig.tiktok || ''
      previewLogo.value = newConfig.logo_url
    }
  },
  { immediate: true }
)

const manejarLogo = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (!input.files?.length) return
  const file = input.files[0]
  const errorValidacion = validarImagen(file)
  if (errorValidacion) {
    errores.value.logo = errorValidacion
    return
  }
  archivoLogo.value = file
  previewLogo.value = URL.createObjectURL(file)
  errores.value.logo = ''
}

const enviar = async () => {
  errores.value = {}
  exito.value = false
  const result = configuracionSchema.safeParse(form)
  if (!result.success) {
    const fieldErrors = result.error.flatten().fieldErrors
    for (const key of Object.keys(fieldErrors) as Array<keyof typeof fieldErrors>) {
      const msgs = fieldErrors[key]
      if (msgs?.length) errores.value[key] = msgs[0]
    }
    return
  }
  try {
    await guardar(result.data, archivoLogo.value)
    exito.value = true
    archivoLogo.value = null
  } catch (e: any) {
    errores.value.general = e.message
  }
}
</script>

<template>
  <div class="min-h-screen bg-fondo text-texto">
    <header class="bg-superficie shadow-sm px-4 sm:px-6 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
      <h1 class="text-lg font-semibold text-primario truncate max-w-full">Configuración del negocio</h1>
      <router-link to="/admin" class="text-sm text-primario hover:underline">Volver al panel</router-link>
    </header>
    <main class="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <div v-if="cargando" class="text-texto-secundario">Cargando...</div>
      <div v-else-if="error" class="text-error">{{ error }}</div>
      <form v-else @submit.prevent="enviar" class="space-y-6">
        <div v-if="exito" class="p-3 bg-green-50 border border-green-300 text-green-800 text-sm rounded-xl">Configuración guardada correctamente.</div>
        <div v-if="errores.general" class="p-3 bg-red-50 border border-red-200 text-red-800 text-sm rounded-xl">{{ errores.general }}</div>

        <section class="bg-superficie rounded-card shadow-sm p-6 space-y-4">
          <div>
            <label class="block text-sm font-medium text-texto mb-1">Nombre del negocio</label>
            <input v-model="form.nombre" type="text" class="w-full border border-borde rounded-full px-4 py-2.5 text-sm focus:ring-2 focus:ring-primario focus:border-transparent" :disabled="guardando" />
            <p v-if="errores.nombre" class="text-error text-sm mt-1">{{ errores.nombre }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-texto mb-1">Descripción corta</label>
            <textarea v-model="form.descripcion" rows="2" class="w-full border border-borde rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-primario focus:border-transparent" :disabled="guardando"></textarea>
          </div>
          <div>
            <label class="block text-sm font-medium text-texto mb-1">WhatsApp (con código de país)</label>
            <input v-model="form.whatsapp" type="text" class="w-full border border-borde rounded-full px-4 py-2.5 text-sm focus:ring-2 focus:ring-primario focus:border-transparent" :disabled="guardando" />
            <p v-if="errores.whatsapp" class="text-error text-sm mt-1">{{ errores.whatsapp }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-texto mb-1">Dirección</label>
            <input v-model="form.direccion" type="text" class="w-full border border-borde rounded-full px-4 py-2.5 text-sm focus:ring-2 focus:ring-primario focus:border-transparent" :disabled="guardando" />
            <p v-if="errores.direccion" class="text-error text-sm mt-1">{{ errores.direccion }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-texto mb-1">Horarios</label>
            <input v-model="form.horarios" type="text" class="w-full border border-borde rounded-full px-4 py-2.5 text-sm focus:ring-2 focus:ring-primario focus:border-transparent" :disabled="guardando" />
            <p v-if="errores.horarios" class="text-error text-sm mt-1">{{ errores.horarios }}</p>
          </div>
        </section>

        <section class="bg-superficie rounded-card shadow-sm p-6 space-y-4">
          <h2 class="font-sans text-lg font-medium">Redes sociales (URL completa)</h2>
          <div>
            <label class="block text-sm font-medium text-texto mb-1">Instagram</label>
            <input v-model="form.instagram" type="text" class="w-full border border-borde rounded-full px-4 py-2.5 text-sm focus:ring-2 focus:ring-primario focus:border-transparent" placeholder="https://www.instagram.com/..." :disabled="guardando" />
          </div>
          <div>
            <label class="block text-sm font-medium text-texto mb-1">Facebook</label>
            <input v-model="form.facebook" type="text" class="w-full border border-borde rounded-full px-4 py-2.5 text-sm focus:ring-2 focus:ring-primario focus:border-transparent" placeholder="https://www.facebook.com/..." :disabled="guardando" />
          </div>
          <div>
            <label class="block text-sm font-medium text-texto mb-1">TikTok</label>
            <input v-model="form.tiktok" type="text" class="w-full border border-borde rounded-full px-4 py-2.5 text-sm focus:ring-2 focus:ring-primario focus:border-transparent" placeholder="https://www.tiktok.com/..." :disabled="guardando" />
          </div>
        </section>

        <!-- Logo mejorado en mobile -->
        <section class="bg-superficie rounded-card shadow-sm p-6">
          <h2 class="font-sans text-lg font-medium mb-4">Logo</h2>
          <div class="flex flex-col sm:flex-row items-start gap-4">
            <div class="w-24 h-24 rounded-2xl bg-secundario/20 flex items-center justify-center overflow-hidden flex-shrink-0">
              <img v-if="previewLogo" :src="previewLogo" class="object-contain w-full h-full" alt="Logo" />
              <span v-else class="text-texto-secundario text-sm">Sin logo</span>
            </div>
            <div class="flex-1 w-full sm:w-auto">
              <input type="file" accept="image/jpeg,image/png,image/webp" @change="manejarLogo" :disabled="guardando" class="w-full text-sm truncate" />
              <p v-if="errores.logo" class="text-error text-sm mt-1">{{ errores.logo }}</p>
              <p class="text-xs text-texto-secundario mt-2">JPEG, PNG o WebP. Máximo 5 MB.</p>
            </div>
          </div>
        </section>

        <div class="flex justify-end">
          <button type="submit" :disabled="guardando" class="bg-primario text-white px-6 py-2.5 rounded-full text-sm font-medium hover:scale-105 transition-transform disabled:opacity-60 shadow-sm w-full sm:w-auto">
            <span v-if="guardando">Guardando...</span>
            <span v-else>Guardar cambios</span>
          </button>
        </div>
      </form>
    </main>
  </div>
</template>