import { apiClient, buildQuery } from "@/app/lib/apiClient";

export interface Notification {
    id: number;
    recipientId: number;
    senderId: number;
    type: 'LIKE_POST' | 'LIKE_COMMENT' | 'COMMENT_POST' | 'FOLLOW';
    targetId: number;
    content: string;
    isRead: boolean;
    createdAt: string;
    sender: {
        id: number;
        name: string;
        avatar?: string;
    };
}

export interface PaginatedNotifications {
    data: Notification[];
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

export async function getNotifications(page = 1, limit = 20): Promise<PaginatedNotifications> {
    const qs = buildQuery({ page, limit });
    return apiClient<PaginatedNotifications>(`/notifications${qs}`);
}

export async function getUnreadCount(): Promise<{ count: number }> {
    return apiClient<{ count: number }>("/notifications/unread-count");
}

export async function markAsRead(id: number): Promise<{ success: boolean }> {
    return apiClient<{ success: boolean }>(`/notifications/${id}/read`, {
        method: "PUT",
    });
}

export async function markAllAsRead(): Promise<{ success: boolean }> {
    return apiClient<{ success: boolean }>("/notifications/read-all", {
        method: "PUT",
    });
}
