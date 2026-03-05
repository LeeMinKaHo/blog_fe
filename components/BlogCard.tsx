import Link from "next/link";
import Image from "next/image";
import { Eye } from "lucide-react";

export default function BlogCard({ post }: { post: any }) {
   return (
      <Link href={`/blogs/${post.id}`}>
         <div className="flex gap-4 hover:cursor-pointer group mb-2">
            <div className="relative w-56 h-40 shrink-0">
               <Image
                  src={post.thumbnail || "https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=2070&auto=format&fit=crop"}
                  alt={post.title}
                  fill
                  className="object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
                  sizes="224px"
                  unoptimized
               />
            </div>
            <div className="flex flex-col justify-center">
               <h2 className="text-xl font-bold text-gray-800 mb-2 leading-tight line-clamp-2 group-hover:text-blue-600 transition-colors font-heading">
                  {post.title}
               </h2>
               <p className="text-gray-600 text-sm leading-relaxed line-clamp-2 mb-3 font-body">
                  {post.description || "No description available."}
               </p>
               {/* author + views */}
               <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                     <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="text-[10px] font-bold text-blue-600">
                           {(post.author?.[0] || "A").toUpperCase()}
                        </span>
                     </div>
                     <span className="text-gray-500 text-xs font-medium">
                        {post.author || "Unknown Author"}
                     </span>
                  </div>
                  {/* Lượt xem */}
                  <div className="flex items-center gap-1 text-gray-400 text-xs">
                     <Eye size={13} />
                     <span>{(post.views ?? 0).toLocaleString("vi-VN")}</span>
                  </div>
               </div>
            </div>
         </div>
      </Link>
   );
}
