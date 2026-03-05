"use client";

import { useState } from "react";
import { UserProfile, UpdateProfilePayload, updateProfile } from "@/app/services/userService";
import { Save, X, Loader2 } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface ProfileEditFormProps {
   user: UserProfile;
   onCancel: () => void;
   onSuccess: () => void;
}

export function ProfileEditForm({ user, onCancel, onSuccess }: ProfileEditFormProps) {
   const qc = useQueryClient();
   const [form, setForm] = useState<UpdateProfilePayload>({
      name: user.user.name ?? "",
      phone: user.phone ?? "",
      address: user.address ?? "",
      gender: user.gender ?? "",
      birthday: user.birthday
         ? user.birthday.split("T")[0]  // "2000-01-15T..." → "2000-01-15"
         : "",
   });
   const [error, setError] = useState("");

   const { mutate: save, isPending } = useMutation({
      mutationFn: () => updateProfile(form),
      onSuccess: (updatedProfile) => {
         // Cập nhật cache với data mới
         qc.setQueryData(["profile"], updatedProfile);
         qc.invalidateQueries({ queryKey: ["profile"] });
         setError("");
         onSuccess();
      },
      onError: (err: any) => {
         setError(err?.message ?? "Có lỗi xảy ra, vui lòng thử lại");
      },
   });

   const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      setError("");
      if (!form.name?.trim()) {
         setError("Tên không được để trống");
         return;
      }
      save();
   };

   const inputClass = "w-full bg-gray-50 border border-gray-100 px-4 py-3 rounded-2xl outline-none focus:ring-2 focus:ring-blue-400 focus:bg-white transition-all font-medium text-gray-800 text-sm";
   const labelClass = "text-[11px] font-bold text-gray-500 uppercase tracking-widest ml-1 mb-1 block";

   return (
      <form onSubmit={handleSubmit} className="space-y-6">
         <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Tên */}
            <div>
               <label className={labelClass}>Họ và tên</label>
               <input
                  className={inputClass}
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Nhập họ và tên"
               />
            </div>

            {/* SĐT */}
            <div>
               <label className={labelClass}>Số điện thoại</label>
               <input
                  className={inputClass}
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="Nhập số điện thoại"
               />
            </div>

            {/* Địa chỉ */}
            <div className="md:col-span-2">
               <label className={labelClass}>Địa chỉ</label>
               <input
                  className={inputClass}
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  placeholder="Nhập địa chỉ của bạn"
               />
            </div>

            {/* Giới tính */}
            <div>
               <label className={labelClass}>Giới tính</label>
               <select
                  className={inputClass + " cursor-pointer appearance-none"}
                  value={form.gender}
                  onChange={(e) => setForm({ ...form, gender: e.target.value })}
               >
                  <option value="">Chọn giới tính</option>
                  <option value="MALE">Nam</option>
                  <option value="FEMALE">Nữ</option>
                  <option value="OTHER">Khác</option>
               </select>
            </div>

            {/* Ngày sinh */}
            <div>
               <label className={labelClass}>Ngày sinh</label>
               <input
                  type="date"
                  className={inputClass}
                  value={form.birthday as string}
                  onChange={(e) => setForm({ ...form, birthday: e.target.value })}
               />
            </div>
         </div>

         {/* Error */}
         {error && (
            <p className="text-sm text-red-500 bg-red-50 px-4 py-3 rounded-xl border border-red-100">
               {error}
            </p>
         )}

         {/* Actions */}
         <div className="flex gap-4 pt-2">
            <button
               type="submit"
               disabled={isPending}
               className="flex-1 bg-blue-600 text-white py-3.5 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-blue-700 transition-all active:scale-[0.98] disabled:opacity-50"
            >
               {isPending ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
               {isPending ? "Đang lưu..." : "Lưu thay đổi"}
            </button>

            <button
               type="button"
               disabled={isPending}
               onClick={onCancel}
               className="flex-1 bg-gray-100 text-gray-700 py-3.5 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-gray-200 transition-all active:scale-[0.98]"
            >
               <X size={18} />
               Hủy
            </button>
         </div>
      </form>
   );
}
