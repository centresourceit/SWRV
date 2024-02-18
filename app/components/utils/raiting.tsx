import axios from "axios";
/**
 * Represents the properties of a marketing card component.
 * @typedef {Object} MarkatingCardProps
 * @property {string} imageUrl - The URL of the image to display on the card.
 * @property {string} title - The title of the card.
 * @property {string} description - The description of the card.
 * @property {boolean} leftBorder - Indicates whether the card should have a left border.
 */
import { useState } from "react";
import { Rating } from "react-simple-star-rating";
import { BaseUrl } from "~/const";
import { NOTICEAlerts } from "./alert";

/**
 * Represents the properties of a rating.
 * @interface RatingProps
 * @property {string} reviewType - The type of review.
 * @property {string} influencerId - The ID of the influencer.
 * @property {string} brandId - The ID of the brand.
 * @property {string} campaignId - The ID of the campaign.
 */
interface RatingProps {
  reviewType: string;
  influencerId: string;
  brandId: string;
  campaignId: string;
}
const MyRating: React.FC<RatingProps> = (props: RatingProps): JSX.Element => {
  const [crating, setCRating] = useState<number>(0);
  const [arating, setARating] = useState<number>(0);
  const [prating, setPRating] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  const handlecReset = (rate: number) => {
    setCRating(rate);
  };
  const handleaReset = (rate: number) => {
    setARating(rate);
  };
  const handlepReset = (rate: number) => {
    setPRating(rate);
  };

  /**
   * Submits a review to the server.
   * @returns None
   * @throws {Error} If the communication rating, approvals rating, or payments rating is 0.
   */
  const submit = async () => {
    if (crating == 0) {
      setError("Communication rating should be more then 0.");
    } else if (arating == 0) {
      setError("Approvals rating should be more then 0.");
    } else if (prating == 0) {
      setError("Payments rating should be more then 0.");
    } else {
      setError(null);

      const req = {
        influencerId: props.influencerId,
        brandId: props.brandId,
        campaignId: props.campaignId,
        rating1: crating.toString(),
        rating2: arating.toString(),
        rating3: prating.toString(),
        reviewType: props.reviewType,
        remark: "User To Brand",
      };

      const apireq = await axios({
        method: "post",
        url: `${BaseUrl}/api/add-review`,
        data: req,
      });
      if (apireq.data.status == false) {
        setError(apireq.data.message);
      } else {
        window.location.reload();
      }
    }
  };

  return (
    <>
      <div className="w-80 bg-white rounded-md px-6 py-2">
        <p className="text-xl text-gray-800 text-center font-semibold">
          Rate your Experience
        </p>
        <div className="h-[2px] bg-gray-400 w-full my-2"></div>
        <p className="text-lg font-semibold text-gray-600">Communication</p>
        <Rating
          initialValue={crating}
          onClick={handlecReset}
          size={35}
        ></Rating>
        <p className="text-lg font-semibold text-gray-600">Approvals</p>
        <Rating
          initialValue={arating}
          onClick={handleaReset}
          size={35}
        ></Rating>
        <p className="text-lg font-semibold text-gray-600">Payments</p>
        <Rating
          initialValue={prating}
          onClick={handlepReset}
          size={35}
        ></Rating>
        <div className="h-6"></div>
        {error == "" || error == null || error == undefined ? null : (
          <NOTICEAlerts message={error}></NOTICEAlerts>
        )}
        <button
          className="text-white bg-secondary rounded-md py-1 px-4 text-xl"
          onClick={submit}
        >
          SUBMIT
        </button>
      </div>
    </>
  );
};

export default MyRating;
