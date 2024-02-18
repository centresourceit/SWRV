import { Footer } from "~/components/home/footer/footer";
import AboutPage from "~/components/about/about";
import { IntroNavBar } from "~/components/home/navbar/intronavbar";
import WhatYouGet from "~/components/about/whatyouget";
import { MyNavBar } from "~/components/home/navbar/mynavbar";
/**
 * Renders the "About" page component.
 * @returns {JSX.Element} - The rendered "About" page component.
 */
const about = () => {
  return (
    <>
      <div className="fixed top-0 left-0 w-full z-50 bg-white">
        <MyNavBar></MyNavBar>
      </div>
      <div className="h-16"></div>
      <WhatYouGet></WhatYouGet>
      <Footer></Footer>
    </>
  );
};
export default about;
