"use client";

import { useState, useRef, useEffect } from "react";
import { Send, X } from "lucide-react";

interface Props {
  onSubmit: (content: string) => Promise<void>;
  placeholder?: string;
  autoFocus?: boolean;
  onCancel?: () => void;
  compact?: boolean;
  /** Avatar của user hiện tại để hiển thị */
  userAvatar?: string;
  userName?: string;
}

export default function CommentForm({
  onSubmit,
  placeholder = "Viết bình luận...",
  autoFocus = false,
  onCancel,
  compact = false,
  userAvatar,
  userName,
}: Props) {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (autoFocus) textareaRef.current?.focus();
  }, [autoFocus]);

  // Auto-resize textarea
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    const el = e.target;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  };

  const handleSubmit = async () => {
    if (!content.trim() || loading) return;
    setLoading(true);
    try {
      await onSubmit(content.trim());
      setContent("");
      if (textareaRef.current) textareaRef.current.style.height = "auto";
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const initials = userName?.[0]?.toUpperCase() ?? "U";

  return (
    <div className={`flex gap-3 ${compact ? "" : "mt-6"}`}>
      {/* Avatar */}
      <div className="shrink-0">
        {userAvatar ? (
          <img
            src={userAvatar}
            alt="avatar"
            className="w-9 h-9 rounded-full object-cover ring-2 ring-white shadow-sm"
          />
        ) : (
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-sm font-bold ring-2 ring-white shadow-sm">
            {initials}
          </div>
        )}
      </div>

      {/* Input area */}
      <div className="flex-1 min-w-0">
        <div className="relative bg-gray-50 rounded-2xl border border-gray-200 focus-within:border-blue-400 focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-50 transition-all">
          <textarea
            ref={textareaRef}
            value={content}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            rows={compact ? 1 : 2}
            style={{ resize: "none", overflow: "hidden" }}
            className="w-full bg-transparent px-4 pt-3 pb-10 text-sm text-gray-800 placeholder-gray-400 outline-none rounded-2xl"
          />

          {/* Bottom bar */}
          <div className="absolute bottom-2 right-2 flex items-center gap-2">
            <span className="text-[10px] text-gray-300 select-none">Ctrl+Enter</span>
            {onCancel && (
              <button
                onClick={onCancel}
                className="p-1.5 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
              >
                <X size={14} />
              </button>
            )}
            <button
              onClick={handleSubmit}
              disabled={!content.trim() || loading}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-95"
            >
              {loading ? (
                <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Send size={12} />
              )}
              Gửi
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
