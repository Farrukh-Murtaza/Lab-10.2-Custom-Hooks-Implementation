import { Link } from "react-router-dom";
import { Hash, Search } from "lucide-react";

function HomePage() {
    return (
        <div className="flex flex-col justify-center items-center min-h-svh bg-linear-to-br from-slate-50 via-white to-slate-100 p-4">
            <div className="space-y-6 border border-slate-200 px-8 py-6 flex flex-col items-center gap-2 shadow-xl shadow-slate-200/50 rounded-2xl bg-white">
                <h2 className="font-semibold text-2xl text-slate-900">
                    Select Page
                </h2>

                <div className="flex flex-wrap justify-center gap-3">
                    <Link
                        to="/pagination"
                        className="
                            flex items-center gap-2
                            bg-blue-500 hover:bg-blue-600 active:scale-95
                            px-5 py-2.5
                            text-white font-medium
                            rounded-lg shadow-md shadow-blue-500/25
                            transition-all duration-200
                        "
                    >
                        <Hash size={18} />
                        Pagination
                    </Link>

                    <Link
                        to="/debounce-search"
                        className="
                            flex items-center gap-2
                            bg-blue-500 hover:bg-blue-600 active:scale-95
                            px-5 py-2.5
                            text-white font-medium
                            rounded-lg shadow-md shadow-blue-500/25
                            transition-all duration-200
                        "
                    >
                        <Search size={18} />
                        Debounce Search
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default HomePage;