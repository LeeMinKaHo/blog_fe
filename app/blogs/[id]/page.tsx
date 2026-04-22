import { Calendar, ChevronLeft, Clock, Eye, User } from "lucide-react";
import Link from "next/link";
import { getPostById } from "../../lib/api";
import CommentSection from "./CommentSection";
import SavePostButton from "@/components/SavePostButton";
import LikePostButton from "@/components/LikePostButton";
import ViewTracker from "@/components/ViewTracker";
import FollowButton from "@/components/FollowButton";
import InteractionSidebar from "@/components/InteractionSidebar";
import TableOfContents from "@/components/TableOfContents";
import { extractToc } from "@/app/lib/toc-utils";

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

   // Xử lý nội dung: inject ID vào headings và lấy danh sách TOC
   const { modifiedHtml, headings } = extractToc(post.content ?? "");

   return (
      <div className="relative max-w-screen-2xl mx-auto px-4 py-12">
         {/* 3-column layout: TOC | Content | Interaction */}
         <div className="flex flex-col xl:flex-row gap-8">

            {/* ── Cột TOC (bên trái - chỉ desktop) ── */}
            <TableOfContents headings={headings} />

            {/* ── Cột nội dung chính ── */}
            <article className="flex-1 min-w-0">
               {/* Nút quay lại */}
               <Link
                  href="/blogs"
                  className="flex items-center text-sm text-gray-500 hover:text-black mb-8 transition-colors"
               >
                  <ChevronLeft size={16} /> Quay lại bài viết
               </Link>

               {/* Header của bài viết */}
               <header className="mb-10">
                  <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 leading-tight">
                     {post.title}
                  </h1>

                  <div className="flex flex-wrap items-center gap-5 text-gray-500 text-sm font-medium">
                     <div className="flex items-center gap-3">
                        <Link href={`/profile/${post.author?.id}`} className="flex items-center gap-1 group/author hover:bg-gray-100 px-2 py-1 rounded-md transition-colors">
                           <User size={16} className="text-blue-500 group-hover/author:text-blue-700" />
                           <span className="group-hover/author:text-blue-600 font-bold">{post.author?.name || "Member"}</span>
                        </Link>
                        {post.author?.id && (
                           <FollowButton userId={post.author.id} />
                        )}
                     </div>

                     <div className="flex items-center gap-1">
                        <Calendar size={16} className="text-blue-500" />
                        <span>
                           {post.createdAt
                              ? new Date(post.createdAt).toLocaleDateString("vi-VN", {
                                 day: "2-digit",
                                 month: "long",
                                 year: "numeric",
                              })
                              : "Chưa rõ"}
                        </span>
                     </div>

                     <div className="flex items-center gap-1">
                        <Clock size={16} className="text-blue-500" />
                        <span>5 phút đọc</span>
                     </div>

                     <div className="flex items-center gap-1">
                        <Eye size={16} className="text-blue-500" />
                        <span>{(post.views ?? 0).toLocaleString("vi-VN")} lượt xem</span>
                     </div>

                     {/* Like & Save chỉ hiện trên mobile */}
                     <div className="flex lg:hidden items-center gap-2">
                        <LikePostButton postId={id} initialLikes={post.totalLikes ?? 0} />
                        <SavePostButton postId={id} />
                     </div>
                  </div>
               </header>

               {/* Hình ảnh chính */}
               <div className="relative aspect-video mb-12">
                  <img
                     src={post.thumbnail}
                     alt={post.title}
                     className="w-full h-full object-cover rounded-2xl shadow-2xl"
                  />
               </div>

               {/* Nội dung bài viết */}
               <div className="prose prose-lg max-w-none prose-slate prose-headings:text-gray-900 prose-a:text-blue-600">
                  {/* Sapô */}
                  <p className="text-xl text-gray-600 leading-relaxed font-medium mb-8 italic border-l-4 border-blue-500 pl-6">
                     {post.description}
                  </p>

                  <ViewTracker postId={Number(id)} initialViews={post.views ?? 0} />

                  {/* Nội dung HTML đã được inject ID vào headings */}
                  <div
                     className="content-rich-text"
                     dangerouslySetInnerHTML={{ __html: modifiedHtml }}
                  />
               </div>

               <CommentSection postId={Number(id)} />

               <footer className="mt-16 pt-8 border-t border-gray-100">
                  <div className="bg-gray-50 p-6 rounded-xl text-center">
                     <h3 className="font-bold mb-2">Hy vọng bài viết này hữu ích!</h3>
                     <p className="text-gray-500 text-sm">
                        Đừng quên chia sẻ nếu bạn thấy nội dung này hay nhé.
                     </p>
                  </div>
               </footer>
            </article>

            {/* ── Cột tương tác (bên phải - chỉ desktop) ── */}
            <aside className="hidden lg:block w-20 shrink-0">
               <div className="sticky top-24">
                  <InteractionSidebar postId={id} initialLikes={post.totalLikes ?? 0} />
               </div>
            </aside>

         </div>
      </div>
   );
}

