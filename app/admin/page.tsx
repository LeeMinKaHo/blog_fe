"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import {
    TrendingUp, Users, FileText, Eye, MessageCircle, ArrowRight, Calendar,
    CheckCircle2, Clock, UserCheck, AlertCircle, Loader2
} from "lucide-react";
import Link from "next/link";
import { getAdminStats, getAdminBlogs, AdminStats } from "@/app/services/adminService";
import { useMe } from "@/app/hooks/useMe";
import { UserGrowthChart, BlogGrowthChart, CategoryPieChart, TopBlogsChart } from "@/components/admin/AdminCharts";

function StatCard({
    label, value, subLabel, icon, bg, textColor, trend
}: {
    label: string;
    value: string | number;
    subLabel?: string;
    icon: React.ReactNode;
    bg: string;
    textColor: string;
    trend?: { label: string; up: boolean };
}) {
    return (
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
            <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-2xl ${bg} group-hover:scale-110 transition-transform`}>
                    <div className={textColor}>{icon}</div>
                </div>
                {trend && (
                    <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-lg ${trend.up ? "bg-green-50 text-green-600" : "bg-red-50 text-red-500"}`}>
                        <TrendingUp size={12} className={trend.up ? "" : "rotate-180"} />
                        {trend.label}
                    </div>
                )}
            </div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">{label}</p>
            <h3 className="text-3xl font-extrabold text-gray-900">{typeof value === "number" ? value.toLocaleString("vi-VN") : value}</h3>
            {subLabel && <p className="text-xs text-gray-400 mt-1 font-medium">{subLabel}</p>}
        </div>
    );
}

function statusConfig(status: string) {
    switch (status) {
        case "Pushlish": return { label: "Đã xuất bản", className: "bg-green-100 text-green-700" };
        case "Draft": return { label: "Bản nháp", className: "bg-gray-100 text-gray-600" };
        default: return { label: status, className: "bg-orange-100 text-orange-700" };
    }
}

function timeAgo(dateStr: string) {
    const diff = Date.now() - new Date(dateStr).getTime();
    const h = Math.floor(diff / 3600000);
    if (h < 1) return `${Math.floor(diff / 60000)} phút trước`;
    if (h < 24) return `${h} giờ trước`;
    return `${Math.floor(h / 24)} ngày trước`;
}

