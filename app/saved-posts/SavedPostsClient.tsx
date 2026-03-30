"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getSavedBlogs, removeSavedBlog } from "@/app/services/blogService";
import { useMe } from "@/app/hooks/useMe";
import { useToast } from "@/components/toast";
import Link from "next/link";
import Image from "next/image";
import {
    Bookmark,
    Trash2,
    ArrowLeft,
    BookOpen,
    Clock,
    User,
    ChevronLeft,
    ChevronRight,
    Loader2,
    ArrowRight,
} from "lucide-react";
import Pagination from "@/components/Pagination";

const LIMIT = 9;

function formatDate(dateStr?: string) {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString("vi-VN", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
}

export default function SavedPostsClient() {
    const { data: user, isLoading: userLoading } = useMe();
    const toast = useToast();
    const queryClient = useQueryClient();
    const [page, setPage] = useState(1);
    const [removingId, setRemovingId] = useState<number | null>(null);

    const { data, isLoading: blogsLoading } = useQuery({
        queryKey: ["saved-blogs", page],
        queryFn: () => getSavedBlogs(page, LIMIT),
        enabled: !!user,
    });

    const unsaveMutation = useMutation({
        mutationFn: (postId: number) => removeSavedBlog(postId),
        onMutate: (postId) => {
            setRemovingId(postId);
        },
        onSuccess: (_, postId) => {
            toast.success("Đã bỏ lưu bài viết!");
            queryClient.invalidateQueries({ queryKey: ["saved-blogs"] });
            setRemovingId(null);
        },
        onError: () => {
            toast.error("Có lỗi xảy ra, thử lại nhé!");
            setRemovingId(null);
        },
    });

    // Chưa đăng nhập
    if (!userLoading && !user) {
        return (
            <div className="min-h-[80vh] flex items-center justify-center p-6">
                <div className="w-full max-w-lg bg-white rounded-[40px] border border-gray-100 shadow-2xl p-12 text-center animate-in fade-in zoom-in-95 duration-500 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50/50 rounded-full -translate-y-16 translate-x-16" />
                    
                    <div className="w-24 h-24 bg-blue-100 rounded-[32px] flex items-center justify-center mx-auto mb-8 shadow-inner relative z-10">
                        <Bookmark size={44} className="text-blue-600 drop-shadow-md" fill="currentColor" />
                    </div>
                    
                    <h2 className="text-3xl font-black text-gray-900 mb-4 tracking-tight">
                        Bạn chưa đăng nhập
                    </h2>
                    
                    <p className="text-gray-500 text-base leading-relaxed mb-10 max-w-sm mx-auto font-medium">
                        Bạn cần đăng nhập để xem và quản lý danh sách bài viết đã lưu của mình. Đừng bỏ lỡ những bài viết hay nhé!
                    </p>

                    <Link
                        href="/login"
                        className="flex items-center justify-center gap-3 bg-blue-600 text-white px-10 py-5 rounded-3xl font-black shadow-2xl shadow-blue-200 hover:bg-blue-700 hover:-translate-y-1 active:scale-95 transition-all duration-300 group"
                    >
                        Đăng nhập ngay
                        <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
            </div>
        );
    }


    // Đang load
    if (userLoading || blogsLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 size={48} className="animate-spin text-blue-500 mx-auto mb-4" />
                    <p className="text-gray-500 font-medium">Đang tải bài viết đã lưu...</p>
                </div>
            </div>
        );
    }

    const savedPosts = (data?.data ?? []) as any[];
    const meta = data?.meta;
    const totalPages = meta?.totalPages ?? 1;

    // Danh sách rỗng
    if (savedPosts.length === 0 && page === 1) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
                <div className="max-w-5xl mx-auto px-6 py-12">
                    {/* Header */}
                    <div className="mb-10">
                        <Link
                            href="/blogs"
                            className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-blue-600 transition-colors mb-6"
                        >
                            <ArrowLeft size={16} />
                            Quay lại bài viết
                        </Link>
                        <h1 className="text-3xl font-extrabold text-gray-900 flex items-center gap-3">
                            <span className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
                                <Bookmark size={24} fill="white" />
                            </span>
                            Bài viết đã lưu
                        </h1>
                    </div>

                    <div className="text-center py-24">
                        <div className="w-28 h-28 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm">
                            <BookOpen size={48} className="text-blue-400" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-3">
                            Chưa có bài viết nào được lưu
                        </h2>
                        <p className="text-gray-500 max-w-sm mx-auto mb-8 leading-relaxed">
                            Hãy khám phá các bài viết thú vị và nhấn nút{" "}
                            <span className="font-semibold text-blue-600">Lưu bài viết</span> để lưu lại sau!
                        </p>
                        <Link
                            href="/blogs"
                            className="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-3 rounded-2xl font-semibold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 active:scale-95"
                        >
                            <BookOpen size={18} />
                            Khám phá bài viết
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
            <div className="max-w-5xl mx-auto px-6 py-12">
                {/* Header */}
                <div className="mb-10">
                    <Link
                        href="/blogs"
                        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-blue-600 transition-colors mb-6"
                    >
                        <ArrowLeft size={16} />
                        Quay lại bài viết
                    </Link>
                    <div className="flex items-center justify-between flex-wrap gap-4">
                        <div>
                            <h1 className="text-3xl font-extrabold text-gray-900 flex items-center gap-3 mb-2">
                                <span className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
                                    <Bookmark size={24} fill="white" />
                                </span>
                                Bài viết đã lưu
                            </h1>
                            <p className="text-gray-500 ml-15">
                                {meta?.total ?? 0} bài viết đã được lưu
                            </p>
                        </div>
                        <Link
                            href="/blogs"
                            className="flex items-center gap-2 text-sm text-blue-600 font-semibold bg-blue-50 px-5 py-2.5 rounded-xl hover:bg-blue-100 transition-colors"
                        >
                            <BookOpen size={16} />
                            Khám phá thêm
                        </Link>
                    </div>
                </div>

                {/* Grid bài viết */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                    {savedPosts.map((item: any) => {
                        // BE có thể trả về {blog: {...}, postId: ...} hoặc trực tiếp blog
                        const blog = item.blog ?? item;
                        const postId: number = blog.id ?? item.postId;
                        const isRemoving = removingId === postId;

                        return (
                            <div
                                key={postId}
                                className={`group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ${isRemoving ? "opacity-40 scale-95" : ""}`}
                            >
                                {/* Thumbnail */}
                                <div className="relative h-48 overflow-hidden">
                                    <Image
                                        src={
                                            blog.thumbnail ||
                                            "https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=2070&auto=format&fit=crop"
                                        }
                                        alt={blog.title ?? "Bài viết"}
                                        fill
                                        unoptimized
                                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                    />
                                    {/* Overlay gradient */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                                    {/* Badge category */}
                                    {blog.category && (
                                        <span className="absolute top-3 left-3 bg-white/90 backdrop-blur text-blue-700 text-xs font-bold px-3 py-1 rounded-full border border-blue-100 shadow-sm">
                                            {blog.category.name}
                                        </span>
                                    )}

                                    {/* Nút bỏ lưu */}
                                    <button
                                        aria-label="Bỏ lưu bài viết"
                                        onClick={() => unsaveMutation.mutate(postId)}
                                        disabled={isRemoving}
                                        className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur rounded-full flex items-center justify-center text-red-500 hover:bg-red-50 hover:scale-110 transition-all shadow-sm opacity-0 group-hover:opacity-100"
                                    >
                                        {isRemoving ? (
                                            <Loader2 size={14} className="animate-spin" />
                                        ) : (
                                            <Trash2 size={14} />
                                        )}
                                    </button>
                                </div>

                                {/* Content */}
                                <Link href={`/blogs/${postId}`}>
                                    <div className="p-5">
                                        <h2 className="text-base font-bold text-gray-900 leading-snug line-clamp-2 mb-2 group-hover:text-blue-600 transition-colors">
                                            {blog.title}
                                        </h2>
                                        {blog.descrtiption && (
                                            <p className="text-sm text-gray-500 line-clamp-2 mb-4 leading-relaxed">
                                                {blog.descrtiption}
                                            </p>
                                        )}

                                        {/* Meta info */}
                                        <div className="flex items-center justify-between text-xs text-gray-400 border-t border-gray-50 pt-3 relative z-10">
                                            <Link 
                                                href={`/profile/${blog.author?.id}`}
                                                className="flex items-center gap-1.5 hover:text-blue-600 transition-colors"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                <User size={12} className="text-blue-500" />
                                                <span className="font-bold underline underline-offset-2">
                                                    {blog.author?.name ?? "Unknown"}
                                                </span>
                                            </Link>
                                            <div className="flex items-center gap-1.5">
                                                <Clock size={12} />
                                                <span>{formatDate(blog.createdAt)}</span>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        );
                    })}
                </div>

                {/* Pagination */}
                <Pagination
                    currentPage={page}
                    totalPages={totalPages}
                    totalItems={meta?.total ?? 0}
                    onPageChange={(p) => setPage(p)}
                />
            </div>
        </div>
    );
}
