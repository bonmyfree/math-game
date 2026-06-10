import { z } from 'zod'

export const backFunctionAddSchema = z.object({
  C_GROUP: z.string().trim(),
  C_CODE: z.string().trim().min(1),
  C_NAME: z.string().trim().min(1),
  C_MENU_NAME: z.string().trim(),
  C_PARENT_CODE: z.string().trim(),
  C_VIEW_FLAG: z.boolean(),
  C_UPDATE_FLAG: z.boolean(),
  C_APPROVE_FLAG: z.boolean(),
  C_MENU_FLAG: z.boolean(),
  C_ADMIN_FLAG: z.boolean(),
  C_ACTIVE: z.boolean(),
  C_CONTENT: z.string().trim(),
})

export type BackFunctionAddValues = z.infer<typeof backFunctionAddSchema>
