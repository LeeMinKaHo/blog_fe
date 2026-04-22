"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Youtube from "@tiptap/extension-youtube";
import Placeholder from "@tiptap/extension-placeholder";
import { useRef, useState } from "react";
import { API_BASE_URL } from "@/app/lib/apiClient";
import {
    Bold, Italic, Underline as UnderlineIcon,
    Link as LinkIcon, Image as ImageIcon,
    List, ListOrdered, Heading1, Heading2,
    Youtube as YoutubeIcon, Quote, Undo, Redo
} from "lucide-react";
import { useToast } from "@/components/toast";

interface BlogEditorProps {
    content: string;
    onChange: (content: string) => void;
}

const MenuBar = ({ editor }: { editor: any }) => {
    if (!editor) return null;
    const toast = useToast();
    const imageInputRef = useRef<HTMLInputElement>(null);
    const [isUploading, setIsUploading] = useState(false);

    const addLink = () => {
        const url = window.prompt("Nhập địa chỉ Link:");
        if (url) {
            editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
        }
    };

    const addImage = async (file: File) => {
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
                const errText = await res.text().catch(() => "");
                let errMsg = `Upload thất bại (HTTP ${res.status})`;
                try {
                    const errJson = JSON.parse(errText);
                    if (errJson.message) errMsg = errJson.message;
                } catch { }
                throw new Error(errMsg);
            }
            const result = await res.json();
            // BE bọc response trong { data: { filename, url } }
            const imageUrl = result?.data?.url ?? result?.url;
            if (!imageUrl) throw new Error("Không lấy được URL ảnh từ server");
            editor.chain().focus().setImage({ src: imageUrl }).run();
        } catch (err: any) {
            console.error("Upload ảnh thất bại:", err);
            toast.error(err.message || "Không thể tải ảnh lên. Vui lòng thử lại!");
        } finally {
            setIsUploading(false);
        }
    };

    const addYoutubeVideo = () => {
        const url = window.prompt("Nhập URL Youtube:");
        if (url) {
            editor.chain().focus().setYoutubeVideo({ src: url }).run();
        }
    };

    return (
        <div className="flex flex-wrap gap-1 p-2 border-b bg-gray-50 rounded-t-2xl sticky top-0 z-10">
            <button
                onClick={() => editor.chain().focus().toggleBold().run()}
                className={`p-2 rounded-lg transition-colors ${editor.isActive("bold") ? "bg-blue-100 text-blue-600" : "hover:bg-gray-200"}`}
                title="In đậm"
            >
                <Bold size={18} />
            </button>
            <button
                onClick={() => editor.chain().focus().toggleItalic().run()}
                className={`p-2 rounded-lg transition-colors ${editor.isActive("italic") ? "bg-blue-100 text-blue-600" : "hover:bg-gray-200"}`}
                title="In nghiêng"
            >
                <Italic size={18} />
            </button>
            <button
                onClick={() => editor.chain().focus().toggleUnderline().run()}
                className={`p-2 rounded-lg transition-colors ${editor.isActive("underline") ? "bg-blue-100 text-blue-600" : "hover:bg-gray-200"}`}
                title="Gạch chân"
            >
                <UnderlineIcon size={18} />
            </button>

            <div className="w-px h-6 bg-gray-300 mx-1 self-center"></div>

            <button
                onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                className={`p-2 rounded-lg transition-colors ${editor.isActive("heading", { level: 1 }) ? "bg-blue-100 text-blue-600" : "hover:bg-gray-200"}`}
                title="Tiêu đề 1"
            >
                <Heading1 size={18} />
            </button>
            <button
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                className={`p-2 rounded-lg transition-colors ${editor.isActive("heading", { level: 2 }) ? "bg-blue-100 text-blue-600" : "hover:bg-gray-200"}`}
                title="Tiêu đề 2"
            >
                <Heading2 size={18} />
            </button>

            <div className="w-px h-6 bg-gray-300 mx-1 self-center"></div>

            <button
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                className={`p-2 rounded-lg transition-colors ${editor.isActive("bulletList") ? "bg-blue-100 text-blue-600" : "hover:bg-gray-200"}`}
                title="Danh sách dấu chấm"
            >
                <List size={18} />
            </button>
            <button
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                className={`p-2 rounded-lg transition-colors ${editor.isActive("orderedList") ? "bg-blue-100 text-blue-600" : "hover:bg-gray-200"}`}
                title="Danh sách số"
            >
                <ListOrdered size={18} />
            </button>
            <button
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
                className={`p-2 rounded-lg transition-colors ${editor.isActive("blockquote") ? "bg-blue-100 text-blue-600" : "hover:bg-gray-200"}`}
                title="Trích dẫn"
            >
                <Quote size={18} />
            </button>

            <div className="w-px h-6 bg-gray-300 mx-1 self-center"></div>

            <button
                onClick={addLink}
                className={`p-2 rounded-lg transition-colors ${editor.isActive("link") ? "bg-blue-100 text-blue-600" : "hover:bg-gray-200"}`}
                title="Thêm link"
            >
                <LinkIcon size={18} />
            </button>
            <button
                onClick={() => imageInputRef.current?.click()}
                disabled={isUploading}
                className={`p-2 rounded-lg transition-colors hover:bg-gray-200 relative ${isUploading ? "opacity-50" : ""}`}
                title="Tải ảnh lên"
            >
                {isUploading ? (
                    <div className="w-[18px] h-[18px] border-2 border-gray-400 border-t-blue-500 rounded-full animate-spin" />
                ) : (
                    <ImageIcon size={18} />
                )}
            </button>
            <input
                ref={imageInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) addImage(file);
                    e.target.value = "";
                }}
            />
            <button
                onClick={addYoutubeVideo}
                className="p-2 rounded-lg transition-colors hover:bg-gray-200"
                title="Thêm video Youtube"
            >
                <YoutubeIcon size={18} />
            </button>

            <div className="flex-1"></div>

            <button
                onClick={() => editor.chain().focus().undo().run()}
                className="p-2 rounded-lg transition-colors hover:bg-gray-200"
                title="Hoàn tác"
            >
                <Undo size={18} />
            </button>
            <button
                onClick={() => editor.chain().focus().redo().run()}
                className="p-2 rounded-lg transition-colors hover:bg-gray-200"
                title="Làm lại"
            >
                <Redo size={18} />
            </button>
        </div>
    );
};

