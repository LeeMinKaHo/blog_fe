import { apiClient } from "@/app/lib/apiClient";

// ─── Types ────────────────────────────────────────────────────────────────────
export interface AdminStats {
    blogs: {
        total: number;
        published: number;
        drafts: number;
        totalViews: number;
        recentWeek: number;
    };
    users: {
        total: number;
        active: number;
        unverified: number;
        admins: number;
        recentWeek: number;
    };
    comments: {
        total: number;
    };
    charts: {
        userGrowth: { date: string; count: number }[];
        blogGrowth: { date: string; count: number }[];
        categoryStats: { name: string; value: number }[];
        topBlogs: { title: string; views: number }[];
    };
}

export interface AdminBlog {
    id: number;
    title: string;
    status: "Pushlish" | "Draft" | "Delete";
    views: number;
    createdAt: string;
    updatedAt: string;
    thumbnail?: string;
    description?: string;
    category?: { id: number; name: string };
    createdBy?: { id: number; name: string; email: string };
}

export interface AdminUser {
    id: number;
    name: string;
    email: string;
    role: "User" | "Admin" | "Moderator";
    isActive: boolean;
    isVerified: boolean;
    createdAt: string;
    userAdvance?: { avatar?: string };
}

export interface PaginatedResult<T> {
    items: T[];
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

// ─── Admin APIs ───────────────────────────────────────────────────────────────

export function getAdminStats(): Promise<AdminStats> {
    return apiClient<AdminStats>("/admin/stats");
}

export function getAdminBlogs(params: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
}): Promise<PaginatedResult<AdminBlog>> {
    const q = new URLSearchParams();
    if (params.page) q.set("page", String(params.page));
    if (params.limit) q.set("limit", String(params.limit));
    if (params.search) q.set("search", params.search);
    if (params.status) q.set("status", params.status);
    return apiClient<PaginatedResult<AdminBlog>>(`/admin/blogs?${q}`);
}

export function updateBlogStatus(id: number, status: string): Promise<AdminBlog> {
    return apiClient<AdminBlog>(`/admin/blogs/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
    });
}

export function deleteBlogAdmin(id: number): Promise<{ message: string }> {
    return apiClient<{ message: string }>(`/admin/blogs/${id}`, {
        method: "DELETE",
    });
}

export function getAdminUsers(params: {
    page?: number;
    limit?: number;
    search?: string;
    role?: string;
}): Promise<PaginatedResult<AdminUser>> {
    const q = new URLSearchParams();
    if (params.page) q.set("page", String(params.page));
    if (params.limit) q.set("limit", String(params.limit));
    if (params.search) q.set("search", params.search);
    if (params.role) q.set("role", params.role);
    return apiClient<PaginatedResult<AdminUser>>(`/admin/users?${q}`);
}

export function updateUserRole(id: number, role: string): Promise<AdminUser> {
    return apiClient<AdminUser>(`/admin/users/${id}/role`, {
        method: "PATCH",
        body: JSON.stringify({ role }),
    });
}

export function toggleBanUser(id: number): Promise<{ id: number; isActive: boolean; message: string }> {
    return apiClient<{ id: number; isActive: boolean; message: string }>(`/admin/users/${id}/ban`, {
        method: "PATCH",
    });
}
