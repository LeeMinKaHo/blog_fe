"use client";

import { useState } from "react";
import { ShieldAlert, X, ArrowRight } from "lucide-react";
import VerificationModal from "./VerificationModal";
import { useQueryClient } from "@tanstack/react-query";

interface VerificationBannerProps {
    email: string;
}

/**
 * Banner cảnh báo khi user đã đăng nhập nhưng chưa xác thực email.
 * Khi click "Xác thực ngay" → mở VerificationModal có sẵn để nhập OTP.
 * Sau verify thành công: backend set cookie token mới (isVerified=true)
 * → invalidate query "me" → banner tự biến mất, không cần đăng nhập lại.
 */
export default function VerificationBanner({ email }: VerificationBannerProps) {
    const [dismissed, setDismissed] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const queryClient = useQueryClient();

    if (dismissed) return null;

    const handleSuccess = () => {
        // Token mới đã được set trong cookie bởi backend.
        // Chỉ cần refetch /auth/me → banner tự ẩn vì isVerified = true
        queryClient.invalidateQueries({ queryKey: ["me"] });
    };

    return (
        <>
            {/* ── Banner ───────────────────────────────────────────────── */}
            <div className="w-full border-b border-amber-200 bg-amber-50">
                <div className="max-w-7xl mx-auto px-4 md:px-6 py-2.5 md:py-2 flex flex-col sm:flex-row items-center gap-2 md:gap-3">

                    <div className="flex items-center gap-3 flex-1 w-full sm:w-auto">
                        {/* Icon */}
                        <div className="shrink-0 w-6 h-6 sm:w-5 sm:h-5 rounded-full bg-amber-200 flex items-center justify-center">
                            <ShieldAlert size={12} className="text-amber-700" />
                        </div>

                        {/* Message */}
                        <p className="flex-1 text-[11px] sm:text-xs text-amber-800 leading-tight">
                            <span className="font-semibold">Email chưa được xác thực.</span>
                            {" "}Xác thực để mở khoá toàn bộ tính năng.
                        </p>
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                        {/* CTA */}
                        <button
                            onClick={() => setModalOpen(true)}
                            className="flex items-center gap-1 text-[11px] sm:text-xs font-bold text-amber-700 bg-white border border-amber-200 hover:bg-amber-100 hover:border-amber-300 px-3 py-1.5 rounded-lg transition-all"
                        >
                            Xác thực ngay
                            <ArrowRight size={11} />
                        </button>

                        {/* Dismiss */}
                        <button
                            onClick={() => setDismissed(true)}
                            className="p-1.5 rounded-md text-amber-400 hover:text-amber-600 hover:bg-amber-100 transition-colors"
                            aria-label="Ẩn thông báo"
                        >
                            <X size={14} />
                        </button>
                    </div>
                </div>
            </div>

            {/* ── OTP Modal ────────────────────────────────────────────── */}
            <VerificationModal
                email={email}
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                onSuccess={handleSuccess}
            />
        </>
    );
}
