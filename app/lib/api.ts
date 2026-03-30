/**
 * ╔══════════════════════════════════════════════════════════╗
 * ║  app/lib/api.ts — Compatibility layer                    ║
 * ║                                                          ║
 * ║  File này giữ lại các export cũ để không break code     ║
 * ║  hiện tại. Các module mới nên import từ services/:       ║
 * ║    - app/services/blogService.ts                         ║
 * ║    - app/services/authService.ts                         ║
 * ║    - app/services/userService.ts                         ║
 * ║    - app/services/commentService.ts                      ║
 * ╚══════════════════════════════════════════════════════════╝
 */

// Re-export ApiError từ apiClient để code cũ không bị break
export { ApiError } from "@/app/lib/apiClient";
export { apiClient as apiFetch, apiClient as api } from "@/app/lib/apiClient";

// Re-export types từ services
export type { Blog as Post, PaginatedBlogs, PaginationMeta } from "@/app/services/blogService";
export type { Comment, CreateCommentPayload } from "@/app/services/commentService";

// ─── Wrappers tương thích ngược ───────────────────────────────────────────────

import { getBlogs } from "@/app/services/blogService";
import { getCommentsByPost, createComment as _createComment } from "@/app/services/commentService";
import type { CreateCommentPayload } from "@/app/services/commentService";

/** @deprecated Dùng getBlogs() từ blogService thay thế */
export async function getPosts(page = 1, limit = 10, search?: string) {
   try {
      const res = await getBlogs({ page, limit, search });
      return {
         posts: res.data,
         meta: res.meta,
      };
   } catch (err) {
      console.error("[getPosts] Error:", err);
      return { posts: [], meta: { total: 0, page, limit, totalPages: 0 } };
   }
}

/** @deprecated Dùng getBlogById() từ blogService thay thế */
export async function getPostById(id: string) {
   const { getBlogById } = await import("@/app/services/blogService");
   return getBlogById(id);
}

/** @deprecated Dùng getProfile() từ userService thay thế */
export async function getProfile() {
   const { getProfile: _getProfile } = await import("@/app/services/userService");
   return _getProfile();
}

/** @deprecated Dùng getCommentsByPost() từ commentService thay thế */
export async function getCommentsByPostId(postId: string | number) {
   return getCommentsByPost(postId);
}

/** @deprecated Dùng createComment() từ commentService thay thế */
export async function createComment(payload: CreateCommentPayload) {
   return _createComment(payload);
}

// ─── ApiResponse interface (tương thích ngược) ────────────────────────────────
export interface ApiResponse<T> {
   statusCode: number;
   message: string;
   data: T;
}
