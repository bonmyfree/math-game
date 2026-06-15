import { NavItem } from '../types'

/** Sidebar: default-deny when `right` is missing/empty. Use `right: ['ALL']` only for items visible to every authenticated user. */
export const NAV_ITEMS: NavItem[] = [
  {
    key: 'home',
    labelKey: 'nav.home',
    icon: 'home',
    path: '/home',
    right: ['ALL'],
  },
  {
    key: 'documents',
    labelKey: 'nav.documents',
    icon: 'documents',
    path: '/documents',
    right: ['ALL'],
  },
  {
    key: 'ranks',
    labelKey: 'nav.ranks',
    icon: 'ranks',
    path: '/ranks',
    right: ['ALL'],
  },
  {
    key: 'homework',
    labelKey: 'nav.homework',
    icon: 'homework',
    path: '/homework',
    right: ['ALL'],
  },
  {
    key: 'settings',
    labelKey: 'nav.settings',
    icon: 'settings',
    path: '/settings',
    right: ['ALL'],
  },
]
