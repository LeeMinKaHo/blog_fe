"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import Pagination from "./Pagination";

interface PaginationWrapperProps {
    currentPage: number;
    totalPages: number;
    totalItems: number;
}

export function PaginationWrapper({
    currentPage,
    totalPages,
    totalItems,
}: PaginationWrapperProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const handlePageChange = (page: number) => {
        const params = new URLSearchParams(searchParams.toString());
        if (page > 1) {
            params.set("page", page.toString());
        } else {
            params.delete("page");
        }
        router.push(`${pathname}?${params.toString()}`, { scroll: true });
    };

    return (
        <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalItems}
            onPageChange={handlePageChange}
        />
    );
}
