"use client";

import { useState, useCallback, useTransition } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import {
    Search, X, ChevronLeft, ChevronRight,
    BookOpen, Loader2, SlidersHorizontal, Tag, LayoutGrid
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getBlogs, getCategories, Blog, Category } from "@/app/services/blogService";
import BlogCard from "@/components/BlogCard";
import SideBar from "@/components/Sidebar";
import Pagination from "@/components/Pagination";

// ─── Sort options ──────────────────────────────────────────────────────────────
const SORT_OPTIONS = [
    { value: "", label: "Mới nhất" },
    { value: "oldest", label: "Cũ nhất" },
];

// ─── Main Component ────────────────────────────────────────────────────────────
export default function BlogsPageClient({
    initialSearch = "",
    initialCategoryId,
    initialPage = 1,
}: {
    initialSearch?: string;
    initialCategoryId?: number;
    initialPage?: number;
}) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const [search, setSearch] = useState(initialSearch);
    const [inputValue, setInputValue] = useState(initialSearch);
    const [categoryId, setCategoryId] = useState<number | undefined>(initialCategoryId);
    const [page, setPage] = useState(initialPage);
    const [showFilter, setShowFilter] = useState(false);
    const [isPending, startTransition] = useTransition();

    // ── Push new URL khi filter thay đổi ────────────────────────────────────────
    const updateUrl = useCallback(
        (newSearch: string, newCategory?: number, newPage = 1) => {
            const params = new URLSearchParams();
            if (newSearch) params.set("search", newSearch);
            if (newCategory) params.set("categoryId", String(newCategory));
            if (newPage > 1) params.set("page", String(newPage));
            const qs = params.toString();
            startTransition(() => {
                router.push(`${pathname}${qs ? `?${qs}` : ""}`, { scroll: false });
            });
        },
        [router, pathname]
    );

    // ── Fetch categories ─────────────────────────────────────────────────────────
    const { data: categories = [] } = useQuery<Category[]>({
        queryKey: ["categories"],
        queryFn: getCategories,
        staleTime: 10 * 60 * 1000, // 10 phút
    });

    // ── Fetch blogs ──────────────────────────────────────────────────────────────
    const { data, isFetching } = useQuery({
        queryKey: ["blogs", { search, categoryId, page }],
        queryFn: () => getBlogs({ search: search || undefined, categoryId, page, limit: 10 }),
        placeholderData: (prev) => prev,
    });

    const posts = data?.data ?? [];
    const meta = data?.meta;
    const total = meta?.total ?? 0;
    const totalPages = meta?.totalPages ?? 1;

    // ── Handlers ─────────────────────────────────────────────────────────────────
    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const trimmed = inputValue.trim();
        setSearch(trimmed);
        setPage(1);
        updateUrl(trimmed, categoryId, 1);
    };

    const handleCategorySelect = (id?: number) => {
        setCategoryId(id);
        setPage(1);
        updateUrl(search, id, 1);
    };

    const handlePageChange = (newPage: number) => {
        setPage(newPage);
        updateUrl(search, categoryId, newPage);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleClearAll = () => {
        setSearch("");
        setInputValue("");
        setCategoryId(undefined);
        setPage(1);
        router.push(pathname, { scroll: false });
    };

    const hasFilter = !!search || !!categoryId;

    return (
        <div className="min-h-screen bg-gray-50">
            {/* ── Page header ─────────────────────────────────────────────────────── */}
            <div className="bg-white border-b border-gray-100 px-6 py-5">
                <div className="max-w-5xl mx-auto">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">
                                {categoryId
                                    ? categories.find((c) => c.id === categoryId)?.name ?? "Bài viết"
                                    : search
                                        ? `Kết quả: "${search}"`
                                        : "Tất cả bài viết"}
                            </h1>
                            <p className="text-sm text-gray-500 mt-0.5">
                                {total > 0 ? `${total} bài viết` : "Không có bài viết nào"}
                            </p>
                        </div>

                        {/* Toggle filter bar */}
                        <button
                            onClick={() => setShowFilter((v) => !v)}
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-semibold transition-all ${showFilter || hasFilter
                                ? "bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-100"
                                : "bg-white text-gray-600 border-gray-200 hover:border-blue-300 hover:text-blue-600"
                                }`}
                        >
                            <SlidersHorizontal size={16} />
                            Bộ lọc
                            {hasFilter && (
                                <span className="ml-1 w-5 h-5 rounded-full bg-white text-blue-600 text-xs font-bold flex items-center justify-center">
                                    {(search ? 1 : 0) + (categoryId ? 1 : 0)}
                                </span>
                            )}
                        </button>
                    </div>

                    {/* ── Filter panel ──────────────────────────────────────────────── */}
                    {showFilter && (
                        <div className="mt-4 p-4 bg-gray-50 rounded-2xl border border-gray-100 space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
                            {/* Search */}
                            <form onSubmit={handleSearch} className="flex gap-2">
                                <div className="flex-1 flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2.5 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-50 transition-all">
                                    <Search size={15} className="text-gray-400 shrink-0" />
                                    <input
                                        type="text"
                                        value={inputValue}
                                        onChange={(e) => setInputValue(e.target.value)}
                                        placeholder="Tìm theo tiêu đề, category..."
                                        className="flex-1 bg-transparent outline-none text-sm text-gray-800 placeholder:text-gray-400"
                                    />
                                    {inputValue && (
                                        <button type="button" onClick={() => setInputValue("")}>
                                            <X size={13} className="text-gray-400 hover:text-gray-600" />
                                        </button>
                                    )}
                                </div>
                                <button
                                    type="submit"
                                    className="px-5 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 active:scale-95 transition-all shadow-sm shadow-blue-100"
                                >
                                    Tìm
                                </button>
                            </form>

                            {/* Category chips */}
                            <div>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                                    <Tag size={11} /> Danh mục
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {/* All */}
                                    <button
                                        onClick={() => handleCategorySelect(undefined)}
                                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${!categoryId
                                            ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                                            : "bg-white text-gray-600 border-gray-200 hover:border-blue-300 hover:text-blue-600"
                                            }`}
                                    >
                                        <LayoutGrid size={11} />
                                        Tất cả
                                    </button>
                                    {categories.map((cat) => (
                                        <button
                                            key={cat.id}
                                            onClick={() => handleCategorySelect(cat.id)}
                                            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${categoryId === cat.id
                                                ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                                                : "bg-white text-gray-600 border-gray-200 hover:border-blue-300 hover:text-blue-600"
                                                }`}
                                        >
                                            {cat.name}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Clear all */}
                            {hasFilter && (
                                <div className="flex justify-end">
                                    <button
                                        onClick={handleClearAll}
                                        className="flex items-center gap-1.5 text-xs text-red-500 hover:text-red-700 font-semibold transition-colors"
                                    >
                                        <X size={12} />
                                        Xoá tất cả bộ lọc
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Active filter badges */}
                    {!showFilter && hasFilter && (
                        <div className="mt-3 flex flex-wrap gap-2">
                            {search && (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded-xl border border-blue-100">
                                    <Search size={10} />
                                    "{search}"
                                    <button onClick={() => { setSearch(""); setInputValue(""); updateUrl("", categoryId); }}>
                                        <X size={10} className="ml-0.5 hover:text-blue-900" />
                                    </button>
                                </span>
                            )}
                            {categoryId && (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-purple-50 text-purple-700 text-xs font-semibold rounded-xl border border-purple-100">
                                    <Tag size={10} />
                                    {categories.find((c) => c.id === categoryId)?.name}
                                    <button onClick={() => handleCategorySelect(undefined)}>
                                        <X size={10} className="ml-0.5 hover:text-purple-900" />
                                    </button>
                                </span>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* ── Blog list + Sidebar ─────────────────────────────────────────── */}
            <div className="max-w-6xl mx-auto px-4 py-6 flex gap-6 items-start">
                {/* Main content */}
                <div className="flex-1 min-w-0">
                    {/* Loading overlay */}
                    {isFetching && (
                        <div className="flex items-center justify-center gap-2 py-4 text-blue-500 text-sm font-medium">
                            <Loader2 size={16} className="animate-spin" />
                            Đang tải...
                        </div>
                    )}

                    {/* Empty state */}
                    {!isFetching && posts.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-24 text-center">
                            <BookOpen size={48} className="text-gray-200 mb-4" />
                            <h3 className="text-gray-500 font-semibold text-lg">Không tìm thấy bài viết</h3>
                            <p className="text-gray-400 text-sm mt-1 mb-4">
                                Thử thay đổi từ khoá hoặc danh mục khác
                            </p>
                            <button
                                onClick={handleClearAll}
                                className="px-5 py-2 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-all"
                            >
                                Xem tất cả bài viết
                            </button>
                        </div>
                    )}

                    {/* Posts */}
                    <div className={`space-y-1 transition-opacity duration-200 ${isFetching ? "opacity-60" : "opacity-100"}`}>
                        {posts.map((post: Blog) => (
                            <BlogCard key={post.id} post={post} />
                        ))}
                    </div>

                    {/* ── Pagination ────────────────────────────────────────────────────── */}
                    <Pagination
                        currentPage={page}
                        totalPages={totalPages}
                        totalItems={total}
                        onPageChange={handlePageChange}
                    />
                </div>

                {/* Sidebar */}
                <div className="w-[280px] shrink-0 hidden lg:block">
                    <SideBar />
                </div>
            </div>
        </div>
    );

}
