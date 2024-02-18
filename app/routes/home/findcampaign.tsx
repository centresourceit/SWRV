import {
  faSearch,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { CusButton } from "~/components/utils/buttont";
import ReactSwitch from "react-switch";
import { useEffect, useRef, useState } from "react";
import { CampaginCard } from "~/components/utils/campagincard";
import { CampaignSearchMode } from "~/types/projectenums";
import axios from "axios";
import { BaseUrl } from "~/const";
import { LoaderArgs, LoaderFunction, json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { getCampaignType } from "~/utils";
import { BrandCard } from "~/components/utils/brandcard";
import { userPrefs } from "~/cookies";
import InfluencerCard from "~/components/utils/influencercard";
import { Fa6RegularTrashCan, MaterialSymbolsArrowDropDown, MaterialSymbolsArrowDropDownRounded } from "~/components/icons";
import { NOTICEAlerts } from "~/components/utils/alert";
/**
 * Loader function that retrieves data from various API endpoints and returns a JSON response.
 * @param {LoaderArgs} props - The loader arguments object.
 * @returns {Promise<Response>} - A promise that resolves to a JSON response.
 */
export const loader: LoaderFunction = async (props: LoaderArgs) => {
  const cookieHeader = props.request.headers.get("Cookie");
  const cookie = await userPrefs.parse(cookieHeader);
  const platformRes = await axios.post(`${BaseUrl}/api/getplatform`);
  const categoryRes = await axios.post(`${BaseUrl}/api/getcategory`);
  const countryRes = await axios.post(`${BaseUrl}/api/getcountry`);
  const type = await axios.post(`${BaseUrl}/api/get-campaign-type`);
  const markets = await axios.post(`${BaseUrl}/api/get-market`);


  return json({
    user: cookie.user,
    platform: platformRes.data.data,
    category: categoryRes.data.data,
    country: countryRes.data.data,
    type: type.data.data,
    markets: markets.data.data,
  });
};

/**
 * Renders a component that allows users to search for campaigns or brands based on their role.
 * @returns JSX element
 */
const FindCampaign = () => {
  const loader = useLoaderData();
  const isCompleted = loader.user.profileCompleteness == 1 ? true : false;
  const isbrand = loader.user.role.code != 10;
  const [searchBrand, setSearchBrand] = useState<boolean>(false);
  return (
    <>
      {isbrand ? (
        <>
          {/* brand search options start here */}
          <div>
            <div className="flex my-6 md:flex-row flex-col">
              <div>
                <h1 className="text-2xl font-bold text-black text-left mt-4">
                  Creator & Influencer Search
                </h1>
                <p className="text-md font-normal text-black text-left">
                  Here you can manage all the influencer.
                </p>
              </div>
            </div>
            {/* add search option here */}
            <InfluencerSearch
              platform={loader.platform}
              country={loader.country}
              category={loader.category}
              isCompleted={isCompleted}
              userid={loader.user.id}
            ></InfluencerSearch>
          </div>
          {/* brand search options start here */}
        </>
      ) : (
        <>
          {/* influencer search options start from here */}
          <div>
            <div className="flex my-6 md:flex-row flex-col">
              <div>
                <h1 className="text-2xl font-bold text-black text-left mt-4">
                  Find {searchBrand ? "brand" : "campaign"}
                </h1>
                <p className="text-md font-normal text-black text-left">
                  Here you can search manage all the{" "}
                  {searchBrand ? "brand" : "campaign"} that you are
                  participating in.
                </p>
              </div>
              <div className="hidden md:block md:grow"></div>
              <div className="flex justify-center items-center gap-2">
                <div
                  onClick={() => {
                    setSearchBrand(false);
                  }}
                >
                  <CusButton
                    height="h-12"
                    text="Campaign"
                    fontwidth="font-bold"
                    background={searchBrand ? "bg-gray-300" : "bg-cyan-300"}
                    textColor={searchBrand ? "text-gray-600" : "text-black"}
                  ></CusButton>
                </div>
                <div
                  onClick={() => {
                    setSearchBrand(true);
                  }}
                >
                  <CusButton
                    height="h-12"
                    text="Brand"
                    fontwidth="font-bold"
                    background={searchBrand ? "bg-cyan-300" : "bg-gray-300"}
                    textColor={searchBrand ? "text-black" : "text-gray-600"}
                  ></CusButton>
                </div>
              </div>
            </div>
            {searchBrand ? (
              <BrandSearch
                category={loader.category}
                markets={loader.markets}
                isCompleted={isCompleted}></BrandSearch>
            ) : (
              <CampaignSearch
                platform={loader.platform}
                country={loader.country}
                category={loader.category}
                type={loader.type}
                isCompleted={isCompleted}
                userid={loader.user.id}
              ></CampaignSearch>
            )}
          </div>
          {/* influencer search otption end here */}
        </>
      )}
    </>
  );
};

export default FindCampaign;

/**
 * Represents the properties for searching campaigns.
 * @typedef {Object} CampaignSearchProps
 * @property {any} country - The country of the campaign.
 * @property {any} platform - The platform of the campaign.
 * @property {any} category - The category of the campaign.
 * @property {any} type - The type of the campaign.
 * @property {boolean} isCompleted - Indicates if the campaign is completed.
 * @property {string} userid - The ID of the user associated with the campaign.
 */
type CampaignSearchProps = {
  country: any;
  platform: any;
  category: any;
  type: any;
  isCompleted: boolean;
  userid: string;
};

const CampaignSearch = (props: CampaignSearchProps) => {
  const country = props.country;
  const platform = props.platform;
  const category = props.category;
  const champtype = props.type;

  const [searchType, setSearchType] = useState<CampaignSearchMode>(
    CampaignSearchMode.TextSearch
  );

  const [active, setActive] = useState(false);
  const [camSearchResult, setCamSearchResult] = useState<any[]>([]);
  const champTextSearch = useRef<HTMLInputElement>(null);
  const [selCountry, setSelCountry] = useState<any[]>([]);
  const [con, setcon] = useState<boolean>(false);
  const [selPlatform, setSelectedPlatform] = useState<any[]>([]);

  const [selcategory, setSelcategory] = useState<any[]>([]);
  const [cat, setcat] = useState<boolean>(false);


  const [selchamptype, setSelchamptype] = useState<any[]>([]);
  const [type, setType] = useState<boolean>(false);
  const [sus, setSus] = useState<string | null>(null);


  const [error, setError] = useState<string | null>(null);

  const minReachSearch = useRef<HTMLInputElement>(null);
  const endDateSearch = useRef<HTMLInputElement>(null);
  const cppSearch = useRef<HTMLInputElement>(null);
  const minTargetSearch = useRef<HTMLInputElement>(null);
  const minRatingSearch = useRef<HTMLInputElement>(null);

  /**
   * Performs a search for campaigns based on the specified search criteria.
   * @returns None
   */
  const camptextsearch = async () => {
    setError(null);
    let req: any = {
      active: active ? "1" : "0",
      complete: true,
      isPublic: "1"
    };

    if (
      champTextSearch!.current!.value != null &&
      champTextSearch!.current!.value != undefined &&
      champTextSearch!.current!.value != ""
    )
      req.name = champTextSearch!.current!.value;
    if (
      minReachSearch.current?.value != null &&
      minReachSearch.current?.value != undefined &&
      minReachSearch.current?.value != ""
    )
      req.minReach = minReachSearch.current?.value;
    if (
      endDateSearch.current?.value != null &&
      endDateSearch.current?.value != undefined &&
      endDateSearch.current?.value != ""
    )
      req.endDate = endDateSearch.current?.value;
    if (
      cppSearch.current?.value != null &&
      cppSearch.current?.value != undefined &&
      cppSearch.current?.value != ""
    )
      req.costPerPost = cppSearch.current?.value;
    if (
      minTargetSearch.current?.value != null &&
      minTargetSearch.current?.value != undefined &&
      minTargetSearch.current?.value != ""
    )
      req.minTarget = minTargetSearch.current?.value;

    if (
      selcategory.length != 0
    )
      req.category = selcategory[0]["id"];
    if (
      minRatingSearch.current?.value != null &&
      minRatingSearch.current?.value != undefined &&
      minRatingSearch.current?.value != ""
    )
      req.minRating = minRatingSearch.current?.value;
    if (
      selchamptype.length != 0
    )
      req.type = selchamptype[0]["id"];

    if (
      selPlatform.length != 0
    )
      req.platform = selPlatform.join(",");

    const data = await axios.post(`${BaseUrl}/api/campaign-search`, req);
    if (data.data.status == false) return setError(data.data.message);
    setCamSearchResult(data.data.data);
  };

  /**
   * Performs an advanced search for campaigns based on the specified criteria.
   * @returns None
   */
  const campadvancesearch = async () => {
    setError(null);
    let req: any = {
      isPublic: "1",
      complete: true,
      active: active ? "1" : "0",
    };

    if (
      selchamptype.length != 0
    )
      req.type = selchamptype[0]["id"];

    if (
      selPlatform.length != 0
    )
      req.platform = selPlatform.join(",");
    if (
      selCountry.length != 0
    )
      req.country = selCountry[0]["id"];


    const data = await axios.post(`${BaseUrl}/api/campaign-search`, req);
    if (data.data.status == false) return setError(data.data.message);
    setCamSearchResult(data.data.data);
  };

  /**
   * Resets all search-related state variables and clears input fields.
   * @returns None
   */
  const delsearch = () => {
    setActive((val: boolean) => false);
    setType((val: boolean) => false);
    setError((val: any) => null);
    setCamSearchResult((val: any[]) => []);

    setSelCountry((val: any[]) => []);
    setSelectedPlatform((val: any[]) => []);
    setSelcategory((val: any[]) => []);
    setSelchamptype((val: any[]) => []);

    champTextSearch!.current!.value = "";

    minReachSearch!.current!.value = "";
    endDateSearch!.current!.value = "";
    cppSearch!.current!.value = "";
    minTargetSearch!.current!.value = "";
    minRatingSearch!.current!.value = "";
  };


  // filter function start from here


  //all filter box
  const [showFilter, setFilter] = useState<boolean>(false);

  //save filter fox
  const [filterName, setFilterName] = useState<boolean>(false);

  //for filter error
  const [nameError, setNameError] = useState<string | null>(null);


  const [savedFilters, setSavedFilters] = useState<any[]>([]);


  const nameFilterRef = useRef<HTMLInputElement>(null);


  /**
   * Initializes the filter by making an asynchronous request to retrieve the filter data
   * from the server and updating the state with the retrieved data.
   * @returns None
   */
  const initfilter = async () => {
    const req = {
      userId: props.userid,
      type: 2,
    }
    const data = await axios.post(`${BaseUrl}/api/get-filter`, req);
    if (data.data.status) {
      setSavedFilters((val) => data.data.data);
    }
  }

  useEffect(() => {
    initfilter();
  }, []);

  /**
   * Saves a filter with the given name and selected options.
   * @param {string} name - The name of the filter to save.
   * @returns None
   */
  const saveFilter = async (name: string) => {
    if (name == "" || name == null || name == undefined)
      return setNameError("Enter the Filter name");
    if (selchamptype.length == 0) return setNameError("Select the campaign type");
    if (selPlatform.length == 0) return setNameError("Select the platform");
    if (selCountry.length == 0) return setNameError("Select the country");

    const filter = {
      country: selCountry,
      platform: selPlatform,
      type: selchamptype,
      active: active,
    };

    const req = {
      userId: props.userid,
      name: name,
      type: 2,
      data: JSON.stringify(filter)
    }

    const data = await axios.post(`${BaseUrl}/api/add-filter`, req);
    if (data.data.status == false) {
      setError(data.data.message);
    } else {
      nameFilterRef!.current!.value = "";

      setSus("Filter Saved");
      await initfilter();
      setTimeout(() => {
        setSus(null);
        setFilterName(false);
      }, 4000);
    }
  };

  /**
   * Loads the filter data and updates the corresponding state variables.
   * @param {any} filterdata - The filter data to load.
   * @returns None
   */
  const loadFilter = (filterdata: any) => {
    const filterinfo = JSON.parse(filterdata.data);
    setSelchamptype(filterinfo["type"] ?? []);
    setSelectedPlatform(filterinfo["platform"] ?? []);
    setSelCountry(filterinfo["country"] ?? []);
    setActive(filterinfo["active"] ?? false);
    setFilter(false);
  };

  function handleKeyPress(event: React.KeyboardEvent<HTMLInputElement>) {
    const keyCode = event.keyCode || event.which;
    const keyValue = String.fromCharCode(keyCode);
    const regex = /^[0-9\b]*$/;
    if (!regex.test(keyValue)) {
      event.preventDefault();
    }
  }

  // filter function end here

  // filter two function start from here

  const [susTwo, setSusTwo] = useState<string | null>(null);


  const [errorTwo, setErrorTwo] = useState<string | null>(null);

  //all filter box
  const [showFilterTwo, setFilterTwo] = useState<boolean>(false);

  //save filter fox
  const [filterNameTwo, setFilterNameTwo] = useState<boolean>(false);

  //for filter error
  const [nameErrorTwo, setNameErrorTwo] = useState<string | null>(null);


  const [savedFiltersTwo, setSavedFiltersTwo] = useState<any[]>([]);


  const nameFilterRefTwo = useRef<HTMLInputElement>(null);


  /**
   * Initializes the filterTwo by making an asynchronous request to the server to retrieve the filter data.
   * @returns None
   */
  const initfilterTwo = async () => {
    const req = {
      userId: props.userid,
      type: 3,
    }
    const data = await axios.post(`${BaseUrl}/api/get-filter`, req);
    if (data.data.status) {
      setSavedFiltersTwo((val) => data.data.data);
    }
  }

  useEffect(() => {
    initfilterTwo();
  }, []);

  /**
   * Saves a filter with the given name and filter criteria.
   * @param {string} name - The name of the filter to save.
   * @returns None
   */
  const saveFilterTwo = async (name: string) => {
    if (name == "" || name == null || name == undefined)
      return setNameErrorTwo("Enter the Filter name");


    const filter: any = {
      country: selCountry,
      platform: selPlatform,
      type: selchamptype,
      active: active,
    };


    if (
      champTextSearch!.current!.value != null &&
      champTextSearch!.current!.value != undefined &&
      champTextSearch!.current!.value != ""
    )
      filter.keyword = champTextSearch!.current!.value;
    if (
      minReachSearch.current?.value != null &&
      minReachSearch.current?.value != undefined &&
      minReachSearch.current?.value != ""
    )
      filter.minReach = minReachSearch.current?.value;
    if (
      endDateSearch.current?.value != null &&
      endDateSearch.current?.value != undefined &&
      endDateSearch.current?.value != ""
    )
      filter.endDate = endDateSearch.current?.value;
    if (
      cppSearch.current?.value != null &&
      cppSearch.current?.value != undefined &&
      cppSearch.current?.value != ""
    )
      filter.costPerPost = cppSearch.current?.value;
    if (
      minTargetSearch.current?.value != null &&
      minTargetSearch.current?.value != undefined &&
      minTargetSearch.current?.value != ""
    )
      filter.minTarget = minTargetSearch.current?.value;

    if (
      selcategory.length != 0
    )
      filter.category = selcategory;
    if (
      minRatingSearch.current?.value != null &&
      minRatingSearch.current?.value != undefined &&
      minRatingSearch.current?.value != ""
    )
      filter.minRating = minRatingSearch.current?.value;
    if (
      selchamptype.length != 0
    )
      filter.type = selchamptype;

    if (
      selPlatform.length != 0
    )
      filter.platform = selPlatform;

    const req = {
      userId: props.userid,
      name: name,
      type: 3,
      data: JSON.stringify(filter)
    }

    const data = await axios.post(`${BaseUrl}/api/add-filter`, req);
    if (data.data.status == false) {
      setErrorTwo(data.data.message);
    } else {
      nameFilterRefTwo!.current!.value = "";

      setSus("Filter Saved");
      await initfilterTwo();
      setTimeout(() => {
        setSusTwo(null);
        setFilterNameTwo(false);
      }, 4000);
    }
  };

  const loadFilterTwo = (filterdata: any) => {
    const filterinfo = JSON.parse(filterdata.data);


    champTextSearch!.current!.value = filterinfo["keyword"] ?? "";
    minReachSearch!.current!.value = filterinfo["minReach"] ?? "";
    endDateSearch!.current!.value = filterinfo["endDate"] ?? "";
    cppSearch!.current!.value = filterinfo["costPerPost"] ?? "";
    minTargetSearch!.current!.value = filterinfo["minTarget"] ?? "";
    minRatingSearch!.current!.value = filterinfo["minRating"] ?? "";




    setSelcategory(filterinfo["category"] ?? []);
    setSelchamptype(filterinfo["type"] ?? []);
    setSelectedPlatform(filterinfo["platform"] ?? []);
    setActive(filterinfo["active"] ?? false);
    setFilter(false);
  };

  // filter two end here


  return (
    <>
      <div>
        <div className="rounded-xl shadow-xl px-6 py-4 bg-white">
          <div className="flex my-4">
            <h2 className="text-black text-xl text-left font-semibold cusfont">Filter</h2>
            <div className="grow"></div>
            {searchType == CampaignSearchMode.TextSearch ? (
              <></>
            ) : null}
          </div>
          {/* campaign text search start here */}
          {searchType == CampaignSearchMode.AdvanceSearch ? (
            <div className="w-full">
              {/* search options */}
              <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                <div className="w-full">
                  <p className="text-sm cusfont font-medium text-primary">Search</p>
                  <div className="bg-[#eeeeee] rounded-md py-1 px-4 flex items-center mt-2">
                    <input
                      ref={champTextSearch}
                      type="text"
                      className="bg-transparent w-full outline-none py-1 px-2"
                      placeholder="Start typing to search.."
                    />
                  </div>
                </div>
                <div className="w-full">
                  <p className="text-sm cusfont font-medium text-primary">
                    Min. Brand Reach
                  </p>
                  <div className="bg-[#eeeeee] rounded-md py-1 px-4 flex items-center mt-2">
                    <input
                      ref={minReachSearch}
                      type="text"
                      className="bg-transparent w-full outline-none py-1 px-2"
                      placeholder="Min Reach"
                      onKeyDown={handleKeyPress}
                    />
                  </div>
                </div>
                <div className="w-full">
                  <p className="text-sm cusfont font-medium text-primary">
                    Min. Campaign End Date
                  </p>
                  <div className="bg-[#eeeeee] rounded-md py-1 px-4 flex items-center mt-2">
                    <input
                      ref={endDateSearch}
                      type="date"
                      className="bg-transparent w-full outline-none py-1 px-2"
                      placeholder="End Date"
                    />
                  </div>
                </div>
                <div className="w-full">
                  <p className="text-sm cusfont font-medium text-primary">
                    Min. Price Per Post
                  </p>
                  <div className="bg-[#eeeeee] rounded-md py-1 px-4 flex items-center mt-2">
                    <input
                      ref={cppSearch}
                      type="text"
                      className="bg-transparent w-full outline-none py-1 px-2"
                      placeholder="Cost Per Post"
                      onKeyDown={handleKeyPress}
                    />
                  </div>
                </div>
                <div className="w-full">
                  <p className="text-sm cusfont font-medium text-primary">
                    Min Target
                  </p>
                  <div className="bg-[#eeeeee] rounded-md py-1 px-4 flex items-center mt-2">
                    <input
                      ref={minTargetSearch}
                      type="text"
                      className="bg-transparent w-full outline-none py-1 px-2"
                      placeholder="Min Target"
                      onKeyDown={handleKeyPress}
                    />
                  </div>
                </div>
                <div className="w-full">
                  <p className="text-sm font-medium cusfont text-primary">
                    Min. Brand Rating
                  </p>
                  <div className="bg-[#eeeeee] rounded-md py-1 px-4 flex items-center mt-2">
                    <input
                      ref={minRatingSearch}
                      type="text"
                      className="bg-transparent w-full outline-none py-1 px-2"
                      placeholder="Min Target"
                      onKeyDown={handleKeyPress}
                    />
                  </div>
                </div>
                <div className="w-full">
                  {/* category search start here */}
                  <p className="text-sm font-medium cusfont text-primary">
                    Category
                  </p>
                  <div className="bg-[#EEEEEE] h-10 rounded-lg  flex gap-1 w-full relative mt-2 px-2 cursor-pointer" onClick={() => {
                    setcat((val) => !val);
                    setType(false);
                    setFilterTwo(false);
                    setFilterNameTwo(false);
                  }}>
                    {selcategory.length == 0 ? <p className="text-sm text-gray-400 px-1 text-left mt-2">Select</p> : null}
                    <div className="flex gap-x-2 overflow-x-scroll flex-nowrap no-scrollbar">
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
                      className={`w-full  absolute top-12 left-0 ${cat ? "" : "hidden"
                        } grid place-items-center `}
                    >
                      <div className="bg-[#eeeeee] rounded-xl p-4 cursor-pointer z-30 w-full" onClick={(e) => e.stopPropagation()}>
                        <div className="h-56 w-full p-4 overflow-y-scroll no-scrollbar">
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
                                  setcat(false);
                                }}
                                key={i}
                                className={`text-lg text-left text-gray-600 font-semibold cursor-pointer w-full my-2 px-2 hover:bg-gray-300 rounded-md ${selcategory.includes(val)
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
                  {/* category search end here */}
                </div>
                <div>
                  {/* Campaign Type start here */}
                  <h1 className="text-primary text-sm font-medium cusfont mb">Campaign Type</h1>
                  <div className="bg-[#EEEEEE] h-10 rounded-lg  flex gap-1 pl-2  relative w-full mt-2 px-2 cursor-pointer"
                    onClick={() => {
                      setType(val => !val);
                      setFilterTwo(false);
                      setFilterNameTwo(false);
                      setcat(false);
                    }}>
                    {selchamptype.length == 0 ? <p className="text-sm text-gray-400 px-1 text-left mt-2">Select</p> : null}
                    <div className="flex gap-x-2 overflow-x-scroll flex-nowrap no-scrollbar">
                      {selchamptype.map((value: any, i: number) => {
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
                      {type ?
                        <FontAwesomeIcon className="cursor-pointer" icon={faXmark}></FontAwesomeIcon>
                        :
                        <MaterialSymbolsArrowDropDownRounded className="text-4xl cursor-pointer" />
                      }
                    </div>
                    <div
                      className={`w-full  absolute top-12 left-0 ${type ? "" : "hidden"
                        } grid place-items-center `}
                      onClick={val => setType(false)}
                    >
                      <div className="bg-[#eeeeee] rounded-xl p-4 cursor-pointer z-30 w-full" onClick={(e) => e.stopPropagation()}>
                        <div className="h-56 overflow-y-scroll no-scrollbar">
                          {champtype.map((val: any, i: number) => {
                            return (
                              <h1
                                onClick={() => {
                                  if (selchamptype.includes(val)) {
                                    let addcur = selchamptype.filter(
                                      (data) => data != val
                                    );
                                    setSelchamptype(addcur);
                                  } else {
                                    setSelchamptype([val]);
                                  }
                                  setType(false);
                                }}
                                key={i}
                                className={`text-sm text-left px-4 py-2 cusfont font-normal rounded-md w-full my-2 hover:bg-gray-300 ${selchamptype.includes(val)
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
                  {/* Campaign Type end here */}
                </div>
              </div>

              {/* search button */}
              <div className="flex items-end flex-wrap justify-between mt-4 gap-y-4">
                {/* platfrom start here */}
                <div>
                  <h1 className="text-primary text-sm font-medium cusfont mb">Platforms</h1>
                  <div className="gap-1 flex flex-nowrap mt-2">
                    {platform.map((val: any, i: number) => {
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
                            className="object-cover rounded-full w-full h-full inline-block"
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
                {/* platfrom start here */}
                <div className="flex items-center">
                  <div className="scale-y-90">
                    <ReactSwitch
                      onChange={() => setActive(!active)}
                      checked={active}
                      checkedIcon={false}
                      uncheckedIcon={false}
                      onColor="#03125E"
                    ></ReactSwitch>
                  </div>
                  <p className="text-primary font-medium cusfont text-sm ml-2">
                    Only show active campaigns
                  </p>
                </div>
                {/* filter two ui start here */}
                <div className="grid place-items-center">
                  <div className="flex rounded-lg bg-[#eeeeee]">
                    <div className="relative py-1">
                      <button
                        className="px-2 py-1 font-normal text-sm text-center text-primary"
                        onClick={() => {
                          setFilterNameTwo((val) => !val);
                          setFilterTwo(false);
                          setType(false);
                          setcat(false);
                        }}
                      >
                        Save filter
                      </button>
                      <div
                        className={`w-48 right-0 max-h-56 overflow-y-scroll no-scrollbar p-2 bg-white shadow-xl translate-x-24 absolute translate-y-2 rounded-lg z-50 ${filterNameTwo ? "" : "hidden"
                          }`}
                      >
                        <p className="text-center text-sm text-slate-900 font-semibold my-2">
                          Filter name
                        </p>
                        <input
                          ref={nameFilterRefTwo}
                          type="text"
                          className="bg-[#eeeeee] fill-none w-full outline-none border-2 rounded-md my-2  px-2 py-1"
                          placeholder="Enter Filter Name and Save"
                        />
                        {nameErrorTwo == "" ||
                          nameErrorTwo == null ||
                          nameErrorTwo == undefined ? null : (
                          <div className="bg-red-500 bg-opacity-10 border text-center border-red-500 rounded-md text-red-500 text-md font-normal text-md my-2">
                            {nameErrorTwo}
                          </div>
                        )}
                        {susTwo == "" ||
                          susTwo == null ||
                          susTwo == undefined ? null : (
                          <div className=" text-center text-green-500 text-md font-normal text-md my-1">
                            {susTwo}
                          </div>
                        )}
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setNameErrorTwo(null);
                              setSusTwo(null);
                              saveFilterTwo(nameFilterRefTwo!.current!.value);
                            }}
                            className="py-2 text-center text-black text-sm cusfont font-medium bg-[#ff88bb] rounded-md my-2  grow inline-block"
                          >
                            Save filter
                          </button>
                          <button
                            onClick={() => {
                              setFilterNameTwo(false);
                            }}
                            className="py-2 text-center text-black text-sm cusfont font-medium bg-[#d6d6d6] rounded-md my-2  grow inline-block"
                          >
                            Close
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="relative bg-[#717171] py-1 rounded-r-lg">
                      <button
                        className="px-2 py-1 font-normal text-sm text-center flex items-center gap-2 text-white"
                        onClick={(e) => {
                          if (savedFiltersTwo.length == 0) return setError("No filter saved yet.")
                          setFilterTwo((val) => !val);
                          setFilterNameTwo(false);
                          setType(false);
                          setcat(false);
                        }}
                      >
                        Saved Filters
                        <MaterialSymbolsArrowDropDown className="text-4xl pb-2" />
                      </button>
                      <div
                        className={`w-44 -translate-x-20 max-h-56 overflow-y-scroll no-scrollbar p-2 bg-white shadow-xl absolute translate-y-2 rounded-lg z-50 ${showFilterTwo ? "" : "hidden"
                          }`}
                      >
                        {savedFiltersTwo.map((val: any, index: number) => {
                          return (
                            <div
                              key={index}
                              className="w-full text-slate-900 py-1 text-left px-3 text rounded-md cursor-pointer hover:bg-[#cecece]"
                              onClick={() => {
                                loadFilterTwo(val);
                              }}
                            >
                              {val["name"]}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
                {/* filter two ui end here */}
                <div className="flex items-center gap-4 flex-wrap">
                  <div
                    className="text-primary text-sm font-semibold cursor-pointer flex items-center gap-2"
                    onClick={() => {
                      setSearchType(CampaignSearchMode.TextSearch);
                    }}
                  >
                    <div className="grip place-items-center">
                      <MaterialSymbolsArrowDropDown className="-translate-y-1 text-4xl" />
                    </div>
                    <p>
                      Normal filter
                    </p>
                  </div>

                  <div
                    onClick={delsearch}
                    className="cursor-pointer bg-secondary  rounded-md p-3"
                  >
                    <Fa6RegularTrashCan className="text-white text-sm" />
                  </div>
                  <button
                    onClick={() => {
                      if (!props.isCompleted) return setError("Complete your profile in order to search.");
                      camptextsearch();
                    }}
                    className="px-14 inline-block bg-primary text-white font-medium text-sm rounded-md cursor-pointer py-2">
                    Search
                  </button>
                </div>
              </div>
            </div>
          ) : null}
          {/* campaign text search end here */}
          {/* campaign advance search start here */}
          {searchType == CampaignSearchMode.TextSearch ? (
            // <div className="flex flex-wrap gap-4 justify-between">
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  {/* category start here */}
                  <h1 className="text-primary text-sm font-medium cusfont mb">Campaign Type</h1>
                  <div className="bg-[#EEEEEE] h-10 rounded-lg  flex gap-1 pl-2  relative w-full mt-2 px-2 cursor-pointer"
                    onClick={() => {
                      setType(val => !val);
                      setFilter(false);
                      setFilterName(false);
                      setcon(false);
                      // setType(false)
                    }}>
                    {selchamptype.length == 0 ? <p className="text-sm text-gray-400 px-1 text-left mt-2">Select</p> : null}
                    <div className="flex gap-x-2 overflow-x-scroll flex-nowrap no-scrollbar">
                      {selchamptype.map((value: any, i: number) => {
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
                      {type ?
                        <FontAwesomeIcon className="cursor-pointer" icon={faXmark}></FontAwesomeIcon>
                        :
                        <MaterialSymbolsArrowDropDownRounded className="text-4xl cursor-pointer" />
                      }
                    </div>
                    <div
                      className={`w-full  absolute top-12 left-0 ${type ? "" : "hidden"
                        } grid place-items-center `}
                      onClick={val => setType(false)}
                    >
                      <div className="bg-[#eeeeee] rounded-xl p-4 cursor-pointer z-30 w-full" onClick={(e) => e.stopPropagation()}>
                        <div className="h-56 overflow-y-scroll no-scrollbar">
                          {champtype.map((val: any, i: number) => {
                            return (
                              <h1
                                onClick={() => {
                                  if (selchamptype.includes(val)) {
                                    let addcur = selchamptype.filter(
                                      (data) => data != val
                                    );
                                    setSelchamptype(addcur);
                                  } else {
                                    setSelchamptype([val]);
                                  }
                                  setType(false);
                                }}
                                key={i}
                                className={`text-sm text-left px-4 py-2 cusfont font-normal rounded-md w-full my-2 hover:bg-gray-300 ${selchamptype.includes(val)
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
                  {/* category end here */}

                </div>
                {/* platfrom start here */}
                <div className="lg:justify-self-center">
                  <h1 className="text-primary text-sm font-medium cusfont mb">Platforms</h1>
                  <div className="gap-1 flex flex-nowrap mt-2">
                    {platform.map((val: any, i: number) => {
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
                            className="object-cover rounded-full w-full h-full inline-block"
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
                {/* platfrom start here */}

                <div>
                  {/* country start here */}
                  <p className="text-primary text-left font-medium cusfont text-sm">
                    Country
                  </p>
                  <div className="bg-[#EEEEEE] h-10 rounded-lg  flex gap-1 relative w-full mt-2 px-2 cursor-pointer"
                    onClick={() => {
                      setcon(val => !val);
                      setFilter(false);
                      setFilterName(false);
                      // setcon(false);
                      setType(false)
                    }}
                  >
                    {selCountry.length == 0 ? <p className="text-sm text-gray-400 px-1 text-left mt-2">Select</p> : null}
                    <div className="flex gap-x-2 overflow-x-scroll flex-nowrap no-scrollbar">
                      {selCountry.map((value: any, i: number) => {
                        return (
                          <div
                            key={i}
                            className="flex bg-white my-1 rounded-md py-1 px-2 items-center gap-x-4 cursor-pointer"
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
                    >
                      <div className="bg-[#eeeeee] rounded-xl p-4 cursor-pointer z-30 w-full" onClick={(e) => e.stopPropagation()}>
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
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* country end here */}
                </div>
              </div>

              <div className="flex items-center flex-wrap gap-3 justify-between w-full mt-4">
                <div className="flex items-center">
                  <div className="scale-y-90">
                    <ReactSwitch
                      onChange={() => setActive(!active)}
                      checked={active}
                      checkedIcon={false}
                      uncheckedIcon={false}
                      onColor="#03125E"
                    ></ReactSwitch>
                  </div>
                  <p className="text-primary font-medium cusfont text-sm ml-2">
                    Only show active campaigns
                  </p>
                </div>


                {/* filter start here */}
                <div className="grid place-items-center">
                  <div className="flex rounded-lg bg-[#eeeeee]">
                    <div className="relative py-1">
                      <button
                        className="px-2 py-1 font-normal text-sm text-center text-primary"
                        onClick={() => {
                          setFilterName((val) => !val);
                          setFilter(false);
                          setcon(false);
                          setType(false)
                        }}
                      >
                        Save filter
                      </button>
                      <div
                        className={`w-48 right-0 max-h-56 overflow-y-scroll no-scrollbar p-2 bg-white shadow-xl translate-x-24 absolute translate-y-2 rounded-lg z-50 ${filterName ? "" : "hidden"
                          }`}
                      >
                        <p className="text-center text-sm text-slate-900 font-semibold my-2">
                          Filter name
                        </p>
                        <input
                          ref={nameFilterRef}
                          type="text"
                          className="bg-[#eeeeee] fill-none w-full outline-none border-2 rounded-md my-2  px-2 py-1"
                          placeholder="Enter Filter Name and Save"
                        />
                        {nameError == "" ||
                          nameError == null ||
                          nameError == undefined ? null : (
                          <div className="bg-red-500 bg-opacity-10 border text-center border-red-500 rounded-md text-red-500 text-md font-normal text-md my-2">
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
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setNameError(null);
                              setSus(null);
                              saveFilter(nameFilterRef!.current!.value);
                            }}
                            className="py-2 text-center text-black text-sm cusfont font-medium bg-[#ff88bb] rounded-md my-2  grow inline-block"
                          >
                            Save filter
                          </button>
                          <button
                            onClick={() => {
                              setFilterName(false);
                            }}
                            className="py-2 text-center text-black text-sm cusfont font-medium bg-[#d6d6d6] rounded-md my-2  grow inline-block"
                          >
                            Close
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="relative bg-[#717171] py-1 rounded-r-lg">
                      <button
                        className="px-2 py-1 font-normal text-sm text-center flex items-center gap-2 text-white"
                        onClick={(e) => {
                          if (savedFilters.length == 0) return setError("No filter saved yet.")
                          setFilter((val) => !val);
                          setFilterName(false);
                          setcon(false);
                          setType(false)
                        }}
                      >
                        Saved Filters
                        <MaterialSymbolsArrowDropDown className="text-2xl" />
                      </button>
                      <div
                        className={`w-44 -translate-x-20 max-h-56 overflow-y-scroll no-scrollbar p-2 bg-white shadow-xl absolute translate-y-2 rounded-lg z-50 ${showFilter ? "" : "hidden"
                          }`}
                      >
                        {savedFilters.map((val: any, index: number) => {
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
                        })}
                      </div>
                    </div>
                  </div>
                </div>
                {/* filter end here */}
                <div className="flex flex-wrap gap-4 items-center">
                  <div
                    className="text-primary text-sm font-medium cursor-pointer flex gap-2 items-center"
                    onClick={() => {
                      setSearchType(CampaignSearchMode.AdvanceSearch);
                    }}
                  >
                    <MaterialSymbolsArrowDropDown className="-translate-y-1 text-4xl" />
                    <p>
                      Advanced filter
                    </p>
                  </div>
                  <div
                    onClick={delsearch}
                    className="cursor-pointer bg-secondary  rounded-md p-3"
                  >
                    <Fa6RegularTrashCan className="text-white text-sm" />
                  </div>
                  <button
                    onClick={() => {
                      if (!props.isCompleted) return setError("Complete your profile in order to search.");
                      campadvancesearch();
                    }}
                    className="px-14 inline-block bg-primary text-white font-medium text-sm rounded-md cursor-pointer py-2">
                    Search
                  </button>
                </div>
              </div>
            </>
          ) : null}
          {/* campaign advance search end here */}
          {error == "" || error == null || error == undefined ? null : (
            <NOTICEAlerts message={error}></NOTICEAlerts>
          )}
        </div>
        {camSearchResult.length != 0 ? (
          <SearchedCampaign data={camSearchResult}></SearchedCampaign>
        ) : null}
      </div >
    </>
  );
};

type InfluencerSearchProps = {
  country: any;
  platform: any;
  category: any;
  isCompleted: boolean;
  userid: string;
};
export const InfluencerSearch = (props: InfluencerSearchProps) => {
  const country = props.country;
  const platform = props.platform;
  const category = props.category;

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

  const [savedFilters, setSavedFilters] = useState<any[]>([]);


  const nameFilterRef = useRef<HTMLInputElement>(null);



  const initfilter = async () => {
    const req = {
      userId: props.userid,
      type: 1,
    }
    const data = await axios.post(`${BaseUrl}/api/get-filter`, req);
    if (data.data.status) {
      setSavedFilters((val) => data.data.data);
    }
  }

  useEffect(() => {
    initfilter();
  }, []);



  const saveFilter = async (name: string) => {
    if (name == "" || name == null || name == undefined)
      return setNameError("Enter the Filter name");
    if (selcategory.length == 0) return setNameError("Select the category");
    if (selCountry.length == 0) return setNameError("Select the country");
    if (selPlatform.length == 0) return setNameError("Select the channel");

    const filter: any = {
      country: selCountry,
      platform: selPlatform,
      category: selcategory,
      active: active,
    };

    if (!(champTextSearch.current?.value == null || champTextSearch.current?.value == undefined || champTextSearch.current?.value == "")) {
      filter.keyword = champTextSearch.current?.value;
    }

    const req = {
      userId: props.userid,
      name: name,
      type: 1,
      data: JSON.stringify(filter)
    }

    const data = await axios.post(`${BaseUrl}/api/add-filter`, req);
    if (data.data.status == false) {
      setError(data.data.message);
    } else {
      nameFilterRef!.current!.value = "";

      setSus("Filter Saved");
      await initfilter();
      setTimeout(() => {
        setSus(null);
        setFilterName(false);
      }, 4000);
    }
  };




  const loadFilter = (filterdata: any) => {
    const filterinfo = JSON.parse(filterdata.data);
    setSelcategory(filterinfo["category"] ?? []);
    setSelectedPlatform(filterinfo["platform"] ?? []);
    setSelCountry(filterinfo["country"] ?? []);
    setActive(filterinfo["active"] ?? false);
    champTextSearch!.current!.value = filterinfo["keyword"] ?? ""
    setFilter(false);
  };

  return (
    <>
      <div>
        <div className="rounded-xl px-6 shadow-xl py-5 bg-white">
          {/* campaign advance search start here */}
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
                        className={`grid place-content-center p-1 shrink-0 w-8 h-8 rounded-full cursor-pointer  ${selPlatform.includes(val.id)
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
                        if (savedFilters.length == 0) return setError("No filter saved yet.")
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
                      {savedFilters.map((val: any, index: number) => {
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
                      })}
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
                    if (!props.isCompleted) return setError("Complete your profile in order to search.");
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
          <SearchedInfluencer data={camSearchResult}></SearchedInfluencer>
        ) : null}
      </div>
    </>
  );
};

interface BrandSearchProps {
  isCompleted: boolean;
  category: any;
  markets: any;
}


const BrandSearch: React.FC<BrandSearchProps> = (props: BrandSearchProps): JSX.Element => {
  const category = props.category;
  const markets = props.markets;

  const [selcategory, setSelcategory] = useState<any[]>([]);
  const [cat, setcat] = useState<boolean>(false);


  const [selchamptype, setSelchamptype] = useState<any[]>([]);
  const [type, setType] = useState<boolean>(false);

  const [brandSearchResult, setBrandSearchResult] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const delsearch = () => {
    brandTextSearch!.current!.value = "";
  };

  const brandTextSearch = useRef<HTMLInputElement>(null);
  const brandtextsearch = async (searchtext: string) => {
    setError(null);



    // let req: any = { search: searchtext };
    let req: any = {};


    if (
      brandTextSearch.current?.value != null &&
      brandTextSearch.current?.value != undefined &&
      brandTextSearch.current?.value != ""
    )
      req.search = brandTextSearch.current?.value;

    if (
      selcategory.length != 0
    )
      req.categories = selcategory[0]["id"];

    if (
      selchamptype.length != 0
    )
      req.markets = selchamptype[0]["id"];

    const data = await axios.post(`${BaseUrl}/api/search-brand`, req);
    if (data.data.status == false) {
      setBrandSearchResult([]);
      return setError(data.data.message)
    };
    setBrandSearchResult(data.data.data);
  };

  return (
    <>
      <div>
        <div className="rounded-xl shadow-xl px-6 py-4 bg-white">
          <h2 className="text-black text-xl text-left font-bold mt-2">
            Filter
          </h2>
          {/* brand text search start here */}
          <div className="flex flex-wrap flex-row justify-between items-center gap-4 mt-4">
            <div className="w-80 shrink-0">
              <h1 className="text-primary text-sm font-medium cusfont mb">Search</h1>
              <div className="bg-[#eeeeee] rounded-md py-1 px-4 flex items-center mt-2 flex-1">
                <FontAwesomeIcon
                  className="text-gray-600"
                  icon={faSearch}
                ></FontAwesomeIcon>
                <input
                  ref={brandTextSearch}
                  type="text"
                  className="bg-transparent w-full outline-none py-1 px-2"
                  placeholder="Search for keyword"
                />
              </div>
            </div>

            <div className="w-80 shrink-0">
              {/* category search start here */}
              <p className="text-sm font-medium cusfont text-primary">
                Category
              </p>
              <div className="bg-[#EEEEEE] h-10 rounded-lg  flex gap-1 w-full relative mt-2 px-2 cursor-pointer" onClick={() => {
                setcat((val) => !val);
                setType(false);

              }}>
                {selcategory.length == 0 ? <p className="text-sm text-gray-400 px-1 text-left mt-2">Select</p> : null}
                <div className="flex gap-x-2 overflow-x-scroll flex-nowrap no-scrollbar">
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
                  className={`w-full  absolute top-12 left-0 ${cat ? "" : "hidden"
                    } grid place-items-center `}
                >
                  <div className="bg-[#eeeeee] rounded-xl p-4 cursor-pointer z-30 w-full" onClick={(e) => e.stopPropagation()}>
                    <div className="h-56 w-full p-4 overflow-y-scroll no-scrollbar">
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
                              setcat(false);
                            }}
                            key={i}
                            className={`text-lg text-left text-gray-600 font-semibold cursor-pointer w-full my-2 px-2 hover:bg-gray-300 rounded-md ${selcategory.includes(val)
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
              {/* category search end here */}
            </div>
            <div className="w-80 shrink-0">
              {/* Campaign Type start here */}
              <h1 className="text-primary text-sm font-medium cusfont mb">Market</h1>
              <div className="bg-[#EEEEEE] h-10 rounded-lg  flex gap-1 pl-2  relative w-full mt-2 px-2 cursor-pointer"
                onClick={() => {
                  setType(val => !val);
                  setcat(false);
                }}>
                {selchamptype.length == 0 ? <p className="text-sm text-gray-400 px-1 text-left mt-2">Select Market</p> : null}
                <div className="flex gap-x-2 overflow-x-scroll flex-nowrap no-scrollbar">
                  {selchamptype.map((value: any, i: number) => {
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
                  {type ?
                    <FontAwesomeIcon className="cursor-pointer" icon={faXmark}></FontAwesomeIcon>
                    :
                    <MaterialSymbolsArrowDropDownRounded className="text-4xl cursor-pointer" />
                  }
                </div>
                <div
                  className={`w-full  absolute top-12 left-0 ${type ? "" : "hidden"
                    } grid place-items-center `}
                  onClick={val => setType(false)}
                >
                  <div className="bg-[#eeeeee] rounded-xl p-4 cursor-pointer z-30 w-full" onClick={(e) => e.stopPropagation()}>
                    <div className="h-56 overflow-y-scroll no-scrollbar">
                      {markets.map((val: any, i: number) => {
                        return (
                          <h1
                            onClick={() => {
                              if (selchamptype.includes(val)) {
                                let addcur = selchamptype.filter(
                                  (data) => data != val
                                );
                                setSelchamptype(addcur);
                              } else {
                                setSelchamptype([val]);
                              }
                              setType(false);
                            }}
                            key={i}
                            className={`text-sm text-left px-4 py-2 cusfont font-normal rounded-md w-full my-2 hover:bg-gray-300 ${selchamptype.includes(val)
                              ? "bg-gray-300"
                              : ""
                              }  no-scrollbar`}
                          >
                            {val["code"]} - {val["name"]}{" "}
                          </h1>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
              {/* Campaign Type end here */}
            </div>

          </div>

          <div className="flex items-center">
            <div className="grow"></div>
            <Fa6RegularTrashCan
              onClick={delsearch}
              className="text-primary text-xl cursor-pointer" />
            <div className="w-4"></div>
            <div
              onClick={() => {
                if (!props.isCompleted) return setError("Complete your profile in order to search.");
                brandtextsearch(brandTextSearch!.current!.value);
              }}
            >
              <CusButton
                text="Search"
                textColor={"text-white"}
                background={"bg-primary"}
                fontwidth={"font-bold"}
                width={"w-32"}
              ></CusButton>
            </div>
          </div>
          {/* brand text search end here */}
          {error == "" || error == null || error == undefined ? null : (
            <NOTICEAlerts message={error}></NOTICEAlerts>
          )}
        </div>
      </div >
      {
        brandSearchResult.length != 0 ? (
          <SearchedBrand data={brandSearchResult}></SearchedBrand>
        ) : null
      }
    </>
  );
};

type SearchedCampaignProps = {
  data: any[];
};

const SearchedCampaign = (props: SearchedCampaignProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [campaignCards, setCampaignCards] = useState<React.ReactNode[]>([]);
  useEffect(() => {
    const resolveCampaignCards = async () => {
      setIsLoading((val) => true);
      const resolvedCampaignCards = await Promise.all(
        props.data.map(async (val: any, index: number) => {
          let platforms: string[] = [];
          for (let i: number = 0; i < val["platforms"].length; i++) {
            platforms.push(val["platforms"][i]["platformLogoUrl"]);
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
          let campaignType = await getCampaignType(val["campaignTypeId"]);
          return (
            <div key={val["id"]} className="h-full">
              <CampaginCard
                id={val["id"]}
                title={val.campaignName}
                weburl={val["brand"]["webUrl"]}
                platforms={platforms}
                maxval={val.costPerPost.split(".")[0]}
                category={campaignType}
                image={image}
                name={val.brand.name}
                // currency={val["currency"]["code"]}
                currency={"USD"}
                btntext="Learn More & Apply"
              ></CampaginCard>
            </div>
          );
        })
      );
      setCampaignCards(resolvedCampaignCards);
      setIsLoading((val) => false);
    };

    resolveCampaignCards();
  }, [props.data]);

  return (
    <>
      <div className="bg-white rounded-2xl my-6 shadow-xl p-4">
        {isLoading ? <h1 className="text-sm text-black font-semibold cusfont text-center">
          Loading....
        </h1> :
          <>
            <div className="w-60 text-md font-bold text-primary p-2 my-2">
              Found: {props.data.length} Campaigns{" "}
            </div>
            {campaignCards.length == 0 ? <NOTICEAlerts message="No Campaign found."></NOTICEAlerts> : null}
            <div className="flex flex-nowrap overflow-x-scroll md:overflow-auto md:grid xs:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 w-full p-3">{campaignCards}</div>
          </>
        }
      </div>
    </>
  );
};

export { SearchedCampaign };

type SearchedBrandProps = {
  data: any[];
};

const SearchedBrand = (props: SearchedBrandProps) => {
  return (
    <>
      <div className="bg-white rounded-2xl my-6 shadow-xl p-4">
        <div className="w-60 text-md font-bold text-primary p-2 my-2">
          Found: {props.data.length} Brand{" "}
        </div>
        <div className="flex flex-nowrap overflow-x-scroll md:overflow-auto md:grid xs:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 w-full p-3">
          {props.data.map((val: any, index: number) => {
            const avatar = val["logo"];
            const name = val["name"];
            const email = val["email"];
            return (
              <div key={index}>
                <BrandCard
                  id={val.brandId}
                  image={avatar}
                  name={name}
                  email={email}
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

type SearchedInfluencerProps = {
  data: any[];
};

const SearchedInfluencer = (props: SearchedInfluencerProps) => {
  return (
    <>
      <div className="bg-white rounded-2xl my-6 shadow-xl px-12 py-8">
        <div className="w-60 text-md font-bold text-primary p-2 my-2">
          Found: {props.data.length} Influencer{" "}
        </div>
        <div className="grid xs:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 w-full">
          {props.data.map((val: any, index: number) => {

            const avatar =
              val["pic"] == "0" ||
                val["pic"] == null ||
                val["pic"] == undefined ||
                val["pic"] == ""
                ? "/images/avatar/user.png"
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
                ></InfluencerCard>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};
