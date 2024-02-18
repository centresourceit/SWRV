import { LoaderArgs, json } from "@remix-run/node";
import { useLoaderData, useNavigate } from "@remix-run/react";
import axios from "axios";
import { CusButton } from "~/components/utils/buttont";
import { BaseUrl, ModeshApi } from "~/const";
import CreateCampaignStore from "~/state/campaign/createcampaign";
import { userPrefs } from "~/cookies";
import { useRef, useState } from "react";
import { NOTICEAlerts } from "~/components/utils/alert";

/**
 * Asynchronous function that loads platform data and user data based on the provided request.
 * @param {LoaderArgs} request - The request object containing the necessary information.
 * @returns {Promise<{ platform: any, userdata: any }>} - A promise that resolves to an object containing the platform data and user data.
 */
export const loader = async ({ request }: LoaderArgs) => {
  const platform = await axios.post(`${BaseUrl}/api/getplatform`);

  const cookieHeader = request.headers.get("Cookie");
  const cookie = await userPrefs.parse(cookieHeader);
  return json({ platform: platform.data.data, userdata: cookie.user });
};

const Spbd = () => {
  const [backbox, setBackBox] = useState<boolean>(false);

  const userdata = useLoaderData();
  const userId: string = userdata.userdata.id;
  const brandId: string = userdata.userdata.brandId;

  const mediatype = ["Post", "Story", "Reel", "Video", "Audio"];

  const data = useLoaderData();
  const navigator = useNavigate();

  const campaginType = CreateCampaignStore((state) => state.campaignTypeId);
  const [error, setError] = useState<string | null>(null);

  const platform = CreateCampaignStore((state) => state.platform);
  const setPlatform = CreateCampaignStore((state) => state.setPlatform);

  const media = CreateCampaignStore((state) => state.media);
  const setMedia = CreateCampaignStore((state) => state.setMedia);

  const CampaignName = useRef<HTMLInputElement | null>(null);

  const campinfo = useRef<HTMLTextAreaElement | null>(null);

  const StartDate = useRef<HTMLInputElement | null>(null);

  const EndDate = useRef<HTMLInputElement | null>(null);

  //start date
  const [sd, setsd] = useState<string>("");
  // end date
  const [ed, seted] = useState<string>("");

  // campaign name
  const [cn, setcn] = useState<string>("");

  const campaignTypeId = CreateCampaignStore((state) => state.campaignTypeId);
  const CostPerPost = useRef<HTMLInputElement | null>(null);

  //cost per post
  const [cpp, setcpp] = useState<string>("");

  const [isCreate, setIsCreate] = useState<boolean>(false);

  /**
   * Creates a new campaign with the provided information.
   * @returns None
   * @throws Error if any required fields are missing or invalid.
   */
  const createcampaign = async () => {

    setIsCreate(true);
    if (
      platform == null ||
      platform.length == 0 ||
      platform == undefined
    ) {
      setError("Select a platform");
    } else if (
      media == null ||
      media == "" ||
      media == undefined
    ) {
      setError("Select Creative Type");
    } else if (
      CampaignName.current?.value == null ||
      CampaignName.current?.value == undefined ||
      CampaignName.current?.value == ""
    ) {
      setError("Enter campaign name");
    } else if (CampaignName.current?.value.length < 4) {
      setError("Campaign should be more then 3 character.");
    } else if (
      campinfo.current?.value == null ||
      campinfo.current?.value == undefined ||
      campinfo.current?.value == ""
    ) {
      setError("Add campaign info");
    } else if (
      CostPerPost.current?.value == null ||
      CostPerPost.current?.value == undefined ||
      CostPerPost.current?.value == ""
    ) {
      setError("Fill the cost per post");
    } else {
      const x = new Date(StartDate!.current!.value);
      const y = new Date(EndDate!.current!.value);
      const pass_date: boolean = x > y;
      if (
        StartDate.current?.value == null ||
        StartDate.current?.value == undefined ||
        StartDate.current?.value == ""
      ) {
        setError("Enter planned starting date");
      } else if (pass_date) {
        setError("Start date should be less then end date");
      } else if (
        EndDate.current?.value == null ||
        EndDate.current?.value == undefined ||
        EndDate.current?.value == ""
      ) {
        setError("Enter planned end date");
      } else {
        const req = {
          userId: userId,
          brandUserId: userId,
          brandId: brandId,
          cityId: "0",
          currencyId: "3",
          categories: "0",
          minEligibleRating: "0",
          maxEligibleRating: "0",
          minReach: "0",
          maxReach: "0",
          costPerPost: CostPerPost.current?.value,
          totalBudget: "0",
          dos: "0",
          donts: "0",
          mentions: "0",
          hashtags: "0",
          campaignTypeId: campaignTypeId,
          campaignName: CampaignName.current?.value,
          campaignInfo: campinfo.current?.value,
          platforms: platform.join(),
          startAt: StartDate.current?.value,
          endAt: EndDate.current?.value,
          totalParticipants: 100,
          isPublic: "1"
        };

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
          setError(data.data.message);
        } else {
          const req1 = {
            brandId: brandId,
            campaignId: data.data.data.campaign.id,
            remark: "init bid",
            bidamount: CostPerPost.current?.value,
          };

          const data1 = await axios({
            method: "post",
            url: `${BaseUrl}/api/add-bid`,
            data: req1,
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

          if (data1.data.status == false) {
            setError(data1.data.message);
          } else {

            await axios({
              method: "post",
              url: `${ModeshApi}notification/send`,
              data: {
                title: "New Campaign Created",
                body: CampaignName.current?.value,
                to: "/topics/influencer"
              },
            });

            return navigator(
              `/home/createcampaign/inviteinf/${data.data.data.campaign.id}`
            );
          }
        }
      }

    }
    setIsCreate(false);
  }



  /**
   * Renders a form for creating a campaign with various input fields and buttons.
   * @returns JSX elements representing the campaign creation form.
   */
  return (
    <>

      <div className={`h-screen w-full grid place-items-center bg-black bg-opacity-25 fixed top-0 left-0 ${backbox ? "grid" : "hidden"}`}>
        <div className="w-80 bg-white rounded-xl shadow-xl p-4">
          <h1 className="text-center text-xl font-semibold">Are you sure you want to go back.</h1>
          <div className="flex justify-around">
            <button onClick={() => { navigator(-1) }} className="bg-green-500 py-2 px-4 text-xl font-medium rounded-md text-white">Yes</button>
            <button onClick={() => setBackBox(false)} className="bg-red-500 py-2 px-4 text-xl font-medium rounded-md text-white">NO</button>
          </div>
        </div>
      </div>
      <div className="flex gap-x-4 flex-col lg:flex-row">
        <div className="bg-white shadow-xl rounded-xl px-8 py-4 mt-4 grow">
          <h2 className="text-black tect-xl font-medium text-left my-4">
            {campaginType == "5" ? "Single post" : "Bidding"}
          </h2>
          <div className="flex gap-4 flex-wrap">
            {data.platform.map((val: any, i: number) => {
              return (
                <div key={i} className={`cursor-pointer p-2 rounded-lg ${platform.includes(val.id) ? "bg-white shadow-xl border-2 border-gray-500" : "bg-gray-200"} `} onClick={() => {
                  setPlatform(val.id);
                }}>
                  <img src={data.platform[i]["platformLogoUrl"]} alt="error" className="w-6 h-6" />
                </div>
              );
            })}
          </div>
          <div className="flex gap-4 flex-wrap my-6">
            {mediatype.map((val: string, i: number) => {
              return (
                <div key={i} className={`cursor-pointer text-primary text-lg text-center font-normal w-28 py-1  rounded-xl ${val == media ? "bg-[#80fffa] shadow-xl" : "bg-gray-100"}`} onClick={() => {
                  setMedia(val);
                }}>
                  {val}
                </div>
              )
            })}
          </div>
          <h2 className="text-primary tect-xl font-medium text-left my-1">
            Campaign name <span className="text-rose-500 text-2xl font-semibold">&#42;</span>
          </h2>
          <input
            ref={CampaignName}
            type={"text"}
            className="bg-[#EEEEEE]  outline-none border-none focus:border-gray-300 rounded-md w-full p-2"
            onChange={(val) => setcn(val.target.value)}
          />
          <h2 className="text-primary tect-xl font-medium text-left my-1">
            Campaign info <span className="text-rose-500 text-2xl font-semibold">&#42;</span>
          </h2>
          <textarea
            ref={campinfo}
            className="p-4 w-full h-40 outline-none bg-[#EEEEEE] focus:border-gray-300 rounded-md resize-none"
          ></textarea>
          <div className="flex flex-col lg:flex-row">
            <div className="grow">
              <h2 className="text-primary tect-xl font-medium text-left my-1">
                Start date <span className="text-rose-500 text-2xl font-semibold">&#42;</span>
              </h2>
              <input
                type={"date"}
                ref={StartDate}
                className="bg-[#EEEEEE] outline-none border-none rounded-lg focus:border-gray-300 w-full p-2"
                onChange={(val) => setsd(val.target.value)}
                min={new Date().toISOString().split('T')[0]}
              ></input>
            </div>
            <div className="w-8"></div>
            <div className="grow">
              <h2 className="text-primary tect-xl font-medium text-left my-1">
                End date <span className="text-rose-500 text-2xl font-semibold">&#42;</span>
              </h2>
              <input
                ref={EndDate}
                type={"date"}
                className="bg-[#EEEEEE]  outline-none border-none focus:border-gray-300 rounded-md w-full p-2"
                onChange={(val) => seted(val.target.value)}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
          </div>
          <div>
            <h2 className="text-primary tect-xl font-medium text-left my-1">
              {campaginType == "5" ? "Cost Per Post" : "Bid Start Amount"} (USD)<span className="text-rose-500 text-2xl font-semibold">&#42;</span>
            </h2>
            <input
              ref={CostPerPost}
              type={"number"}
              className="bg-[#EEEEEE]  outline-none border-none focus:border-gray-300 rounded-md w-full p-2"
              onChange={(val) => setcpp(val.target.value)}
            />
          </div>

          {error == "" || error == null || error == undefined ? null : (
            <NOTICEAlerts message={error}></NOTICEAlerts>
          )}
        </div>
        <div>
          <div className="lg:w-80 bg-white  shadow-lx rounded-xl p-4 mt-4">
            <h1 className="text-primary text-lg font-medium">
              Campaign Summary
            </h1>
            <div className="flex my-4 gap-3">
              <p className="text-sm text-primary font-normal flex-1">Campaign name</p>
              <p className="text-sm text-primary font-medium flex-1 text-right">
                {cn == "" ? "--------" : cn}
              </p>
            </div>
            <div className="flex my-4 gap-3">
              <p className="text-sm text-primary font-normal flex-1"> {campaginType == "5" ? "Cost Per Post" : "Bid Start Amount"}</p>
              <p className="text-sm text-primary font-medium flex-1 text-right">
                {cpp == "" ? "--------" : cpp}
              </p>
            </div>
            {campaginType == "6" ? (
              <>
                <div className="flex my-4 gap-3">
                  <p className="text-sm text-primary font-normal flex-1 ">Start date</p>
                  <p className="text-sm text-primary font-medium flex-1 text-right">
                    {sd == ""
                      ? "--------"
                      : new Date(sd).toLocaleDateString("en-US", {
                        weekday: "short",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                  </p>
                </div>
                <div className="flex my-4 gap-3">
                  <p className="text-sm text-primary font-normal flex-1 shrink-0">End date</p>
                  <p className="text-sm text-primary font-medium flex-1 text-right">
                    {ed == ""
                      ? "--------"
                      : new Date(ed).toLocaleDateString("en-US", {
                        weekday: "short",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                  </p>
                </div>
              </>
            ) : null}
            {error == "" || error == null || error == undefined ? null : (
              <NOTICEAlerts message={error}></NOTICEAlerts>
            )}
            <div className="flex w-full gap-4">
              <div
                onClick={() => {
                  setBackBox(false);
                }}
                className="w-full"
              >
                <CusButton
                  text="Back"
                  textColor={"text-black"}
                  background="bg-gray-100"
                  width={"w-full"}
                  fontwidth={"font-bold"}
                ></CusButton>
              </div>

              {isCreate ?

                <CusButton
                  text="Creating..."
                  textColor={"text-white"}
                  background="bg-secondary"
                  width={"w-full"}
                ></CusButton>
                :
                <div
                  className="w-full"
                  onClick={createcampaign}
                >
                  <CusButton
                    text="Create"
                    textColor={"text-white"}
                    background="bg-secondary"
                    width={"w-full"}
                  ></CusButton>
                </div>
              }
            </div>
            <div className="rounded-md text-rose-500 font-medium text-md bg-rose-500 bg-opacity-20 p-4 my-2">
              You will not be able to edit the campaign details once you submit. Please make the changes before final submission.
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default Spbd;
