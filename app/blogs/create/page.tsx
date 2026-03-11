"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, Save, Send, Image as ImageIcon, Sparkles } from "lucide-react";
import Link from "next/link";
import BlogEditor from "@/components/editor/BlogEditor";
import { AuthGuard } from "@/components/AuthGuard";
import { apiClient } from "@/app/lib/apiClient";
import { useToastActions } from "@/components/toast/useToastActions";
import ImageUploader from "@/components/editor/ImageUploader";

export default function CreateBlogPage() {
    const router = useRouter();
    const toast = useToastActions();
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [thumbnail, setThumbnail] = useState("");
    const [content, setContent] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handlePublish = async () => {
        if (!title || !content) {
            toast.warning("Vui lòng nhập ít nhất tiêu đề và nội dung bài viết!");
            return;
        }

        setIsSubmitting(true);

        try {
            await toast.promise(
                apiClient("/blogs", {
                    method: "POST",
                    body: JSON.stringify({
                        title,
                        content,
                        description: description || "Không có mô tả",
                        thumbnail: thumbnail || "",
                        categoryId: 1,
                        type: "pushlish"
                    }),
                }),
                {
                    loading: "Đang đăng bài viết kiến tạo của bạn...",
                    success: "Bài viết của bạn đã được lan toả! 🎉",
                    error: (err) => `Lỗi: ${err.message}`
                }
            );

            router.push("/blogs");
        } catch (error: any) {
            console.error("Lỗi đăng bài:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleSaveDraft = async () => {
        if (!title) {
            toast.warning("Vui lòng nhập tiêu đề để lưu nháp!");
            return;
        }

        setIsSubmitting(true);

        try {
            await toast.promise(
                apiClient("/blogs", {
                    method: "POST",
                    body: JSON.stringify({
                        title,
                        content: content || "",
                        description: description || "Chưa có mô tả",
                        thumbnail: thumbnail || "",
                        categoryId: 1,
                        type: "draft"
                    }),
                }),
                {
                    loading: "Đang lưu bản nháp...",
                    success: "Bản nháp đã được lưu an toàn! 📝",
                    error: (err) => `Lỗi khi lưu nháp: ${err.message}`
                }
            );

            router.push("/blogs"); // Hoặc có thể ở lại trang này
        } catch (error: any) {
            console.error("Lỗi lưu nháp:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <AuthGuard>
            <div className="max-w-5xl mx-auto px-4 py-8">
                {/* Header Action Bar */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                    <div className="flex items-center gap-4">
                        <Link
                            href="/blogs"
                            className="p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-500"
                        >
                            <ChevronLeft size={24} />
                        </Link>
                        <div>
                            <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Tạo bài viết mới</h1>
                            <p className="text-sm text-gray-500 font-medium">Chia sẻ ý tưởng tuyệt vời của bạn tới mọi người</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 w-full sm:w-auto">
                        <button
                            onClick={handleSaveDraft}
                            disabled={isSubmitting}
                            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl border border-gray-200 font-bold text-sm text-gray-700 hover:bg-gray-50 transition-all disabled:opacity-50"
                        >
                            <Save size={18} />
                            Lưu nháp
                        </button>
                        <button
                            onClick={handlePublish}
                            disabled={isSubmitting}
                            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-sm hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 active:scale-95 disabled:opacity-50"
                        >
                            {isSubmitting ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            ) : (
                                <Send size={18} />
                            )}
                            Đăng bài viết
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Editor Section */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="space-y-4">
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Tiêu đề bài viết..."
                                className="w-full text-4xl font-extrabold text-gray-900 border-none outline-none placeholder:text-gray-300 bg-transparent py-2 focus:ring-0"
                            />
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Mô tả ngắn gọn về bài viết (Sapô)..."
                                className="w-full text-lg font-medium text-gray-500 border-none outline-none placeholder:text-gray-200 bg-transparent resize-none h-24 focus:ring-0"
                            />
                        </div>

                        <BlogEditor content={content} onChange={setContent} />
                    </div>

                    {/* Sidebar Settings Section */}
                    <div className="space-y-6">
                        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <ImageIcon size={18} className="text-blue-500" />
                                Ảnh bìa (Thumbnail)
                            </h3>
                            <ImageUploader
                                currentUrl={thumbnail || undefined}
                                onUpload={(result: any) => setThumbnail(result.url)}
                                placeholder="Kéo thả hoặc click để tải ảnh bìa"
                                aspect="video"
                            />
                            {thumbnail && (
                                <p className="mt-2 text-xs text-gray-400 truncate" title={thumbnail}>
                                    ✓ {thumbnail.split("/").pop()}
                                </p>
                            )}
                        </div>

                        <div className="bg-blue-600 rounded-2xl p-6 text-white shadow-xl shadow-blue-200 relative overflow-hidden">
                            <div className="relative z-10">
                                <h3 className="font-bold mb-2 flex items-center gap-2">
                                    <Sparkles size={18} />
                                    Mẹo viết bài
                                </h3>
                                <ul className="text-sm text-blue-100 space-y-2 font-medium">
                                    <li>• Tiêu đề nên gây sự tò mò.</li>
                                    <li>• Sử dụng Heading để phân đoạn.</li>
                                    <li>• Hình ảnh giúp bài viết sinh động hơn.</li>
                                    <li>• Nhúng video để giữ chân người đọc.</li>
                                </ul>
                            </div>
                            <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthGuard>
    );
}
