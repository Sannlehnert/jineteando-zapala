import { defineStore } from 'pinia'
import { ref } from 'vue'
import { obtenerConfiguracion } from '../infrastructure/configuracion'
import type { Configuracion } from '../domain/types'

export const useConfiguracionStore = defineStore('configuracion', () => {
  const config = ref<Configuracion | null>(null)
  const cargando = ref(false)
  const error = ref<string | null>(null)

  async function cargar() {
    if (config.value) return // ya cargada
    cargando.value = true
    error.value = null
    try {
      config.value = await obtenerConfiguracion()
    } catch (e: any) {
      error.value = e.message
    } finally {
      cargando.value = false
    }
  }

  // Inicializar al instanciar el store (se hace desde main.ts o desde el primer uso)
  // Llamamos a cargar aquí si no está inicializado
  cargar()

  return { config, cargando, error, cargar }
})