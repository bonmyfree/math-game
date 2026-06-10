import { AlertTriangle } from 'lucide-react'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog'
import type { ConfirmActionType } from '@/shared/types'

interface ConfirmActionModalProps {
  open: boolean
  actionType: ConfirmActionType
  objectName: string
  onClose: () => void
  onConfirm: () => void
  cancelText: string
  confirmText: string
}

export function ConfirmActionModal({
  open,
  actionType,
  objectName,
  onClose,
  onConfirm,
  cancelText,
  confirmText,
}: ConfirmActionModalProps) {
  const title =
    actionType === 'delete'
      ? 'Xác nhận xóa'
      : actionType === 'restore'
        ? 'Xác nhận khôi phục'
        : 'Xác nhận cập nhật'

  const description =
    actionType === 'restore' ? (
      <>
        Bạn muốn khôi phục <strong>{objectName}</strong>?
      </>
    ) : (
      <>
        Bạn chắc chắn muốn {actionType === 'delete' ? 'xóa' : 'cập nhật'}{' '}
        <strong>{objectName}</strong> ?
      </>
    )

  const confirmButtonClass =
    actionType === 'restore' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-red-600 hover:bg-red-700'

  return (
    <Dialog open={open} onOpenChange={(nextOpen) => !nextOpen && onClose()}>
      <DialogContent size="sm" className="!p-0 gap-0 overflow-hidden">
        <DialogHeader className="min-h-[92px] px-4 pt-4 pb-2">
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle size={18} className="text-amber-500" />
            {title}
          </DialogTitle>
          <DialogDescription className="leading-5">{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter className="!-mx-0 !-mb-0 rounded-b-lg border-t bg-white p-2 gap-2">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-8 min-w-[6.5rem] shrink-0 items-center justify-center rounded-lg border border-slate-200 px-3 text-sm font-medium text-slate-700 hover:bg-slate-50 cursor-pointer"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`inline-flex h-8 min-w-[6.5rem] shrink-0 items-center justify-center rounded-lg px-3 text-sm font-medium text-white cursor-pointer ${confirmButtonClass}`}
          >
            {confirmText}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
