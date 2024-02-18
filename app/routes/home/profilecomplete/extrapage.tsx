import { faCirclePlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ActionArgs, ActionFunction, LoaderArgs, LoaderFunction, json, redirect } from "@remix-run/node";
import { Form, useLoaderData, useNavigate } from "@remix-run/react";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { NOTICEAlerts, SUCCESSAlerts } from "~/components/utils/alert";
import { BaseUrl } from "~/const";
import { userPrefs } from "~/cookies";
import UserInputStore from "~/state/user/firstinput";
import { UploadFile } from "~/utils";

/**
 * Loader function that retrieves user data based on the provided cookie.
 * @param {LoaderArgs} props - The loader arguments.
 * @returns {Promise<Response>} - A promise that resolves to a JSON response containing user data.
 */
export const loader: LoaderFunction = async (props: LoaderArgs) => {

    const cookieHeader = props.request.headers.get("Cookie");
    const cookie = await userPrefs.parse(cookieHeader);

    const userdata = await axios({
        method: "post",
        url: `${BaseUrl}/api/getuser`,
        data: { id: cookie.user.id },
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

    return json({
        user: cookie.user,
        userdata: userdata.data.data[0]
    });
}



const ExtraPage = () => {
    const [isUpdating, setIsUpdating] = useState<boolean>(false);

    const userdata = useLoaderData();
    const userinfo = userdata.userdata;
    const userId: string = userdata.user.id
    const isBrand: boolean = userdata.user.role.code == "50" ? true : false;

    const [error, setError] = useState<string | null>(null);
    const [sus, setSus] = useState<string | null>(null);

    const setIndex = UserInputStore((state) => state.setIndex);

    const nextButton = useRef<HTMLButtonElement>(null);

    const bankName = useRef<HTMLInputElement>(null);
    const branchName = useRef<HTMLInputElement>(null);
    const ifsc = useRef<HTMLInputElement>(null);
    const accountNumber = useRef<HTMLInputElement>(null);


    const doc1 = useRef<HTMLInputElement>(null);
    const doc2 = useRef<HTMLInputElement>(null);
    const doc3 = useRef<HTMLInputElement>(null);

    const [files1, setFiles1] = useState<File>();
    const [files2, setFiles2] = useState<File>();
    const [files3, setFiles3] = useState<File>();

    /**
     * Handles the input event for a number input field.
     * @param {React.ChangeEvent<HTMLInputElement>} e - The input event object.
     * @returns None
     */
    const handleNumberInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value;
        const numericValue = inputValue.replace(/[^0-9]/g, '');
        e.target.value = numericValue;
    };

    const navigator = useNavigate();

    const index = UserInputStore((state) => state.index);


    /**
     * A useEffect hook that runs when the component mounts or when the value of `index` changes.
     * It performs the following actions:
     * - If `index` is equal to 1, it calls the `navigator` function with the argument "/home/profilecomplete/".
     * - Sets the value of the `bankName` input field to `userinfo.bankName` if it exists, otherwise sets it to an empty string.
     * - Sets the value of the `branchName` input field to `userinfo.branchName` if it exists, otherwise sets it to an empty string.
     * - Sets the value of the `ifsc` input field to `userinfo.ifsc` if it exists, otherwise sets it to an empty string.
     *
     */
    useEffect(() => {
        if (index == 1) {
            navigator("/home/profilecomplete/");
        }
        bankName!.current!.value = userinfo.bankName ?? "";
        branchName!.current!.value = userinfo.branchName ?? "";
        ifsc!.current!.value = userinfo.ifsc ?? "";
        accountNumber!.current!.value = userinfo.acNo ?? "";

    }, []);


    /**
     * Navigates the user back to the third page of the profile completion process.
     * Sets the index to 3 and calls the navigator function to redirect to the specified page.
     * @returns None
     */
    const gotoback = () => {
        setIndex(3);
        navigator("/home/profilecomplete/thirdpage");
    }

    /**
     * Function to handle the "Next" button click event for a form submission.
     * Validates the input fields and uploads files if necessary.
     * Sends a POST request to update the user's information.
     * @returns None
     */
    const gotonext = async () => {
        setIsUpdating(true);
        if (
            bankName.current?.value == null ||
            bankName.current?.value == undefined ||
            bankName.current?.value == ""
        ) {
            setError("Enter Bank name.");
        } else if (
            branchName.current?.value == null ||
            branchName.current?.value == undefined ||
            branchName.current?.value == ""
        ) {
            setError("Enter Branch name.");
        } else if (
            ifsc.current?.value == null ||
            ifsc.current?.value == undefined ||
            ifsc.current?.value == ""
        ) {
            setError("Enter IFSC code.");
        } else if (
            accountNumber.current?.value == null ||
            accountNumber.current?.value == undefined ||
            accountNumber.current?.value == ""
        ) {
            setError("Enter Account Number.");
        } else {
            const updoc1 = await UploadFile(files1!);
            const updoc2 = await UploadFile(files2!);
            const updoc3 = await UploadFile(files3!);

            let req: any = {
                id: userId,
                bankName: bankName.current?.value,
                branchName: branchName.current?.value,
                ifsc: ifsc.current?.value,
                acNo: accountNumber.current?.value,
            };

            if (updoc1.status) {
                req["doc1"] = updoc1.data;
            }
            if (updoc2.status) {
                req["doc2"] = updoc2.data;
            }
            if (updoc3.status) {
                req["doc3"] = updoc3.data;
            }
            const data = await axios({
                method: "post",
                url: `${BaseUrl}/api/updateuser`,
                data: req,
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
            if (data.data.status == false) {
                if (data.data.message == "Oops, something went wrong") {
                    setIndex(5);
                    nextButton.current!.click();
                } else {
                    setError(data.data.message);
                }
            }
            setIndex(5);
            nextButton.current!.click();
        }
        setIsUpdating(false);
    }



    /**
     * Renders a form for uploading documents and entering bank information.
     * @returns JSX elements representing the form.
     */
    return (
        <>
            <div className="p-8 w-full">
                <h1 className="text-2xl text-black font-bold">Documents</h1>
                {/* {isBrand ? */}
                <>
                    <div className="hidden">
                        <input
                            type="file"
                            accept="*/*"
                            ref={doc1}
                            onChange={(value) => {
                                let file_size = parseInt(
                                    (value!.target.files![0].size / 1024 / 1024).toString()
                                );
                                if (file_size < 4) {
                                    setError(null);
                                    setFiles1(val => value!.target.files![0])
                                } else {
                                    setError("File size must be less then 4 mb");
                                }
                            }}
                        />
                        <input
                            type="file"
                            accept="*/*"
                            ref={doc2}
                            onChange={(value) => {
                                let file_size = parseInt(
                                    (value!.target.files![0].size / 1024 / 1024).toString()
                                );
                                if (file_size < 4) {
                                    setError(null);
                                    setFiles2(val => value!.target.files![0])
                                } else {
                                    setError("File size must be less then 4 mb");
                                }
                            }}
                        />
                        <input
                            type="file"
                            accept="*/*"
                            ref={doc3}
                            onChange={(value) => {
                                let file_size = parseInt(
                                    (value!.target.files![0].size / 1024 / 1024).toString()
                                );
                                if (file_size < 4) {
                                    setError(null);
                                    setFiles3(val => value!.target.files![0])
                                } else {
                                    setError("File size must be less then 4 mb");
                                }
                            }}
                        />
                    </div>
                    {/* doc section end here */}
                    <div className="flex gap-4 my-2">
                        <div className="w-full text-center bg-gray-100 text-lg font-semibold text-gray-700 rounded-md py-1 cursor-pointer" onClick={() => doc1.current?.click()}>
                            {files1 == null ? <>
                                Add Doc <FontAwesomeIcon className="mx-2" icon={faCirclePlus}></FontAwesomeIcon>
                            </> :
                                files1.name.length < 25 ? files1.name : `${files1.name.toString().slice(0, 25)}...`
                            }
                        </div>
                        {files1 != null ?
                            <a target="_blank" href={URL.createObjectURL(files1)} className="text-white text-center px-4 text-lx font-semibold rounded-md bg-cyan-500  py-2">VIEW</a>
                            : null
                        }
                    </div>

                    <div className="flex gap-4 my-2">
                        <div className="w-full text-center bg-gray-100 text-lg font-semibold text-gray-700 rounded-md py-1 cursor-pointer"
                            onClick={() => doc2.current?.click()}>

                            {files2 == null ? <>
                                Add Doc <FontAwesomeIcon className="mx-2" icon={faCirclePlus}></FontAwesomeIcon>
                            </> :
                                files2.name.length < 25 ? files2.name : `${files2.name.toString().slice(0, 25)}...`
                            }

                        </div>
                        {files2 != null ?
                            <a target="_blank" href={URL.createObjectURL(files2)} className="text-white text-center px-4 text-lx font-semibold rounded-md bg-cyan-500  py-2">VIEW</a>
                            : null
                        }
                    </div>

                    <div className="flex gap-4 my-2">
                        <div className="w-full text-center bg-gray-100 text-lg font-semibold text-gray-700 rounded-md py-1 cursor-pointer"
                            onClick={() => doc3.current?.click()}>
                            {files3 == null ? <>
                                Add Doc <FontAwesomeIcon className="mx-2" icon={faCirclePlus}></FontAwesomeIcon>
                            </> :
                                files3.name.length < 25 ? files3.name : `${files3.name.toString().slice(0, 25)}...`
                            }
                        </div>
                        {files3 != null ?
                            <a target="_blank" href={URL.createObjectURL(files3)} className="text-white text-center px-4 text-lx font-semibold rounded-md bg-cyan-500 py-2">VIEW</a>
                            : null
                        }
                    </div>
                    <div className="w-full h-[2px] bg-gray-400 my-4"></div>
                </>
                <h1 className="text-2xl text-black font-bold">Bank Information</h1>

                <p className="text-black text-left font-normal text-lg  mt-4">
                    Bank Name <span className="text-rose-500 text-2xl font-semibold">&#42;</span>
                </p>
                <input
                    ref={bankName}
                    type={"text"}
                    className="bg-[#EEEEEE]  outline-none border-none focus:border-gray-300 rounded-md w-full p-2"
                />
                <p className="text-black text-left font-normal text-lg  mt-4">
                    Branch Name <span className="text-rose-500 text-2xl font-semibold">&#42;</span>
                </p>
                <input
                    ref={branchName}
                    type={"text"}
                    className="bg-[#EEEEEE]  outline-none border-none focus:border-gray-300 rounded-md w-full p-2"
                />
                <p className="text-black text-left font-normal text-lg  mt-4">
                    IFSC/SWIFT/RTN CODE <span className="text-rose-500 text-2xl font-semibold">&#42;</span>
                </p>
                <input
                    ref={ifsc}
                    type={"text"}
                    className="bg-[#EEEEEE]  outline-none border-none focus:border-gray-300 rounded-md w-full p-2"
                />
                <p className="text-black text-left font-normal text-lg  mt-4">
                    Account Number <span className="text-rose-500 text-2xl font-semibold">&#42;</span>
                </p>
                <input
                    ref={accountNumber}
                    type={"text"}
                    className="bg-[#EEEEEE]  outline-none border-none focus:border-gray-300 rounded-md w-full p-2"
                    onInput={handleNumberInput}
                />
                {(error == "" || error == null || error == undefined) ? null :
                    <NOTICEAlerts message={error}></NOTICEAlerts>
                }
                {(sus == "" || sus == null || sus == undefined) ? null :
                    <SUCCESSAlerts message={sus}></SUCCESSAlerts>
                }
                <div className="flex mt-2 gap-3">
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
            </div >
        </>
    );
}

export default ExtraPage;


/**
 * An action function that handles a request and performs the necessary operations.
 * @param {ActionArgs} request - The request object containing the request data.
 * @returns {Promise} A promise that resolves to an object with the response data.
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

        return redirect("/home/profilecomplete/forthpage", {
            headers: {
                "Set-Cookie": await userPrefs.serialize({ user: userdatasave, isLogin: true }),
            },
        });
    }
}
