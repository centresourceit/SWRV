import {
  faPaperclip,
  faRemove,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useRef, useState } from "react";
import { CusButton } from "~/components/utils/buttont";
import { Completed, Connection, Rating } from "./brand.$id";
import { LoaderArgs, LoaderFunction, json } from "@remix-run/node";
import axios from "axios";
import { BaseUrl } from "~/const";
import { Link, useLoaderData, useNavigate } from "@remix-run/react";
import { UploadFile, getCampaignType } from "~/utils";
import { userPrefs } from "~/cookies";

import Stripe from "stripe";
import { NOTICEAlerts } from "~/components/utils/alert";
import { MdiDatabase } from "~/components/icons";

/**
 * Creates a new instance of the Stripe object with the provided API key and options.
 * @param {string} apiKey - The Stripe API key.
 * @param {object} options - Additional options for the Stripe object.
 * @returns {Stripe} A new instance of the Stripe object.
 */
const stripe = new Stripe(
  "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",
  { apiVersion: "2022-11-15" }
);

/**
 * An enumeration representing the possible states of an accept request.
 * @enum {number}
 * @property {number} None - No accept request has been made.
 * @property {number} Pending - The accept request is pending.
 * @property {number} Accepted - The accept request has been accepted.
 * @property {number} Rejected - The accept request has been rejected.
 */
enum AcceptRequest {
  None,
  Panding,
  Accepted,
  Rejected,
}


/**
 * An enumeration representing different types of snapshots.
 * @enum {string}
 * @property {string} userinvitations - Represents user invitations snapshot type.
 * @property {string} userrequest - Represents user request snapshot type.
 * @property {string} requests - Represents requests snapshot type.
 * @property {string} drafts - Represents drafts snapshot type.
 * @property {string} payments - Represents payments snapshot type.
 * @property {string} bidings - Represents bidings snapshot type.
 * @property {string} influencers - Represents influencers snapshot type.
 * @property {string} LiveCampaigns - Represents live campaigns snapshot type.
 */
/**
 * An enumeration representing different types of snapshots.
 * @enum {string}
 * @property {string} userinvitations - Represents user invitations snapshot type.
 * @property {string} userrequest - Represents user request snapshot type.
 * @property {string} requests - Represents requests snapshot type.
 * @property {string} drafts - Represents drafts snapshot type.
 * @property {string} payments - Represents payments snapshot type.
 * @property {string} bidings - Represents bidings snapshot type.
 * @property {string} influencers - Represents influencers snapshot type.
 * @property {string} LiveCampaigns - Represents live campaigns snapshot type.
 */
enum SnapshotType {
  userinvitations,
  userrequest,
  requests,
  drafts,
  payments,
  bidings,
  influencers,
  LiveCampaigns
}

/**
 * Enum representing different types of brand requests.
 * @enum {string}
 * @property {string} invitations - Represents brand invitation requests.
 * @property {string} requests - Represents brand requests.
 * @property {string} payments - Represents brand payment requests.
 * @property {string} bidings - Represents brand bidding requests.
 */
enum BrandRequestType {
  invitations,
  requests,
  payments,
  bidings
}

/**
 * Loader function that retrieves campaign data and user platform information
 * based on the provided props.
 * @param {LoaderArgs} props - The loader arguments containing the necessary data.
 * @returns {Promise<Response>} - A promise that resolves to a JSON response
 * containing the campaign data, user information, and base URL.
 */
export const loader: LoaderFunction = async (props: LoaderArgs) => {
  const id = props.params.id;
  const baseUrl = props.request.url.split("/").slice(0, 3).join("/");


  const cookieHeader = props.request.headers.get("Cookie");
  const cookie = await userPrefs.parse(cookieHeader);
  const campaigndata = await axios.post(
    `${BaseUrl}/api/campaign-search`,
    { id: id },
    {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Allow-Options": "*",
        "Access-Control-Allow-Methods": "*",
        "X-Content-Type-Options": "*",
        "Content-Type": "application/json",
        Accept: "*",
      },
    }
  );
  const userplatform = await axios.post(
    `${BaseUrl}/api/get-user-handle`,
    { userId: cookie.user.id },
    {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Allow-Options": "*",
        "Access-Control-Allow-Methods": "*",
        "X-Content-Type-Options": "*",
        "Content-Type": "application/json",
        Accept: "*",
      },
    }
  );



  return json({
    campaign: campaigndata.data.data[0],
    user: cookie.user,
    platform: userplatform.data.data,
    baseUrl: baseUrl
  });
};

