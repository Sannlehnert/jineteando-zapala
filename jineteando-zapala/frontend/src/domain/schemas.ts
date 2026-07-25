import { z } from 'zod'

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'El email es obligatorio')
    .email('El formato del email no es válido'),
  password: z.string().min(1, 'La contraseña es obligatoria'),
})

export type LoginForm = z.infer<typeof loginSchema>

export const categoriaSchema = z.object({
  nombre: z
    .string()
    .min(1, 'El nombre es obligatorio')
    .max(100, 'El nombre no puede superar los 100 caracteres'),
  activa: z.boolean().default(true),
  padre_id: z.string().uuid().nullable().optional().default(null),
})

export type CategoriaForm = z.infer<typeof categoriaSchema>

export const productoSchema = z.object({
  nombre: z
    .string()
    .min(1, 'El nombre es obligatorio')
    .max(150, 'El nombre no puede superar los 150 caracteres'),
  codigo: z
    .string()
    .min(1, 'El código es obligatorio')
    .max(50, 'El código no puede superar los 50 caracteres'),
  descripcion: z.string().max(2000).optional().default(''),
  precio_minorista: z
    .number({ error: 'Debe ser un número válido' })
    .nonnegative('El precio no puede ser negativo'),
  precio_mayorista: z
    .number({ error: 'Debe ser un número válido' })
    .nonnegative('El precio no puede ser negativo')
    .nullable()
    .optional()
    .default(null),
  categoria_id: z.string().uuid('Seleccioná una categoría válida'),
  imagen_principal_url: z.string().nullable().optional().default(null),
  activo: z.boolean().default(true),
})

export type ProductoForm = z.infer<typeof productoSchema>

// NUEVO esquema para atributos
export const atributosSchema = z.object({
  talles: z.array(z.string().min(1)).optional(),
  colores: z.array(z.string().min(1)).optional(),
  materiales: z.array(z.string().min(1)).optional(),
})

export type AtributosForm = z.infer<typeof atributosSchema>