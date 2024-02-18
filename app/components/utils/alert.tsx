import { faXmark } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Link } from "@remix-run/react";
import axios from "axios";
import { getMultiFactorResolver } from "firebase/auth";
import { useEffect, useState } from "react";
import { BaseUrl } from "~/const";

interface ConAlertProps {
    email: string;
    userid: string;
}

export const ConAlert: React.FC<ConAlertProps> = (props: ConAlertProps): JSX.Element => {

    const [error, setError] = useState<string | null>(null);
    const [sus, setSus] = useState<string | null>(null);
    const [isSending, seIsSending] = useState<boolean>(false);
    /**
     * Sends a verification email to the user.
     * @returns None
     */
    const sendmain = async () => {
        setError(val => null);
        setSus(val => null);
        seIsSending(true);
        const sendverificationmail = await axios({
            method: "post",
            url: `${BaseUrl}/api/send-otp`,
            data: { userId: props.userid },
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
    /**
     * Renders a congratulatory message and confirmation email details after successful account creation.
     * @param {string} props.email - The email address to which the confirmation link was sent.
     * @param {boolean} isSending - Indicates whether the confirmation email is currently being sent.
     * @param {function} sendmain - Function to resend the confirmation email.
     * @param {string} error - Error message, if any, to display.
     * @param {string} sus - Success message, if any, to display.
     * @returns JSX elements representing the congratulatory message and confirmation email details.
     */
    return (
        <><div>

            <div className="rounded-2xl bg-primary flex p-4 w-[800px]">
                <div className="p-4">
                    <img src="/images/icons/confetti.png" alt="errro" className="w-60" />
                </div>
                <div className="py-8 grow">
                    <h1 className="text-white font-semibold text-2xl text-left">Congratulations!</h1>
                    <p className="text-white font-normal text-xl text-left">Your account has been created and confirmation link was sent to an <span className="font-semibold">email {props.email}</span> </p>
                    <p className="text-white font-normal text-xl text-left">Can't find a confirmation email? {isSending ? <span className="pl-2 font-semibold">Sending...</span> : <button onClick={sendmain} className="pl-2 font-semibold">Resend Email</button>}</p>
                </div>
                <Link to={"/home"}> <FontAwesomeIcon className="text-white text-2xl font-bold" icon={faXmark}></FontAwesomeIcon> </Link>
            </div>
            <div className="grid place-items-center my-3">
                {error == "" || error == null || error == undefined ? null : (
                    <NOTICEAlerts message={error}></NOTICEAlerts>

                )}

                {sus == "" || sus == null || sus == undefined ? null : (
                    <SUCCESSAlerts message={sus}></SUCCESSAlerts>
                )}
            </div>
        </div>
        </>
    );
}


export enum InfoAlerts {
    INFO,
    WARNING,
    SUCCESS,
    ERROR
}


interface infoAlertsProps {
    message: string;
    type: InfoAlerts;
    isclose?: boolean;
    color: string;
}

const CusAlerts: React.FC<infoAlertsProps> = (props: infoAlertsProps): JSX.Element => {
    const [isOpen, setIsOpen] = useState<boolean>(true);

    /**
     * Returns the color code based on the type of info alert.
     * @returns {string} - The color code in hexadecimal format.
     */
    const getColorCode = (): string => {
        switch (props.type) {
            case InfoAlerts.INFO:
                return "#01fff4";
            case InfoAlerts.WARNING:
                return "#f7951e";
            case InfoAlerts.SUCCESS:
                return "#7cff01";
            case InfoAlerts.ERROR:
                return "#ff1177";
            default:
                return "#ff1177";
        }
    }
    /**
     * Returns the title based on the type of info alert.
     * @returns {string} - The title of the info alert.
     */
    const getTitle = (): string => {
        switch (props.type) {
            case InfoAlerts.INFO:
                return "Did you know";
            case InfoAlerts.WARNING:
                return "Warning";
            case InfoAlerts.SUCCESS:
                return "Congratulations!";
            case InfoAlerts.ERROR:
                return "Someting want wrong!";
            default:
                return "Someting want wrong!";
        }
    }
    /**
     * Returns the URL of an image based on the type of info alert.
     * @returns {string} The URL of the image.
     */
    const getImageUrl = (): string => {
        switch (props.type) {
            case InfoAlerts.INFO:
                return "/images/icons/info.png";
            case InfoAlerts.WARNING:
                return "/images/icons/warning.png";
            case InfoAlerts.SUCCESS:
                return "/images/icons/success.png";
            case InfoAlerts.ERROR:
                return "/images/icons/error.png";
            default:
                return "/images/icons/error.png";
        }
    }


    /**
     * Renders a notification component with dynamic content.
     * @param {boolean} isOpen - Determines whether the notification is open or closed.
     * @param {string} props.color - The color of the border.
     * @param {string} props.message - The message to display in the notification.
     * @param {boolean} props.isclose - Determines whether the close button is displayed.
     * @returns {JSX.Element} - The rendered notification component.
     */
    if (isOpen) return (
        <>
            <div className={`w-full flex gap-4 p-4 items-center bg-[#7cff01] bg-opacity-20 rounded-lg border-2 border-[${props.color}]`}>
                <div className="w-10 h-10 rounded-md grid place-items-center bg-white">
                    <img src={getImageUrl()} alt="icon" className="w-full h-full object-cover object-center rounded-md" />
                </div>
                <div className="grow">
                    <h1 className="text-left font-medium cusfont text-lg text-black">{getTitle()}</h1>
                    <p className="text-left font-normal cusfont text-sm text-black">{props.message}</p>
                </div>
                {props.isclose ?
                    <div className="w-10 h-10 rounded-md grid place-items-center p-2 bg-white shadow-lg" onClick={() => setIsOpen(false)}>
                        <FontAwesomeIcon icon={faXmark} className="font-semibold text-2xl text-black"></FontAwesomeIcon>
                    </div>
                    : null}
            </div>
        </>
    );
    return <></>
}


export { CusAlerts }


interface alertsProps {
    message: string;
    isclose?: boolean;
}

/**
 * A React functional component that renders an error alert.
 * @param {alertsProps} props - The props object containing the necessary data for rendering the alert.
 * @returns {JSX.Element} - The JSX element representing the error alert.
 */
const ERRORAlerts: React.FC<alertsProps> = (props: alertsProps): JSX.Element => {
    const [isOpen, setIsOpen] = useState<boolean>(true);
    if (isOpen) return (
        <>
            <div className={`my-2 w-full flex gap-6 p-4 items-center bg-[#ff1177] bg-opacity-20 rounded-lg border-2 border-[#ff1177]`}>
                <div className="w-10 h-10 rounded-md grid place-items-center bg-white">
                    <img src="/images/icons/error.png" alt="icon" className="w-full h-full object-cover object-center rounded-md" />
                </div>
                <div className="grow">
                    <h1 className="text-left font-medium cusfont text-lg text-black">Somethng went wrong!</h1>
                    <p className="text-left font-normal cusfont text-sm text-black">{props.message}</p>
                </div>
                {props.isclose ?
                    <div className="w-10 h-10 rounded-md grid place-items-center p-2 bg-white shadow-lg" onClick={() => setIsOpen(false)}>
                        <FontAwesomeIcon icon={faXmark} className="font-semibold text-2xl text-black"></FontAwesomeIcon>
                    </div>
                    : null}
            </div>
        </>
    );
    return <></>
}
/**
 * A React functional component that renders a notice alert.
 * @param {alertsProps} props - The props object containing the necessary data for rendering the alert.
 * @returns {JSX.Element} - The JSX element representing the notice alert.
 */
const NOTICEAlerts: React.FC<alertsProps> = (props: alertsProps): JSX.Element => {
    const [isOpen, setIsOpen] = useState<boolean>(true);
    if (isOpen) return (
        <div className={`my-2 w-full flex gap-6 p-4 items-center bg-[#f7951e] bg-opacity-20  rounded-lg border-2 border-[#f7951e]`}>
            <div className="w-10 h-10 rounded-md grid place-items-center shrink-0">
                <img src="/images/icons/warning.png" alt="icon" className="w-full h-full object-cover object-center rounded-md" />
            </div>
            <div className="grow">
                <h1 className="text-left font-medium cusfont text-lg text-black">Notice</h1>
                <p className="text-left font-normal cusfont text-sm text-black">{props.message}</p>
            </div>
            {props.isclose ?
                <div className="w-10 h-10 rounded-md grid place-items-center p-2 bg-white shadow-lg" onClick={() => setIsOpen(false)}>
                    <FontAwesomeIcon icon={faXmark} className="font-semibold text-2xl text-black"></FontAwesomeIcon>
                </div>
                : null}
        </div>
    );
    return <></>
}


/**
 * A React functional component that renders an informational alert.
 * @param {alertsProps} props - The props object containing the necessary data for rendering the alert.
 * @returns {JSX.Element} - The JSX element representing the informational alert.
 */
const INFOAlerts: React.FC<alertsProps> = (props: alertsProps): JSX.Element => {
    const [isOpen, setIsOpen] = useState<boolean>(true);
    if (isOpen) return (
        <>
            <div className={`my-2 w-full flex gap-6 p-4 items-center bg-[#01fff4] bg-opacity-20 rounded-lg border-2 border-[#01fff4]`}>
                <div className="w-10 h-10 rounded-md grid place-items-center bg-white shrink-0">
                    <img src="/images/icons/info.png" alt="icon" className="w-full h-full object-cover object-center rounded-md" />
                </div>
                <div className="grow">
                    <h1 className="text-left font-medium cusfont text-lg text-black">Did you know</h1>
                    <p className="text-left font-normal cusfont text-sm text-black">{props.message}</p>
                </div>
                {props.isclose ?
                    <div className="w-10 h-10 rounded-md grid place-items-center p-2 bg-white shadow-lg" onClick={() => setIsOpen(false)}>
                        <FontAwesomeIcon icon={faXmark} className="font-semibold text-2xl text-black"></FontAwesomeIcon>
                    </div>
                    : null}
            </div>
        </>
    );
    return <></>
}
/**
 * A React functional component that renders a success alert.
 * @param {alertsProps} props - The props object containing the necessary data for rendering the alert.
 * @returns {JSX.Element} - The JSX element representing the success alert.
 */
const SUCCESSAlerts: React.FC<alertsProps> = (props: alertsProps): JSX.Element => {
    const [isOpen, setIsOpen] = useState<boolean>(true);
    if (isOpen) return (
        <>
            <div className={`my-2 w-full flex gap-6 p-4 items-center bg-[#7cff01] bg-opacity-20 rounded-lg border-2 border-[#7cff01]`}>
                <div className="w-10 h-10 rounded-md grid place-items-center bg-white shrink-0">
                    <img src="/images/icons/success.png" alt="icon" className="w-full h-full object-cover object-center rounded-md" />
                </div>
                <div className="grow">
                    <h1 className="text-left font-medium cusfont text-lg text-black">Congratulations!</h1>
                    <p className="text-left font-normal cusfont text-sm text-black">{props.message}</p>
                </div>
                {props.isclose ?
                    <div className="w-10 h-10 rounded-md grid place-items-center p-2 bg-white shadow-lg" onClick={() => setIsOpen(false)}>
                        <FontAwesomeIcon icon={faXmark} className="font-semibold text-2xl text-black"></FontAwesomeIcon>
                    </div>
                    : null}
            </div>
        </>
    );
    return <></>
}


export { INFOAlerts, NOTICEAlerts, ERRORAlerts, SUCCESSAlerts }
