/**
 * User Service
 * Profile, cập nhật thông tin user
 */
import { apiClient } from "@/app/lib/apiClient";

// ─── Types ────────────────────────────────────────────────────────────────────
export interface UserProfile {
    id: number;
    avatar?: string;
    phone?: string;
    address?: string;
    gender?: string;
    birthday?: string;
    user: {
        id: number;
        name: string;
        email: string;
        role: string;
    };
}

export interface UpdateProfilePayload {
    name?: string;
    avatar?: string;
    phone?: string;
    address?: string;
    gender?: string;
    birthday?: string;
}

// ─── User APIs ────────────────────────────────────────────────────────────────

/** Lấy profile của user đang đăng nhập */
export async function getProfile(): Promise<UserProfile> {
    return apiClient<UserProfile>("/users/profile");
}

/** Cập nhật thông tin user */
export async function updateProfile(
    payload: UpdateProfilePayload
): Promise<UserProfile> {
    return apiClient<UserProfile>("/users", {
        method: "PUT",
        body: JSON.stringify(payload),
    });
}
