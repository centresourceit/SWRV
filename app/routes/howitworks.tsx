import { Footer } from "~/components/home/footer/footer";
import AboutPage from "~/components/about/about";
import { IntroNavBar } from "~/components/home/navbar/intronavbar";
import HowItWorks from "~/components/about/howitworks";
import { MyNavBar } from "~/components/home/navbar/mynavbar";
/**
 * Renders the "How It Works" page with a fixed navigation bar at the top, a section
 * explaining how the process works, and a footer at the bottom.
 * @returns {JSX.Element} - The rendered "How It Works" page.
 */
const howitworks = () => {
  return (
    <>
      <div className="fixed top-0 left-0 w-full z-50 bg-white">
        <MyNavBar></MyNavBar>
      </div>
      <div className="h-16"></div>
      <HowItWorks></HowItWorks>
      <Footer></Footer>
    </>
  );
};
export default howitworks;
