import SearchBox from "@/components/SearchBox";
import BlogList from "../components/BlogList";
import { getPosts } from "./lib/api";
import Image from "next/image";
import SideBar from "@/components/Sidebar";
import Top5NewPost from "@/components/Top5NewPost";
import ExploreMoreList from "@/components/ExploreMoreList";
import FeaturedPostList from "@/components/FeaturedPost";

export default async function Home() {
   const { posts, meta } = await getPosts(1, 10);

   return (
      <div className="flex justify-between gap-3">
         <div>
            <Top5NewPost posts={posts} />
            <FeaturedPostList />
            <div>
               <h1 className="text-3xl font-bold mb-6">Latest Blogs</h1>
               <SearchBox />
               <BlogList posts={posts} />
               <ExploreMoreList />

            </div>
         </div>
         {/* advertisement */}
         <div className="w-[280px] shrink-0">
            <SideBar />
         </div>
      </div>
   );
}