export default function AdminDashboard() {
    const router = useRouter();
    const { data: me, isLoading: loadingMe } = useMe();

    // Redirect nếu không phải admin
    useEffect(() => {
        if (!loadingMe && me && me.role !== "Admin" && me.role !== "Moderator") {
            router.replace("/");
        }
    }, [me, loadingMe, router]);

    const { data: stats, isLoading: loadingStats } = useQuery<AdminStats>({
        queryKey: ["adminStats"],
        queryFn: getAdminStats,
        enabled: !!me,
    });

    const { data: recentPosts, isLoading: loadingPosts } = useQuery({
        queryKey: ["adminBlogs", { page: 1, limit: 5 }],
        queryFn: () => getAdminBlogs({ page: 1, limit: 5 }),
        enabled: !!me,
    });

    if (loadingMe) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 size={32} className="animate-spin text-blue-500" />
            </div>
        );
    }

    const s = stats;

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div>
                <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                    Chào mừng trở lại, {me?.name ?? "Admin"}! 👋
                </h1>
                <p className="text-gray-500 font-medium mt-1 text-sm">
                    Dưới đây là tổng quan về hệ thống blog.
                </p>
            </div>

            {/* Stats Grid */}
            {loadingStats ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="bg-white p-6 rounded-3xl border border-gray-100 h-36 animate-pulse" />
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard
                        label="Tổng bài viết"
                        value={s?.blogs.total ?? 0}
                        subLabel={`${s?.blogs.published ?? 0} đã xuất bản • ${s?.blogs.recentWeek ?? 0} bài/7 ngày`}
                        icon={<FileText size={22} />}
                        bg="bg-blue-50" textColor="text-blue-600"
                        trend={{ label: `+${s?.blogs.recentWeek ?? 0} tuần`, up: true }}
                    />
                    <StatCard
                        label="Tổng lượt xem"
                        value={s?.blogs.totalViews ?? 0}
                        icon={<Eye size={22} />}
                        bg="bg-purple-50" textColor="text-purple-600"
                    />
                    <StatCard
                        label="Người dùng"
                        value={s?.users.total ?? 0}
                        subLabel={`${s?.users.unverified ?? 0} chưa xác thực`}
                        icon={<Users size={22} />}
                        bg="bg-green-50" textColor="text-green-600"
                        trend={{ label: `+${s?.users.recentWeek ?? 0} tuần`, up: true }}
                    />
                    <StatCard
                        label="Bình luận"
                        value={s?.comments.total ?? 0}
                        icon={<MessageCircle size={22} />}
                        bg="bg-orange-50" textColor="text-orange-600"
                    />
                </div>
            )}

            {/* Secondary stats */}
            {s && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        { icon: <CheckCircle2 size={16} className="text-green-500" />, label: "Đã xuất bản", value: s.blogs.published },
                        { icon: <Clock size={16} className="text-gray-400" />, label: "Bản nháp", value: s.blogs.drafts },
                        { icon: <UserCheck size={16} className="text-blue-500" />, label: "Đang hoạt động", value: s.users.active },
                        { icon: <AlertCircle size={16} className="text-orange-400" />, label: "Chưa xác thực", value: s.users.unverified },
                    ].map((item, i) => (
                        <div key={i} className="bg-white rounded-2xl border border-gray-100 px-5 py-4 flex items-center gap-3 shadow-sm">
                            {item.icon}
                            <div>
                                <p className="text-xs text-gray-400 font-medium">{item.label}</p>
                                <p className="text-lg font-extrabold text-gray-900">{item.value}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Charts Section */}
            {s?.charts && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <UserGrowthChart data={s.charts.userGrowth} />
                    <BlogGrowthChart data={s.charts.blogGrowth} />
                    <CategoryPieChart data={s.charts.categoryStats} />
                    <TopBlogsChart data={s.charts.topBlogs} />
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Posts Table */}
                <div className="lg:col-span-2 bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
                    <div className="p-6 border-b border-gray-50 flex justify-between items-center">
                        <h3 className="text-lg font-bold text-gray-900">Bài viết gần đây</h3>
                        <Link href="/admin/posts" className="text-sm font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 group">
                            Xem tất cả
                            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                    <div className="overflow-x-auto">
                        {loadingPosts ? (
                            <div className="p-6 space-y-4">
                                {Array.from({ length: 4 }).map((_, i) => (
                                    <div key={i} className="h-10 bg-gray-50 rounded-xl animate-pulse" />
                                ))}
                            </div>
                        ) : (
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-gray-50/50">
                                        <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Tiêu đề</th>
                                        <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Trạng thái</th>
                                        <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Lượt xem</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {recentPosts?.items.map((post) => {
                                        const sc = statusConfig(post.status);
                                        return (
                                            <tr key={post.id} className="hover:bg-gray-50/30 transition-colors group">
                                                <td className="px-6 py-4">
                                                    <p className="text-sm font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1">{post.title}</p>
                                                    <p className="text-[10px] text-gray-400 font-medium mt-0.5 flex items-center gap-1 italic">
                                                        <Calendar size={10} />
                                                        {timeAgo(post.createdAt)} • {post.createdBy?.name ?? "—"}
                                                    </p>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider ${sc.className}`}>
                                                        {sc.label}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <span className="text-sm font-bold text-gray-700">{post.views.toLocaleString()}</span>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>

                {/* Quick links */}
                <div className="space-y-4">
                    <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-3xl p-6 text-white shadow-xl shadow-blue-200 relative overflow-hidden group">
                        <div className="relative z-10">
                            <h3 className="text-lg font-bold mb-2">Quản lý nhanh</h3>
                            <p className="text-sm text-blue-100 mb-5 font-medium">
                                {s ? `${s.blogs.drafts} bản nháp • ${s.users.unverified} chưa xác thực` : "Đang tải..."}
                            </p>
                            <div className="space-y-2">
                                <Link href="/admin/posts" className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white w-full py-2.5 px-4 rounded-xl font-bold text-sm transition-all">
                                    <FileText size={16} /> Quản lý bài viết
                                </Link>
                                <Link href="/admin/users" className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white w-full py-2.5 px-4 rounded-xl font-bold text-sm transition-all">
                                    <Users size={16} /> Quản lý người dùng
                                </Link>
                            </div>
                        </div>
                        <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
                    </div>

                    {/* User quick stats */}
                    {s && (
                        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
                            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Người dùng</h3>
                            <div className="space-y-3">
                                {[
                                    { label: "Tổng người dùng", value: s.users.total },
                                    { label: "Đang hoạt động", value: s.users.active },
                                    { label: "Quản trị viên", value: s.users.admins },
                                    { label: "Mới trong tuần", value: s.users.recentWeek },
                                ].map((row) => (
                                    <div key={row.label} className="flex items-center justify-between">
                                        <span className="text-xs text-gray-500 font-medium">{row.label}</span>
                                        <span className="text-xs font-extrabold text-gray-800">{row.value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
