/**
 * Auth Service
 * Đăng nhập, đăng xuất, lấy thông tin user hiện tại
 */
import { apiClient } from "@/app/lib/apiClient";

// ─── Types ────────────────────────────────────────────────────────────────────
export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    role: "Admin" | "User" | "Moderator";
}

export interface RegisterPayload {
    name: string;
    email: string;
    password: string;
}

export interface LoginPayload {
    email: string;
    password: string;
}

export interface LoginResponse {
    message: string;
    data: User;
}

// ─── Auth APIs ────────────────────────────────────────────────────────────────

/** Đăng nhập */
export async function login(payload: LoginPayload): Promise<LoginResponse> {
    return apiClient<LoginResponse>("/auth/sign-in", {
        method: "POST",
        body: JSON.stringify(payload),
    });
}

/** Đăng ký tài khoản */
export async function register(payload: RegisterPayload): Promise<{ message: string; email: string }> {
    return apiClient<{ message: string; email: string }>("/auth/sign-up", {
        method: "POST",
        body: JSON.stringify(payload),
    });
}

/** Xác nhận mã OTP sau khi đăng ký */
export async function verifyCode(email: string, code: string): Promise<{ message: string }> {
    return apiClient<{ message: string }>("/auth/verify-email", {
        method: "POST",
        body: JSON.stringify({ email, code }),
    });
}

/** Gửi lại mã OTP */
export async function resendVerification(email: string): Promise<{ message: string }> {
    return apiClient<{ message: string }>("/auth/resend-verification", {
        method: "POST",
        body: JSON.stringify({ email }),
    });
}

/** Lấy thông tin user đang đăng nhập (dùng cookie httpOnly) */
export async function getMe(): Promise<User> {
    return apiClient<User>("/auth/me");
}

/** Đăng xuất */
export async function logout(): Promise<void> {
    return apiClient<void>("/auth/logout", { method: "POST" });
}
