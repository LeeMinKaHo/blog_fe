import BlogCard from "./BlogCard";

export default function BlogList({ posts }: { posts: any[] }) {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 bg-gray-50 rounded-lg shadow-inner ">
      {posts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No blog posts available yet. Check back soon!</p>
        </div>
      ) : (
        <div className="">
          {posts.map((p) => (
            <BlogCard key={p.id} post={p} />
          ))}
        </div>
      )}
    </div>
  );
}