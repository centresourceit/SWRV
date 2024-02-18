import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { LoaderArgs, LoaderFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Link, useLoaderData, useNavigate } from "@remix-run/react";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { BrandCard } from "~/components/utils/brandcard";
import { CusButton } from "~/components/utils/buttont";
import { CampaginCard } from "~/components/utils/campagincard";
import { BaseUrl } from "~/const";
import { userPrefs } from "~/cookies";
import ProfileComleteStore from "~/state/home/profilecompletestat";
import { InfluencerSearch, SearchedCampaign } from "./findcampaign";
import TopInfluencerCard from "~/components/utils/topinfluencercard";
import { getCampaignType } from "~/utils";
import gsap from "gsap";
import { NOTICEAlerts } from "~/components/utils/alert";
import {
  IcBaselineFavorite,
  IcRoundStar,
  MaterialSymbolsAssignmentIndSharp,
} from "~/components/icons";

/**
 * Loader function that is executed when the route is accessed.
 * It checks if the user is logged in by parsing the cookie header.
 * If the user is not logged in, it redirects to the login page.
 * Otherwise, it makes API calls to retrieve platform, category, and country data.
 * @param {LoaderArgs} props - The loader arguments containing the request object.
 * @returns A JSON response containing user, platform, category, and country data.
 */
export const loader: LoaderFunction = async (props: LoaderArgs) => {
  const cookieHeader = props.request.headers.get("Cookie");
  const cookie = await userPrefs.parse(cookieHeader);
  if (cookie == null || cookie == undefined) {
    return redirect("/login");
  } else {
    if (cookie.isLogin == false) {
      return redirect("/login");
    }
  }
  const platformRes = await axios.post(`${BaseUrl}/api/getplatform`);
  const categoryRes = await axios.post(`${BaseUrl}/api/getcategory`);
  const countryRes = await axios.post(`${BaseUrl}/api/getcountry`);
  return json({
    user: cookie.user,
    platform: platformRes.data.data,
    category: categoryRes.data.data,
    country: countryRes.data.data,
  });
};

/**
 * The HomePage component renders the main content of the home page.
 * It retrieves user data using the useLoaderData hook and renders different components based on the user's role and profile completeness.
 * @returns The rendered JSX elements for the home page.
 */
const HomePage = () => {
  const user = useLoaderData();
  const userdata = user.user;
  const profilecomplted: String = userdata["profileCompleteness"];
  const isbrand = user.user.role.code != 10;
  const isOpen = ProfileComleteStore((state) => state.isOpen);
  const isOpenChange = ProfileComleteStore((state) => state.change);

  useEffect(() => {
    isOpenChange(profilecomplted == "1" ? false : true);
  }, []);

  /**
   * Renders a JSX component based on the given conditions and data.
   * @param {boolean} isbrand - Indicates whether the user is a brand or not.
   * @param {boolean} isOpen - Indicates whether the profile is complete or not.
   * @param {object} userdata - The user data object.
   * @param {object} user - The user object.
   * @returns A JSX component.
   */
  return (
    <>
      <div className="overflow-hidden">
        {isbrand ? (
          userdata.brand.length == 0 ||
          userdata.brand == null ||
          userdata.brand == undefined ? (
            <BrandCreate></BrandCreate>
          ) : null
        ) : null}

        {isOpen ? <ProfileComplete></ProfileComplete> : null}
        <Intro isBrand={isbrand}></Intro>
        {isbrand ? (
          <>
            {/* brand section */}
            <InfluencerSearch
              platform={user.platform}
              country={user.country}
              category={user.category}
              isCompleted={true}
              userid={user.user.id}
            ></InfluencerSearch>
            <TopInfluencer></TopInfluencer>
          </>
        ) : (
          <>
            {/* influencer section */}
            {/* <EarnSection></EarnSection> */}
            <SearchByCategory></SearchByCategory>
            <NewCampaign></NewCampaign>
            <SponsoredPosts></SponsoredPosts>
            <TopBrands></TopBrands>
          </>
        )}
      </div>
    </>
  );
};

