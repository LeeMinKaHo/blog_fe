"use client";

import { useEffect, useState, useRef } from "react";
import { ChevronDown, List } from "lucide-react";
import type { TocHeading } from "@/app/lib/toc-utils";

interface TableOfContentsProps {
    headings: TocHeading[];
}

export default function TableOfContents({ headings }: TableOfContentsProps) {
    const [activeId, setActiveId] = useState<string>("");
    const [isOpen, setIsOpen] = useState(true);
    const observerRef = useRef<IntersectionObserver | null>(null);

    // IntersectionObserver để tự động highlight heading đang đọc
    useEffect(() => {
        if (headings.length === 0) return;

        const headingElements = headings
            .map(({ id }) => document.getElementById(id))
            .filter(Boolean) as HTMLElement[];

        observerRef.current = new IntersectionObserver(
            (entries) => {
                // Tìm heading đầu tiên đang visible trong viewport
                const visible = entries
                    .filter((e) => e.isIntersecting)
                    .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

                if (visible.length > 0) {
                    setActiveId(visible[0].target.id);
                }
            },
            {
                rootMargin: "-20% 0% -70% 0%",
                threshold: 0,
            }
        );

        headingElements.forEach((el) => observerRef.current?.observe(el));

        return () => observerRef.current?.disconnect();
    }, [headings]);

    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
        e.preventDefault();
        const el = document.getElementById(id);
        if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "start" });
            setActiveId(id);
            // Cập nhật URL hash mà không reload trang
            window.history.pushState(null, "", `#${id}`);
        }
    };

    if (headings.length === 0) return null;

    return (
        <>
            {/* ─── Desktop: Sticky sidebar bên trái ─── */}
            <aside className="hidden xl:block w-64 shrink-0">
                <div className="sticky top-24 max-h-[calc(100vh-6rem)] overflow-y-auto">
                    <div className="border border-gray-200 rounded-2xl p-5">
                        {/* Header */}
                        <div className="flex items-center gap-2 mb-4">
                            <List size={16} className="text-gray-500 shrink-0" />
                            <span className="text-sm font-bold text-gray-700 uppercase tracking-wide">
                                Mục lục
                            </span>
                        </div>

                        {/* Heading list */}
                        <nav className="space-y-0.5">
                            {headings.map((heading) => (
                                <a
                                    key={heading.id}
                                    href={`#${heading.id}`}
                                    onClick={(e) => handleClick(e, heading.id)}
                                    className={`
                                        block text-sm py-1.5 pr-2 rounded-lg transition-all duration-200 leading-snug
                                        ${heading.level === 3 ? "pl-5" : "pl-2"}
                                        ${activeId === heading.id
                                            ? "text-blue-600 font-semibold bg-blue-50 border-l-2 border-blue-500"
                                            : "text-gray-500 hover:text-gray-900 hover:bg-gray-50 border-l-2 border-transparent"
                                        }
                                    `}
                                >
                                    {heading.text}
                                </a>
                            ))}
                        </nav>
                    </div>
                </div>
            </aside>

            {/* ─── Mobile / Tablet: Collapsible block ─── */}
            <div className="xl:hidden mb-8 border border-gray-200 rounded-2xl overflow-hidden">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="w-full flex items-center justify-between px-5 py-4 bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                    <div className="flex items-center gap-2">
                        <List size={16} className="text-gray-500" />
                        <span className="text-sm font-bold text-gray-700 uppercase tracking-wide">
                            Mục lục
                        </span>
                        <span className="text-xs text-gray-400 font-normal">
                            ({headings.length} mục)
                        </span>
                    </div>
                    <ChevronDown
                        size={18}
                        className={`text-gray-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                    />
                </button>

                {isOpen && (
                    <nav className="px-5 py-4 space-y-1">
                        {headings.map((heading) => (
                            <a
                                key={heading.id}
                                href={`#${heading.id}`}
                                onClick={(e) => handleClick(e, heading.id)}
                                className={`
                                    block text-sm py-1.5 rounded-lg transition-colors leading-snug
                                    ${heading.level === 3 ? "pl-5" : "pl-2"}
                                    ${activeId === heading.id
                                        ? "text-blue-600 font-semibold"
                                        : "text-gray-500 hover:text-gray-900"
                                    }
                                `}
                            >
                                {heading.text}
                            </a>
                        ))}
                    </nav>
                )}
            </div>
        </>
    );
}
