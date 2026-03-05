"use client";

import { useEffect, useRef, useState } from "react";
import { incrementBlogViews } from "@/app/services/blogService";
import { Eye } from "lucide-react";

interface ViewTrackerProps {
    postId: number | string;
    initialViews?: number;
}

/**
 * Component theo dõi lượt xem bài viết.
 * Sử dụng Intersection Observer để phát hiện khi user cuộn qua 50% nội dung.
 * Khi trigger, gọi API POST /blogs/:id/view để tăng lượt xem (dùng pessimistic lock ở BE).
 * Mỗi lần vào trang chỉ đếm 1 lần duy nhất.
 */
export default function ViewTracker({ postId, initialViews = 0 }: ViewTrackerProps) {
    const [views, setViews] = useState(initialViews);
    const [counted, setCounted] = useState(false);
    const sentinelRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (counted) return;

        const sentinel = sentinelRef.current;
        if (!sentinel) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !counted) {
                    setCounted(true);
                    incrementBlogViews(postId)
                        .then((res) => setViews(res.views))
                        .catch(() => { /* bỏ qua lỗi, không ảnh hưởng UX */ });
                }
            },
            {
                // threshold 0 = chỉ cần sentinel xuất hiện trong viewport là trigger
                threshold: 0,
            }
        );

        observer.observe(sentinel);
        return () => observer.disconnect();
    }, [postId, counted]);

    return (
        <>
            {/* Hiển thị số lượt xem */}
            <div className="flex items-center gap-1.5 text-gray-500 text-sm">
                <Eye size={16} className="text-blue-500" />
                <span>{views.toLocaleString("vi-VN")} lượt xem</span>
            </div>

            {/* 
              Sentinel: đặt ở giữa bài viết (50%).
              Khi element này xuất hiện trong viewport → tức user đã cuộn qua nửa trang.
              Sử dụng div ẩn, không chiếm không gian hiển thị.
            */}
            <div
                ref={sentinelRef}
                aria-hidden="true"
                style={{ height: 1, width: "100%", pointerEvents: "none" }}
            />
        </>
    );
}