const Campaigns = () => {
  const loader = useLoaderData();
  const champaign = useLoaderData().campaign;
  const user = useLoaderData().user;
  const isbrand = user.role.code != 10;
  const data = useLoaderData();
  const baseUrl = useLoaderData().baseUrl;


  const [UserSnapshotType, setUserSnapshotType] = useState<SnapshotType>(
    SnapshotType.userinvitations
  );

  const [RequestType, setRequestType] = useState<BrandRequestType>(
    BrandRequestType.invitations
  );



  const [sum, setSum] = useState({
    rowCount: 0,
    constCount: 3,
    rate: 0,
  });

  const userId = user.id;
  const brandimage =
    champaign == undefined || champaign == null ? "/images/avatar/user.png" : champaign.brand == null ||
      champaign.brand.length == 0 ||
      champaign.brand == undefined ||
      champaign.brand == ""
      ? "/images/avatar/user.png"
      : champaign.brand.logo == "" ||
        champaign.brand.logo == null ||
        champaign.brand.logo == "0" ||
        champaign.brand.logo == undefined
        ? "/images/avatar/user.png"
        : champaign.brand.logo;
  const brandname = champaign.brand.name;
  const [category, setCategory] = useState<string>("");
  const [acceptreq, setAcceptreq] = useState<AcceptRequest>(AcceptRequest.None);

  const [requestdata, setRequestdata] = useState<any[]>([]);

  const [brandConnection, setBarndConnection] = useState<number>(0);
  const [brandComCam, setBarndComCam] = useState<number>(0);

  const [aprovedBid, setApprovedBid] = useState<any>(null);

  const init = async () => {
    setCategory(await getCampaignType(champaign.campaignTypeId));

    let req = {
      search: {
        campaign: champaign.id,
        influencer: userId,
      },
    };
    const reqdata = await axios.post(`${BaseUrl}/api/search-invite`, req);

    if (reqdata.data.status == true) {
      if (reqdata.data.data[0].status.code == "1")
        setAcceptreq(AcceptRequest.Panding);
      if (reqdata.data.data[0].status.code == "3")
        setAcceptreq(AcceptRequest.Accepted);
      if (reqdata.data.data[0].status.code == "5")
        setAcceptreq(AcceptRequest.Rejected);
      setRequestdata(reqdata.data.data);
    } else {
      setAcceptreq(AcceptRequest.None);
    }

    //brand connection
    const reqdata1 = await axios.post(`${BaseUrl}/api/get-brand-connection`, {
      brandId: champaign.brand.id,
    });
    if (reqdata.data.status) {
      setBarndConnection(reqdata1.data.data.influencer_count);
    } else {
      setBarndConnection(0);
    }

    //brand completed compaign
    const reqdata2 = await axios.post(`${BaseUrl}/api/get-brand-com-cam`, {
      brandId: champaign.brand.id,
    });
    if (reqdata2.data.status) {
      setBarndComCam(reqdata2.data.data.completed_campaign);
    } else {
      setBarndComCam(0);
    }

    const req1 = {
      search: {
        type: "3",
        brand: champaign.brand.id,
      },
    };
    const apireq = await axios({
      method: "post",
      url: `${BaseUrl}/api/search-review`,
      data: req1,
    });
    let myrate: number = 0;
    for (let i: number = 0; i < apireq.data.data.length; i++) {
      myrate +=
        parseInt(apireq.data.data[i].rating1) +
        parseInt(apireq.data.data[i].rating2) +
        parseInt(apireq.data.data[i].rating3);
    }
    setSum((val) => ({
      rowCount: apireq.data.data.length,
      rate: myrate,
      constCount: 3,
    }));

    //get approved bid
    const bidreq = await axios.post(`${BaseUrl}/api/get-approved-bid`, {
      campaignId: champaign.id,
    });

    if (bidreq.data.status) {
      setApprovedBid((val: any) => bidreq.data.data[0]);
    }
  };

  useEffect(() => {
    init();
  }, []);

  const [isedit, setIsedit] = useState<boolean>(false);
  const [isupdate, setIsupdate] = useState<boolean>(false);


  const [error, setError] = useState<string>("");

  const campaignNameRef = useRef<HTMLInputElement>(null);
  const campaignInfoRef = useRef<HTMLTextAreaElement>(null);
  const minEligibleRatingRef = useRef<HTMLInputElement>(null);
  const minReachRef = useRef<HTMLInputElement>(null);
  const maxReachRef = useRef<HTMLInputElement>(null);
  const costPerPostRef = useRef<HTMLInputElement>(null);
  const plannedBudgetRef = useRef<HTMLInputElement>(null);
  const minTargetRef = useRef<HTMLInputElement>(null);
  const totalTargetRef = useRef<HTMLInputElement>(null);
  const totalBudgetRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isedit) {
      campaignNameRef!.current!.value = champaign["campaignName"];
      campaignInfoRef!.current!.value = champaign["campaignInfo"];
      minEligibleRatingRef!.current!.value = champaign["minEligibleRating"];
      minReachRef!.current!.value = champaign["minReach"];
      maxReachRef!.current!.value = champaign["maxReach"];
      costPerPostRef!.current!.value = champaign["costPerPost"];
      plannedBudgetRef!.current!.value = champaign["plannedBudget"];
      minTargetRef!.current!.value = champaign["minTarget"];
      totalTargetRef!.current!.value = champaign["totalTarget"];
      totalBudgetRef!.current!.value = champaign["totalBudget"];
    }
  }, [isedit]);

  const submit = async () => {
    setIsupdate((val) => true);
    const userdata = await axios({
      method: "post",
      url: `${BaseUrl}/api/edit-campaign`,
      data: {
        id: champaign.id,
        update: {
          campaignName: campaignNameRef!.current!.value,
          campaignInfo: campaignInfoRef!.current!.value,
          minEligibleRating: minEligibleRatingRef!.current!.value,
          minReach: minReachRef!.current!.value,
          maxReach: maxReachRef!.current!.value,
          costPerPost: costPerPostRef!.current!.value,
          plannedBudget: plannedBudgetRef!.current!.value,
          minTarget: minTargetRef!.current!.value,
          totalTarget: totalTargetRef!.current!.value,
          totalBudget: totalBudgetRef!.current!.value,
        }
      },
    });

    if (userdata.data.status == false) {
      setError(userdata.data.message);
    } else {
      window.location.reload()
    }
    setIsupdate((val) => false);
  }

  return (
    <>
      <div className="grid gap-y-4 lg:gap-4 grid-cols-1 lg:grid-cols-7 mt-4 justify-start align-top content-start place-items-start place-content-start">
        <div className="w-full col-span-2">
          <BrandInfo
            logo={brandimage}
            name={brandname}
            website={champaign.brand.website}
            info={champaign.brand.info}
            category={category}
            rate={
              isNaN(Math.round(sum.rate / sum.rowCount / sum.constCount))
                ? "0"
                : Math.round(sum.rate / sum.rowCount / sum.constCount).toString()
            }
            connection={brandConnection.toString()}
            completed={brandComCam.toString()}
          ></BrandInfo>
          {/* edit campaign start here */}
          {isbrand ?
            <div className="rounded-xl bg-white p-4 mt-4 shadow-xl">
              {
                isedit ?
                  <>
                    <h1 className="text-xl font-medium cusfont">Edit</h1>
                    <div className="w-full bg-slate-800 h-[1px] my-2"></div>
                    <p className="text-black font-semibold text-xl">Campaign Name</p>
                    <input
                      ref={campaignNameRef}
                      className="p-2 w-full outline-none bg-transparent text-black border-2 border-black block my-4 rounded-md"
                    />
                    <p className="text-black font-semibold text-xl">Campaign Name</p>
                    <textarea
                      ref={campaignInfoRef}
                      className="p-2 w-full outline-none bg-transparent text-black border-2 border-black block my-4 rounded-md resize-none h-32"
                    ></textarea>
                    <p className="text-black font-semibold text-xl">Campaign Info</p>
                    <input
                      ref={minEligibleRatingRef}
                      className="p-2 w-full outline-none bg-transparent text-black border-2 border-black block my-4 rounded-md"
                    />

                    <p className="text-black font-semibold text-xl">Campaign Min Reach</p>
                    <input
                      ref={minReachRef}
                      className="p-2 w-full outline-none bg-transparent text-black border-2 border-black block my-4 rounded-md"
                    />
                    <p className="text-black font-semibold text-xl">Campaign Max Reach</p>
                    <input
                      ref={maxReachRef}
                      className="p-2 w-full outline-none bg-transparent text-black border-2 border-black block my-4 rounded-md"
                    />
                    <p className="text-black font-semibold text-xl">Campaign Cost per Post (USD)</p>
                    <input
                      ref={costPerPostRef}
                      className="p-2 w-full outline-none bg-transparent text-black border-2 border-black block my-4 rounded-md"
                    />
                    <p className="text-black font-semibold text-xl">Campaign Planned Budget</p>
                    <input
                      ref={plannedBudgetRef}
                      className="p-2 w-full outline-none bg-transparent text-black border-2 border-black block my-4 rounded-md"
                    />
                    <p className="text-black font-semibold text-xl">Campaign Min Target</p>
                    <input
                      ref={minTargetRef}
                      className="p-2 w-full outline-none bg-transparent text-black border-2 border-black block my-4 rounded-md"
                    />.
                    <p className="text-black font-semibold text-xl">Campaign Total Target</p>
                    <input
                      ref={totalTargetRef}
                      className="p-2 w-full outline-none bg-transparent text-black border-2 border-black block my-4 rounded-md"
                    />
                    <p className="text-black font-semibold text-xl">Campaign Total Budget</p>
                    <input
                      ref={totalBudgetRef}
                      className="p-2 w-full outline-none bg-transparent text-black border-2 border-black block my-4 rounded-md"
                    />
                    {error == "" || error == null || error == undefined ? null : (
                      <NOTICEAlerts message={error}></NOTICEAlerts>
                    )}
                    {isupdate ?
                      <button className="text-white text-lg font-medium cusfont w-full py-2 text-center bg-primary mt-2 rounded-lg">Updating...</button>
                      : <button onClick={submit} className="text-white text-lg font-medium cusfont w-full py-2 text-center bg-primary mt-2 rounded-lg">Update</button>}
                  </>
                  :
                  <>
                    <h1 className="text-lg font-medium cusfont">Would you like to edit the campaign.</h1>
                    <button onClick={() => setIsedit(true)} className="text-white text-lg font-medium cusfont w-full py-2 text-center bg-primary mt-2 rounded-lg">EDIT</button>
                  </>
              }
            </div>
            : null}
          {/* edit campaign end here */}
        </div>
        <CampaignsInfo
          title={champaign.campaignName}
          dont={champaign.donts}
          dos={champaign.dos}
          hastag={champaign.hashtags}
          mendtion={champaign.mentions}
          platform={champaign.platforms}
          moddboard={champaign.moodBoards}
          info={champaign.campaignInfo}
          name={brandname}
          image={brandimage}
          website={champaign.brand.website}
          category={category}
          typeid={champaign.campaignTypeId}
        ></CampaignsInfo>
        <div className="lg:col-start-6 lg:col-end-8 grid gap-y-4 w-full">

          <Budget
            // currecny={champaign.currency.code}
            currecny={"USD"}
            costperpost={champaign.costPerPost}
            totalbudget={champaign.totalBudget.split(".")[0]}
            isbid={(champaign.campaignTypeId == "6" || champaign.campaignTypeId == "5")}
          ></Budget>
          <Target
            audiencelocation={champaign.audienceLocations}
            minreach={champaign.minReach}
            maxreach={champaign.maxReach}
            startdate={champaign.startAt}
            enddate={champaign.endAt}
            typeid={champaign.campaignTypeId}
            isgeto={champaign.geoRadiusKm}
            minrating={champaign.minEligibleRating}
            rem={"Cash"}
            invite={champaign.inviteEndAt}
          ></Target>
          {isbrand ? <>
            <InviteInf champaignId={champaign.id}></InviteInf>
          </> : (
            <>
              {acceptreq == AcceptRequest.None ? (
                <Apply
                  champaignId={champaign.id}
                  touserId={champaign.brandUserId}
                  userId={userId}
                  influencerId={userId}
                  fromuserId={userId}
                  endAt={champaign.endAt}
                  maxinf={champaign.totalParticipants}
                ></Apply>
              ) : null}
              {acceptreq == AcceptRequest.Panding ? <Panding></Panding> : null}
              {acceptreq == AcceptRequest.Rejected ? (
                <Rejected
                  reason={requestdata[0].status.message}
                  champaignId={champaign.id}
                  touserId={champaign.brandUserId}
                  userId={userId}
                  influencerId={userId}
                  fromuserId={userId}
                ></Rejected>
              ) : null}
            </>
          )}
          {acceptreq == AcceptRequest.Accepted ?
            (champaign.campaignTypeId != "6") ? (
              <CreateDraft
                influencerId={userId}
                champaingId={champaign.id}
                platforms={data.platform}
              ></CreateDraft>
            ) :
              (aprovedBid == null || aprovedBid == undefined) ? (
                <Bidding
                  CostPerPost={champaign.costPerPost}
                  userId={userId}
                  campaignId={champaign.id}
                  brandId={champaign.brand.id}
                ></Bidding>
              ) : aprovedBid.userId == userId ? (
                <CreateDraft
                  influencerId={userId}
                  champaingId={champaign.id}
                  platforms={data.platform}
                ></CreateDraft>
              ) :
                isbrand ? null :
                  <div className="w-full bg-rose-500 py-4 px-10 text-white font-semibold text-2xl rounded-lg">
                    Your bid did not get accepted
                  </div>
            : null}
        </div>
      </div >
      {/* 
      

      {/* snapshot start here */}
      <div className="w-full mt-4 shadow-xl bg-white rounded-xl p-4">
        <div className="flex gap-4 flex-nowrap md:flex-wrap mb-8 overflow-x-scroll md:overflow-x-auto">
          <div
            onClick={() => {
              setUserSnapshotType(SnapshotType.userinvitations);
            }}
          >
            <CusButton
              text="Invitations"
              margin="0"
              background={`${UserSnapshotType == SnapshotType.userinvitations
                ? "bg-primary"
                : "bg-[#eeeeee]"
                }`}
              fontwidth=" cusfont font-medium "
              textColor={`${UserSnapshotType == SnapshotType.userinvitations
                ? "text-white"
                : "text-black"
                }`}
            ></CusButton>
          </div>
          <div
            onClick={() => {
              setUserSnapshotType(SnapshotType.userrequest);
            }}
          >
            <CusButton
              text="Requests"
              margin="0"
              background={`${UserSnapshotType == SnapshotType.userrequest
                ? "bg-primary"
                : "bg-[#eeeeee]"
                }`}
              fontwidth=" cusfont font-medium "
              textColor={`${UserSnapshotType == SnapshotType.userrequest
                ? "text-white"
                : "text-black"
                }`}
            ></CusButton>
          </div>
          <div
            onClick={() => {
              setUserSnapshotType(SnapshotType.requests);
            }}
          >
            <CusButton
              text="Draft Requests"
              margin="0"
              background={`${UserSnapshotType == SnapshotType.requests
                ? "bg-primary"
                : "bg-[#eeeeee]"
                }`}
              fontwidth=" cusfont font-medium "
              textColor={`${UserSnapshotType == SnapshotType.requests
                ? "text-white"
                : "text-black"
                }`}
            ></CusButton>
          </div>
          <div
            onClick={() => {
              setUserSnapshotType(SnapshotType.drafts);
            }}
          >
            <CusButton
              text="Accepted Draft"
              margin="0"
              background={`${UserSnapshotType == SnapshotType.drafts
                ? "bg-primary"
                : "bg-[#eeeeee]"
                }`}
              fontwidth=" cusfont font-medium "
              textColor={`${UserSnapshotType == SnapshotType.drafts
                ? "text-white"
                : "text-black"
                }`}
            ></CusButton>
          </div>
          <div
            onClick={() => {
              setUserSnapshotType(SnapshotType.payments);
            }}
          >
            <CusButton
              text="Payments"
              margin="0"
              background={`${UserSnapshotType == SnapshotType.payments
                ? "bg-primary"
                : "bg-[#eeeeee]"
                }`}
              fontwidth=" cusfont font-medium "
              textColor={`${UserSnapshotType == SnapshotType.payments
                ? "text-white"
                : "text-black"
                }`}
            ></CusButton>
          </div>
          {champaign.campaignTypeId == "6" ? (
            <div
              onClick={() => {
                setUserSnapshotType(SnapshotType.bidings);
              }}
            >
              <CusButton
                text="Bidding"
                margin="0"
                background={`${UserSnapshotType == SnapshotType.bidings
                  ? "bg-primary"
                  : "bg-[#eeeeee]"
                  }`}
                fontwidth=" cusfont font-medium "
                textColor={`${UserSnapshotType == SnapshotType.bidings
                  ? "text-white"
                  : "text-black"
                  }`}
              ></CusButton>
            </div>
          ) : null}

          {isbrand ?
            <div
              onClick={() => {
                setUserSnapshotType(SnapshotType.influencers);
              }}
            >
              < CusButton
                text="Influencers"
                margin="0"
                background={`${UserSnapshotType == SnapshotType.influencers
                  ? "bg-primary"
                  : "bg-[#eeeeee]"
                  }`}
                fontwidth=" cusfont font-medium "
                textColor={`${UserSnapshotType == SnapshotType.influencers
                  ? "text-white"
                  : "text-black"
                  }`}
              ></CusButton>
            </div>
            : null
          }


          {isbrand ? null : acceptreq == AcceptRequest.Accepted ? champaign.campaignTypeId != "6" ? (
            <div
              onClick={() => {
                setUserSnapshotType(SnapshotType.LiveCampaigns);
              }}
            >
              <CusButton
                text="Live Campaign"
                margin="0"
                background={`${UserSnapshotType == SnapshotType.LiveCampaigns
                  ? "bg-primary"
                  : "bg-[#eeeeee]"
                  }`}
                fontwidth=" cusfont font-medium "
                textColor={`${UserSnapshotType == SnapshotType.LiveCampaigns
                  ? "text-white"
                  : "text-black"
                  }`}
              ></CusButton>
            </div>
          ) : (aprovedBid == null || aprovedBid == undefined) ? null :
            <div
              onClick={() => {
                setUserSnapshotType(SnapshotType.LiveCampaigns);
              }}
            >
              <CusButton
                text="Live Campaign"
                margin="0"
                background={`${UserSnapshotType == SnapshotType.LiveCampaigns
                  ? "bg-primary"
                  : "bg-[#eeeeee]"
                  }`}
                fontwidth=" cusfont font-medium "
                textColor={`${UserSnapshotType == SnapshotType.LiveCampaigns
                  ? "text-white"
                  : "text-black"
                  }`}
              ></CusButton>
            </div>
            : null}
        </div>

        {/* 
        <LinkCampaign
              userId={userId}
              campaingid={champaign.id}
              brandId={champaign.brand.id}
              cpp={champaign.costPerPost}
            /> */}

        {
          isbrand ? (
            <>
              {
                UserSnapshotType == SnapshotType.userinvitations ?
                  <>

                    {/* <ChampaingAcceptRequestI
                      userId={userId}
                      campaingid={champaign.id}
                    ></ChampaingAcceptRequestI>
                    <div className="h-10"></div> */}
                    <SnapshotChampaingAcceptRequestI
                      userId={userId}
                      campaingid={champaign.id}
                      isUser={false}
                    ></SnapshotChampaingAcceptRequestI>
                  </>
                  : null
              }
              {
                UserSnapshotType == SnapshotType.userrequest ?
                  <>

                    <ChampaingAcceptRequestR
                      userId={userId}
                      campaingid={champaign.id}
                    ></ChampaingAcceptRequestR>
                    <div className="h-6"></div>
                    <SnapshotChampaingAcceptRequestR
                      userId={userId}
                      campaingid={champaign.id}
                      isUser={false}
                    ></SnapshotChampaingAcceptRequestR>
                  </>
                  : null
              }
              {
                UserSnapshotType == SnapshotType.requests ?
                  <>
                    <DraftAcceptRequest
                      userId={userId}
                      campaingid={champaign.id}
                    ></DraftAcceptRequest>
                    <div className="h-6"></div>

                    <SnapshotDraftAcceptRequest
                      userId={userId}
                      campaingid={champaign.id}
                      isUser={false}
                    ></SnapshotDraftAcceptRequest>
                  </> :
                  null
              }
              {
                UserSnapshotType == SnapshotType.drafts ?
                  <SnapshopCreatedDrafts
                    campaingid={champaign.id}
                    brandid={userId}
                    userId={userId}
                    isUser={false}
                  ></SnapshopCreatedDrafts>
                  : null
              }
              {
                UserSnapshotType == SnapshotType.payments ?
                  <>
                    <ChampaingPaymentRequest
                      userid={user.id}
                      campaingid={champaign.id}
                      // currency={user.currency.code}
                      currency={"USD"}
                      baseUrl={baseUrl}
                    ></ChampaingPaymentRequest>
                    <div className="h-6"></div>

                    <SnapshotChampaingPaymentRequest
                      userid={user.id}
                      campaingid={champaign.id}
                      isUser={false}
                      currency={"USD"}></SnapshotChampaingPaymentRequest>
                  </>
                  : null
              }
              {
                UserSnapshotType == SnapshotType.bidings ?
                  champaign.campaignTypeId == "6" ? (
                    <>
                      <ChampaingBidRequest
                        userid={user.id}
                        campaingid={champaign.id}
                      ></ChampaingBidRequest>
                      <div className="h-6"></div>
                      <SnapshotChampaingBidRequest
                        userid={user.id}
                        campaingid={champaign.id}
                        isUser={false}
                      ></SnapshotChampaingBidRequest>
                    </>
                  ) : null
                  : null
              }

              {
                UserSnapshotType == SnapshotType.influencers ?
                  <>
                    <JoinedInfluencer
                      campaingid={champaign.id}
                    ></JoinedInfluencer>
                  </>
                  : null
              }
            </>
          ) : (
            <>

              {
                UserSnapshotType == SnapshotType.userinvitations ?
                  <SnapshotChampaingAcceptRequestI
                    userId={userId}
                    campaingid={champaign.id}
                    isUser={true}
                  ></SnapshotChampaingAcceptRequestI>
                  : null
              }
              {
                UserSnapshotType == SnapshotType.userrequest ?
                  <SnapshotChampaingAcceptRequestR
                    userId={userId}
                    campaingid={champaign.id}
                    isUser={true}
                  ></SnapshotChampaingAcceptRequestR>
                  : null
              }


              {UserSnapshotType == SnapshotType.requests ?
                <SnapshotDraftAcceptRequest
                  userId={userId}
                  campaingid={champaign.id}
                  isUser={true}
                ></SnapshotDraftAcceptRequest>
                : null}

              {UserSnapshotType == SnapshotType.drafts ?
                <SnapshopCreatedDrafts
                  campaingid={champaign.id}
                  brandid={userId}
                  userId={userId}
                  isUser={true}
                ></SnapshopCreatedDrafts>
                : null}

              {UserSnapshotType == SnapshotType.payments ?
                <SnapshotChampaingPaymentRequest
                  userid={user.id}
                  campaingid={champaign.id}
                  isUser={true}
                  currency={"USD"}></SnapshotChampaingPaymentRequest>
                : null}

              {UserSnapshotType == SnapshotType.bidings ?
                champaign.campaignTypeId == "6" ? (
                  <SnapshotChampaingBidRequest
                    userid={user.id}
                    campaingid={champaign.id}
                    isUser={true}
                  ></SnapshotChampaingBidRequest>
                ) : null
                : null}

              {UserSnapshotType == SnapshotType.LiveCampaigns ?
                <LinkCampaign
                  userId={userId}
                  campaingid={champaign.id}
                  brandId={champaign.brand.id}
                  cpp={champaign.costPerPost}
                />
                : null}
            </>
          )
        }
      </div >
      {/* snapshot end here */}
    </>
  );
};

