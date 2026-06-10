import type { CSSProperties } from 'react'

/** Độ rộng cột thao tác (px) — gồm padding ô + 2 nút icon. */
export const TABLE_ACTION_COL_WIDTH_TWO_ICONS = 96
/** Độ rộng cột thao tác (px) — 1 nút icon. */
export const TABLE_ACTION_COL_WIDTH_ONE_ICON = 56

export const TABLE_ACTION_CELL_CLASS = 'flex items-center justify-center gap-0.5'

export function columnWidthStyle(size: number | undefined): CSSProperties | undefined {
  if (size == null) return undefined
  return { width: size, minWidth: size, maxWidth: size }
}

/** `meta` tùy chọn trên `ColumnDef` — dùng để chỉnh độ rộng / căn cột (vd. cột checkbox). */
export type DataTableColumnMeta = {
  headerClassName?: string
  cellClassName?: string
}

/** Căn giữa header + ô cột thao tác. */
export const TABLE_ACTION_COL_META: DataTableColumnMeta = {
  headerClassName: 'text-center',
  cellClassName: 'text-center',
}
