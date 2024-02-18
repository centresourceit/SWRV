import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { formatNumber, longtext } from "~/utils";
import SideBarStore from "~/state/home/sidebarstate";
import { IcRoundStar } from "../icons";


/**
 * Represents the properties of a top influencer card component.
 * @typedef {Object} TopInfluencerCardProps
 * @property {string} image - The URL of the influencer's image.
 * @property {string} name - The name of the influencer.
 * @property {number} star - The star rating of the influencer.
 * @property {string} dob - The date of birth of the influencer.
 * @property {string} currency - The currency symbol used by the influencer.
 * @property {string[]} platforms - The platforms on which the influencer is active.
 * @property {string} rating - The overall rating of the influencer.
 * @property {string} icon -
 */
type TopInfluencerCardProps = {
    image: string;
    name: string;
    star: number;
    dob: string;
    currency: string;
    platforms: string[];
    rating: string;
    icon: string;
    follower: string;
    post: string;
}
/**
 * A functional component that renders a top influencer card.
 * @param {TopInfluencerCardProps} props - The props object containing the necessary data for rendering the card.
 * @returns The JSX element representing the top influencer card.
 */
const TopInfluencerCard = (props: TopInfluencerCardProps) => {
    const isOpen = SideBarStore((state) => state.isOpen);

    const Star = () => {
        const fullStars = Math.floor(props.star);
        const fractionalStar = props.star - fullStars;
        const stars = [];

        for (let i = 0; i < fullStars; i++) {
            stars.push(
                <IcRoundStar
                    key={i}
                    className="text-xs text-pink-500" />
            );
        }
        if (fractionalStar > 0) {
            stars.push(
                <IcRoundStar
                    key={fullStars}
                    style={{ width: `${fractionalStar * 100}%` }}
                    className="text-xs text-pink-500" />
            );
        }
        for (let i = 0; i < 5 - fullStars; i++) {
            stars.push(
                <IcRoundStar
                    key={5 + i}
                    className="text-xs text-gray-300" />
            );
        }

        return <>{stars}</>;
    };

    const formatDate = (dateString: string) => {
        const months = [
            'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
        ];

        const date = new Date(dateString);
        const month = months[date.getMonth()];
        const day = date.getDate();
        const year = date.getFullYear();
        const formattedDate = `${month} ${day}, ${year}`;
        return formattedDate;
    }

    return (
        <>
            {/* <div className={`bg-white rounded-2xl shadow-xl ${isOpen ? "w-[15.5rem]" : "w-[18rem]"} my-2 flex flex-col`}> */}
            <div className={`bg-white rounded-2xl shadow-xl my-2 flex flex-col w-60 md:w-auto`}>
                <img src={props.image} alt="error" className="w-full h-40 object-cover rounded-t-2xl" />
                <div className="flex pl-4 -translate-y-5 ">
                    {props.platforms.map((val: string, index: number) => {
                        if (index == 0) {
                            return (<div key={index} className="border p-1 bg-white border-blue-500 rounded-full ">
                                <img src={val} alt="error" className="w-6 h-6 rounded-full" />
                            </div>);
                        } else {
                            return (<div key={index} className="border p-1 border-blue-500 bg-white rounded-full -ml-[0.50rem]">
                                <img src={val} alt="error" className="w-6 h-6 rounded-full" />
                            </div>);
                        }
                    })}
                </div>
                {props.platforms.length == 0 ? <div className="h-6"></div> : null}
                <div className=" px-4 pb-2 -translate-y-4">
                    <div className="flex my-2 justify-between items-center">
                        <div className="grow">
                            <p className="text-black text-sm text-left cusfont font-medium">{longtext(props.name.split("@")[0], 12)}</p>
                        </div>
                        <div>
                            <div className="flex">
                                <Star></Star>
                            </div>
                            {/* <p className="text-black font-bold  text-md text-right">3500 {props.currency}<br />
                                <span className="text-sm text-gray-600 font-normal">
                                    {props.dob == null || props.dob == undefined || props.dob == "" ? formatDate(new Date(new Date().setFullYear(new Date().getFullYear() - 18)).toString()) : formatDate(props.dob)}
                                </span>
                            </p> */}
                        </div>
                    </div>
                    <p className="text-gray-500 text-left text-xs font-normal mt-4">Top performing platform</p>
                    <div className="mt-1">
                        <div className="flex gap-3 items-center">
                            <div className=" p-2 rounded-md bg-[#eeeeee]">
                                <img src={props.icon} alt="error" className="w-8 h-8" />
                            </div>
                            <div className="grow rounded-md py-1 flex justify-around bg-[#f7f7f7]">
                                <div className="flex-1">
                                    <p className="text-center text-sm font-bold">{formatNumber(parseInt(props.follower))}</p>
                                    <p className="text-center text-xs font-normal">Followers</p>
                                </div>
                                <div className="h-10 w-[1px] bg-slate-900"></div>
                                <div className="flex-1" >
                                    <p className="text-center text-sm font-bold">{props.post}</p>
                                    <p className="text-center text-xs font-normal">Post</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-gray-200 text-center text-sm font-normal rounded-md py-2 mt-2">
                            <p>SWRV Rating :  <span className="font-bold">{parseInt(props.rating)}/100</span></p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default TopInfluencerCard;