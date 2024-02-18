import {
  ActionArgs,
  ActionFunction,
  LoaderArgs,
  LoaderFunction,
  json,
  redirect,
} from "@remix-run/node";
import { Form, Link, useLoaderData, useNavigate } from "@remix-run/react";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { BaseUrl } from "~/const";
import { userPrefs } from "~/cookies";
import UserInputStore from "~/state/user/firstinput";
import * as EmailValidator from "email-validator";
import { NOTICEAlerts, SUCCESSAlerts } from "~/components/utils/alert";

/**
 * Loader function that retrieves the user preferences from the request cookie header
 * and returns a JSON response containing the user object.
 * @param {LoaderArgs} props - The loader arguments object.
 * @returns {Promise<Response>} - A promise that resolves to a JSON response.
 */
export const loader: LoaderFunction = async (props: LoaderArgs) => {
  const cookieHeader = props.request.headers.get("Cookie");
  const cookie = await userPrefs.parse(cookieHeader);

  return json({ user: cookie.user });
};

const ThirdPage = () => {
  const userdata = useLoaderData();
  const userId: string = userdata.user.id;
  const brandId: string = userdata.user.brand.id;

  const [error, setError] = useState<string | null>(null);
  const [sus, setSus] = useState<string | null>(null);

  const setIndex = UserInputStore((state) => state.setIndex);

  const nextButton = useRef<HTMLButtonElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);

  const [contactnumber, setContactnumber] = useState<number>();
  const handelcontent = (e: any) => {
    setContactnumber(e.target.value.replace(/\D/g, ""));
  };

  /**
   * Represents an invited user with their name, email, and phone number.
   */
  type InvitedUser = {
    name: string;
    email: string;
    number: string;
  };
  const [invitedUser, setInvitedUser] = useState<InvitedUser[]>([]);
  const [isSending, setIsSending] = useState<boolean>(false);

  const navigator = useNavigate();

  const index = UserInputStore((state) => state.index);


  /**
   * Executes a side effect when the component renders.
   * If the index is equal to 1, it navigates to the "/home/profilecomplete/" path.
   * @returns None
   */
  useEffect(() => {
    if (index == 1) {
      navigator("/home/profilecomplete/");
    }
  }, []);



  /**
   * Navigates the user to the "/home/profilecomplete/forthpage" page.
   * @returns None
   */
  const gotoback = () => {
    navigator("/home/profilecomplete/forthpage");
  }

  /**
   * Moves to the next step in the process.
   * If there are no invited users, sets the sus state to null and sets an error message.
   * Otherwise, sets the index state to 6 and triggers a click event on the nextButton ref.
   * @returns None
   */
  const gotonext = async () => {
    if (invitedUser.length == 0) {
      setSus(null);
      setError("Invite at least one user");
    } else {
      setIndex(6);
      nextButton.current!.click();
    }
  }

  /**
   * Renders a form for inviting users, including input fields for username, email, and contact number.
   * Allows the user to send an invitation to the entered user information.
   * Displays error and success messages based on the result of the invitation.
   * @returns JSX elements representing the form and its components.
   */
  return (
    <>
      <div className="p-8 w-full">
        <h1 className="text-2xl text-black font-bold">Invite users</h1>
        <div className="flex w-full">
          <div className="w-full">
            <div>
              <p className="text-black text-left font-normal text-lg  mt-4">
                Username  <span className="text-rose-500 text-2xl font-semibold">&#42;</span>
              </p>
              <input
                ref={nameRef}
                type={"text"}
                className="bg-[#EEEEEE]  outline-none border-none focus:border-gray-300 rounded-md w-full p-2"
              />
              <p className="text-black text-left font-normal text-lg  mt-4">
                Email  <span className="text-rose-500 text-2xl font-semibold">&#42;</span>
              </p>
              <input
                ref={emailRef}
                type={"text"}
                className="bg-[#EEEEEE]  outline-none border-none focus:border-gray-300 rounded-md w-full p-2"
              />
              <p className="text-black text-left font-normal text-lg  mt-4">
                Contact number  <span className="text-rose-500 text-2xl font-semibold">&#42;</span>
              </p>
              <input
                onChange={handelcontent}
                value={contactnumber}
                type={"text"}
                className="bg-[#EEEEEE]  outline-none border-none focus:border-gray-300 rounded-md w-full p-2"
              />
            </div>
            <div className="flex my-4">
              <div className="grow"></div>

              {isSending ?
                <button
                  className="text-white rounded-lg bg-secondary py-1 px-4 font-semibold text-lg"
                >
                  Sending...
                </button>
                :
                <button
                  onClick={async () => {
                    setIsSending(true);
                    setError(null);
                    if (
                      nameRef.current?.value == null ||
                      nameRef.current?.value == undefined ||
                      nameRef.current?.value == ""
                    ) {
                      setError("Enter the user ");
                    } else if (
                      emailRef.current?.value == null ||
                      emailRef.current?.value == undefined ||
                      emailRef.current?.value == ""
                    ) {
                      setError("Fill the Brand info");
                    } else if (
                      !EmailValidator.validate(emailRef.current?.value)
                    ) {
                      setError("Enter valid Email Address");
                    } else if (emailRef.current?.value.toString().endsWith("@gmail.com") || emailRef.current?.value.toString().endsWith("@yahoo.com") || emailRef.current?.value.toString().endsWith("@hotmail.com")) {
                      setError("Enter Brand Email Address");
                    }
                    else if (
                      contactnumber == null ||
                      contactnumber == undefined ||
                      contactnumber == 0
                    ) {
                      setError("Fill the contact number");
                    }
                    else {
                      let req = {
                        userId: userId,
                        brandId: brandId,
                        name: nameRef.current?.value,
                        email: emailRef.current?.value,
                        contact: contactnumber,
                      };

                      const data = await axios({
                        method: "post",
                        url: `${BaseUrl}/api/send-brand-invite`,
                        data: req,
                      });
                      if (data.data.status == false) {
                        setError(data.data.message);
                      } else {
                        let user: InvitedUser = {
                          name: nameRef.current?.value,
                          email: emailRef.current?.value,
                          number: contactnumber.toString(),
                        };
                        setInvitedUser([...invitedUser, user]);
                        setError(null);
                        setContactnumber(0);
                        nameRef.current!.value = "";
                        emailRef.current!.value = "";
                        setSus("User invited successfully");
                      }
                    }
                    setIsSending(false);
                  }}
                  className="text-white rounded-lg bg-secondary py-1 px-4 font-semibold text-lg"
                >
                  Invite
                </button>}
            </div>
            {error == "" || error == null || error == undefined ? null : (
              <NOTICEAlerts message={error}></NOTICEAlerts>
            )}
            {sus == "" || sus == null || sus == undefined ? null : (
              <SUCCESSAlerts message={sus}></SUCCESSAlerts>
            )}
            {invitedUser.map((val: InvitedUser, index: number) => {
              return (
                <div
                  key={index}
                  className="my-4 bg-gray-200 shadow-md rounded-md py-1 px-4"
                >
                  <p className="text-slate-900 text-md">
                    {index + 1}: {val.name} - {val.email}{" "}
                  </p>
                </div>
              );
            })}
            {/* <div className="flex mt-4 gap-3"> */}
            {/* <button className="bg-[#eeeeee] text-center rounded-lg text-black font-medium cusfont w-full py-2"
                onClick={gotoback}
              >
                Back
              </button> */}
            <button className="bg-primary text-center rounded-lg text-white font-medium cusfont w-full py-2"
              onClick={gotonext}
            >
              Next
            </button>
            {/* </div> */}
            <Form method="post" className="hidden">
              <input type="hidden" name="id" value={userId.toString()} />
              <button ref={nextButton} name="submit">
                Submit
              </button>
            </Form>
          </div>
        </div>
      </div>
    </>
  );
};
export default ThirdPage;

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

    return redirect("/home", {
      headers: {
        "Set-Cookie": await userPrefs.serialize({
          user: userdatasave,
          isLogin: true,
        }),
      },
    });
  }
};
