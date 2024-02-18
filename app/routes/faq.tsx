import { Footer } from "~/components/home/footer/footer";
import AboutPage from "~/components/about/about";
import { IntroNavBar } from "~/components/home/navbar/intronavbar";
import PP from "~/components/about/pp";
import FAQ from "~/components/about/faq";
/**
 * Renders the main page layout, including the introduction navigation bar, FAQ section, and footer.
 * @returns {JSX.Element} - The rendered JSX elements.
 */
const pp = () => {
    return (
        <>
            <IntroNavBar></IntroNavBar>
            <FAQ></FAQ>
            <Footer></Footer>
        </>
    );
}
export default pp;