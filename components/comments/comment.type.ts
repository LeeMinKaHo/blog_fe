// components/comments/comment.types.ts
export interface Comment {
  id: number;
  content: string;
  postId: number;
  totalLike?: number;
  parentId?: number;
  createdAt: string;
  user: {
    id: number;
    name: string;
    avatar?: string;
  };
}
