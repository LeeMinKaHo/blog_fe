export default function Loading() {
    return (
        <div className="max-w-4xl mx-auto px-4 py-12">
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
                <div className="relative h-48 bg-gradient-to-r from-blue-100 to-indigo-100 animate-pulse"></div>
                <div className="px-8 pb-8">
                    <div className="relative flex justify-between items-end -mt-16 mb-6">
                        <div className="p-2 bg-white rounded-3xl shadow-lg">
                            <div className="w-32 h-32 bg-gray-200 animate-pulse rounded-2xl"></div>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <div className="h-8 bg-gray-200 animate-pulse rounded w-1/3"></div>
                        <div className="h-4 bg-gray-100 animate-pulse rounded w-1/4"></div>
                        <div className="pt-6 space-y-3">
                            <div className="h-4 bg-gray-50 animate-pulse rounded w-full"></div>
                            <div className="h-4 bg-gray-50 animate-pulse rounded w-5/6"></div>
                            <div className="h-4 bg-gray-50 animate-pulse rounded w-4/6"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
