import { CusButton } from "../utils/buttont";
import { MarkatingCard } from "../utils/markatingcard";
import { CategoryCard } from "../utils/categorycard";
import { BlogsCard } from "../utils/blogscard";
import { DownloadApp } from "../utils/downloadapp";
import { Link } from "@remix-run/react";
import { useState } from "react";
type HomeIntroProps = {
  blogdata: any[];
  homedata: any;
};
export const HomeIntro: React.FC<HomeIntroProps> = (
  props: HomeIntroProps
): JSX.Element => {
  /**
   * Renders the home page with various sections and their corresponding text data.
   * @param {object} props - The props object containing the home data and blog data.
   * @returns The JSX elements representing the home page.
   */
  return (
    <>
      <div className="w-full px-2 sm:px-16">
        <HomeFirst text_1={props.homedata["text_1"]} text_2={props.homedata["text_2"]}></HomeFirst>
        <RelatatinoAndTrust text_3={props.homedata["text_3"]} text_4={props.homedata["text_4"]} text_5={props.homedata["text_5"]}></RelatatinoAndTrust>
        <Market text_6={props.homedata["text_6"]} text_7={props.homedata["text_7"]} text_8={props.homedata["text_8"]} text_9={props.homedata["text_9"]} text_10={props.homedata["text_10"]}></Market>
        <PowerfullInf></PowerfullInf>
        <ExploreCategory text_11={props.homedata["text_11"]} text_12={props.homedata["text_12"]} text_13={props.homedata["text_13"]} text_14={props.homedata["text_14"]} text_15={props.homedata["text_15"]} text_16={props.homedata["text_16"]} text_17={props.homedata["text_17"]} text_18={props.homedata["text_18"]}></ExploreCategory>
        <JoinSwrv></JoinSwrv>
        <Marketing text_19={props.homedata["text_19"]} text_20={props.homedata["text_20"]} text_21={props.homedata["text_21"]} text_22={props.homedata["text_22"]} text_23={props.homedata["text_23"]} text_24={props.homedata["text_24"]}></Marketing>
        <Blogs blogdata={props.blogdata}></Blogs>
        <SocialMedai></SocialMedai>
        {/* <TopCategory></TopCategory> */}
      </div>
    </>
  )
};

interface RelatatinoAndTrustProps {
  text_3: string;
  text_4: string;
  text_5: string;
}


const RelatatinoAndTrust: React.FC<RelatatinoAndTrustProps> = (props: RelatatinoAndTrustProps) => {
  /**
   * Renders a section of JSX code that displays a set of headings and paragraphs,
   * followed by a section with a heading and a horizontal line, and finally an image.
   * @param {Object} props - The props object containing the text content for the headings and paragraphs.
   * @returns {JSX.Element} - The JSX code representing the rendered section.
   */
  return (
    <>
      <div className="w-full md:w-3/5 lg:w-4/6 mx-auto lg:my-28">
        <h3 className="text-primary text-3xl font-bold">
          {props.text_3}
        </h3>
        <h3 className="text-secondary text-3xl font-bold">
          {props.text_4}
        </h3>
        <p className="text-gray-500 text-md font-normal">
          {props.text_5}
        </p>
      </div>
      <div className="w-full md:w-3/5 lg:w-4/6 mx-auto mt-28 mb-10">
        <h3 className="text-primary text-3xl font-bold">Trusted by</h3>
        <div className="h-[1px] bg-black w-full my-2"></div>
      </div>
      <div className="w-full my-6">
        <img
          src="/images/avatar/logostrip.png"
          alt="logos"
          className="h-[70px] w-[2640px] object-cover object-left-top hover:object-right-top transition-all duration-[4s]"
        />
      </div>
    </>
  );
};

interface HomeFirstProps {
  text_1: string;
  text_2: string;
}

