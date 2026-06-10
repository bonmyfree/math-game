import { TabItem } from '@/shared/types'
// ______ RIGHTS______________________________________________________________
// Khai báo mã quyền truy cập các page ở đây
export const APP_RIGHT = {
  SYSTEM: '0000000',
  DIGITAL_TRANSFORM: '0000000',
}

export const SYSTEM_RIGHT = {
  // Main tabs
  OPERATION: '0010000', // Vận hành hệ thống
  BACK_USER: '0030000', // Người dùng Back
  CATEGORY: '0050000', // Danh mục
  DEPARTMENT: '0070000', // Cấu trúc phòng ban

  // Sub tabs
  SYSTEM_LOG: '0010002', // Tra cứu log hệ thống

  BACK_FUNCTION: '0030001', // Chức năng Back
  GROUP_USER: '0030002', // Nhóm người dùng
  SUB_BACK_USER: '0030003', // Người dùng Back

  COMMON_CATEGORY: '0050001', // Danh mục chung

  BLOCK: 'ALL', // Khối
}
// ______END RIGHTS______________________________________________________________

// ______PATHS________
export const SYSTEM_PATH = {
  OPERATION: '/system/operation',
  BACK_USER: '/system/back-user',
  CATEGORIES: '/system/categories',
  DEPARTMENT: '/system/department',
}

// ______MAIN TABS__________
export const SYSTEM_TABS: TabItem[] = [
  {
    label: 'tab.systemOperation',
    path: SYSTEM_PATH.OPERATION,
    matchPrefix: true,
    right: SYSTEM_RIGHT.OPERATION,
  },
  {
    label: 'tab.backUser',
    path: SYSTEM_PATH.BACK_USER,
    matchPrefix: true,
    right: SYSTEM_RIGHT.BACK_USER,
  },
  {
    label: 'tab.category',
    path: SYSTEM_PATH.CATEGORIES,
    matchPrefix: true,
    right: SYSTEM_RIGHT.CATEGORY,
  },
  {
    label: 'tab.department',
    path: SYSTEM_PATH.DEPARTMENT,
    matchPrefix: true,
    right: SYSTEM_RIGHT.DEPARTMENT,
  },
]

// ______SUB TABS__________
export const SYS_OPERATION_TABS: TabItem[] = [
  {
    label: 'tab.systemLogLookup',
    path: `${SYSTEM_PATH.OPERATION}/system-log`,
    right: SYSTEM_RIGHT.SYSTEM_LOG,
  },
]
// Người dùng back
export const SYS_BACK_USER_TABS: TabItem[] = [
  {
    label: 'tab.backFunction',
    path: `${SYSTEM_PATH.BACK_USER}/functions`,
    right: SYSTEM_RIGHT.BACK_FUNCTION,
  },
  {
    label: 'tab.backUserGroup',
    path: `${SYSTEM_PATH.BACK_USER}/group`,
    right: SYSTEM_RIGHT.GROUP_USER,
  },
  {
    label: 'tab.backUser',
    path: `${SYSTEM_PATH.BACK_USER}/users`,
    right: SYSTEM_RIGHT.SUB_BACK_USER,
  },
]

// Danh mục
export const SYS_CATEGORY_TABS: TabItem[] = [
  {
    label: 'tab.commonCategory',
    path: `${SYSTEM_PATH.CATEGORIES}/common`,
    right: SYSTEM_RIGHT.COMMON_CATEGORY,
  },
]

// Cấu trúc phòng ban
export const SYS_DEPARTMENT_TABS: TabItem[] = [
  {
    label: 'tab.departmentBlock',
    path: `${SYSTEM_PATH.DEPARTMENT}/block`,
    right: SYSTEM_RIGHT.BLOCK,
  },
]

// Others
