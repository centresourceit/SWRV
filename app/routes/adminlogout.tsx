import { LoaderArgs, redirect } from "@remix-run/node";
import { adminUser, userPrefs } from "~/cookies";

/**
 * A loader function that redirects the user to the admin login page and sets a cookie.
 * @param {LoaderArgs} request - The request object containing information about the request.
 * @returns A redirect response to the admin login page with a cookie set.
 */
export async function loader({ request }: LoaderArgs) {
    return redirect("/adminlogin", {
        headers: {
            "Set-Cookie": await adminUser.serialize({ AdminLogin: false }),
        },
    });
}

/**
 * Renders the admin logout page.
 * @returns {JSX.Element} - The JSX element representing the admin logout page.
 */
const Logout = () => {
    return (
        <>
            <h1>This is admin logout page.</h1>
        </>
    );
}
export default Logout;