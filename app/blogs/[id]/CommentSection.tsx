"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { MessageSquare, Lock } from "lucide-react";
import { getCommentsByPost, createComment, Comment } from "@/app/services/commentService";
import { useMe } from "@/app/hooks/useMe";
import CommentList from "@/components/comments/CommentList";
import CommentForm from "@/components/comments/CommentForm";

export default function CommentSection({ postId }: { postId: number }) {
   const { data: me } = useMe();
   const qc = useQueryClient();

   // ── Fetch comments ────────────────────────────────────────────────────────
   const {
      data: comments = [],
      isLoading,
   } = useQuery<Comment[]>({
      queryKey: ["comments", postId],
      queryFn: () => getCommentsByPost(postId),
      staleTime: 30_000,
   });

   // ── Create comment ────────────────────────────────────────────────────────
   const { mutateAsync: submitComment } = useMutation({
      mutationFn: (content: string) =>
         createComment({ postId, content }),
      onSuccess: (newComment) => {
         // Optimistic insert: thêm vào đầu danh sách không cần refetch
         qc.setQueryData<Comment[]>(["comments", postId], (old = []) => [
            newComment,
            ...old,
         ]);
      },
   });

   return (
      <section id="comment-section" className="mt-16 pt-10 border-t border-gray-100">
         {/* Header */}
         <div className="flex items-center gap-3 mb-8">
            <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center">
               <MessageSquare size={18} className="text-blue-600" />
            </div>
            <div>
               <h2 className="text-lg font-extrabold text-gray-900">
                  Bình luận
                  {!isLoading && comments.length > 0 && (
                     <span className="ml-2 text-sm font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                        {comments.length}
                     </span>
                  )}
               </h2>
               <p className="text-xs text-gray-400">Chia sẻ suy nghĩ của bạn về bài viết này</p>
            </div>
         </div>

         {/* Write comment */}
         {me ? (
            <div className="mb-8 bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
               <p className="text-xs font-semibold text-gray-500 mb-3 uppercase tracking-wide">
                  Viết bình luận
               </p>
               <CommentForm
                  onSubmit={async (content) => {
                     await submitComment(content);
                  }}
                  userAvatar={me.avatar}
                  userName={me.name}
                  placeholder="Chia sẻ suy nghĩ của bạn... (Ctrl+Enter để gửi)"
               />
            </div>
         ) : (
            // Prompt đăng nhập
            <div className="mb-8 flex items-center gap-3 px-5 py-4 bg-gray-50 rounded-2xl border border-gray-100">
               <div className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center shrink-0">
                  <Lock size={16} className="text-gray-400" />
               </div>
               <p className="text-sm text-gray-600">
                  <a href="/login" className="font-bold text-blue-600 hover:underline">
                     Đăng nhập
                  </a>{" "}
                  để tham gia bình luận.
               </p>
            </div>
         )}

         {/* List */}
         <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="divide-y divide-gray-50 px-5">
               <CommentList
                  comments={comments}
                  isLoading={isLoading}
                  postId={postId}
               />
            </div>
         </div>
      </section>
   );
}
