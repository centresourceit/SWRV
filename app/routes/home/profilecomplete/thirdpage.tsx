import { ActionArgs, ActionFunction, LoaderArgs, LoaderFunction, json, redirect } from "@remix-run/node";
import { Form, Link, useLoaderData, useNavigate } from "@remix-run/react";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { Fa6RegularPenToSquare, Fa6RegularTrashCan } from "~/components/icons";
import { NOTICEAlerts, SUCCESSAlerts } from "~/components/utils/alert";
import { BaseUrl } from "~/const";
import { userPrefs } from "~/cookies";
import UserInputStore from "~/state/user/firstinput";

/**
 * Loader function that retrieves user preferences and platform data.
 * @param {LoaderArgs} props - The loader arguments.
 * @returns {Promise<Response>} - A promise that resolves to a JSON response containing user and platform data.
 */
export const loader: LoaderFunction = async (props: LoaderArgs) => {

    const cookieHeader = props.request.headers.get("Cookie");
    const cookie = await userPrefs.parse(cookieHeader);




    const paltform = await axios({
        method: 'post',
        url: `${BaseUrl}/api/getplatform`,
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
    return json({
        user: cookie.user,
        paltform: paltform.data.data,
        // userplatforms: userdata.data.data[0].platforms
    });
}



/**
 * Represents the third page of the profile completion process.
 * @returns JSX element representing the third page.
 */
const ThirdPage = () => {
    const userdata = useLoaderData();
    const userId: string = userdata.user.id
    const platform = userdata.paltform;


    const [userplatforms, setUserplatforms] = useState<any[]>([]);

    const [isUpdating, setIsUpdating] = useState<boolean>(false);
    const [addedPlatfrom, setAddPlatform] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [sus, setSus] = useState<string | null>(null);

    const index = UserInputStore((state) => state.index);

    const init = async () => {
        setAddPlatform([]);
        const userdata = await axios({
            method: "post",
            url: `${BaseUrl}/api/getuser`,
            data: { id: userId },
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

        if (userdata.data.status) {
            for (let i = 0; i < userdata.data.data[0].platforms.length; i++) {
                setAddPlatform((val: any) => [...val, {
                    status: true,
                    text: userdata.data.data[0].platforms[i]["handleName"],
                    val: {
                        platformLogoUrl: userdata.data.data[0].platforms[i]["platform"]["logo"],
                        id: userdata.data.data[0].platforms[i]["platform"]["id"],
                        handleId: userdata.data.data[0].platforms[i]["id"]
                    }
                }
                ]);
            }
        }
    }


    useEffect(() => {

        if (index == 1) {
            navigator("/home/profilecomplete/");
        }

        init();
    }, []);

    const setIndex = UserInputStore((state) => state.setIndex);

    const nextButton = useRef<HTMLButtonElement>(null);
    const navigator = useNavigate();


    const gotoback = () => {
        setIndex(2);
        navigator("/home/profilecomplete/secondpage");
    }

    const gotonext = async () => {
        setIsUpdating(true);
        if (addedPlatfrom.length == 0) {
            setSus(null);
            setError("Click on Social Media Platform icon to add new platform");
        }
        else {
            if (addedPlatfrom[0]["status"]) {
                setIndex(4);
                nextButton.current!.click();
            } else {
                setSus(null);
                setError("Click on Social Media Platform icon to add new platform");
            }
        }
        setIsUpdating(false);
    }


    const addnewchannel = async (item: any) => {
        setError(null);
        setSus(null);
        if (addedPlatfrom.length > 0) {
            if (addedPlatfrom[addedPlatfrom.length - 1]["status"] == true) {
                setAddPlatform(val => [...val, { val: item, status: false, text: "" }]);
            } else {
                setAddPlatform(prevState => {
                    const newState = [...prevState];
                    newState[newState.length - 1].val = item;
                    return newState;
                });
            }
        }
        if (addedPlatfrom.length == 0) {
            setAddPlatform(val => [...val, { val: item, status: false, text: "" }]);
        }
    }

    const deletehandle = async () => {
        const data = await axios({
            method: 'post',
            url: `${BaseUrl}/api/delete-handle`,
            data: { id: actionid },
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
            setSus(null);
            setDeletebox(false);
            return setError(data.data.message);
        } else {
            setError(null);
            setDeletebox(false);
            setSus("Successfully deleted user handle");
            await init();
        }
    }

    const [actionid, setActionid] = useState<number>(0);
    const [deletebox, setDeletebox] = useState<boolean>(false);
    const [editbox, setEditbox] = useState<boolean>(false);
    const newhandlename = useRef<HTMLInputElement>(null);

    const updatename = async () => {
        if (newhandlename.current?.value == null || newhandlename.current.value == undefined || newhandlename.current.value == "") {
            setEditbox(false);
            return setError("Please Enter new handle name");
        }

        if (newhandlename.current?.value.length < 3) {
            setEditbox(false);
            return setError("New handle name should be more then 3 character.");
        }

        const data = await axios({
            method: 'post',
            url: `${BaseUrl}/api/update-handle`,
            data: { id: actionid, handleName: newhandlename.current?.value },
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
            setSus(null);
            setEditbox(false);
            return setError(data.data.message);
        } else {
            setError(null);
            setEditbox(false);
            setSus("Successfully updated user handle");
            await init();
        }
    }

    return (
        <>
            <div className={`h-screen w-full grid place-items-center bg-black bg-opacity-25 fixed top-0 left-0 ${deletebox ? "grid" : "hidden"}`}>
                <div className="w-80 bg-white rounded-xl shadow-xl p-4">
                    <h1 className="text-center text-xl font-semibold">Are you sure you want to delete this handle.</h1>
                    <div className="flex gap-4 items-center mt-4">
                        <button onClick={async () => { deletehandle(); }} className="grow bg-[#bdff80] center py-1 text-sm cusfont font-medium rounded-md text-black ">Yes</button>
                        <button onClick={() => { setDeletebox((val) => false) }} className="grow bg-[#f9a2a2] py-1 text-center text-sm cusfont font-medium rounded-md text-black">NO</button>
                    </div>
                </div>
            </div>
            <div className={`h-screen w-full grid place-items-center bg-black bg-opacity-25 fixed top-0 left-0 ${editbox ? "grid" : "hidden"}`}>
                <div className="w-80 bg-white rounded-xl shadow-xl p-4">
                    <h1 className="text-center text-xl font-semibold">Enter new handle name here.</h1>
                    <input ref={newhandlename} type="text" className="outline-none bg-[#eeeeee] rounded-md w-full mt-2 py-1 px-4" />
                    <div className="flex gap-4 items-center mt-4">
                        <button onClick={async () => { updatename(); }} className="grow bg-[#bdff80] center py-1 text-sm cusfont font-medium rounded-md text-black ">Yes</button>
                        <button onClick={() => { setDeletebox((val) => false) }} className="grow bg-[#f9a2a2] py-1 text-center text-sm cusfont font-medium rounded-md text-black">NO</button>
                    </div>
                </div>
            </div>
            <div className="p-5 w-full">
                <div className="flex gap-4 items-center">
                    <h1 className="text-2xl text-black font-bold">Platform</h1>
                    <div className="grow"></div>
                </div>
                <div className="flex gap-2 mt-2 flex-wrap items-center">
                    {platform.map((val: any, i: number) => {
                        return (
                            <div key={i} className={`w-10 h-10 p-1 rounded-lg cursor-pointer bg-gray-200`} onClick={() => {
                                addnewchannel(val)
                            }}>
                                <img src={platform[i]["platformLogoUrl"]} alt="error" className="w-10" />
                            </div>
                        );
                    })}
                </div>
                <div className="flex w-full">
                    <div className="w-full">
                        <div>
                            {
                                addedPlatfrom.map((val: any, index: number) => {
                                    return (
                                        <div key={index} className="bg-[#EEEEEE]  outline-none border-none focus:border-gray-300 rounded-md w-full p-2 mt-2 flex gap-2 items-center">
                                            <div><img src={`${val["val"]["platformLogoUrl"]}`} alt="logo" className="w-10" /></div>
                                            <input disabled={val["status"]} type={"text"} value={val["text"]} onChange={(e) => {
                                                let adddata = addedPlatfrom.filter((data) => data != val);
                                                setAddPlatform([...adddata, { val: val["val"], status: false, text: e.target.value }])
                                            }} className="mx-3 bg-transparent  outline-none border-none focus:border-gray-300 rounded-md w-full" />
                                            {
                                                val["status"] ?
                                                    <>
                                                        <div
                                                            onClick={() => {
                                                                setActionid(val["val"]["handleId"]);
                                                                setEditbox((val) => true);
                                                            }}
                                                            className="cursor-pointer bg-primary  rounded-md p-2"
                                                        >
                                                            <Fa6RegularPenToSquare className="text-white text-sm" />
                                                        </div>
                                                        <div
                                                            onClick={() => {
                                                                setActionid(val["val"]["handleId"]);
                                                                setDeletebox((val) => true);
                                                            }}
                                                            className="cursor-pointer bg-secondary  rounded-md p-2"
                                                        >
                                                            <Fa6RegularTrashCan className="text-white text-sm" />
                                                        </div>
                                                    </>
                                                    : <div className="text-white bg-green-500 font-medium text-md text-center rounded-md grid place-items-center px-4 cursor-pointer" onClick={async () => {
                                                        if (val["text"] == null || val["text"] == undefined || val["text"] == "") {
                                                            setSus(null);
                                                            setError("Fill the handle name");
                                                        }
                                                        else if (val["text"].indexOf(" ") >= 0) {
                                                            setSus(null);
                                                            setError("Hashtag cannot contains space");
                                                        }
                                                        else {
                                                            let req = {
                                                                "userId": userId,
                                                                "platformId": val["val"]["id"],
                                                                "handleName": val["text"]
                                                            };

                                                            const data = await axios({
                                                                method: 'post',
                                                                url: `${BaseUrl}/api/add-handle`,
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
                                                                setSus(null);
                                                                return setError(data.data.message);
                                                            }
                                                            else {
                                                                setError(null);
                                                                setSus("Successfully added the user handle");
                                                                let updatevalue = val["val"];
                                                                updatevalue["handleId"] = data.data.data.handleId;
                                                                let adddata = addedPlatfrom.filter((data) => data != val);
                                                                setAddPlatform([...adddata, { val: updatevalue, status: true, text: val["text"] }]);
                                                            }
                                                        }
                                                    }
                                                    }>Done</div>
                                            }
                                        </div>
                                    );
                                })
                            }
                        </div>
                        {(error == "" || error == null || error == undefined) ? null :
                            <NOTICEAlerts message={error}></NOTICEAlerts>
                        }
                        {(sus == "" || sus == null || sus == undefined) ? null :
                            <SUCCESSAlerts message={sus}></SUCCESSAlerts>
                        }
                        <div className="flex mt-4 gap-3">
                            <button className="bg-[#eeeeee] text-center rounded-lg text-black font-medium cusfont w-full py-2"
                                onClick={gotoback}
                            >
                                Back
                            </button>
                            {isUpdating ?
                                <div className="bg-primary text-center rounded-lg text-white font-medium cusfont w-full py-2">
                                    Updating...
                                </div>
                                :
                                <button className="bg-primary text-center rounded-lg text-white font-medium cusfont w-full py-2"
                                    onClick={gotonext}
                                >
                                    Next
                                </button>}
                        </div>


                        <Form method="post" className="hidden">
                            <input type="hidden" name="id" value={userId.toString()} />
                            <button ref={nextButton} name="submit">Submit</button>
                        </Form>

                    </div>
                </div>
            </div >
        </>
    );
}
export default ThirdPage;





/**
 * An action function that handles a request and performs the necessary operations.
 * @param {ActionArgs} request - The request object containing the request data.
 * @returns {Promise<object>} - A promise that resolves to an object containing the response data.
 */
export const action: ActionFunction = async ({ request }: ActionArgs) => {
    const formData = await request.formData();
    const value = Object.fromEntries(formData);

    const userdata = await axios({
        method: 'post',
        url: `${BaseUrl}/api/getuser`,
        data: { "id": value.id },
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
    if (userdata.data.status == false) {
        return { message: userdata.data.message };
    } else {
        let userdatasave = userdata.data.data[0];
        delete userdatasave.languages;
        delete userdatasave.platforms;
        delete userdatasave.categories;
        delete userdatasave.market;

        return redirect("/home/profilecomplete/extrapage", {
            headers: {
                "Set-Cookie": await userPrefs.serialize({ user: userdatasave, isLogin: true }),
            },
        });
    }
}