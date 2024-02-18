import { Link } from "@remix-run/react";

/**
 * Renders the footer component for the home page.
 * @returns {JSX.Element} - The rendered footer component.
 */
export const HomeFooter = () => {
    const year = new Date().getFullYear();

    /**
     * Renders a footer component with links to the homepage, terms of use, and privacy policy.
     * @param {number} year - The current year.
     * @returns {JSX.Element} - The rendered footer component.
     */
    return (
        <>
            <div className="w-full flex px-8 flex-col md:flex-row box-border">
                <Link to={"/"} className="text-sm text-gray-600 text-center px-4 font-normal">© {year} SWRV Licensing AB - All rights reserved.</Link>
                <div className="grow"></div>
                <div className="flex justify-center my-2 md:my-0">
                    <Link to={"/tos"} className="text-sm text-gray-600 text-center px-4 font-normal shrink-0">Terms of use</Link>
                    <Link to={"/pp"} className="text-sm text-gray-600 text-center px-4 font-normal shrink-0">Privacy policy</Link>
                </div>
            </div>
        </>
    );
};