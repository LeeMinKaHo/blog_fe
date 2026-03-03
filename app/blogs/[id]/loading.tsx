export default function Loading() {
  return (
    <article className="max-w-4xl mx-auto px-4 py-12">
      {/* Back button skeleton */}
      <div className="h-4 bg-gray-100 animate-pulse rounded w-32 mb-8"></div>

      <header className="mb-10 text-center flex flex-col items-center">
        {/* Title skeleton */}
        <div className="h-10 md:h-12 bg-gray-200 animate-pulse rounded-lg w-3/4 mb-6"></div>
        <div className="h-10 md:h-12 bg-gray-200 animate-pulse rounded-lg w-1/2 mb-6"></div>

        {/* Metadata skeleton */}
        <div className="flex justify-center gap-6">
          <div className="h-4 bg-gray-100 animate-pulse rounded w-20"></div>
          <div className="h-4 bg-gray-100 animate-pulse rounded w-32"></div>
          <div className="h-4 bg-gray-100 animate-pulse rounded w-24"></div>
        </div>
      </header>

      {/* Main image skeleton */}
      <div className="aspect-video bg-gray-200 animate-pulse rounded-2xl shadow-lg mb-12"></div>

      {/* Content skeleton */}
      <div className="space-y-4">
        <div className="h-6 bg-gray-100 animate-pulse rounded w-full"></div>
        <div className="h-6 bg-gray-100 animate-pulse rounded w-full"></div>
        <div className="h-6 bg-gray-100 animate-pulse rounded w-3/4"></div>
        <div className="h-6 bg-gray-100 animate-pulse rounded w-full"></div>
        <div className="h-6 bg-gray-100 animate-pulse rounded w-5/6"></div>
        <div className="h-6 bg-gray-100 animate-pulse rounded w-2/3 mt-8"></div>
      </div>

      {/* Comment section skeleton */}
      <div className="mt-16 pt-8 border-t border-gray-100">
        <div className="h-8 bg-gray-100 animate-pulse rounded w-48 mb-6"></div>
        <div className="space-y-4">
          <div className="h-32 bg-gray-50 animate-pulse rounded-xl"></div>
          <div className="h-32 bg-gray-50 animate-pulse rounded-xl"></div>
        </div>
      </div>
    </article>
  );
}
