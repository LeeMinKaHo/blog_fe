"use client";

import { useRef, useState, useCallback, DragEvent, ChangeEvent } from "react";
import { Upload, X, Image as ImageIcon, Loader2, CheckCircle2 } from "lucide-react";
import { API_BASE_URL } from "@/app/lib/apiClient";

export interface UploadResult {
    filename: string;
    url: string;
}

interface ImageUploaderProps {
    /** Gọi lại khi upload thành công, trả về URL ảnh */
    onUpload: (result: UploadResult) => void;
    /** URL ảnh hiện tại (để preview nếu đã có) */
    currentUrl?: string;
    /** Mô tả placeholder hiển thị khi chưa có ảnh */
    placeholder?: string;
    /** Class CSS bên ngoài */
    className?: string;
    /** Tỉ lệ khung, mặc định "video" (16/9) */
    aspect?: "video" | "square" | "auto";
}

export default function ImageUploader({
    onUpload,
    currentUrl,
    placeholder = "Kéo thả hoặc click để tải ảnh lên",
    className = "",
    aspect = "video",
}: ImageUploaderProps) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [preview, setPreview] = useState<string | null>(currentUrl ?? null);
    const [isDragging, setIsDragging] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const uploadFile = useCallback(
        async (file: File) => {
            if (!file.type.startsWith("image/")) {
                setError("Chỉ chấp nhận file hình ảnh (jpg, png, gif, webp...)");
                return;
            }
            if (file.size > 10 * 1024 * 1024) {
                setError("File quá lớn! Tối đa 10MB.");
                return;
            }

            // Local preview ngay lập tức
            const objectUrl = URL.createObjectURL(file);
            setPreview(objectUrl);
            setError(null);
            setSuccess(false);
            setIsUploading(true);

            try {
                const formData = new FormData();
                formData.append("file", file);

                const res = await fetch(`${API_BASE_URL}/files/upload`, {
                    method: "POST",
                    credentials: "include",
                    body: formData,
                });

                if (!res.ok) {
                    const errResponse = await res.text().catch(() => "");
                    let errMsg = `Upload thất bại (HTTP ${res.status})`;
                    try {
                        const errJson = JSON.parse(errResponse);
                        if (errJson.message) errMsg = errJson.message;
                    } catch { }
                    throw new Error(errMsg);
                }

                const result = await res.json();
                // BE bọc trong { data: { filename, url } }
                const finalUrl = result?.data?.url || result?.url;

                if (!finalUrl) {
                    throw new Error("Không lấy được URL ảnh từ server");
                }

                setPreview(finalUrl);
                setSuccess(true);
                onUpload({
                    filename: result?.data?.filename || result?.filename || "",
                    url: finalUrl
                });
                setTimeout(() => setSuccess(false), 2000);
            } catch (err: any) {
                setError(err.message ?? "Đã xảy ra lỗi khi upload");
            } finally {
                setIsUploading(false);
                // objectUrl sẽ được tự động dọn dẹp bởi browser khi không còn dùng hoặc khi revoke
                // Ta có thể để browser tự quản lý hoặc revoke khi preview thay đổi
            }
        },
        [onUpload]
    );

    // ─── Drag & Drop ─────────────────────────────────────────────────────────────
    const onDragOver = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(true);
    };
    const onDragLeave = () => setIsDragging(false);
    const onDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files?.[0];
        if (file) uploadFile(file);
    };

    // ─── File input ──────────────────────────────────────────────────────────────
    const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) uploadFile(file);
        e.target.value = ""; // reset để chọn lại cùng file nếu cần
    };

    const removeImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        setPreview(null);
        setSuccess(false);
        setError(null);
    };

    const aspectClass =
        aspect === "video"
            ? "aspect-video"
            : aspect === "square"
                ? "aspect-square"
                : "";

    return (
        <div className={`w-full ${className}`}>
            <input
                ref={inputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={onFileChange}
            />

            <div
                className={`
                    relative ${aspectClass} rounded-2xl border-2 border-dashed transition-all duration-200 cursor-pointer overflow-hidden group
                    ${isDragging
                        ? "border-blue-500 bg-blue-50 scale-[1.01]"
                        : preview
                            ? "border-transparent"
                            : "border-gray-200 bg-gray-50 hover:border-blue-400 hover:bg-blue-50/40"
                    }
                `}
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
                onDrop={onDrop}
                onClick={() => !isUploading && inputRef.current?.click()}
            >
                {/* ── Preview ── */}
                {preview ? (
                    <>
                        <img
                            src={preview}
                            alt="Preview ảnh"
                            className="w-full h-full object-cover"
                        />
                        {/* Overlay khi hover */}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-200 flex items-center justify-center">
                            <span className="opacity-0 group-hover:opacity-100 transition-opacity text-white font-semibold text-sm bg-black/50 px-4 py-2 rounded-xl">
                                Đổi ảnh
                            </span>
                        </div>
                        {/* Nút xoá */}
                        {!isUploading && (
                            <button
                                onClick={removeImage}
                                className="absolute top-2 right-2 z-10 p-1.5 rounded-full bg-black/60 text-white hover:bg-red-500 transition-colors opacity-0 group-hover:opacity-100"
                                title="Xoá ảnh"
                            >
                                <X size={14} />
                            </button>
                        )}
                    </>
                ) : (
                    /* ── Placeholder ── */
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-gray-400 select-none p-4">
                        <div className={`p-4 rounded-2xl transition-colors duration-200 ${isDragging ? "bg-blue-100" : "bg-gray-100 group-hover:bg-blue-100"}`}>
                            <Upload size={28} className={`transition-colors ${isDragging ? "text-blue-500" : "group-hover:text-blue-500"}`} />
                        </div>
                        <div className="text-center">
                            <p className={`text-sm font-semibold transition-colors ${isDragging ? "text-blue-600" : "group-hover:text-blue-600"}`}>
                                {isDragging ? "Thả ảnh vào đây!" : placeholder}
                            </p>
                            <p className="text-xs text-gray-300 mt-1">JPG, PNG, GIF, WebP — tối đa 10MB</p>
                        </div>
                    </div>
                )}

                {/* ── Uploading overlay ── */}
                {isUploading && (
                    <div className="absolute inset-0 bg-white/80 flex flex-col items-center justify-center gap-3 backdrop-blur-sm z-20">
                        <Loader2 size={32} className="text-blue-500 animate-spin" />
                        <p className="text-sm font-semibold text-gray-600">Đang tải ảnh lên...</p>
                    </div>
                )}

                {/* ── Success flash ── */}
                {success && !isUploading && (
                    <div className="absolute inset-0 bg-green-500/15 flex items-center justify-center z-20 pointer-events-none">
                        <div className="bg-white rounded-2xl px-5 py-3 shadow-xl flex items-center gap-2">
                            <CheckCircle2 size={20} className="text-green-500" />
                            <span className="text-sm font-bold text-green-700">Tải ảnh thành công!</span>
                        </div>
                    </div>
                )}
            </div>

            {/* ── Error message ── */}
            {error && (
                <div className="mt-2 flex items-center gap-2 text-red-500 text-xs font-medium bg-red-50 px-3 py-2 rounded-xl">
                    <X size={14} className="flex-shrink-0" />
                    <span>{error}</span>
                </div>
            )}
        </div>
    );
}
