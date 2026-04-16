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
import { getCategories, Category, createBlog } from "@/app/services/blogService";
import { useQuery } from "@tanstack/react-query";
import { Tag as TagIcon } from "lucide-react";

export default function CreateBlogPage() {
    const router = useRouter();
    const toast = useToastActions();
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [thumbnail, setThumbnail] = useState("");
    const [content, setContent] = useState("");
    const [categoryId, setCategoryId] = useState<number | undefined>(undefined);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { data: categories = [] } = useQuery<Category[]>({
        queryKey: ["categories"],
        queryFn: getCategories,
        staleTime: 10 * 60 * 1000,
    });

    const handlePublish = async () => {
        if (!title || !content || !categoryId) {
            toast.warning("Vui lòng nhập đầy đủ tiêu đề, nội dung và chọn danh mục!");
            return;
        }

        setIsSubmitting(true);

        try {
            await toast.promise(
                createBlog({
                    title,
                    content,
                    description: description || "Không có mô tả",
                    thumbnail: thumbnail || "",
                    categoryId: categoryId || (categories.length > 0 ? categories[0].id : 1)
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
                        <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl border border-gray-200 font-bold text-sm text-gray-700 hover:bg-gray-50 transition-all">
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

                        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <TagIcon size={18} className="text-purple-500" />
                                Danh mục (Category)
                            </h3>
                            <div className="space-y-3">
                                <select
                                    value={categoryId || ""}
                                    onChange={(e) => setCategoryId(Number(e.target.value))}
                                    className="w-full h-11 px-4 rounded-xl border border-gray-200 bg-gray-50 text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all appearance-none cursor-pointer"
                                    style={{
                                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236B7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                                        backgroundRepeat: 'no-repeat',
                                        backgroundPosition: 'right 1rem center',
                                        backgroundSize: '1.25rem'
                                    }}
                                >
                                    <option value="" disabled>Chọn danh mục bài viết</option>
                                    {categories.map((cat) => (
                                        <option key={cat.id} value={cat.id}>
                                            {cat.name}
                                        </option>
                                    ))}
                                </select>
                                <p className="text-[10px] text-gray-400 font-medium px-1">
                                    Phân loại bài viết giúp độc giả dễ dàng tìm thấy bạn hơn.
                                </p>
                            </div>
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
