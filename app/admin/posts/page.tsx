"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    Search,
    Filter,
    Edit2,
    Trash2,
    ExternalLink,
    Plus,
    ChevronLeft,
    ChevronRight,
    BookOpen,
    Loader2,
} from "lucide-react";
import Link from "next/link";
import { getBlogs, deleteBlog, Blog } from "@/app/services/blogService";
import { useToast } from "@/components/toast";

const STATUS_STYLE: Record<string, string> = {
    ACTIVE: "bg-green-100 text-green-700",
    INACTIVE: "bg-orange-100 text-orange-700",
    DELETE: "bg-red-100 text-red-500",
};

const STATUS_LABEL: Record<string, string> = {
    ACTIVE: "Đã đăng",
    INACTIVE: "Nháp",
    DELETE: "Đã xoá",
};

export default function AdminPostsPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [page, setPage] = useState(1);
    const toast = useToast();
    const queryClient = useQueryClient();
    const LIMIT = 10;

    const { data, isLoading, isError } = useQuery({
        queryKey: ["admin-blogs", page, searchQuery],
        queryFn: () => getBlogs({ page, limit: LIMIT, search: searchQuery || undefined }),
        placeholderData: (prev) => prev,
    });

    const deleteM = useMutation({
        mutationFn: deleteBlog,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-blogs"] });
            toast.success("Đã xoá bài viết thành công!");
        },
        onError: () => toast.error("Không thể xoá bài viết, vui lòng thử lại."),
    });

    const posts = data?.data ?? [];
    const meta = data?.meta;
    const total = meta?.total ?? 0;
    const totalPages = meta?.totalPages ?? 1;

    const handleDelete = (post: Blog) => {
        if (!confirm(`Xoá bài viết "${post.title}"?`)) return;
        const id = toast.loading("Đang xoá bài viết...");
        deleteM.mutate(post.id, {
            onSettled: () => toast.dismiss(id),
        });
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Quản lý bài viết</h1>
                    <p className="text-gray-500 font-medium mt-1 text-sm">
                        {total > 0 ? `${total} bài viết trong hệ thống` : "Chỉnh sửa, xuất bản hoặc xóa các bài viết."}
                    </p>
                </div>
                <Link
                    href="/blogs/create"
                    className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold text-sm hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 active:scale-95"
                >
                    <Plus size={18} />
                    Tạo bài mới
                </Link>
            </div>

            {/* Toolbar */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 flex items-center gap-4 bg-white px-6 py-4 rounded-3xl border border-gray-100 shadow-sm">
                    <Search size={20} className="text-gray-400" />
                    <input
                        type="text"
                        placeholder="Tìm theo tiêu đề hoặc category..."
                        className="bg-transparent border-none outline-none text-sm w-full font-medium"
                        value={searchQuery}
                        onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
                    />
                    {searchQuery && (
                        <button onClick={() => setSearchQuery("")} className="text-xs text-gray-400 hover:text-gray-600">✕</button>
                    )}
                </div>
                <button className="flex items-center gap-2 bg-white px-6 py-4 rounded-3xl border border-gray-100 shadow-sm font-bold text-sm text-gray-700 hover:bg-gray-50 transition-all">
                    <Filter size={18} />
                    Bộ lọc
                </button>
            </div>

            {/* Table */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-100">
                                <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-wider">Bài viết</th>
                                <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-wider text-center">Trạng thái</th>
                                <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-wider text-center">Tác giả</th>
                                <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {/* Loading */}
                            {isLoading && Array.from({ length: 5 }).map((_, i) => (
                                <tr key={i}>
                                    <td className="px-8 py-5" colSpan={4}>
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-xl bg-gray-100 animate-pulse" />
                                            <div className="flex-1 space-y-2">
                                                <div className="h-3 bg-gray-100 rounded animate-pulse w-3/4" />
                                                <div className="h-2 bg-gray-100 rounded animate-pulse w-1/3" />
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            ))}

                            {/* Error */}
                            {isError && (
                                <tr>
                                    <td colSpan={4} className="px-8 py-16 text-center text-red-500 text-sm font-medium">
                                        Không thể tải dữ liệu. Vui lòng thử lại.
                                    </td>
                                </tr>
                            )}

                            {/* Empty */}
                            {!isLoading && !isError && posts.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="px-8 py-16 text-center">
                                        <BookOpen className="mx-auto text-gray-200 mb-3" size={40} />
                                        <p className="text-gray-400 text-sm font-medium">Không có bài viết nào</p>
                                    </td>
                                </tr>
                            )}

                            {/* Data rows */}
                            {posts.map((post) => (
                                <tr key={post.id} className="hover:bg-gray-50/30 transition-colors group">
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-xl overflow-hidden border border-gray-100 shrink-0 bg-gray-50">
                                                {post.thumbnail ? (
                                                    <img src={post.thumbnail} alt={post.title} className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center bg-blue-50">
                                                        <BookOpen size={18} className="text-blue-200" />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="max-w-md">
                                                <p className="text-sm font-bold text-gray-900 truncate group-hover:text-blue-600 transition-colors">
                                                    {post.title}
                                                </p>
                                                <div className="flex items-center gap-2 mt-1">
                                                    {post.category && (
                                                        <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded uppercase tracking-wider">
                                                            {post.category.name}
                                                        </span>
                                                    )}
                                                    {post.createdAt && (
                                                        <span className="text-[10px] text-gray-400 italic">
                                                            {new Date(post.createdAt).toLocaleDateString("vi-VN")}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5 text-center">
                                        <span className={`text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider inline-block min-w-20 ${STATUS_STYLE[post.status] ?? "bg-gray-100 text-gray-500"}`}>
                                            {STATUS_LABEL[post.status] ?? post.status}
                                        </span>
                                    </td>
                                    <td className="px-8 py-5 text-center">
                                        <span className="text-xs text-gray-500 font-medium">
                                            {post.createdBy?.name ?? "—"}
                                        </span>
                                    </td>
                                    <td className="px-8 py-5 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Link
                                                href={`/admin/posts/${post.id}/edit`}
                                                className="p-2 bg-white border border-gray-100 rounded-xl text-gray-400 hover:text-blue-600 hover:border-blue-100 transition-all shadow-sm"
                                            >
                                                <Edit2 size={16} />
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(post)}
                                                disabled={deleteM.isPending}
                                                className="p-2 bg-white border border-gray-100 rounded-xl text-gray-400 hover:text-red-500 hover:border-red-100 transition-all shadow-sm disabled:opacity-50"
                                            >
                                                {deleteM.isPending ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                                            </button>
                                            <Link
                                                href={`/blogs/${post.id}`}
                                                target="_blank"
                                                className="p-2 bg-white border border-gray-100 rounded-xl text-gray-400 hover:text-gray-900 hover:border-gray-300 transition-all shadow-sm"
                                            >
                                                <ExternalLink size={16} />
                                            </Link>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="p-8 border-t border-gray-50 flex flex-col sm:flex-row justify-between items-center gap-4 bg-gray-50/30">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                        Hiển thị {posts.length} / {total} bài viết
                    </p>
                    <div className="flex items-center gap-2">
                        <button
                            disabled={page <= 1}
                            onClick={() => setPage((p) => p - 1)}
                            className="p-2 rounded-xl text-gray-400 hover:bg-white hover:text-gray-900 border border-transparent hover:border-gray-100 transition-all disabled:opacity-30"
                        >
                            <ChevronLeft size={20} />
                        </button>
                        {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map((p) => (
                            <button
                                key={p}
                                onClick={() => setPage(p)}
                                className={`w-10 h-10 rounded-xl text-sm font-bold transition-all ${page === p
                                    ? "bg-blue-600 text-white shadow-lg shadow-blue-100"
                                    : "text-gray-500 hover:bg-white hover:text-blue-600 border border-transparent hover:border-gray-100"
                                    }`}
                            >
                                {p}
                            </button>
                        ))}
                        <button
                            disabled={page >= totalPages}
                            onClick={() => setPage((p) => p + 1)}
                            className="p-2 rounded-xl text-gray-400 hover:bg-white hover:text-gray-900 border border-transparent hover:border-gray-100 transition-all disabled:opacity-30"
                        >
                            <ChevronRight size={20} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
