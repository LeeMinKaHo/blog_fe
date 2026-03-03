"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useState } from "react";
import {
    TrendingUp, Tag, Mail, Flame, ArrowRight,
    BookOpen, CheckCircle2, Rss
} from "lucide-react";
import { getBlogs, getCategories } from "@/app/services/blogService";

// ─── Widget: Trending Posts ────────────────────────────────────────────────────
function TrendingWidget() {
    const { data } = useQuery({
        queryKey: ["sidebar-trending"],
        queryFn: () => getBlogs({ limit: 5 }),
        staleTime: 5 * 60 * 1000,
    });
    const posts = data?.data ?? [];

    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {/* Header */}
            <div className="px-5 py-4 border-b border-gray-50 flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-orange-50 flex items-center justify-center">
                    <Flame size={14} className="text-orange-500" />
                </div>
                <span className="text-sm font-bold text-gray-800">Bài viết nổi bật</span>
            </div>

            {/* List */}
            <div className="p-3 space-y-1">
                {posts.length === 0 &&
                    Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="flex gap-3 p-2">
                            <div className="w-10 h-10 rounded-xl bg-gray-100 animate-pulse shrink-0" />
                            <div className="flex-1 space-y-1.5 py-1">
                                <div className="h-3 bg-gray-100 rounded animate-pulse w-full" />
                                <div className="h-2 bg-gray-100 rounded animate-pulse w-2/3" />
                            </div>
                        </div>
                    ))}

                {posts.map((post, idx) => (
                    <Link
                        key={post.id}
                        href={`/blogs/${post.id}`}
                        className="flex items-start gap-3 p-2 rounded-xl hover:bg-gray-50 transition-colors group"
                    >
                        {/* Rank */}
                        <div
                            className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-black shrink-0 mt-0.5 ${idx === 0
                                    ? "bg-orange-500 text-white"
                                    : idx === 1
                                        ? "bg-orange-100 text-orange-600"
                                        : "bg-gray-100 text-gray-500"
                                }`}
                        >
                            {idx + 1}
                        </div>

                        {/* Thumbnail */}
                        <div className="w-10 h-10 rounded-xl overflow-hidden shrink-0 bg-gray-100">
                            {post.thumbnail ? (
                                <img
                                    src={post.thumbnail}
                                    alt={post.title}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-blue-50">
                                    <BookOpen size={14} className="text-blue-200" />
                                </div>
                            )}
                        </div>

                        {/* Text */}
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-gray-800 leading-snug line-clamp-2 group-hover:text-blue-600 transition-colors">
                                {post.title}
                            </p>
                            {post.category && (
                                <span className="text-[10px] text-blue-500 font-medium mt-0.5 block">
                                    {post.category.name}
                                </span>
                            )}
                        </div>
                    </Link>
                ))}
            </div>

            <div className="px-4 pb-4">
                <Link
                    href="/blogs"
                    className="flex items-center justify-center gap-1.5 w-full py-2 rounded-xl bg-gray-50 hover:bg-blue-50 text-gray-500 hover:text-blue-600 text-xs font-semibold transition-all border border-gray-100 hover:border-blue-100"
                >
                    Xem tất cả
                    <ArrowRight size={12} />
                </Link>
            </div>
        </div>
    );
}

// ─── Widget: Categories ────────────────────────────────────────────────────────
function CategoriesWidget() {
    const { data: categories = [] } = useQuery({
        queryKey: ["categories"],
        queryFn: getCategories,
        staleTime: 10 * 60 * 1000,
    });

    const colors = [
        "bg-blue-50 text-blue-600 border-blue-100 hover:bg-blue-100",
        "bg-purple-50 text-purple-600 border-purple-100 hover:bg-purple-100",
        "bg-emerald-50 text-emerald-600 border-emerald-100 hover:bg-emerald-100",
        "bg-orange-50 text-orange-600 border-orange-100 hover:bg-orange-100",
        "bg-pink-50 text-pink-600 border-pink-100 hover:bg-pink-100",
        "bg-cyan-50 text-cyan-600 border-cyan-100 hover:bg-cyan-100",
    ];

    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-50 flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-purple-50 flex items-center justify-center">
                    <Tag size={14} className="text-purple-500" />
                </div>
                <span className="text-sm font-bold text-gray-800">Danh mục</span>
            </div>

            <div className="p-4 flex flex-wrap gap-2">
                {categories.length === 0 &&
                    Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="h-7 w-20 rounded-xl bg-gray-100 animate-pulse" />
                    ))}
                {categories.map((cat, i) => (
                    <Link
                        key={cat.id}
                        href={`/blogs?categoryId=${cat.id}`}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${colors[i % colors.length]}`}
                    >
                        {cat.name}
                    </Link>
                ))}
            </div>
        </div>
    );
}

