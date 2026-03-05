/**
 * Comment Service — nâng cấp
 */
import { apiClient, buildQuery } from "@/app/lib/apiClient";

// ─── Types ────────────────────────────────────────────────────────────────────
export interface CommentUser {
    id: number;
    name: string;
    avatar?: string;
}

export interface Comment {
    id: number;
    content: string;
    userId: number;
    postId: number;
    parentId?: number | null;
    totalLike: number;
    replyCount?: number;   // backend trả về từ loadRelationCountAndMap
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    user: CommentUser;
    children?: Comment[];
}

export interface CreateCommentPayload {
    postId: number;
    parentId?: number;
    content: string;
}

// ─── APIs ─────────────────────────────────────────────────────────────────────

/** Lấy root comments của bài viết */
export async function getCommentsByPost(postId: number | string): Promise<Comment[]> {
    return apiClient<Comment[]>(`/comments/post${buildQuery({ postId })}`);
}

/** Lấy replies của 1 comment cha */
export async function getReplies(commentId: number): Promise<Comment[]> {
    return apiClient<Comment[]>(`/comments/${commentId}/replies`);
}

/** Tạo comment / reply */
export async function createComment(payload: CreateCommentPayload): Promise<Comment> {
    return apiClient<Comment>("/comments", {
        method: "POST",
        body: JSON.stringify(payload),
    });
}

/** Cập nhật nội dung comment */
export async function updateComment(commentId: number, content: string): Promise<Comment> {
    return apiClient<Comment>(`/comments/${commentId}`, {
        method: "PATCH",
        body: JSON.stringify({ content }),
    });
}

/** Xóa comment (soft delete) */
export async function deleteComment(commentId: number): Promise<void> {
    return apiClient<void>(`/comments/${commentId}`, { method: "DELETE" });
}

/** Like / Unlike comment */
export async function toggleLikeComment(commentId: number): Promise<{ liked: boolean; totalLike: number }> {
    return apiClient<{ liked: boolean; totalLike: number }>(`/comments/${commentId}/like`, {
        method: "POST",
    });
}
