<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../../stores/auth'
import { useConfiguracionStore } from '../../../stores/configuracion'
import { loginSchema, type LoginForm } from '../../../domain/schemas'
import { computed } from 'vue'

const authStore = useAuthStore()
const router = useRouter()
const configStore = useConfiguracionStore()
const logoUrl = computed(() => configStore.config?.logo_url ?? null)
const nombreNegocio = computed(() => configStore.config?.nombre || 'Jineteando Zapala')

const form = reactive<LoginForm>({
  email: '',
  password: '',
})

const errors = reactive<{ email?: string; password?: string; general?: string }>({})
const isSubmitting = ref(false)

async function onSubmit() {
  errors.email = undefined
  errors.password = undefined
  errors.general = undefined

  const result = loginSchema.safeParse(form)
  if (!result.success) {
    const fieldErrors = result.error.flatten().fieldErrors
    errors.email = fieldErrors.email?.[0]
    errors.password = fieldErrors.password?.[0]
    return
  }

  isSubmitting.value = true
  try {
    await authStore.signIn(form.email, form.password)
    router.push('/admin')
  } catch (err: any) {
    console.error('Error de inicio de sesión:', err)
    errors.general = 'El email o la contraseña no son correctos.'
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-fondo px-4">
    <div class="w-full max-w-sm">
      <div class="mb-8 text-center">
        <img v-if="logoUrl" :src="logoUrl" :alt="nombreNegocio" class="h-12 mx-auto" />
        <h1 v-else class="font-serif text-3xl font-semibold text-texto">{{ nombreNegocio }}</h1>
      </div>

      <div class="bg-superficie rounded-card shadow-sm p-8">
        <h2 class="text-xl font-serif text-texto mb-6">Iniciar sesión</h2>

        <div v-if="errors.general" class="mb-4 p-3 bg-red-50 border border-red-200 text-red-800 text-sm rounded-xl">
          {{ errors.general }}
          <button @click="onSubmit" class="ml-2 underline text-error hover:text-red-700">Reintentar</button>
        </div>

        <form @submit.prevent="onSubmit" novalidate>
          <div class="mb-4">
            <label for="email" class="block text-sm font-medium text-texto mb-1">Email</label>
            <input
              id="email"
              v-model="form.email"
              type="email"
              autocomplete="email"
              :disabled="isSubmitting"
              class="w-full border border-borde rounded-full px-4 py-2.5 text-sm focus:ring-2 focus:ring-primario focus:border-transparent transition"
              :class="{ 'border-red-400': errors.email }"
              aria-describedby="email-error"
            />
            <p v-if="errors.email" id="email-error" class="mt-1 text-sm text-error">{{ errors.email }}</p>
          </div>

          <div class="mb-6">
            <label for="password" class="block text-sm font-medium text-texto mb-1">Contraseña</label>
            <input
              id="password"
              v-model="form.password"
              type="password"
              autocomplete="current-password"
              :disabled="isSubmitting"
              class="w-full border border-borde rounded-full px-4 py-2.5 text-sm focus:ring-2 focus:ring-primario focus:border-transparent transition"
              :class="{ 'border-red-400': errors.password }"
              aria-describedby="password-error"
            />
            <p v-if="errors.password" id="password-error" class="mt-1 text-sm text-error">{{ errors.password }}</p>
          </div>

          <button
            type="submit"
            :disabled="isSubmitting"
            class="w-full bg-primario text-white py-2.5 px-4 rounded-full text-sm font-medium hover:scale-105 transition-transform disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <span v-if="isSubmitting">Ingresando...</span>
            <span v-else>Ingresar</span>
          </button>
        </form>
      </div>
    </div>
  </div>
</template>