export default HomePage;

/**
 * A functional component that renders a profile completion prompt.
 * @returns JSX elements representing the profile completion prompt.
 */
const ProfileComplete = () => {
  const changeState = ProfileComleteStore((state) => state.change);
  return (
    <>
      <div className="w-full bg-secondary rounded-xl p-2 my-4 flex">
        <div className="flex grow flex-col md:flex-row">
          <div className="grow grid place-items-center">
            <div className="py-10 md:w-[400px]">
              <h1 className="text-2xl text-white font-bold">
                Please Complete Your Profile
              </h1>
              <h1 className="text-md text-white font-normal">
                Kindly complete your profile to proceed with acitvities on SWRV
                website.
              </h1>
            </div>
          </div>
          <div className="xl:w-96 grid place-items-center">
            <Link to="/home/profilecomplete">
              <CusButton
                text="Click here to complete"
                textColor={"text-white"}
                background={"bg-primary"}
              ></CusButton>
            </Link>
          </div>
        </div>
        <div
          onClick={() => {
            changeState(false);
          }}
        >
          {" "}
          <FontAwesomeIcon
            className="text-white text-2xl font-bold"
            icon={faXmark}
          ></FontAwesomeIcon>{" "}
        </div>
      </div>
    </>
  );
};

interface IntroProps {
  isBrand: boolean;
}

/**
 * A functional component that renders an introduction section.
 * @param {IntroProps} props - The props for the Intro component.
 * @returns {JSX.Element} - The rendered JSX element.
 */
