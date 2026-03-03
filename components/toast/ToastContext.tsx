"use client";

import {
    createContext,
    useCallback,
    useContext,
    useId,
    useRef,
    useState,
} from "react";

// ─── Types ────────────────────────────────────────────────────────────────────
export type ToastType = "success" | "error" | "warning" | "info" | "loading";

export interface Toast {
    id: string;
    message: string;
    type: ToastType;
    duration?: number; // ms, 0 = persistent
    description?: string;
}

interface ToastContextValue {
    toasts: Toast[];
    toast: {
        success: (message: string, options?: ToastOptions) => string;
        error: (message: string, options?: ToastOptions) => string;
        warning: (message: string, options?: ToastOptions) => string;
        info: (message: string, options?: ToastOptions) => string;
        loading: (message: string, options?: ToastOptions) => string;
        dismiss: (id: string) => void;
        /** Update an existing toast (e.g. loading → success after API call) */
        update: (id: string, patch: Partial<Omit<Toast, "id">>) => void;
    };
}

interface ToastOptions {
    description?: string;
    duration?: number;
}

// ─── Context ──────────────────────────────────────────────────────────────────
export const ToastContext = createContext<ToastContextValue | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────
export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);
    const counterRef = useRef(0);

    const remove = useCallback((id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    const add = useCallback(
        (type: ToastType, message: string, options?: ToastOptions): string => {
            const id = `toast-${Date.now()}-${++counterRef.current}`;
            const duration =
                options?.duration !== undefined
                    ? options.duration
                    : type === "loading"
                        ? 0
                        : 4000;

            const newToast: Toast = {
                id,
                type,
                message,
                description: options?.description,
                duration,
            };

            setToasts((prev) => [...prev, newToast]);

            if (duration > 0) {
                setTimeout(() => remove(id), duration);
            }

            return id;
        },
        [remove]
    );

    const update = useCallback(
        (id: string, patch: Partial<Omit<Toast, "id">>) => {
            setToasts((prev) =>
                prev.map((t) => (t.id === id ? { ...t, ...patch } : t))
            );

            // If the updated toast now has a positive duration, start auto-dismiss
            const duration = patch.duration;
            if (duration && duration > 0) {
                setTimeout(() => remove(id), duration);
            }
        },
        [remove]
    );

    const value: ToastContextValue = {
        toasts,
        toast: {
            success: (msg, opts) => add("success", msg, opts),
            error: (msg, opts) => add("error", msg, opts),
            warning: (msg, opts) => add("warning", msg, opts),
            info: (msg, opts) => add("info", msg, opts),
            loading: (msg, opts) => add("loading", msg, opts),
            dismiss: remove,
            update,
        },
    };

    return (
        <ToastContext.Provider value={value}>{children}</ToastContext.Provider>
    );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────
export function useToast() {
    const ctx = useContext(ToastContext);
    if (!ctx) {
        throw new Error("useToast must be used inside <ToastProvider>");
    }
    return ctx.toast;
}

export function useToastState() {
    const ctx = useContext(ToastContext);
    if (!ctx) {
        throw new Error("useToastState must be used inside <ToastProvider>");
    }
    return ctx.toasts;
}
