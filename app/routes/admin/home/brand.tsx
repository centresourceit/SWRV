import { faEdit, faEye, faFill, faTrash, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { LoaderArgs, LoaderFunction, json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { BaseUrl } from "~/const";
import { ToastContainer, toast } from 'react-toastify';

import styles from 'react-toastify/dist/ReactToastify.css';
import Pagination from "~/components/pagination";
import { usePagination } from "~/hooks/usepagination";
import { Fa6SolidMagnifyingGlass, Fa6SolidXmark } from "~/components/icons";

export function links() {
    return [{ rel: "stylesheet", href: styles }];
}


/**
 * Loader function that retrieves the brand data from the server.
 * @param {LoaderArgs} props - The loader arguments.
 * @returns {Promise<LoaderResult>} A promise that resolves to the brand data.
 */
export const loader: LoaderFunction = async (props: LoaderArgs) => {
    const brand = await axios({
        method: 'post',
        url: `${BaseUrl}/api/get-brands`,
    });
    return json({ brand: brand.data.data[0] });
}



const Brand = () => {
    const brand = useLoaderData().brand;
    const [items, setItems] = useState<unknown[]>([]);

    const pagination = usePagination(items);

    const init = () => {
        setItems(brand);
    }

    useEffect(() => {
        init();
    }, []);


    const [viewBox, setViewBox] = useState<boolean>(false);
    const [viewDate, setViewData] = useState<any>({});


    const [delBox, setDelBox] = useState<boolean>(false);
    const [delDate, setDelData] = useState<any>({});



    /**
     * Retrieves the status of a specific ID by making a POST request to the specified URL.
     * @param {number} id - The ID of the item to retrieve the status for.
     * @returns None
     */
    const status = async (id: number) => {
        const view = await axios({
            method: 'post',
            url: `${BaseUrl}/api/search-brand`,
            data: { "id": id }
        });
        setDelBox((val) => true);
        setDelData((val: any) => view.data.data[0]);
    }

    /**
     * Updates the status of a button asynchronously.
     * @param {number} id - The ID of the button.
     * @param {number} status - The current status of the button.
     * @returns None
     */
    const statusButton = async (id: number, status: number) => {
        const res = await axios({
            method: 'post',
            url: `${BaseUrl}/api/status-brand`,
            data: { "id": id, "status": status == 1 ? 0 : 1 }
        });

        if (res.data.status) {
            toast.success("Successfully updated.", { theme: "dark", });
        } else {
            toast.error(res.data.message, { theme: "dark", });
        }
        setDelBox((val) => false);
        window.location.reload();
    }
    /**
     * Fetches the data for a specific view using the provided ID.
     * @param {number} id - The ID of the view to fetch.
     * @returns None
     */
    const view = async (id: number) => {
        const view = await axios({
            method: 'post',
            url: `${BaseUrl}/api/search-brand`,
            data: { "id": id }
        });
        setViewBox((val) => true);
        setViewData((val: any) => view.data.data[0]);
    }

    // search section start from here

    const searchRef = useRef<HTMLInputElement>(null);
    const [isSearch, setIsSearch] = useState<boolean>();
    const [isSearching, setIsSearching] = useState<boolean>(false);


    /**
     * Performs a search operation by sending a POST request to the specified API endpoint.
     * @returns None
     */
    const search = async () => {
        setIsSearching((val) => true);
        if (searchRef.current?.value == null || searchRef.current?.value == undefined || searchRef.current?.value == "") {
            setIsSearching((val) => false);
            return toast.error("Enter search keyword", { theme: "light" });
        }

        const data = await axios.post(`${BaseUrl}/api/search-brand`, { search: searchRef.current?.value });

        if (!data.data.status) {
            setIsSearching((val) => false);
            return toast.error(data.data.message, { theme: "light" });
        } else {
            setIsSearching((val) => true);
            setIsSearch((val) => true);
            setItems(data.data.data);
        }
        setIsSearching((val) => false);
    }

    /**
     * Clears the search by setting the value of isSearch to false and calling the init function.
     * @returns None
     */
    const clearsearch = () => {
        setIsSearch((val) => false);
        init();
    }


    // search section end here
    /**
     * Renders a component that displays a brand list with search and pagination functionality.
     * @returns JSX elements representing the brand list component.
     */
    return (
        <>
            {/* view box */}
            <div className={`fixed h-full w-full bg-slate-800 bg-opacity-40 top-0 left-0 place-items-center overflow-y-scroll py-20 ${viewBox ? "grid" : "hidden"}`}>
                <div className="bg-[#31353f] rounded-lg p-4 w-80">
                    <div className="w-full grid place-items-center mb-4">
                        <img src={viewDate.logo} alt="avatar" className="w-40 h-40 object-cover object-center rounded-md" />
                    </div>
                    <div className="mx-auto">
                        <div className="text-white">
                            <p>ID : {viewDate.id}</p>
                            <p>Name : {viewDate.name} </p>
                            <p>Code : {viewDate.code} </p>
                            <p>Email : {viewDate.email}</p>
                            <p>Contact : {viewDate.contat}</p>
                            <p>Info : {viewDate.info}</p>
                            <p>Website : {viewDate.webUrl}</p>
                        </div>
                        <div className="w-full h-[1px] bg-gray-300 my-2"></div>
                        <div className="grid place-items-center">
                            <div onClick={() => setViewBox(false)} className={`text-sm flex gap-2 items-center my-1 b  py-1 px-2 rounded-md hover:border hover:border-rose-400 hover:bg-rose-500 hover:bg-opacity-10 hover:text-rose-500 text-gray-300 cursor-pointer`}>
                                <FontAwesomeIcon icon={faXmark} className="w-6"></FontAwesomeIcon>
                                <p>CLOSE</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* del box */}
            <div className={`fixed h-full w-full bg-slate-800 bg-opacity-40 top-0 left-0 place-items-center ${delBox ? "grid" : "hidden"}`}>
                <div className="bg-[#31353f] rounded-lg p-4 w-80">
                    <div className="mx-auto">
                        <div className="text-white">
                            <p>Are you sure you want to change the status of {delDate.name ?? ""} brand?</p>
                        </div>
                        <div className="w-full h-[1px] bg-gray-300 my-2"></div>
                        <div className="flex w-full justify-between">
                            <div onClick={() => setDelBox(false)} className={`text-sm flex gap-2 items-center my-1 b  py-1 px-2 rounded-md border border-gray-300 hover:border hover:border-rose-400 hover:bg-rose-500 hover:bg-opacity-10 hover:text-rose-500 text-gray-300 cursor-pointer`}>
                                <FontAwesomeIcon icon={faXmark} className="w-6"></FontAwesomeIcon>
                                <p>CLOSE</p>
                            </div>
                            <div onClick={() => statusButton(delDate.brandId, delDate.status.code)} className={`text-sm flex gap-2 items-center my-1 b  py-1 px-2 rounded-md border border-gray-300hover:border hover:border-green-400 hover:bg-green-500 hover:bg-opacity-10 hover:text-green-500 text-gray-300 cursor-pointer`}>
                                <FontAwesomeIcon icon={faEdit} className="w-6"></FontAwesomeIcon>
                                <p>CHANGE</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="grow bg-[#1b2028] my-2 rounded-md p-4 w-full">
                <div className="flex items-center gap-2">
                    <h1 className="text-white font-medium text-xl">Brand</h1>
                    <div className="grow"></div>
                    {
                        isSearch ?
                            <>
                                <div
                                    className="grid place-items-center rounded-md bg-indigo-500 shadow-md h-full p-2 text-white">
                                    Found : {items.length} result
                                </div>
                                <button
                                    onClick={clearsearch}
                                    className="rounded-md bg-rose-500 shadow-md h-full p-2 text-white flex gap-2 items-center">
                                    <Fa6SolidXmark></Fa6SolidXmark> Clear
                                </button>
                            </>
                            :
                            isSearching ?
                                <div
                                    className="r rounded-md bg-indigo-500 shadow-md h-full p-2 text-white flex gap-2 items-center">
                                    <Fa6SolidMagnifyingGlass></Fa6SolidMagnifyingGlass> Searching for text {searchRef.current?.value}
                                </div> :
                                <>
                                    <div className="grid place-items-center">
                                        <input ref={searchRef} type="text" className="bg-[#eeeeee] rounded-md outline-none focus:outline-none py-1 px-4" placeholder="Enter Search Text.." />
                                    </div>
                                    <button
                                        onClick={search}
                                        className="grid place-items-center rounded-md bg-indigo-500 shadow-md h-full p-2 text-white">
                                        <Fa6SolidMagnifyingGlass></Fa6SolidMagnifyingGlass>
                                    </button>
                                </>
                    }
                </div>
                <div className="w-full bg-slate-400 h-[1px] my-2"></div>
                <div className="overflow-x-hidden no-scrollbar">
                    <div className="bg-[#31353f]  rounded-md flex px-4 py-2 my-2 text-white font-medium text-md flex-nowrap">
                        <div className="w-14">Id</div>
                        <div className="w-10"></div>
                        <div className="w-44">Name</div>
                        <div className="grow"></div>
                        <div className="w-24">Status</div>
                        <div className="grow"></div>
                        <div className="w-32">Action</div>
                    </div>
                    {
                        isSearch ?
                            pagination.paginatedItems.map((val: any, index: number) => {
                                return (
                                    <div key={index} className="bg-[#31353f] hover:bg-slate-800 rounded-md flex px-4 py-2 my-2 text-white font-medium text-md flex-nowrap">
                                        <div className="w-14">{val.id}</div>
                                        <div className="w-10"></div>
                                        <div className="w-44">{val.name}</div>
                                        <div className="grow"></div>
                                        <div className="w-24">
                                            {Number(val.brandStatus) ?
                                                <div className="w-16 py-1 text-white text-xs bg-green-500 text-center rounded-md font-medium cursor-pointer" onClick={() => status(val.id)}>ACTIVE</div>
                                                :
                                                <div className="w-16 py-1 text-white text-xs bg-rose-500 text-center rounded-md font-medium cursor-pointer" onClick={() => status(val.id)}>INACTIVE</div>}
                                        </div>
                                        <div className="grow"></div>
                                        <div className="w-32 flex text-bold text-md gap-4">
                                            <div className="text-emerald-500 cursor-pointer">
                                                <FontAwesomeIcon icon={faEye} onClick={() => view(val.id)}></FontAwesomeIcon>
                                            </div>
                                            <Link to={`/admin/home/editbrand/${val.id}`} className="w-16 py-1 text-white text-xs bg-cyan-500 text-center rounded-md font-medium">Edit</Link>
                                        </div>
                                    </div>
                                );
                            })
                            :
                            pagination.paginatedItems.map((val: any, index: number) => {
                                return (
                                    <div key={index} className="bg-[#31353f] hover:bg-slate-800 rounded-md flex px-4 py-2 my-2 text-white font-medium text-md flex-nowrap">
                                        <div className="w-14">{val.id}</div>
                                        <div className="w-10"></div>
                                        <div className="w-44">{val.brandName}</div>
                                        <div className="grow"></div>
                                        <div className="w-24">
                                            {Number(val.brandStatus) ?
                                                <div className="w-16 py-1 text-white text-xs bg-green-500 text-center rounded-md font-medium cursor-pointer" onClick={() => status(val.id)}>ACTIVE</div>
                                                :
                                                <div className="w-16 py-1 text-white text-xs bg-rose-500 text-center rounded-md font-medium cursor-pointer" onClick={() => status(val.id)}>INACTIVE</div>}
                                        </div>
                                        <div className="grow"></div>
                                        <div className="w-32 flex text-bold text-md gap-4">
                                            <div className="text-emerald-500 cursor-pointer">
                                                <FontAwesomeIcon icon={faEye} onClick={() => view(val.id)}></FontAwesomeIcon>
                                            </div>
                                            <Link to={`/admin/home/editbrand/${val.id}`} className="w-16 py-1 text-white text-xs bg-cyan-500 text-center rounded-md font-medium">Edit</Link>
                                        </div>
                                    </div>
                                );
                            })
                    }
                </div>
                <Pagination
                    ChangePerPage={pagination.ChangePerPage}
                    activePage={pagination.activePage}
                    changeActivePage={pagination.changeActivePage}
                    firstPage={pagination.firstPage}
                    getMaxPage={pagination.getMaxPage}
                    getTotalItemsLength={pagination.getTotalItemsLength}
                    goToPage={pagination.goToPage}
                    itemPerPage={pagination.itemPerPage}
                    lastPage={pagination.lastPage}
                    nextPage={pagination.nextPage}
                    paginatedItems={pagination.paginatedItems}
                    prevPage={pagination.prevPage}
                    totalPages={pagination.totalPages}
                ></Pagination>
                <ToastContainer></ToastContainer>
            </div>
        </>
    );
}

export default Brand;