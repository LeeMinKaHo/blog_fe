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

export type BlogStatus = "Pushlish" | "Draft" | "Delete";

export interface Blog {
    id: number;
    title: string;
    descrtiption?: string; // typo giữ nguyên theo BE
    description?: string;
    content?: string;
    thumbnail?: string;
    status: BlogStatus;
    views?: number;
    totalLikes?: number;
    category?: Category;
    author?: BlogAuthor;
    createdBy?: BlogAuthor;
    updatedBy?: BlogAuthor;
    createdAt?: string;
    updatedAt?: string;
    authorId?: number;
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
    description?: string;
    descrtiption?: string;
    thumbnail?: string;
    categoryId?: number;
    status?: BlogStatus;
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

/** Lưu / bỏ lưu bài viết (toggle: POST sẽ add nếu chưa có, xóa nếu đã có) */
export async function toggleSaveBlog(postId: number): Promise<{ saved: boolean; message: string }> {
    return apiClient<{ saved: boolean; message: string }>("/blogs/saved-blog", {
        method: "POST",
        body: JSON.stringify({ postId }),
    });
}

/** Xóa bài viết khỏi danh sách đã lưu */
export async function removeSavedBlog(postId: number): Promise<void> {
    return apiClient<void>(`/blogs/saved-blog/${postId}`, {
        method: "DELETE",
    });
}

/** Lấy danh sách bài viết đã lưu */
export async function getSavedBlogs(page = 1, limit = 10): Promise<PaginatedBlogs> {
    return apiClient<PaginatedBlogs>(`/blogs/saved-blogs${buildQuery({ page, limit })}`);
}

/** Tăng lượt xem bài viết (gọi khi user cuộn qua 50% nội dung) */
export async function incrementBlogViews(id: number | string): Promise<{ views: number }> {
    return apiClient<{ views: number }>(`/blogs/${id}/view`, {
        method: "POST",
    });
}


/** Like / Unlike bài viết */
export async function toggleLikeBlog(postId: number): Promise<{ liked: boolean; totalLikes: number }> {
    return apiClient<{ liked: boolean; totalLikes: number }>("/blogs/like-blog", {
        method: "POST",
        body: JSON.stringify({ postId }),
    });
}


/** Lấy danh sách bài viết của chính user đang đăng nhập */
export async function getMyBlogs(params?: {
    page?: number;
    limit?: number;
}): Promise<PaginatedBlogs> {
    const qs = buildQuery({
        page: params?.page ?? 1,
        limit: params?.limit ?? 10,
    });
    return apiClient<PaginatedBlogs>(`/blogs/my-blogs${qs}`);
}

/** Lấy danh sách bài viết đang trending (nhiều lượt xem nhất trong tuần) */
export async function getTrendingBlogs(limit = 5): Promise<Blog[]> {
    return apiClient<Blog[]>(`/blogs/trending${buildQuery({ limit })}`);
}
