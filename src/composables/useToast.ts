import { ref } from 'vue'

export type ToastType = 'success' | 'error' | 'info'

export interface ToastItem {
  id: number
  message: string
  type: ToastType
  duration: number
}

export const toasts = ref<ToastItem[]>([])

let toastCount = 0

export function useToast() {
  const showToast = (
    message: string,
    type: ToastType = 'info',
    duration = 3000,
  ) => {
    const id = ++toastCount
    toasts.value.push({ id, message, type, duration })
  }

  const removeToast = (id: number) => {
    toasts.value = toasts.value.filter((t) => t.id !== id)
  }

  return {
    success: (message: string, duration?: number) =>
      showToast(message, 'success', duration),
    error: (message: string, duration?: number) =>
      showToast(message, 'error', duration),
    info: (message: string, duration?: number) =>
      showToast(message, 'info', duration),
    toasts,
    removeToast,
  }
}
