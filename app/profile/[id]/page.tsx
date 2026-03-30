"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { getUserProfileById, getUserStatsById } from "../../services/userService";
import ProfileCard from "@/components/Profile/ProfileCard";
import { Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function PublicProfilePage() {
   const { id } = useParams();
   const userId = Number(id);

   const { data: user, isLoading: profileLoading, error: profileError } = useQuery({
      queryKey: ["profile", userId],
      queryFn: () => getUserProfileById(userId),
      enabled: !!userId,
   });

   const { data: stats, isLoading: statsLoading } = useQuery({
      queryKey: ["userStats", userId],
      queryFn: () => getUserStatsById(userId),
      enabled: !!userId,
   });

   const isLoading = profileLoading || statsLoading;

   if (isLoading) {
      return (
         <div className="max-w-4xl mx-auto px-4 py-12 flex flex-col items-center justify-center min-h-[50vh]">
            <Loader2 className="w-10 h-10 animate-spin text-blue-500 mb-4" />
            <p className="text-gray-500 font-medium animate-pulse">Đang tải hồ sơ người dùng...</p>
         </div>
      );
   }

   if (profileError || !user) {
      return (
         <div className="max-w-4xl mx-auto px-4 py-12 text-center">
            <div className="bg-red-50 text-red-600 p-6 rounded-3xl inline-block mb-6">
               <h2 className="text-xl font-bold mb-2">Không tìm thấy người dùng</h2>
               <p className="text-sm opacity-80">Hồ sơ bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.</p>
            </div>
            <br />
            <Link href="/blogs" className="text-blue-600 hover:text-blue-800 font-bold flex items-center gap-2 justify-center">
               <ArrowLeft size={18} /> Quay lại danh sách bài viết
            </Link>
         </div>
      );
   }

   return (
      <div className="max-w-4xl mx-auto px-4 py-12">
         {/* Back button */}
         <Link
            href="/blogs"
            className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-blue-600 mb-8 transition-colors group"
         >
            <div className="p-1.5 rounded-lg bg-white border border-gray-100 shadow-sm group-hover:border-blue-100 group-hover:bg-blue-50">
               <ArrowLeft size={16} />
            </div>
            <span className="font-semibold uppercase tracking-wider text-[10px]">Quay lại</span>
         </Link>

         <ProfileCard 
            user={user} 
            stats={stats} 
            isOwnProfile={false} 
         />
      </div>
   );
}
