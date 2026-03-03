"use client";

import { useMe } from "@/app/hooks/useMe";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function AdminGuard({ children }: { children: React.ReactNode }) {
    const { data: user, isLoading } = useMe();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && (!user || user.role !== "Admin")) {
            router.push("/");
        }
    }, [user, isLoading, router]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin"></div>
                    <p className="text-gray-500 font-medium animate-pulse">Đang kiểm tra quyền truy cập...</p>
                </div>
            </div>
        );
    }

    if (!user || user.role !== "Admin") {
        return null;
    }

    return <>{children}</>;
}
