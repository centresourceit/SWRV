import { useState, useEffect } from "react";

export function usePagination<T>(items: T[]) {
  const [activePage, setActivePage] = useState(1);
  const [paginatedItems, setPaginatedItems] = useState<T[]>([]);
  const [itemPerPage, setItemPerPage] = useState<number>(10);
  const [itemLength, setItemLength] = useState<number>(0);

  useEffect(() => {
    setItemLength((val: number) => (items == undefined ? 0 : items.length));

    const startIndex = (activePage - 1) * itemPerPage;
    const endIndex = startIndex + itemPerPage;
    if (!(items == undefined || items == null)) {
      const itemsToShow = items.slice(startIndex, endIndex);
      setPaginatedItems(itemsToShow);
    }
  }, [activePage, items, itemPerPage]);

  const totalPages = Math.ceil(itemLength / itemPerPage);

  /**
   * Navigates to the specified page number.
   * @param {number} page - The page number to navigate to.
   * @returns None
   */
  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setActivePage(page);
    }
  };

  /**
   * Changes the active page to the specified value.
   * @param {number} val - The value of the new active page.
   * @returns None
   */
  const changeActivePage = (val: number) => {
    setActivePage(val);
  };

  /**
   * Moves to the next page if the current active page is not the last page.
   * @returns None
   */
  const nextPage = () => {
    if (activePage < totalPages) {
      setActivePage(activePage + 1);
    }
  };

  /**
   * Go to the previous page if the current active page is greater than 1.
   * @returns None
   */
  const prevPage = () => {
    if (activePage > 1) {
      setActivePage(activePage - 1);
    }
  };

  /**
   * Sets the active page to the first page.
   * @returns None
   */
  const firstPage = () => {
    setActivePage(1);
  };

  /**
   * Sets the active page to the last page in the pagination.
   * @returns None
   */
  const lastPage = () => {
    setActivePage(totalPages);
  };

  /**
   * Updates the number of items per page and sets the active page to 1.
   * @param {number} perPage - The new number of items per page.
   * @returns None
   */
  const ChangePerPage = (perpaage: number) => {
    setItemPerPage(perpaage);
    setActivePage((val) => 1);
  };

  /**
   * Calculates the maximum number of pages based on the total number of items and the number of items per page.
   * @returns The maximum number of pages.
   */
  const getMaxPage = (): number => {
    return Math.ceil(itemLength / itemPerPage);
  };

  const getTotalItemsLength = (): number => itemLength;

  /**
   * Returns an object containing various pagination-related functions and properties.
   * @param {Array} paginatedItems - The array of items to be paginated.
   * @param {number} activePage - The currently active page.
   * @param {function} changeActivePage - A function to change the active page.
   * @param {number} totalPages - The total number of pages.
   * @param {number} itemPerPage - The number of items per page.
   * @param {function} goToPage - A function to go to a specific page.
   * @param {function} nextPage - A function to go to the next page.
   * @param {function} prevPage - A function to go to the previous page.
   * @param
   */
  return {
    paginatedItems,
    activePage,
    changeActivePage,
    totalPages,
    itemPerPage,
    goToPage,
    nextPage,
    prevPage,
    firstPage,
    lastPage,
    ChangePerPage,
    getMaxPage,
    getTotalItemsLength,
  };
}
