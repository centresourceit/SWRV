import { Link, useNavigate } from "@remix-run/react";
import {
  faBars,
  faHome,
  faRemove,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { NavTab } from "../sidebar/sidebar";
import MobileNavStore from "~/state/home/mobilenavstate";
import Notification from "../notification";
import NotificationStore from "~/state/home/notification";
import SideBarNavStore, { SideBarTabs } from "~/state/navigation/sidebar";
import { Fa6SolidBinoculars, Fa6SolidEnvelopeOpen, Fa6SolidHandHoldingDollar, IcBaselineFavorite, IcSharpLogOut, IonIosHelpCircle, MaterialSymbolsFolder, MaterialSymbolsNotificationsRounded, MaterialSymbolsSupervisorAccountSharp, MdiAccountEdit, MdiHome, RiDraftFill } from "~/components/icons";

/**
 * Represents the properties of the main navigation bar component.
 * @typedef {Object} MainNavBarProps
 * @property {string} name - The name of the user.
 * @property {string} avatar - The URL of the user's avatar.
 * @property {string} role - The role of the user.
 * @property {boolean} isBrand - Indicates whether the user is a brand.
 * @property {string} id - The unique identifier of the user.
 */
type MainNavBarProps = {
  name: string;
  avatar: string;
  role: string;
  isBrand: boolean;
  id: string;
};

/**
 * Main navigation bar component that displays the navigation menu and options.
 * @param {MainNavBarProps} props - The props for the MainNavBar component.
 * @returns The rendered MainNavBar component.
 */
export const MainNavBar = (props: MainNavBarProps) => {
  const navigator = useNavigate();
  const currentPage = SideBarNavStore((state) => state.currentIndex);
  const sidebar = SideBarNavStore((state) => state.changeTab);
  const isOpen = MobileNavStore((state) => state.isOpen);
  const changMenu = MobileNavStore((state) => state.change);

  /**
   * Renders a navigation bar component with various tabs and icons.
   * @returns JSX element representing the navigation bar.
   */
  return (
    <>
      <div className="w-full grid place-items-center bg-[#eeeeee]">
        <div className="bg-white w-full rounded-2xl">
          <div className="w-full  flex px-4 items-center py-2 ">
            <div
              className="mr-4 md:hidden cursor-pointer"
              onClick={() => {
                changMenu(!isOpen);
              }}
            >
              <FontAwesomeIcon
                className="text-lg text-primary text-center font-bold"
                icon={isOpen ? faRemove : faBars}
              ></FontAwesomeIcon>
            </div>

            <div className="flex place-items-center rounded-xl items-end mr-4">
              <Link to={"/home/"}>
                <img
                  src="/images/swrvlogo.png"
                  className="w-28 h-14 inline-block rounded-lg"
                />
              </Link>
              <p className="text-primary text-xs pb-2 pl-1 font-thin">
                {props.role[0].toUpperCase() +
                  props.role.slice(1).toLowerCase()}
              </p>
            </div>
            <div className="grow"></div>
            <MainNavRight
              avatar={props.avatar}
              role={props.role}
              name={props.name}
              id={props.id}
            ></MainNavRight>
            <div
              // className="md:hidden block cursor-pointer"
              className="hidden cursor-pointer"
              onClick={() => {
                sidebar(SideBarTabs.None);
                navigator("/home");
              }}
            >
              <FontAwesomeIcon
                className="text-primary text-xl"
                icon={faHome}
              ></FontAwesomeIcon>
            </div>
          </div>
          {/* //mobie nav */}
          <div
            className={`w-full p-2 transition-all md:hidden ${isOpen ? "" : "hidden"
              } `}
          >
            <div className="w-full h-full bg-primary rounded-2xl flex flex-col items-start  py-8 px-3">
              <Link
                to={"/home"}
                onClick={() => {
                  sidebar(SideBarTabs.Home);
                  changMenu(false);
                }}
              >
                <NavTab
                  title="Home"
                  isOpen={true}
                  isActive={currentPage == SideBarTabs.Home}
                  icon={() => <MdiHome className="w-5 text-2xl" />}
                ></NavTab>
              </Link>
              <Link
                to={"/home/mycampaings"}
                onClick={() => {
                  sidebar(SideBarTabs.MyCampaigns);
                  changMenu(false);
                }}
              >
                <NavTab
                  title="My Campaigns"
                  isOpen={true}
                  isActive={currentPage == SideBarTabs.MyCampaigns}
                  icon={() => <MaterialSymbolsFolder className="w-5 text-2xl" />}
                ></NavTab>
              </Link>
              <Link
                to={"/home/findcampaign"}
                onClick={() => {
                  sidebar(SideBarTabs.FindCampaigns);
                  changMenu(false);
                }}
              >
                <NavTab
                  title={props.isBrand ? "Find Influencers" : "Campaign Search"}
                  isOpen={true}
                  isActive={currentPage == SideBarTabs.FindCampaigns}
                  icon={() => <Fa6SolidBinoculars className="w-5 text-2xl" />}
                ></NavTab>
              </Link>
              <Link
                to={"/home/inbox"}
                onClick={() => {
                  sidebar(SideBarTabs.Inbox);
                  changMenu(false);
                }}
              >
                <NavTab
                  title="Inbox"
                  isOpen={true}
                  isActive={currentPage == SideBarTabs.Inbox}
                  icon={() => <Fa6SolidEnvelopeOpen className="w-5" />}
                ></NavTab>
              </Link>
              {props.isBrand ? null : (
                <>
                  <Link
                    to={"/home/revenues"}
                    onClick={() => {
                      sidebar(SideBarTabs.MyEarnings);
                      changMenu(false);
                    }}
                  >
                    <NavTab
                      title="My earnings"
                      isOpen={true}
                      isActive={currentPage == SideBarTabs.MyEarnings}
                      icon={() => <Fa6SolidHandHoldingDollar className="w-5" />}
                    ></NavTab>
                  </Link>
                  <Link
                    to={"/home/drafts"}
                    onClick={() => {
                      sidebar(SideBarTabs.Drafts);
                      changMenu(false);
                    }}
                  >
                    <NavTab
                      title="Drafts"
                      isOpen={true}
                      isActive={currentPage == SideBarTabs.Drafts}
                      icon={() => <RiDraftFill className="w-5" />}
                    ></NavTab>
                  </Link>
                  <Link
                    to={"/home/favourite"}
                    onClick={() => {
                      sidebar(SideBarTabs.Favourite);
                      changMenu(false);
                    }}
                  >
                    <NavTab
                      title="Favourite"
                      isOpen={true}
                      isActive={currentPage == SideBarTabs.Favourite}
                      icon={() => <IcBaselineFavorite className="w-5" />}
                    ></NavTab>
                  </Link>
                </>
              )}
              <Link
                to={"/home/invite"}
                onClick={() => {
                  sidebar(SideBarTabs.Invite);
                  changMenu(false);
                }}
              >
                <NavTab
                  title="Invite"
                  isOpen={true}
                  isActive={currentPage == SideBarTabs.Invite}
                  icon={() => <MaterialSymbolsSupervisorAccountSharp className="w-5 text-2xl" />}
                ></NavTab>
              </Link>
              <Link
                to={"/home/profilecomplete"}
                onClick={() => {
                  sidebar(SideBarTabs.EditProfile);
                  changMenu(false);
                }}
              >
                <NavTab
                  title="Edit Profile"
                  isOpen={true}
                  isActive={currentPage == SideBarTabs.EditProfile}
                  icon={() => <MdiAccountEdit className="w-5 text-2xl" />}
                ></NavTab>
              </Link>


              <Link
                to={"/home/help"}
                onClick={() => {
                  sidebar(SideBarTabs.Help);
                  changMenu(false);
                }}
              >
                <NavTab
                  title="Help"
                  isOpen={true}
                  isActive={currentPage == SideBarTabs.Help}
                  icon={() => <IonIosHelpCircle className="w-5 text-2xl" />}
                ></NavTab>
              </Link>
              <Link to={"/logout"}>
                <NavTab
                  title="Logout"
                  isOpen={true}
                  isActive={currentPage == SideBarTabs.None}
                  icon={() => <IcSharpLogOut className="w-5" />}
                ></NavTab>
              </Link>
            </div>
          </div>
        </div>
        <div className="h-1 bg-[#eeeeee] w-full"></div>
      </div>
    </>
  );
};

/**
 * Represents the properties for the MainNavRight component.
 * @typedef {Object} MainNavRightProps
 * @property {string} name - The name of the user.
 * @property {string} avatar - The URL of the user's avatar.
 * @property {string} role - The role of the user.
 * @property {string} id - The unique identifier of the user.
 */
type MainNavRightProps = {
  name: string;
  avatar: string;
  role: string;
  id: string;
};

/**
 * Renders the right section of the main navigation bar.
 * @param {MainNavRightProps} props - The props for the component.
 * @returns The JSX element representing the right section of the main navigation bar.
 */
const MainNavRight = (props: MainNavRightProps) => {

  const open = NotificationStore((state) => state.isOpen);
  const changeNotification = NotificationStore((state) => state.change);

  const role = props.role == "BRAND" ? "Admin" : "";
  const name = props.name.split("@")[0];
  const avatar =
    props.avatar == "0" ||
      props.avatar == null ||
      props.avatar == undefined ||
      props.avatar == ""
      ? "/images/avatar/user.png"
      : props.avatar;
  return (
    <>
      <div className="flex items-center gap-3">
        {/* <div className="grid place-items-center relative">
          <div
            className="cursor-pointer"
            onClick={() => {
              sidebar(SideBarTabs.None);
              navigator("/home");
            }}
          >
            <FontAwesomeIcon
              className="text-primary text-xl"
              icon={faHome}
            ></FontAwesomeIcon>
          </div>
        </div> */}
        {/* <div className="w-4"></div> */}
        <div className="grid place-items-center relative">
          <div
            onClick={() => changeNotification(!open)}
            className="cursor-pointer grid place-items-center pt-1"
          >
            <MaterialSymbolsNotificationsRounded
              className="text-primary text-xl"
            ></MaterialSymbolsNotificationsRounded>
          </div>
          <Notification userid={props.id}></Notification>
        </div>
        <div className="h-10 mx-3 bg-primary w-[1px] hidden sm:block"> </div>
        {/* <Link to={`/home/profileedit/${props.id}`} className="flex items-center"> */}
        {/* <Link to={`/home/profilecomplete`} className="flex items-center"> */}
        <p className="text-left text-md text-black font-normal">{name}</p>
        <img
          src={avatar}
          alt="user avatar"
          className="w-10 h-10 rounded object-cover mx-2 hidden sm:block"
        />
        {/* </Link> */}
      </div>
    </>
  );
};
