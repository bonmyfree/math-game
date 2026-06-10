import { NavItem } from '../types'

/** Sidebar: default-deny when `right` is missing/empty. Use `right: ['ALL']` only for items visible to every authenticated user. */
export const NAV_ITEMS: NavItem[] = [
  {
    key: 'dashboard',
    labelKey: 'nav.dashboard',
    icon: 'dashboard',
    path: '/dashboard',
    right: ['ALL'],
  },
  {
    key: 'system',
    labelKey: 'nav.system',
    icon: 'system',
    path: '/system',
    right: ['0000000'],
  },
  {
    key: 'digitalTransform',
    labelKey: 'nav.digitalTransform',
    icon: 'digital-transform',
    path: '/digital-transform',
    right: ['0000000'],
  },
]
