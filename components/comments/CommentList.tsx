"use client";

import CommentItem from "./CommentItem";
import { Comment } from "@/app/services/commentService";
import { MessageSquare } from "lucide-react";

interface Props {
  comments: Comment[];
  isLoading?: boolean;
  postId: number;
}

function SkeletonComment({ indent = false }: { indent?: boolean }) {
  return (
    <div className={`flex gap-3 py-4 ${indent ? "" : "border-b border-gray-100"}`}>
      <div className="w-9 h-9 rounded-full bg-gray-100 animate-pulse shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="flex gap-2 items-center">
          <div className="h-3 w-24 bg-gray-100 rounded-full animate-pulse" />
          <div className="h-2 w-16 bg-gray-100 rounded-full animate-pulse" />
        </div>
        <div className="h-3 w-full bg-gray-100 rounded-full animate-pulse" />
        <div className="h-3 w-2/3 bg-gray-100 rounded-full animate-pulse" />
      </div>
    </div>
  );
}

export default function CommentList({ comments, isLoading, postId }: Props) {
  if (isLoading) {
    return (
      <div className="divide-y divide-gray-50">
        {Array.from({ length: 3 }).map((_, i) => <SkeletonComment key={i} />)}
      </div>
    );
  }

  if (!comments.length) {
    return (
      <div className="py-12 flex flex-col items-center gap-3 text-center">
        <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center">
          <MessageSquare size={24} className="text-gray-300" />
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-600">Chưa có bình luận nào</p>
          <p className="text-xs text-gray-400 mt-0.5">Hãy là người đầu tiên bình luận!</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {comments.map((comment) => (
        <CommentItem
          key={comment.id}
          comment={comment}
          postId={postId}
        />
      ))}
    </div>
  );
}
