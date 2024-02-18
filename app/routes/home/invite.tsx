import { useEffect, useRef, useState } from "react";
import { CusButton } from "~/components/utils/buttont";
import * as EmailValidator from 'email-validator';
import { LoaderArgs, LoaderFunction, json } from "@remix-run/node";
import { userPrefs } from "~/cookies";
import { useLoaderData, useTransition } from "@remix-run/react";
import axios from "axios";
import { BaseUrl } from "~/const";
import { number } from "zod";
import { NOTICEAlerts, SUCCESSAlerts } from "~/components/utils/alert";
/**
 * Loader function that retrieves the user preferences from the request cookie header
 * and returns a JSON response containing the user object.
 * @param {LoaderArgs} props - The loader arguments object.
 * @returns {Promise<Response>} - A promise that resolves to a JSON response.
 */
export const loader: LoaderFunction = async (props: LoaderArgs) => {
    const cookieHeader = props.request.headers.get("Cookie");
    const cookie = await userPrefs.parse(cookieHeader);
    return json({ user: cookie.user });
}

/**
 * A functional component that renders an invitation form and displays the referral status.
 * @returns JSX elements representing the invitation form and referral status.
 */
const Invite = () => {
    const navigation = useTransition();
    const isSubmitting = navigation.state === "submitting";

    const userdata = useLoaderData();
    const userId: string = userdata.user.id;
    const nameRef = useRef<HTMLInputElement | null>(null);
    const emailRef = useRef<HTMLInputElement | null>(null);
    const [contactnumber, setContactnumber] = useState<number>()
    const [error, setError] = useState<string>("");

    const [refstatus, setRefStatus] = useState<any[]>([]);
    const [sus, setSus] = useState<string>("");
    const handelcontent = (e: any) => {
        setContactnumber(e.target.value.replace(/\D/g, ''));
    }


    const [isInviting, setIsInvite] = useState<boolean>(false);
    const init = async () => {
        const data = await axios({
            method: 'get',
            url: `${BaseUrl}/api/user-referrals/${userId}`,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': '*',
                'Access-Control-Allow-Options': '*',
                'Access-Control-Allow-Methods': '*',
                'X-Content-Type-Options': '*',
                'Content-Type': 'application/json',
                'Accept': '*'
            }
        });
        setRefStatus(data.data.data[0].refferrals);
    };

    useEffect(() => { init(); }, [])


    /**
     * Sends an invitation to a user with the provided information.
     * @returns None
     */
    const inviteuser = async () => {
        setIsInvite(true);

        if (nameRef.current?.value == null || nameRef.current?.value == undefined || nameRef.current?.value == "") {
            setError("Fill user name");
        }
        else if (emailRef.current?.value == null || emailRef.current?.value == undefined || emailRef.current?.value == "") {
            setError("Fill the Brand info");
        }
        else if (!EmailValidator.validate(emailRef.current?.value)) {
            setError("Enter valid Email Address");
        }
        else if (contactnumber == null || contactnumber == undefined || contactnumber == 0) {
            setError("Fill the contact number");
        }
        else {
            let req = {
                "userId": userId,
                "name": nameRef.current?.value,
                "email": emailRef.current?.value,
                "contact": contactnumber
            };
            const data = await axios({
                method: 'post',
                url: `${BaseUrl}/api/send-referral`,
                data: req,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': '*',
                    'Access-Control-Allow-Options': '*',
                    'Access-Control-Allow-Methods': '*',
                    'X-Content-Type-Options': '*',
                    'Content-Type': 'application/json',
                    'Accept': '*'
                }
            });
            if (data.data.status == false) {
                setError(data.data.message);
            } else {
                setError("");
                nameRef.current.value = "";
                emailRef.current.value = "";
                setContactnumber(0);
                setSus("Invitation has been send.");
                await init();
            }
        }


        setIsInvite(false);
    }
    return (
        <>
            <div>
                <div className="grid place-items-center w-full bg-yellow-500 rounded-xl shadow-xl my-6">
                    <img src="/images/cashgirl.png" alt="error" className="h-72" />
                </div>
                <div className="flex gap-4 grow flex-col lg:flex-row">
                    <div className="bg-white rounded-lg shadow-xl p-4 lg:w-96">
                        <h1 className="text-black text-lg font-medium text-left cusfont">Refer an influencer or brand</h1>
                        <p className="text-black text-left font-normal text-md">Name</p>
                        <input ref={nameRef} type={"text"} className="bg-[#EEEEEE] mt-1 outline-none border-none focus:border-gray-300 rounded-md w-full p-2" />
                        <p className="text-black text-left font-normal text-md mt-4">Email</p>
                        <input ref={emailRef} type={"text"} className="bg-[#EEEEEE] mt-1 outline-none border-none focus:border-gray-300 rounded-md w-full p-2" />
                        <p className="text-black text-left font-normal text-md mt-4">Contact Number</p>
                        <input onChange={handelcontent} value={contactnumber} type={"text"} className="bg-[#EEEEEE] mt-1 outline-none border-none focus:border-gray-300 rounded-md w-full p-2" />
                        {(error == "" || error == null || error == undefined) ? null :
                            <NOTICEAlerts message={error}></NOTICEAlerts>
                        }
                        {(sus == "" || sus == null || sus == undefined) ? null :
                            <SUCCESSAlerts message={sus}></SUCCESSAlerts>
                        }
                        <div className="h-2"></div>
                        {isInviting ?
                            <div className="w-full text-center text-lg rounded-md my-2 py-1 text-primary font-semibold bg-[#01FFF4]">Inviting... </div>
                            :
                            <button onClick={inviteuser} className="w-full text-center text-lg rounded-md my-2 py-1 text-primary font-semibold bg-[#01FFF4]">Invite </button>
                        }

                    </div>
                    <div className="bg-white rounded-lg shadow-xl p-4 grow w-full overflow-x-auto">
                        <h1 className="text-black text-lg font-medium text-left cusfont">Referral status</h1>
                        {refstatus.length == 0 ?
                            <>
                                <h1 className="text-black text-md font-semibold text-center">Your referral list is empty </h1>
                            </>
                            :
                            <table className="md:w-full md:table-auto border-separate border-spacing-y-3 w-[700px]">
                                <thead className="w-full bg-gray-100 rounded-xl p-2">
                                    <tr>
                                        <th scope="col" className="mt-2 font-normal p-2 text-left w-20"></th>
                                        <th scope="col" className="mt-2 font-normal p-2 text-left w-40">Name</th>
                                        <th scope="col" className="mt-2 font-normal p-2 text-left">Email</th>
                                        <th scope="col" className="mt-2 font-normal p-2 text-left">Contact</th>
                                        <th scope="col" className="mt-2 font-normal p-2 text-left">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="gap-y-4">
                                    {refstatus.map((val: any, index: number) => {
                                        const avatar = val["pic"] == "0" || val["pic"] == null || val["pic"] == undefined || val["pic"] == "" ? "/images/avatar/user.png" : val["pic"];
                                        return (
                                            <tr key={index}>
                                                <td><img src={avatar} alt="error" className="w-12 h-12 rounded-md object-cover" /></td>
                                                <td>{val.userName}</td>
                                                <td>{val.email}</td>
                                                <td>{val.contact}</td>
                                                <td className="font-medium">{val.status.isVerified == "UNVERIFIED" ? "Pending" : val.status.isVerified}</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>}
                    </div>
                </div>
            </div>
        </>
    );
}

export default Invite;