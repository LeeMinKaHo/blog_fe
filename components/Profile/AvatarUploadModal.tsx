"use client";

import { useState, useEffect, useRef, useCallback, DragEvent, ChangeEvent } from "react";
import { X, Camera, CheckCircle2, Loader2, AlertCircle, Upload, ImagePlus } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProfile } from "@/app/services/userService";
import { API_BASE_URL } from "@/app/lib/apiClient";

interface AvatarUploadModalProps {
    isOpen: boolean;
    onClose: () => void;
    currentAvatar: string;
    userName: string;
}

type Step = "pick" | "preview" | "saving" | "done";

export default function AvatarUploadModal({
    isOpen,
    onClose,
    currentAvatar,
    userName,
}: AvatarUploadModalProps) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [step, setStep] = useState<Step>("pick");
    const [localPreview, setLocalPreview] = useState<string | null>(null); // blob URL cho preview
    const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);  // URL server trả về
    const [isUploading, setIsUploading] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const qc = useQueryClient();

    // Reset state mỗi lần mở/đóng modal
    useEffect(() => {
        if (isOpen) {
            setStep("pick");
            setLocalPreview(null);
            setUploadedUrl(null);
            setIsUploading(false);
            setError(null);
            setIsDragging(false);
        } else {
            // Revoke blob URL khi đóng
            if (localPreview?.startsWith("blob:")) {
                URL.revokeObjectURL(localPreview);
            }
        }
    }, [isOpen]);

    // Mutation lưu avatar vào profile
    const { mutate: saveAvatar, isPending: isSaving, reset: resetMutation } = useMutation({
        mutationFn: (url: string) => updateProfile({ avatar: url }),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["profile"] });
            setStep("done");
            setTimeout(() => {
                onClose();
                resetMutation();
            }, 1200);
        },
        onError: (err: any) => {
            setError(err?.message ?? "Lưu avatar thất bại, thử lại nhé");
            setStep("preview"); // quay lại cho user thử lại
        },
    });

    // Upload file lên server, lấy URL
    const handleFile = useCallback(async (file: File) => {
        if (!file.type.startsWith("image/")) {
            setError("Chỉ chấp nhận file hình ảnh (jpg, png, gif, webp...)");
            return;
        }
        if (file.size > 10 * 1024 * 1024) {
            setError("File quá lớn! Tối đa 10MB.");
            return;
        }

        setError(null);
        setUploadedUrl(null);

        // Tạo local preview ngay bằng blob URL (luôn hiển thị được)
        const blobUrl = URL.createObjectURL(file);
        setLocalPreview(blobUrl);
        setStep("preview");
        setIsUploading(true);

        try {
            const formData = new FormData();
            formData.append("file", file);

            console.log("[AvatarUpload] Uploading to:", `${API_BASE_URL}/files/upload`);

            const res = await fetch(`${API_BASE_URL}/files/upload`, {
                method: "POST",
                credentials: "include",
                body: formData,
            });

            console.log("[AvatarUpload] Response status:", res.status);

            if (!res.ok) {
                const errText = await res.text().catch(() => "");
                console.error("[AvatarUpload] Error response:", errText);
                let errMsg = `Upload thất bại (HTTP ${res.status})`;
                try {
                    const errJson = JSON.parse(errText);
                    if (errJson.message) errMsg = errJson.message;
                } catch { }
                throw new Error(errMsg);
            }

            const result = await res.json();
            console.log("[AvatarUpload] Upload result (raw):", result);

            // ResponseInterceptor của BE bọc trong { data: { filename, url } }
            const finalUrl = result?.data?.url || result?.url;

            if (!finalUrl) {
                throw new Error("Không tìm thấy URL ảnh trong phản hồi của server");
            }

            console.log("[AvatarUpload] Final URL to save:", finalUrl);

            // Lưu URL server trả về (dùng để gửi cho BE khi nhấn "Lưu")
            setUploadedUrl(finalUrl);
            // Giữ blob URL cho preview (vì nó chắc chắn hiển thị được, server URL có thể bị CORS)
            // Không revoke blob URL ở đây, sẽ revoke khi đóng modal
        } catch (err: any) {
            console.error("[AvatarUpload] Upload error:", err);
            setError(err.message ?? "Đã xảy ra lỗi khi upload");
        } finally {
            setIsUploading(false);
        }
    }, []);

    // Drag & Drop
    const onDragOver = (e: DragEvent<HTMLDivElement>) => { e.preventDefault(); setIsDragging(true); };
    const onDragLeave = () => setIsDragging(false);
    const onDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files?.[0];
        if (file) handleFile(file);
    };

    // File input
    const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) handleFile(file);
        e.target.value = "";
    };

    const handleSave = () => {
        if (uploadedUrl) {
            setStep("saving");
            setError(null);
            saveAvatar(uploadedUrl);
        }
    };

    const handlePickAnother = () => {
        setStep("pick");
        setLocalPreview(null);
        setUploadedUrl(null);
        setError(null);
    };

    const handleClose = () => {
        if (!isSaving) {
            onClose();
            resetMutation();
        }
    };

    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
                onClick={handleClose}
            />

            {/* Modal */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
                <div
                    className="bg-white rounded-3xl shadow-2xl w-full max-w-md pointer-events-auto animate-in zoom-in-95 fade-in duration-200 overflow-hidden"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-gray-100">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-50 rounded-xl">
                                <Camera size={18} className="text-blue-600" />
                            </div>
                            <div>
                                <h2 className="font-bold text-gray-900 text-base">Đổi ảnh đại diện</h2>
                                <p className="text-xs text-gray-400">
                                    {step === "pick" && "Chọn ảnh mới từ máy tính của bạn"}
                                    {step === "preview" && "Xem trước ảnh mới"}
                                    {step === "saving" && "Đang cập nhật..."}
                                    {step === "done" && "Hoàn tất!"}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={handleClose}
                            disabled={isSaving}
                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors disabled:opacity-40"
                        >
                            <X size={18} />
                        </button>
                    </div>

                    <input
                        ref={inputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={onFileChange}
                    />

                    <div className="p-6">
                        {/* ════ STEP: PICK ════ */}
                        {step === "pick" && (
                            <div className="space-y-4">
                                {/* Avatar hiện tại */}
                                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-2xl">
                                    <img
                                        src={currentAvatar}
                                        alt={userName}
                                        className="w-14 h-14 rounded-xl object-cover border-2 border-white shadow"
                                    />
                                    <div>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Ảnh hiện tại</p>
                                        <p className="text-sm font-semibold text-gray-700">{userName}</p>
                                    </div>
                                </div>

                                {/* Vùng chọn file */}
                                <div
                                    className={`
                              relative rounded-2xl border-2 border-dashed p-8 text-center cursor-pointer transition-all duration-200
                              ${isDragging
                                            ? "border-blue-500 bg-blue-50 scale-[1.01]"
                                            : "border-gray-200 bg-gray-50/50 hover:border-blue-400 hover:bg-blue-50/30"
                                        }
                           `}
                                    onDragOver={onDragOver}
                                    onDragLeave={onDragLeave}
                                    onDrop={onDrop}
                                    onClick={() => inputRef.current?.click()}
                                >
                                    <div className="flex flex-col items-center gap-3">
                                        <div className={`p-3 rounded-2xl transition-colors ${isDragging ? "bg-blue-100" : "bg-gray-100"}`}>
                                            <ImagePlus size={28} className={`transition-colors ${isDragging ? "text-blue-500" : "text-gray-400"}`} />
                                        </div>
                                        <div>
                                            <p className={`text-sm font-semibold transition-colors ${isDragging ? "text-blue-600" : "text-gray-600"}`}>
                                                {isDragging ? "Thả ảnh vào đây!" : "Kéo thả hoặc click để chọn ảnh"}
                                            </p>
                                            <p className="text-xs text-gray-400 mt-1">JPG, PNG, GIF, WebP — tối đa 10MB</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* ════ STEP: PREVIEW ════ */}
                        {(step === "preview" || step === "saving") && (
                            <div className="space-y-4">
                                {/* So sánh cũ → mới */}
                                <div className="flex items-center justify-center gap-5">
                                    {/* Ảnh cũ */}
                                    <div className="flex flex-col items-center gap-1.5">
                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Hiện tại</span>
                                        <img
                                            src={currentAvatar}
                                            alt={userName}
                                            className="w-20 h-20 rounded-2xl object-cover border-2 border-gray-200 shadow-sm"
                                        />
                                    </div>

                                    {/* Arrow */}
                                    <div className="flex flex-col items-center gap-1 mt-4">
                                        <div className="w-8 h-[2px] bg-gradient-to-r from-gray-200 to-blue-400 rounded" />
                                        <span className="text-gray-300 text-lg">→</span>
                                        <div className="w-8 h-[2px] bg-gradient-to-r from-blue-400 to-blue-200 rounded" />
                                    </div>

                                    {/* Ảnh mới */}
                                    <div className="flex flex-col items-center gap-1.5">
                                        <span className="text-[10px] font-bold text-blue-500 uppercase tracking-wide">Mới</span>
                                        <div className="relative w-20 h-20 rounded-2xl overflow-hidden border-2 border-blue-300 shadow-sm shadow-blue-100">
                                            {localPreview ? (
                                                <img
                                                    src={localPreview}
                                                    alt="new avatar"
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-blue-50 flex items-center justify-center">
                                                    <Camera size={20} className="text-blue-300" />
                                                </div>
                                            )}
                                            {/* Uploading overlay trên ảnh mới */}
                                            {isUploading && (
                                                <div className="absolute inset-0 bg-white/70 backdrop-blur-sm flex items-center justify-center">
                                                    <Loader2 size={22} className="text-blue-500 animate-spin" />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Preview lớn */}
                                {localPreview && (
                                    <div className="relative rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
                                        <img
                                            src={localPreview}
                                            alt="Preview lớn"
                                            className="w-full max-h-60 object-contain bg-gray-50"
                                        />
                                        {isUploading && (
                                            <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex flex-col items-center justify-center gap-2">
                                                <Loader2 size={28} className="text-blue-500 animate-spin" />
                                                <p className="text-xs font-semibold text-gray-500">Đang tải ảnh lên...</p>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Status messages */}
                                {!isUploading && uploadedUrl && !error && (
                                    <div className="flex items-center gap-2 bg-green-50 border border-green-100 rounded-xl px-3 py-2 text-xs text-green-700 font-medium">
                                        <CheckCircle2 size={14} className="text-green-500 shrink-0" />
                                        Ảnh đã tải lên thành công — nhấn <span className="font-bold">&quot;Lưu avatar&quot;</span> để cập nhật
                                    </div>
                                )}

                                {/* Nút chọn ảnh khác */}
                                {!isUploading && !isSaving && (
                                    <button
                                        onClick={handlePickAnother}
                                        className="text-xs text-blue-500 hover:text-blue-700 font-medium transition-colors"
                                    >
                                        ← Chọn ảnh khác
                                    </button>
                                )}
                            </div>
                        )}

                        {/* ════ STEP: DONE ════ */}
                        {step === "done" && (
                            <div className="flex flex-col items-center gap-3 py-6 animate-in zoom-in-95 duration-300">
                                <div className="p-3 bg-green-50 rounded-full">
                                    <CheckCircle2 size={32} className="text-green-500" />
                                </div>
                                <p className="text-base font-bold text-green-700">Cập nhật avatar thành công! 🎉</p>
                                {uploadedUrl && (
                                    <img
                                        src={uploadedUrl}
                                        alt="new avatar"
                                        className="w-20 h-20 rounded-2xl object-cover border-2 border-green-200 shadow mt-1"
                                    />
                                )}
                            </div>
                        )}

                        {/* Error */}
                        {error && (
                            <div className="mt-3 flex items-center gap-2 bg-red-50 border border-red-100 rounded-xl px-3 py-2 text-xs text-red-600 font-medium">
                                <AlertCircle size={14} className="shrink-0" />
                                {error}
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    {step !== "done" && (
                        <div className="px-6 pb-5 flex gap-2">
                            <button
                                onClick={handleClose}
                                disabled={isSaving}
                                className={`py-2.5 rounded-2xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-40 ${step === "pick" ? "w-full" : "flex-1"}`}
                            >
                                Huỷ
                            </button>
                            {step !== "pick" && (
                                <button
                                    onClick={handleSave}
                                    disabled={!uploadedUrl || isUploading || isSaving}
                                    className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-2xl bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-95"
                                >
                                    {isSaving ? (
                                        <>
                                            <Loader2 size={15} className="animate-spin" />
                                            Đang lưu...
                                        </>
                                    ) : (
                                        <>
                                            <CheckCircle2 size={15} />
                                            Lưu avatar
                                        </>
                                    )}
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
