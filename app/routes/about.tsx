import { Footer } from "~/components/home/footer/footer";
import AboutPage from "~/components/about/about";
import { IntroNavBar } from "~/components/home/navbar/intronavbar";
import { LoaderArgs, LoaderFunction, json } from "@remix-run/node";
import axios from "axios";
import { BaseUrl } from "~/const";
import { useLoaderData } from "@remix-run/react";
import { MyNavBar } from "~/components/home/navbar/mynavbar";

export const loader: LoaderFunction = async (props: LoaderArgs) => {
  const team = await axios.post(`${BaseUrl}/api/get-team`);
  return json({ team: team.data.data });
};
/**
 * Renders the About page component with the team data.
 * @returns {JSX.Element} - The rendered About page component.
 */
const about = () => {
  let temadata = useLoaderData().team[0];
  return (
    <>
      <div className="fixed top-0 left-0 w-full z-50 bg-white">
        <MyNavBar></MyNavBar>
      </div>
      <div className="h-16"></div>
      <AboutPage teamdata={temadata}></AboutPage>
      <Footer></Footer>
    </>
  );
};
export default about;
