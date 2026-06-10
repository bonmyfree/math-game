import { z } from 'zod'

export const loginSchema = z.object({
  user: z.string().min(1, 'Username is required'),
  pass: z.string().min(1, 'Password is required'),
})

export type LoginValues = z.infer<typeof loginSchema>
