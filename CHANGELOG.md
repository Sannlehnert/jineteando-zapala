# Changelog

## [1.0.0] – 2025-07-31

### Primera versión estable

#### Funcionalidades principales
- Catálogo público con categorías, subcategorías y productos.
- Página de inicio con hero editorial, carrusel de categorías y productos destacados.
- Página de detalle de producto con galería de imágenes, atributos (talles, colores, materiales) y botón de WhatsApp.
- Búsqueda textual con filtros por categoría y rango de precio.
- Página de contacto con mapa embebido, dirección, horarios, WhatsApp y redes sociales.
- Página 404 personalizada.
- Panel de administración para gestionar productos, categorías, imágenes, atributos y configuración del negocio.
- Autenticación segura con Supabase Auth y protección de rutas.
- Almacenamiento de imágenes en Supabase Storage con políticas RLS.
- SEO dinámico (metaetiquetas, Open Graph, Twitter Cards, Schema.org).
- Diseño responsive mobile-first con Tailwind CSS.
- Accesibilidad WCAG AA.

#### Optimizaciones
- Lazy loading de rutas e imágenes.
- Carga diferida de fuentes con `display=swap`.
- Preconnect a Supabase y Google Fonts.
- Skeleton screens durante la carga.
- Validación de formularios con Zod.
- Manejo de errores y estados vacíos en toda la aplicación.
- Código tipado estrictamente con TypeScript.

#### Documentación
- README.md con guía de instalación y arquitectura.
- MANUAL_ADMIN.md para el usuario administrador.
- CHANGELOG.md (este archivo).
- Licencia MIT.