import { Link } from "@remix-run/react";
import { CusButton } from "./buttont";
import { useEffect, useState } from "react";
import { longtext } from "~/utils";
import SideBarStore from "~/state/home/sidebarstate";

/**
 * Represents the properties of a campaign card.
 * @typedef {Object} CampaginCardProps
 * @property {string} id - The unique identifier of the campaign card.
 * @property {string} title - The title of the campaign.
 * @property {string} image - The URL of the image associated with the campaign.
 * @property {string} name - The name of the campaign.
 * @property {string} category - The category of the campaign.
 * @property {string} currency - The currency used for the campaign.
 * @property {string} maxval - The maximum value of the campaign.
 * @property {string[]} platforms - The platforms supported by the campaign.
 * @property {string}
 */
type CampaginCardProps = {
  id: string;
  title: string;
  image: string;
  name: string;
  category: string;
  currency: string;
  maxval: string;
  platforms: string[];
  weburl: string;
  btntext: string;
};

/**
 * A component that represents a campaign card.
 * @param {CampaginCardProps} props - The props for the campaign card.
 * @returns A JSX element representing the campaign card.
 */
export const CampaginCard = (props: CampaginCardProps) => {
  const [color, setColor] = useState<string>("text-cyan-500");
  useEffect(() => {
    if (props.category == "Unboxing") {
      setColor("text-cyan-500");
    } else if (props.category == "Paid Promotion") {
      setColor("text-rose-500");
    } else if (props.category == "Revealing") {
      setColor("text-green-500");
    } else if (props.category == "Sponsored") {
      setColor("text-indigo-500");
    } else if (props.category == "Campaign") {
      setColor("text-yellow-500");
    } else if (props.category == "Bidding") {
      setColor("text-blue-500");
    }
  }, []);
  return (
    <>
      <div className="bg-white rounded-xl shadow-[0_0_4px_0_rgb(0,0,0,0.3)] p-4 h-full w-60 md:w-auto">
        <div className="flex items-end gap-x-2">
          <div className="shrink-0">
            <img
              src={props.image}
              alt="error"
              className="object-cover w-16 h-16 rounded"
            />
          </div>
          <div className="grow h-full">
            <p className={`font-semibold cusfont text-[0.8rem] text-left text-black`}>
              {props.name}
            </p>
          </div>
        </div>
        <p className="text-black font-semibold text-md text-left mt-2">
          {longtext(props.title, 20)}
        </p>
        <p className="text-black  text-[0.8rem] content-end font-normal text-left">
          Budget: <span className="translate-y-[0.02rem] inline-block"></span><span className="font-semibold cusfont">{props.maxval} USD</span>
        </p>
        <p className={`text-black font-normal text-xs text-left mt-3`}>
          Category : {props.category}
        </p>
        <p className="text-black font-normal text-xs text-left">
          {props.weburl}
        </p>
        <div className="h-[1px] bg-gray-600 w-full my-3"></div>

        <p className="text-black font-semibold text-sm mb-2 text-left">Platform</p>
        <div className="flex items-left flex-wrap mb-4">
          {props.platforms.slice(0, 4).map((val: any, index: number) => {
            return (
              <div
                key={index}
                className="p-1 mx-[0.1rem] shrink-0 border-2 border-blue-500 rounded-full"
              >
                <img src={val} alt="error" className="rounded-full w-6 h-6" />
              </div>
            );
          })}
          {props.platforms.length > 4 ?
            <div className="w-8 h-8 rounded-full bg-[#eeeeee] text-black font-medium grid place-items-center text-center text-sm">
              +{props.platforms.length - 4}
            </div>
            : null}

        </div>
        <Link to={`/home/campaigns/${props.id}`} className="text-sm text-center text-black font-semibold cusfont rounded-lg bg-[#fbca8e] inline-block w-full py-2">
          {props.btntext}
        </Link>
      </div>
    </>
  );
};



/**
 * Represents the properties of a campaign card component.
 * @typedef {Object} MyCampaginCardProps
 * @property {string} id - The unique identifier of the campaign.
 * @property {string} title - The title of the campaign.
 * @property {string} image - The URL of the campaign image.
 * @property {string} name - The name of the campaign.
 * @property {string} category - The category of the campaign.
 * @property {string} currency - The currency used for the campaign.
 * @property {string} maxval - The maximum value of the campaign.
 * @property {string[]} platforms - The platforms where the campaign is available.
 * @property {string} web
 */
type MyCampaginCardProps = {
  id: string;
  title: string;
  image: string;
  name: string;
  category: string;
  currency: string;
  maxval: string;
  platforms: string[];
  weburl: string;
  btntext: string;
  startAt: string;
  endAt: string;
};

/**
 * A React functional component that represents a campaign card.
 * @param {MyCampaginCardProps} props - The props for the component.
 * @returns The rendered campaign card component.
 */
export const MyCampaginCard: React.FC<MyCampaginCardProps> = (props: MyCampaginCardProps) => {

  const isOpen = SideBarStore((state) => state.isOpen);

  const [color, setColor] = useState<string>("text-cyan-500");
  useEffect(() => {
    if (props.category == "Unboxing") {
      setColor("text-cyan-500");
    } else if (props.category == "Paid Promotion") {
      setColor("text-rose-500");
    } else if (props.category == "Revealing") {
      setColor("text-green-500");
    } else if (props.category == "Sponsored") {
      setColor("text-indigo-500");
    } else if (props.category == "Campaign") {
      setColor("text-yellow-500");
    } else if (props.category == "Bidding") {
      setColor("text-blue-500");
    }
  }, []);
  return (
    <>
      <div className={`bg-white rounded-xl shadow-xl p-3 my-2 h-full`}>
        <div className="flex items-center gap-x-2">
          <div className="shrink-0">
            <img
              src={props.image}
              alt="error"
              className="object-cover w-16 h-16 rounded"
            />
          </div>
          <div className="grow h-full">
            <p className={`font-semibold cusfont text-[0.8rem] text-left text-black mb-2`}>
              {props.category}
            </p>
            <p className="text-black  text-[0.8rem] content-end font-normal text-left">
              Budget: <span className="translate-y-[0.02rem] inline-block">$</span><span className="font-semibold cusfont">{props.maxval}/Post</span>
            </p>
          </div>
        </div>
        <p className="text-black font-semibold text-md text-left my-4 cusfont">
          {longtext(props.title, 20)}
        </p>

        <p className="text-black font-semibold text-sm my-2 text-left">Channels</p>
        <div className="flex items-left flex-wrap">
          {props.platforms.map((val: any, index: number) => {
            return (
              <div
                key={index}
                className="p-1 mx-[0.1rem] shrink-0 border-2 border-blue-500 rounded-full"
              >
                <img src={val} alt="error" className="rounded-full w-6 h-6" />
              </div>
            );
          })}
        </div>

        <div className="rounded-md py-2 flex justify-around bg-[#eeeeee] my-4">
          <div>
            <p className="text-center text-sm font-semibold">{new Date(props.startAt).toLocaleDateString()}</p>
            <p className="text-center text-xs font-normal">Start Date</p>
          </div>
          <div className="h-10 w-[1px] bg-slate-900"></div>
          <div>
            <p className="text-center text-sm font-semibold">{new Date(props.endAt).toLocaleDateString()}</p>
            <p className="text-center text-xs font-normal">End Date</p>
          </div>
        </div>
        <Link to={`/home/campaigns/${props.id}`} className="cusfont font-medium text-black w-full my-1 rounded-md bg-[#fbca8e] text-center inline-block py-2">
          View Campaign
        </Link>
      </div>
    </>
  );
};
