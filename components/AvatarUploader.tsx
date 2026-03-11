"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { useToast } from "@/components/toast";

export default function AvatarUploader({ avatar }: { avatar: string }) {
   const toast = useToast();
   const fileInputRef = useRef<HTMLInputElement>(null);
   const [preview, setPreview] = useState(avatar);
   const [loading, setLoading] = useState(false);

   const handleClick = () => {
      fileInputRef.current?.click();
   };

   const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      // preview ngay cho mượt UX
      setPreview(URL.createObjectURL(file));

      const formData = new FormData();
      formData.append("file", file);

      try {
         setLoading(true);

         // 1️⃣ upload ảnh
         const uploadRes = await fetch("http://localhost:3000/files/upload", {
            method: "POST",
            body: formData,
            credentials: "include",
         });

         const uploadData = await uploadRes.json();
         const avatarUrl = uploadData.data.url; // 👈 backend trả về
         console.log("uploaded avatar url:", uploadData);
         // 2️⃣ update user
         await fetch("http://localhost:3000/users", {
            method: "PUT",
            headers: {
               "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({
               avatar: avatarUrl,
            }),
         });
         console.log("updated user avatar", avatarUrl);
         setPreview(avatarUrl);
         toast.success("Cập nhật avatar thành công! ✨");
      } catch (err) {
         console.error(err);
         toast.error("Cập nhật avatar thất bại!");
      } finally {
         setLoading(false);
      }
   };
   console.log("avatar uploader render with avatar:", preview);
   return (
      <div className="relative w-14 h-14 cursor-pointer">
         {preview && (
            <Image
               src={preview}
               alt="Avatar"
               fill
               className={`rounded-full object-cover ${loading ? "opacity-50" : ""
                  }`}
               onClick={handleClick}
               unoptimized
            />
         )}

         <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            hidden
            onChange={handleFileChange}
         />
      </div>
   );
}
