# Jineteando Zapala

Catálogo digital administrable para un negocio de productos regionales y de campo ubicado en Zapala, Neuquén, Argentina.

> **Importante:** Este proyecto **no es una tienda online**. Los clientes pueden explorar el catálogo, consultar precios e imágenes y comunicarse directamente mediante WhatsApp o visitar el local físico.

---

# Tecnologías

| Capa | Tecnología |
|------|------------|
| Frontend | Vue 3 (Composition API) |
| Lenguaje | TypeScript (Strict Mode) |
| Build Tool | Vite |
| Estilos | Tailwind CSS v4 |
| Router | Vue Router 4 |
| Estado Global | Pinia |
| Validaciones | Zod |
| Backend | Supabase |
| Base de datos | PostgreSQL |
| Autenticación | Supabase Auth |
| Storage | Supabase Storage |
| Seguridad | Row Level Security (RLS) |
| Deploy | Cloudflare Pages |

---

# Arquitectura

El proyecto sigue una arquitectura por dominios y capas para mantener una clara separación de responsabilidades.

```
src/
├── domain/
│   ├── types.ts
│   ├── schemas.ts
│   └── constants.ts
│
├── infrastructure/
│   ├── productos.ts
│   ├── categorias.ts
│   ├── imagenes.ts
│   ├── configuracion.ts
│   ├── busqueda.ts
│   └── supabase.ts
│
├── modules/
│   ├── admin/
│   └── catalogo/
│
├── shared/
│   ├── components/
│   ├── composables/
│   └── utils/
│
├── stores/
│
├── router/
│
├── App.vue
├── main.ts
└── style.css
```

## Principios utilizados

- Arquitectura por dominios.
- TypeScript en modo estricto.
- Composition API.
- Separación entre UI, lógica y acceso a datos.
- Toda comunicación con Supabase está encapsulada dentro de `infrastructure`.
- Seguridad basada en Row Level Security (RLS), no únicamente en ocultar elementos del frontend.

---

# Cómo ejecutar el proyecto

## Requisitos

- Node.js 18 o superior.
- npm.
- Proyecto creado en Supabase.

---

## Instalación

```bash
git clone https://github.com/Sannlehnert/jineteando-zapala.git

cd jineteando-zapala/frontend

npm install
```

---

## Variables de entorno

Crear un archivo `.env` basado en `.env.example`.

```env
VITE_SUPABASE_URL=https://xxxxxxxx.supabase.co

VITE_SUPABASE_ANON_KEY=eyJhbGc...
```

---

## Desarrollo

```bash
npm run dev
```

Abrir:

```
http://localhost:5173
```

---

## Build de producción

```bash
npm run build

npm run preview
```

---

# Supabase

## Base de datos

El proyecto utiliza PostgreSQL mediante Supabase.

### Tablas principales

- categorias
- productos
- imagenes_producto
- configuracion

### Relaciones

```
categorias
    │
    ├── padre_id (subcategorías)

productos
    │
    ├── categoria_id

imagenes_producto
    │
    ├── producto_id
```

---

## Migraciones

Las migraciones fueron ejecutadas mediante el SQL Editor de Supabase.

Si el directorio fue versionado:

```
supabase/migrations/
```

contiene todas las migraciones utilizadas para construir el proyecto.

---

# Seguridad

## Row Level Security

Todas las tablas poseen políticas RLS.

### Lectura

- Pública.
- Solo contenido activo.

### Escritura

Exclusivamente usuarios autenticados con:

```
user_metadata.rol = "admin"
```

---

# Storage

Bucket utilizado:

```
productos
```

Permisos:

- Lectura pública.
- Escritura únicamente para administradores autenticados.

---

# Autenticación

Se utiliza Supabase Auth mediante Email y Password.

Características:

- No existe registro público.
- Existe un único usuario administrador.
- El administrador es creado manualmente desde Supabase.
- El rol se almacena en:

```
user_metadata.rol
```

---

# Deploy

El proyecto está preparado para desplegarse en Cloudflare Pages.

Configuración:

| Opción | Valor |
|---------|-------|
| Build Command | npm run build |
| Output Directory | dist |
| Root Directory | frontend |

Variables de entorno:

```
VITE_SUPABASE_URL

VITE_SUPABASE_ANON_KEY
```

---

# Scripts disponibles

| Comando | Descripción |
|----------|-------------|
| npm run dev | Desarrollo |
| npm run build | Build producción |
| npm run preview | Vista previa del build |

---

# SEO

El proyecto incorpora optimizaciones SEO técnicas:

- Meta Title dinámico.
- Meta Description dinámica.
- Canonical dinámica.
- Open Graph.
- Twitter Cards.
- robots.txt.
- sitemap.xml.
- Manifest Web.
- Favicons.
- Apple Touch Icon.
- Schema.org LocalBusiness.
- Schema.org Product.
- Schema.org BreadcrumbList.
- Schema.org WebSite.
- Datos estructurados JSON-LD.

---

# Funcionalidades

## Panel de administración

- Login protegido.
- CRUD de categorías.
- CRUD de subcategorías.
- CRUD de productos.
- Productos destacados.
- Gestión de imágenes.
- Múltiples imágenes.
- Reordenamiento de imágenes.
- Gestión de atributos.
- Configuración completa del negocio.
- Dashboard con métricas.

---

## Catálogo público

- Home editorial.
- Categorías.
- Subcategorías.
- Productos destacados.
- Detalle de producto.
- Galería.
- Búsqueda.
- Filtros.
- Contacto.
- Compartir producto.
- WhatsApp.
- Google Maps.
- Redes sociales.
- Responsive.

---

# Estructura del proyecto

```
jineteando-zapala/

├── frontend/
│
│   ├── public/
│   │   ├── favicon.ico
│   │   ├── robots.txt
│   │   ├── sitemap.xml
│   │   └── manifest.webmanifest
│   │
│   ├── src/
│   │
│   │   ├── domain/
│   │   ├── infrastructure/
│   │   ├── modules/
│   │   │   ├── admin/
│   │   │   └── catalogo/
│   │   ├── router/
│   │   ├── shared/
│   │   ├── stores/
│   │   ├── App.vue
│   │   ├── main.ts
│   │   └── style.css
│   │
│   ├── .env.example
│   ├── package.json
│   ├── vite.config.ts
│   └── tsconfig.json
│
├── supabase/
│   └── migrations/
│
├── README.md
├── MANUAL_ADMIN.md
├── CHANGELOG.md
└── LICENSE
```

---

# Licencia

Este proyecto se distribuye bajo la licencia MIT.

---

# Autor

**Santiago Agustín Lehnert**

Desarrollado como un proyecto real para **Jineteando Zapala**, aplicando buenas prácticas de arquitectura, accesibilidad, seguridad, SEO y experiencia de usuario.