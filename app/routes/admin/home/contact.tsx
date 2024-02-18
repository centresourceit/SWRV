import { LoaderArgs, LoaderFunction, json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { NOTICEAlerts } from "~/components/utils/alert";
import { BaseUrl } from "~/const";

/**
 * Loader function that retrieves the home address from the API endpoint.
 * @param {LoaderArgs} props - The loader arguments.
 * @returns {Promise<LoaderResult>} A promise that resolves to the home address.
 */
export const loader: LoaderFunction = async (props: LoaderArgs) => {
    const address = await axios.post(`${BaseUrl}/api/get-home`);
    return json({ address: address.data.data });
};

const Contact = () => {
    const address = useLoaderData().address[0];
    const [error, setError] = useState<string>("");

    const address1Ref = useRef<HTMLInputElement>(null);
    const address2Ref = useRef<HTMLInputElement>(null);
    const address3Ref = useRef<HTMLInputElement>(null);

    useEffect(() => {
        address1Ref!.current!.value = address["address_1"];
        address2Ref!.current!.value = address["address_2"];
        address3Ref!.current!.value = address["address_3"];
    }, []);

    /**
     * Submits a POST request to the server to update the user's home address.
     * @returns None
     * @throws {Error} If the request fails or returns an error status.
     */
    const submit = async () => {
        const userdata = await axios({
            method: "post",
            url: `${BaseUrl}/api/edit-home`,
            data: {
                update: {
                    address_1: address1Ref!.current!.value,
                    address_2: address2Ref!.current!.value,
                    address_3: address3Ref!.current!.value
                }
            },
        });

        if (userdata.data.status == false) {
            setError(userdata.data.message);
        } else {
            window.location.reload();
        }
    }


    /**
     * Renders a contact form with contact information and an edit section.
     * @returns {JSX.Element} - The rendered contact form.
     */
    return (
        <div className="grow bg-[#1b2028] my-2 rounded-md p-4 w-full">
            <h1 className="text-white font-medium text-xl">Contact</h1>
            <div className="w-full bg-slate-400 h-[1px] my-2"></div>
            <div className="flex gap-4 flex-col lg:flex-row items-center w-full mt-4 justify-center">
                <div className=" w-60 py-2 px-4 rounded-md shadow-xl bg-white text-center text-primary font-medium flex gap-2">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="28"
                        height="28"
                        viewBox="0 0 24 24"
                    >
                        <path
                            fill="currentColor"
                            d="M12 4c2.2 0 4 1.8 4 4c0 2.1-2.1 5.5-4 7.9c-1.9-2.5-4-5.8-4-7.9c0-2.2 1.8-4 4-4m0-2C8.7 2 6 4.7 6 8c0 4.5 6 11 6 11s6-6.6 6-11c0-3.3-2.7-6-6-6m0 4c-1.1 0-2 .9-2 2s.9 2 2 2s2-.9 2-2s-.9-2-2-2m8 13c0 2.2-3.6 4-8 4s-8-1.8-8-4c0-1.3 1.2-2.4 3.1-3.2l.6.9c-1 .5-1.7 1.1-1.7 1.8c0 1.4 2.7 2.5 6 2.5s6-1.1 6-2.5c0-.7-.7-1.3-1.8-1.8l.6-.9c2 .8 3.2 1.9 3.2 3.2Z"
                        />
                    </svg>{" "}
                    {address["address_1"]}
                </div>
                <div className="w-60 py-2 px-4 rounded-md shadow-xl bg-white text-center text-primary font-medium flex gap-2">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="28"
                        height="28"
                        viewBox="0 0 24 24"
                    >
                        <path
                            fill="currentColor"
                            d="M19 12q0-2.925-2.038-4.963T12 5V3q1.875 0 3.513.713t2.85 1.924q1.212 1.213 1.925 2.85T21 12h-2Zm-4 0q0-1.25-.875-2.125T12 9V7q2.075 0 3.538 1.463T17 12h-2Zm4.95 9q-3.225 0-6.288-1.438t-5.425-3.8q-2.362-2.362-3.8-5.425T3 4.05q0-.45.3-.75t.75-.3H8.1q.35 0 .625.225t.325.575l.65 3.5q.05.35-.013.638T9.4 8.45L6.975 10.9q1.05 1.8 2.638 3.375T13.1 17l2.35-2.35q.225-.225.588-.338t.712-.062l3.45.7q.35.075.575.338T21 15.9v4.05q0 .45-.3.75t-.75.3ZM6.025 9l1.65-1.65L7.25 5H5.025q.125 1.025.35 2.025T6.025 9Zm8.95 8.95q.975.425 1.988.675T19 18.95v-2.2l-2.35-.475l-1.675 1.675ZM6.025 9Zm8.95 8.95Z"
                        />
                    </svg>{" "}
                    {address["address_2"]}
                </div>
                <div className="w-60 py-2 px-4 rounded-md shadow-xl bg-white text-center text-primary font-medium flex gap-2">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                    >
                        <path
                            fill="currentColor"
                            d="M22 6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6zm-2 0l-8 5l-8-5h16zm0 12H4V8l8 5l8-5v10z"
                        />
                    </svg>{" "}
                    {address["address_3"]}
                </div>
            </div>

            <h1 className="text-white font-medium text-xl">Edit Contact</h1>
            <div className="w-full bg-slate-400 h-[1px] my-2"></div>
            <input
                ref={address1Ref}
                className="p-2 w-80 outline-none bg-transparent text-white border-2 border-white block my-4 rounded-md resize-none"
            />
            <input
                ref={address2Ref}
                className="p-2 w-80 outline-none bg-transparent text-white border-2 border-white block my-4 rounded-md resize-none"
            />
            <input
                ref={address3Ref}
                className="p-2 w-80 outline-none bg-transparent text-white border-2 border-white block my-4 rounded-md resize-none"
            />
            {error == "" || error == null || error == undefined ? null : (
                <NOTICEAlerts message={error}></NOTICEAlerts>
            )}
            <button className="text-white py-2 px-4 rounded-md bg-cyan-500 w-80 text-center" onClick={submit}>UPDATE</button>
        </div>
    );
};

export default Contact;
