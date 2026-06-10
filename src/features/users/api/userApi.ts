import { apiService } from '@/shared/services/api.service'
import type { ApiResponse, UserInfo } from '@/shared/types'

export type CreateUserPayload = {
  username: string
  fullName: string
  email: string
  role: string
  status?: 'active' | 'inactive'
}

export const userApi = {
  getAll: () => apiService.get<ApiResponse<UserInfo[]>>('/users'),
  getById: (id: string) => apiService.get<ApiResponse<UserInfo>>(`/users/${id}`),
  create: (data: CreateUserPayload) => apiService.post<ApiResponse<UserInfo>>('/users', data),
}
