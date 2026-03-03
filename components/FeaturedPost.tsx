import FeaturedPostItem from "./FeaturedPostItem";

export default function FeaturedPostList() {
    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">Bài nổi bật</h2>
            <div className="grid grid-cols-2 gap-5">
                <FeaturedPostItem />
                <FeaturedPostItem />
                <FeaturedPostItem />
                <FeaturedPostItem />
                <FeaturedPostItem />
                <FeaturedPostItem />
            </div>

        </div>
    );
}