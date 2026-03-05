import SearchBox from "@/components/SearchBox";
import BlogList from "../components/BlogList";
import { getPosts } from "./lib/api";
import Image from "next/image";
import SideBar from "@/components/Sidebar";
import Top5NewPost from "@/components/Top5NewPost";
import ExploreMoreList from "@/components/ExploreMoreList";
import FeaturedPostList from "@/components/FeaturedPost";


interface HomeProps {
   searchParams: Promise<{
      page?: string;
   }>;
}

export default async function Home({ searchParams }: HomeProps) {
   const { page } = await searchParams;
   const currentPage = page ? Number(page) : 1;
   const { posts, meta } = await getPosts(currentPage, 10);

   return (
      <div className="flex justify-between gap-3">
         <div className="flex-1 min-w-0">
            {currentPage === 1 && (
               <>
                  <Top5NewPost posts={posts} />
                  <FeaturedPostList />
               </>
            )}

            <div className="mt-10">
               <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-6">
                  {currentPage > 1 ? `Bài viết - Trang ${currentPage}` : "Bài viết mới nhất"}
               </h1>
               <div className="mb-8">
                  <SearchBox />
               </div>

               <BlogList posts={posts} />

               <div className="mt-8">
                  <PaginationWrapper
                     currentPage={currentPage}
                     totalPages={meta?.totalPages ?? 1}
                     totalItems={meta?.total ?? 0}
                  />
               </div>

               <div className="mt-10">
                  <ExploreMoreList />
               </div>
            </div>
         </div>

         {/* Sidebar */}
         <div className="w-[280px] shrink-0 hidden lg:block">
            <SideBar />
         </div>
      </div>
   );
}

// ─── Tạm thời dùng một Client Component nhỏ để handle navigation ───────────────
import { PaginationWrapper } from "@/components/PaginationWrapper";

