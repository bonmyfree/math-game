import { cn } from '@/shared/utils'

import type { ReactNode } from 'react'

export type PageToolbarProps = {
  children: ReactNode
  className?: string
}

/**
 * Hàng công cụ căn phải — đặt `AddButton` và các nút khác làm children.
 * Dùng trong cùng khối `px-4 sm:px-6` với bảng để lề phải thẳng hàng.
 */
export function PageToolbar({ children, className }: PageToolbarProps) {
  return (
    <div className={cn('mb-4 flex flex-nowrap items-center justify-end gap-2', className)}>
      {children}
    </div>
  )
}
