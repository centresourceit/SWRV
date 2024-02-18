import {
  faIdBadge,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { LoaderArgs, json } from "@remix-run/node";
import { Link, useLoaderData, useNavigate } from "@remix-run/react";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { NOTICEAlerts } from "~/components/utils/alert";
import { CusButton } from "~/components/utils/buttont";
import { MyCampaginCard } from "~/components/utils/campagincard";
import { BaseUrl } from "~/const";
import { userPrefs } from "~/cookies";
import { longtext } from "~/utils";

/**
 * Loads user data and campaign data from the server using Axios.
 * @param {LoaderArgs} request - The request object containing headers and other data.
 * @returns A JSON response containing user data, campaign data, and user campaign data.
 */
export const loader = async ({ request }: LoaderArgs) => {
  const cookieHeader = request.headers.get("Cookie");
  const cookie = await userPrefs.parse(cookieHeader);
  const userid = cookie.user.id;

  const campdata = await axios({
    method: "post",
    url: `${BaseUrl}/api/get-my-campaigns`,
    data: { id: userid },
  });

  let req = {
    search: {
      status: "3",
      influencer: userid,
      fromUser: userid,
    },
  };


  /**
   * Sends a POST request to the specified URL with the given request data and headers.
   * @param {string} BaseUrl - The base URL of the API.
   * @param {object} req - The request data to send.
   * @returns A Promise that resolves to the response data.
   */
  const usercamp = await axios({
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

  return json({
    userdata: cookie.user,
    camp: campdata.data.data,
    usercamp: usercamp.data.data,
  });
};

/**
 * Renders the "My Campaigns" component, which displays different content based on the user's role.
 * @returns {JSX.Element} - The rendered component.
 */
const MyCampaigns = () => {
  const userdata = useLoaderData();
  const isBrand = userdata.userdata.role["code"] == "50" ? true : false;
  const campdata = userdata.camp.campaigns;


  return (
    <>
      <div>
        {isBrand ? (
          <div>
            <ActiveCampaign camp={campdata} userdata={userdata}></ActiveCampaign>
          </div>
        ) : (
          <>
            <UserDrafts userid={userdata.userdata.id}></UserDrafts>
            <RequestedInvite userId={userdata.userdata.id}></RequestedInvite>
          </>
        )}
      </div>
    </>
  );
};

export default MyCampaigns;

/**
 * Represents the properties of an active campaign.
 * @typedef {Object} ActiveCampaignProps
 * @property {object[]} camp - An array of campaign objects.
 * @property {*} userdata - User data associated with the campaign.
 */
type ActiveCampaignProps = {
  camp: object[];
  userdata: any;
};

/**
 * A functional component that renders a list of campaigns and provides functionality to filter and search through them.
 * @param {ActiveCampaignProps} props - The props object containing the necessary data for rendering the component.
 * @returns The rendered component.
 */
const ActiveCampaign = (props: ActiveCampaignProps) => {
  const campdata = props.camp;

  const navigation = useNavigate();

  const isProfileCompleted =
    props.userdata.userdata.profileCompleteness == 1 ||
      props.userdata.userdata.profileCompleteness == "1"
      ? true
      : false;


  const [campaign, setCampaign] = useState<any[]>([]);
  const [isActive, setIsActive] = useState<boolean>(true);
  const [isSearch, setIsSearch] = useState<boolean>(false);

  const searchRef = useRef<HTMLInputElement>(null);
  function arraysContainCommonElement(arr1: string[], arr2: string[]) {
    const arr1Words = arr1.flatMap(item => item.toString().split(" ")).map(word => word.toLowerCase());
    const arr2Words = arr2.flatMap(item => item.toString().split(" ")).map(word => word.toLowerCase());
    return arr1Words.some(word => arr2Words.includes(word));
  }

  const init = () => {
    setCampaign((val) => []);
    if (isSearch) {
      let data = campdata.filter((val: any) => {
        const valWords = val["name"].toString().split(" ");
        const searchWords = searchRef!.current!.value.toString().split(" ") ?? [];
        return arraysContainCommonElement(valWords, searchWords);
      });
      searchRef!.current!.value = "";
      setCampaign((val) => data);
    }
    else if (isActive) {
      let data = campdata.filter((val: any) => new Date(val["endAt"]) > new Date());
      setCampaign((val) => data);
    } else {
      let data = campdata.filter((val: any) => new Date(val["endAt"]) < new Date());
      setCampaign((val) => data);
    }
  }

  useEffect(() => {
    init();
  }, [isActive, isSearch]);

  const setActive = () => {
    setIsSearch(false);
    setIsActive(true);

  }
  const setInactive = () => {
    setIsSearch(false);
    setIsActive(false);
  }


  const [error, setError] = useState<string | null>(null);
  const [searcherror, setSearchError] = useState<string | null>(null);


  const handelclick = () => {
    if (isProfileCompleted) {
      setError(null);
      navigation("/home/createcampaign");
    } else {
      setError("Complete your profile first.");
    }
  };

  return (
    <>
      {/* top bar start here */}
      <div className="bg-white rounded-2xl shadow-xl p-6 mt-8 ">
        <div className="flex md:flex-row flex-col flex-wrap items-center ">
          <div>
            <h1 className="text-xl text-black text-left mt-4 cusfont font-medium">
              My campaigns
            </h1>
            <p className="text-md font-normal text-black text-left">
              Here you can manage all the campaigns that you are participating
              in.
            </p>
          </div>
          <div className="grow"></div>
          <div onClick={handelclick}>
            <CusButton
              text="Create a Campaign"
              textColor={"text-white"}
              background="bg-primary"
            ></CusButton>
          </div>
        </div>
        <div className="flex gap-4 items-center">
          <div className="flex grow rounded-lg bg-[#eeeeee] py-2  my-4 px-4 gap-3">
            <div> <FontAwesomeIcon
              icon={faSearch}
              className="text-md text-gray-500"
            ></FontAwesomeIcon></div>
            <input type="text" ref={searchRef} className="bg-transparent border-none outline-none focus:outline-none focus:border-none fill-none grow w-full active:border-none" />
          </div>
          <div>
            <button onClick={() => {

              setSearchError(null)
              if (searchRef!.current!.value == null || searchRef!.current!.value == undefined || searchRef!.current!.value == "") {
                setSearchError("Please enter search keyword.")
              } else {
                setIsSearch((val: boolean) => true);
                init();
              }
            }} className="rounded-md bg-primary px-4 py-2 text-white font-semibold">Search</button>
          </div>
        </div>
        {searcherror == "" || searcherror == null || searcherror == undefined ? null : (
          <NOTICEAlerts message={searcherror}></NOTICEAlerts>
        )}
        <div className="flex gap-4">
          <button
            className={`w-48 rounded-xl text-black text-center cusfont py-2 font-medium text-[1rem] ${isActive ? "bg-[#bdff80]" : "bg-[#eeeeee]"}`}
            onClick={setActive}
          >
            Active campaigns
          </button>
          <div
            className={`w-52 rounded-xl text-black cusfont text-center py-2 font-medium text-[1rem] cursor-pointer ${isActive ? "bg-[#eeeeee]" : "bg-[#bdff80]"}`}
            onClick={setInactive}
          >
            Finished campaigns
          </div>
        </div>
        {error == "" || error == null || error == undefined ? null : (
          <NOTICEAlerts message={error}></NOTICEAlerts>
        )}
      </div >
      {/* top bar end here */}
      < div className="bg-white rounded-2xl my-3 shadow-xl px-8 py-10" >
        {/* <div className="w-60 rounded-xl text-xl font-bold text-black p-2 my-4">
          {" "}
          <FontAwesomeIcon
            icon={faIdBadge}
            className="text-md text-secondary"
          ></FontAwesomeIcon>{" "}
          Your Campaign{" "}
        </div> */}
        {
          campaign.length == 0 ? (
            isSearch ?
              <h1 className="text-black font-medium text-xl text-center">
                No Campaign Found
              </h1> :
              <h1 className="text-black font-medium text-xl text-center">
                You haven't created any campaign yet.
              </h1>
          ) : null
        }
        <div className="grid xs:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 w-full">
          {campaign.map((val: any, i: number) => {
            const platforms: string[] = [];
            for (let i: number = 0; i < val.platforms.length; i++) {
              platforms.push(val.platforms[i]["platformLogoUrl"]);
            }

            let image =
              val["brand"].length == 0 ||
                val["brand"] == undefined ||
                val["brand"] == null ||
                val["brand"] == ""
                ? "/images/avatar/user.png"
                : val["brand"]["logo"] == "0" ||
                  val["brand"]["logo"] == undefined ||
                  val["brand"]["logo"] == null ||
                  val["brand"]["logo"] == ""
                  ? "/images/avatar/user.png"
                  : val["brand"]["logo"];


            return (
              <div key={i}>
                <MyCampaginCard
                  id={val.id}
                  // currency={val.currency.code}
                  currency={"USD"}
                  platforms={platforms}
                  maxval={val.costPerPost.split(".")[0]}
                  weburl={val.brand.webUrl}
                  category={val.type.name}
                  image={image}
                  name={val.brand.name}
                  title={val.name}
                  btntext="View"
                  startAt={val.startAt}
                  endAt={val.endAt}
                ></MyCampaginCard>
              </div>
            );
          })}
        </div>
      </div >
    </>
  );
};


type UserDraftsProps = {
  userid: string;
};

/**
 * A functional component that displays the user's drafts of campaigns.
 * @param {UserDraftsProps} props - The props for the UserDrafts component.
 * @returns The rendered UserDrafts component.
 */
const UserDrafts = (props: UserDraftsProps) => {
  const [userDraft, setUserDraft] = useState<any[]>([]);

  const [isActive, setIsActive] = useState<boolean>(true);

  const [isSearch, setIsSearch] = useState<boolean>(false);

  const searchRef = useRef<HTMLInputElement>(null);
  function arraysContainCommonElement(arr1: string[], arr2: string[]) {
    const arr1Words = arr1.flatMap(item => item.toString().split(" ")).map(word => word.toLowerCase());
    const arr2Words = arr2.flatMap(item => item.toString().split(" ")).map(word => word.toLowerCase());
    return arr1Words.some(word => arr2Words.includes(word));
  }


  const init = async () => {
    let req = {
      search: {
        status: "3",
        influencer: props.userid,
      },
    };
    const apidata = await axios({
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



    setUserDraft((val) => []);
    if (isSearch) {
      let data = apidata.data.data.filter((val: any) => {
        const valWords = val["campaign"]["name"].toString().split(" ");
        const searchWords = searchRef!.current!.value.toString().split(" ") ?? [];
        return arraysContainCommonElement(valWords, searchWords);
      });
      searchRef!.current!.value = "";
      setUserDraft((val) => data);
    }
    else if (isActive) {
      let data = apidata.data.data.filter((val: any) => new Date(val["campaign"]["endAt"]) > new Date());
      setUserDraft((val) => data);
    } else {
      let data = apidata.data.data.filter((val: any) => new Date(val["campaign"]["endAt"]) < new Date());
      setUserDraft((val) => data);
    }
  };



  useEffect(() => {
    init();
  }, [isActive, isSearch]);


  const setActive = () => {
    setIsSearch(false);
    setIsActive(true);
  }
  const setInactive = () => {
    setIsSearch(false);
    setIsActive(false);
  }

  const [searcherror, setSearchError] = useState<string | null>(null);


  return (

    <>
      <div className="bg-white rounded-2xl shadow-xl p-6 mt-8 ">
        <div className="flex my-6 md:flex-row flex-col flex-wrap items-center">
          <div>
            <h1 className="text-2xl font-bold text-black text-left mt-4">
              My campaigns
            </h1>
            <p className="text-md font-normal text-black text-left">
              Here you can manage all the campaigns that you are participating
              in.
            </p>
          </div>
          <div className="grow"></div>

        </div>

        <div className="flex gap-4 items-center">
          <div className="flex grow rounded-lg bg-[#eeeeee] py-2  my-4 px-4 gap-3">
            <div> <FontAwesomeIcon
              icon={faSearch}
              className="text-md text-gray-500"
            ></FontAwesomeIcon></div>
            <input type="text" ref={searchRef} className="bg-transparent border-none outline-none focus:outline-none focus:border-none fill-none grow w-full active:border-none" />
          </div>
          <div>
            <button onClick={() => {

              setSearchError(null)
              if (searchRef!.current!.value == null || searchRef!.current!.value == undefined || searchRef!.current!.value == "") {
                setSearchError("Please enter search keyword.")
              } else {
                setIsSearch((val: boolean) => true);
                init();
              }
            }} className="rounded-md bg-primary px-4 py-2 text-white font-semibold">Search</button>
          </div>
        </div>
        {searcherror == "" || searcherror == null || searcherror == undefined ? null : (
          <NOTICEAlerts message={searcherror}></NOTICEAlerts>
        )}
        <div className="flex gap-4">
          <button
            className={`w-48 rounded-xl text-black text-center cusfont py-2 font-medium text-[1rem] ${isActive ? "bg-[#bdff80]" : "bg-[#eeeeee]"}`}
            onClick={setActive}
          >
            Active campaigns
          </button>
          <div
            className={`w-52 rounded-xl text-black cusfont text-center py-2 font-medium text-[1rem] cursor-pointer ${isActive ? "bg-[#eeeeee]" : "bg-[#bdff80]"}`}
            onClick={setInactive}
          >
            Finished campaigns
          </div>
        </div>
      </div >
      <div className="bg-white rounded-2xl my-3 shadow-xl p-4">
        <div className="w-60 rounded-xl text-xl font-bold text-black p-2 my-4">
          {" "}
          <FontAwesomeIcon
            icon={faIdBadge}
            className="text-md text-secondary"
          ></FontAwesomeIcon>{" "}
          {isActive ? "Active Campaign" : "Finished Campaign"}
        </div>
        {userDraft.length == 0 ? (
          isSearch ?
            <h1 className="text-black font-medium text-xl text-center">
              No Campaign Found
            </h1> :
            <NOTICEAlerts message="You haven't collaborated in any campaign."></NOTICEAlerts>
        ) : null}
        <div className="flex flex-nowrap overflow-x-scroll md:overflow-auto md:grid xs:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 w-full px-2">
          {userDraft.map((val: any, i: number) => {
            let image =
              val["brand"].length == 0 ||
                val["brand"] == undefined ||
                val["brand"] == null ||
                val["brand"] == ""
                ? "/images/avatar/user.png"
                : val["brand"]["logo"] == "0" ||
                  val["brand"]["logo"] == undefined ||
                  val["brand"]["logo"] == null ||
                  val["brand"]["logo"] == ""
                  ? "/images/avatar/user.png"
                  : val["brand"]["logo"];
            return (
              <div
                className="rounded-xl shadow-[0_0_4px_0_rgb(0,0,0,0.3)] p-4 w-64 md:w-auto my-2 bg-white "
                key={i}
              >
                <div className="flex items-end gap-x-3">
                  <div>
                    <img
                      src={image}
                      alt="error"
                      className="object-cover w-16 h-16 rounded"
                    />
                  </div>
                  <p className="text-black font-medium text-lg cusfont content-end text-left">
                    {longtext(val.brand.name, 15)}
                  </p>
                </div>
                <p className="text-gray-700 font-medium text-sm cusfont text-left mt-2">
                  {longtext(val.campaign.name, 20)}
                </p>
                <p className="text-black font-semibold text-xs text-left mt-2">
                  email : {val.brand.email}
                </p>
                <Link to={`/home/campaigns/${val.campaign.id}`} className="py-2 inline-block mt-2 text-primary bg-[#88def1] rounded-md w-full text-center font-semibold cusfont text-sm">
                  View
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

/**
 * Represents the properties of a requested invite.
 * @interface RequestedInviteProps
 * @property {string} userId - The ID of the user requesting the invite.
 */
interface RequestedInviteProps {
  userId: string;
}
const RequestedInvite: React.FC<RequestedInviteProps> = (
  props: RequestedInviteProps
): JSX.Element => {

  const [userInvite, setInvite] = useState<any[]>([]);
  const [acceptbox, setAcceptbox] = useState<boolean>(false);
  const [rejectbox, setrejectbox] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const rejectiontextRef = useRef<HTMLInputElement>(null);
  const [id, setId] = useState<string | null>(null);

  const init = async () => {
    let req = {
      search: {
        status: "1",
        influencer: props.userId,
        toUser: props.userId
      },
    };
    const apidata = await axios({
      method: "post",
      url: `${BaseUrl}/api/search-invite`,
      data: req,
    });
    setInvite(apidata.data.data);
  };

  useEffect(() => {
    init();
  }, []);

  /**
   * Accepts a request by updating the invite status to "3" in the backend API.
   * @returns None
   * @throws {Error} If the API response status is false, an error message is set.
   */
  const acceptRequest = async () => {
    let req = { id: id, status: "3" };
    const responseData = await axios.post(`${BaseUrl}/api/update-invite`, req);
    if (responseData.data.staus == false)
      return setError(responseData.data.message);
    setAcceptbox(false);
    window.location.reload();
  };

  /**
   * Rejects a request by sending a POST request to the server with the rejection reason.
   * @returns None
   * @throws {Error} If the rejection reason is not provided or if there is an error in the server response.
   */
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

  /**
   * Renders a component that displays a modal for accepting or rejecting a brand campaign request.
   * @returns JSX elements representing the modal component.
   */
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
            <NOTICEAlerts message={error}></NOTICEAlerts>
          )}
          <div className="flex mt-2 gap-3">

            <button
              onClick={acceptRequest}
              className="bg-[#ff88bb] rounded-md font-semibold text-blackpy-2 text-center grow inline-block"
            >
              Accept
            </button>
            <button
              onClick={() => {
                setAcceptbox(false);
              }}
              className="bg-[#d6d6d6] rounded-md font-semibold text-black py-2 text-center grow inline-block"
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
            className="w-full bg-[#eeeeee] rounded-md  px-2 py-1 my-2 outline-none placeholder:font-medium"
            placeholder="Enter the reason of rejection."
          />
          {error == "" || error == null || error == undefined ? null : (
            <div className="bg-red-500 bg-opacity-10 border-2 text-center border-red-500 rounded-md text-red-500 text-md font-normal text-md my-4">
              {error}
            </div>
          )}
          <div className="flex mt-2 gap-3">
            <button
              onClick={rejectRequest}
              className="bg-[#ff88bb] rounded-md font-semibold text-blackpy-2 text-center grow inline-block"
            >
              Reject
            </button>

            <button
              onClick={() => {
                setrejectbox(false);
              }}
              className="bg-[#d6d6d6] rounded-md font-semibold text-black py-2 text-center grow inline-block"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-2xl my-4 shadow-xl p-4">
        <div className=" rounded-xl text-xl font-bold text-black p-2 my-4">
          {" "}
          <FontAwesomeIcon
            icon={faIdBadge}
            className="text-md text-secondary"
          ></FontAwesomeIcon>{" "}
          Requested brand campaign
        </div>
        {userInvite.length == 0 ? (
          <NOTICEAlerts message={"You haven't got any request from the campaign."}></NOTICEAlerts>
        ) : null}

        <div className="flex flex-nowrap overflow-x-scroll md:overflow-auto md:grid xs:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 w-full py-4">
          {userInvite.map((val: any, index: number) => {
            return (
              <div key={index} className="bg-white rounded-lg shadow-lg w-64 md:w-auto">
                <div>
                  <img
                    src={val.brand.logo}
                    alt="influencer pic"
                    className="w-full h-44 shrink-0 rounded-t-md object-center object-cover"
                  />
                </div>
                <div className="p-4">
                  <p className="mt-2 text-lg font-medium"> {val.brand.name.toString().split("@")[0]}</p>
                  <p className="mt-2 text-md font-medium">Message</p>
                  <p className="text-sm font-medium">{val.inviteMessage}</p>
                  <div className="flex gap-4 mt-2">
                    <button
                      onClick={() => {
                        setId(val.id);
                        setAcceptbox(true);
                      }}
                      className="bg-[#ff88bb] rounded-md font-semibold text-blackpy-2 text-center grow"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => {
                        setId(val.id);
                        setrejectbox(true);
                      }}
                      className="bg-[#d6d6d6] rounded-md font-semibold text-black py-2 text-center grow"
                    >
                      Reject
                    </button>
                  </div>
                  <Link
                    to={`/home/campaigns/${val.id}`}
                    className="inline-block mt-4 rounded-md  text-xl font-medium text-center text-white bg-primary py-2  w-full"
                  >
                    View campaign
                  </Link>
                </div>

              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};
