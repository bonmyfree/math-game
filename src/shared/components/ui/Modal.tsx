import { Loader2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { useModalStore } from '@/shared/stores/modal.store'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from './dialog'

/**
 * Imperative Modal được điều khiển qua `useModalStore`.
 *
 * Cách dùng từ bất kỳ component / handler nào:
 *
 *   const { openModal, closeModal, setLoading } = useModalStore()
 *
 *   openModal({
 *     title: 'Xác nhận xóa',
 *     children: <ConfirmContent />,
 *     footer: <ConfirmButtons />,
 *   })
 *
 *   // Trong handler async:
 *   setLoading(true)
 *   await api.delete(id)
 *   setLoading(false)
 *   closeModal()
 *
 * Khi `loading === true`:
 *   - Hiển thị overlay loader phủ trên content + footer.
 *   - Ẩn nút close (X) ở góc.
 *   - Chặn outside click, Escape key, và onOpenChange close intent.
 */
export function Modal() {
  const { t } = useTranslation()
  const open = useModalStore((s) => s.open)
  const config = useModalStore((s) => s.config)
  const loading = useModalStore((s) => s.loading)
  const closeModal = useModalStore((s) => s.closeModal)

  if (!config) return null

  const handleOpenChange = (next: boolean) => {
    if (next) return
    if (loading) return
    closeModal()
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        size={config.size}
        className={config.className}
        showCloseButton={!loading}
        onOpenAutoFocus={(e) => e.preventDefault()}
        onInteractOutside={(e) => {
          if (loading || config.disableOutsideClick) e.preventDefault()
        }}
        onEscapeKeyDown={(e) => {
          if (loading) e.preventDefault()
        }}
      >
        {config.title && (
          <DialogHeader>
            <DialogTitle>{t(config.title)}</DialogTitle>
          </DialogHeader>
        )}

        <div className="relative">
          {config.children}

          {config.footer && <div className="mt-4">{config.footer}</div>}

          {loading && (
            <div
              className="absolute inset-0 flex items-center justify-center rounded-md bg-white/70 backdrop-blur-sm"
              aria-busy="true"
              aria-live="polite"
            >
              <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
