import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";


function DebounceSearch() {

    const navigate = useNavigate();

    return <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center p-4">
        <div className="w-full max-w-3xl">
            <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-200/60 overflow-hidden">

                <div className="flex gap-5 items-center pl-4 pr-6 py-5 border-b border-slate-100 bg-linear-to-r from-slate-50 to-white">
                    <button
                        onClick={() => navigate('/')}
                        className="p-2 w-11 h-11 shadow-2xl flex justify-center items-center border-border border hover:bg-muted transition-colors bg-white rounded-full "
                    >
                        <ArrowLeft size={20} className="text-muted-white" />
                    </button>

                    <div className="flex items-center justify-between flex-wrap gap-3">
                        <div>
                            <h3 className="text-2xl font-bold text-slate-900 tracking-tight">
                                Debounce Search
                            </h3>
                            <p className="text-sm text-slate-500 mt-0.5">
                                Search through your items with ease
                            </p>
                        </div>

                    </div>
                </div>

                {/* Items list */}
                <div className="p-6">
                    <ul className="space-y-1">

                    </ul>
                </div>

            </div>

            <p className="text-center text-xs text-slate-400 mt-4">
                Powered by a custom pagination hook
            </p>
        </div>
    </div>
}


export default DebounceSearch;