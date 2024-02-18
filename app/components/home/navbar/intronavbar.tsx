import { Link, NavLink } from "@remix-run/react";
import { LoginButton, NavLinks } from "./navbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faRemove } from "@fortawesome/free-solid-svg-icons";
import IntroNavStore from "~/state/home/intronavstate";
/**
 * Renders the navigation bar component for the introduction page.
 * @returns The JSX element representing the navigation bar.
 */
export const IntroNavBar = () => {
  const isOpen = IntroNavStore((state) => state.isOpen);
  const changMenu = IntroNavStore((state) => state.change);

  /**
   * Renders a navigation bar component with a logo, menu button, navigation links, and a login button.
   * @returns JSX element representing the navigation bar component.
   */
  return (
    <>
      <div className="w-full grid place-items-center px-6 ">
        <div className="w-full m-2 flex flex-row bg-white rounded-md p-2 px-6 shadow-lg items-center">
          <div
            className="mr-4 grid place-items-center md:hidden cursor-pointer"
            onClick={() => {
              changMenu(!isOpen);
            }}
          >
            <FontAwesomeIcon
              className="text-lg text-primary text-center font-bold"
              icon={isOpen ? faRemove : faBars}
            ></FontAwesomeIcon>
          </div>
          <div className="grid place-items-center mr-10">
            <Link to={"/"}>
              <img src="/images/swrvlogo.png" className="w-32 lg:w-38" />
            </Link>
          </div>
          <div className="grow"></div>
          <div className="place-content-center hidden md:grid">
            <NavLinks></NavLinks>
          </div>
          <div className="grow"></div>

          <LoginButton></LoginButton>
        </div>
        <div className={`${isOpen ? "block" : "hidden"} md:hidden `}>
          <NavLinks></NavLinks>
        </div>
      </div>
    </>
  );
};