// ─── Widget: Newsletter ────────────────────────────────────────────────────────
function NewsletterWidget() {
    const [email, setEmail] = useState("");
    const [sent, setSent] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!email.trim()) return;
        setSent(true);
    };

    return (
        <div
            className="rounded-2xl overflow-hidden shadow-sm"
            style={{
                background: "linear-gradient(135deg, #1e40af 0%, #3b82f6 50%, #60a5fa 100%)",
            }}
        >
            <div className="p-5">
                {/* Icon */}
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center mb-3">
                    <Mail size={18} className="text-white" />
                </div>

                <h3 className="text-white font-bold text-sm leading-snug mb-1">
                    Nhận bài viết mới nhất
                </h3>
                <p className="text-blue-100 text-xs leading-relaxed mb-4">
                    Đăng ký để không bỏ lỡ bất kỳ bài viết hữu ích nào.
                </p>

                {sent ? (
                    <div className="flex items-center gap-2 bg-white/20 rounded-xl px-4 py-3">
                        <CheckCircle2 size={16} className="text-green-300" />
                        <span className="text-white text-xs font-semibold">Đăng ký thành công! 🎉</span>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-2">
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="email@example.com"
                            className="w-full bg-white/20 text-white placeholder:text-blue-200 text-xs rounded-xl px-3 py-2.5 outline-none border border-white/20 focus:border-white/50 transition-all"
                        />
                        <button
                            type="submit"
                            className="w-full bg-white text-blue-600 text-xs font-bold py-2.5 rounded-xl hover:bg-blue-50 transition-all active:scale-[0.98]"
                        >
                            Đăng ký miễn phí
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}

// ─── Widget: Stay Updated ──────────────────────────────────────────────────────
function StayUpdatedWidget() {
    const stats = [
        { label: "Bài viết", value: "120+", color: "text-blue-600" },
        { label: "Chủ đề", value: "15+", color: "text-purple-600" },
        { label: "Độc giả", value: "2K+", color: "text-emerald-600" },
    ];

    return (
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
                <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center">
                    <Rss size={14} className="text-white" />
                </div>
                <span className="text-sm font-bold text-white">Foxtek Blog</span>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-4">
                {stats.map((s) => (
                    <div key={s.label} className="text-center">
                        <p className={`text-lg font-black ${s.color}`}>{s.value}</p>
                        <p className="text-gray-400 text-[10px] font-medium">{s.label}</p>
                    </div>
                ))}
            </div>

            <p className="text-gray-400 text-xs leading-relaxed">
                Blog chia sẻ kiến thức lập trình, công nghệ và kinh nghiệm thực chiến từ các developer.
            </p>
        </div>
    );
}

// ─── Main Sidebar ──────────────────────────────────────────────────────────────
export default function SideBar() {
    return (
        <aside className="space-y-4 sticky top-24">
            <StayUpdatedWidget />
            <TrendingWidget />
            <CategoriesWidget />
            <NewsletterWidget />
        </aside>
    );
}