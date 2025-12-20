import React, { createContext, useContext, useState, useCallback } from 'react'

const ToastContext = createContext(null)

export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([])

    const addToast = useCallback((message, type = 'info', timeout = 4000) => {
        const id = Date.now() + Math.random()
        setToasts(t => [...t, { id, message, type }])
        if (timeout > 0) setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), timeout)
    }, [])

    const removeToast = useCallback((id) => setToasts(t => t.filter(x => x.id !== id)), [])

    return (
        <ToastContext.Provider value={{ addToast, removeToast }}>
            {children}
            <div className="toast-container">
                {toasts.map(t => (
                    <div key={t.id} className={`toast ${t.type}`} onClick={() => removeToast(t.id)}>
                        {t.message}
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    )
}

export function useToast() {
    const ctx = useContext(ToastContext)
    if (!ctx) throw new Error('useToast must be used within ToastProvider')
    return ctx.addToast
}

export default ToastProvider
