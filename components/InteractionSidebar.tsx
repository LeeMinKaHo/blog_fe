"use client";

import { Heart, Bookmark, Share2, MessageCircle } from "lucide-react";
import { useState, useEffect } from "react";
import LikePostButton from "./LikePostButton";
import SavePostButton from "./SavePostButton";

interface InteractionSidebarProps {
    postId: string | number;
    initialLikes: number;
    commentCount?: number;
}

export default function InteractionSidebar({ postId, initialLikes, commentCount = 0 }: InteractionSidebarProps) {
    const scrollToComments = () => {
        const commentSection = document.getElementById("comment-section");
        if (commentSection) {
            commentSection.scrollIntoView({ behavior: "smooth" });
        }
    };

    return (
        <div className="flex flex-col items-center gap-2 py-8 px-4 rounded-full border-2 border-black bg-transparent  transition-all duration-300">
            {/* Like Section */}
            <div className="flex flex-col items-center gap-1 group">
                <LikePostButton postId={postId} initialLikes={initialLikes} variant="sidebar" />
            </div>

            <div className="w-8 h-px bg-black/20 dark:bg-white/20" />

            {/* Save Section */}
            <div className="flex flex-col items-center gap-1 group">
                <SavePostButton postId={postId} variant="sidebar" />
            </div>

            <div className="w-8 h-px bg-black/20 dark:bg-white/20" />

            {/* Comment Section (Scroll shortcut) */}
            <button
                onClick={scrollToComments}
                className="group flex flex-col items-center gap-1 transition-all"
            >
                <div className="p-3 rounded-full text-gray-400 group-hover:text-black dark:group-hover:text-white transition-colors">
                    <MessageCircle size={22} />
                </div>
                {commentCount > 0 && (
                    <span className="text-xs font-bold text-gray-500 group-hover:text-black dark:group-hover:text-white">
                        {commentCount}
                    </span>
                )}
            </button>

            <div className="w-8 h-px bg-black/20 dark:bg-white/20" />

            {/* Share Section */}
            <button className="group p-3 rounded-full text-gray-400 hover:text-black dark:hover:text-white transition-colors">
                <Share2 size={22} />
            </button>
        </div>
    );
}
