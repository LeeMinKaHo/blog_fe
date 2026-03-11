"use client";

import { useEffect, useRef, useState } from "react";
import { useToast } from "@/components/toast";
import { verifyCode, resendVerification } from "@/app/services/authService";
import { Mail, RefreshCw, CheckCircle2 } from "lucide-react";

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
    const [digits, setDigits] = useState<string[]>(Array(6).fill(""));
    const [loading, setLoading] = useState(false);
    const [resending, setResending] = useState(false);
    const [countdown, setCountdown] = useState(60);
    const [verified, setVerified] = useState(false);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
    const toast = useToast();

    // Countdown gửi lại OTP
    useEffect(() => {
        if (!isOpen) return;
        setCountdown(60);
        const timer = setInterval(() => {
            setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);
        return () => clearInterval(timer);
    }, [isOpen]);

    const code = digits.join("");

    const handleDigitChange = (index: number, value: string) => {
        const v = value.replace(/\D/g, "").slice(-1);
        const next = [...digits];
        next[index] = v;
        setDigits(next);
        if (v && index < 5) inputRefs.current[index + 1]?.focus();
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
        if (e.key === "Backspace" && !digits[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e: React.ClipboardEvent) => {
        const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
        if (!pasted) return;
        const next = Array(6).fill("");
        pasted.split("").forEach((ch, i) => { next[i] = ch; });
        setDigits(next);
        inputRefs.current[Math.min(pasted.length, 5)]?.focus();
    };

    const handleVerify = async () => {
        if (code.length < 6) {
            toast.error("Vui lòng nhập đủ 6 chữ số!");
            return;
        }
        setLoading(true);
        try {
            const res = await verifyCode(email, code);
            setVerified(true);
            toast.success(res.message ?? "Xác nhận thành công!");
            setTimeout(() => { onSuccess(); onClose(); }, 1500);
        } catch (err: any) {
            toast.error(err?.message ?? "Mã OTP không hợp lệ");
            setDigits(Array(6).fill(""));
            inputRefs.current[0]?.focus();
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        if (countdown > 0) return;
        setResending(true);
        try {
            const res = await resendVerification(email);
            toast.success(res.message ?? "Đã gửi lại OTP!");
            setCountdown(60);
            setDigits(Array(6).fill(""));
            inputRefs.current[0]?.focus();
        } catch (err: any) {
            toast.error(err?.message ?? "Gửi lại OTP thất bại");
        } finally {
            setResending(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50 p-4">
            <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden">
                {/* Header gradient */}
                <div className="bg-gradient-to-br from-indigo-600 to-indigo-500 px-8 pt-8 pb-10 text-center relative">
                    <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        {verified
                            ? <CheckCircle2 size={28} className="text-white" />
                            : <Mail size={28} className="text-white" />
                        }
                    </div>
                    <h2 className="text-xl font-bold text-white">
                        {verified ? "Xác thực thành công!" : "Xác nhận email"}
                    </h2>
                    <p className="text-indigo-100 text-sm mt-1">
                        Mã OTP đã được gửi tới<br />
                        <strong className="text-white">{email}</strong>
                    </p>
                    {/* Wave decor */}
                    <div className="absolute -bottom-1 left-0 right-0">
                        <svg viewBox="0 0 400 20" className="w-full fill-white">
                            <path d="M0,10 C100,20 300,0 400,10 L400,20 L0,20 Z" />
                        </svg>
                    </div>
                </div>

                {/* Body */}
                <div className="px-8 py-7">
                    {verified ? (
                        <div className="text-center py-4">
                            <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-3">
                                <CheckCircle2 size={36} className="text-green-500" />
                            </div>
                            <p className="text-gray-600 text-sm">Đang chuyển hướng đến đăng nhập...</p>
                        </div>
                    ) : (
                        <>
                            <p className="text-sm text-gray-500 text-center mb-6">
                                Nhập mã <strong>6 chữ số</strong> trong email của bạn
                            </p>

                            {/* 6-digit OTP input boxes */}
                            <div className="flex gap-2 justify-center mb-6" onPaste={handlePaste}>
                                {digits.map((d, i) => (
                                    <input
                                        key={i}
                                        ref={(el) => { inputRefs.current[i] = el; }}
                                        type="text"
                                        inputMode="numeric"
                                        maxLength={1}
                                        value={d}
                                        onChange={(e) => handleDigitChange(i, e.target.value)}
                                        onKeyDown={(e) => handleKeyDown(i, e)}
                                        className={`w-11 h-14 text-center text-xl font-bold rounded-xl border-2 outline-none transition-all
                                            ${d ? "border-indigo-500 bg-indigo-50 text-indigo-700" : "border-gray-200 bg-gray-50 text-gray-800"}
                                            focus:border-indigo-500 focus:bg-indigo-50`}
                                    />
                                ))}
                            </div>

                            {/* Actions */}
                            <div className="flex flex-col gap-3">
                                <button
                                    onClick={handleVerify}
                                    disabled={loading || code.length < 6}
                                    className="w-full py-3 rounded-xl bg-indigo-600 text-white font-bold text-sm hover:bg-indigo-700 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-100"
                                >
                                    {loading
                                        ? (
                                            <span className="flex items-center justify-center gap-2">
                                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                Đang xác thực...
                                            </span>
                                        )
                                        : "Xác nhận"
                                    }
                                </button>

                                <button
                                    onClick={handleResend}
                                    disabled={countdown > 0 || resending}
                                    className="flex items-center justify-center gap-1.5 text-sm font-medium text-gray-500 hover:text-indigo-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                                >
                                    <RefreshCw size={14} className={resending ? "animate-spin" : ""} />
                                    {countdown > 0
                                        ? `Gửi lại sau ${countdown}s`
                                        : resending ? "Đang gửi..." : "Gửi lại mã OTP"
                                    }
                                </button>

                                <button
                                    onClick={onClose}
                                    disabled={loading}
                                    className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    Đóng
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
