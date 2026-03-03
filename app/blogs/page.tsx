import BlogsPageClient from "@/components/BlogsPageClient";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";

interface BlogPageProps {
    searchParams: Promise<{
        search?: string;
        categoryId?: string;
        page?: string;
    }>;
}

export const metadata = {
    title: "Bài viết | Foxtek Blog",
    description: "Khám phá tất cả bài viết về lập trình, công nghệ và nhiều chủ đề khác.",
};

export default async function BlogPage({ searchParams }: BlogPageProps) {
    const { search, categoryId, page } = await searchParams;

    return (
        <Suspense
            fallback={
                <div className="flex items-center justify-center min-h-[60vh] gap-2 text-blue-500">
                    <Loader2 className="animate-spin" size={24} />
                    <span className="text-sm font-medium">Đang tải...</span>
                </div>
            }
        >
            <BlogsPageClient
                initialSearch={search ?? ""}
                initialCategoryId={categoryId ? Number(categoryId) : undefined}
                initialPage={page ? Number(page) : 1}
            />
        </Suspense>
    );
}