"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { checkIsFollowing, toggleFollow } from "@/app/services/userService";
import { useMe } from "@/app/hooks/useMe";
import { useToast } from "./toast/ToastContext";
import { Loader2, UserPlus, UserMinus, UserCheck } from "lucide-react";

interface FollowButtonProps {
    userId: number;
    userName?: string;
}

export default function FollowButton({ userId, userName }: FollowButtonProps) {
    const { data: me } = useMe();
    const toast = useToast();
    const queryClient = useQueryClient();

    const { data: isFollowing, isLoading: isChecking } = useQuery({
        queryKey: ["isFollowing", userId],
        queryFn: () => checkIsFollowing(userId),
        enabled: !!me && me.id !== userId,
    });

    const { mutate: handleFollow, isPending } = useMutation({
        mutationFn: () => toggleFollow(userId),
        onSuccess: (res) => {
            queryClient.invalidateQueries({ queryKey: ["isFollowing", userId] });
            queryClient.invalidateQueries({ queryKey: ["userStats", userId] });
            // Nếu là trang profile của chính mình thì cũng nên update
            queryClient.invalidateQueries({ queryKey: ["userStats"] });
            toast.success(res.message);
        },
        onError: (err: any) => {
            toast.error(err.message || "Có lỗi xảy ra");
        }
    });

    if (!me || me.id === userId) return null;

    const isLoading = isChecking || isPending;

    return (
        <button
            onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleFollow();
            }}
            disabled={isLoading}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-bold transition-all active:scale-95 shadow-sm ${
                isFollowing
                    ? "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    : "bg-blue-600 text-white hover:bg-blue-700 shadow-blue-100"
            }`}
        >
            {isLoading ? (
                <Loader2 size={14} className="animate-spin" />
            ) : isFollowing ? (
                <>
                    <UserCheck size={14} />
                    <span>Đang theo dõi</span>
                </>
            ) : (
                <>
                    <UserPlus size={14} />
                    <span>Theo dõi</span>
                </>
            )}
        </button>
    );
}
