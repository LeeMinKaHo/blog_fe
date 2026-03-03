"use client";

import {
    TrendingUp,
    TrendingDown,
    Users,
    FileText,
    Eye,
    MessageCircle,
    ArrowRight,
    Calendar
} from "lucide-react";
import Link from "next/link";

export default function AdminDashboard() {
    const stats = [
        { label: "Tổng bài viết", value: "128", icon: <FileText className="text-blue-600" />, trend: "+12%", up: true, bg: "bg-blue-50" },
        { label: "Tổng lượt xem", value: "45.2k", icon: <Eye className="text-purple-600" />, trend: "+25%", up: true, bg: "bg-purple-50" },
        { label: "Người dùng mới", value: "1,240", icon: <Users className="text-green-600" />, trend: "+8%", up: true, bg: "bg-green-50" },
        { label: "Bình luận", value: "842", icon: <MessageCircle className="text-orange-600" />, trend: "-3%", up: false, bg: "bg-orange-50" },
    ];

    const recentPosts = [
        { id: 1, title: "Hướng dẫn Next.js cho người mới", author: "Admin", status: "Đã xuất bản", date: "2 giờ trước", views: "1.2k" },
        { id: 2, title: "Tối ưu hóa Performance trong React", author: "Thiên Ân", status: "Bản nháp", date: "5 giờ trước", views: "0" },
        { id: 3, title: "Hệ sinh thái TypeScript 2024", author: "Admin", status: "Đã xuất bản", date: "1 ngày trước", views: "850" },
        { id: 4, title: "Làm chủ Tailwind CSS trong 10 phút", author: "Minh Thư", status: "Chờ duyệt", date: "2 ngày trước", views: "0" },
    ];

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div>
                <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Chào mừng trở lại, Admin! 👋</h1>
                <p className="text-gray-500 font-medium mt-1 text-sm">Dưới đây là tổng quan về hoạt động blog của bạn ngày hôm nay.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                    <div key={i} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                        <div className="flex justify-between items-start mb-4">
                            <div className={`p-3 rounded-2xl ${stat.bg} group-hover:scale-110 transition-transform`}>
                                {stat.icon}
                            </div>
                            <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-lg ${stat.up ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                                {stat.up ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                                {stat.trend}
                            </div>
                        </div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">{stat.label}</p>
                        <h3 className="text-3xl font-extrabold text-gray-900">{stat.value}</h3>
                    </div>
                ))}
            </div>

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
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-gray-50/50">
                                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Tiêu đề</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Trạng thái</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Lượt xem</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {recentPosts.map((post) => (
                                    <tr key={post.id} className="hover:bg-gray-50/30 transition-colors cursor-pointer group">
                                        <td className="px-6 py-4">
                                            <div>
                                                <p className="text-sm font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{post.title}</p>
                                                <p className="text-[10px] text-gray-400 font-medium mt-0.5 flex items-center gap-1 italic">
                                                    <Calendar size={10} /> {post.date} • bởi {post.author}
                                                </p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider ${post.status === 'Đã xuất bản'
                                                    ? 'bg-green-100 text-green-700'
                                                    : post.status === 'Bản nháp'
                                                        ? 'bg-gray-100 text-gray-600'
                                                        : 'bg-orange-100 text-orange-700'
                                                }`}>
                                                {post.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <span className="text-sm font-bold text-gray-700">{post.views}</span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Quick Actions / Activity */}
                <div className="space-y-6">
                    <div className="bg-blue-600 rounded-3xl p-6 text-white shadow-xl shadow-blue-200 relative overflow-hidden group">
                        <div className="relative z-10">
                            <h3 className="text-lg font-bold mb-2">Thống kê nhanh</h3>
                            <p className="text-sm text-blue-100 mb-6 font-medium">Bạn có 5 bài viết chờ duyệt và 12 bình luận mới chưa phản hồi.</p>
                            <button className="bg-white text-blue-600 w-full py-3 rounded-2xl font-bold text-sm hover:bg-blue-50 transition-all shadow-lg active:scale-95">
                                Kiểm duyệt ngay
                            </button>
                        </div>
                        <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
                    </div>

                    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 overflow-hidden relative">
                        <h3 className="text-lg font-bold text-gray-900 mb-6">Hoạt động hệ thống</h3>
                        <div className="space-y-6 relative">
                            <div className="absolute left-1.5 top-2 bottom-2 w-0.5 bg-gray-100"></div>
                            {[
                                { time: "10:30 AM", event: "Admin đã xóa một bài viết spam", color: "bg-red-500" },
                                { time: "09:15 AM", event: "Người dùng 'Minh' vừa đăng ký", color: "bg-green-500" },
                                { time: "Yesterday", event: "Báo cáo tháng đã được tạo", color: "bg-blue-500" },
                            ].map((item, i) => (
                                <div key={i} className="flex gap-4 relative">
                                    <div className={`w-3 h-3 rounded-full ${item.color} mt-1.5 border-2 border-white shadow-sm shrink-0 z-10`}></div>
                                    <div>
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider leading-none mb-1">{item.time}</p>
                                        <p className="text-sm font-bold text-gray-900 leading-snug">{item.event}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
