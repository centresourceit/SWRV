
import { Outlet } from "@remix-run/react";



/**
 * Creates a campaign component.
 * @returns {JSX.Element} - The campaign component.
 */
const createCampaing = () => {
    return (
        <>
            <Outlet></Outlet>
        </>
    );
}

export default createCampaing;