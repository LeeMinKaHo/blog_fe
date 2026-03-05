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
                <div className="max-w-7xl mx-auto px-6 py-2 flex items-center gap-3">

                    {/* Icon */}
                    <div className="shrink-0 w-5 h-5 rounded-full bg-amber-200 flex items-center justify-center">
                        <ShieldAlert size={11} className="text-amber-700" />
                    </div>

                    {/* Message */}
                    <p className="flex-1 text-xs text-amber-800">
                        <span className="font-semibold">Email chưa được xác thực.</span>
                        {" "}Một số tính năng như viết bài bị tạm khoá.
                    </p>

                    {/* CTA */}
                    <button
                        onClick={() => setModalOpen(true)}
                        className="shrink-0 flex items-center gap-1 text-xs font-bold text-amber-700 bg-white border border-amber-200 hover:bg-amber-100 hover:border-amber-300 px-3 py-1.5 rounded-lg transition-all"
                    >
                        Xác thực ngay
                        <ArrowRight size={11} />
                    </button>

                    {/* Dismiss */}
                    <button
                        onClick={() => setDismissed(true)}
                        className="shrink-0 p-1 rounded-md text-amber-400 hover:text-amber-600 hover:bg-amber-100 transition-colors"
                        aria-label="Ẩn thông báo"
                    >
                        <X size={13} />
                    </button>
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
