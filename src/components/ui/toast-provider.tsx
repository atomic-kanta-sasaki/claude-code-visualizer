'use client'

import { useEffect, useState } from 'react'
import { toast } from '@/shared/lib/toast'
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react'
import { cn } from '@/shared/lib/utils'

interface Toast {
    id: string
    message: string
    type: 'success' | 'error' | 'info' | 'warning'
}

const toastIcons = {
    success: CheckCircle,
    error: AlertCircle,
    info: Info,
    warning: AlertTriangle,
}

const toastStyles = {
    success: 'bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-200',
    error: 'bg-red-50 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-200',
    info: 'bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-200',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800 dark:bg-yellow-900/20 dark:border-yellow-800 dark:text-yellow-200',
}

export function ToastProvider() {
    const [toasts, setToasts] = useState<Toast[]>([])

    useEffect(() => {
        const unsubscribe = toast.subscribe(setToasts)
        return unsubscribe
    }, [])

    if (toasts.length === 0) return null

    return (
        <div className="fixed top-4 right-4 z-50 space-y-2">
            {toasts.map((toast) => {
                const Icon = toastIcons[toast.type]
                return (
                    <div
                        key={toast.id}
                        className={cn(
                            'flex items-center space-x-3 p-4 rounded-lg border shadow-lg min-w-[300px] animate-in slide-in-from-right-full',
                            toastStyles[toast.type]
                        )}
                    >
                        <Icon className="h-5 w-5 flex-shrink-0" />
                        <p className="flex-1 text-sm font-medium">{toast.message}</p>
                        <button
                            onClick={() => {
                                // Remove toast manually if needed
                                setToasts(prev => prev.filter(t => t.id !== toast.id))
                            }}
                            className="flex-shrink-0 opacity-70 hover:opacity-100 transition-opacity"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                )
            })}
        </div>
    )
}