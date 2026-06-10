import { QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider } from '@tanstack/react-router'
import { useEffect } from 'react'
import { ToastContainer } from 'react-toastify'

import 'react-toastify/dist/ReactToastify.css'
import { Modal } from '@/shared/components/ui/Modal'
import i18n from '@/shared/i18n'
import { queryClient } from '@/shared/query/queryClient'
import { useGlobalStore } from '@/shared/stores'

import { router } from './router'

export function App() {
  // Một lần khi mount: đồng bộ i18n với `locale` trong global store (localStorage key `locale`).
  // Tránh lệch với detector i18next (`i18nextLng` / navigator).
  useEffect(() => {
    const stored = useGlobalStore.getState().locale
    const base = (i18n.language ?? '').split('-')[0]
    if (base !== stored) {
      void i18n.changeLanguage(stored)
    }
  }, [])

  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        theme="light"
      />
      <Modal />
    </QueryClientProvider>
  )
}
