import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const rutas: RouteRecordRaw[] = [
  // --- Rutas públicas ---
  {
    path: '/',
    name: 'inicio',
    component: () => import('../modules/catalogo/views/InicioView.vue'),
  },
  {
    path: '/catalogo',
    name: 'catalogo',
    component: () => import('../modules/catalogo/views/CatalogoView.vue'),
  },
  {
    path: '/contacto',
    name: 'contacto',
    component: () => import('../modules/catalogo/views/ContactoView.vue'),
  },
  // --- Rutas administrativas ---
  {
    path: '/admin/login',
    name: 'login-admin',
    component: () => import('../modules/admin/views/LoginAdminView.vue'),
  },
  {
    path: '/admin',
    name: 'panel-admin',
    component: () => import('../modules/admin/views/PanelAdminView.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes: rutas,
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()

  const isAdminRoute = to.path.startsWith('/admin')
  const isLoginRoute = to.path === '/admin/login'

  // Si ya está autenticado como admin y va al login, redirigir al panel
  if (isLoginRoute && authStore.esAdmin()) {
    return next('/admin')
  }

  // Cualquier ruta de admin que no sea login requiere autenticación y rol admin
  if (isAdminRoute && !isLoginRoute) {
    if (!authStore.user) return next('/admin/login')
    if (!authStore.esAdmin()) return next('/')
  }

  next()
})

export default router