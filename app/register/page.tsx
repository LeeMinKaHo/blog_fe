"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/toast";
import { register } from "@/app/services/authService";
import VerificationModal from "@/components/VerificationModal";

export default function RegisterPage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [registeredEmail, setRegisteredEmail] = useState("");
    const toast = useToast();
    const router = useRouter();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !email || !password) return;
        setLoading(true);
        try {
            const res = await register({ name, email, password });
            toast.success(res.message ?? "Đăng ký thành công! Vui lòng nhập mã xác nhận.");
            setRegisteredEmail(email);
            setShowModal(true);
        } catch (err: any) {
            toast.error(err?.message ?? "Đăng ký thất bại");
        } finally {
            setLoading(false);
        }
    };

    const handleVerificationSuccess = () => {
        toast.success("Tài khoản đã được kích hoạt!");
        setShowModal(false);
        router.push("/login");
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 space-y-6">
                <h2 className="text-2xl font-bold text-gray-800 text-center">Đăng ký tài khoản</h2>
                <form onSubmit={handleRegister} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Họ và tên</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className="w-full rounded-xl border border-gray-300 px-4 py-2.5 focus:outline-none focus:border-indigo-500 transition"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full rounded-xl border border-gray-300 px-4 py-2.5 focus:outline-none focus:border-indigo-500 transition"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full rounded-xl border border-gray-300 px-4 py-2.5 focus:outline-none focus:border-indigo-500 transition"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-2.5 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition disabled:opacity-50"
                    >
                        {loading ? "Đang đăng ký..." : "Đăng ký"}
                    </button>
                </form>
                <p className="text-center text-sm text-gray-600">
                    Đã có tài khoản?{' '}
                    <a href="/login" className="text-indigo-600 hover:underline">
                        Đăng nhập ngay
                    </a>
                </p>
            </div>

            {/* OTP verification modal */}
            <VerificationModal
                email={registeredEmail}
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                onSuccess={handleVerificationSuccess}
            />
        </div>
    );
}
