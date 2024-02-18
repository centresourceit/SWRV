import { LoaderArgs, LoaderFunction, json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { NOTICEAlerts } from "~/components/utils/alert";
import { BaseUrl } from "~/const";

/**
 * Loader function that retrieves the home data from the server.
 * @param {LoaderArgs} props - The loader arguments.
 * @returns {Promise<LoaderResult>} A promise that resolves to the home data.
 */
export const loader: LoaderFunction = async (props: LoaderArgs) => {
    const home = await axios.post(`${BaseUrl}/api/get-home`);
    return json({ home: home.data.data });
};
/**
 * The Home component displays a form with multiple input fields that allow the user to edit
 * various text values. The initial values for the input fields are retrieved from the `home`
 * object in the loader data. The component uses `useRef` to create references to each input field,
 * and `useEffect` to set the initial values of the input fields when the component mounts.
 * 
 * The `submit` function is called when the user clicks the submit button. It sends a POST request
 * to the server with the updated text values. If the request is successful, the page is reloaded.
 * If there is an error, the error message is displayed.
 * 
 * @returns None
 */
const Home = () => {

    const home = useLoaderData().home[0];
    const [error, setError] = useState<string>("");


    const home1Ref = useRef<HTMLInputElement>(null);
    const home2Ref = useRef<HTMLTextAreaElement>(null);
    const home3Ref = useRef<HTMLInputElement>(null);
    const home4Ref = useRef<HTMLInputElement>(null);
    const home5Ref = useRef<HTMLTextAreaElement>(null);
    const home6Ref = useRef<HTMLTextAreaElement>(null);
    const home7Ref = useRef<HTMLTextAreaElement>(null);
    const home8Ref = useRef<HTMLTextAreaElement>(null);
    const home9Ref = useRef<HTMLTextAreaElement>(null);
    const home10Ref = useRef<HTMLTextAreaElement>(null);
    const home11Ref = useRef<HTMLTextAreaElement>(null);
    const home12Ref = useRef<HTMLTextAreaElement>(null);
    const home13Ref = useRef<HTMLTextAreaElement>(null);
    const home14Ref = useRef<HTMLTextAreaElement>(null);
    const home15Ref = useRef<HTMLTextAreaElement>(null);
    const home16Ref = useRef<HTMLTextAreaElement>(null);
    const home17Ref = useRef<HTMLTextAreaElement>(null);
    const home18Ref = useRef<HTMLTextAreaElement>(null);
    const home19Ref = useRef<HTMLInputElement>(null);
    const home20Ref = useRef<HTMLInputElement>(null);
    const home21Ref = useRef<HTMLTextAreaElement>(null);
    const home22Ref = useRef<HTMLTextAreaElement>(null);
    const home23Ref = useRef<HTMLTextAreaElement>(null);
    const home24Ref = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        home1Ref!.current!.value = home["text_1"];
        home2Ref!.current!.value = home["text_2"];
        home3Ref!.current!.value = home["text_3"];
        home4Ref!.current!.value = home["text_4"];
        home5Ref!.current!.value = home["text_5"];
        home6Ref!.current!.value = home["text_6"];
        home7Ref!.current!.value = home["text_7"];
        home8Ref!.current!.value = home["text_8"];
        home9Ref!.current!.value = home["text_9"];
        home10Ref!.current!.value = home["text_10"];
        home11Ref!.current!.value = home["text_11"];
        home12Ref!.current!.value = home["text_12"];
        home13Ref!.current!.value = home["text_13"];
        home14Ref!.current!.value = home["text_14"];
        home15Ref!.current!.value = home["text_15"];
        home16Ref!.current!.value = home["text_16"];
        home17Ref!.current!.value = home["text_17"];
        home18Ref!.current!.value = home["text_18"];
        home19Ref!.current!.value = home["text_19"];
        home20Ref!.current!.value = home["text_20"];
        home21Ref!.current!.value = home["text_21"];
        home22Ref!.current!.value = home["text_22"];
        home23Ref!.current!.value = home["text_23"];
        home24Ref!.current!.value = home["text_24"];
    }, []);

    const submit = async () => {
        const userdata = await axios({
            method: "post",
            url: `${BaseUrl}/api/edit-home`,
            data: {
                update: {
                    text_1: home1Ref!.current!.value,
                    text_2: home2Ref!.current!.value,
                    text_3: home3Ref!.current!.value,
                    text_4: home4Ref!.current!.value,
                    text_5: home5Ref!.current!.value,
                    text_6: home6Ref!.current!.value,
                    text_7: home7Ref!.current!.value,
                    text_8: home8Ref!.current!.value,
                    text_9: home9Ref!.current!.value,
                    text_10: home10Ref!.current!.value,
                    text_11: home11Ref!.current!.value,
                    text_12: home12Ref!.current!.value,
                    text_13: home13Ref!.current!.value,
                    text_14: home14Ref!.current!.value,
                    text_15: home15Ref!.current!.value,
                    text_16: home16Ref!.current!.value,
                    text_17: home17Ref!.current!.value,
                    text_18: home18Ref!.current!.value,
                    text_19: home19Ref!.current!.value,
                    text_20: home20Ref!.current!.value,
                    text_21: home21Ref!.current!.value,
                    text_22: home22Ref!.current!.value,
                    text_23: home23Ref!.current!.value,
                    text_24: home24Ref!.current!.value,
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
     * Renders a form for editing the home page content.
     * @param {React.RefObject} home1Ref - A reference to the input element for editing home1.
     * @param {React.RefObject} home2Ref - A reference to the textarea element for editing home2.
     * @param {React.RefObject} home3Ref - A reference to the input element for editing home3.
     * @param {React.RefObject} home4Ref - A reference to the input element for editing home4.
     * @param {React.RefObject} home5Ref - A reference to the textarea element for editing home5.
     * @param {React.RefObject} home6Ref - A reference to the textarea element for editing home6.
     */
    return (
        <div className="grow bg-[#1b2028] my-2 rounded-md p-4 w-full">
            <h1 className="text-white font-medium text-xl">Edit Home Page</h1>
            <div className="w-full bg-slate-400 h-[1px] my-2"></div>
            <input
                ref={home1Ref}
                className="p-2 w-96 outline-none bg-transparent text-white border-2 border-white block my-4 rounded-md"
            />
            <textarea
                ref={home2Ref}
                className="p-2 w-96 outline-none bg-transparent text-white border-2 border-white block my-4 rounded-md resize-none h-32"
            ></textarea>
            <h1 className="text-white font-medium text-xl">Edit relationships</h1>
            <div className="w-full bg-slate-400 h-[1px] my-2"></div>
            <input
                ref={home3Ref}
                className="p-2 w-96 outline-none bg-transparent text-white border-2 border-white block my-4 rounded-md"
            />
            <input
                ref={home4Ref}
                className="p-2 w-96 outline-none bg-transparent text-white border-2 border-white block my-4 rounded-md"
            />
            <textarea
                ref={home5Ref}
                className="p-2 w-96 outline-none bg-transparent text-white border-2 border-white block my-4 rounded-md resize-none h-32"
            ></textarea>

            <h1 className="text-white font-medium text-xl">Edit marketing platform</h1>
            <div className="w-full bg-slate-400 h-[1px] my-2"></div>
            <textarea
                ref={home6Ref}
                className="p-2 w-96 outline-none bg-transparent text-white border-2 border-white block my-4 rounded-md resize-none h-32"
            ></textarea>
            <textarea
                ref={home7Ref}
                className="p-2 w-96 outline-none bg-transparent text-white border-2 border-white block my-4 rounded-md resize-none h-32"
            ></textarea>
            <textarea
                ref={home8Ref}
                className="p-2 w-96 outline-none bg-transparent text-white border-2 border-white block my-4 rounded-md resize-none h-32"
            ></textarea>
            <textarea
                ref={home9Ref}
                className="p-2 w-96 outline-none bg-transparent text-white border-2 border-white block my-4 rounded-md resize-none h-32"
            ></textarea>
            <textarea
                ref={home10Ref}
                className="p-2 w-96 outline-none bg-transparent text-white border-2 border-white block my-4 rounded-md resize-none h-32"
            ></textarea>
            <h1 className="text-white font-medium text-xl">Edit explore by category</h1>
            <div className="w-full bg-slate-400 h-[1px] my-2"></div>
            <textarea
                ref={home11Ref}
                className="p-2 w-96 outline-none bg-transparent text-white border-2 border-white block my-4 rounded-md resize-none h-32"
            ></textarea>
            <textarea
                ref={home12Ref}
                className="p-2 w-96 outline-none bg-transparent text-white border-2 border-white block my-4 rounded-md resize-none h-32"
            ></textarea>
            <textarea
                ref={home13Ref}
                className="p-2 w-96 outline-none bg-transparent text-white border-2 border-white block my-4 rounded-md resize-none h-32"
            ></textarea>
            <textarea
                ref={home14Ref}
                className="p-2 w-96 outline-none bg-transparent text-white border-2 border-white block my-4 rounded-md resize-none h-32"
            ></textarea>
            <textarea
                ref={home15Ref}
                className="p-2 w-96 outline-none bg-transparent text-white border-2 border-white block my-4 rounded-md resize-none h-32"
            ></textarea>
            <textarea
                ref={home16Ref}
                className="p-2 w-96 outline-none bg-transparent text-white border-2 border-white block my-4 rounded-md resize-none h-32"
            ></textarea>
            <textarea
                ref={home17Ref}
                className="p-2 w-96 outline-none bg-transparent text-white border-2 border-white block my-4 rounded-md resize-none h-32"
            ></textarea>
            <textarea
                ref={home18Ref}
                className="p-2 w-96 outline-none bg-transparent text-white border-2 border-white block my-4 rounded-md resize-none h-32"
            ></textarea>
            <h1 className="text-white font-medium text-xl">Edit influencer marketing</h1>
            <div className="w-full bg-slate-400 h-[1px] my-2"></div>
            <input
                ref={home19Ref}
                className="p-2 w-96 outline-none bg-transparent text-white border-2 border-white block my-4 rounded-md"
            />
            <input
                ref={home20Ref}
                className="p-2 w-96 outline-none bg-transparent text-white border-2 border-white block my-4 rounded-md"
            />
            <textarea
                ref={home21Ref}
                className="p-2 w-96 outline-none bg-transparent text-white border-2 border-white block my-4 rounded-md resize-none h-32"
            ></textarea>
            <textarea
                ref={home22Ref}
                className="p-2 w-96 outline-none bg-transparent text-white border-2 border-white block my-4 rounded-md resize-none h-32"
            ></textarea>
            <textarea
                ref={home23Ref}
                className="p-2 w-96 outline-none bg-transparent text-white border-2 border-white block my-4 rounded-md resize-none h-32"
            ></textarea>
            <textarea
                ref={home24Ref}
                className="p-2 w-96 outline-none bg-transparent text-white border-2 border-white block my-4 rounded-md resize-none h-32"
            ></textarea>

            {error == "" || error == null || error == undefined ? null : (
                <NOTICEAlerts message={error}></NOTICEAlerts>
            )}
            <button className="text-white py-2 px-4 rounded-md bg-cyan-500 w-96 text-center" onClick={submit}>UPDATE</button>
        </div>
    );
};

export default Home;
