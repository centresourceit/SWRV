import {
  faInfo,
  faInfoCircle,
  faRemove,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { LoaderArgs, LoaderFunction, json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { Rating } from "react-simple-star-rating";
import { format } from "timeago.js";
import ProgressBar from "~/components/progressbr";
import { NOTICEAlerts, SUCCESSAlerts } from "~/components/utils/alert";
import { CusButton } from "~/components/utils/buttont";
import MyRating from "~/components/utils/raiting";
import { BaseUrl } from "~/const";
import { userPrefs } from "~/cookies";
import { longtext } from "~/utils";

/**
 * Enum representing different types of user details.
 * - insights: Insights about the user.
 * - payments: Payment details of the user.
 * - campaign: Campaign details associated with the user.
 * - channels: Channels associated with the user.
 * - personalInfo: Personal information of the user.
 * - pastAssociations: Past associations of the user.
 * - reviews: Reviews of the user.
 * - dispute: Dispute details associated with the user.
 */
enum UserDetailsType {
  insights,
  payments,
  camapaign,
  channels,
  personalInfo,
  pastAssociations,
  reviews,
  dispute,
}

/**
 * Loader function that retrieves user data and campaign data based on the provided ID.
 * @param {LoaderArgs} props - The loader arguments containing the request parameters.
 * @returns {Promise<Response>} - A promise that resolves to a JSON response containing user and campaign data.
 */
export const loader: LoaderFunction = async (props: LoaderArgs) => {
  const id = props.params.id;

  const cookieHeader = props.request.headers.get("Cookie");
  const cookie = await userPrefs.parse(cookieHeader);

  const userdata = await axios.post(`${BaseUrl}/api/getuser`, { id: id });

  const apidata = await axios({
    method: "post",
    url: `${BaseUrl}/api/get-my-campaigns`,
    data: { id: cookie.user.id },
  });

  return json({
    user: userdata.data.data[0],
    curUser: cookie.user,
    campaign: apidata.data.data.campaigns,
  });
};

/**
 * Represents a brand page component that displays information about a user and allows interactions such as messaging and sending invites.
 * @returns The rendered brand page component.
 */
const BrandPage = () => {
  const user = useLoaderData().user;
  const curUser = useLoaderData().curUser;

  const [userDetails, setUserDetails] = useState<UserDetailsType>(
    UserDetailsType.insights
  );
  const avatar =
    user["pic"] == "0" ||
      user["pic"] == null ||
      user["pic"] == undefined ||
      user["pic"] == ""
      ? "/images/avatar/user.png"
      : user["pic"];

  const [error, setError] = useState<string | null>(null);
  const [sus, setSus] = useState<string | null>(null);
  const messageRef = useRef<HTMLTextAreaElement>(null);

  const [connectBox, setConnectBox] = useState<boolean>(false);
  const [inviteBox, setInviteBox] = useState<boolean>(false);

  const [submit, setSubmit] = useState<boolean>(false);

  const campaign = useLoaderData().campaign;

  const isBrand = curUser.role.code == "50" ? true : false;
  const invitetocamp = async (id: number) => {
    setError(null);
    setSus(null);
    let req1 = {
      search: {
        campaign: id.toString(),
        brand: curUser.brand.id,
        influencer: user.id,
      },
    };
    const responseData = await axios.post(`${BaseUrl}/api/search-invite`, req1);

    if (responseData.data.data.length > 0) {
      return setError("Already Invited.");
    } else {
      let req = {
        campaignId: id.toString(),
        influencerId: user.id,
        fromUserId: curUser.id,
        toUserId: user.id,
        inviteMessage: "A brand invited you to their campaign.",
      };

      const data = await axios.post(`${BaseUrl}/api/add-invite`, req);
      if (data.data.status == false) {
        setError(data.data.message);
      } else {
        messageRef!.current!.value = "";
        setSus((val) => "Invite successfully sent.")
        setTimeout(() => {
          setInviteBox(false);
          setError(null);
          setSus(null);
        }, 1800)
      }
    }
  };

  const init = async () => {
    const req = {
      search: {
        type: "1",
        brand: curUser.brand.id,
        influencer: user.id,
      },
    };
    const apireq = await axios({
      method: "post",
      url: `${BaseUrl}/api/search-review`,
      data: req,
    });
    if (apireq.data.data.length > 0) {
      setSubmit(true);
    }
  };

  useEffect(() => {
    init();
  }, []);

  const sendusermessage = async () => {

    if (
      messageRef.current?.value == null ||
      messageRef.current?.value == undefined ||
      messageRef.current?.value == ""
    )
      return setError("Message can't be blank");
    let req = {
      campaignDraftId: "0",
      fromUserId: curUser.id,
      toUserId: user.id,
      comment: messageRef.current?.value,
    };
    const data = await axios({
      method: "post",
      url: `${BaseUrl}/api/add-chat`,
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
    if (!data.data.status) return setError(data.data.message);
    messageRef!.current!.value = "";
    setConnectBox(false);

  }

  return (
    <>
      <div className="w-full mt-4 shadow-xl bg-white rounded-xl">
        <div className="flex flex-col lg:flex-row w-full items-stretch">
          <div className="p-8 flex items-center gap-x-3 flex-col">
            <div>
              <img
                src={avatar}
                alt="user avatar"
                className="w-32 h-32 rounded-md object-cover object-center"
              />
            </div>
            <div>
              <h1 className="text-black text-lg font-medium my-2">
                {longtext(user.userName, 18)}
              </h1>
              <h1 className="text-gray-600 text-sm font-medium my-2">
                {longtext(user.knownAs, 25)}
              </h1>
              <p className="text-gray-800 text-md font-normal">{user.email}</p>
              <div className="flex justify-center gap-4 flex-col">
                <button
                  className="rounded-md text-black w-40 font-semibold text-lg py-2 px-4 bg-[#beff80] text-center mt-3"
                  onClick={() => {
                    setConnectBox(true);
                    setInviteBox(false);
                  }}
                >
                  Message
                </button>
                {isBrand ? (
                  <button
                    className="rounded-md text-white w-40 font-semibold text-lg py-2 px-4 bg-primary text-center"
                    onClick={() => {
                      setInviteBox(true);
                      setConnectBox(false);
                    }}
                  >
                    Send Invite 
                  </button>
                ) : (
                  null
                )}
              </div>
            </div>
          </div>
          <div className="h-80 w-[2px] bg-gray-300 hidden lg:block mt-8"></div>
          <div className="p-8 h-full grow">
            {/* connect box start here */}
            {
              connectBox == true ? <>

                <div className="flex">
                  <h1 className="text-primary text-lg font-bold text-left grow">Connect</h1>
                  <div
                    onClick={() => {
                      setConnectBox(false);
                    }}
                  >
                    <FontAwesomeIcon
                      icon={faRemove}
                      className="font-bold text-2xl text-center text-primary"
                    ></FontAwesomeIcon>
                  </div>
                </div>

                <textarea
                  ref={messageRef}
                  className="p-4 w-full h-40 outline-none border-2 bg-[#EEEEEE] focus:border-gray-300 rounded-md resize-none mt-4"
                  placeholder="message"
                ></textarea>
                {error == "" || error == null || error == undefined ? null : (
                  <NOTICEAlerts message={error}></NOTICEAlerts>
                )}
                <div className="flex">
                  <div className="grow"></div>
                  <div
                    onClick={sendusermessage}
                  >
                    <CusButton
                      text="send"
                      background="bg-primary"
                      textColor={"text-white"}
                    />
                  </div>
                </div>
              </> : null
            }
            {/* connect box end here */}

            {/* invte box start here */}
            {
              inviteBox == true ? <>

                <div className="w-full h-80 min-h-min flex flex-col">
                  <div className="flex gap-3">
                    <h1 className="text-primary text-lg font-bold text-left grow">
                      Your Campaigns
                    </h1>
                    <div
                      onClick={() => {
                        setInviteBox(false);
                      }}
                    >
                      <FontAwesomeIcon
                        icon={faRemove}
                        className="font-bold text-2xl text-center text-primary"
                      ></FontAwesomeIcon>
                    </div>
                  </div>

                  {error == "" || error == null || error == undefined ? null : (
                    <NOTICEAlerts message={error}></NOTICEAlerts>
                  )}
                  {sus == "" || sus == null || sus == undefined ? null : (
                    <SUCCESSAlerts message={sus}></SUCCESSAlerts>
                  )}
                  {campaign.length == 0 ? (
                    <NOTICEAlerts message={error!}></NOTICEAlerts>

                  ) : null}
                  <div className="overflow-y-scroll no-scrollbar">
                    {campaign.map((val: any, index: number) => {
                      return (
                        <div key={index} className="flex gap-2 my-4 items-center">
                          <p className="text-gray-600 font-semibold text-xl">
                            {index + 1}.
                          </p>
                          <p className="text-gray-600 font-semibold text-lg">
                            {val.name}
                          </p>
                          <div className="grow"></div>
                          <button
                            className="text-white rounded-md py-1 px-4 bg-secondary font-semibold"
                            onClick={() => invitetocamp(val.id)}
                          >
                            Send Invite
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </> : null
            }
            {/* invte box end here */}
            {
              connectBox == false && inviteBox == false ? <>
                <div className="flex gap-x-4 flex-col md:flex-row gap-y-2"></div>
                <div className="flex gap-3 w-full items-center my-2">
                  <h1 className="text-primary text-lg font-medium mt-4 mb-2">
                    User Bio
                  </h1>
                  <div className="grow"></div>
                  <div className="flex flex-row rounded-lg py-2 px-2 bg-[#d6d6d6] items-center">
                    <p className="cusfont font-normal text-sm px-8">SWRV Rating : <span className="font-semibold">{parseInt(user.rating)}/100</span> </p> <FontAwesomeIcon icon={faInfoCircle} className="text-primary"></FontAwesomeIcon>

                  </div>
                </div>
                <p className="text-black text-sm font-normal">{user.bio}</p>
              </> : null
            }
          </div>
        </div>
      </div>
      {/* tabs start here */}
      <div className="w-full mt-4 shadow-xl bg-white rounded-xl flex flex-nowrap md:flex-wrap gap-4 p-4 overflow-x-scroll md:overflow-x-auto">
        <UserPageTabs
          text="Insights"
          currentTab={userDetails}
          tab={UserDetailsType.insights}
          click={() => {
            setUserDetails(UserDetailsType.insights);
          }}
        ></UserPageTabs>

        <UserPageTabs
          text="Payments"
          currentTab={userDetails}
          tab={UserDetailsType.payments}
          click={() => {
            setUserDetails(UserDetailsType.payments);
          }}
        ></UserPageTabs>

        <UserPageTabs
          text="Channels"
          currentTab={userDetails}
          tab={UserDetailsType.channels}
          click={() => {
            setUserDetails(UserDetailsType.channels);
          }}
        ></UserPageTabs>

        <UserPageTabs
          text="Personal Info"
          currentTab={userDetails}
          tab={UserDetailsType.personalInfo}
          click={() => {
            setUserDetails(UserDetailsType.personalInfo);
          }}
        ></UserPageTabs>

        <UserPageTabs
          text="Past Associations"
          currentTab={userDetails}
          tab={UserDetailsType.pastAssociations}
          click={() => {
            setUserDetails(UserDetailsType.pastAssociations);
          }}
        ></UserPageTabs>

        <UserPageTabs
          text="Reviews"
          currentTab={userDetails}
          tab={UserDetailsType.reviews}
          click={() => {
            setUserDetails(UserDetailsType.reviews);
          }}
        ></UserPageTabs>
        <UserPageTabs
          text="Dispute"
          currentTab={userDetails}
          tab={UserDetailsType.dispute}
          click={() => {
            setUserDetails(UserDetailsType.dispute);
          }}
        ></UserPageTabs>
      </div>
      {/* tabs end here */}

      {/* tab details start herer */}
      <div>
        {userDetails == UserDetailsType.insights ? (
          <div>
            <UserInsights userId={user.id}></UserInsights>
          </div>
        ) : null}
      </div>

      {/* tab details start herer */}
      <div>
        {userDetails == UserDetailsType.payments ? (
          <div>
            <Payment userId={user.id}></Payment>
          </div>
        ) : null}
      </div>

      {userDetails == UserDetailsType.channels ? (
        <Channels userId={user.id}></Channels>
      ) : null}
      {userDetails == UserDetailsType.personalInfo ? (
        <PersonalInfo
          name={user.userName.toString().split("@")[0]}
          bio={user.bio}
          career={user.careerHistory}
          personal={user.personalHistory}
          external={user.externalLinks}
        ></PersonalInfo>
      ) : null}

      {userDetails == UserDetailsType.pastAssociations ? (
        <PastBrandAssociation
          userId={user.id}
          brandId={curUser.brand.id}
        ></PastBrandAssociation>
      ) : null}
      {userDetails == UserDetailsType.reviews ? (
        <>
          {!submit ? (
            <div className="mt-4">
              <MyRating
                campaignId="0"
                brandId={curUser.brand.id}
                influencerId={user.id}
                reviewType="1"
              ></MyRating>
            </div>
          ) : null}


          <Review userId={user.id} brandId={curUser.brand.id}></Review>
        </>
      ) : null}

      {userDetails == UserDetailsType.dispute ? (
        <Dispute brandId={curUser.brand.id} userId={user.id}></Dispute>
      ) : null}
      {/* tab detals end here */}
    </>
  );
};

export default BrandPage;

/**
 * Represents the props for a user page tab component.
 * @interface UserPageTabsProps
 * @property {UserDetailsType} tab - The type of the tab.
 * @property {UserDetailsType} currentTab - The currently active tab.
 * @property {string} text - The text to display on the tab.
 * @property {() => void} click - The function to call when the tab is clicked.
 */
interface UserPageTabsProps {
  tab: UserDetailsType;
  currentTab: UserDetailsType;
  text: string;
  click: () => void;
}
const UserPageTabs: React.FC<UserPageTabsProps> = (
  props: UserPageTabsProps
): JSX.Element => {
  /**
   * Renders a custom button component with the given props.
   * @param {Object} props - The props for the custom button component.
   * @param {Function} props.click - The click event handler for the button.
   * @param {string} props.text - The text to display on the button.
   * @param {string} props.currentTab - The current active tab.
   * @param {string} props.tab - The tab associated with the button.
   * @returns {JSX.Element} - The rendered custom button component.
   */
  return (
    <>
      <div onClick={props.click}>
        <CusButton
          text={props.text}
          background={`${props.currentTab == props.tab ? "bg-[#01FFF4]" : "bg-gray-100"
            }`}
          fontwidth="font-bold"
          textColor={`${props.currentTab == props.tab ? "text-black" : "text-gray-600"
            }`}
          margin="m-0"
        ></CusButton>
      </div>
    </>
  );
};

interface ChannelsProps {
  userId: string;
}

/**
 * A functional component that renders a table of channels.
 * @param {ChannelsProps} props - The props for the component.
 * @returns {JSX.Element} - The rendered component.
 */
const Channels: React.FC<ChannelsProps> = (
  props: ChannelsProps
): JSX.Element => {
  const [handles, setHandles] = useState<any[]>([]);

  const init = async () => {
    const datahandles = await axios.post(
      `${BaseUrl}/api/get-user-handles`,
      { userId: props.userId },
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

    setHandles((val) => datahandles.data.data);
  };

  useEffect(() => {
    init();
  }, []);

  return (
    <>
      <div className="bg-white p-4 w-full mt-4 flex flex-wrap gap-4 rounded-xl">
        <table className="md:w-full md:table-auto border-separate border-spacing-y-3 w-[700px]">
          <thead className="w-full bg-gray-100 rounded-xl p-2">
            <tr>
              <th scope="col" className="mt-2 font-normal py-2 pl-2 text-left">
                Media
              </th>
              <th scope="col" className="mt-2 font-normal py-2 text-left">
                Platform Name
              </th>
              <th scope="col" className="mt-2 font-normal py-2 text-left">
                Account
              </th>
              <th scope="col" className="mt-2 font-normal py-2 text-left">
                Followers
              </th>
            </tr>
          </thead>
          <tbody className="gap-y-4">
            {handles.map((val: any, index: number) => (
              <tr key={index}>
                <td className="pl-2">
                  <img
                    src={val.platformLogoUrl}
                    alt="error"
                    className="w-8 h-8 rounded-md object-cover"
                  />
                </td>
                <td className="text-left">{val.platformName}</td>
                <td className="text-left">{val.handleName}</td>
                <td className="text-left">{val.follower.toString().split(".")[0]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

interface PersonalInfoProps {
  name: string;
  bio: string;
  personal: string;
  career: string;
  external: string;
}

/**
 * A functional component that displays personal information of a user.
 * @param {PersonalInfoProps} props - The props object containing the personal information.
 * @returns {JSX.Element} - The JSX element representing the personal information component.
 */
const PersonalInfo: React.FC<PersonalInfoProps> = (
  props: PersonalInfoProps
): JSX.Element => {
  const bio =
    props.bio == null || props.bio == undefined || props.bio == ""
      ? "User bio is empty."
      : props.bio;
  const personal =
    props.personal == null ||
      props.personal == undefined ||
      props.personal == ""
      ? "User personal history is empty."
      : props.personal;
  const career =
    props.career == null || props.career == undefined || props.career == ""
      ? "User career history is empty."
      : props.career;
  const external =
    props.external == null ||
      props.external == undefined ||
      props.external == ""
      ? "User external links is empty."
      : props.external;
  return (
    <>
      <div className="bg-white p-4 w-full mt-4 rounded-xl">
        <h3 className="text-primary text-xl font-semibold mt-4">
          {props.name}
        </h3>
        <p className="text-left font-normal text-gray-700">{bio}</p>
        <h3 className="text-primary text-xl font-semibold mt-4">
          Personal Life
        </h3>
        <p className="text-left font-normal text-gray-700">{personal}</p>
        <h3 className="text-primary text-xl font-semibold mt-4">Career</h3>
        <p className="text-left font-normal text-gray-700">{career}</p>
        <h3 className="text-primary text-xl font-semibold mt-4">
          External Links
        </h3>
        <p className="text-left font-normal text-gray-700">{external}</p>
      </div>
    </>
  );
};

interface PastBrandAssociationProps {
  brandId: string;
  userId: string;
}
/**
 * A React functional component that displays past brand associations for a user.
 * @param {PastBrandAssociationProps} props - The props for the component.
 * @returns {JSX.Element} - The rendered component.
 */
/**
 * A React functional component that displays past brand associations for a user.
 * @param {PastBrandAssociationProps} props - The props for the component.
 * @returns {JSX.Element} - The rendered component.
 */
const PastBrandAssociation: React.FC<PastBrandAssociationProps> = (
  props: PastBrandAssociationProps
): JSX.Element => {
  const [resDarft, setResDarft] = useState<any[]>([]);

  const init = async () => {
    let req = {
      search: {
        fromUser: props.userId,
        influencer: props.userId,
        brand: props.brandId,
      },
    };

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
      <div className="bg-white p-4 w-full mt-4 rounded-xl">
        {resDarft.length == 0 ? (

          <NOTICEAlerts message="This user does not have any past associations."></NOTICEAlerts>
        ) : (
          <div className="flex flex-wrap gap-6 pb-8 pt-6">
            {resDarft.map((val: any, index: number) => {
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
                  key={index}
                  className="my-2 p-4 bg-white rounded-lg shadow-lg w-60"
                >
                  <div className="flex">
                    <img
                      src={image}
                      alt="influencer pic"
                      className="w-10 h-10 shrink-0 rounded-md"
                    />
                    <div className="ml-2">
                      <p className="text-md font-medium">{val.brand.name}</p>
                      <p className="text-sm font-medium">{val.brand.email}</p>
                    </div>
                  </div>
                  <p className="mt-2 text-md font-medium">Description</p>
                  <p className="text-sm font-medium">{val.description}</p>
                  <p className="mt-2 text-md font-medium">Attachment</p>
                  <a
                    target="_blank"
                    className="mt-2 text-sm font-normal border-2 border-blue-500 inline-block my-2 py-1 px-4  text-blue-500 hover:text-white hover:bg-blue-500"
                    href={val.attach01}
                  >
                    View Doc
                  </a>
                  <p className="mt-2 text-md font-medium">Status</p>
                  <p
                    className={`mt-2 text-md text-white font-medium text-center rounded-md ${val.status.name == "ACCEPTED"
                      ? "bg-green-500"
                      : val.status.name == "PENDING"
                        ? "bg-yellow-500"
                        : "bg-red-500"
                      }`}
                  >
                    {val.status.name}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
};
interface RreviewProps {
  brandId: string;
  userId: string;
}
/**
 * A React functional component that displays user reviews.
 * @param {RreviewProps} props - The props object containing the userId.
 * @returns {JSX.Element} - The rendered component.
 */
const Review: React.FC<RreviewProps> = (props: RreviewProps): JSX.Element => {
  const [review, setReview] = useState<any[]>([]);

  const init = async () => {
    const datareview = await axios.post(
      `${BaseUrl}/api/get-user-review`,
      { userId: props.userId },
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

    setReview((val) => datareview.data.data);
  };

  useEffect(() => {
    init();
  }, []);
  return (
    <>
      <div className="bg-white p-4 w-full mt-4 rounded-xl ">
        <p className="text-md text-primary font-semibold text-lg cusfont py-1">
          Your Reviews
        </p>
        <div className="w-full h-[1px] bg-slate-300 mb-3"></div>
        {review.length == 0 ?
          <NOTICEAlerts message="No Reviews"></NOTICEAlerts> : null
        }
        <div className="flex-wrap flex gap-6">
          {review.map((val: any, index: number) => {
            return (
              <div className="rounded-md shadow-lg p-6 w-80" key={index}>
                <div className="flex gap-4">
                  <img
                    src={val.brandLogoUrl}
                    alt="brand logo"
                    className="w-20 h-20 rounded-md object-cover object-center"
                  />
                  <div className="h-full">
                    <p className="text-xl font-medium">{val.brandName}</p>
                  </div>
                </div>
                <div>
                  <p className="text-lg text-gray-600 font-medium mt-4">
                    Campaign Rating
                  </p>
                  <Rating
                    initialValue={Math.floor(
                      (Number(val.avg_rating1) +
                        Number(val.avg_rating2) +
                        Number(val.avg_rating3)) /
                      3
                    )}
                    size={35}
                  ></Rating>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

/**
 * Represents the properties of a payment.
 * @interface PaymentProps
 * @property {string} userId - The ID of the user making the payment.
 */
interface PaymentProps {
  userId: string;
}

/**
 * A functional component that displays the payment status and revenue information for a user.
 * @param {PaymentProps} props - The props object containing the userId.
 * @returns {JSX.Element} - The rendered component.
 */
const Payment: React.FC<PaymentProps> = (props: PaymentProps): JSX.Element => {
  const [status, setStatus] = useState<any[]>([]);

  const init = async () => {
    const status = await axios.post(
      `${BaseUrl}/api/payment-status`,
      { userId: props.userId },
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

    setStatus((val) => status.data.data);
  };
  useEffect(() => {
    init();
  }, []);

  return (
    <>
      <div>
        <div className="bg-white py-2 rounded-md p-6 mt-10">
          <p className="text-left font-semibold text-2xl text-gray-800 my-4">
            Brand wise revenue
          </p>
          {status.length == 0 ? (
            <NOTICEAlerts message="No Revenue"></NOTICEAlerts>
          ) : (
            <table className="md:w-full md:table-auto border-separate border-spacing-y-3 w-[700px]">
              <thead className="w-full bg-gray-100 rounded-xl p-2">
                <tr>
                  <th scope="col" className="mt-2 font-normal py-2 pl-2 text-left">
                    Brand
                  </th>
                  <th scope="col" className="mt-2 font-normal py-2 text-left">
                    Campaign Name
                  </th>
                  <th scope="col" className="mt-2 font-normal py-2 text-left">
                    Earning
                  </th>
                  <th scope="col" className="mt-2 font-normal py-2 text-left">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="gap-y-4">
                {status.map((val: any, index: number) => (
                  <tr key={index}>
                    <td className="pl-2">
                      <img
                        src={val.brandLogoUrl}
                        alt="error"
                        className="w-12 h-12 rounded-md object-cover"
                      />
                    </td>
                    <td>{val.campaign_name}</td>
                    <td>
                      {" "}
                      {val.total_amount_requested.toString().split(".")[0]}
                    </td>
                    <td>
                      {format(
                        new Date(
                          Date.now() -
                          val.days_since_payment_made * 24 * 60 * 60 * 1000
                        )
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
};

interface DisputeProps {
  userId: string;
  brandId: string;
}
/**
 * A functional component that renders a dispute form.
 * @param {DisputeProps} props - The props for the Dispute component.
 * @returns {JSX.Element} - The rendered Dispute component.
 */
const Dispute: React.FC<DisputeProps> = (props: DisputeProps): JSX.Element => {
  const [error, setError] = useState<string | null>(null);
  const [sus, setSus] = useState<string | null>(null);
  const messageRef = useRef<HTMLTextAreaElement | null>(null);
  const reasonRef = useRef<HTMLSelectElement | null>(null);
  const submit = async () => {
    if (
      messageRef.current?.value == null ||
      messageRef.current?.value == undefined ||
      messageRef.current?.value == ""
    ) {
      setError("Fill the message.");
    } else if (
      reasonRef.current?.value == null ||
      reasonRef.current?.value == undefined ||
      reasonRef.current?.value == "" ||
      reasonRef.current?.value == "0"
    ) {
      setError("Select one reason.");
    } else {
      const req = {
        type: reasonRef.current?.value,
        userId: props.userId,
        brandId: props.brandId,
        isBrand: 0,
        message: messageRef.current?.value,
      };

      const data = await axios({
        method: "post",
        url: `${BaseUrl}/api/add-dispute`,
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
      } else {
        setError(null);
        setSus("Message sent!");
        reasonRef!.current!.value = "";
        messageRef!.current!.value = "";
      }
    }
  };
  return (
    <>
      <div>

        <div className="rounded-xl shadow-xl bg-white p-4 mt-2 w-96">
          <p className="text-lg text-primary py-1 cusfont font-semibold">Dispute</p>
          <div className="w-full h-[1px] bg-slate-300"></div>
          <select
            ref={reasonRef}
            name="reason"
            id="reason"
            className="w-full rounded-md border-none outline-none bg-gray-100 py-2 my-2 px-2 cursor-pointer"
          >
            <option value="1">Product or service issue</option>
            <option value="2">Billing or payment issue</option>
            <option value="3">Shipping or delivery issue</option>
            <option value="4">Customer service issue</option>
            <option value="5">Website or app issue</option>
            <option value="6">Other issue</option>
          </select>
          <textarea
            ref={messageRef}
            className="p-4 w-full h-40 outline-none border-2 border-gray-300 focus:border-gray-300 rounded-md resize-none"
            placeholder="Your message"
          ></textarea>
          {error == "" || error == null || error == undefined ? null : (
            <NOTICEAlerts message={error}></NOTICEAlerts>
          )}
          {sus == "" || sus == null || sus == undefined ? null : (
            <SUCCESSAlerts message={sus}></SUCCESSAlerts>
          )}
          <div onClick={submit}>
            <CusButton text="Send Message" background="bg-primary"></CusButton>
          </div>
        </div>
      </div>
    </>
  );
};

interface UserInsightsProps {
  userId: string;
}
const UserInsights: React.FC<UserInsightsProps> = (props: UserInsightsProps): JSX.Element => {


  const [platformData, setPlatformData] = useState<{ [key: string]: any }>();

  const [allPlatformData, setAllPlatformData] = useState<any[]>([]);


  const init = async () => {
    const userdata = await axios.post(`${BaseUrl}/api/get-user-handles`, {
      userId: props.userId,
    });
    if (userdata.data.status) {
      setAllPlatformData((val) => userdata.data.data)
    }


  }

  useEffect(() => {
    init();
  }, []);

  const getPlatform = async (handle_id: string) => {
    const userdata = await axios.post(`${BaseUrl}/api/get-insta-handel-byid`, {
      userId: props.userId,
      handleId: handle_id,
    });
    setPlatformData((val) => userdata.data.data[0]);
  };



  const handeladdupdate = async (handle_id: string) => {
    const modashdata = await axios({
      method: "get",
      url: `https://api.modash.io/v1/instagram/profile/nusr_et/report?access_token=8PVJbSqOpTYwQ90B3sMMji0u05vhpOhN`,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Allow-Options": "*",
        "Access-Control-Allow-Methods": "*",
        "X-Content-Type-Options": "*",
        "Content-Type": "application/json",
        Authorization: "Bearer 8PVJbSqOpTYwQ90B3sMMji0u05vhpOhN",
        Accept: "*",
      },
    });


    const data = modashdata.data;
    if (!data.error) {
      const userdata = await axios.post(`${BaseUrl}/api/add-insta-handel`, {
        userId: props.userId,
        handleId: handle_id,
        userName: data.profile.profile.username,
        followers: data.profile.profile.followers,
        pictureurl: data.profile.profile.picture,
        postsCount: data.profile.postsCount,
        engagementRate: data.profile.profile.engagementRate,
        engagements: data.profile.profile.engagements,
        city: data.profile.city,
        country: data.profile.country,
        language: data.profile.langauage.name,
        isVerified: data.profile.isVerified,
        isPrivate: data.profile.isPrivate,
        avgReelsPlays: data.profile.avgReelsPlays,
        avgLikes: data.profile.avgLikes,
        avgComments: data.profile.avgComments,
        avgViews: data.profile.avgViews,
        paidPostPerformance: data.profile.paidPostPerformance,
        genderMale: data.profile.genders[1].weight,
        genderFemale: data.profile.genders[0].weight,
        geoCities1: data.profile.geoCities[0].name,
        geoCities2: data.profile.geoCities[1].name,
        geoCities3: data.profile.geoCities[2].name,
        geoCities4: data.profile.geoCities[3].name,
        geoCities5: data.profile.geoCities[4].name,
        geoCountries1: data.profile.geoCountries[0].name,
        geoCountries2: data.profile.geoCountries[1].name,
        geoCountries3: data.profile.geoCountries[2].name,
        geoCountries4: data.profile.geoCountries[3].name,
        geoCountries5: data.profile.geoCountries[4].name,
        ages13_17: data.profile.ages[0].weight,
        ages18_24: data.profile.ages[1].weight,
        ages25_34: data.profile.ages[2].weight,
        ages35_44: data.profile.ages[3].weight,
        ages45_64: data.profile.ages[4].weight,
        ages65_: data.profile.ages[5].weight,
        likedPost1Url: data.profile.popularPosts[0].url,
        likedPost1CreatedAt: data.profile.popularPosts[0].created,
        likedPost1Likes: data.profile.popularPosts[0].likes,
        likedPost1Comments: data.profile.popularPosts[0].comments,
        liked1Post1Image: data.profile.popularPosts[0].thumbnail,
        likedPost2Url: data.profile.popularPosts[1].url,
        likedPost2CreatedAt: data.profile.popularPosts[1].created,
        likedPost2Likes: data.profile.popularPosts[1].likes,
        likedPost2Comments: data.profile.popularPosts[1].comments,
        likedPost2Image: data.profile.popularPosts[1].thumbnail,
        likedPost3Url: data.profile.popularPosts[2].url,
        likedPost3CreatedAt: data.profile.popularPosts[2].created,
        likedPost3Likes: data.profile.popularPosts[2].likes,
        likedPost3Comments: data.profile.popularPosts[2].comments,
        likedPost3Image: data.profile.popularPosts[2].thumbnail,
        recentPost1Url: data.profile.recentPosts[0].url,
        recentPost1CreatedAt: data.profile.recentPosts[0].created,
        recentPost1Like: data.profile.recentPosts[0].likes,
        recentPost1Comments: data.profile.recentPosts[0].comments,
        recentPost2Url: data.profile.recentPosts[1].url,
        recentPost2CreatedAt: data.profile.recentPosts[1].created,
        recentPost2Like: data.profile.recentPosts[1].likes,
        recentPost2Comments: data.profile.recentPosts[1].comments,
        recentPost3Url: data.profile.recentPosts[2].url,
        recentPost3CreatedAt: data.profile.recentPosts[2].created,
        recentPost3Like: data.profile.recentPosts[2].likes,
        recentPost3Comments: data.profile.recentPosts[2].comments,
        oneMonthagoFollower: data.profile.statHistory[7].followers,
        oneMonthagoAvgLike: data.profile.statHistory[7].avgLikes,
        oneMonthAgoFollowing: data.profile.statHistory[7].following,
        twoMonthagoFollower: data.profile.statHistory[6].followers,
        twoMonthagoAvgLike: data.profile.statHistory[6].avgLikes,
        twoMonthAgoFollowing: data.profile.statHistory[6].following,
        threeMonthagoFollower: data.profile.statHistory[5].followers,
        threeMonthagoAvgLike: data.profile.statHistory[5].avgLikes,
        threeMonthAgoFollowing: data.profile.statHistory[5].following,
        fourMonthagoFollower: data.profile.statHistory[4].followers,
        fourMonthagoAvgLike: data.profile.statHistory[4].avgLikes,
        fourMonthAgoFollowing: data.profile.statHistory[4].following,
        fiveMonthagoFollower: data.profile.statHistory[3].followers,
        fiveMonthagoAvgLike: data.profile.statHistory[3].avgLikes,
        fiveMonthAgoFollowing: data.profile.statHistory[3].following,
      });
    } else {
    }
  };

  return (
    <>
      <div className="grow bg-[#eeeeee] my-2 rounded-md p-4 w-full">
        <h1 className="font-medium text-xl text-black">User Insights</h1>
        <div className="w-full bg-slate-400 h-[1px] my-2"></div>
        {allPlatformData.length == 0 ||
          allPlatformData == null ||
          allPlatformData == undefined ? (
          <NOTICEAlerts message="User does not have any channel"></NOTICEAlerts>
        ) : (
          <div className="flex gap-4 flex-wrap">
            {allPlatformData.map((val: any, index: number) => {
              return (
                <div
                  key={index}
                  className="bg-white rounded-md px-4 py-2 my-2 text-slate-700 font-medium text-md flex-nowrap w-52 shadow-lg"
                >
                  <div className="flex gap-3 w-full items-center">
                    <img
                      src={val.platformLogoUrl}
                      alt="platform logo"
                      className="w-8 h-8 rounded-md"
                    />
                    <div>
                      <div className="text-lg text-black">{val.platformName}</div>
                      <div className="text-sm text-black">{val.handleName}</div>
                    </div>
                    <div className="grow"></div>
                  </div>
                  <button
                    className="rounded-md w-full text-black  text-sm py-2 bg-[#ff88bb] text-center mt-2 cusfont font-medium"
                    onClick={() => getPlatform(val.handle_id)}
                  >
                    View Info
                  </button>
                </div>
              );
            })}
          </div>
        )}
        <div className="bg-gray-400 w-full h-[2px] my-4"></div>
        {platformData == null || platformData == undefined ? (
          <NOTICEAlerts message="Kindly select a channel to display the insights"></NOTICEAlerts>
        ) : (
          <div className="flex flex-wrap gap-6">
            <div className="bg-white shadow-lg rounded-md px-4 py-2 my-2 text-black font-medium text-md flex-nowrap w-80">
              <p className="text-lg text-center font-semibold">User Info</p>
              <div className="bg-gray-400 w-full h-[2px] my-4"></div>
              <div className="mx-auto">
                <img
                  src={platformData.picUrl}
                  alt="avatar"
                  className="rounded-md w-20 h-20 object-cover object-center"
                />
              </div>
              <p className="text-lg text-left font-normal">
                User Name : {platformData.userName}
              </p>
              <p className="text-lg text-left font-normal">
                Language : {platformData.language}
              </p>
              <p className="text-lg text-left font-normal">
                Verified : {platformData.isVerified ? "Yes" : "No"}
              </p>
              <p className="text-lg text-left font-normal">
                Private : {platformData.isPrivate ? "Yes" : "No"}
              </p>
              <p className="text-lg text-left font-normal">
                City : {platformData.city}
              </p>
              <p className="text-lg text-left font-normal">
                Country : {platformData.country}
              </p>
              <p className="text-lg text-left font-normal">
                Followers :{" "}
                {Number(platformData.followers).toLocaleString("en-US")}
              </p>
              <p className="text-lg text-left font-normal">
                Post Count :{" "}
                {Number(platformData.postCount).toLocaleString("en-US")}
              </p>
              <p className="text-lg text-left font-normal">
                Engagement Rate : {platformData.engagementRate}
              </p>
              <p className="text-lg text-left font-normal">
                Engagements: {platformData.engagements}
              </p>
              <p className="text-lg text-left font-normal">
                Paid Post : {platformData.paidPostPerformance}
              </p>
            </div>
            <div className="bg-white shadow-lg rounded-md px-4 py-2 my-2 text-black font-medium text-md flex-nowrap w-80">
              <p className="text-lg text-center font-semibold">
                User Average Info
              </p>
              <div className="bg-gray-400 w-full h-[2px] my-4"></div>
              <p className="text-lg text-left font-normal">
                Average Reels Play :{" "}
                {Number(platformData.avgReelsPlays).toLocaleString("en-US")}
              </p>
              <p className="text-lg text-left font-normal">
                Average Likes :{" "}
                {Number(platformData.avgLikes).toLocaleString("en-US")}
              </p>
              <p className="text-lg text-left font-normal">
                Average Views :{" "}
                {Number(platformData.avgViews).toLocaleString("en-US")}
              </p>
              <p className="text-lg text-left font-normal">
                Average Comments :{" "}
                {Number(platformData.avgComments).toLocaleString("en-US")}
              </p>
              <div className="bg-gray-400 w-full h-[2px] my-4"></div>
              <p className="text-lg text-center font-semibold">User interest</p>
              <div className="bg-gray-400 w-full h-[2px] my-4"></div>
              <p className="text-lg text-left font-normal">
                Male : {(Number(platformData.genderMale) * 100).toFixed(2)} %
              </p>
              <ProgressBar progress={Math.round(Number(platformData.genderMale) * 100)} height="h-6" ></ProgressBar>

              <p className="text-lg text-left font-normal">
                Female : {(Number(platformData.genderFemale) * 100).toFixed(2)}{" "}
                %
              </p>
              <ProgressBar progress={Math.round(Number(platformData.genderFemale) * 100)} height="h-6" ></ProgressBar>

            </div>
            <div className="bg-white shadow-lg rounded-md px-4 py-2 my-2 text-black font-medium text-md flex-nowrap w-80">
              <p className="text-lg text-center font-semibold">
                User Location Info
              </p>
              <div className="bg-gray-400 w-full h-[2px] my-4"></div>
              <p className="text-lg text-left font-normal">
                City 1 : {platformData.geoCities1}
              </p>
              <p className="text-lg text-left font-normal">
                City 2 : {platformData.geoCities2}
              </p>
              <p className="text-lg text-left font-normal">
                City 3 : {platformData.geoCities3}
              </p>
              <p className="text-lg text-left font-normal">
                City 4 : {platformData.geoCities4}
              </p>
              <p className="text-lg text-left font-normal">
                City 5 : {platformData.geoCities5}
              </p>
              <div className="bg-gray-400 w-full h-[2px] my-4"></div>

              <p className="text-lg text-left font-normal">
                Country 1 : {platformData.geoCountries1}
              </p>
              <p className="text-lg text-left font-normal">
                Country 2 : {platformData.geoCountries2}
              </p>
              <p className="text-lg text-left font-normal">
                Country 3 : {platformData.geoCountries3}
              </p>
              <p className="text-lg text-left font-normal">
                Country 4 : {platformData.geoCountries4}
              </p>
              <p className="text-lg text-left font-normal">
                Country 5 : {platformData.geoCountries5}
              </p>
            </div>
            <div className="bg-white shadow-lg rounded-md px-4 py-2 my-2 text-black font-medium text-md flex-nowrap w-80">
              <p className="text-lg text-center font-semibold">
                Age base interest
              </p>
              <div className="bg-gray-400 w-full h-[2px] my-4"></div>
              <p className="text-lg text-left font-normal">
                Age 13-17 : {(Number(platformData.ages13_17) * 100).toFixed(2)}{" "}
                %
              </p>
              <ProgressBar progress={Math.round(Number(platformData.ages13_17) * 100)} height="h-6" ></ProgressBar>
              <p className="text-lg text-left font-normal">
                Age 18-24 : {(Number(platformData.ages18_24) * 100).toFixed(2)}{" "}
                %
              </p>
              <ProgressBar progress={Math.round(Number(platformData.ages18_24) * 100)} height="h-6" ></ProgressBar>
              <p className="text-lg text-left font-normal">
                Age 25-34 : {(Number(platformData.ages25_34) * 100).toFixed(2)}{" "}
                %
              </p>
              <ProgressBar progress={Math.round(Number(platformData.ages25_34) * 100)} height="h-6" ></ProgressBar>
              <p className="text-lg text-left font-normal">
                Age 35-44 : {(Number(platformData.ages35_44) * 100).toFixed(2)}{" "}
                %
              </p>
              <ProgressBar progress={Math.round(Number(platformData.ages35_44) * 100)} height="h-6" ></ProgressBar>
              <p className="text-lg text-left font-normal">
                Age 45-64 : {(Number(platformData.ages45_64) * 100).toFixed(2)}{" "}
                %
              </p>
              <ProgressBar progress={Math.round(Number(platformData.ages45_64) * 100)} height="h-6" ></ProgressBar>
              <p className="text-lg text-left font-normal">
                Age 65+ : {(Number(platformData.ages65_) * 100).toFixed(2)} %
              </p>
              <ProgressBar progress={Math.round(Number(platformData.ages65_) * 100)} height="h-6" ></ProgressBar>

            </div>
            <div className="bg-white shadow-lg rounded-md px-4 py-2 my-2 text-black font-medium text-md flex-nowrap w-80">
              <p className="text-lg text-center font-semibold">
                User Likes first post details
              </p>
              <div className="bg-gray-400 w-full h-[2px] my-4"></div>
              <div className="mx-auto">
                <img
                  src={platformData.liked1Post1Image}
                  alt="avatar"
                  className="rounded-md w-20 h-20 object-cover object-ce
                "
                />
              </div>
              <a
                className="inline-block mt-4 px-2 rounded-md border border-cyan-400 bg-cyan-500 bg-opacity-10 text-cyan-500 cursor-pointer text-center text-xl"
                href={platformData.likedPost1Url}
                target="_blank"
              >
                Visit
              </a>
              <p className="text-lg text-left font-normal">
                Liked Post date :{" "}
                {new Date(platformData.likedPost1CreatedAt).toLocaleString()}
              </p>
              <p className="text-lg text-left font-normal">
                Liked Post Likes :{" "}
                {Number(platformData.likedPost1Likes).toLocaleString("en-US")}
              </p>
              <p className="text-lg text-left font-normal">
                Liked Post Comments :{" "}
                {Number(platformData.likedPost1Comments).toLocaleString(
                  "en-US"
                )}
              </p>
              <div className="bg-gray-400 w-full h-[2px] my-4"></div>
              <p className="text-lg text-center font-semibold">
                User Likes second post details
              </p>
              <div className="bg-gray-400 w-full h-[2px] my-4"></div>

              <div className="mx-auto">
                <img
                  src={platformData.likedPost2Image}
                  alt="avatar"
                  className="rounded-md w-20 h-20 object-cover object-ce
                "
                />
              </div>
              <a
                className="inline-block mt-4 px-2 rounded-md border border-cyan-400 bg-cyan-500 bg-opacity-10 text-cyan-500 cursor-pointer text-center text-xl"
                href={platformData.likedPost2Url}
                target="_blank"
              >
                Visit
              </a>
              <p className="text-lg text-left font-normal">
                Liked Post date :{" "}
                {new Date(platformData.likedPost2CreatedAt).toLocaleString()}
              </p>
              <p className="text-lg text-left font-normal">
                Liked Post Likes :{" "}
                {Number(platformData.likedPost2Likes).toLocaleString("en-US")}
              </p>
              <p className="text-lg text-left font-normal">
                Liked Post Comments :{" "}
                {Number(platformData.likedPost2Comments).toLocaleString(
                  "en-US"
                )}
              </p>
              <div className="bg-gray-400 w-full h-[2px] my-4"></div>
              <p className="text-lg text-center font-semibold">
                User Likes Third post details
              </p>
              <div className="bg-gray-400 w-full h-[2px] my-4"></div>

              <div className="mx-auto">
                <img
                  src={platformData.likedPost3Image}
                  alt="avatar"
                  className="rounded-md w-20 h-20 object-cover object-ce
                "
                />
              </div>
              <a
                className="inline-block mt-4 px-2 rounded-md border border-cyan-400 bg-cyan-500 bg-opacity-10 text-cyan-500 cursor-pointer text-center text-xl"
                href={platformData.likedPost3Url}
                target="_blank"
              >
                Visit
              </a>
              <p className="text-lg text-left font-normal">
                Liked Post date :{" "}
                {new Date(platformData.likedPost3CreatedAt).toLocaleString()}
              </p>
              <p className="text-lg text-left font-normal">
                Liked Post Likes :{" "}
                {Number(platformData.likedPost3Likes).toLocaleString("en-US")}
              </p>
              <p className="text-lg text-left font-normal">
                Liked Post Comments :{" "}
                {Number(platformData.likedPost3Comments).toLocaleString(
                  "en-US"
                )}
              </p>
              <div className="bg-gray-400 w-full h-[2px] my-4"></div>

              <div className="bg-gray-400 w-full h-[2px] my-4"></div>
            </div>
            <div className="bg-white shadow-lg rounded-md px-4 py-2 my-2 text-black font-medium text-md flex-nowrap w-80">
              <p className="text-lg text-center font-semibold">
                Recent Post One
              </p>
              <div className="bg-gray-400 w-full h-[2px] my-4"></div>
              <a
                className="inline-block mt-4 px-2 rounded-md border border-cyan-400 bg-cyan-500 bg-opacity-10 text-cyan-500 cursor-pointer text-center text-xl"
                href={platformData.recentPost1Url}
                target="_blank"
              >
                Visit
              </a>
              <p className="text-lg text-left font-normal">
                Liked Post date :{" "}
                {new Date(platformData.recentPost1CreatedAt).toLocaleString()}
              </p>
              <p className="text-lg text-left font-normal">
                Liked Post Likes :{" "}
                {Number(platformData.recentPost1Likes).toLocaleString("en-US")}
              </p>
              <p className="text-lg text-left font-normal">
                Liked Post Comments :{" "}
                {Number(platformData.recentPost1Comments).toLocaleString(
                  "en-US"
                )}
              </p>
              <div className="bg-gray-400 w-full h-[2px] my-4"></div>
              <p className="text-lg text-center font-semibold">
                Recent Post Second
              </p>
              <div className="bg-gray-400 w-full h-[2px] my-4"></div>
              <a
                className="inline-block mt-4 px-2 rounded-md border border-cyan-400 bg-cyan-500 bg-opacity-10 text-cyan-500 cursor-pointer text-center text-xl"
                href={platformData.recentPost2Url}
                target="_blank"
              >
                Visit
              </a>
              <p className="text-lg text-left font-normal">
                Liked Post date :{" "}
                {new Date(platformData.recentPost2CreatedAt).toLocaleString()}
              </p>
              <p className="text-lg text-left font-normal">
                Liked Post Likes :{" "}
                {Number(platformData.recentPost2Likes).toLocaleString("en-US")}
              </p>
              <p className="text-lg text-left font-normal">
                Liked Post Comments :{" "}
                {Number(platformData.recentPost2Comments).toLocaleString(
                  "en-US"
                )}
              </p>
              <div className="bg-gray-400 w-full h-[2px] my-4"></div>

              <p className="text-lg text-center font-semibold">
                Recent Post Three
              </p>
              <div className="bg-gray-400 w-full h-[2px] my-4"></div>
              <a
                className="inline-block mt-4 px-2 rounded-md border border-cyan-400 bg-cyan-500 bg-opacity-10 text-cyan-500 cursor-pointer text-center text-xl"
                href={platformData.recentPost3Url}
                target="_blank"
              >
                Visit
              </a>
              <p className="text-lg text-left font-normal">
                Liked Post date :{" "}
                {new Date(platformData.recentPost3CreatedAt).toLocaleString()}
              </p>
              <p className="text-lg text-left font-normal">
                Liked Post Likes :{" "}
                {Number(platformData.recentPost3Likes).toLocaleString("en-US")}
              </p>
              <p className="text-lg text-left font-normal">
                Liked Post Comments :{" "}
                {Number(platformData.recentPost3Comments).toLocaleString(
                  "en-US"
                )}
              </p>
            </div>
            <div className="bg-white shadow-lg rounded-md px-4 py-2 my-2 text-black font-medium text-md flex-nowrap w-80">
              <p className="text-lg text-center font-semibold">
                Month wise user details
              </p>
              <div className="bg-gray-400 w-full h-[2px] my-4"></div>
              <p className="text-lg text-left font-normal">
                First Month Follower :{" "}
                {Number(platformData.oneMonthAgoFollower).toLocaleString(
                  "en-US"
                )}
              </p>
              <p className="text-lg text-left font-normal">
                First Month Average Likes :{" "}
                {Number(platformData.oneMonthAgoAvgLike).toLocaleString(
                  "en-US"
                )}
              </p>
              <p className="text-lg text-left font-normal">
                First Month Following :{" "}
                {Number(platformData.oneMonthAgoFollowing).toLocaleString(
                  "en-US"
                )}
              </p>
              <div className="bg-gray-400 w-full h-[2px] my-4"></div>
              <p className="text-lg text-left font-normal">
                Second Month Follower :{" "}
                {Number(platformData.twoMonthAgoFollower).toLocaleString(
                  "en-US"
                )}
              </p>
              <p className="text-lg text-left font-normal">
                Second Month Average Likes :{" "}
                {Number(platformData.twoMonthAgoAvgLike).toLocaleString(
                  "en-US"
                )}
              </p>
              <p className="text-lg text-left font-normal">
                Second Month Following :{" "}
                {Number(platformData.twoMonthAgoFollowing).toLocaleString(
                  "en-US"
                )}
              </p>
              <div className="bg-gray-400 w-full h-[2px] my-4"></div>
              <p className="text-lg text-left font-normal">
                Third Month Follower :{" "}
                {Number(platformData.threeMonthAgoFollower).toLocaleString(
                  "en-US"
                )}
              </p>
              <p className="text-lg text-left font-normal">
                Third Month Average Likes :{" "}
                {Number(platformData.threeMonthAgoAvgLike).toLocaleString(
                  "en-US"
                )}
              </p>
              <p className="text-lg text-left font-normal">
                Third Month Following :{" "}
                {Number(platformData.threeMonthAgoFollowing).toLocaleString(
                  "en-US"
                )}
              </p>
              <div className="bg-gray-400 w-full h-[2px] my-4"></div>
              <p className="text-lg text-left font-normal">
                Fourth Month Follower :{" "}
                {Number(platformData.fourMonthAgoFollower).toLocaleString(
                  "en-US"
                )}
              </p>
              <p className="text-lg text-left font-normal">
                Fourth Month Average Likes :{" "}
                {Number(platformData.fourMonthAgoAvgLike).toLocaleString(
                  "en-US"
                )}
              </p>
              <p className="text-lg text-left font-normal">
                Fourth Month Following :{" "}
                {Number(platformData.fourMonthAgoFollowing).toLocaleString(
                  "en-US"
                )}
              </p>
              <div className="bg-gray-400 w-full h-[2px] my-4"></div>
              <p className="text-lg text-left font-normal">
                Five Month Follower :{" "}
                {Number(platformData.fiveMonthAgoFollower).toLocaleString(
                  "en-US"
                )}
              </p>
              <p className="text-lg text-left font-normal">
                Five Month Average Likes :{" "}
                {Number(platformData.fiveMonthAgoAvgLike).toLocaleString(
                  "en-US"
                )}
              </p>
              <p className="text-lg text-left font-normal">
                Five Month Following :{" "}
                {Number(platformData.fiveMonthAgoFollowing).toLocaleString(
                  "en-US"
                )}
              </p>
            </div>
          </div>
        )}
      </div>
    </>
  );
}