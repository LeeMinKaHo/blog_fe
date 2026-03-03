"use client";

import useSWR, { mutate } from "swr";
import CommentList from "@/components/comments/CommentList";
import CommentForm from "@/components/comments/CommentForm";
import { createComment, getCommentsByPostId } from "@/app/lib/api";

export default function CommentSection({ postId }: { postId: number }) {
   const { data: comments = [], isLoading } = useSWR(
      postId ? `/comments/post/${postId}` : null,
      () => getCommentsByPostId(postId)
   );

   return (
      <>
         <CommentList comments={comments} isLoading={isLoading} />
         <CommentForm
            onSubmit={async (content) => {
               await createComment({
                  postId: Number(postId),
                  content,
               });

               mutate(`/comments/post/${postId}`);
            }}
         />
      </>
   );
}
