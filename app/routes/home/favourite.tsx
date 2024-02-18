import { Link } from "@remix-run/react";
import useLocalStorageState from "use-local-storage-state";
import { BrandCard } from "~/components/utils/brandcard";
import { CusButton } from "~/components/utils/buttont";

/**
 * A component that displays a list of favorite brands.
 * @returns JSX element
 */
const Favourite = () => {
  const [myfavBrand, setMyfavBrand] = useLocalStorageState<any[]>("favbrand", {
    defaultValue: [],
  });
  /**
   * Renders a section displaying favorite brands and allows the user to manage their campaigns.
   * @returns JSX element
   */
  return (
    <>
      <div>
        <div className="flex my-6 md:flex-row flex-col">
          <div>
            <h1 className="text-2xl font-bold text-black text-left mt-4">
              Favourite brands
            </h1>
            <p className="text-md font-normal text-black text-left">
              Here you can manage all the campaigns that you are participating
              in.
            </p>
          </div>
        </div>
        {myfavBrand.length == 0 ? (
          <div className="bg-white rounded-xl shadow-xl p-10 grid grid-cols-1 place-items-center md:place-items-start md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 text-center">
            <p className="text-xl font-slate-900">
              You have no favorite brands.
            </p>
          </div>
        ) : (
          <>
            <div className="flex bg-white rounded-xl shadow-xl p-6 my-4 items-center">
              <p className="text-xl font-slate-900">
                Found : {myfavBrand.length}
              </p>
              <div className="grow"></div>
              <div>
                <button
                  className="text-lg text-center bg-red-500 py-1 px-2 text-white font-bold rounded-md"
                  onClick={() => {
                    setMyfavBrand([]);
                  }}
                >
                  Clear All
                </button>
              </div>
            </div>
            <div className="flex flex-nowrap overflow-x-scroll md:overflow-auto md:grid xs:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 w-full p-3 bg-white rounded-md py-4">
              {myfavBrand.map((val: any, index: number) => {
                return (
                  <div key={index}>
                    <BrandCard
                      id={val.id}
                      email={val.email}
                      image={val.logo}
                      name={val.name}
                      website={val.website}
                    ></BrandCard>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Favourite;

/**
 * Represents the properties of a favorite brand card component.
 * @typedef {Object} FavBrandCardProps
 * @property {string} image - The image URL of the brand.
 * @property {string} name - The name of the brand.
 * @property {string} id - The unique identifier of the brand.
 * @property {string} email - The email address of the brand.
 * @property {string} website - The website URL of the brand.
 */
type FavBrandCardProps = {
  image: string;
  name: string;
  id: string;
  email: string;
  website: string;
};

/**
 * A functional component that renders a favorite brand card.
 * @param {FavBrandCardProps} props - The props object containing the necessary data for rendering the card.
 * @returns The JSX element representing the favorite brand card.
 */
export const FavBrandCard = (props: FavBrandCardProps) => {
  return (
    <>
      <div className="bg-white rounded-xl shadow-xl p-4 w-64 my-2">
        <div className="flex items-end gap-x-3">
          <div>
            <img
              src={props.image}
              alt="error"
              className="object-cover w-16 h-16 rounded"
            />
          </div>
          <p className="text-black font-semibold text-xl content-end text-left my-2">
            {props.name}
          </p>
        </div>
        <p className="text-black font-semibold text-md content-end text-left">
          Website: {props.website}
        </p>
        <p className="text-black font-semibold text-md content-end text-left">
          Email: {props.email}
        </p>
        <Link to={`/home/brand/${props.id}`}>
          <CusButton
            text="Learn More & Connect"
            textColor={"text-black"}
            background={"bg-[#01FFF4]"}
            width={"w-full"}
            margin={"my-2"}
            fontwidth={"font-bold"}
          ></CusButton>
        </Link>
      </div>
    </>
  );
};
