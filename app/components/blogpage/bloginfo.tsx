import { LoaderArgs, LoaderFunction, json } from "@remix-run/node";
import { BigBlogCard, BlogsCard } from "../utils/blogscard";
import { BaseUrl } from "~/const";
import axios from "axios";
import { Link, useLoaderData } from "@remix-run/react";

/**
 * Represents the properties of a blog post.
 * @typedef {Object} BlogInfoProps
 * @property {string} image - The URL of the blog post's image.
 * @property {string} title - The title of the blog post.
 * @property {string} shorttitle - The short title of the blog post.
 * @property {string} date - The date of the blog post.
 * @property {string} description - The description of the blog post.
 * @property {number} type - The type of the blog post.
 * @property {boolean} error - Indicates if there was an error retrieving the blog post.
 * @property {any[]} relatedArtical - An array of related articles.
 */
type BlogInfoProps = {
  image: string;
  title: string;
  shorttitle: string;
  date: string;
  description: string;
  type: number;
  error: boolean;
  relatedArtical: any[];
};

/**
 * Renders a component that displays information about a blog post.
 * @param {BlogInfoProps} props - The props object containing the necessary data for rendering the component.
 * @returns The JSX element representing the blog post information.
 */
const BlogsInfo = (props: BlogInfoProps) => {
  return (
    <>
      <div className="w-full px-6 sm:px-16">
        {props.error ? (
          <h1 className="border-2 border-rose-500 border-l-4 w-full text-center rounded-md text-2xl font-semibold  bg-rose-500 bg-opacity-10 text-rose-500">
            Error 404 Post not found
          </h1>
        ) : (
          <>
            <div className="md:h-[550px] w-full relative">
              <img
                src={props.image}
                alt="error"
                className="h-full w-full rounded-lg inline-block relative object-cover object-top"
              />
              {/* <div className="bg-gradient-to-b from-transparent to-gray-800 absolute top-0 left-0 w-full h-full"></div> */}
              <div className="w-full mx-auto absolute bottom-0 hidden md:block">
                <div className="w-full md:w-3/5 lg:w-4/6 mx-auto  pt-8 ">
                  <h1 className="text-white text-2xl font-semibold md:w-96 drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]">
                    {props.title}
                  </h1>
                  <h1 className="text-white text-lg font-semibold md:w-96 drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]">
                    {props.date.toString().split(" ")[0]}
                  </h1>
                  <p className="text-md font-semibold text-white py-10 drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]">
                    {props.shorttitle}
                  </p>
                </div>
              </div>
            </div>
            <div className="w-full md:w-3/5 lg:w-4/6 mx-auto mb-10  py-8">
              <p className="text-md font-semibold text-primary py-10">
                {props.description}
              </p>
            </div>
          </>
        )}
        <div className="bg-[#EFEFEF] w-full my-10 rounded-xl md:p-0 p-6">
          <div className="w-full md:w-3/5 lg:w-4/6 mx-auto mb-10  py-8">
            <h3 className="text-primary text-3xl font-bold">Top picks</h3>
            <div className="h-[1px] bg-gray-600 w-full my-2"></div>

            {props.relatedArtical.slice(2, 4).map((val: any, index: number) => {
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
          </div>
        </div>
        <div className="w-full md:w-3/5 lg:w-4/6 mx-auto mb-10  py-8">
          <h3 className="text-primary text-3xl font-bold">Related article</h3>
          <div className="h-[1px] bg-gray-600 w-full my-2"></div>
          <div className="flex gap-6 justify-center flex-wrap">
            {props.relatedArtical
              .splice(0, 3)
              .map((val: any, index: number) => {
                return (
                  <div key={index}>
                    <Link key={index} to={`/blogs/bloginfo/${val.id}`}>
                      <BlogsCard
                        title={`${val.shortDesc
                          .toString()
                          .substring(0, 50)}...`}
                        time={val.dateTime}
                        imageUrl={val.imageUrl}
                      ></BlogsCard>
                    </Link>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </>
  );
};
export default BlogsInfo;
