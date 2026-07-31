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
    path: '/catalogo/:categoriaSlug/:subcategoriaSlug',
    name: 'subcategoria',
    component: () => import('../modules/catalogo/views/SubcategoriaPublicaView.vue'),
  },
  {
    path: '/catalogo/:categoriaSlug',
    name: 'categoria',
    component: () => import('../modules/catalogo/views/CategoriaPublicaView.vue'),
  },
  {
    path: '/producto/:productoSlug',
    name: 'producto-detalle',
    component: () => import('../modules/catalogo/views/ProductoDetalleView.vue'),
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
  {
    path: '/admin/categorias',
    name: 'admin-categorias',
    component: () => import('../modules/admin/views/CategoriasAdminView.vue'),
  },
  {
    path: '/admin/productos',
    name: 'admin-productos',
    component: () => import('../modules/admin/views/ProductosAdminView.vue'),
  },
  {
    path: '/admin/productos/nuevo',
    name: 'admin-productos-nuevo',
    component: () => import('../modules/admin/views/ProductoFormView.vue'),
  },
  {
    path: '/admin/productos/:id/editar',
    name: 'admin-productos-editar',
    component: () => import('../modules/admin/views/ProductoFormView.vue'),
  },
  {
    path: '/buscar',
    name: 'busqueda',
    component: () => import('../modules/catalogo/views/BusquedaView.vue'),
  },
  {
    path: '/admin/configuracion',
    name: 'admin-configuracion',
    component: () => import('../modules/admin/views/ConfiguracionView.vue'),
  },
  // Ruta 404 (debe ir al final)
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('../modules/catalogo/views/NotFoundView.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes: rutas,
})

// Guardia de autenticación y redirección
router.beforeEach((to, _from, next) => {
  const authStore = useAuthStore()

  const isAdminRoute = to.path.startsWith('/admin')
  const isLoginRoute = to.path === '/admin/login'

  if (isLoginRoute && authStore.esAdmin()) {
    return next('/admin')
  }

  if (isAdminRoute && !isLoginRoute) {
    if (!authStore.user) return next('/admin/login')
    if (!authStore.esAdmin()) return next('/')
  }

  next()
})

// Comportamiento después de cada navegación
router.afterEach(async (to, from) => {
  const authStore = useAuthStore()

  // Cerrar sesión automáticamente al salir del panel
  if (from.path.startsWith('/admin') && !to.path.startsWith('/admin')) {
    if (authStore.user) {
      await authStore.signOut()
    }
  }

  // Scroll hacia arriba en todas las rutas públicas
  if (!to.path.startsWith('/admin')) {
    window.scrollTo(0, 0)
  }
})

export default router