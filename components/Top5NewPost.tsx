import Link from "next/link";

export default function Top5NewPost({ posts = [] }: { posts: any[] }) {
   if (!posts.length) return null;

   const mainPost = posts[0];
   const secondPost = posts[1];
   const remainingPosts = posts.slice(2, 5);

   return (
      <div className="mb-10 space-y-4">
         {/* Row 1 */}
         <div className="flex flex-col md:flex-row gap-4 animate-fade-in-up">
            <div className="flex-[7] group relative">
               <Link href={`/blogs/${mainPost?.id}`}>
                  <div className="relative aspect-video overflow-hidden rounded-xl bg-gray-100 shadow-lg">
                     <img
                        src={mainPost?.thumbnail || "https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=2070&auto=format&fit=crop"}
                        alt={mainPost?.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                     />
                     <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-6 pt-20">
                        <h2 className="text-white text-2xl md:text-3xl font-bold line-clamp-2 mb-3 tracking-tight group-hover:text-blue-200 transition-colors">{mainPost?.title}</h2>
                     </div>
                  </div>
               </Link>
               {/* Author Link separated to avoid nesting */}
               <div className="absolute bottom-6 left-6 z-10 pointer-events-none">
                  <div className="pointer-events-auto">
                     <Link href={`/profile/${mainPost?.author?.id}`} className="flex items-center gap-2 text-white/90 hover:text-white transition-colors bg-black/20 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20">
                        <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-[10px] font-bold">
                           {mainPost?.author?.name?.[0] || mainPost?.author?.email?.[0] || "A"}
                        </div>
                        <span className="text-sm font-medium">{mainPost?.author?.name || "Admin"}</span>
                     </Link>
                  </div>
               </div>
            </div>

            {secondPost && (
               <div className="flex-[3] group relative flex flex-col">
                  <Link href={`/blogs/${secondPost?.id}`} className="flex-1 flex flex-col">
                     <div className="relative aspect-video overflow-hidden rounded-xl mb-3 shadow-md border border-gray-100">
                        <img
                           src={secondPost?.thumbnail || "https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=2070&auto=format&fit=crop"}
                           alt={secondPost?.title}
                           className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                     </div>
                     <div className="bg-gray-50 p-4 rounded-xl flex-1 border border-gray-100 group-hover:bg-blue-50 transition-colors">
                        <h3 className="font-bold text-gray-800 line-clamp-2 mb-3 group-hover:text-blue-600 transition-colors leading-snug">
                           {secondPost?.title}
                        </h3>
                        <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                           {secondPost?.description || "No description available."}
                        </p>
                     </div>
                  </Link>
                  {/* Author Link */}
                  <div className="absolute bottom-4 left-4">
                     <Link href={`/profile/${secondPost?.author?.id}`} className="flex items-center gap-2 group/author px-2 py-1 hover:bg-white rounded-lg transition-colors border border-transparent hover:border-blue-100 shadow-sm md:shadow-none">
                        <div className="w-6 h-6 rounded-full bg-linear-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-[10px] text-white font-bold">
                           {secondPost?.author?.name?.[0] || secondPost?.author?.email?.[0] || "A"}
                        </div>
                        <span className="text-xs font-semibold text-gray-500 group-hover/author:text-blue-600 transition-colors">
                           {secondPost?.author?.name || "Admin"}
                        </span>
                     </Link>
                  </div>
               </div>
            )}
         </div>

         {/* Row 2 */}
         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {remainingPosts.map((post, index) => (
               <div 
                  key={post.id} 
                  className={`group relative flex flex-col gap-3 animate-fade-in-up animate-delay-${(index + 2) * 100}`}
               >
                  <Link href={`/blogs/${post.id}`}>
                     <div className="relative aspect-video overflow-hidden rounded-xl shadow-sm border border-gray-100">
                        <img
                           src={post.thumbnail || "https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=2070&auto=format&fit=crop"}
                           alt={post.title}
                           className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                     </div>
                     <h4 className="font-bold text-gray-800 line-clamp-2 mt-3 group-hover:text-blue-600 transition-colors leading-snug">
                        {post.title}
                     </h4>
                  </Link>
                  
                  <Link href={`/profile/${post.author?.id}`} className="flex items-center gap-2 w-fit group/author px-2 py-1 hover:bg-gray-50 rounded-lg transition-colors">
                     <div className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center text-[9px] font-bold text-gray-600 group-hover/author:bg-blue-100 group-hover/author:text-blue-600 transition-colors">
                        {post.author?.name?.[0] || post.author?.email?.[0] || "A"}
                     </div>
                     <span className="text-gray-500 text-xs font-medium group-hover/author:text-blue-600 transition-colors">
                        {post.author?.name || "Admin"}
                     </span>
                  </Link>
               </div>
            ))}
         </div>
      </div>
   );
}

