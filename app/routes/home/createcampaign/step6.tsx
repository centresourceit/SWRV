import {
  faAdd,
  faCaretDown,
  faCheck,
  faPaperclip,
  faRemove,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { LoaderArgs, json } from "@remix-run/node";
import { Link, useLoaderData, useNavigate } from "@remix-run/react";
import axios from "axios";
import { useState } from "react";
import { NOTICEAlerts } from "~/components/utils/alert";
import { CusButton } from "~/components/utils/buttont";
import { BaseUrl, ModeshApi } from "~/const";
import { userPrefs } from "~/cookies";
import CreateCampaignStore from "~/state/campaign/createcampaign";
import { UploadFile } from "~/utils";

/**
 * Loader function that retrieves user preferences from a cookie header and returns
 * the user data as a JSON response.
 * @param {LoaderArgs} request - The request object containing the headers.
 * @returns {Promise<Response>} - A promise that resolves to a JSON response containing
 * the user data.
 */
export async function loader({ request }: LoaderArgs) {
  const cookieHeader = request.headers.get("Cookie");
  const cookie = await userPrefs.parse(cookieHeader);
  return json({ userdata: cookie.user });
}

const Step6 = () => {
  const userdata = useLoaderData();

  const userId: string = userdata.userdata.id;
  const barndId: string = userdata.userdata.brandId;

  const navigator = useNavigate();

  const dosdata = CreateCampaignStore((state) => state.dos);
  const dontsdata = CreateCampaignStore((state) => state.donts);
  const pdfFile = CreateCampaignStore((state) => state.pdffile);
  const image = CreateCampaignStore((state) => state.image);

  const platform = CreateCampaignStore((state) => state.platform).join();
  const campaignTypeId = CreateCampaignStore((state) => state.campaignTypeId);
  const media = CreateCampaignStore((state) => state.media);
  const campaignInfo = CreateCampaignStore((state) => state.campaignInfo);
  const approval = CreateCampaignStore((state) => state.approval) ? "1" : "0";
  const discoutCoupon = CreateCampaignStore((state) => state.discoutCoupon);
  const affiliatedLinks = CreateCampaignStore((state) => state.affiliatedLinks);
  const target = CreateCampaignStore((state) => state.target).toString();
  const minTarget = CreateCampaignStore((state) => state.minTarget).toString();
  const rating = CreateCampaignStore((state) => state.rating).toString();
  const mendtion = CreateCampaignStore((state) => state.mendtion).join();
  const hashtag = CreateCampaignStore((state) => state.hashtag).join();
  const dos = CreateCampaignStore((state) => state.dos).join();
  const donts = CreateCampaignStore((state) => state.donts).join();
  const audience = CreateCampaignStore((state) => state.audience).join();
  const infLocation = CreateCampaignStore((state) => state.infLocation).id;
  const tilldate = CreateCampaignStore((state) => state.tilldate);
  const maxInf = CreateCampaignStore((state) => state.maxInf).toString();
  const remuneration = CreateCampaignStore((state) => state.remuneration);
  const remunerationType = CreateCampaignStore(
    (state) => state.remunerationType
  );
  const campaignName = CreateCampaignStore((state) => state.campaignName);
  const planedBudget = CreateCampaignStore(
    (state) => state.planedBudget
  ).toString();
  const costPerPost = CreateCampaignStore(
    (state) => state.costPerPost
  ).toString();
  const startDate = CreateCampaignStore((state) => state.startDate);
  const endDate = CreateCampaignStore((state) => state.endDate);
  const minReach = CreateCampaignStore((state) => state.minReach).toString();
  const maxReact = CreateCampaignStore((state) => state.maxReact).toString();
  const publicGlobally = CreateCampaignStore((state) => state.publicGlobally)
    ? "1"
    : "2";
  const brandinfo = CreateCampaignStore((state) => state.brandinfo);
  const campaginPurpose = CreateCampaignStore((state) => state.campaginPurpose);
  const lat = CreateCampaignStore((state) => state.lat);
  const long = CreateCampaignStore((state) => state.long);
  const radius = CreateCampaignStore((state) => state.radius);

  const [error, setError] = useState<string | null>(null);

  const [isCreate, setIsCreate] = useState<boolean>(false);


  async function createCampagin() {
    setIsCreate(true);
    const req: { [key: string]: string } = {
      userId: userId,
      brandUserId: userId,
      brandId: barndId,
      cityId: "1",
      campaignTypeId: campaignTypeId,
      campaignName: campaignName,
      campaignInfo: campaignInfo,
      startAt: startDate,
      endAt: endDate,
      minReach: minReach,
      maxReach: maxReact,
      costPerPost: costPerPost,
      totalBudget: planedBudget,
      minEligibleRating: rating,
      currencyId: "3",
      categories: infLocation,
      platforms: platform,
      mentions: mendtion,
      hashtags: hashtag,
      dos: dos,
      donts: donts,
      totalParticipants: maxInf,
      // remuneration: remunerationType,
      remunerationCash: remuneration,
      geoLat: lat.toString(),
      geoLng: long.toString(),
      geoRadiusKm: radius.toString(),
      postApproval: approval,
      audienceLocations: audience,
      inviteStartAt: startDate,
      inviteEndAt: tilldate,
      purpose: campaginPurpose,
      isPublic: publicGlobally,
      campaignStatus: "1"
    };
    // if (remunerationType == "1") {
    //   req["remunerationCash"] = remuneration;
    // }
    // if (remunerationType == "2") {
    //   req["remunerationProductDetail"] = remuneration;
    // }
    // if (remunerationType == "3") {
    //   req["remunerationRevenuePer"] = remuneration;
    // }
    // if (remunerationType == "4") {
    //   req["dicountCoupon"] = remuneration;
    // }

    if (campaignTypeId == "4") {
      req["minTarget"] = minTarget;
      req["maxTarget"] = target;
    }

    /**
     * Sends a POST request to the specified URL with the provided data and headers.
     * @param {string} BaseUrl - The base URL of the API.
     * @param {object} req - The data to send in the request body.
     * @returns {Promise} A promise that resolves to the response data.
     */
    const data = await axios({
      method: "post",
      url: `${BaseUrl}/api/add-campaign`,
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
    }
    const id = data.data.data.campaign.id;

    const pdfurl = await UploadFile(pdfFile[0]);
    if (pdfurl.status) {
      const pdfref: { [key: string]: string } = {
        campaignId: id,
        title: `attachemtn${id}`,
        url: pdfurl.data,
      };

      /**
       * Sends a POST request to the specified URL with the provided data and headers.
       * @param {string} BaseUrl - The base URL of the API.
       * @param {object} pdfref - The data to send in the request body.
       * @returns {Promise} A promise that resolves to the response from the server.
       */
      await axios({
        method: "post",
        url: `${BaseUrl}/api/add-campaign-attachment`,
        data: pdfref,
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

      for (let i: number = 0; i < image.length; i++) {
        const imgurl = await UploadFile(image[i]);
        if (imgurl.status) {
          const imgref: { [key: string]: string } = {
            campaignId: id,
            title: `moodboard${id}${i}`,
            url: imgurl.data,
          };

          await axios({
            method: "post",
            url: `${BaseUrl}/api/add-campaign-mood`,
            data: imgref,
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
        } else {
          setError(imgurl.data);
        }
      }

      await axios({
        method: "post",
        url: `${ModeshApi}notification/send`,
        data: {
          title: "New Campaign Created",
          body: campaignName,
          to: "/topics/influencer"
        },
      });

      return navigator(
        `/home/createcampaign/inviteinf/${data.data.data.campaign.id}`
      );
    } else {
      setError(pdfurl.data);
    }
    setIsCreate(false);
  }
  /**
   * Renders a preview of a campaign with various information and components.
   * @returns JSX elements representing the campaign preview.
   */
  return (
    <>
      <div className="flex gap-x-4 flex-col lg:flex-row">
        <div className="bg-white shadow-xl rounded-xl px-8 py-4 mt-4">
          <div className="flex items-end gap-x-3">
            <div className="flex">
              <img
                src={userdata.userdata.brand.logo}
                alt="error"
                className="object-cover w-16 h-16 rounded"
              />
            </div>
            <p className="text-lg cusfont font-medium">{userdata.userdata.brand.name}</p>
          </div>
          <p className="text-lg mt-2 cusfont font-medium">{campaignName}</p>
          <h3 className="text-black  text-md text-left mt-4 cusfont font-medium">Info</h3>
          <p className="text-black font-semibold text-xs text-left">
            {brandinfo}
          </p>
          <h3 className="text-black text-md text-left mt-4 cusfont font-medium">
            Campaign Information
          </h3>
          {campaignInfo}
          <p className="text-black font-semibold text-xs text-left">
          </p>
          <h3 className="text-black text-md text-left mt-6 cusfont font-medium">
            Mood boards
          </h3>
          <div className="flex gap-x-4 my-2  overflow-x-scroll no-scrollbar w-[300px] lg:w-[600px] md:w-[400px]">
            {image.map((value: File, i: number) => {
              var url = URL.createObjectURL(value);
              return (
                <div key={i}>
                  <div className="w-32 h-32 bg-gray-200 rounded-xl grid place-items-center relative">
                    <div className="top-0 left-0 absolute h-full w-full">
                      <img
                        src={url}
                        alt="error"
                        className="w-full h-full rounded-xl object-cover"
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <h2 className="text-primary tect-xl text-left my-2 mt-4 cusfont font-medium">
            Attachments
          </h2>
          <div className="bg-[#EEEEEE] w-full h-10 rounded-lg flex items-center pl-4 my-2">
            <h3 className="text-black font-semibold  text-md">
              {pdfFile.length == 0 ? "" : pdfFile[0].name}
            </h3>
            <div className="grow"></div>
            <div className="grid place-items-center px-4 bg-gray-300 rounded-lg cursor-pointer h-full">
              <FontAwesomeIcon icon={faPaperclip}></FontAwesomeIcon>
            </div>
          </div>
          <h2 className="text-primary tect-xl font-medium text-left my-3">
            You should
          </h2>
          <div className="flex flex-col lg:flex-row gap-2">
            {/* dos start here */}
            <div className="w-full">
              <div className="bg-[#EEEEEE] w-full h-10 rounded-lg flex">
                <div className="grid place-items-center px-4 rounded-lg font-bold text-green-500">
                  <FontAwesomeIcon icon={faCheck}></FontAwesomeIcon>
                </div>
                <div className="grid place-items-center">
                  <h2 className="text-primary text-lg text-left font-medium">
                    Do's
                  </h2>
                </div>
                <div className="grow"></div>
                <div className="grid place-items-center px-4 bg-gray-300 rounded-lg">
                  <FontAwesomeIcon icon={faAdd}></FontAwesomeIcon>
                </div>
              </div>
              <div>
                {dosdata.map((value: string, i: number) => {
                  return (
                    <div key={i}>
                      <div className="bg-white shadow-lg py-1 px-2 rounded-lg text-xl my-2 text-black flex">
                        {value}
                        <div className="grow"> </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            {/* dos end here */}
            <div className="w-10"></div>
            {/* donts start here */}
            <div className="w-full">
              <div className="bg-[#EEEEEE] w-full h-10 rounded-lg flex">
                <div className="grid place-items-center px-4 rounded-lg font-bold text-red-500">
                  <FontAwesomeIcon icon={faRemove}></FontAwesomeIcon>
                </div>
                <div className="grid place-items-center">
                  <h2 className="text-primary text-lg text-left font-medium">
                    Don'ts
                  </h2>
                </div>
                <div className="grow"></div>
                <div className="grid place-items-center px-4 bg-gray-300 rounded-lg">
                  <FontAwesomeIcon icon={faAdd}></FontAwesomeIcon>
                </div>
              </div>

              <div>
                {dontsdata.map((value: string, i: number) => {
                  return (
                    <div key={i}>
                      <div className="bg-white shadow-lg py-1 px-2 rounded-lg text-xl my-2 text-black flex">
                        {value}
                        <div className="grow"> </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            {/* donts end here */}
          </div>
        </div>

        <div>
          <div className="lg:w-80 bg-white  shadow-lx rounded-xl p-4 mt-4">
            <h1 className="text-primary text-lg  cusfont font-medium">
              Campaign Preview
            </h1>
            <h3 className="text-black text-md text-left mt-4 cusfont font-medium">
              Congratulations
            </h3>
            <p className="text-black font-semibold text-xs text-left">
              {campaignInfo}
            </p>
            {error == "" || error == null || error == undefined ? null : (
              <NOTICEAlerts message={error}></NOTICEAlerts>
            )}
            <div className="flex w-full mt-10 gap-4">
              <div
                onClick={() => {
                  navigator(-1);
                }}
                className="w-full"
              >
                <CusButton
                  text="Back"
                  textColor={"text-black"}
                  background="bg-gray-100"
                  width={"w-full"}
                  fontwidth={"cusfont font-medium"}
                ></CusButton>
              </div>



              {isCreate ?

                <CusButton
                  text="Creating..."
                  textColor={"text-white"}
                  background="bg-secondary"
                  width={"w-full"}
                  fontwidth={"cusfont font-medium"}

                ></CusButton>
                :

                <div
                  className="w-full"
                  onClick={() => {
                    createCampagin();
                  }}
                >
                  <CusButton
                    text="Create"
                    textColor={"text-white"}
                    background="bg-secondary"
                    width={"w-full"}
                    fontwidth={"cusfont font-medium"}
                  ></CusButton>
                </div>}
            </div>
            <div className="rounded-md text-rose-500 font-medium text-md bg-rose-500 bg-opacity-10 p-4 my-2">
              You will not be able to edit the campaign details once you submit. Please make the changes before final submission.
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Step6;
