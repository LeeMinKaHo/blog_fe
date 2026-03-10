"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getNotifications, markAsRead, markAllAsRead, Notification } from "@/app/services/notificationService";
import { Bell, Check, Heart, MessageSquare, Clock, Calendar, ChevronRight, Loader2 } from "lucide-react";
import Link from "next/link";

export default function NotificationsPage() {
    const queryClient = useQueryClient();

    const { data: notificationRes, isLoading } = useQuery({
        queryKey: ["notifications", "full-list"],
        queryFn: () => getNotifications(1, 50),
    });

    const markReadMutation = useMutation({
        mutationFn: (id: number) => markAsRead(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["notifications"] });
        },
    });

    const markAllReadMutation = useMutation({
        mutationFn: markAllAsRead,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["notifications"] });
        },
    });

    const notifications = notificationRes?.data || [];

    const getIcon = (type: string) => {
        switch (type) {
            case 'LIKE_POST':
            case 'LIKE_COMMENT':
                return <Heart className="text-red-500 fill-red-500" />;
            case 'COMMENT_POST':
                return <MessageSquare className="text-blue-500" />;
            default:
                return <Bell className="text-gray-500" />;
        }
    };

    const getLink = (notification: Notification) => {
        return `/blogs/${notification.targetId}`;
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <Loader2 size={40} className="animate-spin text-blue-500" />
                <p className="text-gray-500 font-medium">Đang tải thông báo của bạn...</p>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto px-4 py-12">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900">Thông báo</h1>
                    <p className="text-gray-500 mt-1">Cập nhật những hoạt động mới nhất liên quan đến bạn</p>
                </div>
                {notifications.some(n => !n.isRead) && (
                    <button
                        onClick={() => markAllReadMutation.mutate()}
                        className="flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-xl text-sm font-bold hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                    >
                        <Check size={18} /> Đánh dấu tất cả đã đọc
                    </button>
                )}
            </div>

            {notifications.length === 0 ? (
                <div className="bg-white rounded-3xl border border-gray-100 p-16 text-center shadow-sm">
                    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Bell size={40} className="text-gray-200" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 mb-2">Hộp thư trống</h2>
                    <p className="text-gray-500">Bạn chưa có thông báo nào vào lúc này.</p>
                    <Link href="/blogs" className="mt-8 inline-block bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200">
                        Khám phá bài viết
                    </Link>
                </div>
            ) : (
                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden divide-y divide-gray-50">
                    {notifications.map((notif) => (
                        <div
                            key={notif.id}
                            className={`p-6 hover:bg-gray-50 transition-all flex gap-5 relative group ${!notif.isRead ? "bg-blue-50/20" : ""}`}
                        >
                            <div className="shrink-0 relative">
                                <img
                                    src={notif.sender?.avatar || `https://ui-avatars.com/api/?name=${notif.sender?.name}`}
                                    alt={notif.sender?.name}
                                    className="w-14 h-14 rounded-2xl object-cover border border-gray-100 shadow-sm"
                                />
                                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-md border border-gray-50">
                                    <div className="scale-75">{getIcon(notif.type)}</div>
                                </div>
                            </div>

                            <div className="flex-1 min-w-0 py-1">
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <p className="text-gray-800 leading-relaxed text-lg">
                                            <span className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                                                {notif.sender?.name}
                                            </span>{" "}
                                            {notif.content}
                                        </p>
                                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-400">
                                            <span className="flex items-center gap-1.5 font-medium">
                                                <Clock size={14} className="text-gray-300" />
                                                {new Date(notif.createdAt).toLocaleTimeString("vi-VN", {
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </span>
                                            <span className="w-1 h-1 bg-gray-200 rounded-full" />
                                            <span className="flex items-center gap-1.5 font-medium">
                                                <Calendar size={14} className="text-gray-300" />
                                                {new Date(notif.createdAt).toLocaleDateString("vi-VN", {
                                                    day: '2-digit',
                                                    month: 'long',
                                                    year: 'numeric'
                                                })}
                                            </span>
                                        </div>
                                    </div>

                                    <ChevronRight size={20} className="text-gray-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all shrink-0 mt-1" />
                                </div>
                            </div>

                            {!notif.isRead && (
                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500" />
                            )}

                            <Link
                                href={getLink(notif)}
                                onClick={() => {
                                    if (!notif.isRead) markReadMutation.mutate(notif.id);
                                }}
                                className="absolute inset-0"
                            />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
