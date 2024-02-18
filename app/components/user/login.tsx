import { Form, Link, useNavigate, useTransition } from "@remix-run/react";
import { CusButton } from "../utils/buttont";
import { useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash, faXmark } from "@fortawesome/free-solid-svg-icons";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "~/services/firebase";
import axios from "axios";
import { BaseUrl } from "~/const";
import * as EmailValidator from "email-validator";
import { NOTICEAlerts } from "../utils/alert";

type LoginBoxState = {
  message: string | null | undefined;
};
export const LoginBox = (props: LoginBoxState) => {
  const navigator = useNavigate();
  const [showpass, setShowPass] = useState<boolean>(false);
  const changePassVisabel = () => {
    setShowPass(!showpass);
  };
  const [error, setError] = useState<string | null>(null);
  /**
   * Performs a social login by sending a POST request to the specified API endpoint with the provided email and password.
   * If the login is successful, it navigates to the specified URL. Otherwise, it sets an error message.
   * @param {string} email - The email address for the login.
   * @param {string} pass - The password for the login.
   * @returns None
   */
  const socialLogin = async (email: string, pass: string) => {
    const apidata = await axios.post(`${BaseUrl}/api/login`, {
      email: email,
      password: pass,
    });
    if (apidata.data.status) {
      navigator(`/extra/sociallogin/${apidata.data.data.id}`);
    } else {
      setError(apidata.data.message);
    }
  };
  const emailRef = useRef<HTMLInputElement>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [forgetPasswordBox, setForgetPasswordBox] = useState<boolean>(false);
  const [isSending, setIsSending] = useState<boolean>(false);

  /**
   * Sends a request to the server to initiate the password reset process for the user.
   * @returns None
   */
  const forgetPassword = async () => {
    setIsSending(true);
    if (
      emailRef.current?.value == null ||
      emailRef.current?.value == undefined ||
      emailRef.current?.value == ""
    ) {
      setEmailError("Fill the Brand info");
    } else if (!EmailValidator.validate(emailRef.current?.value)) {
      setEmailError("Wrong email format");
    } else {
      const apidata = await axios.post(`${BaseUrl}/api/send-forgot-password`, {
        user: emailRef.current?.value,
      });
      setIsSending(false);
      if (!apidata.data.status) return setEmailError(apidata.data.message + " or Try google login.");
      return setForgetPasswordBox(false);
    }
  };

  /**
   * Renders a login form with various input fields and buttons.
   * @returns JSX elements representing the login form.
   */
  const navigation = useTransition();
  const isSubmitting = navigation.state === "submitting";
  return (
    <>
      <div
        className={`fixed top-0 left-0 bg-gray-600 bg-opacity-20 h-screen w-full grid place-items-center shadow-xl ${forgetPasswordBox ? "" : "hidden"
          }`}
        style={{ zIndex: 100 }}
      >
        <div className="bg-white rounded-lg p-4 pb-2 w-96">
          <div className="flex items-center mb-4">
            <p className="text-black font-bold text-lg text-center">
              Forgot password
            </p>
            <div className="grow"></div>
            <div
              onClick={() => {
                setForgetPasswordBox(false);
              }}
              className="rounded-md bg-secondary px-2"
            >
              <FontAwesomeIcon
                className="text-white text-lg font-bold"
                icon={faXmark}
              ></FontAwesomeIcon>{" "}
            </div>
          </div>

          <input
            ref={emailRef}
            type={"email"}
            className="bg-[#EEEEEE]  outline-none border-none focus:border-gray-300 rounded-md w-full p-2"
            placeholder="example@mail.com"
          />
          <div className="w-full h-2"></div>

          {emailError == "" ||
            emailError == null ||
            emailError == undefined ? null : (
            <NOTICEAlerts message={emailError}></NOTICEAlerts>
          )}
          {isSending ?
            <CusButton
              text="Sending..."
              textColor={"text-white"}
              background={"bg-primary"}
              fontwidth={"font-bold"}
              width={"w-full"}
            ></CusButton>
            :
            <div onClick={forgetPassword}>
              <CusButton
                text="Send"
                textColor={"text-white"}
                background={"bg-primary"}
                fontwidth={"font-bold"}
                width={"w-full"}
              ></CusButton>
            </div>
          }
        </div>
      </div>
      <div className="relative">
        <div className=" text-center text-[180px] -translate-y-4 font-black text-stroke absolute top-0 w-full md:-translate-y-20 md:text-[180px] text-[#eeeeee]">
          Welcome
        </div>
        <div className="w-full px-6 sm:px-16 grid  lg:grid-cols-3 md:w-4/6 lg:w-full mx-auto mb-20">
          <div className="hidden lg:flex"></div>
          <div className="rounded-xl shadow-xl p-10 relative mt-28 bg-white w-[32rem] ">
            <Form method="post">
              {props.message && (
                <p className="w-full border-2 border-red-500 bg-red-500 bg-opacity-5  text-center my-2 rounded-md p-2 text-sm font-semibold text-red-500">
                  {props.message}
                </p>
              )}
              <p className="text-black text-left font-bold text-lg my-4">
                Login
              </p>
              <p className="text-black text-left font-normal text-lg  mb-2">Email</p>
              <input
                name="email"
                type={"email"}
                className="bg-[#f6f6f6]  outline-none border-none focus:border-gray-300 rounded-md w-full p-2"
                placeholder="example@mail.com"
              />
              <p className="text-black text-left font-normal text-lg mt-4 mb-2">
                Password
              </p>
              <div className="bg-[#f6f6f6] rounded-md px-4 py-2 flex">
                <input
                  name="password"
                  type={showpass ? "text" : "password"}
                  className="bg-transparent outline-none border-none focus:border-gray-300 rounded-md w-full"
                />
                <div
                  className="text-gray-600 text-center px-1 text-md cursor-pointer"
                  onClick={changePassVisabel}
                >
                  <FontAwesomeIcon
                    icon={showpass ? faEye : faEyeSlash}
                  ></FontAwesomeIcon>
                </div>
              </div>
              <div className="grid place-items-center py-2">
                <div className="flex content-center gap-4">
                  {/* <img src="/images/media/facebook.png" alt="error" className="w-10 h-10" /> */}
                </div>
              </div>

              {error == "" || error == null || error == undefined ? null : (
                <NOTICEAlerts message={error}></NOTICEAlerts>
              )}

              <div className="flex gap-4 items-center mt-8">
                <div className="grid place-items-center">

                  {isSubmitting ?
                    <div className="w-full inline black rounded-lg bg-secondary shadow-lg text-center font-semibold text-white text-sm py-3 px-16">
                      Processing...
                    </div> :
                    <button className="w-full inline black rounded-lg bg-secondary shadow-lg text-center font-semibold text-white text-sm py-3 px-16">
                      Login
                    </button>
                  }
                </div>
                <div className="grow"></div>
                <p className="text-black text-left font-normal text-lg  allign-center">
                  Login with
                </p>
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
                      await socialLogin(res.user.email!, pass);
                    } catch (e: any) {
                      setError(e.toString());
                    }
                  }}
                >
                  <img
                    src="/images/icons/google.png"
                    alt="error"
                    className="w-8 h-8 cursor-pointer shrink-0"
                  />
                </div>
              </div>
              <div className="flex items-center justify-between mt-8">

                <div className="flex items-center">
                  <input type="checkbox" />
                  <p className="mx-2 text-black text-left font-normal text-sm">Keep me logged in</p>
                </div>
                <div className="text-black text-left font-normal text-sm gap-x-1 flex">
                  <p className="whitespace-nowrap">
                    CAN'T LOG IN?
                  </p>
                  <p
                    onClick={() => {
                      setForgetPasswordBox(true);
                    }}
                    className="font-bold cursor-pointer whitespace-nowrap"
                  >
                    RESTORE PASSWORD
                  </p>
                </div>
              </div>

              <p className="text-black text-left font-bold text-sm mt-6">
                Don't have an account?
              </p>
              <div>
                <Link to={"/register"} className="mt-4 rounded-lg bg-primary inline-block shadow-lg text-center font-semibold text-white text-sm py-2 px-20">
                  Join
                </Link>
              </div>
            </Form>
          </div>
          <div className="hidden lg:block"></div>
        </div>
      </div>
    </>
  );
};
