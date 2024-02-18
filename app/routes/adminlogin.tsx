import { faEye, faEyeSlash, faPerson, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ActionArgs, LoaderArgs, redirect } from "@remix-run/node";
import { Form, Link, useActionData } from "@remix-run/react";
import axios from "axios";
import { useEffect, useState, useTransition } from "react";
import { BaseUrl } from "~/const";
import { adminUser } from "~/cookies";
import { ToastContainer, toast } from 'react-toastify';

import styles from 'react-toastify/dist/ReactToastify.css';

export function links() {
    return [{ rel: "stylesheet", href: styles }];
}

/**
 * Loader function that handles incoming requests and checks for admin login cookie.
 * If the cookie is present and indicates an admin login, it redirects to the admin home page.
 * @param {LoaderArgs} request - The request object containing headers and other information.
 * @returns {Promise<null>} - Returns null if no redirect is needed.
 */
export async function loader({ request }: LoaderArgs) {
    const cookieHeader = request.headers.get("Cookie");
    const cookie = await adminUser.parse(cookieHeader);
    if (cookie) {
        if (cookie.AdminLogin) {
            return redirect("/admin/home");
        }
    }
    return null;
}

/**
 * A functional component that renders an admin login form.
 * @returns JSX element representing the admin login form.
 */
const AdminLogin = () => {
    const [pass, setPass] = useState<boolean>(false);
    const handelPassword = (value: boolean) => {
        setPass((val) => value);
    }

    const retdata = useActionData();

    /**
     * Renders a login form component with input fields for username and password.
     * @returns {JSX.Element} - The rendered login form component.
     */
    return (
        <>
            <div className="h-screen w-full grid place-items-center bg-[#1b2028]">
                <div>
                    <h3 className="text-white text-2xl font-medium my-3 text-center">SWRV ADMIN</h3>
                    <div className="w-80 bg-[#31353f] rounded-lg p-4">
                        <h3 className="text-white text-xl font-medium my-3 text-center">Login</h3>
                        <Form method="post">
                            <div className="text-white flex gap-4 my-4 items-center border-2 border-gray-400 rounded-md py-1 px-4">
                                <FontAwesomeIcon icon={faUser}></FontAwesomeIcon>
                                <input type={"text"} name="username" className="w-full bg-transparent outline-none focus:bg-transparent fill-none border-none" placeholder="Enter the username.." autoComplete="off" />
                            </div>
                            <div className="text-white flex gap-4 my-4 items-center border-2 border-gray-400 rounded-md py-1 px-4">
                                <div className="cursor-pointer" onClick={() => handelPassword(!pass)}>
                                    <FontAwesomeIcon icon={pass ? faEyeSlash : faEye}></FontAwesomeIcon>
                                </div>
                                <input type={pass ? "text" : "password"} name="password" className="w-full bg-transparent outline-none focus:bg-transparent" placeholder="Enter the password.." autoComplete="off" />
                            </div>
                            {(retdata?.message == "" || retdata?.message == null || retdata?.message == undefined) ? null :
                                <div className="bg-red-500 bg-opacity-10 border-2 text-center border-red-500 rounded-md text-red-500 text-md font-normal text-md my-4">{retdata.message}</div>
                            }
                            <div>
                                <button className="text-center text-white font-bold w-full py-1 border-2 border-gray-300 hover:bg-gray-300 hover:text-[#222239]" type="submit">SUBMIT</button>
                            </div>
                        </Form>
                    </div>
                </div>
            </div>
        </>
    );
}
export default AdminLogin;


/**
 * Performs an action to handle a login request from the client.
 * @param {ActionArgs} request - The request object containing the form data.
 * @returns {Object} - An object containing the response message and error status.
 */
export const action = async ({ request }: ActionArgs) => {
    const formData = await request.formData();
    const value = Object.fromEntries(formData);
    if (value.username == null || value.username == "" || value.username == undefined) {
        return { message: "Enter username.", error: true };
    }
    if (value.password == null || value.password == "" || value.password == undefined) {
        return { message: "Enter password.", error: true };
    }
    try {
        const data = await axios.post(`${BaseUrl}/api/admin-login`, { "userName": value.username, "password": value.password });
        if (data.data.status == false) {
            return { message: data.data.message, error: true };
        }
        else {
            return redirect("/admin/home", {
                headers: {
                    "Set-Cookie": await adminUser.serialize({ user: data.data.data[0], AdminLogin: true }),
                },
            });
        }
    } catch (e) {
        return { message: e };
    }

}