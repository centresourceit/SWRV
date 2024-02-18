import { useLoadScript } from "@react-google-maps/api";
import { LoaderArgs, LoaderFunction, json } from "@remix-run/node";
import { useLoaderData, useNavigate } from "@remix-run/react";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { NOTICEAlerts } from "~/components/utils/alert";
import { BaseUrl } from "~/const";

export const loader: LoaderFunction = async (props: LoaderArgs) => {
    const id = props.params.id;
    const user = await axios.post(`${BaseUrl}/api/getuser`, { id: id });
    return json({ user: user.data.data, id: id });
};

/**
 * A functional component that allows the user to edit their profile information.
 * @returns {JSX.Element} - The JSX element representing the profile edit form.
 */
const ProfileEdit: React.FC = (): JSX.Element => {
    const user = useLoaderData().user[0];
    const id = useLoaderData().id;

    const isbrand = useLoaderData().user[0].role.code != 10;

    const [error, setError] = useState<string>("");
    const [barnd, serBrand] = useState<any>(null);

    const userNameRef = useRef<HTMLInputElement>(null);
    const userKnownAsRef = useRef<HTMLInputElement>(null);
    const userWebUrlRef = useRef<HTMLInputElement>(null);
    const userFullPostalAddressRef = useRef<HTMLTextAreaElement>(null);
    // const userPicUrlRef = useRef<HTMLInputElement>(null);
    const userBioInfoRef = useRef<HTMLTextAreaElement>(null);
    const personalHistoryRef = useRef<HTMLTextAreaElement>(null);
    const careerHistoryRef = useRef<HTMLTextAreaElement>(null);
    const ifscRef = useRef<HTMLInputElement>(null);
    const acNoRef = useRef<HTMLInputElement>(null);

    const navigator = useNavigate();


    useEffect(() => {
        if (isbrand) {
            navigator(`/home/brandedit/${user.brand.id}`);
        }

        userNameRef!.current!.value = user["userName"];
        userKnownAsRef!.current!.value = user["knownAs"];
        userWebUrlRef!.current!.value = user["website"];
        userFullPostalAddressRef!.current!.value = user["address"];
        // userPicUrlRef!.current!.value = user["pic"];
        userBioInfoRef!.current!.value = user["bio"];
        personalHistoryRef!.current!.value = user["personalHistory"];
        careerHistoryRef!.current!.value = user["careerHistory"];
        ifscRef!.current!.value = user["ifsc"];
        acNoRef!.current!.value = user["acNo"];
    }, []);

    /**
     * Submits user data to the server for updating user information.
     * @returns None
     */
    const submit = async () => {
        const userdata = await axios({
            method: "post",
            url: `${BaseUrl}/api/edit-user`,
            data: {
                id: id,
                update: {
                    userName: userNameRef!.current!.value,
                    userKnownAs: userKnownAsRef!.current!.value,
                    userWebUrl: userWebUrlRef!.current!.value,
                    userFullPostalAddress: userFullPostalAddressRef!.current!.value,
                    // userPicUrl: userPicUrlRef!.current!.value,
                    userBioInfo: userBioInfoRef!.current!.value,
                    personalHistory: personalHistoryRef!.current!.value,
                    careerHistory: careerHistoryRef!.current!.value,
                    ifsc: ifscRef!.current!.value,
                    acNo: acNoRef!.current!.value,

                }
            },
        });

        if (userdata.data.status == false) {
            setError(userdata.data.message);
        } else {
            navigator(-1);
        }
    }


    return (
        <>
            <div className="w-full mt-6 bg-white rounded-lg shadow-xl px-6 py-4">
                <h1 className="text-black font-medium text-xl">Edit User</h1>
                <div className="w-full bg-slate-800 h-[1px] my-2"></div>
                <p className="text-black font-semibold text-xl">User Name</p>
                <input
                    ref={userNameRef}
                    className="p-2 w-96 outline-none bg-transparent text-black border-2 border-black block my-4 rounded-md"
                />
                <p className="text-black font-semibold text-xl">User Known As</p>
                <input
                    ref={userKnownAsRef}
                    className="p-2 w-96 outline-none bg-transparent text-black border-2 border-black block my-4 rounded-md resize-none"
                />
                <p className="text-black font-semibold text-xl">User Web Page</p>
                <input
                    ref={userWebUrlRef}
                    className="p-2 w-96 outline-none bg-transparent text-black border-2 border-black block my-4 rounded-md"
                />
                <p className="text-black font-semibold text-xl">User Full Address</p>
                <textarea
                    ref={userFullPostalAddressRef}
                    className="p-2 w-96 outline-none bg-transparent text-black border-2 border-black block my-4 rounded-md h-32 resize-none"
                ></textarea>
                {/* <p className="text-black font-semibold text-xl">User Pic Link</p>
                <input
                    ref={userPicUrlRef}
                    className="p-2 w-96 outline-none bg-transparent text-black border-2 border-black block my-4 rounded-md"
                /> */}
                <p className="text-black font-semibold text-xl">User Bio Info</p>
                <textarea
                    ref={userBioInfoRef}
                    className="p-2 w-96 outline-none bg-transparent text-black border-2 border-black block my-4 rounded-md h-32 resize-none"
                ></textarea>
                <p className="text-black font-semibold text-xl">User Personal History</p>
                <textarea
                    ref={personalHistoryRef}
                    className="p-2 w-96 outline-none bg-transparent text-black border-2 border-black block my-4 rounded-md h-32 resize-none"
                ></textarea>
                <p className="text-black font-semibold text-xl">User Career History</p>
                <textarea
                    ref={careerHistoryRef}
                    className="p-2 w-96 outline-none bg-transparent text-black border-2 border-black block my-4 rounded-md h-32 resize-none"
                ></textarea>
                <p className="text-black font-semibold text-xl">Bank Swift/Routing/Ifsc No.</p>
                <input
                    ref={ifscRef}
                    className="p-2 w-96 outline-none bg-transparent text-black border-2 border-black block my-4 rounded-md"
                />.

                <p className="text-black font-semibold text-xl">Bank AC No.</p>
                <input
                    ref={acNoRef}
                    className="p-2 w-96 outline-none bg-transparent text-black border-2 border-black block my-4 rounded-md"
                />
                {error == "" || error == null || error == undefined ? null : (
                    <NOTICEAlerts message={error}></NOTICEAlerts>
                )}
                <button className="text-white py-2 px-4 rounded-md bg-cyan-500 w-96 text-center" onClick={submit}>UPDATE</button>
            </div>
        </>

    );
}

export default ProfileEdit;


