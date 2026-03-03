import Link from "next/link";

export default function Top5NewPost({ posts = [] }: { posts: any[] }) {
   if (!posts.length) return null;

   const mainPost = posts[0];
   const secondPost = posts[1];
   const remainingPosts = posts.slice(2, 5);

   return (
      <div className="mb-10">
         {/* Row 1 */}
         <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="flex-[7] group">
               <Link href={`/blogs/${mainPost?.id}`}>
                  <div className="relative aspect-video overflow-hidden rounded-xl bg-gray-100">
                     <img
                        src={mainPost?.thumbnail || "https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=2070&auto=format&fit=crop"}
                        alt={mainPost?.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                     />
                     <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                        <h2 className="text-white text-2xl font-bold line-clamp-2 mb-2">{mainPost?.title}</h2>
                        <p className="text-white/80 text-sm">{mainPost?.author || "Admin"}</p>
                     </div>
                  </div>
               </Link>
            </div>

            {secondPost && (
               <div className="flex-[3] group">
                  <Link href={`/blogs/${secondPost?.id}`}>
                     <div className="h-full flex flex-col">
                        <div className="relative aspect-video flex-1 overflow-hidden rounded-xl mb-3">
                           <img
                              src={secondPost?.thumbnail || "https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=2070&auto=format&fit=crop"}
                              alt={secondPost?.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                           />
                        </div>
                        <div className="bg-gray-50 p-4 rounded-xl flex-1 border border-gray-100 group-hover:bg-blue-50 transition-colors">
                           <h3 className="font-bold text-gray-800 line-clamp-2 mb-2 group-hover:text-blue-600">
                              {secondPost?.title}
                           </h3>
                           <p className="text-gray-500 text-xs mb-2">{secondPost?.author || "Admin"}</p>
                           <p className="text-gray-600 text-sm line-clamp-3">
                              {secondPost?.description || "No description available."}
                           </p>
                        </div>
                     </div>
                  </Link>
               </div>
            )}
         </div>

         {/* Row 2 */}
         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {remainingPosts.map((post) => (
               <Link key={post.id} href={`/blogs/${post.id}`} className="group">
                  <div className="flex flex-col gap-3">
                     <div className="relative aspect-video overflow-hidden rounded-xl">
                        <img
                           src={post.thumbnail || "https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=2070&auto=format&fit=crop"}
                           alt={post.title}
                           className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                     </div>
                     <div>
                        <h4 className="font-bold text-gray-800 line-clamp-2 group-hover:text-blue-600 transition-colors">
                           {post.title}
                        </h4>
                        <p className="text-gray-500 text-xs mt-1">{post.author || "Admin"}</p>
                     </div>
                  </div>
               </Link>
            ))}
         </div>
      </div>
   );
}
