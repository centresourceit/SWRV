import { LoaderArgs, LoaderFunction, json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import axios from "axios";
import { BaseUrl } from "~/const";
import { userPrefs } from "~/cookies";

/**
 * Loader function that verifies a user's email address.
 * @param {LoaderArgs} props - The loader arguments.
 * @returns A JSON response indicating the status and message of the verification process.
 */
export const loader: LoaderFunction = async (props: LoaderArgs) => {
    const email = props.params.mail;

    const data = await axios({
        method: "post",
        url: `${BaseUrl}/api/verify-user`,
        data: { email: email },
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "*",
            "Access-Control-Allow-Options": "*",
            "Access-Control-Allow-Methods": "*",
            "X-Content-Type-Options": "*",
            "Content-Type": "application/json",
            Accept: "*",
        },
    });
    return json({ error: !data.data.status, message: data.data.message });
};

/**
 * A React functional component that renders a user verification page.
 * @returns {JSX.Element} - The JSX element representing the user verification page.
 */
const verifyuser: React.FC = (): JSX.Element => {
    const error = useLoaderData().error;
    const message = useLoaderData().message;
    return (
        <>
            <div className="w-full bg-[#eeeeee] grid place-content-center h-screen">
                <div className="bg-white rounded-lg shadow-md px-6 py-2 mx-10">

                    <p className="text-3xl text-center font-semibold text-gray-600 my-4">Email verification</p>
                    {
                        error ?
                            <div className="rounded-md bg-red-500 text-white text-2xl text-center font-semibold py-2 px-4">{message}</div>
                            :
                            <div className="rounded-md bg-green-500 text-white text-2xl text-center font-semibold py-2 px-4">{message}</div>
                    }
                    <div className="h-10"></div>
                    <div className="w-full grid place-items-center">
                        <Link to="/logout" className="text-xl text-center font-semibold text-blue-500">Go back to website</Link>
                    </div>
                </div>
            </div>
        </>
    );
}


export default verifyuser;