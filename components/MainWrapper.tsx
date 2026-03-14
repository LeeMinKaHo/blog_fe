"use client";

import { usePathname } from "next/navigation";

export default function MainWrapper({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isAdmin = pathname?.startsWith("/admin");

    return (
        <main className={isAdmin ? "flex-1 w-full" : "flex-1 max-w-5xl mx-auto w-full"}>
            {children}
        </main>
    );
}
