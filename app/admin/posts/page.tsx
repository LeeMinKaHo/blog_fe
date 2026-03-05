"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    Search, Filter, Eye, Pencil, Trash2, Check, Clock, X,
    ChevronLeft, ChevronRight, Loader2, ExternalLink
} from "lucide-react";
import {
    getAdminBlogs, updateBlogStatus, deleteBlogAdmin, AdminBlog
} from "@/app/services/adminService";
import Link from "next/link";

const STATUS_OPTIONS = [
    { value: "all", label: "Tất cả" },
    { value: "Pushlish", label: "Đã xuất bản" },
    { value: "Draft", label: "Bản nháp" },
];

function statusConfig(s: string) {
    switch (s) {
        case "Pushlish": return { label: "Xuất bản", cls: "bg-green-100 text-green-700" };
        case "Draft": return { label: "Bản nháp", cls: "bg-gray-100 text-gray-600" };
        default: return { label: s, cls: "bg-orange-100 text-orange-700" };
    }
}

function timeAgo(dateStr: string) {
    const diff = Date.now() - new Date(dateStr).getTime();
    const h = Math.floor(diff / 3600000);
    if (h < 1) return `${Math.floor(diff / 60000)} phút`;
    if (h < 24) return `${h} giờ`;
    return `${Math.floor(h / 24)} ngày trước`;
}

