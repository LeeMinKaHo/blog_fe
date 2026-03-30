import Link from "next/link";
import Image from "next/image";
import { Eye } from "lucide-react";

export default function BlogCard({ post }: { post: any }) {
   return (
      <div className="flex flex-col md:flex-row gap-4 md:gap-6 p-3 md:p-4 rounded-xl hover:bg-white hover:shadow-xl transition-all duration-300 animate-fade-in-up group border border-transparent hover:border-gray-100">
         {/* Link cho ảnh */}
         <Link href={`/blogs/${post.id}`} className="relative w-full md:w-64 aspect-video md:h-44 shrink-0 overflow-hidden rounded-lg shadow-md border border-gray-100">
            <Image
               src={post.thumbnail || "https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=2070&auto=format&fit=crop"}
               alt={post.title}
               fill
               className="object-cover group-hover:scale-110 transition-transform duration-500"
               sizes="(max-width: 768px) 100vw, 256px"
               unoptimized
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
         </Link>

         <div className="flex flex-col justify-center flex-1">
            {/* Link cho tiêu đề */}
            <Link href={`/blogs/${post.id}`}>
               <h2 className="text-2xl font-bold text-gray-800 mb-2 leading-tight line-clamp-2 group-hover:text-blue-600 transition-colors font-heading tracking-tight">
                  {post.title}
               </h2>
            </Link>
            
            <p className="text-gray-600 text-sm leading-relaxed line-clamp-2 mb-4 font-body">
               {post.description || "No description available."}
            </p>

            {/* footer: author + views */}
            <div className="flex items-center gap-4 mt-auto">
               <Link 
                  href={`/profile/${post.author?.id}`}
                  className="flex items-center gap-2 group/author px-2 py-1 hover:bg-blue-50 rounded-full transition-colors border border-transparent hover:border-blue-100 "
               >
                  <div className="w-8 h-8 rounded-full bg-linear-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-sm relative overflow-hidden">
                     {post.author?.avatar ? (
                        <Image src={post.author.avatar.startsWith('http') ? post.author.avatar : `http://localhost:3001/static/${post.author.avatar}`} alt={post.author.name} fill className="object-cover" unoptimized />
                     ) : (
                        <span className="text-xs font-bold text-white uppercase relative z-10">
                           {(post.author?.name?.[0] || post.author?.email?.[0] || "A")}
                        </span>
                     )}
                  </div>
                  <span className="text-gray-700 text-sm font-semibold hover:text-blue-600 transition-colors">
                     {post.author?.name || post.author?.email || "Unknown Author"}
                  </span>
               </Link>

               {/* Lượt xem */}
               <div className="flex items-center gap-1.5 text-gray-400 text-sm font-medium ml-2">
                  <Eye size={16} className="text-gray-300" />
                  <span>{(post.views ?? 0).toLocaleString("vi-VN")}</span>
               </div>
            </div>
         </div>
      </div>
   );
}
