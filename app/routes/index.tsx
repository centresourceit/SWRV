import { Footer } from "~/components/home/footer/footer";
import { HomeIntro } from "~/components/homepage/homeintro";
import type { LoaderArgs, LoaderFunction} from "@remix-run/node";
import { json } from "@remix-run/node";
import { BaseUrl } from "~/const";
import axios from "axios";
import { useLoaderData } from "@remix-run/react";
import { MyNavBar } from "~/components/home/navbar/mynavbar";



/**
 * Loader function that retrieves data from the server using axios.
 * @param {LoaderArgs} props - The loader arguments.
 * @returns {Promise} A promise that resolves to an object containing the retrieved data.
 */
export const loader: LoaderFunction = async (props: LoaderArgs) => {

  const blog = await axios.post(`${BaseUrl}/api/get-neb-bytype`, { type: 1 });
  const home = await axios.post(`${BaseUrl}/api/get-home`);

  return json({ blog: blog.data.data, home: home.data.data });

};

/**
 * Renders the index page with the appropriate components and data.
 * @returns {JSX.Element} - The rendered index page.
 */
const Index = () => {
  let blogdata = useLoaderData().blog[0];
  let homedata = useLoaderData().home[0];

  return (
    <>
      <div>
        <div className="fixed top-0 left-0 w-full z-50 bg-white">
          <MyNavBar></MyNavBar>
        </div>
        <div className="h-16"></div>
        <HomeIntro blogdata={blogdata} homedata={homedata}></HomeIntro>
        <Footer></Footer>
      </div>
    </>
  );
};
export default Index;