export default Campaigns;

type BrandInfoProps = {
  logo: string;
  name: string;
  website: string;
  info: string;
  rate: string;
  connection: string;
  completed: string;
  category: string;
};

const BrandInfo = (props: BrandInfoProps) => {
  return (
    <>
      <div className=" rounded-xl shadow-xl bg-white p-4 w-full">
        <div className="flex items-end gap-x-3">
          <div>
            <img
              src={props.logo}
              alt="brand logo"
              className="object-cover w-16 h-16 rounded object-center"
            />
          </div>
          <p className="text-black font-medium text-xl content-end text-left cusfont">
            {props.name}
          </p>
        </div>
        <p className="text-black font-medium text-xs text-left mt-4 cusfont">
          Category : {props.category}
        </p>
        <p className="text-black font-medium text-xs text-left mt-3 cusfont">
          {props.website}
        </p>
        <h3 className="text-black font-medium text-md text-left mt-3 cusfont">Brand info</h3>
        <p className="text-black font-semibold text-xs text-left mt-2">
          {props.info}
        </p>
        <div className="h-4"></div>
        <Rating rate={props.rate} />
        <div className="h-4"></div>
        <Connection connection={props.connection} />
        <div className="h-4"></div>
        <Completed completed={props.completed} />
      </div>
    </>
  );
};

type CampaignsInfoProps = {
  name: string;
  image: string;
  category: string;
  website: string;
  info: string;
  moddboard: any;
  platform: any;
  dos: string;
  dont: string;
  mendtion: string;
  hastag: string;
  title: string;
  typeid: string;
};

/**
 * Renders the CampaignsInfo component with the given props.
 * @param {CampaignsInfoProps} props - The props object containing the necessary data for rendering the component.
 * @returns The JSX element representing the CampaignsInfo component.
 */
const CampaignsInfo = (props: CampaignsInfoProps) => {
  return (
    <>
      <div className="col-span-3 rounded-xl shadow-xl bg-white p-4 w-full">
        <div className="flex items-end gap-x-3">
          <div>
            <img
              src={props.image}
              alt="error"
              className="object-cover w-16 h-16 rounded object-center"
            />
          </div>
          <p className="text-black font-medium text-xl content-end text-left cusfont">
            {props.name}
          </p>
        </div>

        <p className="text-black text-xl text-left my-4 cusfont font-medium">
          {props.title}
        </p>
        <p className="text-black font-semibold text-xs text-left mt-4">
          Category : {props.category}
        </p>
        <p className="text-black font-semibold text-xs text-left">
          {props.website}
        </p>
        <h3 className="text-black font-medium text-md text-left mt-4 cusfont">
          Campaign info
        </h3>
        <p className="text-black font-semibold text-xs text-left mt-2">
          {props.info}
        </p>

        {(props.typeid == "5" || props.typeid == "6") ? null :
          <div>
            <p className="text-black text-left text-md font-medium mt-2 cusfont">
              Moodboard
            </p>
            <div className="flex gap-x-4 flex-wrap w-full">
              {props.moddboard.map((val: any, index: number) => {
                return (
                  <a target="_blank" href={val.url} className="shrink-0 inline-block" key={index}>
                    <img
                      src={val.url}
                      alt="error"
                      className="h-14 w-14 object-cover rounded-md object-center"
                    />
                  </a>
                );
              })}
            </div>
          </div>
        }
        <p className="text-black text-left text-md font-medium mt-2 cusfont">
          Platforms
        </p>
        <div className="flex items-center gap-2 w-full flex-wrap mt-2">
          {props.platform.map((val: any, index: number) => {
            return (
              <div key={index} className="p-1 shrink-0 mx-1 ">
                <img
                  src={val["platformLogoUrl"]}
                  alt="error"
                  className="rounded-lg w-8 h-8 object-center object-cover"
                />
              </div>
            );
          })}
        </div>
        {(props.typeid == "5" || props.typeid == "6") ? null :
          <>
            <div className="bg-gray-200  rounded-md py-2 flex justify-start w-96 mt-6 gap-3 px-2">
              <div className="grow">
                <p className="text-sm font-semibold">Do's</p>
                {props.dos.split(",").map((val: any, index: number) => {
                  return (
                    <p key={index} className="text-md font-normal">
                      {val}
                    </p>
                  );
                })}
              </div>
              <div className="h-10 w-[1px] bg-slate-900"></div>
              <div className="grow">
                <p className="text-sm font-semibold">Dont's</p>
                {props.dont.split(",").map((val: any, index: number) => {
                  return (
                    <p key={index} className="text-md font-normal">
                      {val}
                    </p>
                  );
                })}
              </div>
            </div>



            <p className="text-sm font-semibold mt-4">Hashtags</p>
            <div className="flex flex-wrap gap-2 my-4 w-full">
              {props.hastag.split(",").map((val: any, index: number) => {
                return (
                  <p
                    key={index}
                    className="text-md font-normal rounded-md bg-gray-300 py-1 px-4"
                  >
                    #{val}
                  </p>
                );
              })}
            </div>
            <p className="text-sm font-semibold mt-4">Mentions</p>
            <div className="flex flex-wrap gap-2 my-4 w-full">
              {props.mendtion.split(",").map((val: any, index: number) => {
                return (
                  <p
                    key={index}
                    className="text-md font-normal rounded-md bg-gray-300 py-1 px-4"
                  >
                    @{val}
                  </p>
                );
              })}
            </div>
          </>
        }
      </div>
    </>
  );
};

/**
 * Represents the properties of a target audience for a marketing campaign.
 * @typedef {Object} TargetProps
 * @property {string} audiencelocation - The location of the target audience.
 * @property {string} minreach - The minimum reach of the target audience.
 * @property {string} maxreach - The maximum reach of the target audience.
 * @property {string} startdate - The start date of the marketing campaign.
 * @property {string} enddate - The end date of the marketing campaign.
 * @property {string} typeid - The ID of the target audience type.
 * @property {string} isgeto - The GETO status of the target audience.
 * @property {string}
 */
type TargetProps = {
  audiencelocation: string;
  minreach: string;
  maxreach: string;
  startdate: string;
  enddate: string;
  typeid: string;
  isgeto: string;
  minrating: string;
  rem: string;
  invite: string;
};

/**
 * Renders a Target component with the given props.
 * @param {TargetProps} props - The props for the Target component.
 * @returns {JSX.Element} - The rendered Target component.
 */
const Target = (props: TargetProps) => {
  return (
    <>
      <div className="rounded-xl shadow-xl bg-white p-4 w-full">
        <div className="flex">
          <MdiDatabase className="text-xl text-primary" />
          <h2 className="text-xl text-primary font-medium px-4">Target</h2>
        </div>
        <div className="h-[1px] bg-gray-500 w-full my-2"></div>

        {(props.typeid == "5" || props.typeid == "6") ? null :
          <>
            <div className="flex my-2 gap-3">
              <p className="text-md text-primary flex-1">Audience Location</p>
              <p className="text-md font-bold text-primary flex-1 text-left">
                {props.audiencelocation ?? "".toString().split(",").join(", ")}
              </p>
            </div>
            <div className="flex my-2 gap-3">
              <p className="text-md text-primary flex-1">Min Reach</p>
              <p className="text-md font-bold text-black flex-1 text-left">{props.minreach}</p>
            </div>
            <div className="flex my-2 gap-3">
              <p className="text-md text-primary flex-1">Max Reach</p>
              <p className="text-md font-bold text-black flex-1 text-left">{props.maxreach}</p>
            </div>
          </>
        }
        <div className="flex my-2 gap-3">
          <p className="text-md text-primary flex-1">Start Date</p>
          <p className="text-md font-bold text-black flex-1 text-left">
            {props.startdate.toString().split(" ")[0]}
          </p>
        </div>
        <div className="flex my-2 gap-3">
          <p className="text-md text-primary flex-1">End date</p>
          <p className="text-md font-bold text-black flex-1 text-left">
            {props.enddate.toString().split(" ")[0]}
          </p>
        </div>

        {(props.typeid == "5" || props.typeid == "6") ? null : <>
          <div className="flex my-2 gap-3">
            <p className="text-md text-primary flex-1">Geofencing</p>
            <p className="text-md font-bold text-black flex-1 text-left">
              {parseInt(props.isgeto) == 0 ? "Inactive" : "Active"}
            </p>
          </div>
          <div className="flex my-2 gap-3">
            <p className="text-md text-primary flex-1">Invite End Date</p>
            <p className="text-md font-bold text-black flex-1 text-left">
              {props.invite.toString().split(" ")[0]}
            </p>
          </div>
          <div className="flex my-2 gap-3">
            <p className="text-md text-primary flex-1">Remuneration</p>
            <p className="text-md font-bold text-black flex-1 text-left">
              {props.rem}
            </p>
          </div>
          <div className="flex my-2 gap-3">
            <p className="text-md text-primary flex-1">Min Eligible Rating</p>
            <p className="text-md font-bold text-black flex-1 text-left">
              {parseInt(props.minrating)}
            </p>
          </div>
        </>}
      </div>
    </>
  );
};

type InviteInfProps = {
  champaignId: string;
};


/**
 * Renders a component that displays an invitation to invite an influencer to a campaign.
 * @param {InviteInfProps} props - The props object containing the campaign ID.
 * @returns The JSX element representing the invitation component.
 */
const InviteInf = (props: InviteInfProps) => {
  return (
    <>
      <div className="p-4 rounded-xl shadow-xl bg-primary">
        <h1 className="text-white text-xl text-left font-normal">
          Invite influencer to campaign?
        </h1>
        <div className="w-full grid place-items-center">
          <Link to={`/home/createcampaign/inviteinf/${props.champaignId}?invite=true`}>
            <button className="text-center text-white bg-secondary py-1 px-14 mt-4 rounded-md">Invite</button>
          </Link>
        </div>
      </div>

    </>
  );
};


type ApplyProps = {
  userId: string;
  influencerId: string;
  fromuserId: string;
  touserId: string;
  champaignId: string;
  endAt: string;
  maxinf: number
};

