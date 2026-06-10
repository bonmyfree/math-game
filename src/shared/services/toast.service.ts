import { toast, type ToastOptions } from 'react-toastify'

const defaultOptions: ToastOptions = {
  position: 'top-right',
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
}

export const toastService = {
  success: (message: string, options?: ToastOptions) =>
    toast.success(message, { ...defaultOptions, ...options }),

  error: (message: string, options?: ToastOptions) =>
    toast.error(message, { ...defaultOptions, autoClose: 5000, ...options }),

  info: (message: string, options?: ToastOptions) =>
    toast.info(message, { ...defaultOptions, ...options }),

  warning: (message: string, options?: ToastOptions) =>
    toast.warning(message, { ...defaultOptions, ...options }),

  fromApiResponse: (code: number, message: string) => {
    if (code >= 200 && code < 300) {
      toastService.success(message)
    } else if (code === 401 || code === 403) {
      toastService.error(message)
    } else if (code >= 400 && code < 500) {
      toastService.warning(message)
    } else {
      toastService.error(message)
    }
  },
}
