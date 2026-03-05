"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    totalItems?: number;
    onPageChange: (page: number) => void;
}

export default function Pagination({
    currentPage,
    totalPages,
    totalItems,
    onPageChange,
}: PaginationProps) {
    if (totalPages <= 1) return null;

    const getPageNumbers = () => {
        if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);

        const pages: (number | "...")[] = [1];
        if (currentPage > 3) pages.push("...");

        for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
            pages.push(i);
        }

        if (currentPage < totalPages - 2) pages.push("...");
        pages.push(totalPages);
        return pages;
    };

    return (
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            {totalItems !== undefined && (
                <p className="text-xs text-gray-400 font-medium">
                    Trang {currentPage} / {totalPages} · {totalItems} bài viết
                </p>
            )}

            <div className="flex items-center gap-1.5 ml-auto">
                {/* Prev */}
                <button
                    disabled={currentPage <= 1}
                    onClick={() => onPageChange(currentPage - 1)}
                    className="p-2 rounded-xl border border-gray-200 text-gray-500 hover:bg-white hover:text-blue-600 hover:border-blue-200 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                    <ChevronLeft size={18} />
                </button>

                {/* Page numbers */}
                {getPageNumbers().map((p, i) =>
                    p === "..." ? (
                        <span key={`dots-${i}`} className="px-2 text-gray-400 text-sm">…</span>
                    ) : (
                        <button
                            key={p}
                            onClick={() => onPageChange(p as number)}
                            className={`w-9 h-9 rounded-xl text-sm font-bold transition-all border ${currentPage === p
                                ? "bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-100"
                                : "bg-white text-gray-600 border-gray-200 hover:border-blue-200 hover:text-blue-600"
                                }`}
                        >
                            {p}
                        </button>
                    )
                )}

                {/* Next */}
                <button
                    disabled={currentPage >= totalPages}
                    onClick={() => onPageChange(currentPage + 1)}
                    className="p-2 rounded-xl border border-gray-200 text-gray-500 hover:bg-white hover:text-blue-600 hover:border-blue-200 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                    <ChevronRight size={18} />
                </button>
            </div>
        </div>
    );
}
