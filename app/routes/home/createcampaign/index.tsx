import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { json } from "@remix-run/node";
import { useLoaderData, useNavigate } from "@remix-run/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { BaseUrl } from "~/const";
import CreateCampaignStore from "~/state/campaign/createcampaign";

export const loader = async () => {
  const data = await axios.post(`${BaseUrl}/api/get-campaign-type`);
  return json({ data: data.data.data });
};

/**
 * Represents the first step of a multi-step form for creating a campaign.
 * @returns None
 */
const Step1 = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<boolean>(false);
  const data = useLoaderData();
  const catdata = data.data;
  const campaginType = CreateCampaignStore((state) => state.campaignTypeId);
  const setCampaginType = CreateCampaignStore(
    (state) => state.setCampaignTypeId
  );
  const [camptype, setCamptype] = useState<string>("0");

  const nextpage = () => {
    if (camptype === "0") {
      setError(true);
    } else if (camptype === "5" || camptype === "6") {
      setCampaginType(camptype);
      return navigate("/home/createcampaign/spbd");
    } else {
      setCampaginType(camptype);
      return navigate("/home/createcampaign/step2");
    }
  };

  useEffect(() => {
    setCamptype(campaginType);
  }, []);

  /**
   * Renders a list of categories with corresponding information and handles click events.
   * @param {boolean} error - Indicates whether an error message should be displayed.
   * @param {Array} catdata - An array of category data objects.
   * @param {function} setCamptype - A function to set the camp type.
   * @param {function} setError - A function to set the error state.
   * @param {function} setCampaginType - A function to set the campaign type.
   * @param {function} navigate - A function to navigate to a different page.
   * @returns JSX elements representing the rendered list of categories.
   */
  return (
    <>
      <div className="bg-white shadow-xl rounded-xl px-8 py-4 mt-4 w-full">
        {error ? (
          <div className="bg-red-500 bg-opacity-10 p-2 border-red-500 border rounded-xl flex items-center">
            <div className="pr-4">
              <FontAwesomeIcon
                className="text-red-500"
                icon={faInfoCircle}
              ></FontAwesomeIcon>
            </div>
            <h1 className="text-red-500 text-lg font-normal text-center">
              Please select at least one category.
            </h1>
          </div>
        ) : null}
        {/* <div className="flex items-center">
          <h1 className="text-black font-normal text-lg text-center">
            Select one below
          </h1>
          <div className="grow"></div>
          <div onClick={() => nextpage()}>
            {" "}
            <CusButton
              text="Next"
              textColor={"text-white"}
              background={"bg-primary"}
              fontwidth={"font-bold"}
            ></CusButton>
          </div>
        </div> */}
        <div className="grid xs:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 w-full">
          {catdata.map((val: unknown, i: number) => {
            return (
              <div
                key={i}
                className={`shadow-xl rounded-xl justify-between bg-white my-4 h-96 cursor-pointer`}
                onClick={() => {
                  setCamptype(catdata[i]["id"]);
                  if (catdata[i]["id"] === "0") {
                    setError(true);
                  } else if (catdata[i]["id"] === "5" || catdata[i]["id"] === "6") {
                    setCampaginType(catdata[i]["id"]);
                    return navigate("/home/createcampaign/spbd");
                  } else {
                    setCampaginType(catdata[i]["id"]);
                    return navigate("/home/createcampaign/step2");
                  }
                }}
              >
                <img
                  src={catdata[i]["categoryPicUrl"]}
                  alt="error"
                  className="rounded-t-xl w-full h-48 object-cover object-center"
                />
                <div className="p-6">
                  <h1 className="text-black text-left font-medium text-lg">
                    {catdata[i]["categoryName"]}
                  </h1>
                  <p className="text-sm text-gray-400 font-normal text-left mt-2">
                    {catdata[i]["categoryDescription"]}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};
export default Step1;
