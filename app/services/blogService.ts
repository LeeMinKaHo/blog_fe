/**
 * Blog Service
 * Tất cả API liên quan đến bài viết (CRUD, search, interaction)
 */
import { apiClient, buildQuery } from "@/app/lib/apiClient";

// ─── Types ────────────────────────────────────────────────────────────────────
export interface Category {
    id: number;
    name: string;
}

export interface BlogAuthor {
    id: number;
    name: string;
    avatar?: string;
}

export interface Blog {
    id: number;
    title: string;
    descrtiption?: string; // typo giữ nguyên theo BE
    thumbnail?: string;
    status: "ACTIVE" | "INACTIVE" | "DELETE";
    category?: Category;
    createdBy?: BlogAuthor;
    updatedBy?: BlogAuthor;
    createdAt?: string;
    updatedAt?: string;
    viewCount?: number;
}

export interface PaginationMeta {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface PaginatedBlogs {
    data: Blog[];
    meta: PaginationMeta;
}

export interface CreateBlogPayload {
    title: string;
    descrtiption: string;
    thumbnail?: string;
    categoryId: number;
}

// ─── Queries ──────────────────────────────────────────────────────────────────

/** Lấy danh sách bài viết, hỗ trợ phân trang, tìm kiếm và lọc category */
export async function getBlogs(params?: {
    page?: number;
    limit?: number;
    search?: string;
    categoryId?: number;
}): Promise<PaginatedBlogs> {
    const qs = buildQuery({
        page: params?.page ?? 1,
        limit: params?.limit ?? 10,
        search: params?.search,
        categoryId: params?.categoryId,
    });
    return apiClient<PaginatedBlogs>(`/blogs${qs}`);
}

/** Lấy toàn bộ danh sách categories để dùng cho filter */
export async function getCategories(): Promise<Category[]> {
    const res = await apiClient<Category[] | { data: Category[] }>("/blogs/categories");
    return Array.isArray(res) ? res : (res as { data: Category[] }).data ?? [];
}

/** Lấy chi tiết một bài viết theo id */
export async function getBlogById(id: number | string): Promise<Blog> {
    return apiClient<Blog>(`/blogs/${id}`);
}

// ─── Mutations ────────────────────────────────────────────────────────────────

/** Tạo bài viết mới (cần role ADMIN hoặc MODERATOR) */
export async function createBlog(payload: CreateBlogPayload): Promise<Blog> {
    return apiClient<Blog>("/blogs", {
        method: "POST",
        body: JSON.stringify(payload),
    });
}

/** Cập nhật bài viết */
export async function updateBlog(
    id: number | string,
    payload: Partial<CreateBlogPayload>
): Promise<Blog> {
    return apiClient<Blog>(`/blogs/${id}`, {
        method: "PUT",
        body: JSON.stringify(payload),
    });
}

/** Xoá bài viết (soft delete, cần role ADMIN) */
export async function deleteBlog(id: number | string): Promise<void> {
    return apiClient<void>(`/blogs/${id}`, { method: "DELETE" });
}

// ─── Interactions ─────────────────────────────────────────────────────────────

/** Đánh dấu đã xem bài viết */
export async function markBlogSeen(postId: number): Promise<void> {
    return apiClient<void>("/blogs/seen-blog", {
        method: "POST",
        body: JSON.stringify({ postId }),
    });
}

/** Lấy danh sách bài viết đã xem */
export async function getSeenBlogs(page = 1, limit = 10): Promise<PaginatedBlogs> {
    return apiClient<PaginatedBlogs>(`/blogs/seen-blogs${buildQuery({ page, limit })}`);
}

/** Lưu / bỏ lưu bài viết */
export async function toggleSaveBlog(postId: number): Promise<void> {
    return apiClient<void>("/blogs/saved-blog", {
        method: "POST",
        body: JSON.stringify({ postId }),
    });
}

/** Lấy danh sách bài viết đã lưu */
export async function getSavedBlogs(page = 1, limit = 10): Promise<PaginatedBlogs> {
    return apiClient<PaginatedBlogs>(`/blogs/saved-blogs${buildQuery({ page, limit })}`);
}
