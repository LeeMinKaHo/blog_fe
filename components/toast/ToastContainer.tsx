"use client";

import { useContext, useEffect, useState } from "react";
import { useToastState, Toast, ToastType, ToastContext } from "./ToastContext";

// ─── Icons ────────────────────────────────────────────────────────────────────
function SuccessIcon() {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 6L9 17l-5-5" />
        </svg>
    );
}

function ErrorIcon() {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="15" y1="9" x2="9" y2="15" />
            <line x1="9" y1="9" x2="15" y2="15" />
        </svg>
    );
}

function WarningIcon() {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
    );
}

function InfoIcon() {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
    );
}

function LoadingIcon() {
    return (
        <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ animation: "toast-spin 0.8s linear infinite" }}
        >
            <path d="M21 12a9 9 0 1 1-6.219-8.56" />
        </svg>
    );
}

function CloseIcon() {
    return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
    );
}

// ─── Config per type ──────────────────────────────────────────────────────────
const TOAST_CONFIG: Record<
    ToastType,
    { icon: React.ReactNode; color: string; bg: string; border: string }
> = {
    success: {
        icon: <SuccessIcon />,
        color: "#16a34a",
        bg: "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)",
        border: "#86efac",
    },
    error: {
        icon: <ErrorIcon />,
        color: "#dc2626",
        bg: "linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)",
        border: "#fca5a5",
    },
    warning: {
        icon: <WarningIcon />,
        color: "#d97706",
        bg: "linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)",
        border: "#fcd34d",
    },
    info: {
        icon: <InfoIcon />,
        color: "#2563eb",
        bg: "linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)",
        border: "#93c5fd",
    },
    loading: {
        icon: <LoadingIcon />,
        color: "#6b7280",
        bg: "linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%)",
        border: "#d1d5db",
    },
};

// ─── Single Toast Item ────────────────────────────────────────────────────────
function ToastItem({
    toast,
    onDismiss,
}: {
    toast: Toast;
    onDismiss: (id: string) => void;
}) {
    const [visible, setVisible] = useState(false);
    const config = TOAST_CONFIG[toast.type];

    useEffect(() => {
        const t = setTimeout(() => setVisible(true), 10);
        return () => clearTimeout(t);
    }, []);

    const handleDismiss = () => {
        setVisible(false);
        setTimeout(() => onDismiss(toast.id), 300);
    };

    return (
        <div
            role="alert"
            aria-live="polite"
            style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "10px",
                padding: "12px 14px",
                borderRadius: "12px",
                background: config.bg,
                border: `1px solid ${config.border}`,
                boxShadow:
                    "0 4px 24px rgba(0,0,0,0.10), 0 1px 4px rgba(0,0,0,0.06)",
                minWidth: "280px",
                maxWidth: "380px",
                width: "100%",
                transform: visible
                    ? "translateX(0)"
                    : "translateX(calc(100% + 24px))",
                opacity: visible ? 1 : 0,
                transition:
                    "transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.3s ease",
                backdropFilter: "blur(8px)",
                position: "relative",
                overflow: "hidden",
            }}
        >
            {/* Accent bar */}
            <div
                style={{
                    position: "absolute",
                    left: 0,
                    top: 0,
                    bottom: 0,
                    width: "4px",
                    borderRadius: "12px 0 0 12px",
                    background: config.color,
                }}
            />

            {/* Icon */}
            <div
                style={{
                    color: config.color,
                    flexShrink: 0,
                    marginTop: "1px",
                    marginLeft: "8px",
                }}
            >
                {config.icon}
            </div>

            {/* Text */}
            <div style={{ flex: 1, minWidth: 0 }}>
                <p
                    style={{
                        margin: 0,
                        fontSize: "14px",
                        fontWeight: 600,
                        color: "#111827",
                        lineHeight: 1.4,
                        wordBreak: "break-word",
                    }}
                >
                    {toast.message}
                </p>
                {toast.description && (
                    <p
                        style={{
                            margin: "3px 0 0",
                            fontSize: "12px",
                            color: "#6b7280",
                            lineHeight: 1.5,
                        }}
                    >
                        {toast.description}
                    </p>
                )}
            </div>

            {/* Close button */}
            <button
                onClick={handleDismiss}
                aria-label="Đóng thông báo"
                style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "#9ca3af",
                    padding: "2px",
                    borderRadius: "4px",
                    flexShrink: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "color 0.2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#374151")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#9ca3af")}
            >
                <CloseIcon />
            </button>
        </div>
    );
}

// ─── Container ────────────────────────────────────────────────────────────────
export default function ToastContainer() {
    const toasts = useToastState();
    const ctx = useContext(ToastContext);
    const dismiss = ctx?.toast.dismiss ?? (() => { });

    if (toasts.length === 0) return null;

    return (
        <>
            {/* Keyframes injected once */}
            <style>{`
        @keyframes toast-spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
      `}</style>

            <div
                aria-label="Thông báo"
                style={{
                    position: "fixed",
                    bottom: "24px",
                    right: "24px",
                    zIndex: 9999,
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                    alignItems: "flex-end",
                    pointerEvents: "none",
                }}
            >
                {toasts.map((t) => (
                    <div key={t.id} style={{ pointerEvents: "auto" }}>
                        <ToastItem toast={t} onDismiss={dismiss} />
                    </div>
                ))}
            </div>
        </>
    );
}
