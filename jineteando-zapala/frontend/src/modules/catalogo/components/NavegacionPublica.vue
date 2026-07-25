<template>
  <nav class="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-40">
    <div class="max-w-7xl mx-auto px-5 py-3 flex items-center justify-between">
      <router-link to="/" class="text-xl font-serif text-[#2C2A28] no-underline">
        Jineteando Zapala
      </router-link>
      <div class="flex items-center gap-4 text-sm">
        <router-link to="/" class="text-gray-700 hover:text-amber-800 transition">Inicio</router-link>
        <router-link to="/catalogo" class="text-gray-700 hover:text-amber-800 transition">Catálogo</router-link>
        <router-link to="/contacto" class="text-gray-700 hover:text-amber-800 transition">Contacto</router-link>
      </div>
    </div>
  </nav>
</template>