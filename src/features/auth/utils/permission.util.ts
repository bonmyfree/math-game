/**
 * MAP PERMISSIONS
 * Convert response từ BACK.GET_SINGLE_USER_FUNC sang UserPermissions
 *
 * Input:
 *   [
 *     { C_FUNCTION_CODE: '0010001', C_VIEW: 1, C_UPDATE: 1, C_APPROVE: 0 },
 *     { C_FUNCTION_CODE: '0010002', C_VIEW: 1, C_UPDATE: 0, C_APPROVE: 0 },
 *   ]
 *
 * Output:
 *   {
 *     '0010001': ['view', 'update'],
 *     '0010002': ['view'],
 *   }
 */

import type { UserPermissionItem } from '@/shared/types/api.types'
import type { PermissionAction, UserPermissions } from '@/shared/types/permission.types'

export function mapPermissions(items: UserPermissionItem[]): UserPermissions {
  return items.reduce<UserPermissions>((acc, item) => {
    const actions: PermissionAction[] = []

    if (item.C_VIEW === 1) actions.push('view')
    if (item.C_UPDATE === 1) actions.push('update')
    if (item.C_APPROVE === 1) actions.push('approve')

    acc[item.C_FUNCTION_CODE] = actions
    return acc
  }, {})
}
