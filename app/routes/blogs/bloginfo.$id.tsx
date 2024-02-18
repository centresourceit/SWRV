import { Footer } from "~/components/home/footer/footer";
import { IntroNavBar } from "~/components/home/navbar/intronavbar";
import BlogsInfo from "~/components/blogpage/bloginfo";
import { LoaderArgs, LoaderFunction, json } from "@remix-run/node";
import axios from "axios";
import { BaseUrl } from "~/const";
import { useLoaderData } from "@remix-run/react";
import { MyNavBar } from "~/components/home/navbar/mynavbar";

/**
 * Loader function that retrieves data from the server based on the provided props.
 * @param {LoaderArgs} props - The loader arguments containing the necessary parameters.
 * @returns A JSON response containing the retrieved data or an error flag.
 */
export const loader: LoaderFunction = async (props: LoaderArgs) => {
  const id = props.params.id;
  const nebdata = await axios.post(`${BaseUrl}/api/get-neb-byid`, { id: id });

  const blog = await axios.post(`${BaseUrl}/api/get-neb-bytype`, { type: 1 });
  if (nebdata.data.data[0].title == undefined) {
    return json({ nebdata: nebdata.data.data[0], error: true });
  } else {
    return json({
      nebdata: nebdata.data.data[0],
      error: false,
      blog: blog.data.data,
    });
  }
};

/**
 * Renders a blog page with the given data.
 * @returns {JSX.Element} - The rendered blog page.
 */
const blogs = () => {
  let data = useLoaderData();
  const blog = useLoaderData().blog[0];
  return (
    <>
      <div className="fixed top-0 left-0 w-full z-50 bg-white">
        <MyNavBar></MyNavBar>
      </div>
      <div className="h-16"></div>
      <BlogsInfo
        error={data.error}
        image={data.nebdata.imageUrl}
        title={data.nebdata.title}
        shorttitle={data.nebdata.titleDesc}
        description={data.nebdata.description}
        date={data.nebdata.dateTime}
        type={data.nebdata.type}
        relatedArtical={blog}
      ></BlogsInfo>
      <Footer></Footer>
    </>
  );
};
export default blogs;
