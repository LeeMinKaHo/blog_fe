"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    getMyBlogs,
    updateBlog,
    getCategories,
    Blog,
} from "@/app/services/blogService";
import { AuthGuard } from "@/components/AuthGuard";
import Pagination from "@/components/Pagination";
import {
    Eye, EyeOff, Pencil, Check, X, Loader2,
    FileText, Image as ImageIcon, LayoutGrid, BookOpen,
} from "lucide-react";

// ─── Status Badge ───────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: string }) {
    const map: Record<string, { label: string; cls: string }> = {
        Pushlish: { label: "Đang hiện", cls: "bg-emerald-50 text-emerald-700 border-emerald-100" },
        Draft: { label: "Đã ẩn", cls: "bg-amber-50 text-amber-700 border-amber-100" },
        Delete: { label: "Đã xoá", cls: "bg-red-50 text-red-600 border-red-100" },
    };
    const s = map[status] ?? { label: status, cls: "bg-gray-100 text-gray-500 border-gray-200" };
    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${s.cls}`}>
            {s.label}
        </span>
    );
}

// ─── Edit Modal ─────────────────────────────────────────────────────────────────
interface EditModalProps {
    post: Blog;
    onClose: () => void;
    categories: { id: number; name: string }[];
}

function EditModal({ post, onClose, categories }: EditModalProps) {
    const qc = useQueryClient();
    const [form, setForm] = useState({
        title: post.title ?? "",
        description: post.description ?? post.descrtiption ?? "",
        thumbnail: post.thumbnail ?? "",
        categoryId: post.category?.id ?? 0,
    });

    const { mutate, isPending } = useMutation({
        mutationFn: () => updateBlog(post.id, form),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["my-blogs"] });
            onClose();
        },
    });

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center">
                            <Pencil size={16} className="text-blue-600" />
                        </div>
                        <h2 className="font-bold text-gray-900">Chỉnh sửa bài viết</h2>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-xl hover:bg-gray-100 text-gray-400 transition-colors">
                        <X size={18} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 space-y-4 max-h-[65vh] overflow-y-auto">
                    {/* Title */}
                    <div>
                        <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wide">
                            Tiêu đề
                        </label>
                        <input
                            value={form.title}
                            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50 transition-all"
                            placeholder="Tiêu đề bài viết..."
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wide">
                            Mô tả
                        </label>
                        <textarea
                            rows={3}
                            value={form.description}
                            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50 transition-all resize-none"
                            placeholder="Mô tả ngắn về bài viết..."
                        />
                    </div>

                    {/* Thumbnail */}
                    <div>
                        <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wide">
                            URL Ảnh bìa
                        </label>
                        <div className="flex gap-2">
                            <input
                                value={form.thumbnail}
                                onChange={(e) => setForm((f) => ({ ...f, thumbnail: e.target.value }))}
                                className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50 transition-all"
                                placeholder="https://..."
                            />
                            {form.thumbnail && (
                                <img
                                    src={form.thumbnail}
                                    className="w-12 h-12 object-cover rounded-xl border border-gray-200 shrink-0"
                                    onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                                />
                            )}
                        </div>
                    </div>

                    {/* Category */}
                    <div>
                        <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wide">
                            Danh mục
                        </label>
                        <select
                            value={form.categoryId}
                            onChange={(e) => setForm((f) => ({ ...f, categoryId: +e.target.value }))}
                            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50 transition-all bg-white"
                        >
                            <option value={0}>-- Chọn danh mục --</option>
                            {categories.map((c) => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-gray-100 flex gap-3 justify-end">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-100 transition-colors"
                    >
                        Huỷ
                    </button>
                    <button
                        onClick={() => mutate()}
                        disabled={isPending || !form.title.trim()}
                        className="px-5 py-2 rounded-xl text-sm font-bold bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
                    >
                        {isPending ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
                        Lưu thay đổi
                    </button>
                </div>
            </div>
        </div>
    );
}

// ─── Post Row ───────────────────────────────────────────────────────────────────
function PostRow({
    post,
    categories,
    onEdit,
}: {
    post: Blog;
    categories: { id: number; name: string }[];
    onEdit: (p: Blog) => void;
}) {
    const qc = useQueryClient();
    const isVisible = post.status === "Pushlish";

    const { mutate: toggleVisibility, isPending } = useMutation({
        mutationFn: () =>
            updateBlog(post.id, {
                status: isVisible ? ("Draft" as any) : ("Pushlish" as any),
            }),
        onSuccess: () => qc.invalidateQueries({ queryKey: ["my-blogs"] }),
    });

    return (
        <div className="flex items-center gap-4 px-5 py-4 border-b border-gray-50 hover:bg-gray-50/60 transition-colors group">
            {/* Thumbnail */}
            <div className="w-16 h-12 rounded-xl overflow-hidden shrink-0 bg-gray-100">
                {post.thumbnail ? (
                    <img src={post.thumbnail} alt={post.title} className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <ImageIcon size={18} className="text-gray-300" />
                    </div>
                )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 line-clamp-1 group-hover:text-blue-600 transition-colors">
                    {post.title}
                </p>
                <div className="flex items-center gap-3 mt-1">
                    <StatusBadge status={post.status} />
                    {post.category && (
                        <span className="text-[11px] text-gray-400 font-medium">{post.category.name}</span>
                    )}
                    <span className="text-[11px] text-gray-400 flex items-center gap-1">
                        <Eye size={11} />
                        {(post.views ?? 0).toLocaleString("vi-VN")}
                    </span>
                </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                {/* Edit */}
                <button
                    onClick={() => onEdit(post)}
                    className="p-2 rounded-xl hover:bg-blue-50 text-gray-400 hover:text-blue-600 transition-all"
                    title="Chỉnh sửa"
                >
                    <Pencil size={16} />
                </button>

                {/* Toggle visibility */}
                <button
                    onClick={() => toggleVisibility()}
                    disabled={isPending}
                    className={`p-2 rounded-xl transition-all ${isVisible
                        ? "hover:bg-amber-50 text-gray-400 hover:text-amber-600"
                        : "hover:bg-emerald-50 text-gray-400 hover:text-emerald-600"
                        }`}
                    title={isVisible ? "Ẩn bài viết" : "Hiện bài viết"}
                >
                    {isPending
                        ? <Loader2 size={16} className="animate-spin" />
                        : isVisible
                            ? <EyeOff size={16} />
                            : <Eye size={16} />
                    }
                </button>
            </div>
        </div>
    );
}

// ─── Main Page ──────────────────────────────────────────────────────────────────
export default function MyPostsPage() {
    const [page, setPage] = useState(1);
    const [editingPost, setEditingPost] = useState<Blog | null>(null);

    const { data, isLoading } = useQuery({
        queryKey: ["my-blogs", page],
        queryFn: () => getMyBlogs({ page, limit: 10 }),
    });

    const { data: categories = [] } = useQuery({
        queryKey: ["categories"],
        queryFn: getCategories,
        staleTime: 10 * 60 * 1000,
    });

    const posts = data?.data ?? [];
    const meta = data?.meta;
    const totalPages = meta?.totalPages ?? 1;

    const publishedCount = posts.filter((p) => p.status === "Pushlish").length;
    const draftCount = posts.filter((p) => p.status === "Draft").length;

    return (
        <AuthGuard>
            {editingPost && (
                <EditModal
                    post={editingPost}
                    categories={categories}
                    onClose={() => setEditingPost(null)}
                />
            )}

            <div className="max-w-4xl mx-auto px-4 py-10">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Bài viết của tôi</h1>
                    <p className="text-gray-500 text-sm mt-1">Quản lý, chỉnh sửa và ẩn/hiện bài viết</p>
                </div>

                {/* Stats */}
                {!isLoading && meta && (
                    <div className="grid grid-cols-3 gap-4 mb-8">
                        {[
                            { label: "Tổng bài viết", value: meta.total, icon: FileText, color: "blue" },
                            { label: "Đang hiện", value: publishedCount, icon: Eye, color: "emerald" },
                            { label: "Đã ẩn", value: draftCount, icon: EyeOff, color: "amber" },
                        ].map(({ label, value, icon: Icon, color }) => (
                            <div key={label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-xl bg-${color}-50 flex items-center justify-center shrink-0`}>
                                    <Icon size={18} className={`text-${color}-600`} />
                                </div>
                                <div>
                                    <p className="text-xl font-black text-gray-900">{value}</p>
                                    <p className="text-xs text-gray-500 font-medium">{label}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Table */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    {/* Table Header */}
                    <div className="flex items-center gap-4 px-5 py-3.5 border-b border-gray-100 bg-gray-50/70">
                        <div className="w-16 shrink-0" />
                        <p className="flex-1 text-xs font-bold text-gray-500 uppercase tracking-widest">Bài viết</p>
                        <div className="w-16 shrink-0" />
                    </div>

                    {/* Loading */}
                    {isLoading && (
                        <div className="py-16 flex flex-col items-center gap-3 text-gray-400">
                            <Loader2 size={32} className="animate-spin text-blue-300" />
                            <p className="text-sm font-medium">Đang tải bài viết...</p>
                        </div>
                    )}

                    {/* Empty */}
                    {!isLoading && posts.length === 0 && (
                        <div className="py-20 flex flex-col items-center gap-4 text-center">
                            <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center">
                                <BookOpen size={28} className="text-gray-300" />
                            </div>
                            <div>
                                <p className="font-bold text-gray-600">Chưa có bài viết nào</p>
                                <p className="text-sm text-gray-400 mt-1">Hãy bắt đầu viết bài đầu tiên của bạn!</p>
                            </div>
                        </div>
                    )}

                    {/* List */}
                    {!isLoading && posts.map((post) => (
                        <PostRow
                            key={post.id}
                            post={post}
                            categories={categories}
                            onEdit={setEditingPost}
                        />
                    ))}
                </div>

                {/* Pagination */}
                <Pagination
                    currentPage={page}
                    totalPages={totalPages}
                    totalItems={meta?.total}
                    onPageChange={setPage}
                />
            </div>
        </AuthGuard>
    );
}
