/**
 * User Service
 * Profile, cập nhật thông tin user, thống kê
 */
import { apiClient } from "@/app/lib/apiClient";

// ─── Types ────────────────────────────────────────────────────────────────────
export interface UserProfile {
    id: number;
    avatar?: string | null;
    phone?: string | null;
    address?: string | null;
    gender?: string | null;
    birthday?: string | null;
    user: {
        id: number;
        name: string;
        email: string;
        role: string;
        createdAt?: string;
    };
}

export interface UserStats {
    totalPosts: number;
    totalViews: number;
    totalComments: number;
    followerCount: number;
    followingCount: number;
    joinedAt: string | null;
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

/** Lấy thống kê hoạt động của user */
export async function getUserStats(): Promise<UserStats> {
    return apiClient<UserStats>("/users/stats");
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

/** Toggle follow/unfollow một user */
export async function toggleFollow(userId: number): Promise<{ followed: boolean; message: string }> {
    return apiClient<{ followed: boolean; message: string }>(`/users/${userId}/follow`, {
        method: "POST",
    });
}

/** Lấy danh sách người đang theo dõi user này */
export async function getFollowers(userId: number): Promise<any[]> {
    return apiClient<any[]>(`/users/${userId}/followers`);
}

/** Lấy danh sách người mà user này đang theo dõi */
export async function getFollowing(userId: number): Promise<any[]> {
    return apiClient<any[]>(`/users/${userId}/following`);
}

/** Kiểm tra mình đã follow user này chưa */
export async function checkIsFollowing(userId: number): Promise<boolean> {
    return apiClient<boolean>(`/users/${userId}/is-following`);
}
