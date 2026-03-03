// components/comments/CommentList.tsx
import CommentItem from './CommentItem';
import { Comment } from './comment.type';

interface Props {
  comments: Comment[];
  isLoading?: boolean;
}

export default function CommentList({ comments, isLoading }: Props) {
  if (isLoading) {
    return <p className="text-sm text-gray-500">Đang tải bình luận...</p>;
  }

  if (!comments.length) {
    return <p className="text-sm text-gray-500">Chưa có bình luận nào</p>;
  }

  return (
    <div className="mt-4">
      <h3 className="font-semibold mb-2">
        Bình luận ({comments.length})
      </h3>

      <div className="space-y-2">
        {comments.map((comment) => (
          <CommentItem key={comment.id} comment={comment} />
        ))}
      </div>
    </div>
  );
}
