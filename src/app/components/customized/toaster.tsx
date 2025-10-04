import { toast } from 'sonner';

export const toastSuccess = (message: string, description?: string) => {
  toast.success(message, {
    description,
    className: 'success-toast',
    duration:2000
  })
}

export const toastError = (message: string, description?: string) => {
  toast.error(message, {
    description,
    className: 'error-toast',
    duration:2000
  })
}

export const toastWarning = (message: string, description?: string) => {
  toast.warning(message, {
    description,
    className: 'warning-toast',
    duration:2000
  })
}

export const toastInfo = (message: string, description?: string) => {
  toast.info(message, {
    description,
    className: 'info-toast',
    duration:2000
  })
}

// Custom toast with JSX
export const toastCustom = (message: string, description?: string) => {
  toast(message, {
    description,
    className: 'info-toast',
  })
}