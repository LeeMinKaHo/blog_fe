import ExploreMoreItem from "./ExploreMoreItem";

export default function ExploreMore() {
   // call api theo category
   return (
      <div className="flex flex-wrap items-center gap-4">
         <h2>Explore More</h2>
         <ExploreMoreItem />
         <ExploreMoreItem />
         <ExploreMoreItem />
      </div>
   );
}