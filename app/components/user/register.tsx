import { Form, Link, useNavigate, useTransition } from "@remix-run/react";
import { CusButton } from "../utils/buttont";
import { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "~/services/firebase";
import { BaseUrl } from "~/const";
import axios from "axios";
import { NOTICEAlerts } from "../utils/alert";

type RegisterBoxState = {
  message: string | null | undefined;
  isBrand: boolean;
};
export const RegisterBox = (props: RegisterBoxState) => {
  const navigator = useNavigate();
  const [isBrand, setBrand] = useState(false);
  const cat = useRef<HTMLInputElement | null>(null);

  /**
   * useEffect hook that runs when the component mounts.
   * If the 'isBrand' prop is true, it sets the value of the 'cat' ref to "brand" and
   * sets the 'brand' state to true.
   * If the 'isBrand' prop is false, it sets the value of the 'cat' ref to "inf" and
   * sets the 'brand' state to false.
   * @returns None
   */
  useEffect(() => {
    if (props.isBrand) {
      cat.current!.value = "brand";
      setBrand(true);
    } else {
      cat.current!.value = "inf";
      setBrand(false);
    }
  }, []);

  const [error, setError] = useState<string | null>(null);

  const [showpassone, setShowPassone] = useState<boolean>(false);
  const changePassVisabelone = () => {
    setShowPassone(!showpassone);
  };

  const [showpasstwo, setShowPasstwo] = useState<boolean>(false);
  const changePassVisabeltwo = () => {
    setShowPasstwo(!showpasstwo);
  };

  /**
   * Registers a user with social media credentials.
   * @param {string} email - The user's email address.
   * @param {string} pass - The user's password.
   * @returns None
   */
  const socialRegister = async (email: string, pass: string) => {
    let req = {
      email: email,
      password: pass,
      "confirm-password": pass,
      isBrand: "0",
      isInfluencer: "1",
    };
    const apidata = await axios({
      method: "post",
      url: `${BaseUrl}/api/register`,
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
    if (apidata.data.status) {
      navigator(`/extra/socialregister/${apidata.data.data.id}`);
    } else {
      setError(apidata.data.message);
    }
  };

  const navigation = useTransition();
  const isSubmitting = navigation.state === "submitting";

  /**
   * Renders a registration form with various input fields and buttons.
   * @returns JSX elements representing the registration form.
   */
  return (
    <>
      <div className="w-full px-6 sm:px-16 grid  lg:grid-cols-3  md:w-4/6 lg:w-full mx-auto pb-20 mt-4">
        <div className="hidden flex-col lg:flex">
          <div className="grow"></div>
          <div className="flex">
            <div className="grow"></div>
            <img
              src="/images/avatar/login.png"
              alt="err"
              className="justify-self-end w-[250px] h-[400px]"
            />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-xl py-6 px-10">
          <div className="flex">
            <div
              className="w-full"
              onClick={() => {
                cat.current!.value = "inf";
                setBrand(false);
              }}
            >
              <CusButton
                width={"w-full"}
                text="Influencer"
                background={`${isBrand ? "bg-[#f7f7f7]" : "bg-secondary"}`}
                textColor={`${isBrand ? "text-primary" : "text-white"}`}
                fontwidth="font-bold"
              ></CusButton>
            </div>
            <div className="w-10"></div>
            <div
              className="w-full"
              onClick={() => {
                cat.current!.value = "brand";
                setBrand(true);
              }}
            >
              <CusButton
                width={"w-full"}
                text="Brand"
                textColor={`${isBrand ? "text-white" : "text-primary"}`}
                background={`${isBrand ? "bg-secondary" : "bg-[#f7f7f7]"}`}
                fontwidth="font-bold"
              ></CusButton>
            </div>
          </div>
          <Form method="post">
            <input name="cat" ref={cat} type="hidden" />
            <p className="text-black text-left font-bold text-lg mt-4">Join</p>
            <p className="text-black text-left font-normal text-lg">
              {" "}
              {isBrand ? "Business Email" : "Email"}
            </p>
            <input
              name="email"
              type={"text"}
              className="bg-[#EEEEEE]  outline-none border-none focus:border-gray-300 rounded-md w-full p-2"
              placeholder="example@mail.com"
            />
            <p className="text-black text-left font-normal text-lg mt-4">
              Password
            </p>
            <div className="bg-gray-200 rounded-md px-4 py-2 flex">
              <input
                name="password"
                type={showpassone ? "text" : "password"}
                className="bg-transparent outline-none border-none focus:border-gray-300 rounded-md w-full"
                placeholder="8 character"
              />
              <div
                className="text-gray-600 text-center px-1 rounded-md shadow-lg text-md cursor-pointer"
                onClick={changePassVisabelone}
              >
                <FontAwesomeIcon
                  icon={showpassone ? faEye : faEyeSlash}
                ></FontAwesomeIcon>
              </div>
            </div>
            <p className="text-black text-left font-normal text-lg mt-4">
              Confirm password
            </p>
            <div className="bg-gray-200 rounded-md px-4 py-2 flex">
              <input
                name="repassword"
                type={showpasstwo ? "text" : "password"}
                className="bg-transparent outline-none border-none focus:border-gray-300 rounded-md w-full"
                placeholder="8 character"
              />
              <div
                className="text-gray-600 text-center px-1 rounded-md shadow-lg text-md cursor-pointer"
                onClick={changePassVisabeltwo}
              >
                <FontAwesomeIcon
                  icon={showpasstwo ? faEye : faEyeSlash}
                ></FontAwesomeIcon>
              </div>
            </div>
            {!isBrand ? (
              <>
                <div className="grid place-items-center py-4">
                  <div className="flex content-center gap-4">
                    <div className="grid place-items-center">
                      <p className="text-black text-left font-normal text-lg  allign-center">
                        Login with
                      </p>
                    </div>
                    {/* <img src="/images/icons/apple.png" alt="error" className="w-10 h-10" /> */}
                    <div
                      onClick={async () => {
                        const googleProvider = new GoogleAuthProvider();
                        const res = await signInWithPopup(auth, googleProvider);
                        const pass =
                          res.user.displayName
                            ?.trim()
                            .split(" ")
                            .join("")
                            .toLowerCase()
                            .trim() + "SWRV123@#";
                        try {
                          await socialRegister(res.user.email!, pass);
                        } catch (e: any) {
                          setError(e.toString());
                        }
                      }}
                    >
                      <img
                        src="/images/icons/google.png"
                        alt="error"
                        className="w-10 h-10 cursor-pointer"
                      />
                    </div>
                  </div>
                </div>
              </>
            ) : null}
            {error == "" || error == null || error == undefined ? null : (
              <NOTICEAlerts message={error}></NOTICEAlerts>
            )}
            {props.message && (
              <p className="w-full border-2 border-red-500 bg-red-500 bg-opacity-5  text-center my-2 rounded-md p-2 text-sm font-semibold text-red-500">
                {props.message}
              </p>
            )}
            <div className="h-4"></div>
            {isSubmitting ?
              <div className="w-full rounded-lg bg-primary shadow-lg text-center font-bold text-white text-md py-2 ">
                Creating...
              </div>
              :
              <button className="w-full inline-block rounded-lg bg-primary shadow-lg text-center font-bold text-white text-md py-2 ">
                Create Account
              </button>
            }
            <div className="flex gap-4 content-start mt-4">
              <div>
                <input type={"checkbox"} name="check1" />
              </div>
              <label className="text-left text-[10px] text-black font-normal">
                I agree with Terms of use and acknowledge that my personal data
                is being collected and processed in accordance with Privacy
                policy
              </label>
            </div>
            <div className="flex gap-4 mt-4 items-center">
              <div>
                <input type={"checkbox"} name="check2" />
              </div>
              <p className="text-left text-[10px] text-black font-normal">
                Also, I confirm I am of eligible age
              </p>
            </div>
            <div className="text-black text-left font-normal text-lg mt-8 flex flex-wrap gap-x-2 w-full">
              <p className=" whitespace-nowrap">
                Already Registered?
              </p>
              <Link to={"/login"} className="block  whitespace-nowrap">
                <span className="font-bold">Login</span>
              </Link>
            </div>
          </Form>
        </div>
        <div className="hidden lg:block"></div>
      </div>
    </>
  );
};
