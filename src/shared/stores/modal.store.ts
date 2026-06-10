// stores/modal.store.ts
import { ReactNode } from 'react'
import { create } from 'zustand'

import { DialogSize } from '../components/ui/dialog'

type ModalConfig = {
  title?: string
  children?: ReactNode
  footer?: ReactNode
  className?: string
  disableOutsideClick?: boolean
  size: DialogSize
}

type ModalState = {
  open: boolean
  config: ModalConfig | null

  openModal: (config: ModalConfig) => void
  closeModal: () => void
  setLoading: (loading: boolean) => void

  loading: boolean
}

export const useModalStore = create<ModalState>((set) => ({
  open: false,
  config: null,
  loading: false,

  openModal: (config) =>
    set({
      open: true,
      config,
      loading: false,
    }),

  closeModal: () =>
    set({
      open: false,
      config: null,
      loading: false,
    }),

  setLoading: (loading) => set({ loading }),
}))
