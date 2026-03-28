"use client";

import { useState, useRef, useEffect } from "react";
import { Bell, Check, ExternalLink, Loader2, MessageSquare, Heart, UserPlus } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getNotifications, markAsRead, markAllAsRead, Notification } from "@/app/services/notificationService";
import { useNotification } from "@/app/hooks/useNotification";
import Link from "next/link";

export default function NotificationBell() {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const queryClient = useQueryClient();
    const { unreadCount } = useNotification();

    const { data: notificationRes, isLoading } = useQuery({
        queryKey: ["notifications", "list"],
        queryFn: () => getNotifications(1, 10),
        enabled: isOpen,
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

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const notifications = notificationRes?.data || [];

    const getIcon = (type: string) => {
        switch (type) {
            case 'LIKE_POST':
            case 'LIKE_COMMENT':
                return <Heart size={14} className="text-red-500 fill-red-500" />;
            case 'COMMENT_POST':
                return <MessageSquare size={14} className="text-blue-500" />;
            case 'FOLLOW':
                return <UserPlus size={14} className="text-green-500" />;
            default:
                return <Bell size={14} className="text-gray-500" />;
        }
    };

    const getLink = (notification: Notification) => {
        if (notification.type === 'LIKE_POST' || notification.type === 'COMMENT_POST') {
            return `/blogs/${notification.targetId}`;
        }
        if (notification.type === 'FOLLOW') {
            return `/profile`;
        }
        return `/blogs/${notification.targetId}`;
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors active:scale-95"
            >
                <Bell size={22} className={unreadCount > 0 ? "animate-pulse" : ""} />
                {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white ring-1 ring-red-500/20">
                        {unreadCount > 99 ? "99+" : unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-[60] animate-in fade-in zoom-in duration-200">
                    <div className="p-4 border-b flex items-center justify-between bg-gray-50/50">
                        <h3 className="font-bold text-gray-900">Thông báo</h3>
                        {unreadCount > 0 && (
                            <button
                                onClick={() => markAllReadMutation.mutate()}
                                className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
                            >
                                <Check size={14} /> Đánh dấu tất cả đã đọc
                            </button>
                        )}
                    </div>

                    <div className="max-h-[400px] overflow-y-auto">
                        {isLoading ? (
                            <div className="flex flex-col items-center justify-center py-10 text-gray-400 gap-3">
                                <Loader2 size={24} className="animate-spin text-blue-500" />
                                <p className="text-sm">Đang tải thông báo...</p>
                            </div>
                        ) : notifications.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12 text-gray-400 gap-2">
                                <Bell size={40} className="opacity-20 translate-y-2" />
                                <p className="text-sm font-medium">Bạn chưa có thông báo nào</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-gray-50">
                                {notifications.map((notif) => (
                                    <div
                                        key={notif.id}
                                        className={`p-4 hover:bg-gray-50 transition-colors flex gap-3 relative group ${!notif.isRead ? "bg-blue-50/30" : ""}`}
                                    >
                                        <div className="shrink-0 relative">
                                            <img
                                                src={notif.sender?.avatar || `https://ui-avatars.com/api/?name=${notif.sender?.name}`}
                                                alt={notif.sender?.name}
                                                className="w-10 h-10 rounded-full object-cover border border-gray-100 shadow-sm"
                                            />
                                            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center shadow-sm border border-gray-50">
                                                {getIcon(notif.type)}
                                            </div>
                                        </div>

                                        <div className="flex-1 min-w-0 pr-6">
                                            <p className="text-sm text-gray-800 leading-snug">
                                                <span className="font-bold text-gray-900">{notif.sender?.name}</span>{" "}
                                                {notif.content}
                                            </p>
                                            <p className="text-xs text-gray-400 mt-1 flex items-center gap-2">
                                                {new Date(notif.createdAt).toLocaleDateString("vi-VN", {
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </p>
                                        </div>

                                        {!notif.isRead && (
                                            <button
                                                onClick={() => markReadMutation.mutate(notif.id)}
                                                className="absolute right-4 top-1/2 -translate-y-1/2 w-2 h-2 bg-blue-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                                title="Đánh dấu đã đọc"
                                            />
                                        )}

                                        <Link
                                            href={getLink(notif)}
                                            onClick={() => {
                                                if (!notif.isRead) markReadMutation.mutate(notif.id);
                                                setIsOpen(false);
                                            }}
                                            className="absolute inset-0"
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="p-3 border-t bg-gray-50/50 text-center">
                        <Link
                            href="/notifications"
                            onClick={() => setIsOpen(false)}
                            className="text-sm font-bold text-gray-500 hover:text-blue-600 transition-colors inline-flex items-center gap-1"
                        >
                            Xem tất cả thông báo <ExternalLink size={14} />
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
}
