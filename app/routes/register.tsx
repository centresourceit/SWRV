import type { ActionArgs, LoaderArgs, LoaderFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useActionData, useLoaderData } from "@remix-run/react";
import axios from "axios";
import { IntroNavBar } from "~/components/home/navbar/intronavbar";
import { RegisterBox } from "~/components/user/register";
import { BaseUrl } from "~/const";
import { userPrefs } from "~/cookies";

/**
 * Loader function that handles requests and returns a JSON response.
 * @param {LoaderArgs} request - The request object containing the request details.
 * @returns {Promise<Response>} - A promise that resolves to a JSON response.
 */
export const loader: LoaderFunction = async ({ request }: LoaderArgs) => {
  const isBrand = new URL(request.url).searchParams.get("isBrand");
  const isInf = new URL(request.url).searchParams.get("isInf");
  let brand = isBrand == "1" ? true : false;
  let inf = isInf == "1" ? true : false;
  const cookieHeader = request.headers.get("Cookie");
  const cookie = await userPrefs.parse(cookieHeader);
  if (cookie) {
    if (cookie.isLogin) {
      return redirect("/home");
    }
  }
  return json({ brand: brand, inf: inf });
};

/**
 * Renders the registration page.
 * @returns {JSX.Element} - The JSX element representing the registration page.
 */
const Register = () => {
  const loaderData = useLoaderData();
  const data = useActionData();

  return (
    <div className="bg-[#eeeeee] min-h-screen h-full">
      <IntroNavBar></IntroNavBar>
      <RegisterBox
        isBrand={loaderData.brand ? true : false}
        message={data?.message}
      ></RegisterBox>
    </div>
  );
};

export default Register;

/**
 * Handles the registration action by processing the form data and making API requests.
 * @param {ActionArgs} request - The request object containing the form data.
 * @returns {Object} - An object containing the response message or redirect information.
 */
export const action = async ({ request }: ActionArgs) => {
  const formData = await request.formData();
  const value = Object.fromEntries(formData);

  if (value.email == "" || value.email == null || value.email == undefined) {
    return { message: "Enter valid Email Address " };
  }
  if (
    value.password == "" ||
    value.password == null ||
    value.password == undefined
  ) {
    return { message: "Enter the password" };
  }
  if (
    value.repassword == "" ||
    value.repassword == null ||
    value.repassword == undefined
  ) {
    return { message: "Enter the repassword" };
  }
  if (value.check1 != "on" || value.check2 != "on") {
    return { message: "Check and Confirm the agreement(s)" };
  }
  if (value.password != value.repassword) {
    return { message: "Password and Re-password should be same" };
  }

  let req: { [key: string]: string } = {};

  if (value.cat == "inf") {
    req = {
      email: value.email.toString(),
      password: value.password.toString(),
      "confirm-password": value.repassword.toString(),
      isBrand: "0",
      isInfluencer: "1",
    };
  }
  if (value.cat == "brand") {
    req = {
      email: value.email.toString(),
      password: value.password.toString(),
      "confirm-password": value.repassword.toString(),
      isBrand: "1",
      isInfluencer: "0",
    };
  }
  try {
    //registring the user
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

    if (apidata.data.status == false) {
      return { message: apidata.data.message };
    } else {
      //getting data and storing in cookies
      const userdata = await axios({
        method: "post",
        url: `${BaseUrl}/api/getuser`,
        data: { id: apidata.data.data.id },
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

      const sendverificationmail = await axios({
        method: "post",
        url: `${BaseUrl}/api/send-otp`,
        data: { userId: apidata.data.data.id },
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
      } else if (sendverificationmail.data.status == false) {
        return { message: sendverificationmail.data.message };
      } else {
        if (value.cat == "inf") {
          let userdatasave = userdata.data.data[0];
          delete userdatasave.languages;
          delete userdatasave.platforms;
          delete userdatasave.categories;
          delete userdatasave.market;

          return redirect(`/welcome/${userdata.data.data[0]["email"]}`, {
            headers: {
              "Set-Cookie": await userPrefs.serialize({
                user: userdatasave,
                isLogin: true,
              }),
            },
          });
        } else {
          let userdatasave = userdata.data.data[0];
          delete userdatasave.languages;
          delete userdatasave.platforms;
          delete userdatasave.categories;
          delete userdatasave.market;

          return redirect("/createbrand", {
            headers: {
              "Set-Cookie": await userPrefs.serialize({
                user: userdatasave,
                isLogin: true,
              }),
            },
          });
        }
      }
    }
  } catch (e) {
    return { message: e };
  }
};
