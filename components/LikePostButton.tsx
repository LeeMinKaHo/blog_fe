"use client";

import { Heart, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiClient } from "@/app/lib/apiClient";
import { useMe } from "@/app/hooks/useMe";
import { useToast } from "./toast/ToastContext";

interface LikePostButtonProps {
    postId: string | number;
    initialLikes: number;
    variant?: "default" | "sidebar";
}

export default function LikePostButton({ postId, initialLikes, variant = "default" }: LikePostButtonProps) {
    const { data: me } = useMe();
    const toast = useToast();
    const [liked, setLiked] = useState(false);
    const [totalLikes, setTotalLikes] = useState(initialLikes);

    // Giả sử có 1 API để check xem user đã like chưa, nhưng ở đây ta có thể fetch khi mount nếu cần.
    // Tuy nhiên, để đơn giản, ta chỉ handle toggle.

    const { mutate: toggleLike, isPending } = useMutation({
        mutationFn: async () => {
            if (!me) {
                toast.warning("Vui lòng đăng nhập để thích bài viết");
                return;
            }

            return apiClient<{ liked: boolean; totalLikes: number }>("/blogs/like-blog", {
                method: "POST",
                body: JSON.stringify({ postId: Number(postId) }),
            });
        },
        onSuccess: (res) => {
            if (res) {
                setLiked(res.liked);
                setTotalLikes(res.totalLikes);
            }
        },
    });

    if (variant === "sidebar") {
        return (
            <button
                onClick={() => toggleLike()}
                disabled={isPending}
                className="group flex flex-col items-center gap-1.5 transition-all"
            >
                <div 
                    className={`p-3 rounded-full transition-all ${
                        liked 
                        ? "text-red-500" 
                        : "text-gray-400 group-hover:text-black dark:group-hover:text-white"
                    }`}
                >
                    {isPending ? (
                        <Loader2 size={22} className="animate-spin" />
                    ) : (
                        <Heart size={22} fill={liked ? "currentColor" : "none"} />
                    )}
                </div>
                <span className={`text-xs font-bold ${liked ? "text-red-500" : "text-gray-500 group-hover:text-black dark:group-hover:text-white"}`}>
                    {totalLikes}
                </span>
            </button>
        );
    }

    return (
        <button
            onClick={() => toggleLike()}
            disabled={isPending}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition-all ${liked
                ? "bg-red-50 border-red-200 text-red-500 shadow-sm"
                : "bg-white border-gray-200 text-gray-500 hover:border-red-200 hover:text-red-400"
                }`}
        >
            {isPending ? (
                <Loader2 size={16} className="animate-spin" />
            ) : (
                <Heart size={16} fill={liked ? "currentColor" : "none"} />
            )}
            <span className="text-sm font-bold">{totalLikes > 0 ? totalLikes : "Thích"}</span>
        </button>
    );
}
