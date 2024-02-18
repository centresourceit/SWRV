import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { json } from "@remix-run/node";
import { useLoaderData, useNavigate } from "@remix-run/react";
import axios from "axios";
import { useCallback, useEffect, useRef, useState } from "react";
import { CusButton } from "~/components/utils/buttont";
import { BaseUrl } from "~/const";
import CreateCampaignStore from "~/state/campaign/createcampaign";
import "react-datepicker/dist/react-datepicker.css";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import useGeoLocation from "~/location";
import { NOTICEAlerts } from "~/components/utils/alert";

/**
 * Sends a POST request to the specified URL to retrieve category data.
 * @returns {Promise<Object>} A promise that resolves to the category data.
 */
export const loader = async () => {
  const data = await axios.post(`${BaseUrl}/api/getcategory`);
  return json({ data: data.data.data });
};

const Step3 = () => {
  const navigator = useNavigate();
  const data = useLoaderData();

  const location = useGeoLocation();

  const [error, setError] = useState<string | null>(null);
  const audienceText = useRef<HTMLInputElement>(null);
  const [auderror, setAudError] = useState<string | null>(null);
  // const [addaudience, setAddAudience] = useState<boolean>(false);
  const audience = CreateCampaignStore((state) => state.audience);
  const removeAudience = CreateCampaignStore((state) => state.removeAudience);
  const clearAudience = CreateCampaignStore((state) => state.clearAudience);
  const addAudience = CreateCampaignStore((state) => state.addAudience);

  const infLocation = CreateCampaignStore((state) => state.infLocation);
  const setInfLocation = CreateCampaignStore((state) => state.setInfLocation);

  const datepicker = useRef<HTMLInputElement | null>(null);
  const tilldate = CreateCampaignStore((state) => state.tilldate);
  const setTillDate = CreateCampaignStore((state) => state.setTillDate);

  const maxInf = useRef<HTMLInputElement | null>(null);
  const maxinf = CreateCampaignStore((state) => state.maxInf);
  const setMaxInf = CreateCampaignStore((state) => state.setMaxInf);

  const remuneration = useRef<HTMLInputElement | null>(null);
  const Remuneration = CreateCampaignStore((state) => state.remuneration);
  const setRemuneration = CreateCampaignStore((state) => state.setRemuneration);

  const remunerationType = CreateCampaignStore(
    (state) => state.remunerationType
  );
  const setRemunerationType = CreateCampaignStore(
    (state) => state.setRemunerationType
  );
  const [isMap, setIsMap] = useState<boolean>(false);

  const lat = CreateCampaignStore((state) => state.lat);
  const setLat = CreateCampaignStore((state) => state.setLat);
  const long = CreateCampaignStore((state) => state.long);
  const setLong = CreateCampaignStore((state) => state.setLong);

  interface LatLong {
    lat: number;
    long: number;
  }

  const [latlong, setLatlong] = useState<LatLong>({
    lat: 28.7041,
    long: 77.1025,
  });

  /**
   * useEffect hook that updates the values of certain input fields based on the provided variables.
   * @returns None
   */
  useEffect(() => {
    if (datepicker.current?.value != null) {
      datepicker!.current!.value = tilldate;
    }
    if (maxInf.current?.value != null) {
      maxInf!.current!.value = maxinf.toString();
    }
    if (remuneration.current?.value != null) {
      remuneration!.current!.value = Remuneration;
    }
    if (Radius.current?.value != null) {
      Radius!.current!.value = radius.toString();
    }
    if (lat != 0 && long != 0) {
      setLatlong({ lat: lat, long: long });
    }
  }, []);

  // map settings start here
  const containerStyle = {
    width: "100%",
    height: "100%",
  };

  const [marker, setMarker] = useState<{ lat: number; lng: number }>({
    lat: latlong.lat,
    lng: latlong.lat,
  });

  const Radius = useRef<HTMLInputElement | null>(null);
  const radius = CreateCampaignStore((state) => state.radius);
  const setRadius = CreateCampaignStore((state) => state.setRadius);

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: "AIzaSyBiZK164IPHzJ213FTrIR_hDUWVnjhC_4o",
  });

  const [map, setMap] = useState(null);
  const onLoad = useCallback(function callback(map: any) {
    const bounds = new window.google.maps.LatLngBounds(marker);
    map.fitBounds(bounds);
    setMap(map);
  }, []);

  const onUnmount = useCallback(function callback(map: any) {
    setMap(null);
  }, []);

  /**
   * Handles the click event on the map and updates the marker position and latitude/longitude values.
   * @param {any} event - The click event object.
   * @returns None
   */
  const handleClick = (event: any) => {
    setMarker({
      lat: event.latLng.lat(),
      lng: event.latLng.lng(),
    });
    setLat(event.latLng.lat());
    setLong(event.latLng.lng());
  };

  /**
   * Retrieves the current location coordinates and sets the marker, latitude, and longitude.
   * If the location is not loaded or the coordinates are null or undefined, an error message is set.
   * @returns None
   */
  const getCurrentLocation = () => {
    if (!location.loaded) {
      setError("Kindly Give permission to browser for location");
      return;
    }

    if (location.coordinates == null || location.coordinates == undefined) {
      setError("Kindly Give permission to browser for location");
      return;
    }

    setMarker({
      lat: location.coordinates.lat,
      lng: location.coordinates.lng,
    });
    setLat(location.coordinates.lat);
    setLong(location.coordinates.lng);
  };

  //map setting end here
  /**
   * Renders a section for audience and demography information.
   * @returns JSX elements representing the audience and demography section.
   */
  return (
    <>
      <div className="bg-white shadow-xl rounded-xl px-8 py-4 mt-4">
        <h2 className="text-black tect-xl font-medium text-left">
          Audience & Demography
        </h2>
        {/* audience start here */}
        <h2 className="text-primary tect-xl font-medium text-left my-1">
          Audience location{" "}
          <span className="text-rose-500 text-2xl font-semibold">&#42;</span>
          <span className="text-rose-500 text-xs">
            (Enter a comma after each tag)
          </span>
        </h2>

        <div className="flex gap-4 my-1">
          <div className="bg-[#EEEEEE]  min-h-10 rounded-lg  flex gap-2 pl-2 grow">
            <div className="flex gap-x-2  flex-wrap grow">
              {audience.map((value: string, i: number) => {
                return (
                  <div
                    key={i}
                    className="flex bg-white my-1 rounded-md py-1 px-2 items-center gap-x-4 shrink-0"
                  >
                    <div className=" text-black font-semibold ">
                      {`@${value}`}
                    </div>
                    <div
                      className="grid place-items-center cursor-pointer"
                      onClick={() => removeAudience(value)}
                    >
                      <FontAwesomeIcon
                        icon={faCircleXmark}
                        className="text-lg font-bold text-red-500"
                      ></FontAwesomeIcon>
                    </div>
                  </div>
                );
              })}

              <input
                ref={audienceText}
                type="text"
                className="grow rounded-md my-1 fill-none outline-none focus:outline-none bg-transparent"
                onKeyDown={(e) => {
                  if (e.key == "," || e.key === "Enter") {
                    e.preventDefault();
                    audienceText!.current!.value = audienceText!
                      .current!.value.toString()
                      .trim();
                    if (
                      audienceText!.current!.value == "" ||
                      audienceText!.current!.value == null ||
                      audienceText!.current!.value == undefined
                    ) {
                      setAudError("Audience location can't be empty!");
                    } else if (
                      audience.includes(audienceText!.current!.value)
                    ) {
                      setAudError("Audience already exist add a diffrent one");
                    } else {
                      addAudience(audienceText!.current!.value);
                      audienceText!.current!.value = "";
                      setAudError(null);
                    }
                    audienceText!.current!.value = "";
                  }
                }}
              />
            </div>
          </div>
          <p
            className="text-primary text-center text-md font-normal my-2 w-20 cursor-pointer shrink-0"
            onClick={clearAudience}
          >
            clear all
          </p>
        </div>

        {/* 
        <div className="flex">
          <div className="bg-[#EEEEEE]  h-10 rounded-lg  flex gap-1 pl-2 sm:w-96 w-72">
            <div className="flex gap-x-2 overflow-x-scroll no-scrollbar">
              {audience.map((value: string, i: number) => {
                return (
                  <div
                    key={i}
                    className="flex bg-white my-1 rounded-md py-1 px-2 items-center gap-x-4"
                  >
                    <div className=" text-black font-semibold ">
                      {`@${value}`}
                    </div>
                    <div
                      className="grid place-items-center cursor-pointer"
                      onClick={() => removeAudience(value)}
                    >
                      <FontAwesomeIcon
                        icon={faCircleXmark}
                        className="text-lg font-bold text-red-500"
                      ></FontAwesomeIcon>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="grow"></div>
            <div
              className="grid place-items-center px-4 bg-gray-300 rounded-lg"
              onClick={() => setAddAudience(true)}
            >
              <FontAwesomeIcon icon={faAdd}></FontAwesomeIcon>
            </div>
          </div>
          <div>
            <p
              className="text-primary text-center text-md font-normal my-2 w-20 cursor-pointer"
              onClick={clearAudience}
            >
              clear all
            </p>
          </div>
        </div>
        {addaudience ? (
          <div className="mt-4 flex">
            <div className="grid place-items-center">
              <input
                ref={audienceText}
                type="text"
                className="bg-gray-200 w-full outline-none rounded-lg px-4 py-2"
                placeholder="Audience"
              />
            </div>
            <div className="w-6"></div>
            <div
              onClick={() => {
                if (
                  audienceText!.current!.value == "" ||
                  audienceText!.current!.value == null ||
                  audienceText!.current!.value == undefined
                ) {
                  setAudError("Audience location can't be empty!");
                } else if (audience.includes(audienceText!.current!.value)) {
                  setAudError("Audience already exist add a diffrent one");
                } else if (audienceText!.current!.value.indexOf(" ") >= 0) {
                  setAudError("Audience cannot contains space");
                } else {
                  addAudience(audienceText!.current!.value);
                  audienceText!.current!.value = "";
                  setAddAudience(false);
                  setAudError(null);
                }
              }}
            >
              <CusButton
                text="ADD"
                background="bg-primary"
                width={"w-20"}
              ></CusButton>
            </div>
          </div>
        ) : null} */}
        {auderror == "" || auderror == null || auderror == undefined ? null : (
          <div className="bg-red-500 bg-opacity-10 border-2 text-center border-red-500 rounded-xl text-red-500 text-md font-normal text-md">
            {auderror}
          </div>
        )}

        <div className="flex gap-4 flex-col md:flex-row">
          <div className="flex-1">
            {/* audience end here */}
            <h2 className="text-primary tect-xl font-medium text-left my-1">
              Influencer category{" "}
              <span className="text-rose-500 text-2xl font-semibold">
                &#42;
              </span>
            </h2>
            <select
              className="w-full p-2 bg-[#EEEEEE] rounded-lg outline-none border-none pr-6 cursor-pointer"
              onClick={(value: any) => {
                const data = value.target.value + "";
                const setdata = data.split(" ");
                setInfLocation(setdata[0], setdata[1], setdata[2]);
              }}
              defaultValue={"0"}
            >
              <option
                value={"0"}
                className="border-none outline-none font-normal text-lg"
                disabled
              >
                Select the Influencer category
              </option>
              {data.data.map((value: any, i: number) => {
                if (value.id == infLocation.id) {
                  return (
                    <option
                      value={`${value.id} ${value.categoryName} ${value.categoryCode}`}
                      key={i}
                      className="border-none outline-none font-normal text-lg"
                      selected
                    >{`${value.categoryName} [${value.categoryCode}]`}</option>
                  );
                } else {
                  return (
                    <option
                      value={`${value.id} ${value.categoryName} ${value.categoryCode}`}
                      key={i}
                      className="border-none outline-none font-normal text-lg"
                    >{`${value.categoryName} [${value.categoryCode}]`}</option>
                  );
                }
              })}
            </select>
          </div>
          <div className="flex-1">
            <h2 className="text-primary tect-xl font-medium text-left my-1">
              Maximum no of influencers that can join the campaign{" "}
              <span className="text-rose-500 text-2xl font-semibold">
                &#42;
              </span>
            </h2>
            <input
              ref={maxInf}
              type={"number"}
              className="bg-[#EEEEEE] outline-none border-none rounded-lg focus:border-gray-300 w-full p-2"
            ></input>
          </div>
        </div>

        <div className="my-3">
          <button
            className="py-1 px-4 rounded-md bg-green-500 text-white font-semibold text-lg"
            onClick={() => setIsMap((val: boolean) => true)}
          >
            ACTIVATE GEO FENCING
          </button>
        </div>
        {isMap ? (
          <>
            <h2 className="text-primary tect-xl font-medium text-left my-1">
              Geo restriction ( Optional only applicable for influencer
              filtering ) radius in kilometers{" "}
              <span className="text-rose-500 text-2xl font-semibold">
                &#42;
              </span>
            </h2>
            <div className="w-full h-96">
              {isLoaded ? (
                <GoogleMap
                  mapContainerStyle={containerStyle}
                  center={marker}
                  zoom={10}
                  onLoad={onLoad}
                  onUnmount={onUnmount}
                  onClick={handleClick}
                >
                  {marker && <Marker position={marker} />}
                </GoogleMap>
              ) : null}
            </div>
            <div className="mt-4 w-full grid place-items-center">
              <button
                className="py-1 px-4 rounded-md bg-green-500 text-white font-semibold text-lg"
                onClick={getCurrentLocation}
              >
                Get Current Location
              </button>
            </div>
            <h2 className="text-primary tect-xl font-medium text-left my-1">
              Maximum radius of the campaign [in KM.]{" "}
              <span className="text-rose-500 text-2xl font-semibold">
                &#42;
              </span>
            </h2>
            <input
              ref={Radius}
              type={"number"}
              className="bg-[#EEEEEE] outline-none border-none rounded-lg focus:border-gray-300 mt-4 w-full p-2"
            ></input>
          </>
        ) : null}

        <div className="flex gap-4 flex-col md:flex-row">
          <div className="flex-1">
            <h2 className="text-primary tect-xl font-medium text-left my-1">
              Accept participation / invite till{" "}
              <span className="text-rose-500 text-2xl font-semibold">
                &#42;
              </span>
            </h2>
            <input
              type={"date"}
              ref={datepicker}
              className="bg-[#EEEEEE] outline-none border-none rounded-lg focus:border-gray-300 mt-1 w-full p-2"
              min={new Date().toISOString().split("T")[0]}
            ></input>
          </div>
          <div className="flex-1">
            <h2 className="text-primary tect-xl font-medium text-left my-1">
              Remuneration (USD){" "}
              <span className="text-rose-500 text-2xl font-semibold">
                &#42;
              </span>
            </h2>
            <input
              ref={remuneration}
              type={"text"}
              className="bg-[#EEEEEE]  outline-none border-none focus:border-gray-300 rounded-md mt-1 w-full p-2"
              placeholder="USD"
            />
          </div>
        </div>

        {/* <select
          className="w-full p-2 bg-[#EEEEEE] rounded-lg outline-none border-none pr-6 cursor-pointer"
          onChange={(value) => {
            setRemunerationType(value.target.value);
          }}
          defaultValue={"0"}
        >
          <option
            value="0"
            className="border-none outline-none font-normal text-lg"
            disabled
          >
            Select a remuneration option
          </option>
          <option
            value="1"
            className="border-none outline-none font-normal text-lg"
          >
            Cash
          </option>
          <option
            value="2"
            className="border-none outline-none font-normal text-lg"
          >
            Product
          </option>
          <option
            value="3"
            className="border-none outline-none font-normal text-lg"
          >
            Revenue
          </option>
          <option
            value="4"
            className="border-none outline-none font-normal text-lg"
          >
            Discount
          </option>
        </select> */}
        {/* <input
          ref={remuneration}
          type={"text"}
          className="bg-[#EEEEEE]  outline-none border-none focus:border-gray-300 rounded-md mt-4 w-full p-2"
          placeholder="usd"
        /> */}
        {/* {remunerationType == "1" ? (
          <input
            ref={remuneration}
            type={"text"}
            className="bg-[#EEEEEE]  outline-none border-none focus:border-gray-300 rounded-md mt-4 w-full p-2"
            placeholder="usd"
          />
        ) : null} */}

        {/* {remunerationType == "2" ? (
          <input
            ref={remuneration}
            type={"text"}
            className="bg-[#EEEEEE]  outline-none border-none focus:border-gray-300 rounded-md mt-4 w-full p-2"
            placeholder="Product details"
          />
        ) : null}
        {remunerationType == "3" ? (
          <input
            ref={remuneration}
            type={"text"}
            className="bg-[#EEEEEE]  outline-none border-none focus:border-gray-300 rounded-md mt-4 w-full p-2"
            placeholder="% per sale"
          />
        ) : null}
        {remunerationType == "4" ? (
          <input
            ref={remuneration}
            type={"text"}
            className="bg-[#EEEEEE]  outline-none border-none focus:border-gray-300 rounded-md mt-4 w-full p-2"
            placeholder="Coupons"
          />
        ) : null} */}
        {error == "" || error == null || error == undefined ? null : (
          <NOTICEAlerts message={error}></NOTICEAlerts>
        )}
        <div className="flex w-full">
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
            ></CusButton>
          </div>
          <div className="w-10"></div>
          <div
            className="w-full"
            onClick={() => {
              if (audience.length == 0) {
                setError("Add Audience Location");
              } else if (
                infLocation.id == null ||
                infLocation.id == undefined ||
                infLocation.id == ""
              ) {
                setError("Select Influencer category");
              } else if (
                maxInf.current?.value == null ||
                maxInf.current.value == undefined ||
                maxInf.current?.value == "" ||
                parseInt(maxInf.current?.value) == 0
              ) {
                setError("Select maximum influencer count. ");
              } else if (
                datepicker.current?.value == null ||
                datepicker.current?.value == undefined ||
                datepicker.current?.value == ""
              ) {
                setError("Select Accept participation last date. ");
              } else if (
                remuneration.current?.value == null ||
                remuneration.current?.value == undefined ||
                remuneration.current?.value == ""
              ) {
                setError("Select remuneration. ");
              } else {
                setTillDate(datepicker.current?.value);
                setMaxInf(parseInt(maxInf.current?.value));
                setRemuneration(remuneration.current?.value);

                if (isMap) {
                  if (
                    Radius.current?.value == null ||
                    Radius.current.value == undefined ||
                    Radius.current?.value == "" ||
                    parseInt(Radius.current?.value) == 0
                  ) {
                    setError("Select maximum radius of the campaign.");
                  } else {
                    setRadius(parseInt(Radius.current?.value));
                    navigator("/home/createcampaign/step4");
                  }
                } else {
                  setRadius(0);
                  setLat(0);
                  setLong(0);
                  navigator("/home/createcampaign/step4");
                }
              }
            }}
          >
            <CusButton
              text="Next"
              textColor={"text-white"}
              background="bg-primary"
              width={"w-full"}
            ></CusButton>
          </div>
        </div>
      </div>
    </>
  );
};
export default Step3;