const Apply = (props: ApplyProps) => {
  const [open, setOpen] = useState(false);
  const onCloseModal = () => setOpen(false);
  const [error, setError] = useState<string | null>(null);
  const [error1, setError1] = useState<string | null>(null);
  const messageRef = useRef<HTMLTextAreaElement>(null);
  const onOpenModal = async () => {
    let invites = 0;
    let req = {
      search: {
        status: "3",
        campaign: props.champaignId,
      },
    };
    const responseData = await axios.post(`${BaseUrl}/api/search-invite`, req);
    if (responseData.data.status == true) {
      invites = responseData.data.data.length;
    }

    if (new Date() >= new Date(props.endAt)) {
      return setError1("Campaign already ended.")
    } else if (invites > props.maxinf) {
      return setError1("Campaign is already full.")
    } else {
      setOpen(true);
    }
  };


  /**
   * Applies a campaign by sending a request to the server to add an invite.
   * @returns None
   * @throws {Error} If the message is blank or if there is an error adding the invite.
   */
  const applyChampaign = async () => {
    if (
      messageRef.current?.value == null ||
      messageRef.current?.value == undefined ||
      messageRef.current?.value == ""
    )
      return setError("Message can't be blank");
    let req = {
      campaignId: props.champaignId,
      influencerId: props.influencerId,
      fromUserId: props.fromuserId,
      toUserId: props.touserId,
      inviteMessage: messageRef.current?.value,
    };

    const search_invite = await axios.post(`${BaseUrl}/api/search-invite`, {
      search: {
        status: "1",
        campaign: props.champaignId,
        influencer: props.userId
      },
    });
    if (search_invite.data.status) {
      setError("Invite request already pending.");
    } else {
      const data = await axios.post(`${BaseUrl}/api/add-invite`, req);
      if (data.data.status == false) {
        setError(data.data.message);
      } else {
        messageRef!.current!.value = "";
        onCloseModal();
      }
      window.location.reload();
    }

  };
  return (
    <>
      <div className="p-4 rounded-xl shadow-xl bg-primary">
        <h1 className="text-white text-xl text-left font-normal">
          Would you like to participate in this campaign?
        </h1>
        <div className="w-full grid place-items-center" onClick={onOpenModal}>
          {error1 == "" || error1 == null || error1 == undefined ? null : (
            <div className="w-full py-1 bg-red-500 text-center rounded-md text-white text-md font-normal text-md my-2">
              {error1}
            </div>
          )}
          <CusButton
            text="Apply"
            textColor={"text-white"}
            background={"bg-secondary"}
          ></CusButton>
        </div>
      </div>
      <div
        className={`w-full h-screen bg-gray-500 fixed top-0 left-0 bg-opacity-30 grid place-items-center ${open ? "fixed" : "hidden"
          } `}
      >
        <div className="p-6 bg-white rounded-xl shadow-xl w-96">
          <div className="flex">
            <div className="grow"></div>
            <div onClick={onCloseModal}>
              <FontAwesomeIcon
                icon={faRemove}
                className="font-bold text-2xl text-center text-primary"
              ></FontAwesomeIcon>
            </div>
          </div>
          <h1 className="text-primary text-lg font-bold text-left">Connect</h1>
          <p className="text-lg font-normal">Subject : Apply for campaign</p>
          <textarea
            ref={messageRef}
            className="p-4 w-full h-40 outline-none border-2 bg-[#EEEEEE] focus:border-gray-300 rounded-md resize-none mt-4"
            placeholder="message"
          ></textarea>
          {error == "" || error == null || error == undefined ? null : (
            <div className="bg-red-500 bg-opacity-10 border-2 text-center border-red-500 rounded-md text-red-500 text-md font-normal text-md my-4">
              {error}
            </div>
          )}
          <div className="flex">
            <div className="grow"></div>
            <div onClick={applyChampaign}>
              <CusButton
                text="send"
                background="bg-primary"
                textColor={"text-white"}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

type BudgetProps = {
  costperpost: string;
  totalbudget: string;
  currecny: string;
  isbid: boolean;
};

/**
 * Renders a component that displays budget information.
 * @param {BudgetProps} props - The props object containing the budget information.
 * @returns JSX element representing the budget component.
 */
const Budget = (props: BudgetProps) => {
  return (
    <>
      <div className="rounded-xl shadow-xl bg-white p-4 w-full">
        <div className="flex">
          <MdiDatabase className="text-xl text-primary" />
          <h2 className="text-xl text-primary font-medium px-4">Budget</h2>
        </div>
        <div className="h-[1px] bg-gray-500 w-full my-2 "></div>
        <div className="flex my-2">
          <p className="text-md text-primary">Cost per post (USD)</p>
          <div className="grow"></div>
          <p className="text-md font-bold text-primary">
            {props.costperpost.toString().split(".")[0]} {props.currecny}
          </p>
        </div>
        {props.isbid ? null :
          <div className="flex my-2">
            <p className="text-md text-primary">Total budget</p>
            <div className="grow"></div>
            <p className="text-md font-bold text-black">
              {props.totalbudget} {props.currecny}
            </p>
          </div>
        }
      </div>
    </>
  );
};

/**
 * Renders a component that displays a message indicating that a request is in progress.
 * @returns {JSX.Element} - The rendered component.
 */
const Panding = () => {
  return (
    <>
      <div className="p-4 rounded-xl shadow-xl bg-primary">
        <h1 className="text-white text-xl text-left font-normal">
          Your request is in progress..
        </h1>
      </div>
    </>
  );
};

type ChampaingAcceptRequestIProps = {
  campaingid: string;
  userId: string;
};

/**
 * Renders a component that displays a list of pending invite requests for a campaign.
 * @param {ChampaingAcceptRequestIProps} props - The component props.
 * @returns The rendered component.
 */
const ChampaingAcceptRequestI = (props: ChampaingAcceptRequestIProps) => {
  const [resinvite, setRequestinvite] = useState<any[]>([]);

  const init = async () => {
    let req = {
      search: {
        status: "1",
        campaign: props.campaingid,
        fromUser: props.userId
      },
    };
    const responseData = await axios.post(`${BaseUrl}/api/search-invite`, req);
    if (responseData.data.status == true) {
      setRequestinvite(responseData.data.data);
    }
  };


  useEffect(() => {
    init();
  }, []);

  return (
    <>
      <div>
        {resinvite.length == 0 ? (
          <div className="text-center text-rose-500">No Invite request is pending</div>
        ) : (
          <div className="flex flex-wrap gap-6">
            {resinvite.map((val: any, index: number) => {
              return (
                <div
                  key={index}
                  className="bg-white rounded-lg shadow-lg w-80"
                >
                  <div>
                    <img
                      src={val.influencer.pic}
                      alt="influencer pic"
                      className="w-full h-44 shrink-0 rounded-t-md object-center object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <p className="text-lg font-medium text-left grow">{val.influencer.name.toString().split("@")[0]}</p>
                    <p className="mt-2 text-md font-medium">Message</p>
                    <p className="text-sm font-medium">{val.inviteMessage}</p>

                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
};

type ChampaingAcceptRequestRProps = {
  campaingid: string;
  userId: string;
};

/**
 * Component for displaying and managing acceptance and rejection of campaign requests.
 * @param {ChampaingAcceptRequestRProps} props - The component props.
 * @returns The rendered component.
 */
const ChampaingAcceptRequestR = (props: ChampaingAcceptRequestRProps) => {
  const [resinvite, setRequestinvite] = useState<any[]>([]);
  const [acceptbox, setAcceptbox] = useState<boolean>(false);
  const [rejectbox, setrejectbox] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const rejectiontextRef = useRef<HTMLInputElement>(null);
  const [id, setId] = useState<string | null>(null);

  const init = async () => {
    let req = {
      search: {
        status: "1",
        campaign: props.campaingid,
        toUser: props.userId
      },
    };
    const responseData = await axios.post(`${BaseUrl}/api/search-invite`, req);
    if (responseData.data.status == true) {
      setRequestinvite(responseData.data.data);
    }
  };

  const acceptRequest = async () => {
    let req = { id: id, status: "3" };
    const responseData = await axios.post(`${BaseUrl}/api/update-invite`, req);
    if (responseData.data.staus == false)
      return setError(responseData.data.message);
    setAcceptbox(false);
    window.location.reload();
  };

  const rejectRequest = async () => {
    if (
      rejectiontextRef.current?.value == null ||
      rejectiontextRef.current?.value == undefined ||
      rejectiontextRef.current?.value == ""
    )
      return setError("Fell the reason.");
    let req = {
      id: id,
      status: "5",
      rejectReason: rejectiontextRef.current?.value,
    };
    const responseData = await axios.post(`${BaseUrl}/api/update-invite`, req);
    if (responseData.data.staus == false)
      return setError(responseData.data.message);
    rejectiontextRef.current!.value == "";
    setrejectbox(false);
    window.location.reload();
  };

  useEffect(() => {
    init();
  }, []);

  return (
    <>
      <div
        className={`fixed top-0 left-0  h-screen w-full bg-slate-900 bg-opacity-10 place-items-center ${acceptbox ? "grid" : "hidden"
          }`}
      >
        <div className="bg-white w-72 shadow-lg p-4 rounded-lg">
          <p className="text-center font-medium text-2xl">Accept</p>
          <div className="w-full bg-gray-400 h-[1px] my-2"></div>
          <p className="text-center font-medium text-gray-800">
            Are you sure you want to accept this?
          </p>
          {error == "" || error == null || error == undefined ? null : (

            <div className="bg-red-500 bg-opacity-10 border-2 text-center border-red-500 rounded-md text-red-500 text-md font-normal text-md my-4">
              {error}
            </div>
          )}
          <div className="flex mt-2 gap-4">
            <button
              onClick={acceptRequest}
              className="py-2 text-center text-black text-lg font-semibold bg-[#ff88bb] rounded-md my-2  grow inline-block"
            >
              Accept
            </button>
            <button
              onClick={() => {
                setAcceptbox(false);
              }}
              className="py-2 text-center text-black text-lg font-semibold bg-[#d6d6d6] rounded-md my-2  grow inline-block"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
      <div
        className={`fixed top-0 left-0  h-screen w-full bg-slate-900 bg-opacity-10 place-items-center ${rejectbox ? "grid" : "hidden"
          }`}
      >
        <div className="bg-white w-72 shadow-lg p-4 rounded-lg">
          <p className="text-center font-medium text-2xl">Reject</p>
          <div className="w-full bg-gray-400 h-[1px] my-2"></div>
          <input
            ref={rejectiontextRef}
            type="text"
            className="w-full bg-gray-200 rounded-lg  px-2 py-1 my-2 outline-none"
            placeholder="Enter the reason of rejection."
          />
          {error == "" || error == null || error == undefined ? null : (
            <div className="bg-red-500 bg-opacity-10 border-2 text-center border-red-500 rounded-md text-red-500 text-md font-normal text-md my-4">
              {error}
            </div>
          )}
          <div className="flex mt-2 gap-4">
            <button
              onClick={rejectRequest}
              className="py-2 text-center text-black text-lg font-semibold bg-[#ff1177] rounded-md my-2  grow inline-block"
            >
              Reject
            </button>
            <button
              onClick={() => {
                setrejectbox(false);
              }}
              className="py-2 text-center text-black text-lg font-semibold bg-[#d6d6d6] rounded-md my-2  grow inline-block"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
      <div>
        {resinvite.length == 0 ? (
          <NOTICEAlerts message="No Invite request is pending"></NOTICEAlerts>
        ) : (
          <div className="flex flex-nowrap overflow-x-scroll md:overflow-auto md:grid xs:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 w-full">
            {resinvite.map((val: any, index: number) => {
              return (
                <div
                  key={index}
                  className="bg-white rounded-lg shadow-lg w-80 md:w-auto"
                >
                  <div>
                    <img
                      src={val.influencer.pic}
                      alt="influencer pic"
                      className="w-full h-44 shrink-0 rounded-t-md object-center object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <p className="text-lg font-medium text-left grow">{val.influencer.name.toString().split("@")[0]}</p>
                    <p className="mt-2 text-md font-medium">Message</p>
                    <p className="text-sm font-medium">{val.inviteMessage}</p>
                    <div className="flex gap-4 mt-2">
                      <button
                        onClick={() => {
                          setId(val.id);
                          setAcceptbox(true);
                        }}
                        className="py-2 text-center text-black text-lg font-semibold bg-[#ff88bb] rounded-md my-2  grow inline-block"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => {
                          setId(val.id);
                          setrejectbox(true);
                        }}
                        className="py-2 text-center text-black text-lg font-semibold bg-[#d6d6d6] rounded-md my-2  grow inline-block"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
};


type JoinedInfluencerProps = {
  campaingid: string;
};

/**
 * Represents a component that displays a list of joined influencers for a campaign.
 * @param {JoinedInfluencerProps} props - The props for the component.
 * @returns JSX element representing the list of joined influencers.
 */
const JoinedInfluencer = (props: JoinedInfluencerProps) => {
  const [resinvite, setRequestinvite] = useState<any[]>([]);
  const init = async () => {
    let req = {
      search: {
        status: "3",
        campaign: props.campaingid,
      },
    };
    const responseData = await axios.post(`${BaseUrl}/api/search-invite`, req);
    if (responseData.data.status == true) {
      setRequestinvite(responseData.data.data);
    }
  };


  useEffect(() => {
    init();
  }, []);

  return (
    <>
      {resinvite.length == 0 ? (
        <NOTICEAlerts message="No Influencer connected to this campaign."></NOTICEAlerts>
      ) : (
        <div className="flex flex-nowrap overflow-x-scroll md:overflow-auto md:grid xs:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 w-full">
          {resinvite.map((val: any, index: number) => {
            return (
              <div
                key={index}
                className="bg-white rounded-lg shadow-lg w-80 md:w-auto"
              >
                <div>
                  <img
                    src={val.influencer.pic}
                    alt="influencer pic"
                    className="w-full h-44 shrink-0 rounded-t-md object-center object-cover"
                  />
                </div>
                <div className="p-4">
                  <p className="text-lg font-medium text-left grow">{val.influencer.name.toString().split("@")[0]}</p>
                  {/* <p className="mt-2 text-md font-medium">Message</p>
                  <p className="text-sm font-medium">{val.inviteMessage}</p> */}
                  <Link to={`/home/myuser/${val.influencer.id}`}
                    className="py-2 text-center text-black text-lg font-semibold bg-[#ff88bb] rounded-md my-2  w-full inline-block"
                  >
                    View
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
};




type SnapshotChampaingAcceptRequestIProps = {
  campaingid: string;
  userId: string;
  isUser: boolean;
};

/**
 * A functional component that displays a list of invite requests for a snapshot campaign.
 * @param {SnapshotChampaingAcceptRequestIProps} props - The component props.
 * @returns The JSX element representing the component.
 */
const SnapshotChampaingAcceptRequestI: React.FC<SnapshotChampaingAcceptRequestIProps> = (props: SnapshotChampaingAcceptRequestIProps) => {
  const [resinvite, setRequestinvite] = useState<any[]>([]);
  const init = async () => {
    let req: any = {
      search: {
        campaign: props.campaingid
      }
    };

    if (props.isUser) {
      req.search.toUser = props.userId;
    } else {
      req.search.fromUser = props.userId;
    }




    const responseData = await axios({
      method: "post",
      url: `${BaseUrl}/api/search-invite`,
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




    if (responseData.data.status == true) {
      if (props.isUser) {
        setRequestinvite(responseData.data.data);
      } else {
        setRequestinvite(responseData.data.data);
      }
    }
  };


  useEffect(() => {
    init();
  }, []);

  return (
    <>
      <div>
        {resinvite.length == 0 ? (
          <NOTICEAlerts message="No Invite request is pending"></NOTICEAlerts>
        ) : (
          <div className="flex flex-nowrap overflow-x-scroll md:overflow-auto md:grid xs:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 w-full">
            {resinvite.map((val: any, index: number) => {
              return (
                <div
                  key={index}
                  className="bg-white rounded-lg shadow-lg w-80 md:w-auto"
                >
                  <div>
                    <img
                      src={props.isUser ? val.brand.logo : val.influencer.pic}
                      alt="influencer pic"
                      className="w-full h-44 shrink-0 rounded-t-md object-center object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <p className="mt-2 text-lg font-medium">{props.isUser ? val.brand.name : val.influencer.name.toString().split("@")[0]}</p>

                    <p className="mt-2 text-md font-medium">Message</p>
                    <p className="text-sm font-medium">{val.inviteMessage}</p>

                    <p className="mt-2 text-md font-medium">Status</p>
                    <p
                      className={`mt-2 text-md text-black font-semibold py-2 text-center rounded-md ${val.status.name == "ACCEPTED"
                        ? "bg-[#beff80]"
                        : val.status.name == "PENDING"
                          ? "bg-[#80fffa]"
                          : "bg-[#ff88bb]"
                        }`}
                    >
                      {val.status.name}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
};


type SnapshotChampaingAcceptRequestRProps = {
  campaingid: string;
  userId: string;
  isUser: boolean;
};

const SnapshotChampaingAcceptRequestR: React.FC<SnapshotChampaingAcceptRequestRProps> = (props: SnapshotChampaingAcceptRequestRProps) => {
  const [resinvite, setRequestinvite] = useState<any[]>([]);
  const init = async () => {
    let req: any = {
      search: {
        campaign: props.campaingid,
      }
    };

    if (props.isUser) {
      req.search.fromUser = props.userId;
    } else {
      req.search.toUser = props.userId;
    }




    const responseData = await axios.post(`${BaseUrl}/api/search-invite`, req);

    if (responseData.data.status == true) {
      if (props.isUser) {
        setRequestinvite(responseData.data.data);
      } else {
        const fildata = responseData.data.data.filter((val: any) => val.status.code == 5 || val.status.code == 3);
        setRequestinvite(fildata);
      }
    }
  };


  useEffect(() => {
    init();
  }, []);

  return (
    <>
      <div>
        {resinvite.length == 0 ? (
          <NOTICEAlerts message="No Accepted/Rejected requests."></NOTICEAlerts>
        ) : (
          <div className="flex flex-nowrap overflow-x-scroll md:overflow-auto md:grid xs:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 w-full">
            {resinvite.map((val: any, index: number) => {
              return (
                <div
                  key={index}
                  className="bg-white rounded-lg shadow-lg w-80 md:w-auto"
                >
                  <div>
                    <img
                      src={props.isUser ? val.brand.logo : val.influencer.pic}
                      alt="influencer pic"
                      className="w-full h-44 shrink-0 rounded-t-md object-center object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <p className="mt-2 text-lg font-medium">{props.isUser ? val.brand.name : val.influencer.name.toString().split("@")[0]}</p>

                    <p className="mt-2 text-md font-medium">Message</p>
                    <p className="text-sm font-medium">{val.inviteMessage}</p>

                    <p className="mt-2 text-md font-medium">Status</p>
                    <p
                      className={`mt-2 text-md text-black font-semibold py-2 text-center rounded-md ${val.status.name == "ACCEPTED"
                        ? "bg-[#beff80]"
                        : val.status.name == "PENDING"
                          ? "bg-[#80fffa]"
                          : "bg-[#ff88bb]"
                        }`}
                    >
                      {val.status.name}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
};


type DraftAcceptRequestProps = {
  campaingid: string;
  userId: string;
};

/**
 * Component for handling the acceptance and rejection of draft requests.
 * @param {DraftAcceptRequestProps} props - The props for the component.
 * @returns The JSX element representing the component.
 */
const DraftAcceptRequest = (props: DraftAcceptRequestProps) => {
  const [resinvite, setRequestinvite] = useState<any[]>([]);
  const [acceptbox, setAcceptbox] = useState<boolean>(false);
  const [rejectbox, setrejectbox] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const rejectiontextRef = useRef<HTMLInputElement>(null);
  const [id, setId] = useState<string | null>(null);


  const init = async () => {
    let req = {
      search: {
        status: "1",
        campaign: props.campaingid,
        toUser: props.userId,
      },
    };
    const responseData = await axios.post(`${BaseUrl}/api/search-draft`, req);
    if (responseData.data.status == true) {
      setRequestinvite(responseData.data.data);
    }


  };

  const acceptRequest = async () => {
    let req = { id: id, status: "3" };
    const responseData = await axios.post(`${BaseUrl}/api/update-draft`, req);
    if (responseData.data.staus == false)
      return setError(responseData.data.message);
    setAcceptbox(false);
    window.location.reload();
  };

  const rejectRequest = async () => {
    if (
      rejectiontextRef.current?.value == null ||
      rejectiontextRef.current?.value == undefined ||
      rejectiontextRef.current?.value == ""
    )
      return setError("Fell the reason.");
    let req = {
      id: id,
      status: "5",
      rejectReason: rejectiontextRef.current?.value,
    };
    const responseData = await axios.post(`${BaseUrl}/api/update-draft`, req);
    if (responseData.data.staus == false)
      return setError(responseData.data.message);
    rejectiontextRef.current!.value == "";
    setrejectbox(false);
    window.location.reload();
  };

  useEffect(() => {
    init();
  }, []);

  return (
    <>
      <div
        className={`fixed top-0 left-0  h-screen w-full bg-slate-900 bg-opacity-10 place-items-center ${acceptbox ? "grid" : "hidden"
          }`}
      >
        <div className="bg-white w-72 shadow-lg p-4 rounded-lg">
          <p className="text-center font-medium text-2xl">Accept</p>
          <div className="w-full bg-gray-400 h-[1px] my-2"></div>
          <p className="text-center font-medium text-gray-800">
            Are you sure you want to accept this draft?
          </p>
          {error == "" || error == null || error == undefined ? null : (
            <div className="bg-red-500 bg-opacity-10 border-2 text-center border-red-500 rounded-md text-red-500 text-md font-normal text-md my-4">
              {error}
            </div>
          )}
          <div className="flex mt-2 gap-4">
            <button
              onClick={acceptRequest}
              className="py-2 text-center text-black text-lg font-semibold bg-[#ff88bb] rounded-md my-2  grow inline-block"
            >
              Accept
            </button>
            <button
              onClick={() => {
                setAcceptbox(false);
              }}
              className="py-2 text-center text-black text-lg font-semibold bg-[#d6d6d6] rounded-md my-2 grow inline-block"
            >
              Cancel
            </button>

          </div>
        </div>
      </div>
      <div
        className={`fixed top-0 left-0  h-screen w-full bg-slate-900 bg-opacity-10 place-items-center ${rejectbox ? "grid" : "hidden"
          }`}
      >
        <div className="bg-white w-72 shadow-lg p-4 rounded-lg">
          <p className="text-center font-medium text-2xl">Reject</p>
          <div className="w-full bg-gray-400 h-[1px] my-2"></div>
          <input
            ref={rejectiontextRef}
            type="text"
            className="w-full bg-gray-200 rounded-lg  px-2 py-1 my-2 outline-none"
            placeholder="Enter the reason of rejection."
          />
          {error == "" || error == null || error == undefined ? null : (
            <div className="bg-red-500 bg-opacity-10 border-2 text-center border-red-500 rounded-md text-red-500 text-md font-normal text-md my-4">
              {error}
            </div>
          )}
          <div className="flex mt-2 gap-4">
            <button
              onClick={() => {
                setrejectbox(false);
              }}
              className="py-2 text-center text-black text-lg font-semibold bg-[#d6d6d6] rounded-md my-2 grow inline-block"
            >
              Cancel
            </button>
            <button
              onClick={rejectRequest}
              className="py-2 text-center text-black text-lg font-semibold bg-[#ff88bb] rounded-md my-2  grow inline-block"
            >
              Reject
            </button>
          </div>
        </div>
      </div>
      <div>
        {resinvite.length == 0 ? (
          <NOTICEAlerts message="No draft request is pending"></NOTICEAlerts>
        ) : (
          <div>

            <div className="flex flex-nowrap overflow-x-scroll md:overflow-auto md:grid xs:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 w-full">
              {resinvite.map((val: any, index: number) => {
                return (
                  <div
                    key={index}
                    className="bg-white rounded-lg shadow-lg w-80 md:w-auto"
                  >
                    <div>
                      <img
                        src={val.influencer.pic}
                        alt="influencer pic"
                        className="w-full h-44 shrink-0 rounded-t-md object-center object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <p className="text-lg font-medium text-left grow">{val.influencer.name.split("@")[0]}</p>
                      <p className="mt-2 text-md font-medium">Description</p>
                      <p className="text-sm font-medium">{val.description}</p>



                      <p className="mt-4 text-lg font-medium">Platforms</p>
                      <div className="rounded-full p-[0.15rem] border-2 border-blue-500 h-10 w-10">
                        <img src={val.handle.platform.logo} alt="platform" className="w-full h-full shrink-0 rounded-md object-fill object-center" />
                      </div>
                      <a
                        target="_blank"
                        className="rounded-md mt-4 w-full text-lg text-center font-semibold  inline-block my-2 py-2  text-black bg-[#fbca8e]"
                        href={val.attach01}
                      >
                        View attachment
                      </a>
                      <div className="flex gap-4 mt-2">
                        <button
                          onClick={() => {
                            setId(val.id);
                            setAcceptbox(true);
                          }}
                          className="py-2 text-center text-black text-lg font-semibold bg-[#beff80] rounded-md my-2  grow inline-block"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => {
                            setId(val.id);
                            setrejectbox(true);
                          }}
                          className="py-2 text-center text-black text-lg font-semibold bg-[#d6d6d6] rounded-md my-2 grow inline-block"
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </>
  );
};


type SnapshotDraftAcceptRequestProps = {
  campaingid: string;
  userId: string;
  isUser: boolean;
};

/**
 * Renders a component that displays a list of accepted or rejected draft requests.
 * @param {SnapshotDraftAcceptRequestProps} props - The component props.
 * @returns The rendered component.
 */
const SnapshotDraftAcceptRequest = (props: SnapshotDraftAcceptRequestProps) => {
  const [resinvite, setRequestinvite] = useState<any[]>([]);

  const init = async () => {
    let req: any = {
      search: {},
    };

    if (props.isUser) {
      req.search.influencer = props.userId;
      req.search.campaign = props.campaingid;
    } else {
      req.search.campaign = props.campaingid;
    }

    const responseData = await axios.post(`${BaseUrl}/api/search-draft`, req);
    if (responseData.data.status == true) {
      if (props.isUser) {
        setRequestinvite(responseData.data.data);
      } else {
        const fildata = responseData.data.data.filter((val: any) => val.status.code == 5);
        setRequestinvite(fildata);
      }
    }

  };

  useEffect(() => {
    init();
  }, []);

  return (
    <>
      <div>
        {resinvite.length == 0 ? (
          <NOTICEAlerts message="No Accepted/Rejected draft request."></NOTICEAlerts>
        ) : (
          <div>
            <div className="flex flex-nowrap overflow-x-scroll md:overflow-auto md:grid xs:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 w-full">
              {resinvite.map((val: any, index: number) => {
                return (
                  <div
                    key={index}
                    className="bg-white rounded-lg shadow-lg w-80 md:w-auto"
                  >
                    <div>
                      <img
                        src={val.influencer.pic}
                        alt="influencer pic"
                        className="w-full h-44 shrink-0 rounded-t-md object-center object-cover"
                      />
                    </div>
                    <div className="p-4">

                      <div className="items-center flex gap-3">
                        <p className="text-lg font-medium text-left grow">{val.influencer.name.split("@")[0]}</p>
                        <p className="text-sm text-gray-500 font-normal">{new Date(val["updatedAt"]).toDateString()}</p>
                      </div>
                      <p className="mt-2 text-md font-medium">Description</p>
                      <p className="text-sm font-medium">{val.description}</p>

                      <p className="mt-4 text-lg font-medium">Platforms</p>
                      <div className="rounded-full p-[0.15rem] border-2 border-blue-500 h-10 w-10">
                        <img src={val.handle.platform.logo} alt="platform" className="w-full h-full shrink-0 rounded-md object-fill object-center" />
                      </div>
                      <a
                        target="_blank"
                        className="rounded-md mt-4 w-full text-lg text-center font-semibold  inline-block my-2 py-2  text-black bg-[#fbca8e]"
                        href={val.attach01}
                      >
                        View attachment
                      </a>
                      <p
                        className={`mt-2 py-2 text-md text-black text-lg font-semibold text-center rounded-md ${val.status.name == "ACCEPTED"
                          ? "bg-[#beff80]"
                          : val.status.name == "PENDING"
                            ? "bg-[#80fffa]"
                            : "bg-[#ff88bb]"
                          }`}
                      >
                        {val.status.name}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

/**
 * Represents the properties of a rejected request.
 * @typedef {Object} RejectedProps
 * @property {string} userId - The ID of the user who made the request.
 * @property {string} influencerId - The ID of the influencer involved in the request.
 * @property {string} fromuserId - The ID of the user who sent the request.
 * @property {string} touserId - The ID of the user who received the request.
 * @property {string} champaignId - The ID of the campaign associated with the request.
 * @property {string} reason - The reason for rejecting the request.
 */
type RejectedProps = {
  userId: string;
  influencerId: string;
  fromuserId: string;
  touserId: string;
  champaignId: string;
  reason: string;
};

/**
 * A React functional component that displays a rejected request message and allows the user to apply again.
 * @param {RejectedProps} props - The props object containing the necessary data for the component.
 * @returns JSX elements representing the rejected request message and apply again functionality.
 */
const Rejected = (props: RejectedProps) => {
  const [open, setOpen] = useState(false);
  const onOpenModal = () => setOpen(true);
  const onCloseModal = () => setOpen(false);
  const [error, setError] = useState<string | null>(null);
  const messageRef = useRef<HTMLTextAreaElement>(null);

  const applyChampaign = async () => {
    if (
      messageRef.current?.value == null ||
      messageRef.current?.value == undefined ||
      messageRef.current?.value == ""
    )
      return setError("Message can't be blank");
    let req = {
      campaignId: props.champaignId,
      influencerId: props.influencerId,
      fromUserId: props.fromuserId,
      toUserId: props.touserId,
      inviteMessage: messageRef.current?.value,
    };

    const data = await axios.post(`${BaseUrl}/api/add-invite`, req);
    if (data.data.status == false) {
      setError(data.data.message);
    } else {
      messageRef!.current!.value = "";
      onCloseModal();
    }
    window.location.reload();
  };
  return (
    <>
      <div className="p-4 rounded-xl shadow-xl bg-primary">
        <h1 className="text-white text-xl text-left font-normal">
          Your request has been rejected..
        </h1>
        <p className="text-white font-normal text-md">
          Reason : {props.reason}
        </p>
        <div className="w-full grid place-items-center" onClick={onOpenModal}>
          <CusButton
            text="Apply again!"
            textColor={"text-white"}
            background={"bg-secondary"}
          ></CusButton>
        </div>
      </div>
      <div
        className={`w-full h-screen bg-gray-500 fixed top-0 left-0 bg-opacity-30 grid place-items-center ${open ? "fixed" : "hidden"
          } `}
      >
        <div className="p-6 bg-white rounded-xl shadow-xl w-96">
          <div className="flex">
            <div className="grow"></div>
            <div onClick={onCloseModal}>
              <FontAwesomeIcon
                icon={faRemove}
                className="font-bold text-2xl text-center text-primary"
              ></FontAwesomeIcon>
            </div>
          </div>
          <h1 className="text-primary text-lg font-bold text-left">Connect</h1>
          <p className="text-lg font-normal">Subject : Apply for campaign</p>
          <textarea
            ref={messageRef}
            className="p-4 w-full h-40 outline-none border-2 bg-[#EEEEEE] focus:border-gray-300 rounded-md resize-none mt-4"
            placeholder="message"
          ></textarea>
          {error == "" || error == null || error == undefined ? null : (
            <div className="bg-red-500 bg-opacity-10 border-2 text-center border-red-500 rounded-md text-red-500 text-md font-normal text-md my-4">
              {error}
            </div>
          )}
          <div className="flex">
            <div className="grow"></div>
            <div onClick={applyChampaign}>
              <CusButton
                text="send"
                background="bg-primary"
                textColor={"text-white"}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

type CreateDraftProps = {
  platforms: any[];
  influencerId: string;
  champaingId: string;
};

/**
 * Component for creating a campaign draft.
 * @param {CreateDraftProps} props - The props for creating a campaign draft.
 * @returns JSX element representing the create draft component.
 */
const CreateDraft = (props: CreateDraftProps) => {

  const datepicker = useRef<HTMLInputElement | null>(null);
  const inputFile = useRef<HTMLInputElement | null>(null);
  const descraption = useRef<HTMLTextAreaElement | null>(null);
  const [pdfFile, setPdfFile] = useState<File>();
  const [platform, setPlatform] = useState<any>(null);
  const [createbox, setCreatebox] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [isCreating, setIsCreating] = useState<boolean>(false);

  return (
    <>
      {createbox ? (
        <>
          <div className="p-4 bg-white mt-1 rounded-lg">
            <p className="text-sm text-normal font-semibold py-1 text-primary">
              Create campaign draft
            </p>
            <div className="flex gap-2 mt-2 overflow-x-scroll no-scrollbar py-4">
              {props.platforms.map((val: any, i: number) => {
                return (
                  <div
                    key={i}
                    className={`shrink-0  p-2 rounded-lg ${platform == val.id ? "bg-white shadow-xl " : "bg-gray-200"
                      } `}
                    onClick={() => {
                      setPlatform(val.id);
                    }}
                  >
                    <img
                      src={props.platforms[i]["platform"]["logo"]}
                      alt="error"
                      className="w-10 h-10 object-center object-cover"
                    />
                  </div>
                );
              })}
            </div>
            <div className="bg-[#EEEEEE] w-full h-10 rounded-lg flex items-center pl-4">
              <h3 className="text-black font-semibold  text-md">
                {pdfFile == null ? "" : pdfFile.name.length >= 25 ? `${pdfFile.name.toString().slice(0, 25)}...` : pdfFile.name}
              </h3>
              <div className="grow"></div>
              <div
                className="grid place-items-center px-4 bg-gray-300 rounded-lg cursor-pointer h-full"
                onClick={() => {
                  inputFile!.current!.click();
                }}
              >
                <FontAwesomeIcon icon={faPaperclip}></FontAwesomeIcon>
              </div>
            </div>
            <div className="hidden">
              <input
                ref={inputFile}
                type="file"
                accept="application/pdf"
                onChange={(value) => {
                  let file_size = parseInt(
                    (value!.target.files![0].size / 1024 / 1024).toString()
                  );
                  if (file_size < 4) {
                    setError(null);
                    setPdfFile(value!.target.files![0]);
                  } else {
                    setError("Pdf file size must be less then 4 mb");
                  }
                }}
              />
            </div>
            <input
              type={"date"}
              ref={datepicker}
              className="bg-[#EEEEEE] outline-none border-none rounded-lg focus:border-gray-300 mt-4 w-full p-2"
            ></input>
            <textarea
              ref={descraption}
              className="focus:border-none focus:outline-none mt-4 p-4 w-full h-20 outline-none border-2 bg-[#EEEEEE] focus:border-gray-300 rounded-md resize-none"
              placeholder="description..."
            ></textarea>
            {error == "" || error == null || error == undefined ? null : (
              <div className="bg-red-500 bg-opacity-10 border-2 text-center border-red-500 rounded-md text-red-500 text-md font-normal text-md my-4">
                {error}
              </div>
            )}
            {isCreating ?

              <div
                className="text-white bg-primary rounded-lg w-full text-center py-2 font-semibold text-md mt-2"
              >
                Creating...
              </div>
              :

              <button
                onClick={async () => {
                  setIsCreating((vla) => true);
                  if (
                    platform == null ||
                    platform == undefined ||
                    platform == 0 ||
                    platform == ""
                  ) {
                    setError("Select the platform.");
                  } else if (pdfFile == null || pdfFile == undefined) {
                    setError("Select the pdf file.");
                  } else if (
                    datepicker.current?.value == null ||
                    datepicker.current?.value == undefined ||
                    datepicker.current?.value == ""
                  ) {
                    setError("Select the date.");
                  } else if (
                    descraption.current?.value == null ||
                    descraption.current?.value == undefined ||
                    descraption.current?.value == ""
                  ) {
                    setError("Write the description.");
                  } else {

                    const pdfurl = await UploadFile(pdfFile!);
                    if (pdfurl.status) {
                      let req = {
                        campaignId: props.champaingId,
                        influencerId: props.influencerId,
                        handleId: platform,
                        publishAt: datepicker.current?.value,
                        attach01: pdfurl.data,
                        description: descraption.current?.value,
                      };
                      const data = await axios({
                        method: "post",
                        url: `${BaseUrl}/api/add-draft`,
                        data: req,
                      });
                      if (data.data.status == false) {
                        return setError(data.data.message);
                      } else {
                        window.location.reload();
                      }
                    } else {
                      setError(pdfurl.data);
                    }
                  }
                  setIsCreating((vla) => false);
                }}
                className="text-white bg-primary rounded-lg w-full text-center py-2 font-semibold text-md mt-2"
              >
                Submit
              </button>
            }
          </div>
        </>
      ) : (
        <>
          <div className="p-4 bg-white mt-2 rounded-md">
            <p className="text-sm text-normal font-semibold py-1 text-primary">
              Create campaign draft
            </p>
            <button
              onClick={() => {
                setCreatebox(true);
              }}
              className="text-white bg-primary rounded-lg w-full text-center py-2 font-semibold text-md mt-2"
            >
              Create
            </button>
          </div>
        </>
      )}
    </>
  );
};

type ChampaingPaymentRequestProps = {
  campaingid: string;
  userid: string;
  currency: string;
  baseUrl: string;
};

/**
 * Component for handling payment requests in a campaign.
 * @param {ChampaingPaymentRequestProps} props - The props for the component.
 * @returns JSX elements for rendering the payment request component.
 */
const ChampaingPaymentRequest = (props: ChampaingPaymentRequestProps) => {
  const [respayment, setRequestPayment] = useState<any[]>([]);

  const [acceptbox, setAcceptbox] = useState<boolean>(false);
  const [rejectbox, setrejectbox] = useState<boolean>(false);

  const [error, setError] = useState<string | null>(null);
  const [id, setId] = useState<string | null>(null);
  const [amount, setAmount] = useState<string | null>(null);

  const init = async () => {
    let req = {
      search: {
        campaign: props.campaingid,
      },
    };
    const responseData = await axios.post(`${BaseUrl}/api/get-req-pay`, req);
    if (responseData.data.status == true) {
      setRequestPayment(responseData.data.data);
    }
  };

  useEffect(() => {
    init();
  }, []);

  const acceptRequest = async () => {
    let req = {
      id: id,
      status: "2",
      refNo: `${new Date().toLocaleDateString()}_${props.userid}_${props.campaingid
        }`,
    };
    const responseData = await axios.post(`${BaseUrl}/api/update-payment`, req);
    if (responseData.data.staus == false)
      return setError(responseData.data.message);
    setAcceptbox(false);
    window.location.reload();
  };

  const rejectRequest = async () => {
    let req = { id: id, status: "3" };
    const responseData = await axios.post(`${BaseUrl}/api/update-payment`, req);
    if (responseData.data.staus == false)
      return setError(responseData.data.message);
    setrejectbox(false);
    window.location.reload();
  };

  const handlepayment = async (amount: string, id: string) => {

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Example Product",
              images: [
                "https://plus.unsplash.com/premium_photo-1684952849219-5a0d76012ed2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1032&q=80",
              ],
            },
            unit_amount: parseInt(amount) * 100, // Amount in cents
          },
          quantity: 1,
        },
      ],
      success_url: `${props.baseUrl}/success/${id}`,
      cancel_url: `${props.baseUrl}/cancel`,
    });
    window.location.assign(session.url == null ? "" : session.url);
  };

  return (
    <>
      <div
        className={`fixed top-0 left-0  h-screen w-full bg-slate-900 bg-opacity-10 place-items-center ${acceptbox ? "grid" : "hidden"
          }`}
      >
        <div className="bg-white w-72 shadow-lg p-4 rounded-lg">
          <p className="text-center font-medium text-2xl">Accept</p>
          <div className="w-full bg-gray-400 h-[1px] my-2"></div>
          <p className="text-center font-medium text-gray-800">
            Are you sure you want to accept this payment?
          </p>
          {error == "" || error == null || error == undefined ? null : (
            <div className="bg-red-500 bg-opacity-10 border-2 text-center border-red-500 rounded-md text-red-500 text-md font-normal text-md my-4">
              {error}
            </div>
          )}
          <div className="flex mt-2 gap-4">
            <button
              onClick={() => handlepayment(amount!, id!)}
              className="py-2 text-center text-black text-lg font-semibold bg-[#ff88bb] rounded-md my-2  grow inline-block"
            >
              Accept
            </button>
            <button
              onClick={() => {
                setAcceptbox(false);
              }}
              className="py-2 text-center text-black text-lg font-semibold bg-[#d6d6d6] rounded-md my-2 grow inline-block"
            >
              Cancel
            </button>

          </div>
        </div>
      </div>
      <div
        className={`fixed top-0 left-0  h-screen w-full bg-slate-900 bg-opacity-10 place-items-center ${rejectbox ? "grid" : "hidden"
          }`}
      >
        <div className="bg-white w-72 shadow-lg p-4 rounded-lg">
          <p className="text-center font-medium text-2xl">Reject</p>
          <p className="text-center font-medium text-gray-800">
            Are you sure you want to reject this payment?
          </p>
          {error == "" || error == null || error == undefined ? null : (
            <div className="bg-red-500 bg-opacity-10 border-2 text-center border-red-500 rounded-md text-red-500 text-md font-normal text-md my-4">
              {error}
            </div>
          )}
          <div className="flex gap-4 mt-2">
            <button
              onClick={rejectRequest}
              className="py-2 text-center text-black text-lg font-semibold bg-[#ff88bb] rounded-md my-2  grow inline-block"
            >
              Reject
            </button>
            <button
              onClick={() => {
                setrejectbox(false);
              }}
              className="py-2 text-center text-black text-lg font-semibold bg-[#d6d6d6] rounded-md my-2 grow inline-block"
            >
              Cancel
            </button>

          </div>
        </div>
      </div>
      <div>
        {respayment.length == 0 ? (
          <NOTICEAlerts message="No payment request is pending"></NOTICEAlerts>
        ) : (
          <div className="flex flex-nowrap overflow-x-scroll md:overflow-auto md:grid xs:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 w-full">
            {respayment.map((val: any, index: number) => {
              return (
                <div
                  key={index}
                  className="bg-white rounded-lg shadow-lg w-80 md:w-auto"
                >
                  <div>
                    <img
                      src={val.influencer.pic}
                      alt="influencer pic"
                      className="w-full h-44 shrink-0 rounded-t-md object-center object-cover"
                    />
                  </div>
                  <div className="p-4">


                    <div className="items-center flex gap-3">
                      <p className="text-lg font-medium text-left grow"> {val.influencer.name.split("@")[0]}</p>
                      <p className="text-sm text-gray-500 font-normal">{new Date(val["updatedAt"]).toDateString()}</p>
                    </div>

                    <p className="my-4 text-md text-gray-600 font-normal">Requested Amount : <span className="mx-4 font-semibold">${val.amount.toString().split(".")[0]}</span></p>
                    {parseInt(val.status.code) == 2 ? (
                      <p className="py-1 px-4 text-center text-white bg-green-500 rounded-md my-2">
                        Accepted
                      </p>
                    ) : parseInt(val.status.code) == 3 ? (
                      <p className="py-1 px-4 text-center text-white bg-red-500 rounded-md my-2">
                        Rejected
                      </p>
                    ) : (
                      <div className="flex gap-4 mt-2">
                        <button
                          onClick={() => {
                            setId(val.id);
                            setAmount(val.amount)
                            setAcceptbox(true);
                          }}
                          className="py-2 text-center text-black text-lg font-semibold bg-[#ff88bb] rounded-md my-2  grow inline-block"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => {
                            setId(val.id);
                            setrejectbox(true);
                          }}
                          className="py-2 text-center text-black text-lg font-semibold bg-[#d6d6d6] rounded-md my-2 grow inline-block"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
};


/**
 * Represents the properties required for making a payment request for a snapshot campaign.
 * @typedef {Object} SnapshotChampaingPaymentRequestProps
 * @property {string} campaingid - The ID of the campaign.
 * @property {string} userid - The ID of the user making the payment.
 * @property {string} currency - The currency in which the payment is made.
 * @property {boolean} isUser - Indicates whether the payment is made by a user or not.
 */
type SnapshotChampaingPaymentRequestProps = {
  campaingid: string;
  userid: string;
  currency: string;
  isUser: boolean;
};

/**
 * A React functional component that displays a list of payment requests for a snapshot campaign.
 * @param {SnapshotChampaingPaymentRequestProps} props - The component props.
 * @returns JSX elements representing the payment request list.
 */
const SnapshotChampaingPaymentRequest: React.FC<SnapshotChampaingPaymentRequestProps> = (props: SnapshotChampaingPaymentRequestProps) => {
  const [respayment, setRequestPayment] = useState<any[]>([]);

  const init = async () => {
    let req: any = {
      search: {},
    };

    if (props.isUser) {
      req.search.influencer = props.userid;
      req.search.campaign = props.campaingid;
    } else {
      req.search.campaign = props.campaingid;
    }

    const responseData = await axios.post(`${BaseUrl}/api/get-req-pay`, req);
    if (responseData.data.status == true) {
      if (props.isUser) {

        setRequestPayment(responseData.data.data);
      } else {
        const fildata = responseData.data.data.filter((val: any) => val.status.code == 2 || val.status.code == 3);
        setRequestPayment(fildata);
      }
    }
  };

  useEffect(() => {
    init();
  }, []);


  return (
    <>
      <div>
        {respayment.length == 0 ? (
          <NOTICEAlerts message="No Accepted/Rejected payment request."></NOTICEAlerts>
        ) : (
          <div>
            <div className="flex flex-nowrap overflow-x-scroll md:overflow-auto md:grid xs:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 w-full">
              {respayment.map((val: any, index: number) => {
                return (
                  <div
                    key={index}
                    className="bg-white rounded-lg shadow-lg w-72 md:w-auto"
                  >
                    <div>
                      <img
                        src={val.influencer.pic}
                        alt="influencer pic"
                        className="w-full h-44 shrink-0 rounded-t-md object-center object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <div className="items-center flex gap-3">
                        <p className="text-lg font-medium text-left grow"> {val.influencer.name.split("@")[0]}</p>
                        <p className="text-sm text-gray-500 font-normal">{new Date(val["updatedAt"]).toDateString()}</p>
                      </div>
                      <p className="my-4 text-md text-gray-600 font-normal">Requested Amount : <span className="mx-4 font-semibold">${val.amount.toString().split(".")[0]}</span></p>
                      {parseInt(val.status.code) == 2 ? (
                        <p className="py-2 text-center text-black text-lg font-semibold bg-[#beff80] rounded-md my-2">
                          Accepted
                        </p>
                      ) : parseInt(val.status.code) == 3 ? (
                        <p className="py-2 text-center text-black text-lg font-semibold bg-[#ff88bb] rounded-md my-2">
                          Rejected
                        </p>
                      ) : (
                        <p className="py-2 text-center text-lg font-semibold text-black bg-[#80fffa] rounded-md my-2">
                          Under Process
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

/**
 * Represents the properties of a snapshot created drafts component.
 * @typedef {Object} SnapshotCreatedDraftsProps
 * @property {string} campaingid - The ID of the campaign.
 * @property {string} brandid - The ID of the brand.
 * @property {boolean} isUser - Indicates whether the user is associated with the snapshot.
 * @property {string} userId - The ID of the user.
 */
type SnapshotCreatedDraftsProps = {
  campaingid: string;
  brandid: string;
  isUser: boolean;
  userId: string;
};

/**
 * A React functional component that displays a list of snapshot created drafts.
 * @param {SnapshotCreatedDraftsProps} props - The props object containing the necessary data for rendering the component.
 * @returns The JSX element representing the list of snapshot created drafts.
 */
const SnapshopCreatedDrafts: React.FC<SnapshotCreatedDraftsProps> = (props: SnapshotCreatedDraftsProps) => {
  const [resDarft, setResDarft] = useState<any[]>([]);
  const navigator = useNavigate();

  // const [error, setError] = useState<String>("");
  const init = async () => {
    let req: any = {
      search: {
        status: '3'
      },
    };


    if (props.isUser) {
      req.search.influencer = props.userId;
      req.search.campaign = props.campaingid;
    } else {
      req.search.campaign = props.campaingid;
    }


    const responseData = await axios.post(`${BaseUrl}/api/search-draft`, req);
    if (responseData.data.status == true) {
      setResDarft(responseData.data.data);
    }
  };

  useEffect(() => {
    init();
  }, []);

  return (
    <>
      <div>
        {resDarft.length == 0 ? (
          <NOTICEAlerts message="No accepted campaign drafts."></NOTICEAlerts>
        ) : (
          <div>
            <div className="flex flex-nowrap overflow-x-scroll md:overflow-auto md:grid xs:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 w-full">
              {resDarft.map((val: any, index: number) => {
                return (
                  <div
                    key={index}
                    className="my-2 bg-white rounded-lg shadow-lg w-80 md:w-auto"
                  >
                    <div>
                      <img
                        src={val.influencer.pic}
                        alt="influencer pic"
                        className="w-full h-44 shrink-0 rounded-t-md object-center object-cover"
                      />
                    </div>

                    <div className="p-4">
                      <div className="items-center flex gap-3">
                        <p className="text-lg font-medium text-left grow"> {val.influencer.name.split("@")[0]}</p>
                        <p className="text-sm text-gray-500 font-normal">{new Date(val["updatedAt"]).toDateString()}</p>
                      </div>
                      <p className="mt-2 text-md font-medium">Description</p>
                      <p className="text-sm font-medium">{val.description}</p>


                      <p className="mt-4 text-lg font-medium">Platforms</p>
                      <div className="rounded-full p-[0.15rem] border-2 border-blue-500 h-10 w-10">
                        <img src={val.handle.platform.logo} alt="platform" className="w-full h-full shrink-0 rounded-md object-fill object-center" />
                      </div>

                      <p className="mt-2 text-md font-medium">Publication Time</p>
                      {val.draft_approval != null ?
                        <p className="text-sm font-medium">{new Date(val.draft_approval.toString()).toDateString()}  {val.publication_time}</p> :
                        <p className="text-sm font-medium">No Publication Time is set</p>
                      }

                      <p className="mt-2 text-md font-medium">Campaign Link</p>
                      {val.linkCampaign == null || val.linkCampaign == "" ?
                        <p className="text-sm font-medium">No Campaign is Linked</p>
                        :
                        <>
                          {/* <p className="text-sm font-medium">{val.linkCampaign}</p> */}
                          <a
                            target="_blank"
                            className="rounded-md mt-4 w-full text-lg text-center font-semibold  inline-block my-2 py-2  text-white bg-primary "
                            href={val.linkCampaign}>View Campaign Link</a>
                        </>

                      }

                      <a
                        target="_blank"
                        className="rounded-md mt-4 w-full text-lg text-center font-semibold  inline-block my-2 py-2  text-black bg-[#fbca8e]"
                        href={val.attach01}
                      >
                        View attachment
                      </a>

                      {val.status.name == "REJECTED" ?
                        <>
                          <p className="mt-2 text-md font-medium">Rejection Reason</p>
                          <p className="text-sm font-medium">{val.status.message}</p>
                        </>
                        : null}
                      <p
                        className={`mt-2 py-2 text-md text-black text-lg font-semibold text-center rounded-md ${val.status.name == "ACCEPTED"
                          ? "bg-[#beff80]"
                          : val.status.name == "PENDING"
                            ? "bg-[#80fffa]"
                            : "bg-[#ff88bb]"
                          }`}
                      >
                        {val.status.name}
                      </p>
                      {val.status.name == "ACCEPTED" ?
                        props.isUser ?
                          <Link
                            to={`/home/paymentreq/${props.brandid}/${props.campaingid}/${val.id}`}
                            className="rounded-md mt-4 w-full text-lg text-center font-semibold  inline-block my-2 py-2  text-white bg-primary ">View Details</Link>
                          :
                          <Link to={`/home/brandpay/${props.brandid}/${props.campaingid}/${val.id}`}
                            className="rounded-md mt-4 w-full text-lg text-center font-semibold  inline-block my-2 py-2  text-white bg-primary ">View Details</Link>
                        :
                        null
                      }
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div >
    </>
  );
};

type LinkCampaignProps = {
  campaingid: string;
  userId: string;
  brandId: string;
  cpp: string;
};

/**
 * A React functional component that renders a link campaign section.
 * @param {LinkCampaignProps} props - The props for the LinkCampaign component.
 * @returns {JSX.Element} - The rendered LinkCampaign component.
 */
const LinkCampaign: React.FC<LinkCampaignProps> = (
  props: LinkCampaignProps
): JSX.Element => {
  const [resDarft, setResDarft] = useState<any[]>([]);
  const [linkBox, setLinkBox] = useState<boolean[]>([]);
  const [errors, setError] = useState<string[]>([]);
  const [linkValue, setLinkValue] = useState<string[]>(
    Array(resDarft.length).fill("")
  );

  const init = async () => {
    let req = {
      search: {
        fromUser: props.userId,
        campaign: props.campaingid,
        influencer: props.userId,
        status: 3,
      },
    };
    const responseData = await axios.post(`${BaseUrl}/api/search-draft`, req);
    if (responseData.data.status == true) {
      setResDarft(responseData.data.data);
    }
    setLinkBox(Array(responseData.data.data.length).fill(false));
    setError(Array(responseData.data.data.length).fill(""));
    setLinkValue(Array(responseData.data.data.length).fill(""));
  };

  const upadteLinkBox = (value: boolean, index: number) => {
    const updatedLinkBox = [...linkBox];
    updatedLinkBox[index] = value;
    setLinkBox(updatedLinkBox);
  };

  const updateLink = async (index: number) => {
    const link = linkValue[index];
    if (link == null || link == undefined || link == "") {
      const updatedErrors = [...errors];
      updatedErrors[index] = "Please enter the link";
      setError(updatedErrors);
    } else {
      const responseData = await axios.post(`${BaseUrl}/api/update-draft`, {
        id: resDarft[index].id,
        linkCampaign: link,
      });
      if (!responseData.data.status) {
        const updatedErrors = [...errors];
        updatedErrors[index] = responseData.data.message;
        setError(updatedErrors);
      } else {
        window.location.reload();
      }
    }
  };

  const handleInputChange = (index: number, value: string) => {
    const updatedLinkValue = [...linkValue];
    updatedLinkValue[index] = value;
    setLinkValue(updatedLinkValue);
  };

  useEffect(() => {
    init();
  }, []);
  return (
    <>
      {resDarft.length == 0 ? (
        <NOTICEAlerts message="No campaign is live"></NOTICEAlerts>
      ) : null}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 w-full">
        {resDarft.map((val: any, index: number) => {
          return (
            <div className="bg-white rounded-md p-4 mt-2 shadow-[0_0_4px_0_rgb(0,0,0,0.3)]" key={index}>
              <div className="flex items-center">
                <img
                  src={val.handle.platform.logo}
                  alt="error"
                  className="h-8 w-8 shrink-0"
                />
                <div className="ml-4">
                  <p className="text-primary text-xl font-medium cusfont text-left">
                    {val.handle.name}
                  </p>
                </div>
              </div>
              {val.linkCampaign == null ||
                val.linkCampaign == "" ||
                val.linkCampaign == undefined ? (
                linkBox[index] ? (
                  <>
                    <input
                      type="text"
                      placeholder="Enter the link"
                      className="w-full outline-none fill-none bg-transparent py-1 px-4 rounded-md border-2 border-gray-400 mt-4"
                      value={linkValue[index]}
                      onChange={(e) => handleInputChange(index, e.target.value)}
                    />
                    {errors[index] == "" ||
                      errors[index] == null ||
                      errors[index] == undefined ? null : (
                      <div className="bg-red-500 bg-opacity-10 border-2 text-center border-red-500 rounded-md text-red-500 text-md font-normal text-md my-2">
                        {errors[index]}
                      </div>
                    )}
                    <button
                      onClick={async () => {
                        await updateLink(index);
                      }}
                      className="mt-4 text-md w-full text-black font-semibold bg-[#fbca8e] rounded-md shadow-lg py-1"
                    >
                      Link
                    </button>
                  </>
                ) : (
                  <button
                    className="mt-4 text-md w-full text-black font-semibold bg-[#fbca8e] rounded-md shadow-lg py-1"
                    onClick={() => upadteLinkBox(true, index)}
                  >
                    Link campaign
                  </button>
                )
              ) : (
                <Link
                  to={`/home/paymentreq/${props.brandId}/${props.campaingid}/${val.id}`}
                  className="text-center inline-block mt-4 text-md w-full text-black font-semibold bg-[#fbca8e] rounded-md shadow-lg py-1"
                  onClick={() => upadteLinkBox(true, index)}
                >
                  View insight
                </Link>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
};

interface BiddingProps {
  CostPerPost: string;
  campaignId: string;
  brandId: string;
  userId: string;
}

/**
 * Bidding component for placing bids on a campaign.
 * @param {BiddingProps} props - The props for the Bidding component.
 * @returns {JSX.Element} - The rendered Bidding component.
 */
const Bidding: React.FC<BiddingProps> = (props: BiddingProps): JSX.Element => {
  const [error, setError] = useState<string>("");
  const [amount, setAmount] = useState<number>(0);
  const messageRef = useRef<HTMLTextAreaElement>(null);

  const [bidamount, setBidamount] = useState<number>(0);
  const handelcontent = (e: any) => {
    setBidamount(e.target.value.replace(/\D/g, ""));
  };

  const init = async () => {
    const camp = await axios({
      method: "post",
      url: `${BaseUrl}/api/get-campaign-last-bid`,
      data: { campaignId: props.campaignId },
    });
    if (camp.data.status == false) {
      setAmount(0);
    } else {
      setAmount(camp.data.data[0].bidamount);
    }
  };
  useEffect(() => {
    init();
  }, []);

  const submit = async () => {
    if (bidamount == undefined || bidamount == null) {
      setError("Fill the Bid amount.");
    } else if (Number(bidamount) % 100 !== 0) {
      setError("Bid amount must be a multiple of 100.");
    }
    else if (Number(props.CostPerPost) * 1.25 < Number(bidamount)) {
      setError("Bid amount must be less then current bid amount.");
    }
    else if (
      messageRef.current?.value == null ||
      messageRef.current?.value == undefined ||
      messageRef.current?.value == ""
    ) {
      setError("Fill the remark.");
    } else {
      const req = {
        brandId: props.brandId,
        userId: props.userId,
        campaignId: props.campaignId,
        remark: messageRef.current?.value,
        bidamount: Number(bidamount),
      };

      const data = await axios({
        method: "post",
        url: `${BaseUrl}/api/add-bid`,
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
        window.location.reload();
      }
    }
  };

  return (
    <>
      <p className="text-md text-primary font-semibold py-1">Bidding</p>
      <div className="w-full h-[1px] bg-slate-300"></div>
      <div className="p-4 bg-white mt-2 rounded-md">
        <p className="font-semibold text-xl  text-gray-800">
          Starting bid : {props.CostPerPost.split(".")[0]}
        </p>
        <p className="font-semibold text-xl  text-gray-800 mt-2">
          Current bid : {amount.toString().split(".")[0]}
        </p>
        <p className="font-semibold text-xl  text-gray-700 my-2">
          Min Bid : 100
        </p>
        <div className="flex gap-x-4">
          <p className="font-semibold text-xl text-gray-700">Enter Amount : </p>
          <div>
            <input
              onChange={handelcontent}
              value={bidamount}
              type={"text"}
              className="text-black outline-none border-none rounded-md py-1 px-2 bg-[#EEEEEE] w-full"
            />
          </div>
        </div>
        <textarea
          ref={messageRef}
          className="p-4 w-full h-32 outline-none border-2 bg-[#EEEEEE] focus:border-gray-300 rounded-md resize-none mt-4"
          placeholder="Remark"
        ></textarea>
        {error == "" || error == null || error == undefined ? null : (
          <NOTICEAlerts message={error}></NOTICEAlerts>
        )}
        <button
          onClick={submit}
          className={`text-black bg-[#01FFF4] rounded-lg w-full text-center py-2 font-semibold text-md mt-2`}
        >
          Bid Now
        </button>
      </div>
    </>
  );
};

type ChampaingBidRequestProps = {
  campaingid: string;
  userid: string;
};

/**
 * Component for displaying and accepting bid requests for a campaign.
 * @param {ChampaingBidRequestProps} props - The props for the component.
 * @returns JSX elements for rendering the bid request component.
 */
const ChampaingBidRequest = (props: ChampaingBidRequestProps) => {
  const [resbid, setResbid] = useState<any[]>([]);

  const [acceptbox, setAcceptbox] = useState<boolean>(false);

  const [error, setError] = useState<string | null>(null);
  const [id, setId] = useState<string | null>(null);

  const init = async () => {
    let req = {
      campaignId: props.campaingid,
    };
    const responseData = await axios.post(
      `${BaseUrl}/api/get-campaign-bid`,
      req
    );
    if (responseData.data.status) {
      setResbid(responseData.data.data);
    } else {
      setError(responseData.data.message);
    }
  };

  useEffect(() => {
    init();
  }, []);

  const acceptRequest = async () => {
    let req = {
      id: id,
    };
    const responseData = await axios.post(`${BaseUrl}/api/approve-bid`, req);
    if (responseData.data.staus == false)
      return setError(responseData.data.message);
    setAcceptbox(false);
    window.location.reload();
  };

  return (
    <>
      <div
        className={`fixed top-0 left-0  h-screen w-full bg-slate-900 bg-opacity-10 place-items-center ${acceptbox ? "grid" : "hidden"
          }`}
      >
        <div className="bg-white w-72 shadow-lg p-4 rounded-lg">
          <p className="text-center font-medium text-2xl">Accept</p>
          <div className="w-full bg-gray-400 h-[1px] my-2"></div>
          <p className="text-center font-medium text-gray-800">
            Are you sure you want to accept this payment?
          </p>
          {error == "" || error == null || error == undefined ? null : (
            <div className="bg-red-500 bg-opacity-10 border-2 text-center border-red-500 rounded-md text-red-500 text-md font-normal text-md my-4">
              {error}
            </div>
          )}
          <div className="flex mt-2 gap-4">
            <button
              onClick={() => {
                setAcceptbox(false);
              }}
              className="py-2 text-center text-black text-lg font-semibold bg-[#d6d6d6] rounded-md my-2  grow inline-block"
            >
              Cancel
            </button>
            <button
              onClick={acceptRequest}
              className="py-2 text-center text-black text-lg font-semibold bg-[#ff88bb] rounded-md my-2  grow inline-block"
            >
              Accept
            </button>
          </div>
        </div>
      </div>

      <div>
        {resbid.length == 0 ? (
          <NOTICEAlerts message="No bid request is pending"></NOTICEAlerts>
        ) : (
          <>
            <div>
              <div className="flex flex-nowrap overflow-x-scroll md:overflow-auto md:grid xs:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 w-full">
                {resbid.map((val: any, index: number) => {
                  return (
                    <div
                      key={index}
                      className="bg-white rounded-lg shadow-lg w-80 md:w-auto"
                    >

                      <div className="flex mt-4">
                        <img
                          src={val.userPicUrl}
                          alt="influencer pic"
                          className="w-full h-44 shrink-0 rounded-t-md object-center object-cover"
                        />
                      </div>
                      <div className="p-4">
                        <p className="text-lg font-medium text-left grow">{val.userName.split("@")[0]}</p>
                        <p className="my-4 text-md text-gray-600 font-normal">Requested Amount : <span className="mx-4 font-semibold">${val.bidamount.toString().split(".")[0]}</span></p>
                        <p className="text-lg font-medium mt-2">Remark</p>
                        <p className="text-md font-semibold">{val.remark}</p>

                        <button
                          onClick={() => {
                            setId(val.id);
                            setAcceptbox(true);
                          }}
                          className="py-2 mt-3 text-black text-lg font-semibold bg-[#ff88bb] rounded-md my-2  grow inline-block text-center w-full"
                        >
                          Accept
                        </button>

                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {error == "" || error == null || error == undefined ? null : (
              <NOTICEAlerts message={error}></NOTICEAlerts>
            )}
          </>
        )}

      </div>
    </>
  );
};




type SnapshotChampaingBidRequestProps = {
  campaingid: string;
  userid: string;
  isUser: boolean;
};

/**
 * A React functional component that displays a list of bid requests for a campaign.
 * @param {SnapshotChampaingBidRequestProps} props - The component props.
 * @returns JSX elements representing the bid request list.
 */
const SnapshotChampaingBidRequest: React.FC<SnapshotChampaingBidRequestProps> = (props: SnapshotChampaingBidRequestProps) => {
  const [resbid, setResbid] = useState<any[]>([]);

  const [error, setError] = useState<string | null>(null);

  const init = async () => {
    let req = {
      campaignId: props.campaingid,
    };
    const responseData = await axios.post(
      `${BaseUrl}/api/get-bid`,
      req
    );
    if (responseData.data.status) {
      if (props.isUser) {
        const data = responseData.data.data.filter((val: any) => val.userId == props.userid)
        setResbid(data);
      } else {
        const fildata = responseData.data.message.filter((val: any) => val.approved == 1);
        setResbid(fildata);
      }
    } else {
      setError(responseData.data.message);
    }
  };

  useEffect(() => {
    init();
  }, []);


  return (
    <>
      <div>
        {resbid.length == 0 ? (
          <NOTICEAlerts message="No accepted bid request."></NOTICEAlerts>
        ) : (
          <>
            <div>
              <div className="flex flex-nowrap overflow-x-scroll md:overflow-auto md:grid xs:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 w-full">
                {resbid.map((val: any, index: number) => {
                  return (
                    <div
                      key={index}
                      className="bg-white rounded-lg shadow-lg w-80 md:w-auto"
                    >
                      <div>
                        <img
                          src={val.userPicUrl}
                          alt="influencer pic"
                          className="w-full h-44 shrink-0 rounded-t-md object-center object-cover"
                        />
                      </div>
                      <div className="p-4">
                        <div className="items-center flex gap-3">
                          <p className="text-lg font-medium text-left grow">  {val.userName.split("@")[0]}</p>
                          <p className="text-sm text-gray-500 font-normal">{new Date(val["createdAt"]).toDateString()}</p>
                        </div>
                        <p className="my-4 text-md text-gray-600 font-normal">Requested Amount : <span className="mx-4 font-semibold">${val.bidamount.toString().split(".")[0]}</span></p>
                        <p className="text-lg font-medium mt-2">Remark</p>
                        <p className="text-md font-semibold">{val.remark}</p>
                        <p
                          className={`mt-2 py-2 font-semibold text-md text-black text-center rounded-md ${val.approved == "1"
                            ? "bg-[#beff80]"
                            : "bg-[#ff88bb]"
                            }`}
                        >
                          {val.approved == "1" ? "Approved" : "Pending"}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {error == "" || error == null || error == undefined ? null : (
              <NOTICEAlerts message={error}></NOTICEAlerts>
            )}
          </>
        )}

      </div>
    </>
  );
};
