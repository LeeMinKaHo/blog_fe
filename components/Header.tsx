"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/app/lib/api";
import { useMe } from "@/app/hooks/useMe";
import { User, LogOut, Settings, LayoutDashboard, ChevronDown, Plus, Shield, Bookmark, FileText, Menu, X } from "lucide-react";

import SearchBox from "@/components/SearchBox";
import NotificationBell from "@/components/NotificationBell";
import { usePathname } from "next/navigation";


export default function Header() {
   const pathname = usePathname();
   const { data: user, isLoading } = useMe();

   const [isMenuOpen, setIsMenuOpen] = useState(false);
   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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

   const [isScrolled, setIsScrolled] = useState(false);

   useEffect(() => {
      const handleScroll = () => {
         setIsScrolled(window.scrollY > 20);
      };
      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
   }, []);

   // Close mobile menu on route change
   useEffect(() => {
      setIsMobileMenuOpen(false);
   }, [pathname]);

   // Don't show header on admin pages
   if (pathname?.startsWith("/admin")) return null;

   return (
      <header
         className={`w-full sticky top-0 z-50 transition-all duration-300 ${isScrolled
               ? "bg-white/80 backdrop-blur-md shadow-lg border-b border-gray-100 py-2"
               : "bg-white border-b border-gray-100 py-4"
            }`}
      >
         <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 md:px-6">
            <Link href="/" className="flex items-center gap-2 group shrink-0">
               <div className="w-8 h-8 md:w-10 md:h-10 bg-blue-600 rounded-lg md:rounded-xl flex items-center justify-center text-white font-bold text-lg md:text-xl group-hover:rotate-12 transition-transform">
                  B
               </div>
               <span className="text-lg md:text-xl font-bold text-gray-900 tracking-tight hidden sm:inline-block">
                  Foxtek <span className="text-blue-600">Blog</span>
               </span>
            </Link>

            {/* Search box — Hidden on mobile, shown on md+ */}
            <div className="flex-1 hidden md:flex justify-center max-w-md mx-auto">
               <SearchBox />
            </div>

            <nav className="flex items-center gap-2 md:gap-8">
               <div className="hidden lg:flex items-center gap-6">
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
               </div>

               {user && (
                  <div className="hidden sm:block">
                     {user.isVerified === false ? (
                        <div className="relative group">
                           <button
                              disabled
                              className="flex items-center gap-2 bg-gray-100 text-gray-400 px-3 md:px-4 py-2 rounded-xl text-sm font-bold cursor-not-allowed"
                           >
                              <Plus size={18} />
                              <span className="hidden md:inline">Viết bài</span>
                           </button>
                           {/* Tooltip */}
                           <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-56 bg-gray-900 text-white text-xs rounded-xl px-3 py-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 text-center leading-relaxed">
                              Vui lòng xác thực email trước khi viết bài
                           </div>
                        </div>
                     ) : (
                        <Link
                           href="/blogs/create"
                           className="flex items-center gap-2 bg-blue-50 text-blue-600 px-3 md:px-4 py-2 rounded-xl text-sm font-bold hover:bg-blue-600 hover:text-white transition-all"
                        >
                           <Plus size={18} />
                           <span className="hidden md:inline">Viết bài</span>
                        </Link>
                     )}
                  </div>
               )}

               {!isLoading && (
                  user ? (
                     <div className="flex items-center gap-2 md:gap-4">
                        <NotificationBell />
                        <div className="relative" ref={dropdownRef}>
                           <button
                              onClick={() => setIsMenuOpen(!isMenuOpen)}

                              className="flex items-center gap-2 p-1 rounded-full hover:bg-gray-100 transition-colors"
                           >
                              <div className="w-8 h-8 md:w-9 md:h-9 rounded-full overflow-hidden border-2 border-blue-500/20 bg-blue-50 flex items-center justify-center">
                                 {user.avatar ? (
                                    <img
                                       src={user.avatar}
                                       alt={user.name}
                                       className="w-full h-full object-cover"
                                    />
                                 ) : (
                                    <User size={18} className="text-blue-500" />
                                 )}
                              </div>
                              <ChevronDown size={14} className={`text-gray-500 transition-transform hidden sm:block ${isMenuOpen ? 'rotate-180' : ''}`} />
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
                     </div>
                  ) : (

                     <Link
                        href="/login"
                        className="rounded-xl bg-blue-600 px-4 md:px-6 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 active:scale-95"
                     >
                        Đăng nhập
                     </Link>
                  )
               )}

               {/* Mobile Menu Toggle */}
               <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="p-2 lg:hidden text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  aria-label="Toggle mobile menu"
               >
                  {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
               </button>
            </nav>
         </div>

         {/* Mobile Drawer */}
         {isMobileMenuOpen && (
            <div className="lg:hidden absolute top-full left-0 w-full bg-white border-b border-gray-100 shadow-xl p-4 animate-in slide-in-from-top duration-300">
               <div className="flex flex-col gap-4">
                  <div className="md:hidden">
                     <SearchBox />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                     <Link href="/" className="flex items-center px-4 py-2 bg-gray-50 rounded-xl text-sm font-medium text-gray-700">Trang chủ</Link>
                     <Link href="/blogs" className="flex items-center px-4 py-2 bg-gray-50 rounded-xl text-sm font-medium text-gray-700">Bài viết</Link>
                  </div>
                  {!user && (
                     <Link href="/login" className="w-full text-center py-3 bg-blue-600 text-white rounded-xl font-bold">Đăng nhập</Link>
                  )}
               </div>
            </div>
         )}
      </header>
   );
}
