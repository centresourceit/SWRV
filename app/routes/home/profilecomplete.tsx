import { LoaderArgs, LoaderFunction, json } from "@remix-run/node";
import {
  Outlet,
  useLoaderData,
  useLocation,
  useNavigate,
} from "@remix-run/react";
import { useEffect, useState } from "react";
import { userPrefs } from "~/cookies";
import UserInputStore from "~/state/user/firstinput";
export const loader: LoaderFunction = async (props: LoaderArgs) => {
  const cookieHeader = props.request.headers.get("Cookie");
  const cookie = await userPrefs.parse(cookieHeader);
  return json({ user: cookie.user });
};

/**
 * A functional component that renders a user edit box.
 * @returns The rendered user edit box.
 */
const UserEditBox = () => {
  const userdata = useLoaderData();
  const isBrand = userdata.user.role["code"] == "50" ? true : false;

  const index = UserInputStore((state) => state.index);
  const [img, setImg] = useState<string>("/images/avatar/profile1.png");
  const navigator = useLocation();
  useEffect(() => {
    if (
      navigator.pathname == "/home/profilecomplete/" ||
      navigator.pathname == "/home/profilecomplete"
    ) {
      setImg("/images/avatar/profile1.png");
    } else if (
      navigator.pathname == "/home/profilecomplete/secondpage/" ||
      navigator.pathname == "/home/profilecomplete/secondpage"
    ) {
      setImg("/images/avatar/profile2.png");
    } else if (
      navigator.pathname == "/home/profilecomplete/thirdpage/" ||
      navigator.pathname == "/home/profilecomplete/thirdpage"
    ) {
      setImg("/images/avatar/profile3.png");
    } else if (
      navigator.pathname == "/home/profilecomplete/forthpage/" ||
      navigator.pathname == "/home/profilecomplete/forthpage"
    ) {
      setImg("/images/avatar/profile4.png");
    } else if (
      navigator.pathname == "/home/profilecomplete/fifthpage/" ||
      navigator.pathname == "/home/profilecomplete/fifthpage"
    ) {
      setImg("/images/avatar/profile5.png");
    }
  });

  return (
    <>
      <div className="w-full bg-white rounded-xl p-4 shadow-xl mt-6">
        {
          index == 1 ?

            <div className="w-full  rounded-lg text-center shadow-lg my-4 text-lg font-medium p-2 ">
              0% Completed
            </div>
            : isBrand ?
              <div className="w-full  rounded-lg flex shadow-lg my-4">
                <div
                  className={`text-lg text-center font-medium p-2 bg-secondary text-white  ${index == 1 ? "w-0" : ""
                    } ${index == 2 ? "w-1/5" : ""} ${index == 3 ? "w-2/5" : ""} ${index == 4 ? "w-3/5" : ""} ${index == 5 ? "w-4/5" : ""} ${index == 6 ? "w-full" : ""
                    } rounded-xl`}
                >
                  {/* {index == 1 ? "0% Completed" : ""} */}
                  {index == 2 ? "20% Completed" : ""}
                  {index == 3 ? "40% Completed" : ""}
                  {index == 4 ? "60% Completed" : ""}
                  {index == 5 ? "80% Completed" : ""}
                  {index == 6 ? "100% Completed" : ""}
                </div>
              </div>
              :
              <div className="w-full  rounded-lg flex shadow-lg my-4">
                <div
                  className={`text-lg text-center font-medium p-2 bg-secondary text-white  ${index == 1 ? "w-0" : ""
                    } ${index == 2 ? "w-1/4" : ""} ${index == 3 ? "w-2/4" : ""} ${index == 4 ? "w-3/4" : ""} ${index == 5 ? "w-full" : ""
                    } rounded-xl`}
                >
                  {/* {index == 1 ? "0% Completed" : ""} */}
                  {index == 2 ? "25% Completed" : ""}
                  {index == 3 ? "50% Completed" : ""}
                  {index == 4 ? "75% Completed" : ""}
                  {index == 5 ? "100% Completed" : ""}
                </div>
              </div>
        }

        <div className="flex lg:flex-row flex-col">
          <div className="p-6  hidden md:block w-[400px] shrink-0">
            <div className="hidden lg:block w-full ">
              <img src={img} alt="error" className="h-[340px] w-[480px] object-contain object-center" />
            </div>
            <h1 className="pt-4 text-3xl text-primary text-left font-semibold">
              Welcome
            </h1>
            <p className="pt-2 text-black text-xl font-normal">
              Thank you for the confirmation, Login with your account and start
              searching for the brands.
            </p>
          </div>
          <div className="hidden md:block">
            <div className="bg-white rounded-xl shadow-xl px-1 py-2 flex flex-row items-center lg:flex-col justify-between overflow-x-hidden no-scrollbar">
              <ProfileCompleteBox
                isActive={index >= 1 ? true : false}
                positionumber={"01"}
                title={"Info"}
              ></ProfileCompleteBox>
              <ProfileCompleteBox
                isActive={index >= 2 ? true : false}
                positionumber={"02"}
                title={"Audience"}
              ></ProfileCompleteBox>
              <ProfileCompleteBox
                isActive={index >= 3 ? true : false}
                positionumber={"03"}
                title={"Social"}
              ></ProfileCompleteBox>
              <ProfileCompleteBox
                isActive={index >= 4 ? true : false}
                positionumber={"04"}
                title={"Document"}
              ></ProfileCompleteBox>
              <ProfileCompleteBox
                isActive={index >= 5 ? true : false}
                positionumber={"05"}
                title={"Contact"}
              ></ProfileCompleteBox>
              {isBrand ? (
                <ProfileCompleteBox
                  isActive={index >= 6 ? true : false}
                  positionumber={"06"}
                  title={"Users"}
                ></ProfileCompleteBox>
              ) : null}
            </div>
          </div>
          <Outlet></Outlet>
        </div>
      </div>
    </>
  );
};

export default UserEditBox;

type ProfileCompleteBoxProps = {
  isActive: boolean;
  positionumber: string;
  title: string;
};
/**
 * A component that displays a profile completion box.
 * @param {ProfileCompleteBoxProps} props - The props for the component.
 * @returns The JSX element representing the profile completion box.
 */
const ProfileCompleteBox = (props: ProfileCompleteBoxProps) => {
  return (
    <>
      <div className="px-3 py-2">
        <div
          className={`grid place-items-center h-16 w-16 shadow-md rounded-md ${props.isActive ? "bg-secondary" : "bg-gray-200"
            }`}
        >
          <p
            className={`font-medium text-xl ${props.isActive ? "text-white" : "text-black"
              }`}
          >
            {props.positionumber}
          </p>
        </div>
        <h4
          className={`text-sm text-center ${props.isActive ? "text-black" : "text-gray-500"
            } mt-2`}
        >
          {props.title}
        </h4>
      </div>
    </>
  );
};
