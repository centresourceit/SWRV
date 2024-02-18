type BlogsCardProps = {
  imageUrl: string;
  title: string;
  time: string;
};

/**
 * Renders a card component for displaying blog posts.
 * @param {BlogsCardProps} props - The props object containing the necessary data for rendering the card.
 * @returns The JSX element representing the blog card.
 */
export const BlogsCard = (props: BlogsCardProps) => {
  return (
    <>
      <div className="mx-4 my-4 grid place-items-center h-full">
        <div className="w-64 text-primary text-left font-semibold text-md my-2 h-full">
          <p>UPDATE</p>
          <p>{props.time.toString().split(" ")[0]}</p>
        </div>
        <div className={`w-64 text-left shadow-xl rounded-xl h-full`}>
          <img
            src={props.imageUrl}
            alt="err"
            className="w-full h-48 object-cover object-top rounded-md"
          />
          <h1 className="text-md font-bold my-2 text-black p-4">
            {props.title}
          </h1>
        </div>
      </div>
    </>
  );
};

/**
 * Represents the props for a BigBlogsCard component.
 * @typedef {Object} BigBlogsCardProps
 * @property {string} imageUrl - The URL of the image for the card.
 * @property {string} title - The title of the card.
 * @property {string} time - The time of the card.
 * @property {string} [background] - The background color of the card.
 * @property {string} [textColor] - The text color of the card.
 */
type BigBlogsCardProps = {
  imageUrl: string;
  title: string;
  time: string;
  background?: string;
  textColor?: string;
};

/**
 * A component that renders a big blog card with an image, title, and update information.
 * @param {BigBlogsCardProps} props - The props for the BigBlogCard component.
 * @returns The rendered BigBlogCard component.
 */
export const BigBlogCard = (props: BigBlogsCardProps) => {
  return (
    <>
      <div
        className={`w-full rounded-2xl grid grid-cols-1 lg:grid-cols-2 ${
          props.background ?? "bg-white"
        } shadow-xl my-10 lg:h-80`}
      >
        <div>
          <img
            src={props.imageUrl}
            alt="err"
            className="h-80 w-full inline-block rounded-2xl"
          />
        </div>
        <div
          className={`${
            props.textColor ?? "text-black"
          } text-left font-semibold text-md my-2 p-4 md:p-12 grow`}
        >
          <p>UPDATE</p>
          <p>{props.time}</p>
          <h1 className="text-xl font-bold my-2">{props.title}</h1>
        </div>
      </div>
    </>
  );
};
