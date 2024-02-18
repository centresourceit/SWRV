import { Link, useActionData } from "@remix-run/react";
import { MainFooter } from "~/components/home/footer/mainfooter";
import { IntroNavBar } from "~/components/home/navbar/intronavbar";
import { LoginBox } from "~/components/user/login";
import * as EmailValidator from "email-validator";
import { ActionArgs, LoaderArgs, redirect } from "@remix-run/node";
import axios from "axios";
import { BaseUrl } from "~/const";
import { userPrefs } from "~/cookies";

/**
 * Renders a login component with a specific layout and content.
 * @returns {JSX.Element} - The rendered login component.
 */
const login = () => {
  const data = useActionData();
  return (
    <>
      <div className="flex flex-col min-h-screen bg-[#eeeeee]">
        <div className="z-50">
          <IntroNavBar></IntroNavBar>
        </div>
        <LoginBox message={data?.message}></LoginBox>
        <div className="grow"></div>
        <div className="w-full flex py-6 px-8">
          <div className="flex flex-col sm:flex-row justify-end content-center items-center w-full">
            <div>
              <Link to={"/about"} className="text-sm text-gray-600 text-center px-4 font-normal">About</Link>
            </div>
            <div>
              <Link to={"/tos"} className="text-sm text-gray-600 text-center px-4 font-normal">Terms of use</Link>
            </div>
            <div>
              <Link to={"/pp"} className="text-sm text-gray-600 text-center px-4 font-normal">Privacy policy</Link>
            </div>
            <div>
              <Link to={"/"} className="text-sm text-gray-600 text-center px-4 font-normal">Cookie policy</Link>
            </div>
            <div>
              <Link to={"/"} className="text-sm text-gray-600 text-center px-4 font-normal">FAQ</Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

/**
 * Loader function that handles incoming requests and performs necessary actions based on the request headers.
 * @param {LoaderArgs} request - The request object containing information about the incoming request.
 * @returns {Promise<null>} - A promise that resolves to null.
 */
export async function loader({ request }: LoaderArgs) {
  const cookieHeader = request.headers.get("Cookie");
  const cookie = await userPrefs.parse(cookieHeader);
  if (cookie) {
    if (cookie.isLogin) {
      return redirect("/home");
    }
  }
  return null;
}

/**
 * Performs a login action by sending a POST request to the login API endpoint with the provided email and password.
 * If the login is successful, it retrieves user data from the getuser API endpoint and saves it to the user preferences.
 * Finally, it redirects the user to the home page with the updated user preferences.
 * @param {ActionArgs} request - The request object containing the form data.
 * @returns {Object} - An object containing a message or a redirect response.
 */
export const action = async ({ request }: ActionArgs) => {

  const formData = await request.formData();
  const value = Object.fromEntries(formData);
  if (
    value.email == null ||
    value.email == "" ||
    !EmailValidator.validate(value.email.toString()) ||
    value.email == undefined
  ) {
    return { message: "Enter valid Email Address." };
  }
  if (
    value.password == "" ||
    value.password == null ||
    value.password == undefined
  ) {
    return { message: "Enter the password" };
  }

  try {
    const data = await axios.post(`${BaseUrl}/api/login`, {
      email: value.email,
      password: value.password,
    });
    if (data.data.status == false) {
      return { message: data.data.message };
    } else {
      const userdata = await axios({
        method: "post",
        url: `${BaseUrl}/api/getuser`,
        data: { id: data.data.data.id },
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
  } catch (e) {
    return { message: e };
  }
};
export default login;
