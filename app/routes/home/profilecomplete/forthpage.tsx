import { faAdd, faChevronRight, faCircleXmark, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  ActionArgs,
  ActionFunction,
  LoaderArgs,
  LoaderFunction,
  json,
  redirect,
} from "@remix-run/node";
import {
  Form,
  Link,
  useLoaderData,
  useLocation,
  useNavigate,
} from "@remix-run/react";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { MaterialSymbolsArrowDropDownRounded } from "~/components/icons";
import { NOTICEAlerts } from "~/components/utils/alert";
import { BaseUrl } from "~/const";
import { userPrefs } from "~/cookies";
import UserInputStore from "~/state/user/firstinput";

export const loader: LoaderFunction = async (props: LoaderArgs) => {
  const cookieHeader = props.request.headers.get("Cookie");
  const cookie = await userPrefs.parse(cookieHeader);
  const country = await axios({
    method: "post",
    url: `${BaseUrl}/api/getcountry`,
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


  const userdata = await axios({
    method: "post",
    url: `${BaseUrl}/api/getuser`,
    data: { id: cookie.user.id },
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
    user: cookie.user,
    country: country.data.data,
    userdata: userdata.data.data[0],
  });
};

const ForthPage = () => {
  const userdata = useLoaderData();
  const userId: string = userdata.user.id;
  const country = userdata.country;
  const gender: String[] = ["MALE", "FEMALE", "TRANSGENDER"];
  const isBrand = userdata.user.role["code"] == "50" ? true : false;

  const [selCountry, setSelCountry] = useState<any[]>([]);
  const [con, setcon] = useState<boolean>(false);

  const [selGender, setSelGender] = useState<any[]>([]);
  const [gen, setgen] = useState<boolean>(false);

  const [error, setError] = useState<string>("");
  const [cityerror, setCityerror] = useState<string | null>(null);
  const [citybox, setCitybox] = useState<boolean>(false);
  const [searchcity, setSearchcity] = useState<any[]>([]);
  const [selectedcity, setSelectedctiy] = useState<any>(null);

  const [contactnumber, setContactnumber] = useState<number>();
  const handelcontent = (e: any) => {
    setContactnumber(e.target.value.replace(/\D/g, ""));
  };
  
  let cityref = useRef<HTMLInputElement | null>(null);

  /**
   * Retrieves the city data from the server based on the provided city name and country ID.
   * @param {string} city - The name of the city to search for.
   * @param {string} countryId - The ID of the country to search within.
   * @returns None
   */
  const getCity = async (city: String, countryId: string) => {
    const data = await axios.post(`${BaseUrl}/api/get-city`, {
      search: city,
      countryId: countryId,
    });
    setSearchcity(data.data.data);
  };

  const setIndex = UserInputStore((state) => state.setIndex);
  const [check, setCheck] = useState<boolean>(false);
  const handleOnChange = () => {
    setCheck(!check);
  };

  const nextButton = useRef<HTMLButtonElement>(null);


  const userinfo = userdata.userdata;

  const navigator = useNavigate();

  const index = UserInputStore((state) => state.index);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);


  /**
   * useEffect hook that runs when the component mounts or when the value of 'index' changes.
   * It performs various operations based on the values of 'index' and 'userinfo'.
   * @returns None
   */
  useEffect(() => {
    if (index == 1) {
      navigator("/home/profilecomplete/");
    }
    // contact
    setContactnumber(userinfo.contact ?? 0)
    setSelGender([userinfo.gender.name]);

    if (!(userinfo.city == null || userinfo.city == undefined || userinfo.city == "")) {
      setSelCountry([{
        id: userinfo.city.state.country.id,
        name: userinfo.city.state.country.name,
        code: userinfo.city.state.country.code,
      }]);
      setSelectedctiy(
        {
          id: userinfo.city.id,
          name: userinfo.city.name,
          code: userinfo.city.code,
          country:
          {
            isd: userinfo.city.state.country.isd
          }
        }
      );
    }

    if (!(userinfo.contact == "" || userinfo.contact == null || userinfo.contact == undefined)) {
      setCheck(true);
    }
  }, []);

  /**
   * Navigates the user to a specific page and sets the index to a specified value.
   * @returns None
   */
  const gotoback = () => {
    setIndex(4);
    navigator("/home/profilecomplete/extrapage");
  }


  /**
   * Function to handle the next button click event. It performs validation checks on the selected country, gender, city, contact number, and checkbox. If all validations pass, it sends a POST request to update the user information.
   * @returns None
   */
  const gotonext = async () => {
    setIsUpdating(true);
    if (selCountry.length == 0) {
      setError("Select the country");
    } else if (gender.length == 0) {
      setError("Select your gender");
    } else if (selectedcity == null || selCountry == undefined) {
      setError("Select the city");
    } else if (
      contactnumber == null ||
      contactnumber == undefined ||
      contactnumber == 0
    ) {
      setError("Fill the contact number");
    }
    // else if (contactnumber.toString().length != 10) {
    //   setError("Enter a 10 digit valid contact number");
    // } 
    else if (!check) {
      setError("Check the box in order to proceed");
    } else {
      let req = {
        id: userId,
        cityId: selectedcity["id"],
        userContact: contactnumber,
        userGender:
          selGender[0] == "MALE"
            ? "1"
            : selGender[0] == "FEMALE"
              ? "2"
              : "3",
      };

      const data = await axios({
        method: "post",
        url: `${BaseUrl}/api/updateuser`,
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

        if (data.data.message == "Oops, something went wrong") {
          setIndex(5);
          nextButton.current!.click();
        } else {
          setError(data.data.message);
        }
      }
      setIndex(5);
      nextButton.current!.click();
    }
    setIsUpdating(false);
  }

  /**
   * Renders a form for capturing user details including gender, country, city, phone number, and a checkbox for confirming the accuracy of the details.
   * @returns JSX elements representing the form.
   */
  return (
    <>

      <div className="p-8 w-full">
        <div className="flex w-full">
          <div className="w-full">

            {/* Gender start here */}
            <p className="text-black text-left font-normal text-lg  mt-4">
              Gender  <span className="text-rose-500 text-2xl font-semibold">&#42;</span>
            </p>
            <div className="bg-[#EEEEEE] h-10 rounded-lg  flex gap-1 pl-2 w-full relative" onClick={() => {
              setgen((val: boolean) => !val);
            }}>
              <div className="flex gap-x-2 flex-wrap relative">
                {selGender.map((value: any, i: number) => {
                  return (
                    <div
                      key={i}
                      className="flex bg-white my-1 rounded-md py-1 px-2 items-center gap-x-4"
                    >
                      <h1 className=" text-black font-semibold text-center">
                        {value}
                      </h1>

                      <div className="grid place-items-center cursor-pointer" onClick={(e) => {
                        e.stopPropagation();
                        const ans = selGender.filter((item) => item != value);
                        setSelGender(ans);
                      }}>
                        <FontAwesomeIcon icon={faCircleXmark} className="text-lg font-bold text-red-500"></FontAwesomeIcon>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="grow"></div>

              <div
                className="grid place-items-center px-2 w-12 text-primary rounded-lg relative h-10"
              >
                {gen ?
                  <FontAwesomeIcon className="cursor-pointer" icon={faXmark}></FontAwesomeIcon>
                  :
                  <MaterialSymbolsArrowDropDownRounded className="text-4xl cursor-pointer" />
                }
              </div>

              <div
                className={`z-10 w-full bg-[#eeeeee] absolute top-12 left-0 ${gen ? "" : "hidden"
                  } p-4`}
                onClick={val => setgen(false)}
              >
                <div className="min-h-80 overflow-y-scroll no-scrollbar" onClick={(e) => e.stopPropagation()}>
                  {gender.map((val: any, i: number) => {
                    return (
                      <h1
                        onClick={() => {
                          if (selGender.includes(val)) {
                            let addcur = selGender.filter(
                              (data) => data != val
                            );
                            setSelGender(addcur);
                          } else {
                            setSelGender([val]);
                          }
                          setgen(false);
                        }}
                        key={i}
                        className={`text-lg text-left font-normal rounded-md w-full no-scrollbar cursor-pointer hover:bg-gray-300 px-4 py-2 my-1 `}
                      >
                        {val}
                      </h1>
                    );
                  })}
                </div>
              </div>
            </div>


            {/* <div
              className={`w-full h-screen bg-gray-300 bg-opacity-20 fixed top-0 left-0 ${gen ? "" : "hidden"
                } grid place-items-center`}
              onClick={val => setgen(false)}
            >
              <div className="bg-white p-10 cursor-pointer" onClick={(e) => e.stopPropagation()}>
                <div className="min-h-80 overflow-y-scroll no-scrollbar w-80">
                  {gender.map((val: any, i: number) => {
                    return (
                      <h1
                        onClick={() => {
                          if (selGender.includes(val)) {
                            let addcur = selGender.filter(
                              (data) => data != val
                            );
                            setSelGender(addcur);
                          } else {
                            setSelGender([val]);
                          }
                          setgen(false);
                        }}
                        key={i}
                        className={`text-lg text-center font-normal rounded-md w-full my-2 border-2 ${selGender.includes(val)
                          ? "border-green-500 text-green-500"
                          : "border-gray-800 text-black"
                          }  no-scrollbar`}
                      >
                        {val}
                      </h1>
                    );
                  })}
                </div>
                <div
                  onClick={() => {
                    setgen(false);
                  }}
                  className="my-4 bg-red-500 bg-opacity-10 b-2 border-red-500 px-4 py-1 text-red-500 font-medium text-center cursor-pointer"
                >
                  Close
                </div>
              </div>
            </div> */}

            {/* Gender end here */}


            {/* country start here */}
            <p className="text-black text-left font-normal text-lg mt-4">
              Country  <span className="text-rose-500 text-2xl font-semibold">&#42;</span>
            </p>
            <div className="bg-[#EEEEEE] h-10 rounded-lg  flex gap-1 pl-2 w-full relative"
              onClick={() => {
                setcon((val: boolean) => !val);
              }}
            >
              <div className="flex gap-x-2 overflow-x-scroll flex-nowrap no-scrollbar relative">
                {selCountry.map((value: any, i: number) => {
                  return (
                    <div
                      key={i}
                      className="flex bg-white my-1 rounded-md py-1 px-2 items-center gap-x-4"
                    >
                      <h1 className=" text-black font-semibold text-center w-auto">
                        {`${value["name"]} - [${value["code"]}]`}
                      </h1>
                      <div className="grid place-items-center cursor-pointer" onClick={(e) => {
                        e.stopPropagation();
                        const ans = selCountry.filter((item) => item != value);
                        setSelCountry(ans);
                      }}>
                        <FontAwesomeIcon icon={faCircleXmark} className="text-lg font-bold text-red-500"></FontAwesomeIcon>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="grow"></div>
              <div
                className="grid place-items-center px-2 w-12 text-primary rounded-lg relative h-10"
              >
                {con ?
                  <FontAwesomeIcon className="cursor-pointer" icon={faXmark}></FontAwesomeIcon>
                  :
                  <MaterialSymbolsArrowDropDownRounded className="text-4xl cursor-pointer" />
                }
              </div>
              <div
                className={`z-10 w-full bg-[#eeeeee] absolute top-12 left-0 ${con ? "" : "hidden"
                  } p-4`}
                onClick={val => setcon(false)}
              >
                <div className="overflow-y-scroll no-scrollbar h-[350px]" onClick={(e) => e.stopPropagation()}>
                  {country.map((val: any, i: number) => {
                    return (
                      <h1
                        onClick={() => {
                          setSelCountry((value) => [val]);
                          setcon(false);
                        }}
                        key={i}
                        className={`text-lg text-left hover:bg-gray-300 font-normal rounded-md w-full px-4 py-2 my-1 no-scrollbar`}
                      >
                        {val["code"]} - {val["name"]}
                      </h1>
                    );
                  })}
                </div>
              </div>
            </div>



            {/* <div
              className={`w-full h-screen bg-gray-300 bg-opacity-20 fixed top-0 left-0 ${con ? "" : "hidden"
                } grid place-items-center`}
              onClick={val => setcon(false)}
            >
              <div className="bg-white p-10 cursor-pointer" onClick={(e) => e.stopPropagation()}>
                <div className="overflow-y-scroll no-scrollbar w-80 h-[350px]">
                  {country.map((val: any, i: number) => {
                    return (
                      <h1
                        onClick={() => {
                          setSelCountry((value) => [val]);
                          setcon(false);
                        }}
                        key={i}
                        className={`text-lg text-center font-normal rounded-md w-full my-2 border-2 ${selCountry.includes(val)
                          ? "border-green-500 text-green-500"
                          : "border-gray-800 text-black"
                          }  no-scrollbar`}
                      >
                        {val["code"]} - {val["name"]}
                      </h1>
                    );
                  })}
                </div>
                <div
                  onClick={() => {
                    setcon(false);
                  }}
                  className="my-4 bg-red-500 bg-opacity-10 b-2 border-red-500 px-4 py-1 text-red-500 font-medium text-center cursor-pointer"
                >
                  Close
                </div>
              </div>
            </div> */}
            {/* country end here */}


            {/* form city start here */}
            <p className="text-black text-left font-normal text-lg  mt-4">
              City  <span className="text-rose-500 text-2xl font-semibold">&#42;</span>
            </p>
            <div className="w-full bg-[#EEEEEE] rounded-md flex p-2 gap-x-4 relative">
              {selectedcity == "" ||
                selectedcity == null ||
                selectedcity == undefined ? null : (
                <div
                  className="flex bg-white rounded-md py-1 px-2 items-center gap-x-4 relative"
                >
                  <h1 className=" text-black font-semibold text-center w-auto">
                    {selectedcity["name"]} - {selectedcity["code"]}
                  </h1>
                  <div className="grid place-items-center cursor-pointer" onClick={(e) => {
                    e.stopPropagation();
                    setSelectedctiy(null);
                  }}>
                    <FontAwesomeIcon icon={faCircleXmark} className="text-lg font-bold text-red-500"></FontAwesomeIcon>
                  </div>
                </div>
              )}
              <div className="grow required:">
                <input
                  ref={cityref}
                  className="h-full w-full outline-none focus:border-gray-300 bg-transparent"
                />
              </div>
              <div
                className="bg-white text-bold p-2 rounded-md grid place-items-center w-8 h-8 cursor-pointer relative"
                onClick={() => {

                  if (selCountry.length == 0) {
                    setError("Select the country first");
                  } else if (
                    cityref.current?.value == null ||
                    cityref.current?.value == undefined ||
                    cityref.current?.value == ""
                  ) {
                    setCityerror("Enter the city name");
                  } else {
                    setCitybox(true);
                    setCityerror(null);
                    getCity(cityref.current?.value ?? "", selCountry[0].id);
                  }
                }}
              >
                <FontAwesomeIcon icon={faChevronRight}></FontAwesomeIcon>
              </div>


              {/* city section start from here */}
              <div
                className={`absolute top-12 left-0 z-10 w-full bg-[#eeeeee] p-4 ${citybox ? "" : "hidden"
                  }`}
                onClick={val => setCitybox(false)}
              >
                <div className="overflow-y-scroll no-scrollbar h-[280px]" onClick={(e) => e.stopPropagation()}>
                  {searchcity.length == 0 ? (
                    <div className="min-h-96">
                      <div className="bg-red-500 bg-opacity-10 border-2 text-center border-red-500 rounded-md text-red-500 text-md font-normal text-md my-4">
                        No city found with this name
                      </div>
                      <button
                        className="px-2 mx-auto bg-red-500 bg-opacity-10 border-2 text-center border-red-500 rounded-md text-red-500 text-md font-normal text-md my-4 cursor-pointer"
                        onClick={() => {
                          setCitybox(false);
                        }}
                      >
                        Close
                      </button>
                    </div>
                  ) : (
                    <div className="h-[280px] overflow-y-scroll no-scrollbar">
                      {searchcity.map((value: any, index: number) => {
                        return (
                          <>
                            <div
                              onClick={() => {
                                setSelectedctiy(value);
                                setCitybox(false);
                                cityref!.current!.value = "";
                              }}
                              key={index}
                              className={`text-lg text-left hover:bg-gray-300 font-normal rounded-md w-full px-4 py-2 my-1 no-scrollbar`}
                            >
                              {value["name"]} - {value["code"]}
                            </div>
                          </>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
              {/* city section end  here */}
            </div>
            {cityerror == "" ||
              cityerror == null ||
              cityerror == undefined ? null : (
              <div className="bg-red-500 bg-opacity-10 border-2 text-center border-red-500 rounded-md text-red-500 text-md font-normal text-md my-4">
                {cityerror}
              </div>
            )}

            {/* form city end here */}

            {/* form phone number start here */}
            <p className="text-black text-left font-normal text-lg  mt-4">
              Phone number  <span className="text-rose-500 text-2xl font-semibold">&#42;</span>
            </p>
            <div className="p-2 w-full outline-none bg-[#EEEEEE] focus:border-gray-300 rounded-md flex">
              <div className="text-center text-black font-normal text-md mr-4">
                {selectedcity == null ? 0 : selectedcity["country"]["isd"]}
              </div>
              <input
                onChange={handelcontent}
                value={contactnumber}
                type={"text"}
                className="w-full outline-none bg-transparent focus:border-gray-300 rounded-md resize-none"
              />
            </div>
            {/* form phone number start here */}
            {/* form end there */}
            <div className="flex gap-2 mt-4 items-center">
              <div>
                <input
                  checked={check}
                  onChange={handleOnChange}
                  type={"checkbox"}
                  name="check2"
                />
              </div>
              <p className="text-left text-[10px] text-black font-normal">
                The above details are true and correct
              </p>
            </div>
            {error == "" || error == null || error == undefined ? null : (
              <NOTICEAlerts message={error}></NOTICEAlerts>
            )}
            <div className="flex mt-4 gap-3">
              <button className="bg-[#eeeeee] text-center rounded-lg text-black font-medium cusfont w-full py-2"
                onClick={gotoback}
              >
                Back
              </button>
              {isUpdating ?
                <div className="bg-primary text-center rounded-lg text-white font-medium cusfont w-full py-2">
                  Updating...
                </div>
                :
                <button className="bg-primary text-center rounded-lg text-white font-medium cusfont w-full py-2"
                  onClick={gotonext}
                >
                  Submit
                </button>
              }
            </div>
            <div className="rounded-md text-rose-500 font-medium text-md bg-rose-500 bg-opacity-20 p-4 my-2">
              You will not be able to go back & edit the profile details after this step. Please make the changes before final submission.
            </div>



            <div className="hidden">
              <Form method="post" className="hidden">
                <input type="hidden" name="id" value={userId.toString()} />
                <input
                  type="hidden"
                  name="address"
                  value={isBrand ? "/home/profilecomplete/fifthpage" : "/home"}
                />
                <button ref={nextButton} name="submit">
                  Submit
                </button>
              </Form>
            </div>
          </div>
        </div>
      </div>

    </>
  );
};

export default ForthPage;

/**
 * An action function that handles a request and performs the necessary operations.
 * @param {ActionArgs} request - The request object containing the request data.
 * @returns {Promise<object>} - A promise that resolves to an object containing the response data.
 */
export const action: ActionFunction = async ({ request }: ActionArgs) => {
  const formData = await request.formData();
  const value = Object.fromEntries(formData);

  const userdata = await axios({
    method: "post",
    url: `${BaseUrl}/api/getuser`,
    data: { id: value.id },
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
  if (userdata.data.status == false) {
    return { message: userdata.data.message };
  } else {

    let userdatasave = userdata.data.data[0];
    delete userdatasave.languages;
    delete userdatasave.platforms;
    delete userdatasave.categories;
    delete userdatasave.market;

    return redirect(value.address.toString(), {
      headers: {
        "Set-Cookie": await userPrefs.serialize({
          user: userdatasave,
          isLogin: true,
        }),
      },
    });
  }
};
