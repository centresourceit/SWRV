import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { useEffect, useState } from "react";
import { BaseUrl } from "~/const";
import NotificationStore from "~/state/home/notification";
import { longtext } from "~/utils";

/**
 * Represents the properties of a notification.
 */
interface NotificationProps {
    userid: string;
}

/**
 * A functional component that renders a notification panel.
 * @param {NotificationProps} props - The props for the Notification component.
 * @returns {JSX.Element} - The rendered notification panel.
 */
const Notification: React.FC<NotificationProps> = (props: NotificationProps): JSX.Element => {
    const open = NotificationStore((state) => state.isOpen)
    const change = NotificationStore((state) => state.change)

    const [notification, setNotification] = useState<any[]>([]);


    const init = async () => {
        let req = {
            search: {
                status: 3,
                influencer: props.userid
            }
        };
        const responseData = await axios.post(
            `${BaseUrl}/api/search-draft`,
            req
        );
        if (responseData.data.status) {
            setNotification(val => responseData.data.data)
        }
    };

    useEffect(() => {
        init();
    }, []);


    /**
     * Renders a notification component based on the length of the notification array.
     * If the notification array is empty, it renders a "No New Notifications" message.
     * If the notification array is not empty, it renders a list of notifications.
     * @param {Array} notification - The array of notifications to render.
     * @param {boolean} open - A boolean indicating whether the notification component is open or not.
     * @param {function} change - A function to change the state of the notification component.
     * @returns The rendered notification component.
     */
    return (
        <>
            {notification.length == 0 ?
                <div className={`${open ? "block" : "hidden"} absolute w-72 h-16 top-0 right-0 translate-y-16 px-3 py-2 bg-white rounded-xl shadow-xl overflow-y-scroll no-scrollbar`}>
                    <div className="flex w-full my-2">
                        <div className="grow">
                            <p className="text-rose-500 font-normal text-center text-sm rounded-md py-1">No New Notifications</p>
                        </div>
                        <FontAwesomeIcon icon={faXmark} className="text-xl font-semibold cursor-pointer" onClick={() => change(false)}></FontAwesomeIcon>
                    </div>
                </div>
                : <div className={`${open ? "block" : "hidden"} absolute w-72 h-36 top-0 right-0 translate-y-16 px-3 py-2 bg-white rounded-xl shadow-xl overflow-y-scroll no-scrollbar`}>
                    <div className="flex w-full">
                        <div className="grow"></div>
                        <FontAwesomeIcon icon={faXmark} className="text-xl font-semibold cursor-pointer" onClick={() => change(false)}></FontAwesomeIcon>
                    </div>
                    {
                        notification.map((val: any, index: number) => <div key={index}><NotificationTab image={val.brand.logo} title={val.influencer.name} description={`Your campaign draft request is ${val.status.name}.`}></NotificationTab></div>)
                    }
                </div>}


        </>
    );
}


/**
 * Represents a notification component.
 */
export default Notification;

interface NotificationTabProps {
    image: string;
    title: string;
    description: string;
}

/**
 * A functional component that represents a notification tab.
 * @param {NotificationTabProps} props - The props for the notification tab.
 * @returns {JSX.Element} - The rendered notification tab.
 */
const NotificationTab: React.FC<NotificationTabProps> = (props: NotificationTabProps): JSX.Element => {


    /**
     * Renders a card component with an image, title, and description.
     * @param {Object} props - The props object containing the image, title, and description.
     * @returns {JSX.Element} - The rendered card component.
     */
    return (
        <>
            <div className="w-full border-b-2 border-gray-400 flex py-2">
                <div className="mr-4">
                    <img src={props.image} alt="error" className="w-14 h-14 rounded-lg shrink-0 object-cover object-center" />
                </div>
                <div>
                    <p className="text-gray-500 font-medium cusfont text-sm leading-normal w-40">
                        {longtext(props.title, 18)}
                    </p>
                    <p className="text-gray-500 font-normal text-xs leading-normal w-40">
                        {props.description}
                    </p>
                </div>
            </div>

        </>
    );
}