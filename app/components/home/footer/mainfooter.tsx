import { Link } from "@remix-run/react";

/**
 * Renders the main footer component.
 * @returns {JSX.Element} - The JSX element representing the main footer.
 */
export const MainFooter = () => {
    /**
     * Renders a navigation bar with links to various pages.
     * @returns {JSX.Element} - The rendered navigation bar.
     */
    return (
        <>
            <div className="w-full flex py-6 px-8">
                <div className="flex flex-col sm:flex-row justify-center content-center items-center w-full">
                    <div>
                        <Link to={"/about"} className="text-sm text-gray-600 text-center px-4 font-normal">About</Link>
                    </div>
                    <div>
                        <Link to={"/tos"} className="text-sm text-gray-600 text-center px-4 font-normal">Terms of use</Link>
                    </div>
                    <div>
                        <Link to={"/pp"} className="text-sm text-gray-600 text-center px-4 font-normal">Privacy policy</Link>
                    </div>
                    <div>
                        <Link to={"/"} className="text-sm text-gray-600 text-center px-4 font-normal">Cookie policy</Link>
                    </div>
                    <div>
                        <Link to={"/"} className="text-sm text-gray-600 text-center px-4 font-normal">FAQ</Link>
                    </div>
                </div>
            </div>
        </>
    );
};