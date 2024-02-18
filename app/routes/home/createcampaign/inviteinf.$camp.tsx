import {
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { LoaderArgs, LoaderFunction, json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import ReactSwitch from "react-switch";
import { Fa6RegularTrashCan, IcRoundStar, MaterialSymbolsArrowDropDown, MaterialSymbolsArrowDropDownRounded } from "~/components/icons";
import { NOTICEAlerts, SUCCESSAlerts } from "~/components/utils/alert";
import { CusButton } from "~/components/utils/buttont";
import { BaseUrl } from "~/const";
import { userPrefs } from "~/cookies";
import { CampaignSearchMode } from "~/types/projectenums";

export const loader: LoaderFunction = async (props: LoaderArgs) => {
  const id = props.params.camp;
  const cookieHeader = props.request.headers.get("Cookie");
  const cookie = await userPrefs.parse(cookieHeader);

  const platformRes = await axios.post(`${BaseUrl}/api/getplatform`);
  const categoryRes = await axios.post(`${BaseUrl}/api/getcategory`);
  const countryRes = await axios.post(`${BaseUrl}/api/getcountry`);

  return json({
    user: cookie.user,
    campid: id,
    platform: platformRes.data.data,
    category: categoryRes.data.data,
    country: countryRes.data.data,
    url: props.request.url
  });
};

/**
 * A React functional component that renders an influencer search component.
 * @returns {JSX.Element} - The JSX element representing the component.
 */
const InviteInfluencer: React.FC = (): JSX.Element => {
  const user = useLoaderData();
  const brandUserId = user.user.id;
  const campId = user.campid;



  return (
    <>
      <InfluencerSearch
        platform={user.platform}
        country={user.country}
        category={user.category}
        brandUserId={brandUserId}
        campaignId={campId}
        url={user.url}
      ></InfluencerSearch>
    </>
  );
};

export default InviteInfluencer;

/**
 * Represents the properties required for an influencer search.
 * @typedef {Object} InfluencerSearchProps
 * @property {any} country - The country for the search.
 * @property {any} platform - The platform for the search.
 * @property {any} category - The category for the search.
 * @property {string} campaignId - The ID of the campaign.
 * @property {string} brandUserId - The ID of the brand user.
 * @property {string} url - The URL for the search.
 */
type InfluencerSearchProps = {
  country: any;
  platform: any;
  category: any;
  campaignId: string;
  brandUserId: string;
  url: string;
};
export const InfluencerSearch = (props: InfluencerSearchProps) => {
  const country = props.country;
  const platform = props.platform;
  const category = props.category;
  const [searchType, setSearchType] = useState<CampaignSearchMode>(
    CampaignSearchMode.AdvanceSearch
  );

  /**
   * Retrieves the value of a specified parameter from a given URL.
   * @param {string} name - The name of the parameter to retrieve.
   * @param {string} url - The URL to search for the parameter.
   * @returns {string | null} - The value of the parameter if found, or null if not found.
   */
  function getParameterByName(name: string, url: string) {
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
      results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
  }


  const [active, setActive] = useState(false);
  const [camSearchResult, setCamSearchResult] = useState<any[]>([]);
  const champTextSearch = useRef<HTMLInputElement>(null);
  const [selCountry, setSelCountry] = useState<any[]>([]);
  const [con, setcon] = useState<boolean>(false);
  const [selPlatform, setSelectedPlatform] = useState<any[]>([]);

  const [selcategory, setSelcategory] = useState<any[]>([]);
  const [cat, setcat] = useState<boolean>(false);

  const [error, setError] = useState<string | null>(null);
  const [sus, setSus] = useState<string | null>(null);


  useEffect(() => {
    setcat((val: boolean) => false);
  }, [selcategory]);

  /**
   * Performs a search for a given text in the camp.
   * @param {string} searchtext - The text to search for.
   * @returns None
   */
  const camptextsearch = async (searchtext: string) => {
    setError(null);
    champTextSearch!.current!.value = "";
    if (searchtext == "" || searchtext == null || searchtext == undefined)
      return setError("Fill the field to start searching");
    let req = { search: searchtext, role: 10 };
    const data = await axios.post(`${BaseUrl}/api/user-search`, req);
    if (data.data.status == false) {
      setCamSearchResult([]);
      return setError(data.data.message);
    }
    setCamSearchResult(data.data.data);
  };

  /**
   * Performs an advanced search for camps based on the specified criteria.
   * @returns None
   */
  const campadvancesearch = async () => {
    setError(null);

    let req: any = {
      active: active ? "1" : "0",
      role: 10,
    };



    if (
      selcategory.length != 0
    )
      req.category = selcategory[0]["id"];

    if (
      selPlatform.length != 0
    )
      req.platform = selPlatform.join(",");
    if (
      selCountry.length != 0
    )
      req.country = selCountry[0]["id"];


    if (
      (!(champTextSearch!.current!.value == "" || champTextSearch!.current!.value == null || champTextSearch!.current!.value == undefined))
    )
      req.search = champTextSearch!.current!.value;

    if (
      (!(champTextSearch!.current!.value == "" || champTextSearch!.current!.value == null || champTextSearch!.current!.value == undefined))
    )
      req.search = champTextSearch!.current!.value;

    const data = await axios.post(`${BaseUrl}/api/user-search`, req);
    if (data.data.status == false) return setError(data.data.message);
    setCamSearchResult(data.data.data);
  };

  const delsearch = () => {
    setCamSearchResult((val) => []);
    setSelcategory((val) => []);
    setSelectedPlatform((val) => []);
    setSelCountry((val) => []);
    setActive((val: boolean) => false)
    champTextSearch!.current!.value = "";

  };

  //all filter box
  const [showFilter, setFilter] = useState<boolean>(false);

  //save filter fox
  const [filterName, setFilterName] = useState<boolean>(false);

  //for filter error
  const [nameError, setNameError] = useState<string | null>(null);

  // const [localFilter, setLocalFilter] = useLocalStorageState<any[]>(
  //   "InfluencerSearch",
  //   {
  //     defaultValue: [],
  //   }
  // );
  const nameFilterRef = useRef<HTMLInputElement>(null);
  const saveFilter = (name: string) => {
    if (name == "" || name == null || name == undefined)
      return setNameError("Enter the Filter name");
    if (selcategory.length == 0) return setNameError("Select the category");
    if (selPlatform.length == 0) return setNameError("Select the platform");
    if (selCountry.length == 0) return setNameError("Select the country");

    // for (let i: number = 0; i < localFilter.length; i++) {
    //   if (name == localFilter[i]["name"]) {
    //     return setNameError("Filter name already exist.");
    //   }
    // }
    const filter = {
      name: name,
      country: selCountry,
      platform: selPlatform,
      category: selcategory,
      active: active,
    };






    // setLocalFilter([...localFilter, filter]);
    nameFilterRef!.current!.value = "";
    setFilterName(false);
  };
  const loadFilter = (filterdata: any) => {
    setSelcategory(filterdata["category"]);
    setSelectedPlatform(filterdata["platform"]);
    setSelCountry(filterdata["country"]);
    setActive(filterdata["active"]);
    setFilter(false);
  };

  /**
   * Renders a component that displays a form for searching and filtering influencers.
   * @param {string} props.url - The URL of the page.
   * @param {string} props.campaignId - The ID of the campaign.
   * @param {string} props.brandUserId - The ID of the brand user.
   * @returns The rendered component.
   */
  return (
    <>
      <div>
        {getParameterByName("invite", props.url) == "true" ? <div className="h-6"></div> : <div className="w-full my-4 bg-white rounded-md p-6">
          <SUCCESSAlerts message="Your campaign has been created successfully"></SUCCESSAlerts>
          <div className="flex flex-wrap items-start  gap-4 ">
            <div className="grow">
              <p className="font-semibold text-xl text-left text-slate-900 mt-3">Invite Influencer</p>
              <p className="font-normal text-gray-600 text-sm">You can skip this step now if needed and search and invite influencers later.</p>
            </div>
            <div className="mt-4">
              <Link to={"/home/mycampaings"} className="rounded-md py-2 text-white bg-secondary text-lg px-8">Skip This Step</Link>
            </div>
          </div>
        </div>

        }
        <div className="rounded-xl px-6 shadow-xl py-5 bg-white">
          {/* campaign advance search start here */}
          {/* <div className="flex flex-wrap gap-4 justify-between items-end mt-4"> */}
          <div className="mt-4">
            <div className="flex flex-wrap gap-4 justify-between items-end">

              <div className="grow">
                <h1 className="text-primary text-sm cusfont font-medium mb">Search</h1>
                <div className="bg-[#eeeeee] rounded-md py-1 px-4 flex items-center w-full mt-2">
                  <input
                    ref={champTextSearch}
                    type="text"
                    className="bg-transparent  outline-none py-1 px-2 w-full"
                    placeholder="Search for keyword"
                  />
                </div>
              </div>
              <div>
                {/* category start here */}
                <h1 className="text-primary text-sm mb cusfont font-medium">Strategy</h1>
                <div className="bg-[#EEEEEE] h-10 rounded-lg  flex gap-1 relative w-64 mt-2 cursor-pointer" onClick={() => {
                  setcat(val => !val);
                  // setcat(false);
                  setcon(false);
                  setFilterName(false);
                  setFilter(false);
                }}>
                  <div className="flex gap-x-2 overflow-x-scroll flex-nowrap no-scrollbar px-2">
                    {selcategory.length == 0 ? <p className="px-4 text-sm text-gray-400 text-left mt-2">Select</p> : null}
                    {selcategory.map((value: any, i: number) => {
                      return (
                        <div
                          key={i}
                          className="flex bg-white my-1 rounded-md py-1 px-2 items-center gap-x-4"
                        >
                          <h1 className=" text-black font-semibold text-center w-40">
                            {`${value["categoryName"]} - [${value["categoryCode"]}]`}
                          </h1>
                        </div>
                      );
                    })}
                  </div>
                  <div className="grow"></div>
                  <div
                    className="grid place-items-center px-2 w-12 text-primary rounded-lg"
                  >
                    {cat ?
                      <FontAwesomeIcon className="cursor-pointer" icon={faXmark}></FontAwesomeIcon>
                      :
                      <MaterialSymbolsArrowDropDownRounded className="text-4xl cursor-pointer" />
                    }
                  </div>

                  <div
                    className={`w-full bg-gray-300 bg-opacity-20 absolute top-12 left-0 ${cat ? "" : "hidden"
                      } grid place-items-center z-20`}
                  >
                    <div className="w-64 bg-[#eeeeee] shadow-lg p-4 cursor-pointer rounded-xl">
                      <div className="h-64 w-full overflow-y-scroll no-scrollbar">
                        {category.map((val: any, i: number) => {
                          return (
                            <h1
                              onClick={() => {
                                if (selcategory.includes(val)) {
                                  let addcur = selcategory.filter(
                                    (data) => data != val
                                  );
                                  setSelcategory(addcur);
                                } else {
                                  setSelcategory([val]);
                                }
                                setcat((val: boolean) => false);
                              }}
                              key={i}
                              className={`text-sm text-left px-4 py-2 rounded-md w-full my-2 cusfont font-normal hover:bg-gray-300 ${selcategory.includes(val)
                                ? "bg-gray-300"
                                : ""
                                }  no-scrollbar`}
                            >
                              {val["categoryCode"]} - {val["categoryName"]}{" "}
                            </h1>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                {/* country start here */}
                <p className="text-primary text-left text-sm cusfont font-medium">
                  Target Country
                </p>
                <div className="bg-[#EEEEEE] h-10 rounded-lg  flex gap-1 pl-2 relative w-64 mt-2 px-2 cursor-pointer" onClick={() => {
                  setcon(val => !val);
                  setcat(false);
                  //  setcon(false);
                  setFilterName(false);
                  setFilter(false);
                }}>
                  {selCountry.length == 0 ? <p className="text-sm text-gray-400 px-1 text-left mt-2">Select</p> : null}
                  <div className="flex gap-x-2 overflow-x-scroll flex-nowrap no-scrollbar">
                    {selCountry.map((value: any, i: number) => {
                      return (
                        <div
                          key={i}
                          className="flex bg-white my-1 rounded-md py-1 px-2 items-center gap-x-4"
                        >
                          <h1 className=" text-black font-semibold text-center w-40">
                            {`${value["name"]} - [${value["code"]}]`}
                          </h1>
                        </div>
                      );
                    })}
                  </div>

                  <div className="grow"></div>
                  <div
                    className="grid place-items-center px-2 w-12 text-primary rounded-lg"
                  >

                    {con ?
                      <FontAwesomeIcon className="cursor-pointer" icon={faXmark}></FontAwesomeIcon>
                      :
                      <MaterialSymbolsArrowDropDownRounded className="text-4xl cursor-pointer" />
                    }
                  </div>
                  <div
                    className={`w-full  absolute top-12 left-0 ${con ? "" : "hidden"
                      } grid place-items-center `}
                    onClick={val => setcon(false)}
                  >
                    <div className="bg-[#eeeeee] rounded-xl p-4 cursor-pointer z-30 w-64" onClick={(e) => e.stopPropagation()}>
                      <div className="h-56 overflow-y-scroll no-scrollbar">
                        {country.map((val: any, i: number) => {
                          return (
                            <h1
                              onClick={() => {
                                if (selCountry.includes(val)) {
                                  let addcur = selCountry.filter(
                                    (data) => data != val
                                  );
                                  setSelCountry(addcur);
                                } else {
                                  setSelCountry([val]);
                                }
                                setcon(false);
                              }}
                              key={i}
                              className={`text-sm text-left px-4 py-2 cusfont font-normal rounded-md w-full my-2 hover:bg-gray-300 ${selCountry.includes(val)
                                ? "bg-gray-300"
                                : ""
                                }  no-scrollbar`}
                            >
                              {val["code"]} - {val["name"]}
                            </h1>
                          );
                        })}
                        {/* <div onClick={() => setcon(false)} className="text-center font-semibold text-lg bg border-2 border-rose-500 rounded-md bg-rose-500 bg-opacity-20 text-rose-500">Close</div> */}
                      </div>
                    </div>
                  </div>
                </div>
                {/* country end here */}
              </div>
            </div>

            <div className="flex flex-wrap gap-4 justify-between items-end mt-3">

              {/* platform start here */}
              <div>
                <h1 className="text-primary text-sm mb cusfont font-medium">Platform</h1>
                <div className="gap-1 flex flex-nowrap">
                  {platform.slice(-7).map((val: any, i: number) => {
                    return (
                      <div
                        key={i}
                        className={`grid place-content-center p-1 border-2 border-white shrink-0 w-8 h-8 rounded-full cursor-pointer  ${selPlatform.includes(val.id)
                          ? " border-2 border-blue-500"
                          : ""
                          } `}
                        onClick={() => {
                          if (selPlatform.includes(val.id)) {
                            let setdata = selPlatform.filter(
                              (platdata) => platdata != val.id
                            );
                            setSelectedPlatform(setdata);
                          } else {
                            setSelectedPlatform([...selPlatform, val.id]);
                          }
                        }}
                      >
                        <img
                          src={platform[i]["platformLogoUrl"]}
                          alt="error"
                          className="object-cover w-full h-full inline-block rounded-full"
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
              {/* platform end here */}
              <div>
                <h1 className="h-7 w-full"></h1>
                <div className="flex items-center gap-2 ">
                  <div className="scale-y-90">

                    <ReactSwitch
                      onChange={() => setActive(!active)}
                      checked={active}
                      checkedIcon={false}
                      uncheckedIcon={false}
                      onColor="#03125E"
                    ></ReactSwitch>
                  </div>
                  <p className="text-primary text-sm cusfont font-medium">
                    Only show active influencer
                  </p>
                </div>
              </div>
              {/* filter start here */}
              <div className="grid place-content-center">
                <div className="flex rounded-lg bg-[#eeeeee]">
                  <div className="relative py-1">
                    <button
                      className="px-2 py-1 font-normal text-sm text-center text-primary"
                      onClick={() => {
                        setFilterName(!filterName);

                        setcat(false);
                        setcon(false);
                        // setFilterName(false);
                        setFilter(false);
                      }}
                    >
                      Save filter
                    </button>
                    <div
                      className={`w-44 right-0 max-h-56 overflow-y-scroll no-scrollbar p-2 bg-white shadow-xl translate-x-24 absolute translate-y-2 rounded-lg z-50 ${filterName ? "" : "hidden"
                        }`}
                    >
                      <p className="text-center text-sm text-slate-900 font-semibold my-2">
                        Filter name
                      </p>
                      <input
                        ref={nameFilterRef}
                        type="text"
                        className="bg-[#eeeeee] fill-none w-full outline-none border-2 rounded-md my-2  px-2 py-1"
                        placeholder="Enter Name & Save"
                      />
                      {nameError == "" ||
                        nameError == null ||
                        nameError == undefined ? null : (
                        <div className=" text-center text-red-500 text-md font-normal text-md my-1">
                          {nameError}
                        </div>
                      )}
                      {sus == "" ||
                        sus == null ||
                        sus == undefined ? null : (
                        <div className=" text-center text-green-500 text-md font-normal text-md my-1">
                          {sus}
                        </div>
                      )}
                      <button
                        onClick={() => {
                          setNameError(null);
                          setSus(null);

                          saveFilter(nameFilterRef!.current!.value);


                        }}
                        className="py-1 text-center text-white text-sm font-semibold bg-primary rounded-md my-1  grow inline-block w-full"
                      >
                        Save filter
                      </button>
                      <button
                        onClick={() => {
                          setFilterName(false);
                        }}
                        className="py-1 text-center text-white text-sm font-semibold bg-secondary rounded-md my-1  grow inline-block w-full"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                  <div className="relative bg-[#717171] py-1 rounded-r-lg">
                    <button
                      className="px-2 py-1 font-normal text-sm text-center flex items-center gap-2 text-white"
                      onClick={() => {
                        setFilter(!showFilter);

                        setcat(false);
                        setcon(false);
                        setFilterName(false);
                        // setFilter(false);
                      }}
                    >
                      <p>
                        Saved Filters
                      </p>
                      <MaterialSymbolsArrowDropDown className="text-2xl" />
                    </button>
                    <div
                      className={`w-44 -translate-x-20 max-h-56 overflow-y-scroll no-scrollbar p-2 bg-white shadow-xl absolute translate-y-2 rounded-lg z-50 ${showFilter ? "" : "hidden"
                        }`}
                    >
                      {/* {localFilter.map((val: any, index: number) => {
                        return (
                          <div
                            key={index}
                            className="w-full text-slate-900 py-1 text-left px-3 text rounded-md cursor-pointer hover:bg-[#cecece]"
                            onClick={() => {
                              loadFilter(val);
                            }}
                          >
                            {val["name"]}
                          </div>
                        );
                      })} */}
                    </div>
                  </div>
                </div>
              </div>

              {/* filter end here */}
              <div className="flex items-center gap-2">
                <div
                  onClick={delsearch}
                  className="cursor-pointer bg-secondary  rounded-md p-3"
                >
                  <Fa6RegularTrashCan className="text-white text-sm" />
                </div>
                <button
                  onClick={() => {
                    campadvancesearch();
                  }}
                  className="px-14 inline-block bg-primary text-white font-medium text-sm rounded-md cursor-pointer py-2">
                  Search
                </button>
              </div>
            </div>
          </div>

          {/* campaign advance search end here */}
          {error == "" || error == null || error == undefined ? null : (
            <NOTICEAlerts message={error}></NOTICEAlerts>
          )}

        </div>

        {camSearchResult.length != 0 ? (
          <SearchedInfluencer
            campaignId={props.campaignId}
            brandUserId={props.brandUserId}
            data={camSearchResult}
          ></SearchedInfluencer>
        ) : null}
      </div >
    </>
  );
};

type SearchedInfluencerProps = {
  data: any[];
  campaignId: string;
  brandUserId: string;
};

const SearchedInfluencer = (props: SearchedInfluencerProps) => {
  return (
    <>
      <div className="bg-white rounded-2xl my-6 shadow-xl p-4">
        <div className="w-60 text-md font-bold text-primary p-2 my-2">
          Found: {props.data.length} Influencer{" "}
        </div>
        {props.data.length == 0 ?
          <div >

          </div>
          :
          <div className="grid xs:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 w-full">
            {props.data.map((val: any, index: number) => {
              const avatar =
                val["pic"] == "0" ||
                  val["pic"] == null ||
                  val["pic"] == undefined ||
                  val["pic"] == ""
                  ? "/images/inf/inf14.png"
                  : val["pic"];
              const name = val["userName"];
              if (name == null || name == undefined || name == "") return;
              if (val.bio == null || val.bio == undefined || val.bio == "") return;
              if (val["pic"] == null || val["pic"] == undefined || val["pic"] == "" || val["pic"] == "0") return;

              return (
                <div key={index}>
                  <InfluencerCard
                    id={val["id"]}
                    image={avatar}
                    name={name}
                    star={parseInt(val.rating)}
                    bio={val.bio}
                    campaignId={props.campaignId}
                    brandUserId={props.brandUserId}
                  ></InfluencerCard>
                </div>
              );
            })}
          </div>
        }
      </div>
    </>
  );
};

type InfluencerCardProps = {
  image: string;
  name: string;
  star: number;
  id: string;
  bio: string;
  campaignId: string;
  brandUserId: string;
};
const InfluencerCard = (props: InfluencerCardProps) => {
  const [error, setError] = useState<string | null>(null);
  const [sus, setSus] = useState<string | null>(null);

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

  const invite = async () => {
    const search_invite = await axios.post(`${BaseUrl}/api/search-invite`, {
      search: {
        status: "1",
        campaign: props.campaignId,
        influencer: props.id
      },
    });
    if (search_invite.data.status) {
      setError("Invite request already pending.");
    } else {


      let req = {
        campaignId: props.campaignId,
        influencerId: props.id,
        fromUserId: props.brandUserId,
        toUserId: props.id,
        inviteMessage: "A brand invited you to their campaign.",
      };

      const data = await axios.post(`${BaseUrl}/api/add-invite`, req);
      if (data.data.status == false) {
        setError(data.data.message);
      } else {
        setSus("Request has been sent.");
      }
    }
  };

  function truncateText(text: string) {
    if (text.length > 100) {
      return text.substring(0, 100) + "...";
    }
    return text;
  }
  return (
    <>
      <div className="bg-white rounded-xl shadow-xl my-2 h-full flex flex-col">
        <img
          src={props.image}
          alt="error"
          className="w-full h-40 object-cover rounded-t-md"
        />
        <div className="px-4 pb-2 h-full flex flex-col">
          <p className="text-black font-semibold text-lg text-left my-2">
            {props.name.toString().split("@")[0]}
          </p>
          <p className="text-black font-semibold text-sm text-left mt-2">
            {truncateText(props.bio)}
          </p>
          <div className="flex my-2">
            <Star></Star>
          </div>
          {error == "" || error == null || error == undefined ? null : (
            <NOTICEAlerts message={error}></NOTICEAlerts>
          )}
          <div className="grow"></div>
          <div onClick={invite}>
            <CusButton
              text="Invite"
              textColor={"text-white"}
              background={"bg-secondary"}
              width={"w-full"}
              margin={"my-2"}
              fontwidth={"font-bold"}
            ></CusButton>
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
          {sus == "" || sus == null || sus == undefined ? null : (
            <SUCCESSAlerts message={sus}></SUCCESSAlerts>
          )}
        </div>
      </div>
    </>
  );
};