const HomeFirst: React.FC<HomeFirstProps> = (props: HomeFirstProps): JSX.Element => {
  /**
   * Renders a JSX component that displays a section with text and buttons, followed by an image grid.
   * @param {Object} props - The props object containing the text values for the component.
   * @param {string} props.text_1 - The main heading text.
   * @param {string} props.text_2 - The subheading text.
   * @returns {JSX.Element} - The rendered component.
   */
  return (
    <>
      <div className="relative">
        <div className="absolute h-[450px] md:h-[550px] lg:h-[700px] w-full inline-block mx-auto">
          <div className="h-full w-full bg-primary rounded-xl"></div>
        </div>
        <div className="w-full px-5 md:p-0 md:w-3/5 lg:w-4/6 relative mx-auto">
          <div className="pt-10 md:pt-24">
            <h3 className="text-white text-5xl font-bold">
              {props.text_1}
            </h3>
            <h3 className="text-white text-md font-normal mt-4">
              {props.text_2}
            </h3>
            <div className="flex flex-col sm:flex-row items-center ">
              <Link to="/register?isBrand=1">
                <CusButton
                  text="I'm a brand"
                  borderColor={"border-white"}
                ></CusButton>
              </Link>
              <div className="w-10"></div>
              <Link to="/register?isInf=1">
                <CusButton
                  text="I'm an Influencer"
                  background="bg-secondary"
                ></CusButton>
              </Link>
            </div>
          </div>
        </div>

        <div className="w-full relative">
          <div className="absolute w-full">
            <div className="px-2 sm:px-20 mx-auto grid place-items-center">
              <img
                src="/images/mast_group.svg"
                alt="error"
                className="w-[1200px] mx-auto"
              />
            </div>
          </div>
          <div className="w-full md:w-3/5 lg:w-4/6 py-20 relative mx-auto grid place-content-center ">
            <div className="flex  gap-4 px-6 md:p-0">
              <div>
                <img src="/images/inf/inf4.png" alt="error" />
              </div>
              <div className="flex flex-col  gap-4">
                <div className="flex  gap-4 items-end">
                  <div>
                    <img src="/images/inf/inf2.png" alt="error" />
                  </div>
                  <div>
                    <img src="/images/inf/inf6.png" alt="error" />
                  </div>
                  <div>
                    <img src="/images/inf/inf5.png" alt="error" />
                  </div>
                </div>
                <div className="flex gap-4">
                  <div>
                    <img src="/images/inf/inf7.png" alt="error" />
                  </div>
                  <div>
                    <img src="/images/inf/inf3.png" alt="error" />
                  </div>
                  <div>
                    <img src="/images/inf/inf1.png" alt="error" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};


/**
 * Represents the properties of a market.
 * @interface MarketProps
 * @property {string} text_6 - The value of text_6 property.
 * @property {string} text_7 - The value of text_7 property.
 * @property {string} text_8 - The value of text_8 property.
 * @property {string} text_9 - The value of text_9 property.
 * @property {string} text_10 - The value of text_10 property.
 */
interface MarketProps {
  text_6: string;
  text_7: string;
  text_8: string;
  text_9: string;
  text_10: string;
}

const Market: React.FC<MarketProps> = (props: MarketProps) => {

  /**
   * Renders a marketing platform section with various cards displaying different features.
   * @param {object} props - The props object containing text for the card descriptions.
   * @returns The JSX code for rendering the marketing platform section.
   */
  return (
    <>
      <div className="w-full bg-[#EFEFEF]  rounded-xl md:p-0 p-6">
        <div className="mx-auto py-4 w-full md:w-3/5 lg:w-4/6">
          <div className="w-full  mx-auto my-6">
            <h3 className="text-primary text-3xl font-bold">
              An entire{" "}
              <span className="text-secondary">marketing platform</span>
              <br /> for influencers
            </h3>
            <p className="text-black text-md font-normal">
              All of the campaign's steps are smoothly integrated into a single
              user experience.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 sm:place-items-center my-10 ">
            <MarkatingCard
              imageUrl="/images/icons/icon1.png"
              title="Make a campaign"
              description={props.text_6}
              leftBorder={true}
            ></MarkatingCard>
            <MarkatingCard
              imageUrl="/images/icons/icon5.png"
              title="Look for influencers."
              description={props.text_7}
              leftBorder={true}
            ></MarkatingCard>
            <MarkatingCard
              imageUrl="/images/icons/icon4.png"
              title="Statistics"
              description={props.text_8}
              leftBorder={true}
            ></MarkatingCard>
            <MarkatingCard
              imageUrl="/images/icons/icon3.png"
              title="Communication"
              description={props.text_9}
              leftBorder={true}
            ></MarkatingCard>
            <MarkatingCard
              imageUrl="/images/icons/icon2.png"
              title="Payments"
              description={props.text_10}
              leftBorder={true}
            ></MarkatingCard>
          </div>
        </div>
      </div>
    </>
  );
};
/**
 * Renders a powerful influencer section with a call-to-action button and a read more button.
 * @returns JSX element representing the powerful influencer section.
 */
const PowerfullInf = () => {
  return (
    <>
      <div className="w-full my-10 bg-[#b3b3b3] py-4 rounded-xl">
        <div className=" w-full md:w-3/5 lg:w-4/6 mx-auto md:p-0 p-6">
          <h3 className="text-white text-4xl font-bold">
            ARE YOU A POWERFUL
            <br /> INFLUENCER?
          </h3>
          <h3 className="text-white text-md font-normal mt-4">
            Stop looking for the ideal marketplace to join and simply join all
            of them.
          </h3>
          <div className="flex flex-col sm:flex-row">
            <Link to={"/register"}>
              <CusButton
                text="Join Now"
                background={"bg-secondary"}
              ></CusButton>
            </Link>
            <div className="w-10"></div>
            <Link to={"/whatyouget"}>
              <CusButton
                background="bg-transparent"
                text="Read More"
                textColor={"text-white"}
                borderColor={"border-white"}
              ></CusButton>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};


interface MarketingProps {
  text_19: string;
  text_20: string;
  text_21: string;
  text_22: string;
  text_23: string;
  text_24: string;
}
/**
 * A functional component that renders a marketing section.
 * @param {MarketingProps} props - The props object containing the necessary data for rendering the component.
 * @returns JSX elements representing the marketing section.
 */
const Marketing: React.FC<MarketingProps> = (props: MarketingProps) => {
  return (
    <>
      <div className="bg-[#EFEFEF] w-full my-10 rounded-xl md:p-0 p-6">
        <div className=" py-4 w-full md:w-3/5 lg:w-4/6   mx-auto">
          <h3 className="text-primary text-4xl font-bold mt-20">
            {props.text_19}
          </h3>
          <h3 className="text-secondary text-4xl font-bold mb-10">
            {props.text_20}
          </h3>
          <h3 className="text-gray-500 text-md font-normal mt-4">
            {props.text_21}
            <br />
            <br />
            {props.text_22}
            <br />
            <br />
            {props.text_23}
            <br />
            <br />
            {props.text_24}
          </h3>
          <DownloadApp></DownloadApp>
          <div className="h-20"></div>
        </div>
      </div>
    </>
  );
};

interface ExploreCategoryProps {
  text_11: string;
  text_12: string;
  text_13: string;
  text_14: string;
  text_15: string;
  text_16: string;
  text_17: string;
  text_18: string;
}

/**
 * A functional component that displays a list of category cards for exploring different categories.
 * @param {ExploreCategoryProps} props - The props object containing the necessary data for rendering the component.
 * @returns The JSX elements representing the ExploreCategory component.
 */
const ExploreCategory: React.FC<ExploreCategoryProps> = (props: ExploreCategoryProps) => {
  return (
    <>
      <div className="w-full md:w-3/5 lg:w-4/6 mx-auto mt-28 mb-4">
        <h3 className="text-primary text-3xl font-bold">Explore by category</h3>
      </div>
      <div className="flex flex-wrap gap-6">
        <CategoryCard
          imageUrl="/images/icons/education.png"
          title="Education"
          // description={props.text_11}
          description="good"
        ></CategoryCard>
        <CategoryCard
          imageUrl="/images/icons/food.png"
          title="Food"
          description={props.text_12}
        ></CategoryCard>
        <CategoryCard
          imageUrl="/images/icons/photography.png"
          title="Photography"
          description={props.text_13}
        ></CategoryCard>
        <CategoryCard
          imageUrl="/images/icons/travel.png"
          title="Travel"
          description={props.text_14}
        ></CategoryCard>
        <CategoryCard
          imageUrl="/images/icons/motivation.png"
          title="Motivation"
          description={props.text_15}
        ></CategoryCard>
        <CategoryCard
          imageUrl="/images/icons/beauty.png"
          title="Beauty"
          description={props.text_16}
        ></CategoryCard>
        <CategoryCard
          imageUrl="/images/icons/automotive.png"
          title="Automotive"
          description={props.text_17}
        ></CategoryCard>
        <CategoryCard
          imageUrl="/images/icons/health.png"
          title="Health"
          description={props.text_18}
        ></CategoryCard>
      </div>
    </>
  );
};

const JoinSwrv = () => {
  const [index, setIndex] = useState<number>(0);
  const title = [
    "Time and money are saved.",
    "The new standard.",
    "SWRV market",
  ];
  const description = [
    "The expense of using analytic tools to find and evaluate millions of influencers is prohibitive. Manual processes are significantly more  expensice. We can save you time and money by using automatic procedures. However, Establishing in-house solutions to asssist current influencer marketing it time-consuming and costly. SWRV exists for this reason.",
    "Influencer marketing is becoming an important aspec of most companies' marketing strategies. Data-driven decisions are made, and identifying the proper influencers necessitates the use of advanced IT technologies. To be competitive, we need to simplify our procedures as influencer marketing takes a place at the media purchasing table.",
    "SWRV Market is SWRV's entire influencer marketing solution. The whole campaign flow -- discovery. activation, tracking, payouts, and more - is supported by our influencer marketing platform. Users have access to complete automation and a transaction - based business model  that is available to any brand or purchasing agency for free. SWRV is a free assistance programme that may help you grow faster and get a competitive advantage.",
  ];
  return (
    <>
      <div className="w-full md:w-3/5 lg:w-4/6 mx-auto mt-14 mb-4">
        <h3 className="text-primary text-3xl font-bold">Join SWRV</h3>
        <h3 className="text-gray-600 text-md font-normal">
          There are no commissions or membership costs for brands or buyer
          agencies.
        </h3>
        {/* <div className="grid grid-cols-1 lg:grid-cols-3 place-items-center my-6">
          <div className="w-40 xl:w-60 h-40 m-4">
            <Link to={"/users"}>
              <img
                src="/images/inf/inf2.png"
                className="cursor-pointer w-full h-full object-cover bg-top rounded-2xl object-top"
              />
            </Link>
          </div>
          <div className="w-40 xl:w-60 h-40  m-4">
            <Link to={"/users/youtubers"}>
              <img
                src="/images/inf/inf3.png"
                className="cursor-pointer w-full h-full object-cover bg-top rounded-2xl object-top"
              />
            </Link>
          </div>
          <div className="w-40 xl:w-60 h-40 hidden lg:block  m-4">
            <Link to={"/users/instagrams"}>
              <img
                src="/images/inf/inf4.png"
                className="cursor-pointer w-full h-full object-cover bg-top rounded-2xl object-top"
              />
            </Link>
          </div>
        </div> */}

        <div className="w-full hidden lg:block">
          <div className="flex gap-6 my-6">
            <img
              onClick={() => setIndex(0)}
              src="/images/avatar/clock.jpg"
              alt="clock"
              className={`cursor-pointer w-72 object-center object-cover rounded-md transition-all duration-1000 ${index == 0 ? "h-60 order-1" : "h-52 order-2"
                }`}
            />
            <img
              onClick={() => setIndex(1)}
              src="/images/avatar/laptop.png"
              alt="laptop"
              className={`cursor-pointer w-72 object-center object-cover rounded-md transition-all duration-1000 ${index == 1 ? "h-60 order-1" : "h-52 order-2"
                }`}
            />
            <img
              onClick={() => setIndex(2)}
              src="/images/avatar/media.jpg"
              alt="media"
              className={`cursor-pointer w-72 object-center object-cover rounded-md transition-all duration-1000 ${index == 2 ? "h-60 order-1" : "h-52 order-2"
                }`}
            />
          </div>
          <h3 className="text-gray-600 text-lg font-semibold">
            {title[index]}
          </h3>
          <h3 className="text-gray-500 text-md font-normal w-4/5">
            {description[index]}
          </h3>
        </div>

        <div className="lg:hidden">
          <JoinSwrvCard
            image="/images/avatar/clock.jpg"
            title="Time and money are saved."
            description="The expense of using analytic tools to find and evaluate millions of
          influencers is prohibitive. Manual processes are significantly more
          expensice. We can save you time and money by using automatic
          procedures. However, Establishing in-house solutions to asssist
          current influencer marketing it time-consuming and costly. SWRV exists
          for this reason."
          ></JoinSwrvCard>

          <JoinSwrvCard
            image="/images/avatar/laptop.png"
            title="The new standard."
            description="Influencer marketing is becoming an important aspec of most companies' marketing strategies. Data-driven decisions are made, and identifying the proper influencers necessitates the use of advanced IT technologies. To be competitive, we need to simplify our procedures as influencer marketing takes a place at the media purchasing table."
          ></JoinSwrvCard>

          <JoinSwrvCard
            image="/images/avatar/media.jpg"
            title="SWRV market"
            description="SWRV Market is SWRV's entire influencer marketing solution. The whole campaign flow -- discovery. activation, tracking, payouts, and more - is supported by our influencer marketing platform. Users have access to complete automation and a transaction - based business model  that is available to any brand or purchasing agency for free. SWRV is a free assistance programme that may help you grow faster and get a competitive advantage."
          ></JoinSwrvCard>
        </div>
      </div>
    </>
  );
};

interface JoinSwrvCardProps {
  title: string;
  image: string;
  description: string;
}

/**
 * A functional component that renders a card for joining Swrv.
 * @param {JoinSwrvCardProps} props - The props for the component.
 * @returns {JSX.Element} - The rendered card component.
 */
const JoinSwrvCard: React.FC<JoinSwrvCardProps> = (
  props: JoinSwrvCardProps
): JSX.Element => {
  return (
    <div className="mt-10 mb-6">
      <img
        src={props.image}
        alt="join swrv image"
        className="w-44 h-44 object-cover object-top rounded-md"
      />
      <h3 className="text-gray-600 text-xl font-semibold">{props.title}</h3>
      <h3 className="text-gray-500 text-md font-normal w-4/5">
        {props.description}
      </h3>
    </div>
  );
};

type BlogIntroProps = {
  blogdata: any[];
};
const Blogs: React.FC<BlogIntroProps> = (
  props: BlogIntroProps
): JSX.Element => {
  return (
    <>
      <div className="w-full md:w-3/5 lg:w-4/6 mx-auto mt-14 mb-4">
        <div className="flex">
          <h3 className="text-primary text-3xl font-bold grid place-items-center">
            Blogs
          </h3>
          <div className="grow"></div>
          <Link to={"/blogs"}>
            <CusButton
              text={"Read More"}
              textColor="text-primary"
              background="bg-transparent"
              border="border-2"
              borderColor={"border-secondary"}
            ></CusButton>
          </Link>
        </div>
        <div className="h-[1px] bg-black w-full my-2"></div>
      </div>

      <div className="grid place-items-center gird-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 my-6 items-start gap-y-6">
        {props.blogdata.map((val: any, index: number) => {
          return index < 5 ? (
            <Link key={index} to={`/blogs/bloginfo/${val.id}`}>
              <BlogsCard
                title={`${val.shortDesc.toString().substring(0, 50)}...`}
                time={val.dateTime}
                imageUrl={val.imageUrl}
              ></BlogsCard>
            </Link>
          ) : (
            <div key={index}></div>
          );
        })}
        {/* <BlogsCard
          title="App Store stopped nearly $1.5 billion in fraudulent transactions in 2021"
          time="June 1, 2022"
          imageUrl="/images/blogs/blog5.png"
        ></BlogsCard>
        <BlogsCard
          title="Swupnil Sahai and his co‑founder serve an ace with AI‑powered SwingVision"
          time="June 1, 2022"
          imageUrl="/images/blogs/blog4.png"
        ></BlogsCard>
        <BlogsCard
          title="New report highlights global success of small businesses and entrepreneurs on the"
          time="June 1, 2022"
          imageUrl="/images/blogs/blog3.png"
        ></BlogsCard>
        <BlogsCard
          title="Three AAPI founders building apps on the App Store that cultivate community"
          time="June 1, 2022"
          imageUrl="/images/blogs/blog2.png"
        ></BlogsCard>
        <BlogsCard
          title="From farm to sea: Conserving mangroves to protect local livelihoods and the planet"
          time="June 1, 2022"
          imageUrl="/images/blogs/blog1.png"
        ></BlogsCard> */}
      </div>
    </>
  );
};

/**
 * Renders a component that displays social media platforms and links to their respective pages.
 * @returns {JSX.Element} - The rendered component.
 */
const SocialMedai = (): JSX.Element => {
  return (
    <div className=" bg-[#eeeeee] rounded-md py-4 mb-6">
      <div className="w-full md:w-3/5 lg:w-4/6 mx-auto mt-2 mb-4">
        <div className="flex">
          <h3 className="text-primary text-3xl font-bold grid place-items-center rounded-md bg-white border-b-4 border-blue-500 py-1 px-4">
            Our Influencers
          </h3>
          <div className="grow"></div>
          <div className="h-10 bg-gray-500 w-[6px]"></div>
          <div className="grow"></div>
          <Link
            to={"/notablebrand"}
            className="text-primary text-3xl font-bold grid place-items-center rounded-md bg-white border-b-4 border-blue-500 py-1 px-4"
          >
            Our Brands
          </Link>
        </div>
        {/* <div className="flex gap-4 flex-wrap justify-center mt-6"> */}
      </div>
      <div className="h-[2px] w-full bg-gray-500"></div>
      <div className="grid place-items-center gird-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 my-6 items-start gap-y-6">
        <Link
          to={"/media/5"}
          className={`text-left shadow-xl rounded-xl bg-white`}
        >
          <div className="flex p-4 gap-4 items-center">
            <img
              src={"/images/media/facebook.png"}
              alt="err"
              className="w-full rounded-md object-fill object-center h-10"
            />
            <h1 className="text-xl font-bold text-primary text-center">
              Facebook
            </h1>
          </div>
        </Link>
        <Link
          to={"/media/1"}
          className={`w-44 text-left shadow-xl rounded-xl  bg-white`}
        >
          <div className="flex p-4 gap-4 items-center">
            <img
              src={"/images/media/instagram.png"}
              alt="err"
              className="w-full rounded-md object-fill object-center h-10"
            />
            <h1 className="text-xl font-bold text-primary text-center">
              Instagram
            </h1>
          </div>
        </Link>
        <Link
          to={"/media/8"}
          className={`w-44 text-left shadow-xl rounded-xl bg-white`}
        >
          <div className="flex p-4 gap-4 items-center">
            <img
              src={"/images/media/twitter.png"}
              alt="err"
              className="w-full rounded-md object-fill object-center h-10"
            />
            <h1 className="text-xl font-bold text-primary text-center">
              Twitter
            </h1>
          </div>
        </Link>
        <Link
          to={"/media/3"}
          className={`w-44 text-left shadow-xl rounded-xl bg-white`}
        >
          <div className="flex p-4 gap-4 items-center">
            <img
              src={"/images/media/snapchat.png"}
              alt="err"
              className="w-full rounded-md object-fill object-center h-10"
            />
            <h1 className="text-xl font-bold text-primary text-center">
              Snapchat
            </h1>
          </div>
        </Link>
        <Link
          to={"/media/4"}
          className={`w-44 text-left shadow-xl rounded-xl bg-white`}
        >
          <div className="flex p-4 gap-4 items-center">
            <img
              src={"/images/media/youtube.png"}
              alt="err"
              className="w-full rounded-md object-fill object-center h-10"
            />
            <h1 className="text-xl font-bold text-primary text-center">
              Youtube
            </h1>
          </div>
        </Link>
      </div>
    </div>
  );
};

// const TopCategory = (): JSX.Element => {
//   return (
//     <>
//       <div className="flex flex-wrap justify-around w-full py-4">
//         <Link
//           to={"/notableinf"}
//           className="text-white rounded-md py-2 px-4 bg-blue-500 text-xl font-semibold"
//         >
//           Notable influencer
//         </Link>
//         <Link
//           to={"/notablebrand"}
//           className="text-white rounded-md py-2 px-4 bg-blue-500 text-xl font-semibold"
//         >
//           Notable brand
//         </Link>
//       </div>
//     </>
//   );
// };
