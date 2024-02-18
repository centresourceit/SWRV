import {
  ActionArgs,
  ActionFunction,
  LoaderArgs,
  LoaderFunction,
  json,
  redirect,
} from "@remix-run/node";
import { Form, useLoaderData, useNavigate } from "@remix-run/react";
import { useEffect, useRef, useState } from "react";
import { CusButton } from "~/components/utils/buttont";
import { BaseUrl } from "~/const";
import { userPrefs } from "~/cookies";
import UserInputStore from "~/state/user/firstinput";
import { UploadFile } from "~/utils";
import axios from "axios";
import { NOTICEAlerts } from "~/components/utils/alert";

export const loader: LoaderFunction = async (props: LoaderArgs) => {
  const cookieHeader = props.request.headers.get("Cookie");
  const cookie = await userPrefs.parse(cookieHeader);
  return json({ user: cookie.user });
};

/**
 * A functional component that renders a user input box for updating user information.
 * @returns None
 */
const UserInputBoxOne = () => {

  const [isUpdating, setIsUpdating] = useState<boolean>(false);

  const user = useLoaderData();
  const useremail: string = user.user.email;
  const userID: String = user.user.id;
  const setIndex = UserInputStore((state) => state.setIndex);
  const navigator = useNavigate();

  const [img, setImg] = useState<File | null>(null);
  let imgref = useRef<HTMLInputElement | null>(null);
  const [imgerror, setImgerror] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const emailRef = useRef<HTMLInputElement | null>(null);
  const usernameRef = useRef<HTMLInputElement | null>(null);
  const nicknameRef = useRef<HTMLInputElement | null>(null);
  const datepicker = useRef<HTMLInputElement | null>(null);
  const bioRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    emailRef!.current!.value = useremail;
    if (user.user.userName == null || user.user.userName == undefined || user.user.userName == "") {
      usernameRef!.current!.value = useremail.toString().split("@")[0] ?? "";
    } else {
      usernameRef!.current!.value = user.user.userName ?? "";
    }
    nicknameRef!.current!.value = user.user.knownAs ?? "";
    bioRef!.current!.value = user.user.bio ?? "";
    datepicker!.current!.value = user.user.dob ?? "";
  }, []);

  const nextButton = useRef<HTMLButtonElement>(null);

  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() - 15);
  const maxDateString = maxDate.toISOString().split("T")[0];


  const gotonext = async () => {
    setIsUpdating(true);
    if (
      emailRef.current?.value == null ||
      emailRef.current?.value == undefined ||
      emailRef.current?.value == ""
    ) {
      setError("Enter the Email Address");
    } else if (
      usernameRef.current?.value == null ||
      usernameRef.current?.value == undefined ||
      usernameRef.current?.value == ""
    ) {
      setError("Enter the username");
    } else if (
      nicknameRef.current?.value == null ||
      nicknameRef.current?.value == undefined ||
      nicknameRef.current?.value == ""
    ) {
      setError("Enter the nickname");
    } else if (
      datepicker.current?.value == null ||
      datepicker.current?.value == undefined ||
      datepicker.current?.value == ""
    ) {
      setError("Enter the date of birth");
    } else if (
      bioRef.current?.value == null ||
      bioRef.current?.value == undefined ||
      bioRef.current?.value == ""
    ) {
      setError("Enter the bio");
    } else {

      if (user.user.pic == null || user.user.pic == undefined || user.user.pic == "" || user.user.pic == "0") {
        // if no image

        if (img == null) {
          setError("Please select the image");
        } else {
          let avatar = await UploadFile(img);
          if (avatar.status) {
            let req = {
              id: userID,
              userName: usernameRef.current?.value,
              userKnownAs: nicknameRef.current?.value,
              userBioInfo: bioRef.current?.value,
              userDOB: datepicker.current?.value,
              userPicUrl: avatar.data,
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
                setIndex(2);
                nextButton.current!.click();
              } else {
                setError(data.data.message);
              }
            }
            setIndex(2);
            nextButton.current!.click();
          } else {
            setError(avatar.data);
          }

        }

      } else {
        // if user have image
        let req = {
          id: userID,
          userName: usernameRef.current?.value,
          userKnownAs: nicknameRef.current?.value,
          userBioInfo: bioRef.current?.value,
          userDOB: datepicker.current?.value,
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
            setIndex(2);
            nextButton.current!.click();
          } else {
            return setError(data.data.message);
          }
        }
        setIndex(2);
        nextButton.current!.click();
      }
    }
    setIsUpdating(false);
  }


  /**
   * Renders a form for users to provide information about themselves.
   * @returns JSX elements representing the form.
   */
  return (
    <>
      <div className="px-4 py-6 w-full">
        <h1 className="text-2xl text-black font-bold">
          Tell us about yourself
        </h1>
        <div className="flex w-full md:flex-row flex-col">
          <div>
            <div className="hidden">
              <input
                type="file"
                accept="image/*"
                ref={imgref}
                onChange={(value) => {
                  let file_size = parseInt(
                    (value!.target.files![0].size / 1024 / 1024).toString()
                  );
                  if (file_size < 4) {
                    setImgerror(null);
                    setImg(value!.target.files![0]);
                  } else {
                    setImgerror("Image file size must be less then 4 mb");
                  }
                }}
              />
            </div>
            <div className="bg-gray-200 rounded-lg my-3 mr-4 p-4 text-gray-400 flex md:flex-col flex-row w-full md:w-40">
              <div className="grow sm:w-full">
                {img == null ? user.user.pic == null || user.user.pic == undefined || user.user.pic == "" || user.user.pic == "0" ? (
                  <img
                    src="/images/icons/gallery.png"
                    alt="error"
                    className="w-40 sm:w-full object-cover inline-block"
                  />
                ) : <img
                  src={user.user.pic}
                  alt="error"
                  className="w-40 sm:w-full object-cover inline-block"
                /> : (
                  <img
                    src={URL.createObjectURL(img)}
                    alt="error"
                    className="w-40 sm:w-full inline-block object-cover rounded-md"
                  />
                )}
              </div>
              <div className="sm:w-full">
                <p className="mt-2 text-sm">Drop profile photo here.</p>
                <p className="mt-2 text-sm">
                  The image should either be jpg jped or png format and be a
                  maximum size of 5 MB
                </p>
                {imgerror == "" ||
                  imgerror == null ||
                  imgerror == undefined ? null : (
                  <div className="bg-red-500 bg-opacity-10 border-2 text-center border-red-500 rounded-md text-red-500 text-md font-normal text-md my-4">
                    {imgerror}
                  </div>
                )}
                <div
                  onClick={() => {
                    imgref.current?.click();
                  }}
                >
                  <CusButton
                    text="Upload"
                    textColor={"text-white"}
                    width={"w-full"}
                    background={"bg-primary"}
                  ></CusButton>
                </div>
              </div>
            </div>
          </div>
          <div className="w-full">
            <p className="text-black text-left font-normal text-lg mt-4">
              Email <span className="text-rose-500 text-2xl font-semibold">&#42;</span>
            </p>
            <input
              ref={emailRef}
              disabled={true}
              type={"text"}
              className="bg-[#EEEEEE]  outline-none border-none focus:border-gray-300 rounded-md w-full p-2"
            />
            <p className="text-black text-left font-normal text-lg  mt-4">
              Username <span className="text-rose-500 text-2xl font-semibold">&#42;</span>
            </p>
            <input
              ref={usernameRef}
              type={"text"}
              className="bg-[#EEEEEE]  outline-none border-none focus:border-gray-300 rounded-md w-full p-2"
            />
            <p className="text-black text-left font-normal text-lg  mt-4">
              Nickname <span className="text-rose-500 text-2xl font-semibold">&#42;</span>
            </p>
            <input
              ref={nicknameRef}
              type={"text"}
              className="bg-[#EEEEEE]  outline-none border-none focus:border-gray-300 rounded-md w-full p-2"
            />
            <p className="text-black text-left font-normal text-lg  mt-4">
              Date of birth <span className="text-rose-500 text-2xl font-semibold">&#42;</span>
            </p>
            <input
              type={"date"}
              ref={datepicker}
              className="bg-[#EEEEEE]  outline-none border-none focus:border-gray-300 rounded-md w-full p-2"
              max={maxDateString}
            />
            <p className="text-black text-left font-normal text-lg  mt-4">
              Bio <span className="text-rose-500 text-2xl font-semibold">&#42;</span>
            </p>
            <textarea
              ref={bioRef}
              className="p-4 w-full h-40 outline-none border-2 bg-[#EEEEEE] focus:border-gray-300 rounded-md resize-none"
            ></textarea>
            {error == "" || error == null || error == undefined ? null : (
              <NOTICEAlerts message={error}></NOTICEAlerts>
            )}
            <div className="mt-2">
              {isUpdating ?
                <div className="bg-primary text-center rounded-lg text-white font-medium cusfont w-full py-2">
                  Updating...
                </div>
                :
                <button className="bg-primary text-center rounded-lg text-white font-medium cusfont w-full py-2"
                  onClick={gotonext}
                >
                  Next
                </button>}
            </div>
            <Form method="post" className="hidden">
              <input type="hidden" name="id" value={userID.toString()} />
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
export default UserInputBoxOne;

/**
 * An asynchronous action function that handles a request and performs the necessary operations.
 * @param {ActionArgs} - The arguments object containing the request.
 * @returns {Object} - An object containing the response message or a redirect.
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

    return redirect("/home/profilecomplete/secondpage", {
      headers: {
        "Set-Cookie": await userPrefs.serialize({
          user: userdatasave,
          isLogin: true,
        }),
      },
    });
  }
};
