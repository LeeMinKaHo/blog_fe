import Link from "next/link";
import { Blog } from "@/app/services/blogService";

interface FeaturedPostItemProps {
    blog: Blog;
    rank: number;
}

export default function FeaturedPostItem({ blog, rank }: FeaturedPostItemProps) {
    return (
        <Link href={`/blogs/${blog.id}`} className="flex items-center gap-4 hover:opacity-100 transition-opacity group">
            <h2 className="text-[42px] font-bold font-body text-[#98a2b3] group-hover:text-black transition-colors min-w-[60px]">
                #{rank}
            </h2>
            <div>
                <h3 className="text-[17px] font-semibold font-body text-[#101828] line-clamp-2 leading-tight group-hover:text-blue-600 transition-colors">
                    {blog.title}
                </h3>
                <p className="text-[13px] font-body text-gray-400 mt-1">
                    {blog.author?.name || "Member"}
                </p>
            </div>
        </Link>
    );
}