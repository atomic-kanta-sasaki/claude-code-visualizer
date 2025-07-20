// Simple toast implementation
// In a real app, you might want to use a library like react-hot-toast or sonner

type ToastType = 'success' | 'error' | 'info' | 'warning'

interface ToastOptions {
  duration?: number
}

class ToastManager {
  private toasts: Array<{ id: string; message: string; type: ToastType }> = []
  private listeners: Array<(toasts: typeof this.toasts) => void> = []

  private notify() {
    this.listeners.forEach(listener => listener([...this.toasts]))
  }

  private addToast(message: string, type: ToastType, options: ToastOptions = {}) {
    const id = Math.random().toString(36).substr(2, 9)
    const toast = { id, message, type }
    
    this.toasts.push(toast)
    this.notify()

    // Auto remove after duration
    setTimeout(() => {
      this.removeToast(id)
    }, options.duration || 3000)

    return id
  }

  private removeToast(id: string) {
    this.toasts = this.toasts.filter(toast => toast.id !== id)
    this.notify()
  }

  success(message: string, options?: ToastOptions) {
    return this.addToast(message, 'success', options)
  }

  error(message: string, options?: ToastOptions) {
    return this.addToast(message, 'error', options)
  }

  info(message: string, options?: ToastOptions) {
    return this.addToast(message, 'info', options)
  }

  warning(message: string, options?: ToastOptions) {
    return this.addToast(message, 'warning', options)
  }

  subscribe(listener: (toasts: typeof this.toasts) => void) {
    this.listeners.push(listener)
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener)
    }
  }
}

export const toast = new ToastManager()