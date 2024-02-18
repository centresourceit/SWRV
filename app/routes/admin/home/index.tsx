import { LoaderArgs, LoaderFunction, json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { Fa6SolidKey } from "~/components/icons";
import { BaseUrl } from "~/const";
import { adminUser } from "~/cookies";
import styles from 'react-toastify/dist/ReactToastify.css';
import { useState } from "react";

/**
 * Returns an array of link objects that can be used to include stylesheets in an HTML document.
 * @returns {Array} An array of link objects, each containing the "rel" and "href" properties.
 */
export function links() {
  return [{ rel: "stylesheet", href: styles }];
}



/**
 * Loader function that retrieves the email of the user from the cookie header.
 * @param {LoaderArgs} props - The loader arguments.
 * @returns A JSON response containing the email of the user.
 */
export const loader: LoaderFunction = async (props: LoaderArgs) => {
  const cookieHeader = props.request.headers.get("Cookie");
  const cookie = await adminUser.parse(cookieHeader);

  return json({
    email: cookie.user.userEmail,
  });
};

const AdminDashboard = () => {

  const email = useLoaderData().email;

  const [isSending, setIsSending] = useState<boolean>(false);

  /**
   * Sends a request to change the user's password.
   * @async
   * @returns None
   */
  const changePassword = async () => {
    setIsSending(true);
    const apidata = await axios.post(`${BaseUrl}/api/send-forgot-password`, {
      user: email,
    });
    if (apidata.data.status) {
      toast.error(apidata.data.message, { theme: "dark", });
    } else {
      toast.success("Successfully updated.", { theme: "dark", });
    }
    setIsSending(false);
  }

  /**
   * Renders a dashboard component with a change password section.
   * @returns {JSX.Element} - The rendered dashboard component.
   */
  return (
    <div className="grow bg-[#1b2028] my-2 rounded-md p-4 w-full">
      <h1 className="text-white font-medium text-xl">Dashboard</h1>
      <div className="w-full bg-slate-400 h-[1px] my-2"></div>
      <h3 className="text-white">Change Passowrd</h3>
      {isSending ?
        <div
          className={`mt-2 w-40 text-sm flex gap-2 items-center my-1 b  py-1 px-2 rounded-md border border-yellow-400 bg-yellow-500 bg-opacity-10 text-yellow-500 cursor-pointer`}
        >
          <Fa6SolidKey></Fa6SolidKey>
          <p>Sending Mail...</p>
        </div> :
        <div
          onClick={() => changePassword()}
          className={`mt-2 w-40 text-sm flex gap-2 items-center my-1 b  py-1 px-2 rounded-md border border-gray-300  hover:border-green-400 hover:bg-green-500 hover:bg-opacity-10 hover:text-green-500 text-gray-300 cursor-pointer`}
        >
          <Fa6SolidKey></Fa6SolidKey>
          <p>Change Password</p>
        </div>
      }
      <ToastContainer></ToastContainer>
    </div>
  );
};

export default AdminDashboard;
