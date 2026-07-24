<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../../stores/auth'
import { loginSchema, type LoginForm } from '../../../domain/schemas'

const authStore = useAuthStore()
const router = useRouter()

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
    errors.general = 'El email o la contraseña no son correctos.'
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-[#FDFBF7] px-4">
    <div class="w-full max-w-md">
      <h1 class="text-3xl font-bold text-center text-[#2C2A28] mb-8">
        Jineteando Zapala
      </h1>
      <div class="bg-white rounded-none border border-gray-200 p-8">
        <h2 class="text-xl font-semibold mb-6 text-[#2C2A28]">Iniciar sesión</h2>

        <div v-if="errors.general" class="mb-4 p-3 bg-red-50 border border-red-200 text-red-800 text-sm">
          {{ errors.general }}
        </div>

        <form @submit.prevent="onSubmit" novalidate>
          <div class="mb-4">
            <label for="email" class="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              id="email"
              v-model="form.email"
              type="email"
              autocomplete="email"
              :disabled="isSubmitting"
              :class="[
                'w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-700 focus:border-transparent transition',
                errors.email ? 'border-red-400' : ''
              ]"
              aria-describedby="email-error"
            />
            <p v-if="errors.email" id="email-error" class="mt-1 text-sm text-red-600">
              {{ errors.email }}
            </p>
          </div>

          <div class="mb-6">
            <label for="password" class="block text-sm font-medium text-gray-700 mb-1">
              Contraseña
            </label>
            <input
              id="password"
              v-model="form.password"
              type="password"
              autocomplete="current-password"
              :disabled="isSubmitting"
              :class="[
                'w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-700 focus:border-transparent transition',
                errors.password ? 'border-red-400' : ''
              ]"
              aria-describedby="password-error"
            />
            <p v-if="errors.password" id="password-error" class="mt-1 text-sm text-red-600">
              {{ errors.password }}
            </p>
          </div>

          <button
            type="submit"
            :disabled="isSubmitting"
            class="w-full bg-amber-800 text-white py-2 px-4 font-medium hover:bg-amber-900 disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-amber-700 focus:ring-offset-2 transition"
          >
            <span v-if="isSubmitting">Ingresando...</span>
            <span v-else>Ingresar</span>
          </button>
        </form>
      </div>
    </div>
  </div>
</template>