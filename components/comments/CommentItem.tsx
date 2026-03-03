"use client";
// components/comments/CommentItem.tsx
import { useState } from "react";
import { Comment } from "./comment.type";
import CommentForm from "./CommentForm";
import { apiFetch, createComment } from "@/app/lib/api";
import useSWR, { mutate } from "swr";
import { AuthGuard } from "../AuthGuard";

interface Props {
   comment: Comment;
}
const likeComment = (
   commentId: number
): Promise<{ liked: boolean; totalLike: number }> =>
   apiFetch(`/comments/${commentId}/like`, {
      method: "POST",
   });
export const fetcher = async (url: string) => {
   const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${url}`, {
      credentials: "include",
   });

   const json = await res.json();
   return json.data; // 👈 QUAN TRỌNG
};
export default function CommentItem({ comment }: Props) {
   const [showReply, setShowReply] = useState(false);
   const [liked, setLiked] = useState(false);
   const [showReplies, setShowReplies] = useState(false);
   const [showReplyForm, setShowReplyForm] = useState(false);
   const [likeCount, setLikeCount] = useState(comment.totalLike);
   const { data: replies = [], isLoading } = useSWR(
      showReplies ? `/comments/${comment.id}/replies` : null,
      fetcher
   );

   return (
      <div className="flex gap-3 py-3 border-b">
         <img
            src={
               comment.user?.avatar ||
               "https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg"
            }
            alt="avatar"
            className="w-9 h-9 rounded-full"
         />

         <div className="flex-1">
            <div className="flex items-center gap-2">
               <span className="font-semibold">{comment.user?.name || "Người dùng"}</span>
               <span className="text-xs text-gray-500">
                  {new Date(comment.createdAt).toLocaleString()}
               </span>
            </div>

            <p className="mt-1 text-sm text-gray-800">{comment.content}</p>
            {/* actions */}
            <div className="flex gap-4 text-sm text-gray-600 mt-1">
               <button className="hover:text-blue-600">
                  Like ({likeCount})
               </button>

               <button
                  onClick={() => setShowReplies((v) => !v)}
                  className="hover:text-blue-600"
               >
                  {showReplies ? "Hide replies" : `View replies`}
               </button>
               <button
                  onClick={() => setShowReplyForm((v) => !v)}
                  className="hover:text-blue-600"
               >
                  Reply
               </button>
            </div>

            {/* replies */}
            {showReplies && (
               <div className="mt-2 ml-5 border-l-2 border-gray-200 pl-4 space-y-2">
                  {isLoading && (
                     <p className="text-xs text-gray-500">Loading replies...</p>
                  )}

                  {!isLoading &&
                     replies.map((reply: Comment) => (
                        <CommentItem key={reply.id} comment={reply} />
                     ))}
               </div>
            )}
            {showReplyForm && (
               <AuthGuard>
                  <CommentForm
                     onSubmit={async (content) => {
                        await createComment({
                           postId: comment.postId,
                           parentId: comment.id, // 👈 CHÌA KHÓA
                           content,
                        });

                        mutate(`/comments/post?postId=${comment.postId}`);
                        setShowReply(false);
                     }}
                  />
               </AuthGuard>
            )}
         </div>
      </div>
   );
}
