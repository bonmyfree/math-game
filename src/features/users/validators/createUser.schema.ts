import { z } from 'zod'

export const createUserSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  fullName: z.string().min(1, 'Full name is required'),
  email: z.string().email('Invalid email'),
  role: z.string().min(1, 'Role is required'),
  status: z.enum(['active', 'inactive']).optional(),
})

export type CreateUserValues = z.infer<typeof createUserSchema>
