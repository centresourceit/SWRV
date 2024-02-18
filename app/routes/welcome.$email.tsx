import { useLoadScript } from "@react-google-maps/api";
import { LoaderArgs, LoaderFunction, json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { ConAlert } from "~/components/utils/alert";
import { userPrefs } from "~/cookies";

/**
 * Loader function that retrieves user preferences based on the provided request.
 * @param {LoaderArgs} request - The request object containing the necessary information.
 * @returns A JSON response object containing the user's email and user ID.
 */
export const loader: LoaderFunction = async (request: LoaderArgs) => {
    const cookieHeader = request.request.headers.get("Cookie");
    const cookie = await userPrefs.parse(cookieHeader);
    return json({
        email: request.params.email,
        userid: cookie.user.id
    });
}

/**
 * A functional component that renders a welcome screen.
 * @returns {JSX.Element} - The JSX element representing the welcome screen.
 */
const Welcome: React.FC = (): JSX.Element => {
    const email = useLoaderData().email;
    const userid = useLoaderData().userid;
    return (
        <>
            <div className="min-h-screen w-full grid place-items-center">
                <ConAlert email={email} userid={userid}></ConAlert>
            </div>
        </>
    );
}

export default Welcome;