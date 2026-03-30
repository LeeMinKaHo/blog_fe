"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Search, X, Loader2, BookOpen, Tag, ArrowRight } from "lucide-react";
import { useSearch } from "@/app/hooks/useSearch";

export default function SearchBox() {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const { results, isLoading, error } = useSearch(query);

  const showDropdown = isFocused && query.trim().length > 0;

  // Close dropdown khi click ra ngoài
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsFocused(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Phím tắt Ctrl+K mở search
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
        setIsFocused(true);
      }
      if (e.key === "Escape") {
        setIsFocused(false);
        inputRef.current?.blur();
      }
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setIsFocused(false);
    router.push(`/blogs?search=${encodeURIComponent(query.trim())}`);
  };

  const handleSelect = () => {
    setIsFocused(false);
    setQuery("");
  };

  return (
    <div ref={containerRef} className={`relative transition-all duration-500 ease-in-out w-full md:max-w-md ${isFocused ? 'md:w-[450px]' : 'md:w-[280px]'}`}>
      {/* Search Input */}
      <form onSubmit={handleSubmit}>
        <div
          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 ${
            isFocused 
              ? "bg-white border-1.5 border-blue-600 shadow-xl shadow-blue-100 scale-105" 
              : "bg-gray-100 border-1.5 border-transparent"
          }`}
        >
          {isLoading ? (
            <Loader2
              size={18}
              className="text-gray-400 animate-spin shrink-0"
            />
          ) : (
            <Search size={18} className={`shrink-0 transition-colors duration-300 ${isFocused ? 'text-blue-600' : 'text-gray-400'}`} />
          )}

          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            placeholder="Tìm kiếm bài viết..."
            aria-label="Tìm kiếm bài viết"
            className="flex-1 border-none outline-none bg-transparent text-sm text-gray-900 placeholder:text-gray-400"
          />

          {/* Clear button */}
          {query && (
            <button
              type="button"
              onClick={() => { setQuery(""); inputRef.current?.focus(); }}
              aria-label="Xoá tìm kiếm"
              className="bg-gray-200 hover:bg-gray-300 text-gray-500 rounded-full p-1.5 transition-colors shrink-0"
            >
              <X size={12} />
            </button>
          )}

          {/* Phím tắt badge - ẩn khi đang gõ */}
          {!query && !isFocused && (
            <span className="text-[10px] text-gray-400 bg-gray-200 px-1.5 py-0.5 rounded font-mono shrink-0">
              ⌘K
            </span>
          )}
        </div>
      </form>

      {/* Dropdown Results */}
      {showDropdown && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 8px)",
            left: 0,
            right: 0,
            background: "#fff",
            borderRadius: "16px",
            border: "1px solid #e5e7eb",
            boxShadow: "0 8px 40px rgba(0,0,0,0.13), 0 2px 8px rgba(0,0,0,0.06)",
            zIndex: 999,
            overflow: "hidden",
            minWidth: "320px",
          }}
        >
          {/* Loading skeleton */}
          {isLoading && (
            <div style={{ padding: "16px" }}>
              {[1, 2, 3].map((i) => (
                <div key={i} style={{ display: "flex", gap: "10px", marginBottom: "12px", alignItems: "center" }}>
                  <div style={{ width: "40px", height: "40px", borderRadius: "8px", background: "#f3f4f6" }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ height: "12px", background: "#f3f4f6", borderRadius: "4px", marginBottom: "6px", width: "80%" }} />
                    <div style={{ height: "10px", background: "#f3f4f6", borderRadius: "4px", width: "40%" }} />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Error */}
          {!isLoading && error && (
            <div style={{ padding: "20px", textAlign: "center", color: "#ef4444", fontSize: "13px" }}>
              <div>{error}</div>
              <div style={{ marginTop: "4px", fontSize: "11px", color: "#9ca3af" }}>
                Kiểm tra kết nối đến backend (localhost:3000)
              </div>
            </div>
          )}

          {/* No results */}
          {!isLoading && !error && results.length === 0 && (
            <div style={{ padding: "24px 16px", textAlign: "center" }}>
              <BookOpen size={28} color="#d1d5db" style={{ margin: "0 auto 8px" }} />
              <p style={{ color: "#6b7280", fontSize: "13px", margin: 0 }}>
                Không tìm thấy bài viết nào cho <strong>"{query}"</strong>
              </p>
            </div>
          )}

          {/* Results list */}
          {!isLoading && !error && results.length > 0 && (
            <>
              <div style={{ padding: "10px 14px 4px", borderBottom: "1px solid #f3f4f6" }}>
                <span style={{ fontSize: "11px", color: "#9ca3af", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  {results.length} kết quả
                </span>
              </div>

              <ul style={{ listStyle: "none", margin: 0, padding: "6px 0", maxHeight: "360px", overflowY: "auto" }}>
                {results.map((post) => (
                  <li key={post.id}>
                    <Link
                      href={`/blogs/${post.id}`}
                      onClick={handleSelect}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        padding: "10px 14px",
                        textDecoration: "none",
                        transition: "background 0.15s",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "#f8faff")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                    >
                      {/* Thumbnail */}
                      <div style={{
                        width: "44px",
                        height: "44px",
                        borderRadius: "8px",
                        overflow: "hidden",
                        flexShrink: 0,
                        background: "#f3f4f6",
                      }}>
                        {post.thumbnail ? (
                          <img
                            src={post.thumbnail}
                            alt={post.title}
                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                          />
                        ) : (
                          <div style={{
                            width: "100%", height: "100%",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            background: "linear-gradient(135deg, #dbeafe, #eff6ff)",
                          }}>
                            <BookOpen size={18} color="#93c5fd" />
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{
                          margin: 0,
                          fontSize: "13.5px",
                          fontWeight: 600,
                          color: "#111827",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}>
                          {highlight(post.title, query)}
                        </p>
                        <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "3px" }}>
                          {post.category && (
                            <span style={{
                              display: "inline-flex", alignItems: "center", gap: "3px",
                              fontSize: "11px", color: "#3b82f6",
                              background: "#eff6ff", padding: "1px 7px",
                              borderRadius: "99px", fontWeight: 600,
                            }}>
                              <Tag size={9} />
                              {post.category.name}
                            </span>
                          )}
                          {post.author?.name && (
                            <span style={{ fontSize: "11px", color: "#9ca3af" }}>
                              {post.author.name}
                            </span>
                          )}
                        </div>
                      </div>

                      <ArrowRight size={14} color="#d1d5db" style={{ flexShrink: 0 }} />
                    </Link>
                  </li>
                ))}
              </ul>

              {/* Footer: xem tất cả */}
              <div style={{ borderTop: "1px solid #f3f4f6", padding: "8px 14px" }}>
                <Link
                  href={`/blogs?search=${encodeURIComponent(query.trim())}`}
                  onClick={handleSelect}
                  style={{
                    display: "flex", alignItems: "center", justifyContent: "center", gap: "6px",
                    fontSize: "13px", color: "#3b82f6", fontWeight: 600,
                    textDecoration: "none", padding: "6px",
                    borderRadius: "8px", transition: "background 0.15s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#eff6ff")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  Xem tất cả kết quả cho "{query}"
                  <ArrowRight size={13} />
                </Link>
              </div>
            </>
          )}
        </div>
      )}

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}

// Highlight từ khóa tìm kiếm trong title
function highlight(text: string, keyword: string): React.ReactNode {
  if (!keyword.trim()) return text;
  const parts = text.split(new RegExp(`(${keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi"));
  return (
    <>
      {parts.map((part, i) =>
        part.toLowerCase() === keyword.toLowerCase() ? (
          <mark key={i} style={{ background: "#fef9c3", color: "#92400e", borderRadius: "2px", padding: "0 1px" }}>
            {part}
          </mark>
        ) : (
          part
        )
      )}
    </>
  );
}
