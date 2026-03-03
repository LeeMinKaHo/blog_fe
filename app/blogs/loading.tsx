export default function Loading() {
    return (
        <div className="flex gap-8 max-w-7xl mx-auto px-4 py-8">
            <div className="flex-[7] space-y-8">
                {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="flex gap-4">
                        <div className="w-56 h-40 bg-gray-200 animate-pulse rounded-lg shrink-0"></div>
                        <div className="flex-1 py-2">
                            <div className="h-6 bg-gray-200 animate-pulse rounded w-3/4 mb-3"></div>
                            <div className="h-4 bg-gray-200 animate-pulse rounded w-full mb-2"></div>
                            <div className="h-4 bg-gray-200 animate-pulse rounded w-2/3 mb-4"></div>
                            <div className="flex items-center gap-2">
                                <div className="w-6 h-6 bg-gray-200 animate-pulse rounded-full"></div>
                                <div className="h-4 bg-gray-200 animate-pulse rounded w-24"></div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <div className="flex-[3]">
                <div className="h-[500px] bg-gray-100 animate-pulse rounded-xl"></div>
            </div>
        </div>
    );
}
