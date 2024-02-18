import axios from "axios";
import { CusButton } from "../utils/buttont";
import { useRef, useState } from "react";
import { BaseUrl } from "~/const";
import { NOTICEAlerts, SUCCESSAlerts } from "../utils/alert";

interface DisputePageProps {
    userid: string;
}

const DisputePage: React.FC<DisputePageProps> = (props: DisputePageProps) => {
    const [error, setError] = useState<string | null>(null);
    const [sus, setSus] = useState<string | null>(null);
    const messageRef = useRef<HTMLTextAreaElement>(null);
    const nameRef = useRef<HTMLInputElement>(null);
    const numberRef = useRef<HTMLInputElement>(null);

    /**
     * Submits a form with user input data to the server.
     * @returns None
     */
    const submit = async () => {
        setError(null);
        setSus(null);

        if (
            nameRef.current?.value == null ||
            nameRef.current?.value == undefined ||
            nameRef.current?.value == ""
        ) {
            setError("Enter your name.");
        } else if (
            numberRef.current?.value == null ||
            numberRef.current?.value == undefined ||
            numberRef.current?.value == ""
        ) {
            setError("Enter you contact number.");
        } else if (
            messageRef.current?.value == null ||
            messageRef.current?.value == undefined ||
            messageRef.current?.value == ""
        ) {
            setError("Enter your message.");
        } else {
            const req = {
                isBrand: 0,
                message: messageRef.current?.value,
                number: numberRef.current?.value,
                name: nameRef.current?.value,
                type: "1",
                userId: props.userid
            };
            const data = await axios({
                method: "post",
                url: `${BaseUrl}/api/add-dispute`,
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
                return setError(data.data.message);
            } else {
                setError(null);
                setSus("Message sent!");
                nameRef!.current!.value = "";
                numberRef!.current!.value = "";
                messageRef!.current!.value = "";
            }

        }
    }
    /**
     * Renders a contact form with input fields for name, phone number, and message.
     * @returns JSX element representing the contact form.
     */
    return (
        <>
            <div className="w-full px-6 sm:px-16">
                <div className="bg-[#EFEFEF] rounded-2xl sm:p-0 p-4">
                    <div className="w-full md:w-3/5 lg:w-4/6 mx-auto mb-10  py-10 ">
                        <h1 className="text-5xl font-bold text-primary flex">
                            Love to hear from you
                        </h1>
                        <h1 className="text-5xl  font-bold text-primary flex">
                            Get in touch <img src="./images/icons/hand.png" alt="error" />
                        </h1>
                        <div className="bg-white p-6 rounded-2xl my-10 shadow-xl">
                            <div className="flex">
                                <div className="grow">
                                    <h2 className="text-left text-md font-semibold text-primary py-2">
                                        Your Name
                                    </h2>
                                    <input ref={nameRef} type={"text"} className="outline-none border-2 border-gray-300 focus:border-gray-300 rounded-md w-full p-2" placeholder="Enter your name" />
                                </div>
                                <div className="w-10"></div>
                                <div className="grow">
                                    <h2 className="text-left text-md font-semibold text-primary py-2">
                                        Phone
                                    </h2>
                                    <input ref={numberRef} type={"text"} className="outline-none border-2 border-gray-300 focus:border-gray-300 rounded-md w-full p-2" placeholder="Enter your phone number" />
                                </div>
                            </div>
                            <h2 className="text-left text-md font-semibold text-primary py-2">
                                Message
                            </h2>
                            <textarea ref={messageRef} className="p-4 w-full h-60 outline-none border-2 border-gray-300 focus:border-gray-300 rounded-md resize-none" placeholder="your message" ></textarea>
                            <div onClick={submit}>
                                <CusButton text="Send Message" background="bg-primary"></CusButton>
                            </div>
                            {error == "" || error == null || error == undefined ? null : (
                                <NOTICEAlerts message={error}></NOTICEAlerts>

                            )}
                            {sus == "" || sus == null || sus == undefined ? null : (
                                <SUCCESSAlerts message={sus}></SUCCESSAlerts>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
export default DisputePage;