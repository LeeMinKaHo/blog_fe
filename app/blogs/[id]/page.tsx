import { Calendar, ChevronLeft, Clock, User } from "lucide-react";
import Link from "next/link";
import { getPostById } from "../../lib/api";
import CommentSection from "./CommentSection";
import SavePostButton from "@/components/SavePostButton";

interface BlogDetailProps {
   params: {
      id: string;
   };
}

export default async function BlogDetail({ params }: BlogDetailProps) {
   const { id } = await params;
   const post = await getPostById(id);

   if (!post) {
      return (
         <div className="flex flex-col items-center justify-center min-h-[50vh]">
            <h2 className="text-2xl font-semibold text-gray-600">
               Bài viết không tồn tại
            </h2>
            <Link href="/blogs" className="mt-4 text-blue-600 hover:underline">
               Quay lại danh sách
            </Link>
         </div>
      );
   }

   return (
      <article className="max-w-4xl mx-auto px-4 py-12">
         {/* Nút quay lại */}
         <Link
            href="/blogs"
            className="flex items-center text-sm text-gray-500 hover:text-black mb-8 transition-colors"
         >
            <ChevronLeft size={16} /> Quay lại bài viết
         </Link>

         {/* Header của bài viết */}
         <header className="mb-10 text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 leading-tight">
               {post.title}
            </h1>

            <div className="flex flex-col items-center gap-6">
               {/* Metadata (Thông tin thêm) */}
               <div className="flex flex-wrap justify-center items-center gap-6 text-gray-500 text-sm font-medium">
                  <div className="flex items-center gap-1">
                     <User size={16} className="text-blue-500" /> <span>{post.author || "Admin"}</span>
                  </div>
                  <div className="flex items-center gap-1">
                     <Calendar size={16} className="text-blue-500" /> <span>25 Tháng 12, 2023</span>
                  </div>
                  <div className="flex items-center gap-1">
                     <Clock size={16} className="text-blue-500" /> <span>5 phút đọc</span>
                  </div>
                  {/* Nút Lưu bài viết */}
                  <SavePostButton postId={id} />
               </div>


            </div>
         </header>

         {/* Hình ảnh chính với hiệu ứng Shadow */}
         <div className="relative aspect-video mb-12">
            <img
               src={post.thumbnail}
               alt={post.title}
               className="w-full h-full object-cover rounded-2xl shadow-2xl"
            />
         </div>

         {/* Nội dung bài viết */}
         <div className="prose prose-lg max-w-none prose-slate prose-headings:text-gray-900 prose-a:text-blue-600">
            {/* Mô tả ngắn (Sapô) */}
            <p className="text-xl text-gray-600 leading-relaxed font-medium mb-8 italic border-l-4 border-blue-500 pl-6">
               {post.description}
            </p>

            {/* Nội dung chính từ HTML */}
            <div
               className="content-rich-text"
               dangerouslySetInnerHTML={{ __html: post.content }}
            />
         </div>
         <CommentSection postId={Number(id)} />
         {/* Footer bài viết - Tag hoặc Share (tùy chọn) */}
         <footer className="mt-16 pt-8 border-t border-gray-100">
            <div className="bg-gray-50 p-6 rounded-xl text-center">
               <h3 className="font-bold mb-2">Hy vọng bài viết này hữu ích!</h3>
               <p className="text-gray-500 text-sm">
                  Đừng quên chia sẻ nếu bạn thấy nội dung này hay nhé.
               </p>
            </div>
         </footer>
      </article>
   );
}
