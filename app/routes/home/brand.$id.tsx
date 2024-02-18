import {
  faHandshake,
  faHeart,
  faNetworkWired,
  faRemove,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { LoaderArgs, LoaderFunction, json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import useLocalStorageState from "use-local-storage-state";
import { IcRoundStar } from "~/components/icons";
import { NOTICEAlerts } from "~/components/utils/alert";
import { CusButton } from "~/components/utils/buttont";
import { CampaginCard } from "~/components/utils/campagincard";
import { BaseUrl } from "~/const";
import { userPrefs } from "~/cookies";
import { getCampaignType } from "~/utils";

/**
 * Loader function that retrieves brand data, user preferences, and other related data
 * for a given brand ID.
 * @param {LoaderArgs} props - The loader arguments containing the request parameters.
 * @returns {Promise<Response>} - A promise that resolves to a JSON response containing
 * the retrieved data.
 */
export const loader: LoaderFunction = async (props: LoaderArgs) => {
  const id = props.params.id;
  const branddata = await axios.post(`${BaseUrl}/api/get-brand`, { id: id });
  const cookieHeader = props.request.headers.get("Cookie");
  const cookie = await userPrefs.parse(cookieHeader);

  const reqdata = await axios.post(`${BaseUrl}/api/get-brand-connection`, {
    brandId: id,
  });
  const reqdata1 = await axios.post(`${BaseUrl}/api/get-brand-com-cam`, {
    brandId: id,
  });

  return json({
    brand: branddata.data.data,
    user: cookie.user,
    brandConnection: reqdata.data.data,
    brandComCam: reqdata1.data.data,
  });
};

/**
 * A functional component that renders a brand page.
 * @returns JSX elements representing the brand page.
 */
const BrandPage = () => {
  const brand = useLoaderData().brand;
  console.log(brand);
  const user = useLoaderData().user;
  const [isPast, setPast] = useState(false);
  const brandConnection = useLoaderData().brandConnection.influencer_count;
  const brandComCam = useLoaderData().brandComCam.completed_campaign;
  const logo =
    brand.logo == "" ||
      brand.logo == undefined ||
      brand.logo == null ||
      brand.logo == "0"
      ? "/images/avatar/user_one.png"
      : brand.logo;
  const [fav, setFav] = useState<boolean>(false);

  const [myfavBrand, setMyfavBrand] = useLocalStorageState<brandData[]>(
    "favbrand",
    {
      defaultValue: [],
    }
  );

  /**
   * Represents the data structure for a brand.
   * @typedef {Object} brandData
   * @property {string} id - The unique identifier of the brand.
   * @property {string} logo - The URL of the brand's logo.
   * @property {string} name - The name of the brand.
   * @property {string} email - The email address of the brand.
   * @property {string} website - The website URL of the brand.
   */
  type brandData = {
    id: string;
    logo: string;
    name: string;
    email: string;
    website: string;
  };

  /**
   * Adds a brand to the list of favorite brands and sets the 'fav' state to true.
   * @param {brandData} brand - The brand object to add to the list of favorite brands.
   * @returns None
   */
  const setFavBrand = (brand: brandData) => {
    setMyfavBrand([...myfavBrand, brand]);
    setFav(true);
  };

  /**
   * Removes a brand from the list of favorite brands.
   * @param {brandData} brand - The brand to be removed.
   * @returns None
   */
  const revmoceFavBrand = (brand: brandData) => {
    let savebrand: brandData[] = [];
    for (let i: number = 0; i < myfavBrand.length; i++) {
      if (myfavBrand[i]["id"] != brand["id"]) {
        savebrand.push(myfavBrand[i]);
      }
    }
    setMyfavBrand(savebrand);
    setFav(false);
  };

  const [sum, setSum] = useState({
    rowCount: 0,
    constCount: 3,
    rate: 0,
  });

  /**
   * Initializes the component by making an API request to retrieve search review data
   * and calculates the sum of ratings.
   * @returns None
   */
  const init = async () => {
    const req = {
      search: {
        type: "3",
        brand: brand.id,
      },
    };
    const apireq = await axios({
      method: "post",
      url: `${BaseUrl}/api/search-review`,
      data: req,
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
  };

  useEffect(() => {
    let res: boolean = false;
    myfavBrand.map((val: brandData, index: number) => {
      if (val.id == brand.id) res = true;
    });
    if (res) {
      setFav(true);
    } else {
      setFav(false);
    }
    init();
  }, []);

  const [error, setError] = useState<string | null>(null);
  const messageRef = useRef<HTMLTextAreaElement>(null);

  const [connectBox, setConnectBox] = useState<boolean>(false);

  /**
   * Sends a message to a user or brand using the provided message input.
   * @returns None
   * @throws {Error} If the message is blank or if there is an error sending the message.
   */
  const sendmessage = async () => {
    if (
      messageRef.current?.value == null ||
      messageRef.current?.value == undefined ||
      messageRef.current?.value == ""
    )
      return setError("Message can't be blank");

    let req = {
      campaignDraftId: "0",
      fromUserId: user.id,
      toUserId: brand.id,
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
    return setConnectBox(false);
  }

  return (
    <>
      <div className="w-full mt-4 shadow-xl bg-white rounded-xl">
        <div className="w-full relative">
          <div className="absolute top-5 right-5">
            <FontAwesomeIcon
              onClick={() => {
                let brandval: brandData = {
                  id: brand.id,
                  logo: logo,
                  name: brand.name,
                  email: brand.email,
                  website: brand.webUrl,
                };
                if (fav) return revmoceFavBrand(brandval);
                return setFavBrand(brandval);
              }}
              icon={faHeart}
              className={`${fav ? "text-red-500" : "text-gray-500"} h-12 w-12`}
            ></FontAwesomeIcon>
          </div>
          <img
            src={brand.banner == "" || brand.banner == undefined || brand.banner == null ? "/images/banner.jpg" : brand.banner}
            alt="error"
            className="w-full h-60 object-cover rounded-t-xl"
          />
        </div>
        <div className="flex flex-col lg:flex-row">
          <div className="p-8 flex flex-row gap-x-3 lg:flex-col">
            <div>
              <img
                src={logo ?? "/images/banner.jpg"}
                alt="brand logo"
                className="w-32 h-32 rounded-md"
              />
            </div>
            <div>
              <h1 className="text-primary text-lg font-medium mt-2">
                {brand.name}
              </h1>
              <h1 className="text-primary text-sm font-medium">
                {brand.code}
              </h1>
              <p className="text-primary text-md font-normal mt-2">
                {brand.email}
              </p>
              <p className="text-primary text-md font-normal">
                website: {brand.webUrl}
              </p>
              <div
                onClick={() => {
                  setConnectBox(true);
                }}
              >
                <CusButton
                  text="Connect"
                  background="bg-secondary"
                  fontwidth="font-bold"
                ></CusButton>
              </div>
            </div>
          </div>
          <div className="h-72 w-[2px] bg-gray-300 hidden lg:block mt-8"></div>
          <div className="p-8 w-full">
            {connectBox ?
              <div className="w-full mt-4">
                <div className="flex">
                  <h1 className="text-primary text-lg font-bold text-left">Connect</h1>
                  <div className="grow"></div>
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
                    onClick={sendmessage}
                  >
                    <CusButton
                      text="send"
                      background="bg-primary"
                      textColor={"text-white"}
                    />
                  </div>
                </div>
              </div>
              :
              <>
                <div className="flex gap-x-4 flex-col md:flex-row gap-y-2">
                  <Rating
                    rate={
                      isNaN(Math.round(sum.rate / sum.rowCount / sum.constCount))
                        ? "0"
                        : Math.round(
                          sum.rate / sum.rowCount / sum.constCount
                        ).toString()
                    }
                  ></Rating>
                  <Completed completed={brandComCam.toString()}></Completed>
                  <Connection connection={brandConnection.toString()}></Connection>
                </div>
                <h1 className="text-primary text-lg font-medium mt-4 mb-2">
                  Brand info
                </h1>
                <p className="text-black text-sm font-normal">{brand.info}</p>
              </>}

          </div>
        </div>
      </div>
      <div className="w-full mt-4 shadow-xl bg-white rounded-xl p-6">
        <div className="flex gap-4 ml-3">
          <div
            onClick={() => {
              setPast(false);
            }}
          >
            <CusButton
              text="Available Campaigns"
              background={`${isPast ? "bg-gray-100" : "bg-[#01FFF4]"}`}
              fontwidth="font-medium cusfont"
              textColor={`${isPast ? "text-gray-600" : "text-black"}`}
              textSize={"text-sm"}
            ></CusButton>
          </div>
          <div
            onClick={() => {
              setPast(true);
            }}
          >
            <CusButton
              text="Past associations"
              background={`${isPast ? "bg-[#01FFF4]" : "bg-gray-100"}`}
              fontwidth="font-medium cusfont"
              textColor={`${isPast ? "text-black" : "text-gray-600"}`}
              textSize={"text-sm"}
            ></CusButton>
          </div>
        </div>
        <div>
          {isPast ? (
            <PastBrandAssociation
              userId={user.id}
              brandId={brand.id}
            ></PastBrandAssociation>
          ) : (
            <AvailableCampaigns brandId={brand.id}></AvailableCampaigns>
          )}
        </div>
      </div>
    </>
  );
};

export default BrandPage;

/**
 * Represents the properties of a rating component.
 */
interface RatingProps {
  rate: string;
}

/**
 * A React functional component that displays a rating.
 * @param {RatingProps} props - The props for the Rating component.
 * @returns {JSX.Element} - The rendered Rating component.
 */
const Rating: React.FC<RatingProps> = (props: RatingProps): JSX.Element => {
  return (
    <>
      <div className="bg-gray-100 flex rounded-lg gap-x-4">
        <div className="bg-gray-200 p-2 rounded-md grid place-items-center shrink-0">
          <IcRoundStar
            className="text-black text-3xl" />
        </div>
        <div className="p-2 grow">
          <h1 className="text-black text-lg font-bold">{props.rate}</h1>
          <p className="text-black text-sm font-normal">Rating</p>
        </div>
      </div>
    </>
  );
};

interface ConnectionProps {
  connection: string;
}

/**
 * A functional component that represents a connection.
 * @param {ConnectionProps} props - The props for the Connection component.
 * @returns {JSX.Element} - The rendered Connection component.
 */
const Connection: React.FC<ConnectionProps> = (
  props: ConnectionProps
): JSX.Element => {
  return (
    <>
      <div className="bg-gray-100 flex rounded-lg gap-x-4">
        <div className="bg-gray-200 p-2 rounded-md grid place-items-center shrink-0">
          <FontAwesomeIcon
            className="text-black text-3xl"
            icon={faHandshake}
          ></FontAwesomeIcon>
        </div>
        <div className="p-2 grow">
          <h1 className="text-black text-lg font-bold">{props.connection}</h1>
          <p className="text-black text-sm font-normal">Connections</p>
        </div>
      </div>
    </>
  );
};

interface CompletedProps {
  completed: string;
}

/**
 * A React functional component that displays the number of completed campaigns.
 * @param {CompletedProps} props - The props object containing the completed campaign data.
 * @returns {JSX.Element} - The JSX element representing the completed component.
 */
const Completed: React.FC<CompletedProps> = (
  props: CompletedProps
): JSX.Element => {
  return (
    <>
      <div className="bg-gray-100 flex rounded-lg gap-x-4 shrink-0">
        <div className="bg-gray-200 p-2 rounded-md grid place-items-center">
          <FontAwesomeIcon
            className="text-black text-3xl"
            icon={faNetworkWired}
          ></FontAwesomeIcon>
        </div>
        <div className="p-2 grow">
          <h1 className="text-black text-lg font-bold">{props.completed}</h1>
          <p className="text-black text-sm font-normal">Completed Campaigns</p>
        </div>
      </div>
    </>
  );
};

interface AvailableCampaignsProps {
  brandId: string;
}

/**
 * A React functional component that displays available campaigns for a given brand.
 * @param {AvailableCampaignsProps} props - The props for the component.
 * @returns {JSX.Element} - The rendered component.
 */
const AvailableCampaigns: React.FC<AvailableCampaignsProps> = (
  props: AvailableCampaignsProps
): JSX.Element => {
  const [topChampaing, setTopChampaing] = useState<any[]>([]);
  const [campaignCards, setCampaignCards] = useState<React.ReactNode[]>([]);
  useEffect(() => {
    const fetchData = async () => {
      const apidata = await axios({
        method: "post",
        url: `${BaseUrl}/api/campaign-search`,
        data: { brand: props.brandId },
      });
      setTopChampaing(apidata.data.data);
    };
    fetchData();
  }, []);
  useEffect(() => {
    const createCampaignCards = async () => {
      let counter = 0;
      const cards = await Promise.all(
        topChampaing.map(async (val: any, index: number) => {
          if (counter >= 5) return null;
          counter++;
          let platforms: string[] = [];
          for (let i: number = 0; i < val["platforms"].length; i++) {
            platforms.push(val["platforms"][i]["platformLogoUrl"]);
          }
          let campaignType = await getCampaignType(val["campaignTypeId"]);
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
            <div key={index}>
              <CampaginCard
                id={val.id}
                title={val["campaignName"]}
                weburl={val.brand.webUrl}
                platforms={platforms}
                maxval={val.costPerPost.split(".")[0]}
                category={campaignType}
                image={image}
                name={val.brand.name}
                currency={val["currency"]["code"]}
                btntext="Learn more & Apply"
              ></CampaginCard>
            </div>
          );
        })
      );
      setCampaignCards(cards);
    };
    createCampaignCards();
  }, [topChampaing]);

  return (
    <div>
      {campaignCards.length == 0 ? (
        <NOTICEAlerts message="This brand has not created any campaigns yet."></NOTICEAlerts>
      ) : (
        <div className="flex flex-nowrap overflow-x-scroll md:overflow-auto md:grid xs:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 w-full p-3">{campaignCards}</div>
      )}
    </div>
  );
};

/**
 * Represents the properties of a past brand association.
 * @interface PastBrandAssociationProps
 * @property {string} brandId - The ID of the brand associated with the user.
 * @property {string} userId - The ID of the user associated with the brand.
 */
interface PastBrandAssociationProps {
  brandId: string;
  userId: string;
}
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
      {resDarft.length == 0 ? (
        <NOTICEAlerts message="This brand does not have any associations with you yet."></NOTICEAlerts>
      ) : (
        <div className="flex flex-nowrap overflow-x-scroll md:overflow-auto md:grid xs:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 w-full p-3">
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
                className="my-2 p-4 bg-white rounded-lg shadow-[0_0_4px_0_rgb(0,0,0,0.3)] w-60 md:w-auto"
              >
                <div className="flex">
                  <img
                    src={image}
                    alt="influencer pic"
                    className="w-10 h-10 shrink-0 rounded-md"
                  />
                  <div className="ml-2">
                    <p className="text-md font-medium cusfont">{val.brand.name}</p>
                    <p className="text-sm font-medium cusfont">{val.brand.email}</p>
                  </div>
                </div>
                <p className="mt-2 text-md font-medium cusfont">Description</p>
                <p className="text-sm font-normal cusfont">{val.description}</p>
                <a
                  target="_blank"
                  className="rounded-md mt-4 w-full text-sm text-center font-semibold  inline-block my-2 py-2  text-black bg-[#fbca8e]"
                  href={val.attach01}
                >
                  View attachment
                </a>

                <p
                  className={`mt-2 py-2 text-sm text-black font-semibold text-center rounded-md ${val.status.name == "ACCEPTED"
                    ? "bg-[#beff80]"
                    : val.status.name == "PENDING"
                      ? "bg-[#80fffa]"
                      : "bg-[#ff88bb]"
                    }`}
                >
                  {val.status.name}
                </p>

              </div>
            );
          })}
        </div>
      )}
    </>

  );
};

export { Rating, Connection, Completed };
