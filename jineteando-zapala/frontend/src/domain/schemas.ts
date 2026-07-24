import { z } from 'zod'

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'El email es obligatorio')
    .email('El formato del email no es válido'),
  password: z.string().min(1, 'La contraseña es obligatoria'),
})

export type LoginForm = z.infer<typeof loginSchema>