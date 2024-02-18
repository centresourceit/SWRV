import { NavLink } from "@remix-run/react";
import IntroNavStore from "~/state/home/intronavstate";
import { Fa6SolidArrowRightToBracket } from "~/components/icons";
/**
 * A functional component that represents a navigation bar.
 * @returns {JSX.Element} - The JSX element representing the navigation bar.
 */
export const NavBar = () => {
  /**
   * Renders a header component with a logo, navigation links, and a login button.
   * @returns JSX element representing the header component.
   */
  return (
    <>
      <div className="w-full grid place-items-center p-4">
        <div className="w-full  flex flex-col lg:flex-row px-4 md:px-16 items-center shadow-xl rounded-xl bg-white py-2">
          <div className="flex place-items-center rounded-xl items-end mr-6 w-60 ">
            <NavLink to={"/"}>
              <img
                src="/images/swrvlogo.png"
                className="w-32 lg:w-38 inline-block"
              />
            </NavLink>
            <p>Barnd</p>
          </div>
          <div className="hidden lg:block  lg:grow"></div>
          <NavLinks></NavLinks>
          <div className="hidden lg:block  lg:grow"></div>
          <LoginButton></LoginButton>
        </div>
      </div>
    </>
  );
};

/**
 * A functional component that renders a navigation menu with links to different pages.
 * @returns The rendered JSX elements for the navigation menu.
 */
export const NavLinks = () => {
  const changMenu = IntroNavStore((state) => state.change);
  const closeMenu = () => {
    changMenu(false);
  };
  /**
   * Renders a navigation menu with links to different pages.
   * @param {function} closeMenu - The function to close the menu.
   * @returns {JSX.Element} - The rendered navigation menu.
   */
  return (
    <>
      <div className="grid place-items-center my-4 md:my-0">
        <div
          className={`flex flex-col items-center gap-y-6 md:flex-row text-primary font-semibold text-sm`}
        >
          <NavLink
            onClick={() => closeMenu}
            to="/whatyouget"
            className={"px-2"}
          >
            What you get
          </NavLink>
          <NavLink
            onClick={() => closeMenu}
            to="/howitworks"
            className={"px-2"}
          >
            How it works
          </NavLink>
          <NavLink onClick={() => closeMenu} to="/about" className={"px-2"}>
            About
          </NavLink>
          <NavLink onClick={() => closeMenu} to="/contact" className={"px-2"}>
            Contact
          </NavLink>
          <NavLink onClick={() => closeMenu} to="/blogs" className={"px-2"}>
            Blogs
          </NavLink>
        </div>
      </div>
    </>
  );
};

/**
 * Renders a login button component.
 * @returns {JSX.Element} - The rendered login button component.
 */
export const LoginButton = () => {
  return (
    <NavLink to={"/login"} className={"bg-primary py-2 px-4 shrink-0 rounded-md inline-block text-white text-md font-normar cursor-pointer"}>
      Log in
    </NavLink>
  );
};
/**
 * A login button component that renders a button with a link to the login page.
 * @returns {JSX.Element} - The rendered login button component.
 */
export const LoginButton1 = () => {
  /**
   * Renders a login button with a right arrow icon and text.
   * @returns {JSX.Element} - The rendered login button.
   */
  return (
    <div className="grid place-items-center py-10 lg:p-0">
      <NavLink to={"/login"} className={"flex gap-2 items-center"}>
        <Fa6SolidArrowRightToBracket className="text-primary" />
        <div className={`text-black text-md font-normar cursor-pointer`}>
          Log in
        </div>
      </NavLink>
    </div>
  );
};
