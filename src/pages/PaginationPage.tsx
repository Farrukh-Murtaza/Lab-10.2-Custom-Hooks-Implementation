import { ArrowLeft, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { useState, useMemo, useRef, useLayoutEffect } from "react";
import { useNavigate } from "react-router-dom";

// Generate dummy items
const ALL_ITEMS = Array.from({ length: 123 }, (_, i) => `Item ${i + 1}`);


function PaginationPage() {
    const navigate = useNavigate();
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);

    const totalItems = ALL_ITEMS.length;
    const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
    const safeCurrentPage = Math.min(currentPage, totalPages);

    const paginatedItems = useMemo(() => {
        const start = (safeCurrentPage - 1) * itemsPerPage;
        return ALL_ITEMS.slice(start, start + itemsPerPage);
    }, [safeCurrentPage, itemsPerPage]);

    const startIndex = (safeCurrentPage - 1) * itemsPerPage + 1;
    const endIndex = Math.min(safeCurrentPage * itemsPerPage, totalItems);

    const isFirstPage = safeCurrentPage === 1;
    const isLastPage = safeCurrentPage === totalPages;

    // Refs
    const numbersRef = useRef<HTMLDivElement>(null);
    const pageButtonRefs = useRef<Record<number, HTMLButtonElement | null>>({});

    // Center the active page button inside the scroll container
    useLayoutEffect(() => {
        const activeButton = pageButtonRefs.current[safeCurrentPage];
        const container = numbersRef.current;
        if (!activeButton || !container) return;

        // Target: center the active button horizontally
        const targetScrollLeft =
            activeButton.offsetLeft -
            container.clientWidth / 2 +
            activeButton.clientWidth / 2;

        const maxScroll = container.scrollWidth - container.clientWidth;
        const clampedScroll = Math.max(0, Math.min(targetScrollLeft, maxScroll));

        container.scrollTo({
            left: clampedScroll,
            behavior: "smooth",
        });
    }, [safeCurrentPage, itemsPerPage]);

    const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setItemsPerPage(Number(e.target.value));
        setCurrentPage(1);
    };

    const handlePageInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = Number(e.target.value);
        if (value >= 1 && value <= totalPages) setCurrentPage(value);
    };

    const goToPrevious = () => setCurrentPage((p) => Math.max(p - 1, 1));
    const goToNext = () => setCurrentPage((p) => Math.min(p + 1, totalPages));
    const goToPage = (page: number) => setCurrentPage(page);
    const goToFirst = () => setCurrentPage(1);
    const goToLast = () => setCurrentPage(totalPages);

    return (
        <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center p-4">
            <div className="w-full max-w-3xl">
                <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-200/60 overflow-hidden">

                    <div className="flex gap-5 items-center pl-4 pr-6 py-5 border-b border-slate-100 bg-linear-to-r from-slate-50 to-white">
                        <button
                            onClick={() => navigate('/')}
                            className="p-2 w-11 h-11 shadow-2xl flex justify-center items-center border-border border hover:bg-muted transition-colors bg-white rounded-full "
                        >
                            <ArrowLeft size={20} className="text-muted-white" />
                        </button>


                        <div className="flex flex-1 items-center justify-between flex-wrap gap-3">
                            <div>
                                <h3 className="text-2xl font-bold text-slate-900 tracking-tight">
                                    Pagination Demo
                                </h3>
                                <p className="text-sm text-slate-500 mt-0.5">
                                    Browse through your items with ease
                                </p>
                            </div>

                            <div className="flex items-center gap-2">
                                <label htmlFor="itemsPerPageSelect" className="text-sm font-medium text-slate-600">
                                    Per page
                                </label>
                                <select
                                    id="itemsPerPageSelect"
                                    value={itemsPerPage}
                                    onChange={handleItemsPerPageChange}
                                    className="px-3 py-1.5 text-sm font-medium bg-white border border-slate-200 rounded-lg text-slate-700 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 cursor-pointer"
                                >
                                    <option value="5">5</option>
                                    <option value="10">10</option>
                                    <option value="15">15</option>
                                    <option value="20">20</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Items list */}
                    <div className="p-6">
                        <ul className="space-y-1">
                            {paginatedItems.map((item, index) => (
                                <li
                                    key={item}
                                    className="group flex items-center gap-3 px-4 py-2.5 rounded-lg text-slate-700 hover:bg-linear-to-r hover:from-blue-50 hover:to-indigo-50 hover:text-slate-900 transition-all duration-200 cursor-default"
                                >
                                    <span className="shrink-0 w-7 h-7 rounded-full bg-slate-100 group-hover:bg-blue-500 text-slate-500 group-hover:text-white flex items-center justify-center text-xs font-semibold transition-all duration-200">
                                        {startIndex + index}
                                    </span>
                                    <span className="font-medium">{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Footer */}
                    <div className="px-6 py-5 bg-slate-50/70 border-t border-slate-100">
                        <div className="text-center text-sm text-slate-500 mb-4">
                            Showing{" "}
                            <span className="font-semibold text-slate-700">{startIndex}–{endIndex}</span>{" "}
                            of{" "}
                            <span className="font-semibold text-slate-700">{totalItems}</span>{" "}
                            items
                        </div>

                        <div className="flex items-center justify-center gap-1.5 flex-nowrap">
                            {/* First */}
                            <button
                                onClick={goToFirst}
                                disabled={isFirstPage}
                                aria-label="First page"
                                className={`shrink-0 p-2 rounded-lg border transition-all duration-200 ${isFirstPage
                                    ? "bg-slate-50 text-slate-300 border-slate-100 cursor-not-allowed"
                                    : "bg-white text-slate-600 border-slate-200 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 active:scale-95"
                                    }`}
                            >
                                <ChevronsLeft size={16} />
                            </button>

                            {/* Previous */}
                            <button
                                onClick={goToPrevious}
                                disabled={isFirstPage}
                                aria-label="Previous page"
                                className={`shrink-0 flex items-center gap-1 px-3 py-2 rounded-lg border text-sm font-medium transition-all duration-200 ${isFirstPage
                                    ? "bg-slate-50 text-slate-300 border-slate-100 cursor-not-allowed"
                                    : "bg-white text-slate-700 border-slate-200 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 active:scale-95"
                                    }`}
                            >
                                <ChevronLeft size={16} />
                                <span className="hidden sm:inline">Prev</span>
                            </button>

                            {/* Scrollable numbers container with centered active page */}
                            <div
                                ref={numbersRef}
                                className="
                                    relative
                                    flex items-center gap-1 mx-1
                                    overflow-x-auto flex-nowrap
                                    max-w-[60vw] sm:max-w-100
                                    scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent
                                    px-1
                                "
                                style={{ scrollBehavior: "smooth" }}
                            >
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                                    const isActive = page === safeCurrentPage;
                                    return (
                                        <button
                                            key={page}
                                            ref={(el) => {
                                                pageButtonRefs.current[page] = el;
                                            }}
                                            onClick={() => goToPage(page)}
                                            disabled={isActive}
                                            className={`
                                                shrink-0 min-w-9 h-9 px-2 rounded-lg
                                                text-sm font-semibold
                                                transition-all duration-300
                                                ${isActive
                                                    ? "bg-linear-to-br from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/30 scale-110 z-10 cursor-default"
                                                    : "bg-white text-slate-600 border border-slate-200 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 hover:scale-105 active:scale-95"
                                                }
                                            `}
                                        >
                                            {page}
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Next */}
                            <button
                                onClick={goToNext}
                                disabled={isLastPage}
                                aria-label="Next page"
                                className={`shrink-0 flex items-center gap-1 px-3 py-2 rounded-lg border text-sm font-medium transition-all duration-200 ${isLastPage
                                    ? "bg-slate-50 text-slate-300 border-slate-100 cursor-not-allowed"
                                    : "bg-white text-slate-700 border-slate-200 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 active:scale-95"
                                    }`}
                            >
                                <span className="hidden sm:inline">Next</span>
                                <ChevronRight size={16} />
                            </button>

                            {/* Last */}
                            <button
                                onClick={goToLast}
                                disabled={isLastPage}
                                aria-label="Last page"
                                className={`shrink-0 p-2 rounded-lg border transition-all duration-200 ${isLastPage
                                    ? "bg-slate-50 text-slate-300 border-slate-100 cursor-not-allowed"
                                    : "bg-white text-slate-600 border-slate-200 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 active:scale-95"
                                    }`}
                            >
                                <ChevronsRight size={16} />
                            </button>
                        </div>

                        <div className="mt-4 flex items-center justify-center gap-2 text-sm text-slate-500">
                            <span>Jump to</span>
                            <input
                                type="number"
                                min="1"
                                max={totalPages}
                                value={safeCurrentPage}
                                onChange={handlePageInputChange}
                                className="w-14 h-8 text-center text-sm font-semibold bg-white border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            />
                            <span>of {totalPages}</span>
                        </div>
                    </div>
                </div>

                <p className="text-center text-xs text-slate-400 mt-4">
                    Powered by a custom pagination hook
                </p>
            </div>
        </div>
    );
}

export default PaginationPage;