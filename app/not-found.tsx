"use client";

import Link from "next/link";
import { Home, Search, AlertTriangle, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6 py-24 select-none">
      <div className="max-w-2xl w-full text-center relative">
        {/* Background Decorative Element */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-blue-100/40 rounded-full blur-3xl -z-10" />
        
        {/* Big 404 Text */}
        <div className="relative mb-12">
          <h1 className="text-[150px] md:text-[200px] font-black leading-none text-transparent bg-clip-text bg-gradient-to-b from-blue-600 to-blue-300 opacity-20 select-none">
            404
          </h1>
          <div className="absolute inset-0 flex items-center justify-center">
             <div className="w-24 h-24 bg-white rounded-3xl shadow-2xl flex items-center justify-center border border-blue-50 animate-bounce duration-1000">
                <AlertTriangle size={48} className="text-blue-600" />
             </div>
          </div>
        </div>

        {/* Content */}
        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">
          Oops! Không tìm thấy trang
        </h2>
        <p className="text-gray-500 text-lg mb-10 max-w-md mx-auto leading-relaxed">
          Trang bạn đang tìm kiếm có thể đã bị xóa, đổi tên hoặc tạm thời không khả dụng.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/"
            className="flex items-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold shadow-xl shadow-blue-200 hover:bg-blue-700 hover:-translate-y-1 active:scale-95 transition-all duration-300"
          >
            <Home size={20} />
            Về trang chủ
          </Link>
          
          <Link
            href="/blogs"
            className="flex items-center gap-2 bg-white text-gray-700 border border-gray-100 px-8 py-4 rounded-2xl font-bold hover:bg-gray-50 hover:border-gray-200 transition-all"
          >
            <Search size={20} />
            Khám phá bài viết
          </Link>
        </div>

        {/* Helper */}
        <div className="mt-16 pt-8 border-t border-gray-100">
           <p className="text-sm text-gray-400 mb-4 font-medium flex items-center justify-center gap-2">
              <span className="w-1.5 h-1.5 bg-blue-400 rounded-full" />
              Bạn cần hỗ trợ? Liên hệ bộ phận kỹ thuật
           </p>
        </div>
      </div>
    </div>
  );
}