export default function BlogEditor({ content, onChange }: BlogEditorProps) {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Underline,
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: "text-blue-600 underline cursor-pointer",
                },
            }),
            Image.configure({
                HTMLAttributes: {
                    class: "rounded-2xl shadow-lg max-w-full my-4",
                },
            }),
            Youtube.configure({
                width: 840,
                height: 480,
                HTMLAttributes: {
                    class: "rounded-2xl shadow-xl aspect-video w-full my-6",
                },
            }),
            Placeholder.configure({
                placeholder: "Bắt đầu viết nội dung bài viết tuyệt vời của bạn tại đây...",
            }),
        ],
        immediatelyRender: false,
        content: content,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
        editorProps: {
            attributes: {
                class: "prose prose-lg max-w-none focus:outline-none min-h-[400px] p-6 font-body",
            },
        },
    });

    return (
        <div className="border border-gray-200 rounded-2xl bg-white shadow-sm focus-within:border-blue-300 transition-colors">
            <MenuBar editor={editor} />
            <EditorContent editor={editor} />

            <style jsx global>{`
            .tiptap p.is-editor-empty:first-child::before {
               color: #adb5bd;
               content: attr(data-placeholder);
               float: left;
               height: 0;
               pointer-events: none;
            }
            .tiptap {
               font-family: inherit;
            }
            .tiptap h1 {
               font-size: 2.25rem;
               font-weight: 800;
               margin-top: 1.5rem;
               margin-bottom: 1rem;
               line-height: 1.2;
            }
            .tiptap h2 {
               font-size: 1.875rem;
               font-weight: 700;
               margin-top: 1.25rem;
               margin-bottom: 0.75rem;
               line-height: 1.3;
            }
            .tiptap ul {
               list-style-type: disc;
               padding-left: 1.5rem;
               margin-top: 0.5rem;
               margin-bottom: 0.5rem;
            }
            .tiptap ol {
               list-style-type: decimal;
               padding-left: 1.5rem;
               margin-top: 0.5rem;
               margin-bottom: 0.5rem;
            }
            .tiptap li {
               margin-bottom: 0.25rem;
            }
            .tiptap blockquote {
               border-left: 4px solid #3b82f6;
               padding-left: 1rem;
               font-style: italic;
               color: #4b5563;
               margin-top: 1rem;
               margin-bottom: 1rem;
            }
            .tiptap a {
               color: #2563eb;
               text-decoration: underline;
               cursor: pointer;
            }
         `}</style>
        </div>
    );
}
