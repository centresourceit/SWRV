import { Outlet } from "@remix-run/react";

/**
 * Help component that renders the content inside the Outlet component.
 * @returns JSX element representing the Help component.
 */
const Help = () => {
    return (
        <>
            <Outlet></Outlet>
        </>
    );
}

export default Help;