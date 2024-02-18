import { Link } from "@remix-run/react";
import { CusButton } from "./buttont";
import SideBarStore from "~/state/home/sidebarstate";
import { IcRoundStar } from "../icons";

/**
 * Represents the properties of an influencer card component.
 */
type InfluencerCardProps = {
  image: string;
  name: string;
  star: number;
  id: string;
  bio: string;
};
/**
 * Represents the properties of an influencer card component.
 */

const InfluencerCard = (props: InfluencerCardProps) => {

  /**
   * Truncates the given text if it exceeds 100 characters.
   * @param {string} text - The text to truncate.
   * @returns {string} The truncated text.
   */
  function truncateText(text: string) {
    if (text.length > 100) {
      return text.substring(0, 100) + "...";
    }
    return text;
  }
  /**
   * Renders a star rating component based on the given star value.
   * @returns The rendered star rating component.
   */
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

  const isOpen = SideBarStore((state) => state.isOpen);

  return (
    <>
      <div className={`bg-white flex flex-col rounded-xl shadow-xl my-2 h-full`}>
        <img
          src={props.image}
          alt="error"
          className="w-full h-40 object-cover rounded-t-md"
        />
        <div className="px-4 pb-2 flex flex-col grow">
          <p className="text-black font-semibold text-lg text-left mt-2">
            {props.name == undefined || props.name == null ? "" : props.name.split("@")[0]}
          </p>
          <p className="text-black font-semibold text-sm text-left mt-2">
            {truncateText(props.bio)}
          </p>
          <div className="grow"></div>
          <div className="flex my-4">
            <Star></Star>
          </div>
          <Link to={`/home/myuser/${props.id}`}>
            <CusButton
              text="View Profile"
              textColor={"text-black"}
              background={"bg-[#01FFF4]"}
              width={"w-full"}
              margin={"my-2"}
              fontwidth={"font-bold"}
            ></CusButton>
          </Link>
        </div>
      </div>
    </>
  );
};

export default InfluencerCard;
