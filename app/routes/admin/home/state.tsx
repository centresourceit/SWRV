import { faEdit, faEye, faFill, faTrash, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { LoaderArgs, LoaderFunction, json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { BaseUrl } from "~/const";
import { ToastContainer, toast } from 'react-toastify';

import styles from 'react-toastify/dist/ReactToastify.css';
import { NOTICEAlerts } from "~/components/utils/alert";
import Pagination from "~/components/pagination";
import { usePagination } from "~/hooks/usepagination";

export function links() {
    return [{ rel: "stylesheet", href: styles }];
}




/**
 * Loader function that retrieves the state data from the server using an HTTP POST request.
 * @param {LoaderArgs} props - The loader arguments.
 * @returns {Promise<LoaderResult>} A promise that resolves to the state data.
 */
export const loader: LoaderFunction = async (props: LoaderArgs) => {
    const state = await axios({
        method: 'post',
        url: `${BaseUrl}/api/get-state`,
    });
    return json({ state: state.data.data });
}



const State = () => {
    const state = useLoaderData().state;
    const pagination = usePagination(state);


    const [viewBox, setViewBox] = useState<boolean>(false);
    const [viewDate, setViewData] = useState<any>({});

    const [editBox, setEditBox] = useState<boolean>(false);
    const nameRef = useRef<HTMLInputElement>(null);
    const codeRef = useRef<HTMLInputElement>(null);


    const [editDate, setEditData] = useState<any>({
        categoryName: nameRef.current?.value || '',
        categoryCode: codeRef.current?.value || '',
    });

    const [error, setError] = useState<string>("");


    /**
     * Edit a category with the given ID.
     * @param {number} id - The ID of the category to edit.
     * @returns None
     */
    const edit = async (id: number) => {
        const view = await axios({
            method: 'post',
            url: `${BaseUrl}/api/get-category-byid`,
            data: { "id": id }
        });
        setEditBox((val) => true);
        setEditData((val: any) => view.data.data[0]);
    }

    /**
     * Deletes a category with the specified ID.
     * @param {number} id - The ID of the category to delete.
     * @returns None
     */
    const [delBox, setDelBox] = useState<boolean>(false);
    const [delDate, setDelData] = useState<any>({});
    const del = async (id: number) => {
        const view = await axios({
            method: 'post',
            url: `${BaseUrl}/api/get-category-byid`,
            data: { "id": id }
        });
        setDelBox((val) => true);
        setDelData((val: any) => view.data.data[0]);
    }

    /**
     * Deletes a category with the given ID from the server.
     * @param {number} id - The ID of the category to delete.
     * @returns None
     */
    const delButton = async (id: number) => {
        const res = await axios({
            method: 'post',
            url: `${BaseUrl}/api/del-category`,
            data: { "id": id }
        });
        if (res.data.status) {
            toast.success("Successfully Deleted.", { theme: "dark", });
        } else {
            toast.error(res.data.message, { theme: "dark", });
        }
        setDelBox((val) => false);
        window.location.reload();
    }
    /**
     * Fetches the data of a specific category by its ID and updates the state variables
     * `viewBox` and `viewData`.
     * @param {number} id - The ID of the category to view.
     * @returns None
     */
    const view = async (id: number) => {
        const view = await axios({
            method: 'post',
            url: `${BaseUrl}/api/get-category-byid`,
            data: { "id": id }
        });
        setViewBox((val) => true);
        setViewData((val: any) => view.data.data[0]);
    }


    /**
     * Submits a form with the given ID to update a category.
     * @param {number} id - The ID of the category to update.
     * @returns None
     */
    const submit = async (id: number) => {
        if (nameRef.current?.value == null || nameRef.current?.value == undefined || nameRef.current?.value == "") {
            setError("Enter the name.");
        } else if (codeRef.current?.value == null || codeRef.current?.value == undefined || codeRef.current?.value == "") {
            setError("Enter the code.");
        } else {
            const res = await axios({
                method: 'post',
                url: `${BaseUrl}/api/upd-category`,
                data: { "categoryName": nameRef.current?.value, "categoryCode": codeRef.current?.value, "id": id }
            });
            if (res.data.status) {
                toast.success("Successfully updated.", { theme: "dark", });
            } else {
                toast.error(res.data.message, { theme: "dark", });
            }
            setEditBox((val) => false);
            window.location.reload();
        }
    }

    const [newBox, setNewBox] = useState<boolean>(false);
    const nameNewRef = useRef<HTMLInputElement>(null);
    const codeNewRef = useRef<HTMLInputElement>(null);

    /**
     * Submits a new category by sending a POST request to the server with the name and code of the category.
     * If the name or code is not provided, an error message is displayed.
     * If the request is successful, a success message is displayed.
     * If the request fails, an error message is displayed.
     * After submitting, the page is reloaded.
     * @returns None
     */
    const submitNew = async () => {
        if (nameNewRef.current?.value == null || nameNewRef.current?.value == undefined || nameNewRef.current?.value == "") {
            setError("Enter the name.");
        } else if (codeNewRef.current?.value == null || codeNewRef.current?.value == undefined || codeNewRef.current?.value == "") {
            setError("Enter the code.");
        } else {
            const res = await axios({
                method: 'post',
                url: `${BaseUrl}/api/add-category`,
                data: { "categoryName": nameNewRef.current?.value, "categoryCode": codeNewRef.current?.value }
            });
            if (res.data.status) {
                toast.success("Successfully added.", { theme: "dark", });
            } else {
                toast.error(res.data.message, { theme: "dark", });
            }
            setNewBox((val) => false);
            window.location.reload();
        }
    }



    /**
     * Renders a component that displays a modal with information about a selected item, a confirmation modal for deleting an item, an edit modal for editing an item, and a modal for creating a new item. It also renders a list of items with pagination.
     * @returns JSX elements
     */
    return (
        <>
            {/* view box */}
            <div className={`fixed h-full w-full bg-slate-800 bg-opacity-40 top-0 left-0 place-items-center ${viewBox ? "grid" : "hidden"}`}>
                <div className="bg-[#31353f] rounded-lg p-4">
                    <div className="mx-auto">
                        <div className="text-white">
                            <p>ID : {viewDate.id}</p>
                            <p>Name : {viewDate.categoryName} </p>
                            <p>Code : {viewDate.categoryCode}</p>
                        </div>
                        <div className="w-full h-[1px] bg-gray-300 my-2"></div>
                        <div onClick={() => setViewBox(false)} className={`text-sm flex gap-2 items-center my-1 b  py-1 px-2 rounded-md hover:border hover:border-rose-400 hover:bg-rose-500 hover:bg-opacity-10 hover:text-rose-500 text-gray-300 cursor-pointer`}>
                            <FontAwesomeIcon icon={faXmark} className="w-6"></FontAwesomeIcon>
                            <p>CLOSE</p>
                        </div>
                    </div>
                </div>
            </div>
            {/* del box */}
            <div className={`fixed h-full w-full bg-slate-800 bg-opacity-40 top-0 left-0 place-items-center ${delBox ? "grid" : "hidden"}`}>
                <div className="bg-[#31353f] rounded-lg p-4">
                    <div className="mx-auto">
                        <div className="text-white">
                            <p>Are you Sure you want to delete {delDate.name}?</p>
                        </div>
                        <div className="w-full h-[1px] bg-gray-300 my-2"></div>
                        <div className="flex w-full justify-between">
                            <div onClick={() => setDelBox(false)} className={`text-sm flex gap-2 items-center my-1 b  py-1 px-2 rounded-md border border-gray-300 hover:border hover:border-rose-400 hover:bg-rose-500 hover:bg-opacity-10 hover:text-rose-500 text-gray-300 cursor-pointer`}>
                                <FontAwesomeIcon icon={faXmark} className="w-6"></FontAwesomeIcon>
                                <p>CLOSE</p>
                            </div>
                            <div onClick={() => delButton(delDate.id)} className={`text-sm flex gap-2 items-center my-1 b  py-1 px-2 rounded-md border border-gray-300hover:border hover:border-green-400 hover:bg-green-500 hover:bg-opacity-10 hover:text-green-500 text-gray-300 cursor-pointer`}>
                                <FontAwesomeIcon icon={faTrash} className="w-6"></FontAwesomeIcon>
                                <p>Delete</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* edit box */}
            <div className={`fixed h-full w-full bg-slate-800 bg-opacity-40 top-0 left-0 place-items-center ${editBox ? "grid" : "hidden"}`}>
                <div className="bg-[#31353f] rounded-lg p-4 w-80">
                    <div className="mx-auto">
                        <div className="text-white">
                            <input ref={nameRef} type={"text"} name="name" className="py-1 px-2 rounded-md border border-white w-full my-2 bg-transparent outline-none focus:bg-transparent fill-none" placeholder="Enter the name.." autoComplete="off" value={editDate.categoryName} onChange={(e) => setEditData((data: any) => ({ ...data, categoryName: e.target.value }))} />
                            <input ref={codeRef} type={"text"} name="code" className="py-1 px-2 rounded-md border border-white w-full my-2 bg-transparent outline-none focus:bg-transparent fill-none" placeholder="Enter the code.." autoComplete="off" value={editDate.categoryCode} onChange={(e) => setEditData((data: any) => ({ ...data, categoryCode: e.target.value }))} />
                        </div>
                        {(error == "" || error == null || error == undefined) ? null :
                            <NOTICEAlerts message={error}></NOTICEAlerts>
                        }
                        <div className="w-full h-[1px] bg-gray-300 my-2"></div>
                        <div className="flex w-full justify-between">
                            <div onClick={() => setEditBox(false)} className={`text-sm flex gap-2 items-center my-1 b  py-1 px-2 rounded-md border border-gray-300 hover:border hover:border-rose-400 hover:bg-rose-500 hover:bg-opacity-10 hover:text-rose-500 text-gray-300 cursor-pointer`}>
                                <FontAwesomeIcon icon={faXmark} className="w-6"></FontAwesomeIcon>
                                <p>CLOSE</p>
                            </div>
                            <div onClick={() => submit(editDate.id)} className={`text-sm flex gap-2 items-center my-1 b  py-1 px-2 rounded-md border border-gray-300hover:border hover:border-green-400 hover:bg-green-500 hover:bg-opacity-10 hover:text-green-500 text-gray-300 cursor-pointer`}>
                                <FontAwesomeIcon icon={faFill} className="w-6"></FontAwesomeIcon>
                                <p>SUBMIT</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* add box */}
            <div className={`fixed h-full w-full bg-slate-800 bg-opacity-40 top-0 left-0 place-items-center ${newBox ? "grid" : "hidden"}`}>
                <div className="bg-[#31353f] rounded-lg p-4 w-80">
                    <div className="mx-auto">
                        <div className="text-white">
                            <input ref={nameNewRef} type={"text"} name="name" className="py-1 px-2 rounded-md border border-white w-full my-2 bg-transparent outline-none focus:bg-transparent fill-none" placeholder="Enter the name.." autoComplete="off" />
                            <input ref={codeNewRef} type={"text"} name="code" className="py-1 px-2 rounded-md border border-white w-full my-2 bg-transparent outline-none focus:bg-transparent fill-none" placeholder="Enter the code.." autoComplete="off" />
                        </div>
                        {(error == "" || error == null || error == undefined) ? null :
                            <NOTICEAlerts message={error}></NOTICEAlerts>
                        }
                        <div className="w-full h-[1px] bg-gray-300 my-2"></div>
                        <div className="flex w-full justify-between">
                            <div onClick={() => setNewBox(false)} className={`text-sm flex gap-2 items-center my-1 b  py-1 px-2 rounded-md border border-gray-300 hover:border hover:border-rose-400 hover:bg-rose-500 hover:bg-opacity-10 hover:text-rose-500 text-gray-300 cursor-pointer`}>
                                <FontAwesomeIcon icon={faXmark} className="w-6"></FontAwesomeIcon>
                                <p>CLOSE</p>
                            </div>
                            <div onClick={submitNew} className={`text-sm flex gap-2 items-center my-1 b  py-1 px-2 rounded-md border border-gray-300hover:border hover:border-green-400 hover:bg-green-500 hover:bg-opacity-10 hover:text-green-500 text-gray-300 cursor-pointer`}>
                                <FontAwesomeIcon icon={faFill} className="w-6"></FontAwesomeIcon>
                                <p>SUBMIT</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="grow bg-[#1b2028] my-2 rounded-md p-4 w-full">
                <div className="flex">
                    <h1 className="text-white font-medium text-xl">State</h1>
                    <div className="grow"></div>
                    {/* <button onClick={() => setNewBox(true)} className="bg-green-600 py-1 px-2 text-sm text-white rounded-md">ADD NEW</button> */}
                </div>
                <div className="w-full bg-slate-400 h-[1px] my-2"></div>
                <div className="overflow-x-hidden no-scrollbar">
                    <div className="bg-[#31353f]  rounded-md flex px-4 py-2 my-2 text-white font-medium text-md flex-nowrap">
                        <div className="w-14">Id</div>
                        <div className="w-10"></div>
                        <div className="w-44">State Name</div>
                        <div className="grow"></div>
                        <div className="w-60">Country</div>
                    </div>
                    {
                        pagination.paginatedItems.map((val: any, index: number) => {
                            return (
                                <div key={index} className="bg-[#31353f] hover:bg-slate-800 rounded-md flex px-4 py-2 my-2 text-white font-medium text-md flex-nowrap">
                                    <div className="w-14">{val.id}</div>
                                    <div className="w-10"></div>
                                    <div className="w-44">{val.name}</div>
                                    <div className="grow"></div>
                                    <div className="w-60">{val.country.name}</div>
                                    {/* <div className="grow"></div>
                                    <div className="w-32 flex text-bold text-md gap-4">
                                        <div className="text-cyan-500 cursor-pointer" onClick={() => edit(val.id)}>
                                            <FontAwesomeIcon icon={faEdit}></FontAwesomeIcon>
                                        </div>
                                        <div className="text-emerald-500 cursor-pointer">
                                            <FontAwesomeIcon icon={faEye} onClick={() => view(val.id)}></FontAwesomeIcon>
                                        </div>
                                        <div className="text-rose-500 cursor-pointer">
                                            <FontAwesomeIcon icon={faTrash} onClick={() => del(val.id)}></FontAwesomeIcon>
                                        </div>
                                    </div> */}
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

export default State;