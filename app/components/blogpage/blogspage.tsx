import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { BigBlogCard, BlogsCard } from "../utils/blogscard";
import { Link } from "@remix-run/react";

type BlogsIntroProps = {
  blogdata: any[];
};
/**
 * Renders the introductory section of a blogs page.
 * @param {BlogsIntroProps} props - The props object containing the necessary data for rendering the component.
 * @returns The JSX element representing the BlogsIntro component.
 */
const BlogsIntro = (props: BlogsIntroProps) => {
  return (
    <>
      <div className="w-full px-6 sm:px-16 relative">
        <div className=" absolute w-full h-screen box-border left-0 px-6 sm:px-16">
          <div className=" bg-[#EFEFEF] box-border w-full h-screen rounded-xl"></div>
        </div>
        <div className="w-full md:w-3/5 lg:w-4/6 mx-auto mb-10 relative pt-8 px-6 mdLpx-0">
          {props.blogdata.slice(2, 4).map((val: any, index: number) => {
            return (
              <div key={index}>
                <Link key={index} to={`/blogs/bloginfo/${val.id}`}>
                  <BigBlogCard
                    title={`${val.shortDesc.toString().substring(0, 50)}...`}
                    time={val.dateTime}
                    imageUrl={val.imageUrl}
                  ></BigBlogCard>
                </Link>
              </div>
            );
          })}

          <div className="grid xl:grid-cols-3 grid-cols-1 lg:grid-cols-2 justify-center mt-32 gap-y-8">
            {props.blogdata.map((val: any, index: number) => {
              return index < 6 ? (
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
          </div>

          {props.blogdata.slice(4, 6).map((val: any, index: number) => {
            return (
              <div key={index}>
                <Link key={index} to={`/blogs/bloginfo/${val.id}`}>
                  <BigBlogCard
                    title={`${val.shortDesc.toString().substring(0, 50)}...`}
                    time={val.dateTime}
                    imageUrl={val.imageUrl}
                  ></BigBlogCard>
                </Link>
              </div>
            );
          })}

          <div className="flex flex-wrap justify-center my-10 gap-8">
            {props.blogdata.map((val: any, index: number) => {
              return index < 6 ? (
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
          </div>
        </div>
      </div>
    </>
  );
};
export default BlogsIntro;
