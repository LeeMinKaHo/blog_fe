"use client";

import { useState, useEffect } from "react";
import { Bookmark, BookmarkCheck } from "lucide-react";
import { useMe } from "@/app/hooks/useMe";
import { useToast } from "./toast";

interface SavePostButtonProps {
    postId: string | number;
}

export default function SavePostButton({ postId }: SavePostButtonProps) {
    const { data: user } = useMe();
    const [isSaved, setIsSaved] = useState(false);
    const toast = useToast();
    // Load saved state from localStorage (Mock)
    useEffect(() => {
        const savedPosts = JSON.parse(localStorage.getItem("savedPosts") || "[]");
        setIsSaved(savedPosts.includes(postId));
    }, [postId]);

    const toggleSave = () => {
        if (!user) {
            toast.error("Vui lòng đăng nhập để lưu bài viết!");
            return;
        }

        const savedPosts = JSON.parse(localStorage.getItem("savedPosts") || "[]");
        let updatedPosts;

        if (isSaved) {
            updatedPosts = savedPosts.filter((id: any) => id !== postId);
        } else {
            updatedPosts = [...savedPosts, postId];
        }

        localStorage.setItem("savedPosts", JSON.stringify(updatedPosts));
        setIsSaved(!isSaved);
    };

    return (
        <button
            onClick={toggleSave}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all active:scale-95 ${isSaved
                ? "bg-blue-50 border-blue-200 text-blue-600 font-bold"
                : "bg-white border-gray-200 text-gray-500 hover:border-blue-300 hover:text-blue-600"
                }`}
        >
            {isSaved ? (
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
