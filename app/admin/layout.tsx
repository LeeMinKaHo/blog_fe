"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    FileText,
    Users,
    Settings,
    LogOut,
    ExternalLink,
    Bell,
    Search,
    PlusCircle
} from "lucide-react";
import { AdminGuard } from "@/components/AdminGuard";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    const menuItems = [
        { icon: <LayoutDashboard size={20} />, label: "Dashboard", href: "/admin" },
        { icon: <FileText size={20} />, label: "Quản lý bài viết", href: "/admin/posts" },
        { icon: <Users size={20} />, label: "Người dùng", href: "/admin/users" },
        { icon: <Settings size={20} />, label: "Cài đặt", href: "/admin/settings" },
    ];

    return (
        <AdminGuard>
            <div className="flex min-h-screen bg-gray-50/50">
                {/* Sidebar */}
                <aside className="w-64 bg-white border-r border-gray-100 flex flex-col sticky top-0 h-screen">
                    <div className="p-6 border-b border-gray-50">
                        <Link href="/" className="flex items-center gap-3 group">
                            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-xl">
                                B
                            </div>
                            <span className="text-xl font-bold text-gray-900 tracking-tight">Admin <span className="text-blue-600">Panel</span></span>
                        </Link>
                    </div>

                    <nav className="flex-1 p-4 space-y-1">
                        {menuItems.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all ${isActive
                                            ? "bg-blue-600 text-white shadow-lg shadow-blue-200"
                                            : "text-gray-500 hover:bg-gray-50 hover:text-blue-600"
                                        }`}
                                >
                                    {item.icon}
                                    {item.label}
                                </Link>
                            );
                        })}
                    </nav>

                    <div className="p-4 border-t border-gray-50 space-y-2">
                        <Link
                            href="/"
                            className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold text-gray-500 hover:bg-gray-50 hover:text-blue-600 transition-all"
                        >
                            <ExternalLink size={20} />
                            Xem trang chủ
                        </Link>
                        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold text-red-500 hover:bg-red-50 transition-all">
                            <LogOut size={20} />
                            Đăng xuất
                        </button>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1 flex flex-col overflow-auto">
                    {/* Top Header */}
                    <header className="h-20 bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-30 px-8 flex items-center justify-between">
                        <div className="flex items-center gap-4 bg-gray-100/50 px-4 py-2 rounded-2xl w-96 border border-gray-50">
                            <Search size={18} className="text-gray-400" />
                            <input
                                type="text"
                                placeholder="Tìm kiếm mọi thứ..."
                                className="bg-transparent border-none outline-none text-sm w-full"
                            />
                        </div>

                        <div className="flex items-center gap-4">
                            <Link
                                href="/blogs/create"
                                className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 active:scale-95"
                            >
                                <PlusCircle size={18} />
                                Viết bài mới
                            </Link>
                            <button className="p-3 bg-white border border-gray-100 rounded-xl text-gray-500 hover:text-blue-600 hover:border-blue-100 transition-all relative">
                                <Bell size={20} />
                                <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                            </button>
                            <div className="w-px h-8 bg-gray-100 mx-2"></div>
                            <div className="flex items-center gap-3">
                                <div className="text-right hidden sm:block">
                                    <p className="text-sm font-bold text-gray-900 leading-none">Admin Blog</p>
                                    <p className="text-[10px] text-blue-600 font-bold uppercase tracking-wider mt-1 font-mono">Quản trị viên</p>
                                </div>
                                <div className="w-10 h-10 rounded-xl bg-gray-100 border-2 border-white shadow-sm overflow-hidden">
                                    <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=2070&auto=format&fit=crop" alt="admin" className="w-full h-full object-cover" />
                                </div>
                            </div>
                        </div>
                    </header>

                    <div className="p-8">
                        {children}
                    </div>
                </main>
            </div>
        </AdminGuard>
    );
}
