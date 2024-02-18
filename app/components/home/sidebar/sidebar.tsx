import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "@remix-run/react";
import { useEffect } from "react";
import { Fa6SolidBinoculars, Fa6SolidEnvelopeOpen, Fa6SolidHandHoldingDollar, IcBaselineFavorite, IcSharpLogOut, IonIosHelpCircle, MaterialSymbolsFolder, MaterialSymbolsSupervisorAccountSharp, MdiAccountEdit, MdiHome, RiDraftFill } from "~/components/icons";
import SideBarStore from "~/state/home/sidebarstate";
import SideBarNavStore, { SideBarTabs } from "~/state/navigation/sidebar";
type SideBarProps = {
  isBrand: boolean;
};

/**
 * A functional component that represents a sidebar navigation menu.
 * @param {SideBarProps} props - The props for the sidebar component.
 * @returns The rendered sidebar component.
 */
export const SideBar = (props: SideBarProps) => {
  const currentPage = SideBarNavStore((state) => state.currentIndex);
  const sidebar = SideBarNavStore((state) => state.changeTab);
  const isOpen = SideBarStore((state) => state.isOpen);
  const changeSidebar = SideBarStore((state) => state.change);

  useEffect(() => {
    changeSidebar(true);
  }, []);
  /**
   * Renders a sidebar component with navigation tabs for different sections of the application.
   * @returns JSX element representing the sidebar component.
   */
  return (
    <>
      <div
        className={` ${isOpen ? "w-60" : "w-20"
          } h-screen p-2 fixed top-0 left-0 md:block hidden z-[800] transition-all duration-200 `}
      >
        <div className="w-full h-full bg-primary rounded-2xl flex flex-col py-8 px-3 overflow-y-scroll no-scrollbar">
          <div
            onClick={() => {
              changeSidebar(!isOpen);
            }}
            className="w-full flex cursor-pointer"
          >
            <div className="grow"></div>
            <div
              className={`w-10 h-10 rounded-xl grid place-items-center text-white text-lg font-bold my-1 bg-[#053497] `}
            >
              {" "}
              <FontAwesomeIcon
                icon={isOpen ? faChevronLeft : faChevronRight}
              ></FontAwesomeIcon>{" "}
            </div>
          </div>
          <Link
            to={"/home"}
            onClick={() => {
              sidebar(SideBarTabs.Home);
              changeSidebar(false);
            }}
          >
            <NavTab
              title="Home"
              isOpen={isOpen}
              isActive={currentPage === SideBarTabs.Help}
              icon={() => <MdiHome className="w-5 text-2xl" />}
            ></NavTab>
          </Link>
          <Link
            to={"/home/mycampaings"}
            onClick={() => {
              sidebar(SideBarTabs.MyCampaigns);
              changeSidebar(false);
            }}
          >
            <NavTab
              title="My Campaigns"
              isOpen={isOpen}
              isActive={currentPage === SideBarTabs.MyCampaigns}
              icon={() => <MaterialSymbolsFolder className="w-5 text-2xl" />}
            ></NavTab>
          </Link>

          {props.isBrand ? null :
            <Link
              to={"/home/findcampaign"}
              onClick={() => {
                sidebar(SideBarTabs.FindCampaigns);
                changeSidebar(false);
              }}
            >
              <NavTab
                title={props.isBrand ? "Find Influencers" : "Campaign Search"}
                isOpen={isOpen}
                isActive={currentPage === SideBarTabs.FindCampaigns}
                icon={() => <Fa6SolidBinoculars className="w-5 text-2xl" />}
              ></NavTab>
            </Link>
          }
          <Link
            to={"/home/inbox"}
            onClick={() => {
              sidebar(SideBarTabs.Inbox);
              changeSidebar(false);
            }}
          >
            <NavTab
              title="Inbox"
              isOpen={isOpen}
              isActive={currentPage === SideBarTabs.Inbox}
              icon={() => <Fa6SolidEnvelopeOpen className="w-5" />}
            ></NavTab>
          </Link>

          {/* only for influencer options */}
          {props.isBrand ? null : (
            <>
              <Link
                to={"/home/revenues"}
                onClick={() => {
                  sidebar(SideBarTabs.MyEarnings);
                  changeSidebar(false);
                }}
              >
                <NavTab
                  title="My earnings"
                  isOpen={isOpen}
                  isActive={currentPage === SideBarTabs.MyEarnings}
                  icon={() => <Fa6SolidHandHoldingDollar className="w-5" />}
                ></NavTab>
              </Link>
              <Link
                to={"/home/drafts"}
                onClick={() => {
                  sidebar(SideBarTabs.Drafts);
                  changeSidebar(false);
                }}
              >
                <NavTab
                  title="Drafts"
                  isOpen={isOpen}
                  isActive={currentPage === SideBarTabs.Drafts}
                  icon={() => <RiDraftFill className="w-5" />}
                ></NavTab>
              </Link>
              <Link
                to={"/home/favourite"}
                onClick={() => {
                  sidebar(SideBarTabs.Favourite);
                  changeSidebar(false);
                }}
              >
                <NavTab
                  title="Favourite"
                  isOpen={isOpen}
                  isActive={currentPage === SideBarTabs.Favourite}
                  icon={() => <IcBaselineFavorite className="w-5" />}
                ></NavTab>
              </Link>
            </>
          )}

          <Link
            to={"/home/invite"}
            onClick={() => {
              sidebar(SideBarTabs.Invite);
              changeSidebar(false);
            }}
          >
            <NavTab
              title="Invite"
              isOpen={isOpen}
              isActive={currentPage === SideBarTabs.Invite}
              icon={() => <MaterialSymbolsSupervisorAccountSharp className="w-5 text-2xl" />}
            ></NavTab>
          </Link>
          <div className="grow"></div>
          <Link
            to={"/home/profilecomplete"}
            onClick={() => {
              sidebar(SideBarTabs.EditProfile);
              changeSidebar(false);
            }}
          >
            <NavTab
              title="Edit Profile"
              isOpen={isOpen}
              isActive={currentPage === SideBarTabs.EditProfile}
              icon={() => <MdiAccountEdit className="w-5 text-2xl" />}
            ></NavTab>
          </Link>
          <Link
            to={"/home/help"}
            onClick={() => {
              sidebar(SideBarTabs.Help);
              changeSidebar(false);
            }}
          >
            <NavTab
              title="Help"
              isOpen={isOpen}
              isActive={currentPage === SideBarTabs.Help}
              icon={() => <IonIosHelpCircle className="w-5 text-2xl" />}
            ></NavTab>
          </Link>
          <Link to={"/logout"}>
            <NavTab
              title="Logout"
              isOpen={isOpen}
              isActive={currentPage === SideBarTabs.None}
              icon={() => <IcSharpLogOut className="w-5" />}
            ></NavTab>
          </Link>
        </div>
      </div>
    </>
  );
};