const Intro: React.FC<IntroProps> = (props: IntroProps): JSX.Element => {
  const navigator = useNavigate();
  const [brand, setBrand] = useState<any[]>([]);
  let data = [
    {
      image: "/uploads/74.png",
      id: "74",
    },
    {
      image: "/uploads/75.png",
      id: "75",
    },
    {
      image: "/uploads/76.png",
      id: "76",
    },
    {
      image: "/uploads/77.png",
      id: "77",
    },
    {
      image:
        "/uploads/78.jfif",
      id: "78",
    },
    {
      image: "/uploads/79.png",
      id: "79",
    },
    {
      image:
        "/uploads/80.jfif",
      id: "80",
    },
    {
      image:
        "/uploads/81.jfif",
      id: "81",
    },
    {
      image: "/uploads/82.png",
      id: "82",
    },
    {
      image: "/uploads/83.png",
      id: "83",
    },
    {
      image:
        "/uploads/84.jfif",
      id: "84",
    },
    {
      image:
        "/uploads/85.jfif",
      id: "85",
    },
    {
      image: "/uploads/86.png",
      id: "86",
    },
    {
      image:
        "/uploads/87.jfif",
      id: "87",
    },
    {
      image:
        "/uploads/88.jfif",
      id: "88",
    },
  ];
  const init = async () => {
    const apidata = await axios({
      method: "post",
      url: `${BaseUrl}/api/search-brand`,
    });
    setBrand(apidata.data.data);
  };
  useEffect(() => {
    init();
  }, []);

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setTimeout(() => {
      const t1 = gsap
        .timeline({ repeat: -1 })
        .to(scrollContainerRef.current, {
          x:
            -scrollContainerRef!.current!.scrollWidth +
            scrollContainerRef!.current!.offsetWidth,
          duration: 45,
          ease: "linear",
        })
        .to(scrollContainerRef.current, { x: 0, duration: 45, ease: "linear" });

      scrollContainerRef!.current!.onmouseenter = () => {
        t1.pause();
      };
      scrollContainerRef!.current!.onmouseleave = () => {
        t1.play();
      };
    }, 3000);
  }, []);

  const options = {
    type: "loop",
    gap: "1rem",
    autoplay: true,
    pauseOnHover: false,
    resetProgress: false,
    height: "15rem",
  };

  return (
    <>
      <div>
        <div className="grid place-items-center w-full mt-10">
          <h1 className="text-4xl text-primary text-center font-bold cusfont ">
            Welcome to SWRV
          </h1>
          <h1 className="text-xl text-primary text-center cusfont font-normal">
            Reach the next billion
          </h1>
        </div>
        {props.isBrand ? (
          <div
            className="flex gap-6 items-center mb-6 mt-6"
            ref={scrollContainerRef}
          >
            {data.map((val: any, index: number) => {
              const data = [32, 40, 44, 36, 48, 28, 52, 56, 20, 28, 60];
              var size = data[Math.floor(Math.random() * data.length)];

              return (
                <div
                  key={index}
                  className="block shrink-0 cursor-pointer"
                  onClick={() => {
                    navigator(`/home/myuser/${val.id}`);
                  }}
                >
                  <img
                    src={val.image}
                    alt="error"
                    className={`rounded-md w-${size} h-${size} object-center object-cover`}
                  />
                </div>
              );
            })}
          </div>
        ) : (
          <div
            className="flex gap-6 items-center mb-6 mt-6"
            ref={scrollContainerRef}
          >
            {brand.slice(0, 15).map((val: any, index: number) => {
              const data = [32, 40, 44, 36, 48, 28, 52, 56, 20, 28, 60];
              var size = data[Math.floor(Math.random() * data.length)];
              return (
                <div
                  key={index}
                  className="block shrink-0 cursor-pointer"
                  onClick={() => {
                    navigator(`/home/brand/${val.brandId}`);
                  }}
                >
                  <img
                    src={val.logo}
                    alt="error"
                    className={`rounded-md w-${size} h-${size} object-center object-cover`}
                  />
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
 * Renders the EarnSection component, which displays a section for earning more money.
 * @returns {JSX.Element} - The rendered EarnSection component.
 */
const EarnSection = () => {
  return (
    <>
      <div className="w-full rounded-xl flex flex-col sm:flex-row bg-yellow-500 mt-12">
        <div className="grow grid place-items-center shrink-0">
          <img
            src="/images/cashgirl.png"
            alt="error"
            className="h-40 md:h-80"
          />
        </div>
        <div className="p-4 md:p-14 bg-[#F7941D] rounded-r-xl grid place-items-center">
          <div>
            <h1 className="text-2xl text-black text-left cusfont font-semibold">
              To earn more money?
            </h1>
            <h1 className="text-md text-black font-normal text-left md:w-80">
              Search, apply for brands campaigns and create more great content.
            </h1>
          </div>
        </div>
      </div>
    </>
  );
};

/**
 * Component for searching campaigns by category.
 * @returns JSX element
 */
const SearchByCategory = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [camSearchResult, setCamSearchResult] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const search = async (category: string) => {
    setIsLoading((cal) => true);
    const data = await axios.post(`${BaseUrl}/api/campaign-search`, {
      type: category,
    });
    if (data.data.status == false) setError(data.data.message);
    setCamSearchResult(data.data.data);
    setIsLoading((cal) => false);
  };
  return (
    <>
      <div className="bg-white rounded-2xl my-3 shadow-xl py-4 px-10">
        <h1 className="text-sm text-black font-semibold cusfont text-left">
          Search by category
        </h1>
        <p className="text-xs text-black font-normal cusfont text-left mt-2">
          Select you category of choice.
        </p>
        <div className="grid gap-4 grid-cols-1 xs:grid-cols-2 md:grid-cols-4  xl:grid-cols-6 my-4">
          <button
            onClick={() => search("1")}
            className="rounded-md cusfont text-primary text-center text-sm font-semibold py-2 bg-[#ff88bb]"
          >
            Unboxing
          </button>
          <button
            onClick={() => search("2")}
            className="rounded-md cusfont text-primary text-center text-sm font-semibold py-2 bg-[#fbca8e]"
          >
            Sponsored
          </button>
          <button
            onClick={() => search("3")}
            className="rounded-md cusfont text-primary text-center text-sm font-semibold py-2 bg-[#80fffa]"
          >
            Paid Promotion
          </button>
          <button
            onClick={() => search("4")}
            className="rounded-md cusfont text-primary text-center text-sm font-semibold py-2 bg-[#beff80]"
          >
            Revealing
          </button>
          <button
            onClick={() => search("5")}
            className="rounded-md cusfont text-primary text-center text-sm font-semibold py-2 bg-[#d6d6d6]"
          >
            Single Post
          </button>
          <button
            onClick={() => search("6")}
            className="rounded-md cusfont text-primary text-center text-sm font-semibold py-2 bg-[#ff88bb]"
          >
            Bidding
          </button>
        </div>
        {error == "" || error == null || error == undefined ? null : (
          <NOTICEAlerts message={error}></NOTICEAlerts>
        )}
      </div>

      {isLoading ? (
        <div className="bg-white rounded-2xl my-3 shadow-xl py-4 px-10 grid place-items-center">
          <h1 className="text-sm text-black font-semibold cusfont text-left">
            Loading....
          </h1>
        </div>
      ) : camSearchResult.length != 0 ? (
        <SearchedCampaign data={camSearchResult}></SearchedCampaign>
      ) : null}
    </>
  );
};

/**
 * A functional component that displays sponsored posts.
 * @returns {React.ReactNode} - The rendered component.
 */
const SponsoredPosts = () => {
  const [topChampaing, setTopChampaing] = useState<any[]>([]);
  const [campaignCards, setCampaignCards] = useState<React.ReactNode[]>([]);
  useEffect(() => {
    const fetchData = async () => {
      const apidata = await axios({
        method: "post",
        url: `${BaseUrl}/api/get-top-campaigns`,
      });
      setTopChampaing(apidata.data.data.campaigns);
    };
    fetchData();
  }, []);

  useEffect(() => {
    const createCampaignCards = async () => {
      const cards = await Promise.all(
        topChampaing.map(async (val: any, index: number) => {
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
                title={val["name"]}
                weburl={val.brand.webUrl}
                platforms={platforms}
                maxval={val.costPerPost.split(".")[0]}
                category={campaignType}
                image={image}
                name={val.brand.name}
                // currency={val["currency"]["code"]}
                currency={"USD"}
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
    <>
      <div className="bg-white rounded-2xl my-3 shadow-xl p-4 lg:px-6 py-8">
        <div className="w-60 rounded-xl text-lg font-bold text-black p-2 flex items-center gap-3">
          <IcBaselineFavorite className="text-md text-secondary" />
          Sponsored Posts{" "}
        </div>
        <div className="flex flex-nowrap overflow-x-scroll md:overflow-auto md:grid xs:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 w-full p-3">
          {campaignCards}
        </div>
      </div>
    </>
  );
};

/**
 * Component for displaying a list of new campaigns.
 * @returns JSX element representing the new campaign component.
 */
const NewCampaign = () => {
  const [topChampaing, setTopChampaing] = useState<any[]>([]);
  const [campaignCards, setCampaignCards] = useState<React.ReactNode[]>([]);
  useEffect(() => {
    const fetchData = async () => {
      const apidata = await axios({
        method: "post",
        url: `${BaseUrl}/api/campaign-search`,
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
          if (counter >= 4) return null;
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
                // currency={val["currency"]["code"]}
                currency={"USD"}
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
    <>
      <div className="bg-white rounded-2xl my-3 shadow-xl p-4 lg:px-6 py-8">
        <div className="w-60 rounded-xl text-lg font-bold text-black flex items-center gap-3">
          {" "}
          <MaterialSymbolsAssignmentIndSharp className="text-md text-secondary " />
          New Campaign{" "}
        </div>
        <div className="flex flex-nowrap overflow-x-scroll md:overflow-auto md:grid xs:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 w-full p-3">
          {campaignCards}
        </div>
      </div>
    </>
  );
};

/**
 * A functional component that displays a list of top brands.
 * @returns JSX element representing the top brands component.
 */
const TopBrands = () => {
  const [topBrands, setTopBarnds] = useState<any[]>([]);
  const init = async () => {
    const apidata = await axios({
      method: "post",
      url: `${BaseUrl}/api/get-top-brands`,
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
    setTopBarnds(apidata.data.data);
  };

  useEffect(() => {
    init();
  }, []);
  return (
    <>
      <div className="bg-white rounded-2xl my-3 shadow-xl p-4 lg:px-6 py-8">
        <div className="w-60  rounded-xl text-lg font-bold text-black mt-3 mb-2 flex items-center gap-3">
          <IcRoundStar className="text-2xl text-secondary" />
          Top brands{" "}
        </div>
        <div className="flex flex-nowrap overflow-x-scroll md:overflow-auto md:grid xs:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 w-full p-3">
          {topBrands.map((val: any, index: number) => {
            return (
              <div key={index}>
                <BrandCard
                  id={val.id}
                  email={val.email}
                  image={val.logo}
                  name={val.name}
                  website={val.webUrl}
                ></BrandCard>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

/**
 * A functional component that displays a list of top influencers.
 * @returns JSX elements representing the top influencers.
 */
const TopInfluencer = () => {
  const [topInfluencer, setTopInfluencer] = useState<any[]>([]);
  const init = async () => {
    const apidata = await axios({
      method: "post",
      url: `${BaseUrl}/api/user-search`,
      data: { role: 10 },
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
    for (let i: number = 0; i < apidata.data.data.length; i++) {
      if (parseInt(apidata.data.data[i].rating) > 4) {
        setTopInfluencer((prevdata) => [...prevdata, apidata.data.data[i]]);
      }
    }
  };

  useEffect(() => {
    init();
  }, []);

  return (
    <>
      <div className="bg-white rounded-2xl my-3 shadow-xl p-4 lg:px-10 py-8">
        <div className="w-60 rounded-xl text-xl font-bold text-black p-2 flex items-center gap-3">
          {" "}
          <IcBaselineFavorite className="text-md text-secondary" />
          Top influencer{" "}
        </div>

        <div className="flex flex-nowrap overflow-x-scroll md:overflow-auto md:grid xs:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 w-full">
          {topInfluencer.map((val: any, index: number) => {
            let platforms: string[] = [];
            for (let i = 0; i < val.platforms.length; i++) {
              platforms.push(val.platforms[i]["platform"]["logo"]);
            }
            const avatar =
              val["pic"] == "0" ||
              val["pic"] == null ||
              val["pic"] == undefined ||
              val["pic"] == ""
                ? "/images/avatar/user.png"
                : val["pic"];

            const platform =
              val.platforms.length > 0
                ? val.platforms[0].platform.logo
                : "/images/media/instagram.png";
            const follower =
              val.platformsdata.length > 0
                ? val.platformsdata[0].followers ?? "0"
                : "0";
            const post =
              val.platformsdata.length > 0
                ? val.platformsdata[0].postCount ?? "0"
                : "0";
            return (
              <Link to={`/home/myuser/${val.id}`} key={index}>
                <TopInfluencerCard
                  star={parseInt(val.rating)}
                  image={avatar}
                  name={val.userName}
                  platforms={platforms}
                  rating={val.rating}
                  // currency={val.currency.code}
                  currency={"USD"}
                  icon={platform}
                  dob={val.dob}
                  follower={follower}
                  post={post}
                ></TopInfluencerCard>
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
};

/**
 * A functional component that renders a message and a button to create a brand.
 * @returns {JSX.Element} - The JSX element representing the component.
 */
const BrandCreate: React.FC = (): JSX.Element => {
  return (
    <>
      <div className="bg-rose-500 my-4 rounded-lg w-full p-4 py-10">
        <p className="text-center font-semibold text-white text-2xl">
          Your Haven't created Brand
        </p>
        <p className="text-center font-semibold text-white text-lg">
          Create your brand to begin the journey
        </p>
        <div className="w-full text-center mt-6">
          <Link
            className="bg-primary text-white py-2 px-6 text-center font-semibold rounded-md"
            to={"/createbrand"}
          >
            Click Here to create brand
          </Link>
        </div>
      </div>
    </>
  );
};
