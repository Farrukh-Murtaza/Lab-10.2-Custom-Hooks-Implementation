import { ArrowLeft, Loader2, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDebounce } from "../hooks/useDebounce";

interface Product {
    id: number;
    title: string;
    description: string;
    price: number;
    rating: number;
    brand?: string;
    category: string;
}

interface ProductsResponse {
    products: Product[];
    total: number;
    skip: number;
    limit: number;
}

interface DebounceSearchProps {
    defaultDelay?: number;
    defaultQuery?: string;
}

function DebounceSearch({
    defaultDelay = 500,
    defaultQuery = "",
}: DebounceSearchProps) {
    const navigate = useNavigate();

    const [query, setQuery] = useState(defaultQuery);
    const [delay, setDelay] = useState(defaultDelay);

    // ✅ Only track fetch-related state
    const [results, setResults] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const debouncedQuery = useDebounce(query, delay);

    // ✅ Derive whether we should show "empty" UI — no setState needed
    const hasQuery = debouncedQuery.trim().length > 0;

    useEffect(() => {
        // ✅ Early return — no state reset in the effect body
        if (!hasQuery) return;

        const controller = new AbortController();

        async function search() {
            setLoading(true);
            setError(null);

            try {
                const res = await fetch(
                    `https://dummyjson.com/products/search?q=${encodeURIComponent(
                        debouncedQuery
                    )}&limit=10`,
                    { signal: controller.signal }
                );

                if (!res.ok) throw new Error(`Search failed: ${res.status}`);

                const data: ProductsResponse = await res.json();
                setResults(data.products);
            } catch (err) {
                if (err instanceof DOMException && err.name === "AbortError") return;
                setError("Something went wrong. Please try again.");
                setResults([]);
            } finally {
                setLoading(false);
            }
        }

        search();

        return () => controller.abort();
    }, [debouncedQuery, hasQuery]);

    // ✅ Derive the list to render — no state mutation needed for "no query"
    const visibleResults = hasQuery ? results : [];

    return (
        <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center p-4">
            <div className="w-full max-w-3xl">
                <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-200/60 overflow-hidden">
                    {/* Header */}
                    <div className="flex gap-5 items-center pl-4 pr-6 py-5 border-b border-slate-100 bg-linear-to-r from-slate-50 to-white">
                        <button
                            onClick={() => navigate("/")}
                            className="p-2 w-11 h-11 flex justify-center items-center border border-slate-200 hover:bg-slate-50 transition-colors bg-white rounded-full shadow-sm"
                            aria-label="Back"
                        >
                            <ArrowLeft size={20} className="text-slate-600" />
                        </button>

                        <div>
                            <h3 className="text-2xl font-bold text-slate-900 tracking-tight">
                                Debounce Search
                            </h3>
                            <p className="text-sm text-slate-500 mt-0.5">
                                Live search with debounced API calls
                            </p>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                        {/* Delay input */}
                        <div className="mb-4">
                            <label
                                htmlFor="delayInput"
                                className="mr-2 text-sm font-medium text-slate-700"
                            >
                                Debounce Delay (ms):
                            </label>
                            <input
                                type="number"
                                id="delayInput"
                                min={0}
                                step={100}
                                value={delay}
                                onChange={(e) => setDelay(Number(e.target.value))}
                                className="p-2 w-24 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                            />
                        </div>

                        {/* Search input */}
                        <div className="relative mb-4">
                            <Search
                                size={18}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                            />
                            <input
                                type="text"
                                placeholder="Search products..."
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                className="w-full pl-10 pr-10 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                            />
                            {loading && (
                                <Loader2
                                    size={18}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-500 animate-spin"
                                />
                            )}
                        </div>

                        {/* Current input */}
                        <div className="mb-2 text-sm text-slate-700">
                            <strong>Current Input:</strong>{" "}
                            <span className="font-mono text-slate-900">
                                {query || "(empty)"}
                            </span>
                        </div>

                        {/* Debounced value */}
                        <div className="mb-4 text-sm text-slate-600 italic">
                            <strong>Debounced Value (after {delay}ms):</strong>{" "}
                            <span className="font-mono not-italic text-slate-900">
                                {debouncedQuery || "(empty)"}
                            </span>
                        </div>

                        {/* Error */}
                        {error && (
                            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                                {error}
                            </div>
                        )}

                        {/* Results */}
                        <div>
                            <h4 className="font-semibold mb-3 text-slate-800">
                                {debouncedQuery
                                    ? `Results for "${debouncedQuery}"`
                                    : "Search Results"}
                            </h4>

                            {!hasQuery ? (
                                <p className="text-slate-500 italic text-sm">
                                    Start typing to search products...
                                </p>
                            ) : loading ? (
                                <p className="text-slate-500 italic text-sm">
                                    Searching...
                                </p>
                            ) : visibleResults.length === 0 ? (
                                <p className="text-slate-500 italic text-sm">
                                    No products found for "{debouncedQuery}"
                                </p>
                            ) : (
                                <ul className="space-y-2">
                                    {visibleResults.map((product) => (
                                        <li
                                            key={product.id}
                                            className="flex items-start gap-3 p-3 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors"
                                        >
                                            <div className="flex-1">
                                                <div className="font-medium text-slate-800">
                                                    {product.title}
                                                </div>
                                                <div className="text-sm text-slate-500 line-clamp-1">
                                                    {product.description}
                                                </div>
                                                <div className="flex gap-4 mt-1 text-xs text-slate-400">
                                                    <span>${product.price}</span>
                                                    <span>⭐ {product.rating}</span>
                                                    <span>{product.category}</span>
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>
                </div>

                <p className="text-center text-xs text-slate-400 mt-4">
                    Powered by a custom debounce hook + DummyJSON API
                </p>
            </div>
        </div>
    );
}

export default DebounceSearch;