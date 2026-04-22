"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useToast } from "@/components/toast";
import { login } from "@/app/services/authService";
import { useQueryClient } from "@tanstack/react-query";

/**
 * Component con dùng để đọc searchParams (bắt buộc bọc trong Suspense ở App Router)
 */
function LoginContent() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionExpired, setSessionExpired] = useState(false);
  const toast = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();

  // ✅ Hiển thị banner "Phiên đăng nhập đã hết hạn" nếu bị redirect tự động
  useEffect(() => {
    if (searchParams.get("reason") === "session_expired") {
      setSessionExpired(true);
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setLoading(true);
    try {
      const res = await login({ email, password });

      // ✅ Cập nhật cache ngay lập tức để Header nhận data mới mà không cần fetch lại
      queryClient.setQueryData(["me"], res);

      toast.success("Đăng nhập thành công!");
      if (res.role === "Admin" || res.role === "Moderator") {
        router.push("/admin");
      } else {
        router.push("/");
      }
      router.refresh(); 
    } catch (err: any) {
      toast.error(err?.message ?? "Đăng nhập thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100">
      <div className="w-full max-w-md space-y-4 px-4">
        {/* ── Banner phiên hết hạn ─────────────────────────────── */}
        {sessionExpired && (
          <div className="flex items-start gap-3 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 shadow-md animate-in fade-in slide-in-from-top-2">
            <span className="mt-0.5 text-amber-500 text-lg">⚠️</span>
            <div className="flex-1">
              <p className="text-sm font-semibold text-amber-800">
                Phiên đăng nhập đã hết hạn
              </p>
              <p className="text-xs text-amber-700 mt-0.5">
                Vui lòng đăng nhập lại để tiếp tục sử dụng.
              </p>
            </div>
            <button
              onClick={() => setSessionExpired(false)}
              className="text-amber-400 hover:text-amber-600 text-xl leading-none"
              aria-label="Đóng"
            >
              ×
            </button>
          </div>
        )}
        {/* ───────────────────────────────────────────────────────── */}

        <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
          <h2 className="text-2xl font-bold text-gray-800 text-center">Đăng nhập</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-xl border border-gray-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full rounded-xl border border-gray-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 active:scale-[0.98] transition disabled:opacity-50"
            >
              {loading ? "Đang đăng nhập..." : "Đăng nhập"}
            </button>
          </form>
          <p className="text-center text-sm text-gray-600">
            Chưa có tài khoản?{" "}
            <a href="/register" className="text-indigo-600 hover:underline font-medium">
              Đăng ký ngay
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-12 h-12 bg-indigo-200 rounded-full"></div>
          <div className="h-4 w-24 bg-gray-200 rounded"></div>
        </div>
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}
