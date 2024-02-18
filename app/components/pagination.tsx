import { useState, KeyboardEvent, useEffect } from "react";
import { CarbonChevronDown, CharmChevronLeft, CharmChevronRight, MaterialSymbolsKeyboardDoubleArrowLeft, MaterialSymbolsKeyboardDoubleArrowRight } from "./icons";

/**
 * Interface representing the props for a pagination component.
 * @interface PaginationProps
 * @property {any[]} paginatedItems - The array of items to be displayed on the current page.
 * @property {number} activePage - The current active page number.
 * @property {(val: number) => void} changeActivePage - Function to change the active page.
 * @property {number} totalPages - The total number of pages.
 * @property {number} itemPerPage - The number of items to display per page.
 * @property {(val: number) => void} goToPage - Function to go to a specific page.
 * @property {() => void} nextPage - Function to go to the next page.
 * @
 */
interface PaginationProps {
    paginatedItems: any[];
    activePage: number;
    changeActivePage: (val: number) => void;
    totalPages: number;
    itemPerPage: number;
    goToPage: (val: number) => void;
    nextPage: () => void;
    prevPage: () => void;
    firstPage: () => void;
    lastPage: () => void;
    ChangePerPage: (val: number) => void;
    getMaxPage: () => number;
    getTotalItemsLength: () => number;
}

const Pagination: React.FC<PaginationProps> = (props: PaginationProps): JSX.Element => {
    const [isSelectPage, setSelectPage] = useState<boolean>(false);

    const handelPageChange = () => {
        setSelectPage((val) => !val);
    }

    /**
     * Handles the "Enter" key press event on an input element and navigates to the specified page.
     * @param {KeyboardEvent<HTMLInputElement>} event - The keyboard event object.
     * @returns None
     */
    const handelGoTo = (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            const page: number = parseInt((event.target as HTMLInputElement).value.replace(/\D/g, ''));
            if (page <= props.getMaxPage()) {
                props.changeActivePage(page);
            }
        }
    }

    /**
     * Renders a set of page buttons based on the current active page and the maximum number of pages.
     * @returns An array of React button components representing the page buttons.
     */
    const renderPageButtons = () => {
        const buttons = [];
        const maxButtonsToShow = 2;

        for (let i = Math.max(1, props.activePage - maxButtonsToShow); i <= Math.min(props.getMaxPage(), props.activePage + maxButtonsToShow); i++) {
            buttons.push(
                <button
                    key={i}
                    onClick={() => props.changeActivePage(i)}
                    className={`text-white rounded-md border-2 hover:border-blue-500 hover:text-blue-500 text-lg text-center w-8 h-8 grid place-items-center ${props.activePage === i ? 'bg-blue-500 bg-opacity-25 text-blue-500 border-blue-500' : 'border-gray-200'
                        }`}
                >
                    {i}
                </button>
            );
        }

        if (props.activePage - maxButtonsToShow > 1) {
            buttons.unshift(
                <button
                    key="left-ellipsis"
                    disabled
                    className="rounded-md text-lg text-center w-8 h-8 grid place-items-center cursor-not-allowed text-white"
                >
                    ...
                </button>
            );
        }

        if (props.activePage + maxButtonsToShow < props.getMaxPage()) {
            buttons.push(
                <button
                    key="right-ellipsis"
                    disabled
                    className="rounded-md text-lg text-center w-8 h-8 grid place-items-center cursor-not-allowed text-white"
                >
                    ...
                </button>
            );
        }
        return buttons;
    };



    /**
     * Renders a pagination component with page navigation buttons and options.
     * @returns {JSX.Element} - The rendered pagination component.
     */
    return (
        <>
            <div className="flex items-center gap-2 w-full mt-4 flex-wrap justify-between gap-y-4">
                <div className="flex gap-2 items-center">
                    <p className="text-sm text-white font-normal text-left">Page {props.activePage}/{props.getMaxPage()}</p>
                    <div className="h-5 w-[1px] bg-gray-200"></div>
                    <p className="text-sm text-white font-normal text-left">Total {props.getTotalItemsLength()} item</p>
                </div>

                <div className="flex gap-1 items-center">
                    <button onClick={props.firstPage} className="text-white rounded-md border-2 border-gray-200 hover:border-blue-500 hover:text-blue-500 text-lg text-center w-8 h-8 grid place-items-center">
                        <MaterialSymbolsKeyboardDoubleArrowLeft></MaterialSymbolsKeyboardDoubleArrowLeft>
                    </button>
                    <button onClick={props.prevPage} className="text-white rounded-md border-2 border-gray-200 hover:border-blue-500 hover:text-blue-500 text-lg text-center w-8 h-8 grid place-items-center">
                        <CharmChevronLeft></CharmChevronLeft>
                    </button>
                    {renderPageButtons()}
                    <button onClick={props.nextPage} className="text-white rounded-md border-2 border-gray-200 hover:border-blue-500 hover:text-blue-500 text-lg text-center w-8 h-8 grid place-items-center">
                        <CharmChevronRight></CharmChevronRight>
                    </button>
                    <button onClick={props.lastPage} className="text-white rounded-md border-2 border-gray-200 hover:border-blue-500 hover:text-blue-500 text-lg text-center w-8 h-8 grid place-items-center">
                        <MaterialSymbolsKeyboardDoubleArrowRight></MaterialSymbolsKeyboardDoubleArrowRight>
                    </button>
                </div>
                <div className="flex gap-2 items-center">

                    <div className="relative">
                        <div
                            onClick={handelPageChange}
                            className="py-1 px-2 text-sm text-white font-normal text-center rounded-md border-2 border-gray-200 hover hover:border-blue-500 flex gap-1 items-center w-32 cursor-pointer">
                            <p>{props.itemPerPage} / Page</p>
                            <div className="grow"></div>
                            <CarbonChevronDown></CarbonChevronDown>
                        </div>
                        <div
                            className={`absolute bottom-0 -translate-y-10 bg-[#1b2028]  left-0 rounded-md shadow-sm w-32 overflow-y-hidden transition-all duration-500 ${isSelectPage ? "block" : "hidden"}`}>
                            {[5, 10, 25, 50, 100].map((val: number, index: number) => (
                                <p key={index} onClick={() => { handelPageChange(); props.ChangePerPage(val); }} className="rounded-md hover:bg-blue-500 text-white hover:bg-opacity-25 cursor-pointer px-2 mx-2 my-1">{val} / Page</p>
                            ))}
                        </div>
                    </div>
                    <div className="h-5 w-[1px] bg-gray-500"></div>
                    <div className="flex gap-2 items-center">
                        <p className="text-sm text-white font-normal text-left">go to</p>
                        <input
                            onKeyDown={handelGoTo}
                            type="text"
                            pattern="[0-9]*"
                            onChange={event => {
                                event.target.value = event.target.value.replace(/\D/g, '');
                            }}
                            className="text-white bg-transparent border-2 border-gray-400 focus:border-blue-500 px-2 py-1 rounded-md w-14 outline-none" />
                        <p className="text-sm text-white font-normal text-left">page</p>
                    </div>
                </div>
            </div>
        </>
    )
}
export default Pagination;