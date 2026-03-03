/**
 * Comment Service
 * Lấy và tạo comment cho bài viết
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
    user: CommentUser;
    postId: number;
    parentId?: number;
    totalLike?: number;
    createdAt: string;
    children?: Comment[];
}

export interface CreateCommentPayload {
    postId: number;
    parentId?: number;
    content: string;
}

// ─── Comment APIs ─────────────────────────────────────────────────────────────

/** Lấy danh sách comment theo bài viết */
export async function getCommentsByPost(postId: number | string): Promise<Comment[]> {
    return apiClient<Comment[]>(`/comments/post${buildQuery({ postId })}`);
}

/** Tạo comment mới */
export async function createComment(payload: CreateCommentPayload): Promise<Comment> {
    return apiClient<Comment>("/comments", {
        method: "POST",
        body: JSON.stringify(payload),
    });
}

/** Like comment */
export async function likeComment(commentId: number): Promise<void> {
    return apiClient<void>(`/comments/${commentId}/like`, { method: "POST" });
}
