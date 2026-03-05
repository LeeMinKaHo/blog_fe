"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    Search, Filter, ShieldCheck, ShieldOff, UserX, UserCheck,
    ChevronLeft, ChevronRight, Loader2
} from "lucide-react";
import {
    getAdminUsers, updateUserRole, toggleBanUser, AdminUser
} from "@/app/services/adminService";

const ROLE_OPTIONS = [
    { value: "all", label: "Tất cả" },
    { value: "User", label: "Người dùng" },
    { value: "Moderator", label: "Kiểm duyệt" },
    { value: "Admin", label: "Admin" },
];

function roleBadge(role: string) {
    switch (role) {
        case "Admin": return "bg-red-100 text-red-700";
        case "Moderator": return "bg-purple-100 text-purple-700";
        default: return "bg-gray-100 text-gray-600";
    }
}

function timeAgo(dateStr: string) {
    const diff = Date.now() - new Date(dateStr).getTime();
    const d = Math.floor(diff / 86400000);
    if (d === 0) return "Hôm nay";
    if (d < 7) return `${d} ngày trước`;
    return new Date(dateStr).toLocaleDateString("vi-VN");
}

const DEFAULT_AVATAR = "https://ui-avatars.com/api/?background=3b82f6&color=fff&name=";

export default function AdminUsersPage() {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [searchInput, setSearchInput] = useState("");
    const [roleFilter, setRoleFilter] = useState("all");
    const qc = useQueryClient();
    const LIMIT = 12;

    const { data, isLoading } = useQuery({
        queryKey: ["adminUsers", { page, search, role: roleFilter }],
        queryFn: () => getAdminUsers({ page, limit: LIMIT, search: search || undefined, role: roleFilter }),
    });

    const { mutate: changeRole } = useMutation({
        mutationFn: ({ id, role }: { id: number; role: string }) => updateUserRole(id, role as any),
        onSuccess: () => qc.invalidateQueries({ queryKey: ["adminUsers"] }),
    });

    const { mutate: banUser, isPending: banning } = useMutation({
        mutationFn: (id: number) => toggleBanUser(id),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["adminUsers"] });
            qc.invalidateQueries({ queryKey: ["adminStats"] });
        },
    });

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setSearch(searchInput);
        setPage(1);
    };

    const meta = data?.meta;
    const users = data?.items ?? [];

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
                <h1 className="text-2xl font-extrabold text-gray-900">Quản lý người dùng</h1>
                <p className="text-sm text-gray-400 mt-0.5">
                    {meta ? `${meta.total} người dùng tổng cộng` : "Đang tải..."}
                </p>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-wrap gap-3 items-center">
                <form onSubmit={handleSearch} className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2 border border-gray-100 flex-1 min-w-64">
                    <Search size={16} className="text-gray-400 shrink-0" />
                    <input
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        placeholder="Tìm theo tên hoặc email..."
                        className="bg-transparent text-sm outline-none flex-1 font-medium"
                    />
                </form>
                <div className="flex items-center gap-2">
                    <Filter size={16} className="text-gray-400" />
                    {ROLE_OPTIONS.map((opt) => (
                        <button
                            key={opt.value}
                            onClick={() => { setRoleFilter(opt.value); setPage(1); }}
                            className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-colors ${roleFilter === opt.value
                                ? "bg-blue-600 text-white"
                                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                }`}
                        >
                            {opt.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Grid cards */}
            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="h-32 bg-white rounded-2xl border border-gray-100 animate-pulse" />
                    ))}
                </div>
            ) : (
                <>
                    {users.length === 0 && (
                        <div className="text-center py-16 text-gray-400 font-medium">
                            Không tìm thấy người dùng nào
                        </div>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {users.map((user: AdminUser) => (
                            <div key={user.id} className={`bg-white rounded-2xl border shadow-sm p-5 transition-all hover:shadow-md ${!user.isActive ? "opacity-60 border-red-100 bg-red-50/30" : "border-gray-100"}`}>
                                <div className="flex items-start gap-3">
                                    {/* Avatar */}
                                    <img
                                        src={user.userAdvance?.avatar || `${DEFAULT_AVATAR}${encodeURIComponent(user.name)}`}
                                        alt={user.name}
                                        className="w-12 h-12 rounded-2xl object-cover border-2 border-gray-100"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src = `${DEFAULT_AVATAR}${encodeURIComponent(user.name)}`;
                                        }}
                                    />
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <p className="font-bold text-gray-900 text-sm truncate">{user.name}</p>
                                            {!user.isActive && (
                                                <span className="text-[9px] font-bold bg-red-100 text-red-600 px-1.5 py-0.5 rounded uppercase">Bị khóa</span>
                                            )}
                                            {!user.isVerified && (
                                                <span className="text-[9px] font-bold bg-orange-100 text-orange-600 px-1.5 py-0.5 rounded uppercase">Chưa xác thực</span>
                                            )}
                                        </div>
                                        <p className="text-xs text-gray-400 truncate mt-0.5">{user.email}</p>
                                        <p className="text-[10px] text-gray-300 mt-0.5">Tham gia {timeAgo(user.createdAt)}</p>
                                    </div>
                                </div>

                                {/* Role + Actions */}
                                <div className="mt-4 flex items-center gap-2">
                                    {/* Role badge / selector */}
                                    <select
                                        value={user.role}
                                        onChange={(e) => changeRole({ id: user.id, role: e.target.value })}
                                        className={`text-[10px] font-bold px-2 py-1.5 rounded-lg border-0 outline-none cursor-pointer appearance-none ${roleBadge(user.role)}`}
                                    >
                                        <option value="User">User</option>
                                        <option value="Moderator">Moderator</option>
                                        <option value="Admin">Admin</option>
                                    </select>

                                    <div className="flex-1" />

                                    {/* Ban/Unban */}
                                    <button
                                        onClick={() => banUser(user.id)}
                                        disabled={banning}
                                        title={user.isActive ? "Khóa tài khoản" : "Mở khóa tài khoản"}
                                        className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg transition-colors ${user.isActive
                                            ? "text-red-500 hover:bg-red-50"
                                            : "text-green-600 hover:bg-green-50"
                                            }`}
                                    >
                                        {banning ? (
                                            <Loader2 size={13} className="animate-spin" />
                                        ) : user.isActive ? (
                                            <><UserX size={13} /> Khóa</>
                                        ) : (
                                            <><UserCheck size={13} /> Mở khóa</>
                                        )}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Pagination */}
                    {meta && meta.totalPages > 1 && (
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-6 py-4 flex items-center justify-between">
                            <p className="text-xs text-gray-400 font-medium">
                                Trang {meta.page} / {meta.totalPages} • {meta.total} người dùng
                            </p>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setPage(p => Math.max(1, p - 1))}
                                    disabled={page === 1}
                                    className="p-2 rounded-xl text-gray-500 hover:bg-gray-100 disabled:opacity-40 transition-colors"
                                >
                                    <ChevronLeft size={16} />
                                </button>
                                {Array.from({ length: Math.min(5, meta.totalPages) }, (_, i) => {
                                    const p = Math.max(1, Math.min(meta.totalPages - 4, page - 2)) + i;
                                    return (
                                        <button
                                            key={p}
                                            onClick={() => setPage(p)}
                                            className={`w-9 h-9 rounded-xl text-sm font-bold transition-colors ${p === page ? "bg-blue-600 text-white" : "text-gray-500 hover:bg-gray-100"}`}
                                        >
                                            {p}
                                        </button>
                                    );
                                })}
                                <button
                                    onClick={() => setPage(p => Math.min(meta.totalPages, p + 1))}
                                    disabled={page === meta.totalPages}
                                    className="p-2 rounded-xl text-gray-500 hover:bg-gray-100 disabled:opacity-40 transition-colors"
                                >
                                    <ChevronRight size={16} />
                                </button>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
