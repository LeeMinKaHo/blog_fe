import { useMe } from "@/app/hooks/useMe";
import Link from "next/link";
import { Lock, ArrowRight } from "lucide-react";

function LoginRequired() {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6">
      <div className="w-full max-w-md bg-white rounded-[32px] border border-gray-100 shadow-2xl p-10 text-center animate-in fade-in zoom-in-95 duration-500">
        <div className="w-20 h-20 bg-blue-50 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-inner">
          <Lock size={36} className="text-blue-600 drop-shadow-[0_0_10px_rgba(37,99,235,0.3)]" />
        </div>
        
        <h2 className="text-2xl font-black text-gray-900 mb-3 tracking-tight">
          Bạn cần đăng nhập
        </h2>
        
        <p className="text-gray-500 text-sm leading-relaxed mb-10 max-w-[280px] mx-auto font-medium">
          Tính năng này chỉ dành cho thành viên. Đăng nhập để tiếp tục trải nghiệm nhé!
        </p>

        <div className="space-y-4">
          <Link
            href="/login"
            className="flex items-center justify-center gap-3 w-full bg-blue-600 text-white px-8 py-4 rounded-2xl font-extrabold shadow-xl shadow-blue-200 hover:bg-blue-700 hover:-translate-y-1 active:scale-95 transition-all duration-300 group"
          >
            Đăng nhập ngay
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          
          <Link
            href="/register"
            className="block text-sm font-bold text-gray-400 hover:text-blue-600 transition-colors py-2"
          >
            Chưa có tài khoản? Đăng ký ngay
          </Link>
        </div>
      </div>
    </div>
  );
}


export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { data: user, isLoading } = useMe();

  if (isLoading) return null;

  if (!user) {
    return <LoginRequired />;
  }

  return <>{children}</>;
}