export default function AdminPostsPage() {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [searchInput, setSearchInput] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [confirmDelete, setConfirmDelete] = useState<number | null>(null);
    const qc = useQueryClient();
    const LIMIT = 10;

    const { data, isLoading } = useQuery({
        queryKey: ["adminBlogs", { page, search, status: statusFilter }],
        queryFn: () => getAdminBlogs({ page, limit: LIMIT, search: search || undefined, status: statusFilter }),
    });

    const { mutate: changeStatus, isPending: changingStatus } = useMutation({
        mutationFn: ({ id, status }: { id: number; status: string }) => updateBlogStatus(id, status),
        onSuccess: () => qc.invalidateQueries({ queryKey: ["adminBlogs"] }),
    });

    const { mutate: doDelete, isPending: deleting } = useMutation({
        mutationFn: (id: number) => deleteBlogAdmin(id),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["adminBlogs"] });
            qc.invalidateQueries({ queryKey: ["adminStats"] });
            setConfirmDelete(null);
        },
    });

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setSearch(searchInput);
        setPage(1);
    };

    const meta = data?.meta;
    const posts = data?.items ?? [];

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-extrabold text-gray-900">Quản lý bài viết</h1>
                    <p className="text-sm text-gray-400 mt-0.5">
                        {meta ? `${meta.total} bài viết tổng cộng` : "Đang tải..."}
                    </p>
                </div>
                <Link
                    href="/blogs/create"
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-blue-700 transition-all active:scale-95"
                >
                    Viết bài mới
                </Link>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-wrap gap-3 items-center">
                <form onSubmit={handleSearch} className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2 border border-gray-100 flex-1 min-w-64">
                    <Search size={16} className="text-gray-400 shrink-0" />
                    <input
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        placeholder="Tìm kiếm bài viết..."
                        className="bg-transparent text-sm outline-none flex-1 font-medium"
                    />
                </form>
                <div className="flex items-center gap-2">
                    <Filter size={16} className="text-gray-400" />
                    {STATUS_OPTIONS.map((opt) => (
                        <button
                            key={opt.value}
                            onClick={() => { setStatusFilter(opt.value); setPage(1); }}
                            className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-colors ${statusFilter === opt.value
                                ? "bg-blue-600 text-white"
                                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                }`}
                        >
                            {opt.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                {isLoading ? (
                    <div className="p-8 space-y-3">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <div key={i} className="h-14 bg-gray-50 rounded-xl animate-pulse" />
                        ))}
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-gray-50/70 border-b border-gray-100">
                                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Bài viết</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Tác giả</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Trạng thái</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Lượt xem</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Hành động</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {posts.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="text-center py-16 text-gray-400 text-sm font-medium">
                                            Không tìm thấy bài viết nào
                                        </td>
                                    </tr>
                                )}
                                {posts.map((post: AdminBlog) => {
                                    const sc = statusConfig(post.status);
                                    return (
                                        <tr key={post.id} className="hover:bg-gray-50/40 transition-colors group">
                                            <td className="px-6 py-4 max-w-xs">
                                                <p className="text-sm font-bold text-gray-900 line-clamp-1 group-hover:text-blue-600 transition-colors">
                                                    {post.title}
                                                </p>
                                                <p className="text-[11px] text-gray-400 mt-0.5">{timeAgo(post.createdAt)}</p>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-sm font-medium text-gray-700">
                                                    {post.createdBy?.name ?? "—"}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider ${sc.cls}`}>
                                                    {sc.label}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <span className="text-sm font-bold text-gray-700">{post.views.toLocaleString()}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center justify-end gap-1">
                                                    {/* Toggle publish/draft */}
                                                    <button
                                                        onClick={() => changeStatus({
                                                            id: post.id,
                                                            status: post.status === "Pushlish" ? "Draft" : "Pushlish"
                                                        })}
                                                        disabled={changingStatus}
                                                        title={post.status === "Pushlish" ? "Chuyển về Draft" : "Xuất bản"}
                                                        className={`p-2 rounded-lg transition-colors ${post.status === "Pushlish"
                                                            ? "text-green-500 hover:bg-green-50"
                                                            : "text-gray-400 hover:bg-gray-100"
                                                            }`}
                                                    >
                                                        {post.status === "Pushlish" ? <Check size={14} /> : <Clock size={14} />}
                                                    </button>

                                                    {/* View */}
                                                    <Link
                                                        href={`/blogs/${post.id}`}
                                                        target="_blank"
                                                        className="p-2 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                                                        title="Xem bài viết"
                                                    >
                                                        <ExternalLink size={14} />
                                                    </Link>

                                                    {/* Delete */}
                                                    <button
                                                        onClick={() => setConfirmDelete(post.id)}
                                                        className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                                                        title="Xóa bài viết"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Pagination */}
                {meta && meta.totalPages > 1 && (
                    <div className="px-6 py-4 border-t border-gray-50 flex items-center justify-between">
                        <p className="text-xs text-gray-400 font-medium">
                            Trang {meta.page} / {meta.totalPages} • {meta.total} bài viết
                        </p>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={page === 1}
                                className="p-2 rounded-xl text-gray-500 hover:bg-gray-100 disabled:opacity-40 transition-colors"
                            >
                                <ChevronLeft size={16} />
                            </button>
                            {Array.from({ length: Math.min(5, meta.totalPages) }, (_, i) => {
                                const p = Math.max(1, Math.min(meta.totalPages - 4, page - 2)) + i;
                                return (
                                    <button
                                        key={p}
                                        onClick={() => setPage(p)}
                                        className={`w-9 h-9 rounded-xl text-sm font-bold transition-colors ${p === page ? "bg-blue-600 text-white" : "text-gray-500 hover:bg-gray-100"}`}
                                    >
                                        {p}
                                    </button>
                                );
                            })}
                            <button
                                onClick={() => setPage(p => Math.min(meta.totalPages, p + 1))}
                                disabled={page === meta.totalPages}
                                className="p-2 rounded-xl text-gray-500 hover:bg-gray-100 disabled:opacity-40 transition-colors"
                            >
                                <ChevronRight size={16} />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Confirm Delete Modal */}
            {confirmDelete !== null && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-sm w-full animate-in zoom-in-95 duration-200">
                        <div className="w-14 h-14 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <Trash2 size={24} className="text-red-500" />
                        </div>
                        <h3 className="text-lg font-extrabold text-gray-900 text-center mb-2">Xóa bài viết?</h3>
                        <p className="text-sm text-gray-500 text-center mb-6">Bài viết sẽ bị ẩn khỏi hệ thống. Hành động này có thể khôi phục bằng cách đổi status.</p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => doDelete(confirmDelete)}
                                disabled={deleting}
                                className="flex-1 flex items-center justify-center gap-2 bg-red-500 text-white py-3 rounded-2xl font-bold hover:bg-red-600 transition-all disabled:opacity-60"
                            >
                                {deleting ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                                Xóa
                            </button>
                            <button
                                onClick={() => setConfirmDelete(null)}
                                className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-2xl font-bold hover:bg-gray-200 transition-all flex items-center justify-center gap-2"
                            >
                                <X size={16} /> Hủy
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
