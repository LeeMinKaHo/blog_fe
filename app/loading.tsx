export default function Loading() {
    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            {/* Top 5 New Post Skeleton */}
            <div className="mb-10">
                <div className="flex flex-col md:flex-row gap-4 mb-4">
                    <div className="flex-[7] aspect-video bg-gray-200 animate-pulse rounded-xl"></div>
                    <div className="flex-[3] flex flex-col gap-4">
                        <div className="aspect-video bg-gray-200 animate-pulse rounded-xl"></div>
                        <div className="flex-1 bg-gray-100 animate-pulse rounded-xl p-4">
                            <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
                            <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                            <div className="h-4 bg-gray-200 rounded w-full"></div>
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="flex flex-col gap-3">
                            <div className="aspect-video bg-gray-200 animate-pulse rounded-xl"></div>
                            <div className="h-6 bg-gray-200 animate-pulse rounded w-3/4"></div>
                            <div className="h-4 bg-gray-200 animate-pulse rounded w-1/4"></div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex justify-between gap-8">
                <div className="flex-1">
                    <div className="h-10 bg-gray-200 animate-pulse rounded w-48 mb-6"></div>
                    <div className="h-12 bg-gray-100 animate-pulse rounded-full mb-8"></div>

                    <div className="space-y-8">
                        {[1, 2, 3, 4].map((i) => (
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
                </div>

                <div className="w-[200px] shrink-0">
                    <div className="h-[400px] bg-gray-200 animate-pulse rounded-xl"></div>
                </div>
            </div>
        </div>
    );
}
