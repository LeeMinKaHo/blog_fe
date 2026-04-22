"use client";

import { useState, useEffect } from "react";
import { Bookmark, BookmarkCheck, Loader2 } from "lucide-react";
import { useMe } from "@/app/hooks/useMe";
import { useToast } from "./toast";
import { toggleSaveBlog, getSavedBlogs } from "@/app/services/blogService";
import { useQueryClient } from "@tanstack/react-query";

interface SavePostButtonProps {
    postId: string | number;
    variant?: "default" | "sidebar";
}

export default function SavePostButton({ postId, variant = "default" }: SavePostButtonProps) {
    const { data: user } = useMe();
    const [isSaved, setIsSaved] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const toast = useToast();
    const queryClient = useQueryClient();

    // Load saved state from API if user is logged in, otherwise from localStorage
    useEffect(() => {
        if (!user) {
            const savedPosts = JSON.parse(localStorage.getItem("savedPosts") || "[]");
            setIsSaved(savedPosts.includes(Number(postId)) || savedPosts.includes(String(postId)));
            return;
        }

        // Fetch from API
        getSavedBlogs(1, 100)
            .then((res) => {
                const savedIds = (res.data as any[]).map((item: any) => {
                    // API trả về {savePost.blog} hoặc trực tiếp blog
                    return item.blog?.id ?? item.postId ?? item.id;
                });
                setIsSaved(savedIds.includes(Number(postId)));
            })
            .catch(() => {
                // fallback localStorage
                const savedPosts = JSON.parse(localStorage.getItem("savedPosts") || "[]");
                setIsSaved(savedPosts.includes(Number(postId)));
            });
    }, [postId, user]);

    const toggleSave = async () => {
        if (!user) {
            toast.error("Vui lòng đăng nhập để lưu bài viết!");
            return;
        }

        setIsLoading(true);
        try {
            const result = await toggleSaveBlog(Number(postId));
            setIsSaved(result.saved);
            queryClient.invalidateQueries({ queryKey: ["saved-blogs"] });
            toast.success(result.message ?? (result.saved ? "Đã lưu bài viết!" : "Đã bỏ lưu!"));
        } catch {
            toast.error("Có lỗi xảy ra, thử lại nhé!");
        } finally {
            setIsLoading(false);
        }
    };

    if (variant === "sidebar") {
        return (
            <button
                onClick={toggleSave}
                disabled={isLoading}
                className="group flex flex-col items-center gap-1.5 transition-all"
            >
                <div 
                    className={`p-3 rounded-full transition-all ${
                        isSaved 
                        ? "text-blue-500" 
                        : "text-gray-400 group-hover:text-black dark:group-hover:text-white"
                    }`}
                >
                    {isLoading ? (
                        <Loader2 size={22} className="animate-spin" />
                    ) : isSaved ? (
                        <Bookmark size={22} fill="currentColor" />
                    ) : (
                        <Bookmark size={22} />
                    )}
                </div>
                <span className={`text-xs font-bold ${isSaved ? "text-blue-500" : "text-gray-500 group-hover:text-black dark:group-hover:text-white"}`}>
                    {isSaved ? "Đã lưu" : "Lưu"}
                </span>
            </button>
        );
    }

    return (
        <button
            onClick={toggleSave}
            disabled={isLoading}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed ${isSaved
                ? "bg-blue-50 border-blue-200 text-blue-600 font-bold"
                : "bg-white border-gray-200 text-gray-500 hover:border-blue-300 hover:text-blue-600"
                }`}
        >
            {isLoading ? (
                <>
                    <Loader2 size={20} className="animate-spin" />
                    <span>Đang lưu...</span>
                </>
            ) : isSaved ? (
                <>
                    <BookmarkCheck size={20} fill="currentColor" />
                    <span>Đã lưu</span>
                </>
            ) : (
                <>
                    <Bookmark size={20} />
                    <span>Lưu bài viết</span>
                </>
            )}
        </button>
    );
}
