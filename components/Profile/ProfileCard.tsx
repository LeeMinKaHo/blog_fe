"use client";

import { useState } from "react";
import { User, Phone, MapPin, Calendar, Mail, Edit2, Shield, Camera } from "lucide-react";
import { UserProfile } from "./profile.type";
import { ProfileEditForm } from "./ProfileEditForm";

interface ProfileCardProps {
   user: UserProfile;
}

export default function ProfileCard({ user }: ProfileCardProps) {
   const [isEditing, setIsEditing] = useState(false);

   return (
      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 max-w-4xl mx-auto">
         {/* Cover Image Placeholder */}
         <div className="h-48 bg-gradient-to-r from-blue-600 to-indigo-700 relative">
            <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
         </div>

         <div className="px-8 pb-10">
            <div className="relative flex justify-between items-end -mt-16 mb-8">
               <div className="relative group">
                  <div className="p-1.5 bg-white rounded-3xl shadow-xl">
                     <div className="w-36 h-36 bg-gray-100 rounded-2xl overflow-hidden border-4 border-white">
                        <img
                           src={user.avatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=2070&auto=format&fit=crop"}
                           alt={user.user.name}
                           className="w-full h-full object-cover"
                        />
                     </div>
                  </div>
                  <button className="absolute bottom-2 right-2 p-2 bg-blue-600 text-white rounded-xl shadow-lg border-2 border-white hover:bg-blue-700 transition-colors group-hover:scale-110">
                     <Camera size={18} />
                  </button>
               </div>

               {!isEditing && (
                  <button
                     onClick={() => setIsEditing(true)}
                     className="flex items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-2xl font-bold text-sm hover:bg-blue-600 transition-all active:scale-95 shadow-lg shadow-gray-200"
                  >
                     <Edit2 size={16} />
                     Chỉnh sửa hồ sơ
                  </button>
               )}
            </div>

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
               <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                  <div className="md:col-span-2 space-y-8">
                     <div>
                        <div className="flex items-center gap-3 mb-2">
                           <h1 className="text-3xl font-extrabold text-gray-900">{user.user.name}</h1>
                           <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider flex items-center gap-1">
                              <Shield size={10} />
                              {user.user.role}
                           </span>
                        </div>
                        <p className="text-gray-500 font-medium">Blogger & Developer tại Foxtek</p>
                     </div>

                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <InfoItem icon={<Mail size={18} />} label="Email" value={user.user.email} />
                        <InfoItem icon={<Phone size={18} />} label="Số điện thoại" value={user.phone || "Chưa cập nhật"} />
                        <InfoItem icon={<MapPin size={18} />} label="Địa chỉ" value={user.address || "Chưa cập nhật"} />
                        <InfoItem icon={<Calendar size={18} />} label="Ngày sinh" value={user.birthday || "Chưa cập nhật"} />
                     </div>
                  </div>

                  <div className="bg-gray-50 rounded-3xl p-6 border border-gray-100 h-fit">
                     <h3 className="font-bold text-gray-900 mb-4 text-lg">Hoạt động</h3>
                     <div className="space-y-4">
                        <div className="flex items-center justify-between">
                           <span className="text-sm text-gray-500 font-medium">Bài viết</span>
                           <span className="text-sm font-bold text-gray-900">24</span>
                        </div>
                        <div className="flex items-center justify-between">
                           <span className="text-sm text-gray-500 font-medium">Lượt thích</span>
                           <span className="text-sm font-bold text-gray-900">1.2k</span>
                        </div>
                        <div className="flex items-center justify-between">
                           <span className="text-sm text-gray-500 font-medium">Ngày tham gia</span>
                           <span className="text-sm font-bold text-gray-900">Oct 2023</span>
                        </div>
                     </div>
                     <div className="mt-8 pt-6 border-t border-gray-200">
                        <p className="text-xs text-gray-400 leading-relaxed italic">
                           "Học tập là một hành trình không có điểm dừng."
                        </p>
                     </div>
                  </div>
               </div>
            )}
         </div>
      </div>
   );
}

function InfoItem({ icon, label, value }: { icon: any, label: string, value: string }) {
   return (
      <div className="flex items-start gap-4 p-4 rounded-2xl hover:bg-gray-50 transition-colors">
         <div className="p-3 bg-white rounded-xl shadow-sm border border-gray-100 text-blue-600">
            {icon}
         </div>
         <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">{label}</p>
            <p className="text-sm font-bold text-gray-900">{value}</p>
         </div>
      </div>
   );
}
