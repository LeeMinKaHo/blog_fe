"use client";

import { useState } from "react";
// Removed Dialog import - using custom overlay
import { useToast } from "@/components/toast";
import { verifyCode } from "@/app/services/authService";

interface VerificationModalProps {
    email: string;
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export default function VerificationModal({
    email,
    isOpen,
    onClose,
    onSuccess,
}: VerificationModalProps) {
    const [code, setCode] = useState("");
    const [loading, setLoading] = useState(false);
    const toast = useToast();

    const handleVerify = async () => {
        if (!code.trim()) return;
        setLoading(true);
        try {
            const res = await verifyCode(email, code.trim());
            toast.success(res.message ?? "Xác nhận thành công!");
            onSuccess();
            onClose();
        } catch (err: any) {
            toast.error(err?.message ?? "Mã xác nhận không hợp lệ");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-50">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4 shadow-lg">
                <h2 className="text-xl font-bold mb-4 text-gray-800">Xác nhận email</h2>
                <p className="text-sm text-gray-600 mb-3">
                    Vui lòng nhập mã OTP đã gửi tới <span className="font-medium">{email}</span>
                </p>
                <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="Mã OTP"
                    className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:border-blue-500 transition"
                />
                <div className="flex justify-end gap-3 mt-5">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm rounded-xl bg-gray-100 hover:bg-gray-200 transition"
                        disabled={loading}
                    >
                        Hủy
                    </button>
                    <button
                        onClick={handleVerify}
                        className="px-4 py-2 text-sm rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition disabled:opacity-50"
                        disabled={loading}
                    >
                        {loading ? "Đang xác nhận..." : "Xác nhận"}
                    </button>
                </div>
            </div>
        </div>
    );
}
