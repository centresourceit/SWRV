import { Footer } from "~/components/home/footer/footer";
import AboutPage from "~/components/about/about";
import { IntroNavBar } from "~/components/home/navbar/intronavbar";
import { LoaderArgs, LoaderFunction, json } from "@remix-run/node";
import axios from "axios";
import { BaseUrl } from "~/const";
import { useLoaderData } from "@remix-run/react";
import { MyNavBar } from "~/components/home/navbar/mynavbar";
import { TeamCard } from "~/components/utils/teamcard";

export const loader: LoaderFunction = async (props: LoaderArgs) => {
  const id = props.params.id;
  const brand = await axios.post(`${BaseUrl}/api/get-top-brands`);
  return json({ brand: brand.data.data });
};
/**
 * Renders the media section of the SWRV influencer platform page.
 * @returns JSX elements representing the media section.
 */
const media = () => {
  let mediadata = useLoaderData().brand;
  return (
    <>
      <MyNavBar></MyNavBar>
      <div className="w-full px-6 sm:px-16">
        <div className="bg-[#EFEFEF] w-full my-10 rounded-xl md:p-0 p-6 pb-40">
          <div className="w-full md:w-3/5 lg:w-4/6 mx-auto mb-10  md:py-60 md:pt-20">
            <h3 className="text-primary text-3xl font-bold">
              About SWRV influencer platform
            </h3>
            <p className="text-md font-semibold text-primary mt-6">
              Founded in 2016, SWRV is a private media company based in
              Copenhagen, Denmark. The company specializes in producing how-to
              guides, courses and research reports in the social media and
              influencer marketing industry. The firm is home to one of the
              world's largest community of influencers and works with leading
              brands to leverage the power of influencer marketing with over 5
              million monthly unique users.
            </p>
          </div>
        </div>
        <div className="flex gap-2 items-center justify-center -translate-y-40">
          <div>
            <img src="/images/inf/inf8.png" alt="error" />
          </div>
          <div className="flex gap-2 flex-col">
            <div>
              <img src="/images/inf/inf14.png" alt="error" />
            </div>{" "}
            <div>
              <img src="/images/inf/inf13.png" alt="error" />
            </div>
          </div>
          <div>
            <img src="/images/inf/inf12.png" alt="error" />
          </div>
          <div className="flex gap-2 flex-col">
            <div>
              <img src="/images/inf/inf11.png" alt="error" />
            </div>{" "}
            <div>
              <img src="/images/inf/inf10.png" alt="error" />
            </div>
          </div>
          <div>
            <img src="/images/inf/inf9.png" alt="error" />
          </div>
        </div>
        <div className="w-full md:w-3/5 lg:w-4/6 mx-auto mb-10  py-8">
          <h3 className="text-primary text-3xl font-bold">
            We assist the influencer marketing sector in
          </h3>
          <h3 className="text-secondary text-3xl font-bold">
            becoming more efficient.
          </h3>
          <p className="text-md font-light text-gray-600 mt-10">
            SWRV is a Danir AB project. Sigma, a major IT consulting
            organisation with 6,000 workers in 13 countries, is our sibling
            company. SWRV AB began as a celebrity app in 2011. The company
            expanded abroad, attracting hundreds of celebrities, bloggers, and
            users every day.
            <br />
            <br />
            United Influencers, the largest influencer marketing agency in
            Scandinavia, was launched in 2014. United Influencers, which has
            operations in Sweden and Norway, has run over 2,000 campaigns to
            date.
            <br />
            <br />
            SWRV has worked with dedicated developers for the past six years to
            create a full IT platform for influencer marketing. The goal was to
            assist United Influencers in lowering expenses, increasing income,
            and working more efficiently.
            <br />
            <br />
            We learned in September 2015 that numerous firms may utilise the
            same IT platform and save a lot of money. Furthermore, unified IT
            development is a critical business enabler for the industry's
            expansion. SWRV was conceived as an idea.
            <br />
            <br /> SWRV has grown to include members from Europe, Asia,
            Australia, and the United States since its inception in March 2018.
          </p>
        </div>

        <div className="bg-[#0000004C] w-full my-10 rounded-xl md:p-0 p-6">
          <div className="w-full md:w-3/5 lg:w-4/6 mx-auto mb-10  py-10">
            <h3 className="text-white text-3xl font-bold">
              Mission Statement:
            </h3>

            <p className="text-md font-semibold text-white mt-4">
              SWRV aims to provide the most comprehensive reviews of marketing
              software and services globally, enabling brands and marketing
              decision makers to make smarter decisions around their marketing
              stack.
            </p>
          </div>
        </div>

        <div className="w-full md:w-3/5 lg:w-4/6 mx-auto mb-10  py-8">
          <div className="h-[1px] bg-gray-600 w-full my-2"></div>
          <div className="grid xl:grid-cols-3 grid-cols-1 lg:grid-cols-2 justify-center place-items-center">
            {mediadata.map((val: any, index: number) => {
              return (
                <div key={index}>
                  <div
                    className={`w-64 text-left shadow-xl rounded-xl pb-4 m-4`}
                  >
                    <img
                      src={val.logo}
                      alt="err"
                      className="w-full rounded-md object-cover object-center h-56"
                    />
                    <h1 className="text-xl font-bold text-primary text-center mt-2">
                      {val.name.toString().split("@")[0]} [{val.code}]
                    </h1>
                    <h1 className="text-md font-bold text-primary text-center">
                      {val.email}
                    </h1>
                   
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <Footer></Footer>
    </>
  );
};
export default media;
