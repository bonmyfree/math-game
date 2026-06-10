/**
 * PERMISSION TYPES
 * Dùng C_FUNCTION_CODE làm key để check quyền
 */
export type PermissionAction = 'view' | 'update' | 'approve'

// Shape lưu vào store sau khi map từ API
// Key = C_FUNCTION_CODE
// Value = danh sách action được phép
//
// Eg:
// {
//   '0010001': ['view', 'update'],
//   '0010002': ['view'],
//   '0020000': ['view'],
// }
export type UserPermissions = Record<string, PermissionAction[]>
