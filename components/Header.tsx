"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/app/lib/api";
import { useMe } from "@/app/hooks/useMe";
import { User, LogOut, Settings, LayoutDashboard, ChevronDown, Plus, Shield, Bookmark, FileText } from "lucide-react";

import SearchBox from "@/components/SearchBox";

export default function Header() {
   const { data: user, isLoading } = useMe();
   const [isMenuOpen, setIsMenuOpen] = useState(false);
   const dropdownRef = useRef<HTMLDivElement>(null);
   const queryClient = useQueryClient();

   const logoutMutation = useMutation({
      mutationFn: () => apiFetch("/auth/logout", { method: "POST" }),
      onSuccess: () => {
         queryClient.clear(); // 👈 Clear all queries to ensure no stale data
         window.location.href = "/"; // Restart at home for clean state
      },
   });

   // Close dropdown when clicking outside
   useEffect(() => {
      function handleClickOutside(event: MouseEvent) {
         if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
            setIsMenuOpen(false);
         }
      }
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
   }, []);

   return (
      <header className="w-full border-b bg-white sticky top-0 z-50 shadow-sm">
         <div className="mx-auto flex max-w-7xl items-center gap-4 py-4 px-6">
            <Link href="/" className="flex items-center gap-2 group">
               <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-xl group-hover:rotate-12 transition-transform">
                  B
               </div>
               <span className="text-xl font-bold text-gray-900 tracking-tight">
                  Foxtek <span className="text-blue-600">Blog</span>
               </span>
            </Link>

            {/* Search box — giữa logo và nav */}
            <div className="flex-1 flex justify-center">
               <SearchBox />
            </div>

            <nav className="flex items-center gap-8">
               <Link
                  href="/"
                  className="text-gray-600 hover:text-blue-600 transition-colors font-medium text-sm px-2 py-1"
               >
                  Trang chủ
               </Link>
               <Link
                  href="/blogs"
                  className="text-gray-600 hover:text-blue-600 transition-colors font-medium text-sm px-2 py-1"
               >
                  Bài viết
               </Link>

               {user && (
                  user.isVerified === false ? (
                     <div className="relative group">
                        <button
                           disabled
                           className="flex items-center gap-2 bg-gray-100 text-gray-400 px-4 py-2 rounded-xl text-sm font-bold cursor-not-allowed"
                        >
                           <Plus size={18} />
                           Viết bài
                        </button>
                        {/* Tooltip */}
                        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-56 bg-gray-900 text-white text-xs rounded-xl px-3 py-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 text-center leading-relaxed">
                           Vui lòng xác thực email trước khi viết bài
                        </div>
                     </div>
                  ) : (
                     <Link
                        href="/blogs/create"
                        className="flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-xl text-sm font-bold hover:bg-blue-600 hover:text-white transition-all"
                     >
                        <Plus size={18} />
                        Viết bài
                     </Link>
                  )
               )}

               {!isLoading && (
                  user ? (
                     <div className="relative" ref={dropdownRef}>
                        <button
                           onClick={() => setIsMenuOpen(!isMenuOpen)}
                           className="flex items-center gap-2 p-1 rounded-full hover:bg-gray-100 transition-colors"
                        >
                           <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-blue-500/20">
                              <img
                                 src={user.avatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=2070&auto=format&fit=crop"}
                                 alt={user.name}
                                 className="w-full h-full object-cover"
                              />
                           </div>
                           <ChevronDown size={14} className={`text-gray-500 transition-transform ${isMenuOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {/* Dropdown Menu */}
                        {isMenuOpen && (
                           <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 overflow-hidden animate-in fade-in zoom-in duration-200">
                              <div className="px-4 py-3 border-b border-gray-50">
                                 <p className="text-sm font-bold text-gray-900 truncate">{user.name}</p>
                                 <p className="text-xs text-gray-500 truncate">{user.email}</p>
                              </div>

                              <div className="py-1">
                                 <Link
                                    href="/profile"
                                    onClick={() => setIsMenuOpen(false)}
                                    className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                 >
                                    <User size={16} className="text-gray-400" />
                                    Hồ sơ cá nhân
                                 </Link>
                                 <Link
                                    href="/saved-posts"
                                    onClick={() => setIsMenuOpen(false)}
                                    className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                 >
                                    <Bookmark size={16} className="text-gray-400" />
                                    Bài viết đã lưu
                                 </Link>
                                 <Link
                                    href="/my-posts"
                                    onClick={() => setIsMenuOpen(false)}
                                    className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                 >
                                    <FileText size={16} className="text-gray-400" />
                                    Bài viết của tôi
                                 </Link>
                                 {user.role === "Admin" && (

                                    <Link
                                       href="/admin"
                                       onClick={() => setIsMenuOpen(false)}
                                       className="flex items-center gap-3 px-4 py-2 text-sm font-bold text-blue-600 hover:bg-blue-50 transition-colors"
                                    >
                                       <Shield size={16} />
                                       Trang quản trị
                                    </Link>
                                 )}
                                 <Link
                                    href="/dashboard"
                                    onClick={() => setIsMenuOpen(false)}
                                    className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                 >
                                    <LayoutDashboard size={16} className="text-gray-400" />
                                    Bảng điều khiển
                                 </Link>
                                 <Link
                                    href="/settings"
                                    onClick={() => setIsMenuOpen(false)}
                                    className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                 >
                                    <Settings size={16} className="text-gray-400" />
                                    Cài đặt
                                 </Link>
                              </div>

                              <div className="border-t border-gray-50 mt-1 pt-1">
                                 <button
                                    onClick={() => {
                                       setIsMenuOpen(false);
                                       logoutMutation.mutate();
                                    }}
                                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                                 >
                                    <LogOut size={16} />
                                    Đăng xuất
                                 </button>
                              </div>
                           </div>
                        )}
                     </div>
                  ) : (
                     <Link
                        href="/login"
                        className="rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 active:scale-95"
                     >
                        Đăng nhập
                     </Link>
                  )
               )}
            </nav>
         </div>
      </header>
   );
}
