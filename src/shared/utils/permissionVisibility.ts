import type { UserPermissions } from '@/shared/types/permission.types'

/**
 * Sidebar / `NavItem`: default-deny — missing or empty `right` hides the item.
 * Any entry equal to `ALL` (case-insensitive) allows regardless of permissions.
 */
export function canViewNavRights(permissions: UserPermissions, right?: string[]): boolean {
  if (!right || right.length === 0) return false
  if (right.map((code) => code.toUpperCase()).includes('ALL')) return true
  return right.some((code) => (permissions[code] ?? []).includes('view'))
}

/**
 * Tab bar / `TabItem.right`: single function code — needs `view` on that code.
 * Empty / whitespace-only code means “no gate” (show tab). `ALL` bypasses checks.
 */
export function canViewTabRight(permissions: UserPermissions, right: string): boolean {
  const code = right.trim()
  if (!code) return true
  if (code.toUpperCase() === 'ALL') return true
  return (permissions[code] ?? []).includes('view')
}
