import { Footer } from "~/components/home/footer/footer";
import AboutPage from "~/components/about/about";
import { IntroNavBar } from "~/components/home/navbar/intronavbar";
import Tos from "~/components/about/tos";
/**
 * Renders the Terms of Service page.
 * @returns {JSX.Element} - The rendered Terms of Service page.
 */
const tos = () => {
    return (
        <>

            <div className="fixed top-0 left-0 w-full z-50 bg-white">
                <IntroNavBar></IntroNavBar>
            </div>
            <div className="h-16"></div>
            <Tos></Tos>
            <Footer></Footer>
        </>
    );
}
export default tos;