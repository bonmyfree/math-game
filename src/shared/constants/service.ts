/** Giá trị `group` trong payload POST /backServices (cùng cấp với `cmd`). */
export const GROUP = {
  LIST: 'LIST', // Tra cứu / danh sách
  DM: 'DM', // Danh mục / tài liệu (DOC, LIST_FILE_UNDO, …)
  EXEC: 'EXEC', // Thực thi (đăng xuất, …)
  SAVE: 'SAVE', // Thêm / cập nhật
  DELETE: 'DELETE', // Xóa
} as const

export type ApiGroup = (typeof GROUP)[keyof typeof GROUP]

export const CMD = {
  //_______ HỆ THỐNG _______________________________________________________________________________
  // TAB: Vận hành hệ thống
  GET_SYSTEM_LOGS: 'BACK.GET_ALL_LOG', // Lấy danh sách logs hệ thống
  GET_SINGLE_DATA_LOG: 'BACK.GET_SINGLE_DATA_LOG', // Chi tiết log hệ thống theo id
  // TAB: Người dùng Back
  GET_ALL_AUTHORITY: 'PERMISSION.GET_ALL_AUTHORITY', // Lấy danh sách chức năng Back (Danh sách quyền tài khoản)
  SAVE_AUTHORITY: 'PERMISSION.SAVE_AUTHORITY', // Thêm/cập nhật chức năng Back
  DELETE_AUTHORITY: 'PERMISSION.DELETE_AUTHORITY', // Xóa chức năng Back
  GET_ALL_BACK_USER_GROUP: 'PERMISSION.GET_ALL_USER_GROUP', // Lấy danh sách nhóm người dùng Back
  GET_ALL_BACK_USER: 'BACK.GET_ALL_USER', // Lấy danh sách người dùng Back
  // TAB: Danh mục
  GET_ALL_LISTTYPE: 'BACK.GET_ALL_LISTTYPE', // Lấy danh sách danh mục chung
  // TAB: Cấu trúc phòng ban
  GET_ALL_LIST_VPBS_BUSINESS: 'BACK.GET_ALL_LIST_VPBS_BUSINESS', // Lấy danh sách Khối
  //_______ END: HỆ THỐNG _______________________________________________________________________________

  //_______ CHUYỂN ĐỔI SỐ _______________________________________________________________________________
  // TAB: Cây thư mục CĐS
  GET_ALL_FOLDER: 'DOC.GET_ALL_FOLDER', // Lấy danh sách thư mục CĐS
  LIST_FILE_UNDO: 'LIST_FILE_UNDO', // Lấy danh sách tài liệu đã xóa
  UNDO_FILE: 'UNDO_FILE', // Khôi phục tài liệu đã xóa
  GET_ALL_USER: 'GET_ALL_USER', // Lấy danh sách người dùng Front CĐS
  GET_ALL_USER_GROUP: 'GET_ALL_USER_GROUP', // Lấy danh sách nhóm quyền CĐS (Nhóm Front CĐS)
  //_______ END: CHUYỂN ĐỔI SỐ _______________________________________________________________________________

  // _______ QUẢN LÝ DỰ ÁN CĐS _______________________________________________________________________________
  GET_ALL_TEAM: 'GET_ALL_TEAM', // Lấy danh sách team
  GET_ALL_PROJECT: 'GET_ALL_PROJECT', // Lấy danh sách dự án
  GET_ALL_PHASE: 'GET_ALL_PHASE', // Lấy danh sách giai đoạn dự án
  GET_ALL_FEATURE: 'GET_ALL_FEATURE', // Lấy danh sách tính năng dự án
  GET_ALL_TASK: 'GET_ALL_TASK', // Lấy danh sách công việc dự án

  // _______END: QUẢN LÝ DỰ ÁN CĐS _______________________________________________________________________________

  // OTHERS
  GET_SINGLE_USER: 'BACK.GET_SINGLE_USER', // Lấy thông tin cá nhân tài khoản
}
