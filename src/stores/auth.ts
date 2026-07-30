import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { User, Session } from '@supabase/supabase-js'
import { clienteSupabase } from '../infrastructure/supabase'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const session = ref<Session | null>(null)
  const isLoading = ref(false)
  const isInitialized = ref(false)

  async function initialize() {
    const { data: { session: currentSession } } = await clienteSupabase.auth.getSession()
    session.value = currentSession
    user.value = currentSession?.user ?? null

    clienteSupabase.auth.onAuthStateChange((_event, newSession) => {
      session.value = newSession
      user.value = newSession?.user ?? null
    })

    isInitialized.value = true
  }

  async function signIn(email: string, password: string) {
    isLoading.value = true
    try {
      const { data, error } = await clienteSupabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) throw error
      return data
    } finally {
      isLoading.value = false
    }
  }

  async function signOut() {
    isLoading.value = true
    try {
      await clienteSupabase.auth.signOut()
    } finally {
      isLoading.value = false
    }
  }

  const esAdmin = () => {
    return user.value?.user_metadata?.rol === 'admin'
  }

  return {
    user,
    session,
    isLoading,
    isInitialized,
    initialize,
    signIn,
    signOut,
    esAdmin,
  }
})