/**
 * Represents the properties of a navigation tab component.
 * @typedef {Object} NavTabProps
 * @property {() => JSX.Element} icon - A function that returns the JSX element for the tab icon.
 * @property {boolean} isActive - Indicates whether the tab is currently active.
 * @property {boolean} isOpen - Indicates whether the tab is currently open.
 * @property {string} title - The title of the tab.
 * @property {(e: Event) => void} [fun] - An optional function to be called when the tab is clicked.
 */
type NavTabProps = {
  icon: () => JSX.Element;
  isActive: boolean;
  isOpen: boolean;
  title: string;
  fun?: (e: Event) => void;
};

/**
 * A functional component that represents a navigation tab.
 * @param {NavTabProps} props - The props for the NavTab component.
 * @returns {JSX.Element} - The rendered NavTab component.
 */
export const NavTab = (props: NavTabProps) => {
  /**
   * Renders a custom div component with dynamic styling based on the provided props.
   * @param {Object} props - The props object containing the following properties:
   *   - isOpen: A boolean indicating whether the div is open or closed.
   *   - isActive: A boolean indicating whether the div is active or inactive.
   *   - icon: A function that returns the icon component to be rendered.
   *   - title: The title text to be displayed.
   * @returns {JSX.Element} - The rendered div component.
   */
  return (
    <>
      <div
        className={`overflow-hidden ${props.isOpen ? "w-full" : "w-10"} h-10 rounded-xl ${props.isOpen ? "flex items-center " : "grid place-items-center"
          }  text-white text-lg font-bold my-1 ${props.isActive ? "bg-[#053497]" : ""
          } ${props.isOpen ? "px-4" : ""}`}
      >
        {" "}
        {props.icon()}
        {props.isOpen ? (
          <p className="ml-4 font-normal shrink-0 text-md">{props.title}</p>
        ) : null}{" "}
      </div>
    </>
  );
};
