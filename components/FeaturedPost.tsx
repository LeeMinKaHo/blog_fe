import { Blog } from "@/app/services/blogService";
import FeaturedPostItem from "./FeaturedPostItem";

interface FeaturedPostListProps {
    blogs: Blog[];
}

export default function FeaturedPostList({ blogs }: FeaturedPostListProps) {
    if (!blogs || blogs.length === 0) return null;

    return (
        <div className="mt-8">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <span className="w-2 h-8 bg-black"></span>
                Bài viết nổi bật trong tuần
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                {blogs.map((blog, index) => (
                    <FeaturedPostItem 
                        key={blog.id} 
                        blog={blog} 
                        rank={index + 1} 
                    />
                ))}
            </div>
        </div>
    );
}