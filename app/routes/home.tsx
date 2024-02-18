import { LoaderArgs, LoaderFunction, json } from "@remix-run/node";
import { Outlet, useLoaderData, useNavigate } from "@remix-run/react";
import { useEffect, useState } from "react";
import { HomeFooter } from "~/components/home/footer/homefooter";
import { MainNavBar } from "~/components/home/navbar/mainnavbar";
import { SideBar } from "~/components/home/sidebar/sidebar";
import { userPrefs } from "~/cookies";
import SideBarStore from "~/state/home/sidebarstate";

export const loader: LoaderFunction = async (props: LoaderArgs) => {
  const cookieHeader = props.request.headers.get("Cookie");
  const cookie = await userPrefs.parse(cookieHeader);
  return json({ user: cookie.user });
};

/**
 * The HomePage component renders the main page of the application.
 * It retrieves user data using the useLoaderData hook and determines if the user is a brand or not.
 * It also manages the state of the sidebar, navigation, and loading status.
 * The component includes an initialization function that sets a loading state for 2 seconds.
 * It also includes an effect that checks the user's status and email verification and redirects accordingly.
 * The component renders a layout with a sidebar, main navigation bar, content area, and footer.
 * If the loading state is true, a loading spinner is displayed.
 * @returns The rendered JSX elements for the HomePage component.
 */
const HomePage = () => {
  const userdata = useLoaderData();

  const isbrand = userdata.user.role.code != 10;
  const isOpen = SideBarStore((state) => state.isOpen);
  const navigator = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(true);


  /**
   * Initializes the application by setting a timeout to update the isLoading state after 2 seconds.
   * @returns None
   */
  const init = async () => {

    setTimeout(() => {
      setIsLoading((val: boolean) => false);
    }, 2000);

  }
  useEffect(() => {
    if (userdata.user.status.code == "0" || userdata.user.status.code == 0) {
      navigator("/sorrytwo");
    }
    if (userdata.user.emailVerified == null || userdata.user.emailVerified == undefined || userdata.user.emailVerified == "") {
      navigator("/sorry");
    }
    init();
  }, []);
  return (
    <>
      <div className={`md:relative bg-background ${isLoading ? "hidden" : "flex"}`}>
        <SideBar isBrand={isbrand}></SideBar>
        <div
          className={`w-full min-h-screen transition-all  relative md:relative ${isOpen ? "md:ml-60" : "md:ml-20"
            }  p-2 pr-4`}
        >
          <div className="fixed h-6 top-0 left-0 w-full bg-[#eeeeee] z-[500]"></div>
          <div className={`fixed top-0 left-0 w-full my-4 mx-2 pr-6 z-[600]  ${isOpen ? "md:pl-60" : "md:pl-20"}`}>
            <MainNavBar
              isBrand={isbrand}
              name={userdata.user.userName}
              role={userdata.user.role.name}
              avatar={userdata.user.pic}
              id={userdata.user.id}
            ></MainNavBar>
          </div>
          {/* main section start here */}
          <div className="relative min-h-full">
            <div className="h-10 bg-[#eeeeee] w-full fixed top-0 left-0"></div>
            <div className="pb-28 sm:pb-16 relative">
              <div className="h-20"></div>
              <Outlet />
            </div>
            <div className="w-full absolute bottom-0 left-0 h-28 sm:h-16 grid place-items-center">
              <HomeFooter></HomeFooter>
            </div>
          </div>
          {/* main section end here */}
        </div>
      </div>

      <div className={`h-screen w-full fixed top-0 left-0 bg-white z-[900] transition-all delay-1000 grid place-items-center  ${isLoading ? "translate-x-0 opacity-100" : "opacity-0 translate-x-[100%]"}`}>
        <div className="w-80 h-80"><img src="/images/loader.gif" alt="loader" className="w-full h-full object-cover object-center" /></div>
      </div>

    </>
  );
};
export default HomePage;
