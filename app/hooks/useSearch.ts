import { useEffect, useState } from "react";
import { getBlogs } from "@/app/services/blogService";
import type { Blog } from "@/app/services/blogService";

export type SearchBlogItem = Pick<Blog, "id" | "title" | "thumbnail" | "category" | "createdBy">;

export function useSearch(keyword: string, delay = 350) {
    const [results, setResults] = useState<SearchBlogItem[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const trimmed = keyword.trim();
        if (!trimmed) {
            setResults([]);
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        setError(null);

        const timer = setTimeout(async () => {
            try {
                const res = await getBlogs({ search: trimmed, limit: 8 });
                setResults(res.data ?? []);
            } catch {
                setError("Không thể tìm kiếm, vui lòng thử lại.");
                setResults([]);
            } finally {
                setIsLoading(false);
            }
        }, delay);

        return () => clearTimeout(timer);
    }, [keyword, delay]);

    return { results, isLoading, error };
}
