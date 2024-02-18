import { LoaderArgs, LoaderFunction, json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import axios from "axios";
import { useState } from "react";
import { NOTICEAlerts, SUCCESSAlerts } from "~/components/utils/alert";
import { BaseUrl } from "~/const";
import { userPrefs } from "~/cookies";

export const loader: LoaderFunction = async ({ request }: LoaderArgs) => {
    const cookieHeader = request.headers.get("Cookie");
    const cookie = await userPrefs.parse(cookieHeader);
    return json({ userid: cookie.user.id });
};


/**
 * A functional component that displays a "Sorry" message along with an image and some
 * instructions. It also provides buttons for sending a verification email, contacting
 * support, and logging in.
 * @returns JSX element
 */
const Sorry = () => {
    const userid = useLoaderData().userid;
    const [error, setError] = useState<string | null>(null);
    const [sus, setSus] = useState<string | null>(null);
    const [isSending, seIsSending] = useState<boolean>(false);
    const sendmain = async () => {
        setError(val => null);
        setSus(val => null);
        seIsSending(true);
        const sendverificationmail = await axios({
            method: "post",
            url: `${BaseUrl}/api/send-otp`,
            data: { userId: userid },
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
        if (sendverificationmail.data.status) {
            setSus(val => "E-mail sent successfully.")
        } else {
            setError(val => sendverificationmail.data.message);
        }
        seIsSending(false);
    }


    return (
        <>
            <div className="bg-[#eeeeee] min-h-screen p-6 grid place-items-center w-full">
                <div className="w-full bg-white rounded-lg shadow-lg p-10 mt-6 relative ">
                    <div className=" text-center text-[100px] font-black text-stroke text-white  absolute translate-y-40 grid place-items-center top-0 left-0 translate-x-52">
                        <div>
                            Sorry !!
                        </div>
                    </div>
                    <div className="w-full grid place-content-center relative">
                        <img src="/images/avatar/sorry.png" alt="error" className="h-[300px]" />
                    </div>
                    <div className="w-full grid place-items-center relative my-3">
                        <p className="text-sm font-normal text-gray-500 text-left w-96">
                            Your email is not verified kindly verify your email Address before proceeding
                        </p>
                    </div>
                    <div className="flex gap-4 w-full justify-center mt-6">

                        {isSending ?
                            <button
                                className="text-black text-sm bg-[#fbca8e] rounded-md py-1 w-32 text-center">Sending Mail...</button>
                            : <button
                                onClick={sendmain}
                                className="text-black text-sm bg-[#fbca8e] rounded-md py-1 w-32 text-center">Resend Email</button>}
                        <Link to={"/contact"} className="text-black text-sm bg-[#beff80] rounded-md py-1 w-32 text-center">Contact Us</Link>
                        <Link to={"/logout"} className="text-black text-sm bg-[#ff88bb] rounded-md py-1 w-32 text-center">Login</Link>
                    </div>

                    <div className="grid place-items-center">
                        {error == "" || error == null || error == undefined ? null : (
                            <NOTICEAlerts message={error}></NOTICEAlerts>
                        )}

                        {sus == "" || sus == null || sus == undefined ? null : (
                            <SUCCESSAlerts message={sus}></SUCCESSAlerts>

                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

export default Sorry;