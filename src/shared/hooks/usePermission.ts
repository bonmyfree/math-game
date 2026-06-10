import { useAuthStore } from '../stores'
import { PermissionAction } from '../types'

export function usePermission(right: string) {
  // Lấy toàn bộ permissions — stable reference, không tạo array mới
  const permissions = useAuthStore((s) => s.permissions)
  if (right.toUpperCase() === 'ALL') {
    return {
      canView: true,
      canUpdate: true,
      canApprove: true,
      hasAnyRight: true,
      hasAllRight: true,
    }
  }

  const actions = permissions[right] ?? []

  return {
    canView: actions.includes('view'),
    canUpdate: actions.includes('update'),
    canApprove: actions.includes('approve'),
    hasAnyRight: (...required: PermissionAction[]) => required.some((a) => actions.includes(a)),
    hasAllRight: (...required: PermissionAction[]) => required.every((a) => actions.includes(a)),
  }
}

/**
 * Check permission ngoài component
 */
export function checkPermission(functionCode: string, action: PermissionAction = 'view'): boolean {
  const permissions = useAuthStore.getState().permissions
  if (functionCode.toUpperCase() === 'ALL') return true // Mã quyền là "ALL", mạc định user có quyền view
  return (permissions[functionCode] ?? []).includes(action)
}
