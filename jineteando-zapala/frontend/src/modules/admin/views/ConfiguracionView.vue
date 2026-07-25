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
  <div class="min-h-screen bg-[#FDFBF7] text-[#2C2A28]">
    <header class="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
      <h1 class="text-xl font-semibold">Configuración del negocio</h1>
      <router-link to="/admin" class="text-sm text-amber-800 hover:underline">Volver al panel</router-link>
    </header>
    <main class="max-w-2xl mx-auto px-6 py-8">
      <div v-if="cargando" class="text-gray-500">Cargando...</div>
      <div v-else-if="error" class="text-red-600">{{ error }}</div>
      <form v-else @submit.prevent="enviar" class="space-y-6">
        <div v-if="exito" class="p-3 bg-green-50 border border-green-300 text-green-800 text-sm">Configuración guardada correctamente.</div>
        <div v-if="errores.general" class="p-3 bg-red-50 border border-red-200 text-red-800 text-sm">{{ errores.general }}</div>

        <section class="bg-white border border-gray-200 p-6 space-y-4">
          <div>
            <label class="block text-sm font-medium mb-1">Nombre del negocio</label>
            <input v-model="form.nombre" type="text" class="w-full border border-gray-300 px-3 py-2" :disabled="guardando" />
            <p v-if="errores.nombre" class="text-sm text-red-600">{{ errores.nombre }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Descripción corta</label>
            <textarea v-model="form.descripcion" rows="2" class="w-full border border-gray-300 px-3 py-2" :disabled="guardando"></textarea>
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">WhatsApp (con código de país, ej: +5493413107891)</label>
            <input v-model="form.whatsapp" type="text" class="w-full border border-gray-300 px-3 py-2" :disabled="guardando" />
            <p v-if="errores.whatsapp" class="text-sm text-red-600">{{ errores.whatsapp }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Dirección</label>
            <input v-model="form.direccion" type="text" class="w-full border border-gray-300 px-3 py-2" :disabled="guardando" />
            <p v-if="errores.direccion" class="text-sm text-red-600">{{ errores.direccion }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Horarios</label>
            <input v-model="form.horarios" type="text" class="w-full border border-gray-300 px-3 py-2" :disabled="guardando" />
            <p v-if="errores.horarios" class="text-sm text-red-600">{{ errores.horarios }}</p>
          </div>
        </section>

        <section class="bg-white border border-gray-200 p-6 space-y-4">
          <h2 class="font-medium">Redes sociales</h2>
          <div>
            <label class="block text-sm font-medium mb-1">Instagram (usuario)</label>
            <input v-model="form.instagram" type="text" class="w-full border border-gray-300 px-3 py-2" :disabled="guardando" />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Facebook (usuario o página)</label>
            <input v-model="form.facebook" type="text" class="w-full border border-gray-300 px-3 py-2" :disabled="guardando" />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">TikTok (usuario)</label>
            <input v-model="form.tiktok" type="text" class="w-full border border-gray-300 px-3 py-2" :disabled="guardando" />
          </div>
        </section>

        <section class="bg-white border border-gray-200 p-6">
          <h2 class="font-medium mb-4">Logo</h2>
          <div class="flex items-start gap-4">
            <div class="w-24 h-24 bg-gray-100 border border-gray-200 flex items-center justify-center overflow-hidden">
              <img v-if="previewLogo" :src="previewLogo" class="object-contain w-full h-full" alt="Logo" />
              <span v-else class="text-gray-400 text-sm">Sin logo</span>
            </div>
            <div>
              <input type="file" accept="image/jpeg,image/png,image/webp" @change="manejarLogo" :disabled="guardando" class="text-sm" />
              <p v-if="errores.logo" class="text-sm text-red-600 mt-1">{{ errores.logo }}</p>
            </div>
          </div>
        </section>

        <div class="flex justify-end">
          <button type="submit" :disabled="guardando" class="bg-amber-800 text-white px-6 py-2 text-sm font-medium hover:bg-amber-900 disabled:opacity-60">
            <span v-if="guardando">Guardando...</span>
            <span v-else>Guardar cambios</span>
          </button>
        </div>
      </form>
    </main>
  </div>
</template>