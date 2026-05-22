"use client";

import { X, HelpCircle, Heading2, Heading3, ImageIcon, Youtube, Quote, Link as LinkIcon } from "lucide-react";

interface GuideModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function GuideModal({ isOpen, onClose }: GuideModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-2xl max-h-[80vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="p-6 border-b flex items-center justify-between bg-blue-50">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white">
                            <HelpCircle size={24} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">Hướng dẫn viết bài</h2>
                            <p className="text-sm text-blue-600 font-medium">Mẹo để có một bài blog chuyên nghiệp</p>
                        </div>
                    </div>
                    <button 
                        onClick={onClose}
                        className="p-2 hover:bg-white rounded-full transition-colors text-gray-500"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-8 space-y-8">
                    {/* Section 1: Mục lục */}
                    <section>
                        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <span className="w-6 h-6 bg-gray-100 rounded-md flex items-center justify-center text-sm">1</span>
                            Tạo mục lục tự động (TOC)
                        </h3>
                        <div className="space-y-4 text-gray-600 leading-relaxed">
                            <p>Để mục lục xuất hiện ở bên trái bài viết, bạn cần sử dụng các thẻ tiêu đề:</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="border border-gray-100 rounded-2xl p-4 bg-gray-50">
                                    <div className="flex items-center gap-2 mb-2 font-bold text-gray-800">
                                        <Heading2 size={18} className="text-blue-500" />
                                        Heading 2
                                    </div>
                                    <p className="text-xs">Dùng cho các mục chính. Sẽ hiển thị to nhất trong mục lục.</p>
                                </div>
                                <div className="border border-gray-100 rounded-2xl p-4 bg-gray-50">
                                    <div className="flex items-center gap-2 mb-2 font-bold text-gray-800">
                                        <Heading3 size={18} className="text-blue-500" />
                                        Heading 3
                                    </div>
                                    <p className="text-xs">Dùng cho các mục con. Sẽ được thụt lề trong mục lục.</p>
                                </div>
                            </div>
                            <p className="text-xs bg-amber-50 text-amber-700 p-3 rounded-xl border border-amber-100 italic">
                                💡 Lưu ý: Heading 1 (H1) nên dành riêng cho tiêu đề bài viết, không nên dùng trong nội dung.
                            </p>
                        </div>
                    </section>

                    {/* Section 2: Chèn Media */}
                    <section>
                        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <span className="w-6 h-6 bg-gray-100 rounded-md flex items-center justify-center text-sm">2</span>
                            Hình ảnh & Video
                        </h3>
                        <div className="space-y-4">
                            <div className="flex items-start gap-4">
                                <div className="p-2 bg-gray-100 rounded-lg text-gray-600"><ImageIcon size={20} /></div>
                                <div>
                                    <p className="font-bold text-gray-800 text-sm">Chèn hình ảnh</p>
                                    <p className="text-sm text-gray-500">Ảnh sẽ tự động được bo góc, đổ bóng và tối ưu kích thước.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="p-2 bg-gray-100 rounded-lg text-gray-600"><Youtube size={20} /></div>
                                <div>
                                    <p className="font-bold text-gray-800 text-sm">Chèn Video Youtube</p>
                                    <p className="text-sm text-gray-500">Chỉ cần dán link, video sẽ hiển thị chuẩn tỉ lệ 16:9.</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Section 3: Formatting */}
                    <section>
                        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <span className="w-6 h-6 bg-gray-100 rounded-md flex items-center justify-center text-sm">3</span>
                            Định dạng khác
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex items-center gap-3">
                                <Quote size={18} className="text-gray-400" />
                                <span className="text-sm text-gray-600">Trích dẫn (Blockquote)</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <LinkIcon size={18} className="text-gray-400" />
                                <span className="text-sm text-gray-600">Gán liên kết (Link)</span>
                            </div>
                        </div>
                    </section>
                </div>

                {/* Footer */}
                <div className="p-6 border-t bg-gray-50 flex justify-end">
                    <button 
                        onClick={onClose}
                        className="px-6 py-2 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200"
                    >
                        Đã hiểu!
                    </button>
                </div>
            </div>
        </div>
    );
}
