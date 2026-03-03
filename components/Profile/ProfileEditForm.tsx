"use client";

import { useState } from "react";
import { UserProfile } from "./profile.type";
import { Save, X } from "lucide-react";

interface ProfileFormState {
   name: string;
   phone: string;
   address: string;
   gender: string;
}

interface ProfileEditFormProps {
   user: UserProfile;
   onCancel: () => void;
   onSuccess: () => void;
}

export function ProfileEditForm({ user, onCancel, onSuccess }: ProfileEditFormProps) {
   const [form, setForm] = useState<ProfileFormState>({
      name: user.user.name ?? "",
      phone: user.phone ?? "",
      address: user.address ?? "",
      gender: user.gender ?? "",
   });
   const [loading, setLoading] = useState(false);

   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setLoading(true);

      // Simulate API call
      setTimeout(() => {
         setLoading(false);
         onSuccess();
      }, 1000);
   };

   return (
      <form onSubmit={handleSubmit} className="space-y-6">
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
               <label className="text-xs font-bold text-gray-500 uppercase ml-1">Họ và tên</label>
               <input
                  className="w-full bg-gray-50 border border-gray-100 px-4 py-3 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all font-medium text-gray-800"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Nhập họ và tên"
               />
            </div>

            <div className="space-y-2">
               <label className="text-xs font-bold text-gray-500 uppercase ml-1">Số điện thoại</label>
               <input
                  className="w-full bg-gray-50 border border-gray-100 px-4 py-3 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all font-medium text-gray-800"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="Nhập số điện thoại"
               />
            </div>

            <div className="space-y-2 md:col-span-2">
               <label className="text-xs font-bold text-gray-500 uppercase ml-1">Địa chỉ</label>
               <input
                  className="w-full bg-gray-50 border border-gray-100 px-4 py-3 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all font-medium text-gray-800"
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  placeholder="Nhập địa chỉ của bạn"
               />
            </div>

            <div className="space-y-2">
               <label className="text-xs font-bold text-gray-500 uppercase ml-1">Giới tính</label>
               <select
                  className="w-full bg-gray-50 border border-gray-100 px-4 py-3 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all font-medium text-gray-800 appearance-none cursor-pointer"
                  value={form.gender}
                  onChange={(e) => setForm({ ...form, gender: e.target.value })}
               >
                  <option value="">Chọn giới tính</option>
                  <option value="MALE">Nam</option>
                  <option value="FEMALE">Nữ</option>
                  <option value="OTHER">Khác</option>
               </select>
            </div>
         </div>

         <div className="flex gap-4 pt-4">
            <button
               type="submit"
               disabled={loading}
               className="flex-1 bg-blue-600 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-blue-700 transition-all active:scale-[0.98] disabled:opacity-50"
            >
               <Save size={18} />
               {loading ? "Đang lưu..." : "Lưu thay đổi"}
            </button>

            <button
               type="button"
               disabled={loading}
               onClick={onCancel}
               className="flex-1 bg-gray-100 text-gray-700 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-gray-200 transition-all active:scale-[0.98]"
            >
               <X size={18} />
               Hủy
            </button>
         </div>
      </form>
   );
}
