import { useState, useCallback } from "react";

export interface UsePaginationOptions {
    totalItems: number;
    itemsPerPage?: number;
    initialPage?: number;
}

export interface UsePaginationReturn {
    // State
    currentPage: number;
    totalPages: number;

    // Index info (0-based)
    startIndex: number;
    endIndex: number;
    itemsOnCurrentPage: number;

    // Controls
    setPage: (pageNumber: number) => void;
    nextPage: () => void;
    prevPage: () => void;

    // Flags
    canNextPage: boolean;
    canPrevPage: boolean;
}

export function usePagination({
    totalItems,
    itemsPerPage = 10,
    initialPage = 1,
}: UsePaginationOptions): UsePaginationReturn {
    // ✅ Calculate total pages (min 1 to avoid page 0)
    const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));

    // ✅ Track the current page (state only holds the raw value)
    const [rawPage, setRawPage] = useState<number>(initialPage);

    // ✅ Derive the safe page during render (no effect needed)
    const currentPage = Math.max(1, Math.min(rawPage, totalPages));

    // ✅ Derived index values (0-based)
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
    const itemsOnCurrentPage = Math.max(0, endIndex - startIndex);

    // ✅ Navigation flags
    const canPrevPage = currentPage > 1;
    const canNextPage = currentPage < totalPages;

    // ✅ Control functions (all bounds-safe)
    const setPage = useCallback(
        (pageNumber: number) => {
            const safePage = Math.max(1, Math.min(pageNumber, totalPages));
            setRawPage(safePage);
        },
        [totalPages]
    );

    const nextPage = useCallback(() => {
        setRawPage((prev) => Math.min(prev + 1, totalPages));
    }, [totalPages]);

    const prevPage = useCallback(() => {
        setRawPage((prev) => Math.max(prev - 1, 1));
    }, []);

    return {
        currentPage,
        totalPages,
        startIndex,
        endIndex,
        itemsOnCurrentPage,
        setPage,
        nextPage,
        prevPage,
        canNextPage,
        canPrevPage,
    };
}