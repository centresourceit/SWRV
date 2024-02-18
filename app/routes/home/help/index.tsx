import { LoaderArgs, LoaderFunction, json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { userPrefs } from "~/cookies";
export const loader: LoaderFunction = async (props: LoaderArgs) => {
  const cookieHeader = props.request.headers.get("Cookie");
  const cookie = await userPrefs.parse(cookieHeader);
  return json({ user: cookie.user });
};

/**
 * A functional component that renders a help section for the SWRV application.
 * @returns JSX elements representing the help section.
 */
const Help = () => {
  const name = useLoaderData().user.userName.split("@")[0];
  return (
    <>
      <div>
        <div className="w-full rounded-xl shadow-xl bg-[#10BCE2] flex my-4 p-10 md:flex-row flex-col">
          <div className="text-5xl text-primary font-bold">
            Hi <span className="text-white"> @{name},</span>
            <br /> How can we help?
          </div>
          <div className="grow grid place-items-center md:p-10 my-4">
            <input
              type={"text"}
              className="placeholder:text-black bg-white opacity-30  outline-none border-none focus:border-gray-300 rounded-md w-full p-2"
              placeholder="search"
            />
          </div>
        </div>
        <div className="w-full rounded-xl shadow-xl bg-white flex my-4 p-10 md:flex-row flex-col md:gap-x-10 gap-y-6 md:gap-y-0">
          <div>
            <p className="text-xl text-black font-bold">Using SWRV</p>
            <Link
              to={"/home/help/manage_your_account"}
              className="block text-xl text-gray-400 font-bold mt-2"
            >
              Manage your account
            </Link>
            <Link
              to={"/home/help/campaigns"}
              className="block text-xl text-gray-400 font-bold mt-2"
            >
              Campaigns
            </Link>
            <Link
              to={"/home/help/safety_and_security"}
              className="block text-xl text-gray-400 font-bold mt-2"
            >
              Safety and security
            </Link>
            <Link
              to={"/home/help/rules_and_policies"}
              className="block text-xl text-gray-400 font-bold mt-2"
            >
              Rules and policies
            </Link>
          </div>
          <div>
            <p className="text-xl text-black font-medium">
              Everything you need to know so you can use SWRV like a pro
            </p>
            <div className="flex md:gap-x-16 gap-x-8">
              <div>
                <Link
                  to={"/home/help/registration"}
                  className="block text-cyan-500 mt-2"
                >
                  Registration
                </Link>
                <Link
                  to={"/home/help/verificaiton"}
                  className="block text-cyan-500 mt-2"
                >
                  Verification
                </Link>
                <Link
                  to={"/home/help/social_media_accounts"}
                  className="block text-cyan-500 mt-2"
                >
                  Social Media accounts
                </Link>
                <Link
                  to={"/home/help/analytics"}
                  className="block text-cyan-500 mt-2"
                >
                  Analytics
                </Link>
                <Link
                  to={"/home/help/brands"}
                  className="block text-cyan-500 mt-2"
                >
                  Brands
                </Link>
              </div>
              <div>
                <Link
                  to={"/home/help/campaign"}
                  className="block text-cyan-500 mt-2"
                >
                  Campaign
                </Link>
                <Link
                  to={"/home/help/payments"}
                  className="block text-cyan-500 mt-2"
                >
                  Payments
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Help;
