


function PaginationPage() {

    return <div className="m-auto max-w-4xl my-5 border border-borbder rounded-sm p-5 ">
        <h3 className="text-center mb-5" >
            Pagination Demo
        </h3>

        <div className="mb-4 flex justify-between items-center" >
            <div>
                <label htmlFor="itemsPerPageSelect">
                    Items per page:
                </label>
                <select id="itemsPerPageSelect">
                    <option value="5">5</option>
                    <option value="10" selected>10</option>
                    <option value="15">15</option>
                    <option value="20">20</option>
                </select>
            </div>
            <div className="italic" >Total Items: 123</div>
        </div>
        <ul className="list-decimal pl-5 min-h-48" >
            <li className="pt-0.5">Item 1</li>
            <li className="pt-0.5">Item 2</li>
            <li className="pt-0.5">Item 3</li>
            <li className="pt-0.5">Item 4</li>
            <li className="pt-0.5">Item 5</li>
            <li className="pt-0.5">Item 6</li>
            <li className="pt-0.5">Item 7</li>
            <li className="pt-0.5">Item 8</li>

            <li className="pt-0.5">Item 9</li>
            <li className="pt-0.5">Item 10</li>
        </ul>
        <div className="mt-5 flex justify-between items-center" >
            <button disabled className="py-2 px-3" >
                Previous
            </button>
            <span>Page
                <input
                    type="number"
                    min="1"
                    max="13"
                    className="w-15 text-center mx-1.25"
                    value="1" />
            </span>
            <button className="px-3 py-2" >Next</button>
        </div>
        <div className="mt-3 text-center">
            Showing items 1 - 10 (Total on this page: 10)
        </div>
        <div className="mt-2.5 text-center flex flex-wrap justify-center gap-1.25">
            <button disabled className="py-1.25 px-2 font-normal bg-[#efefef] text-black border  border-[#ccc] rounded-b-sm">1</button>
            <button className="py-1.25 px-2 font-normal bg-[#efefef] text-black border  border-[#ccc] rounded-b-sm">2</button>
            <button className="py-1.25 px-2 font-normal bg-[#efefef] text-black border  border-[#ccc] rounded-b-sm">3</button>
            <button className="py-1.25 px-2 font-normal bg-[#efefef] text-black border  border-[#ccc] rounded-b-sm">4</button>
            <button className="py-1.25 px-2 font-normal bg-[#efefef] text-black border  border-[#ccc] rounded-b-sm">5</button>
            <button className="py-1.25 px-2 font-normal bg-[#efefef] text-black border  border-[#ccc] rounded-b-sm">6</button>
            <button className="py-1.25 px-2 font-normal bg-[#efefef] text-black border  border-[#ccc] rounded-b-sm">7</button>
            <button className="py-1.25 px-2 font-normal bg-[#efefef] text-black border  border-[#ccc] rounded-b-sm">8</button>
            <button className="py-1.25 px-2 font-normal bg-[#efefef] text-black border  border-[#ccc] rounded-b-sm">9</button>
            <button className="py-1.25 px-2 font-normal bg-[#efefef] text-black border  border-[#ccc] rounded-b-sm">10</button>
            <button className="py-1.25 px-2 font-normal bg-[#efefef] text-black border  border-[#ccc] rounded-b-sm">11</button>
            <button className="py-1.25 px-2 font-normal bg-[#efefef] text-black border  border-[#ccc] rounded-b-sm">12</button>
            <button className="py-1.25 px-2 font-normal bg-[#efefef] text-black border  border-[#ccc] rounded-b-sm">13</button></div>
    </div >
}


export default PaginationPage;