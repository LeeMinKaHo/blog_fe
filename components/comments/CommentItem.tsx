"use client";

import { useState } from "react";
import { Heart, MessageCircle, ChevronDown, ChevronUp, Pencil, Trash2, MoreHorizontal, Loader2 } from "lucide-react";
import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";
import {
   Comment,
   createComment,
   deleteComment,
   updateComment,
   toggleLikeComment,
   getReplies,
} from "@/app/services/commentService";
import { useMe } from "@/app/hooks/useMe";
import CommentForm from "./CommentForm";

const DEFAULT_AVATAR = "https://ui-avatars.com/api/?background=3b82f6&color=fff";

function timeAgo(dateStr: string) {
   const diff = Date.now() - new Date(dateStr).getTime();
   const m = Math.floor(diff / 60000);
   if (m < 1) return "Vừa xong";
   if (m < 60) return `${m} phút trước`;
   const h = Math.floor(m / 60);
   if (h < 24) return `${h} giờ trước`;
   const d = Math.floor(h / 24);
   if (d < 7) return `${d} ngày trước`;
   return new Date(dateStr).toLocaleDateString("vi-VN");
}

interface Props {
   comment: Comment;
   postId: number;
   isReply?: boolean;
   onDeleted?: (id: number) => void;
}

export default function CommentItem({ comment, postId, isReply = false, onDeleted }: Props) {
   const [showReplies, setShowReplies] = useState(false);
   const [showReplyForm, setShowReplyForm] = useState(false);
   const [isEditing, setIsEditing] = useState(false);
   const [showMenu, setShowMenu] = useState(false);
   const [liked, setLiked] = useState(false);
   const [likeCount, setLikeCount] = useState(comment.totalLike ?? 0);
   const [editContent, setEditContent] = useState(comment.content);
   const [localReplies, setLocalReplies] = useState<Comment[]>([]);

   const { data: me } = useMe();
   const qc = useQueryClient();
   const isOwner = me && (me.id === comment.userId || (me as any).sub === comment.userId);

   // ── Fetch replies ─────────────────────────────────────────────────────────
   const { data: replies = [], isLoading: repliesLoading } = useQuery({
      queryKey: ["replies", comment.id],
      queryFn: () => getReplies(comment.id),
      enabled: showReplies,
   });

   // ── Like ─────────────────────────────────────────────────────────────────
   const { mutate: doLike } = useMutation({
      mutationFn: () => toggleLikeComment(comment.id),
      onSuccess: (res) => {
         setLiked(res.liked);
         setLikeCount(res.totalLike);
      },
   });

   // ── Edit ─────────────────────────────────────────────────────────────────
   const { mutate: doEdit, isPending: editing } = useMutation({
      mutationFn: () => updateComment(comment.id, editContent),
      onSuccess: () => {
         qc.invalidateQueries({ queryKey: ["comments", postId] });
         setIsEditing(false);
      },
   });

   // ── Delete ────────────────────────────────────────────────────────────────
   const { mutate: doDelete, isPending: deleting } = useMutation({
      mutationFn: () => deleteComment(comment.id),
      onSuccess: () => {
         qc.invalidateQueries({ queryKey: ["comments", postId] });
         onDeleted?.(comment.id);
      },
   });

   // ── Add reply ─────────────────────────────────────────────────────────────
   const handleAddReply = async (content: string) => {
      const newReply = await createComment({ postId, parentId: comment.id, content });
      if (newReply) {
         setLocalReplies((prev) => [...prev, newReply]);
         setShowReplies(true);
         qc.invalidateQueries({ queryKey: ["replies", comment.id] });
      }
      setShowReplyForm(false);
   };

   const allReplies = [...replies, ...localReplies.filter(r => !replies.find(x => x.id === r.id))];
   const replyCount = comment.replyCount ?? allReplies.length;

   return (
      <div className={`flex gap-3 ${isReply ? "" : "py-4 border-b border-gray-100 last:border-0"}`}>
         {/* Avatar */}
         <div className="shrink-0">
            <img
               src={comment.user?.avatar || `${DEFAULT_AVATAR}&name=${encodeURIComponent(comment.user?.name ?? "U")}`}
               alt={comment.user?.name ?? "User"}
               className="w-9 h-9 rounded-full object-cover ring-2 ring-white shadow-sm"
            />
         </div>

         {/* Content */}
         <div className="flex-1 min-w-0">
            {/* Header */}
            <div className="flex items-center gap-2 mb-1">
               <span className="text-sm font-bold text-gray-900">{comment.user?.name ?? "Ẩn danh"}</span>
               <span className="text-[11px] text-gray-400">{timeAgo(comment.createdAt)}</span>
               {comment.updatedAt !== comment.createdAt && (
                  <span className="text-[10px] text-gray-300 italic">(đã chỉnh sửa)</span>
               )}
            </div>

            {/* Body: edit mode hoặc hiển thị */}
            {isEditing ? (
               <div className="space-y-2">
                  <textarea
                     value={editContent}
                     onChange={(e) => setEditContent(e.target.value)}
                     rows={2}
                     className="w-full text-sm border border-blue-200 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-blue-100 resize-none"
                  />
                  <div className="flex gap-2">
                     <button
                        onClick={() => doEdit()}
                        disabled={editing || !editContent.trim()}
                        className="px-3 py-1 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-1"
                     >
                        {editing && <Loader2 size={11} className="animate-spin" />}
                        Lưu
                     </button>
                     <button
                        onClick={() => { setIsEditing(false); setEditContent(comment.content); }}
                        className="px-3 py-1 text-xs text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100"
                     >
                        Huỷ
                     </button>
                  </div>
               </div>
            ) : (
               <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap break-words">
                  {comment.content}
               </p>
            )}

            {/* Actions */}
            {!isEditing && (
               <div className="flex items-center gap-3 mt-2">
                  {/* Like */}
                  <button
                     onClick={() => doLike()}
                     className={`flex items-center gap-1 text-xs font-medium transition-colors ${liked ? "text-red-500" : "text-gray-400 hover:text-red-400"}`}
                  >
                     <Heart size={13} fill={liked ? "currentColor" : "none"} />
                     <span>{likeCount > 0 ? likeCount : ""}</span>
                  </button>

                  {/* Reply */}
                  {!isReply && (
                     <button
                        onClick={() => setShowReplyForm((v) => !v)}
                        className="flex items-center gap-1 text-xs font-medium text-gray-400 hover:text-blue-500 transition-colors"
                     >
                        <MessageCircle size={13} />
                        Phản hồi
                     </button>
                  )}

                  {/* Show replies */}
                  {!isReply && (replyCount > 0 || allReplies.length > 0) && (
                     <button
                        onClick={() => setShowReplies((v) => !v)}
                        className="flex items-center gap-1 text-xs font-medium text-blue-500 hover:text-blue-700 transition-colors"
                     >
                        {showReplies ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                        {showReplies
                           ? "Ẩn phản hồi"
                           : `${allReplies.length || replyCount} phản hồi`}
                     </button>
                  )}

                  {/* Owner menu */}
                  {isOwner && (
                     <div className="relative ml-auto">
                        <button
                           onClick={() => setShowMenu((v) => !v)}
                           className="p-1 rounded-lg text-gray-300 hover:text-gray-500 hover:bg-gray-100 transition-colors"
                        >
                           <MoreHorizontal size={14} />
                        </button>
                        {showMenu && (
                           <div
                              className="absolute right-0 top-6 w-32 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-10"
                              onMouseLeave={() => setShowMenu(false)}
                           >
                              <button
                                 onClick={() => { setIsEditing(true); setShowMenu(false); }}
                                 className="w-full flex items-center gap-2 px-3 py-2 text-xs text-gray-700 hover:bg-gray-50"
                              >
                                 <Pencil size={12} /> Chỉnh sửa
                              </button>
                              <button
                                 onClick={() => { doDelete(); setShowMenu(false); }}
                                 disabled={deleting}
                                 className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-500 hover:bg-red-50"
                              >
                                 {deleting ? <Loader2 size={12} className="animate-spin" /> : <Trash2 size={12} />}
                                 Xóa
                              </button>
                           </div>
                        )}
                     </div>
                  )}
               </div>
            )}

            {/* Reply form */}
            {showReplyForm && (
               <div className="mt-3">
                  <CommentForm
                     compact
                     autoFocus
                     placeholder={`Phản hồi @${comment.user?.name ?? ""}...`}
                     onSubmit={handleAddReply}
                     onCancel={() => setShowReplyForm(false)}
                     userAvatar={me?.avatar}
                     userName={me?.name}
                  />
               </div>
            )}

            {/* Replies list */}
            {showReplies && (
               <div className="mt-3 pl-3 border-l-2 border-gray-100 space-y-3">
                  {repliesLoading && (
                     <div className="flex items-center gap-2 text-xs text-gray-400 py-2">
                        <Loader2 size={13} className="animate-spin" />
                        Đang tải phản hồi...
                     </div>
                  )}
                  {allReplies.map((reply) => (
                     <CommentItem
                        key={reply.id}
                        comment={reply}
                        postId={postId}
                        isReply
                     />
                  ))}
               </div>
            )}
         </div>
      </div>
   );
}
