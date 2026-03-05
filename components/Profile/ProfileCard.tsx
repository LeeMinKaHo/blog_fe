"use client";

import { useState, useRef } from "react";
import {
   User, Phone, MapPin, Calendar, Mail, Edit2, Shield, Camera,
   FileText, Eye, MessageSquare, CheckCircle2, X, Loader2
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { UserProfile, UserStats, updateProfile, getUserStats } from "@/app/services/userService";
import { ProfileEditForm } from "./ProfileEditForm";

interface ProfileCardProps {
   user: UserProfile;
}

function formatJoinDate(dateStr: string | null | undefined) {
   if (!dateStr) return "Chưa rõ";
   return new Date(dateStr).toLocaleDateString("vi-VN", { month: "long", year: "numeric" });
}

function StatBox({ icon, label, value }: { icon: React.ReactNode; label: string; value: string | number }) {
   return (
      <div className="flex flex-col items-center gap-1 px-4 py-3 bg-white rounded-2xl border border-gray-100 shadow-sm">
         <div className="text-blue-500">{icon}</div>
         <span className="text-lg font-extrabold text-gray-900">{value}</span>
         <span className="text-[11px] text-gray-400 font-medium">{label}</span>
      </div>
   );
}

export default function ProfileCard({ user: initialUser }: ProfileCardProps) {
   const [isEditing, setIsEditing] = useState(false);
   const [avatarMode, setAvatarMode] = useState<"none" | "url">("none");
   const [avatarUrl, setAvatarUrl] = useState("");
   const qc = useQueryClient();

   // Lấy profile mới nhất
   const { data: user = initialUser } = useQuery<UserProfile>({
      queryKey: ["profile"],
      initialData: initialUser,
   });

   // Lấy stats
   const { data: stats } = useQuery<UserStats>({
      queryKey: ["userStats"],
      queryFn: getUserStats,
   });

   // Mutation update avatar
   const { mutate: saveAvatar, isPending: savingAvatar } = useMutation({
      mutationFn: (url: string) => updateProfile({ avatar: url }),
      onSuccess: () => {
         qc.invalidateQueries({ queryKey: ["profile"] });
         setAvatarMode("none");
         setAvatarUrl("");
      },
   });

   const currentAvatar = user.avatar || `https://ui-avatars.com/api/?background=3b82f6&color=fff&name=${encodeURIComponent(user.user.name)}`;

   return (
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 max-w-4xl mx-auto">
         {/* Cover */}
         <div className="h-44 bg-gradient-to-br from-blue-600 via-blue-500 to-indigo-600 relative">
            <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
         </div>

         <div className="px-8 pb-10">
            {/* Avatar & Edit button row */}
            <div className="relative flex justify-between items-end -mt-16 mb-6">
               {/* Avatar */}
               <div className="relative group">
                  <div className="p-1.5 bg-white rounded-3xl shadow-xl">
                     <div className="w-32 h-32 bg-gray-100 rounded-2xl overflow-hidden border-4 border-white">
                        <img
                           src={currentAvatar}
                           alt={user.user.name}
                           className="w-full h-full object-cover"
                           onError={(e) => {
                              (e.target as HTMLImageElement).src =
                                 `https://ui-avatars.com/api/?background=3b82f6&color=fff&name=${encodeURIComponent(user.user.name)}`;
                           }}
                        />
                     </div>
                  </div>
                  {/* Camera button */}
                  <button
                     onClick={() => setAvatarMode(avatarMode === "url" ? "none" : "url")}
                     className="absolute bottom-2 right-2 p-2 bg-blue-600 text-white rounded-xl shadow-lg border-2 border-white hover:bg-blue-700 transition-all group-hover:scale-110"
                     title="Đổi ảnh đại diện"
                  >
                     <Camera size={16} />
                  </button>
               </div>

               {!isEditing && (
                  <button
                     onClick={() => setIsEditing(true)}
                     className="flex items-center gap-2 bg-gray-900 text-white px-5 py-2.5 rounded-2xl font-bold text-sm hover:bg-blue-600 transition-all active:scale-95 shadow-lg shadow-gray-200"
                  >
                     <Edit2 size={15} />
                     Chỉnh sửa
                  </button>
               )}
            </div>

            {/* Avatar URL input */}
            {avatarMode === "url" && (
               <div className="mb-6 p-4 bg-blue-50 rounded-2xl border border-blue-100 animate-in slide-in-from-top-2 duration-200">
                  <p className="text-xs font-bold text-blue-700 mb-2 uppercase tracking-wide">Nhập URL ảnh đại diện</p>
                  <div className="flex gap-2">
                     <input
                        type="url"
                        value={avatarUrl}
                        onChange={(e) => setAvatarUrl(e.target.value)}
                        placeholder="https://example.com/avatar.jpg"
                        className="flex-1 bg-white border border-blue-200 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-300"
                     />
                     <button
                        onClick={() => { if (avatarUrl.trim()) saveAvatar(avatarUrl.trim()); }}
                        disabled={savingAvatar || !avatarUrl.trim()}
                        className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white text-sm font-bold rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-all"
                     >
                        {savingAvatar ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle2 size={14} />}
                        Lưu
                     </button>
                     <button
                        onClick={() => { setAvatarMode("none"); setAvatarUrl(""); }}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-white rounded-xl transition-colors"
                     >
                        <X size={16} />
                     </button>
                  </div>
                  {avatarUrl && (
                     <div className="mt-3 flex items-center gap-2">
                        <span className="text-xs text-gray-500">Xem trước:</span>
                        <img src={avatarUrl} alt="preview" className="w-10 h-10 rounded-xl object-cover border" onError={(e) => (e.target as HTMLImageElement).src = ""} />
                     </div>
                  )}
               </div>
            )}

            {/* Stats bar */}
            {stats && (
               <div className="grid grid-cols-3 gap-3 mb-8">
                  <StatBox icon={<FileText size={18} />} label="Bài viết" value={stats.totalPosts} />
                  <StatBox icon={<Eye size={18} />} label="Lượt xem" value={stats.totalViews.toLocaleString("vi-VN")} />
                  <StatBox icon={<MessageSquare size={18} />} label="Bình luận" value={stats.totalComments} />
               </div>
            )}

            {/* Main content */}
            {isEditing ? (
               <div className="animate-in slide-in-from-bottom-4 duration-300">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Cập nhật thông tin</h2>
                  <ProfileEditForm
                     user={user}
                     onCancel={() => setIsEditing(false)}
                     onSuccess={() => setIsEditing(false)}
                  />
               </div>
            ) : (
               <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {/* Info */}
                  <div className="md:col-span-2 space-y-6">
                     <div>
                        <div className="flex items-center gap-3 mb-1">
                           <h1 className="text-2xl font-extrabold text-gray-900">{user.user.name}</h1>
                           <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider flex items-center gap-1">
                              <Shield size={10} />
                              {user.user.role}
                           </span>
                        </div>
                        <p className="text-sm text-gray-500">{user.user.email}</p>
                     </div>

                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <InfoItem icon={<Mail size={16} />} label="Email" value={user.user.email} />
                        <InfoItem icon={<Phone size={16} />} label="Số điện thoại" value={user.phone || "Chưa cập nhật"} />
                        <InfoItem icon={<MapPin size={16} />} label="Địa chỉ" value={user.address || "Chưa cập nhật"} />
                        <InfoItem icon={<User size={16} />} label="Giới tính" value={
                           user.gender === "MALE" ? "Nam" :
                              user.gender === "FEMALE" ? "Nữ" :
                                 user.gender === "OTHER" ? "Khác" : "Chưa cập nhật"
                        } />
                        <InfoItem icon={<Calendar size={16} />} label="Ngày sinh"
                           value={user.birthday ? new Date(user.birthday).toLocaleDateString("vi-VN") : "Chưa cập nhật"}
                        />
                     </div>
                  </div>

                  {/* Activity sidebar */}
                  <div className="bg-gray-50 rounded-3xl p-6 border border-gray-100 h-fit">
                     <h3 className="font-bold text-gray-900 mb-4 text-sm uppercase tracking-wide">Hoạt động</h3>
                     <div className="space-y-4">
                        <ActivityRow label="Ngày tham gia" value={formatJoinDate(stats?.joinedAt)} />
                        <ActivityRow label="Tổng bài viết" value={`${stats?.totalPosts ?? "—"} bài`} />
                        <ActivityRow label="Tổng lượt xem" value={stats ? stats.totalViews.toLocaleString("vi-VN") : "—"} />
                        <ActivityRow label="Tổng bình luận" value={`${stats?.totalComments ?? "—"} bình luận`} />
                     </div>
                     {user.user.role === "Admin" && (
                        <div className="mt-6 pt-4 border-t border-gray-200">
                           <span className="flex items-center gap-1.5 text-xs font-bold text-blue-600">
                              <Shield size={12} />
                              Tài khoản quản trị viên
                           </span>
                        </div>
                     )}
                  </div>
               </div>
            )}
         </div>
      </div>
   );
}

function InfoItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
   return (
      <div className="flex items-start gap-3 p-3 rounded-2xl hover:bg-gray-50 transition-colors">
         <div className="p-2 bg-white rounded-xl shadow-sm border border-gray-100 text-blue-500 shrink-0">
            {icon}
         </div>
         <div className="min-w-0">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">{label}</p>
            <p className="text-sm font-semibold text-gray-800 truncate">{value}</p>
         </div>
      </div>
   );
}

function ActivityRow({ label, value }: { label: string; value: string }) {
   return (
      <div className="flex items-center justify-between">
         <span className="text-xs text-gray-500 font-medium">{label}</span>
         <span className="text-xs font-bold text-gray-800">{value}</span>
      </div>
   );
}
