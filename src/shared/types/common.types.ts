// ─── Common Types ─────────────────────────────────────────────────────────────
export type Language = 'en' | 'vi'
export type ConfirmActionType = 'delete' | 'update' | 'restore'
export type NavIconKey = 'dashboard' | 'system' | 'digital-transform'

//─── Nav bar and tabar ─────────────────────────────────────────────────────────────
export interface NavItem {
  key: string
  labelKey: string
  path: string
  icon?: NavIconKey
  /** Permission codes; user needs `view` on at least one. Omit or `[]` hides the item (default-deny). Include `'ALL'` to show regardless of permissions. */
  right?: string[]
  children?: NavItem[]
}

export interface TabItem {
  label: string
  path: string
  matchPrefix?: boolean
  /** Single permission code for tab visibility (consumed by tab bar logic). Not the same shape as `NavItem.right[]`; pages may use `usePermission` for finer checks. */
  right: string
}
