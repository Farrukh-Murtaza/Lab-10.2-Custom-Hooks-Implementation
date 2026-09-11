import { Link } from "react-router-dom";

function HomePage() {

    return (
        <div className="flex flex-col justify-center items-center h-svh  ">
            <div className="space-y-6 border-border px-6 py-4 flex flex-col items-center gap-2 shadow-2xl rounded-xl ">
                <h2 className="font-semibold text-2xl ">Select Page</h2>
                <div className="flex justify-center gap-3 ">
                    <Link className="bg-blue-400 px-5 py-2 text-white rounded-lg" to={'/pagination'}>Pagination</Link>
                    <Link className="bg-blue-400 px-5 py-2 text-white rounded-lg" to={"/debounce-search"} >Debounce Search</Link>
                </div>
            </div>
        </div>
    )
}

export default HomePage;