import { Footer } from "~/components/home/footer/footer";
import AboutPage from "~/components/about/about";
import { IntroNavBar } from "~/components/home/navbar/intronavbar";
import PP from "~/components/about/pp";
/**
 * Renders the PP component with a fixed navigation bar at the top, a spacer div, the PP component itself,
 * and a footer component at the bottom.
 * @returns {JSX.Element} - The rendered JSX elements.
 */
const pp = () => {
    return (
        <>
            <div className="fixed top-0 left-0 w-full z-50 bg-white">
                <IntroNavBar></IntroNavBar>
            </div>
            <div className="h-16"></div>
            <PP></PP>
            <Footer></Footer>
        </>
    );
}
export default pp;