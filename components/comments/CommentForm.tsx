// components/comments/CommentForm.tsx
"use client";
import { useState } from 'react';

interface Props {
  onSubmit: (content: string) => Promise<void>;
}

export default function CommentForm({ onSubmit }: Props) {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!content.trim()) return;

    setLoading(true);
    await onSubmit(content);
    setContent('');
    setLoading(false);
  };

  return (
    <div className="mt-4">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Viết bình luận..."
        className="w-full border rounded p-2 text-sm"
        rows={3}
      />

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="mt-2 px-4 py-1 bg-blue-600 text-white text-sm rounded"
      >
        {loading ? 'Đang gửi...' : 'Gửi bình luận'}
      </button>
    </div>
  );
}
