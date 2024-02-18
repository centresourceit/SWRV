import { Link } from "@remix-run/react";
import { CusButton } from "./buttont";
import { longtext } from "~/utils";


/**
 * Represents the properties of a brand card component.
 */
type BrandCardProps = {
    image: string
    name: string
    email: string
    id: string
    website: string
}

/**
 * Renders a brand card component with the given props.
 * @param {BrandCardProps} props - The props for the brand card component.
 * @returns The rendered brand card component.
 */
export const BrandCard = (props: BrandCardProps) => {
    return (
        <>
            <div className="bg-white shadow-[0_0_4px_0_rgb(0,0,0,0.3)] rounded-xl p-4 w-64 md:w-auto">
                <div className="flex items-end gap-x-3">
                    <div>
                        <img src={props.image} alt="error" className="object-cover w-16 h-16 rounded" />
                    </div>
                    <p className="text-black font-bold text-sm content-end text-left cusfont">{longtext(props.name, 12)}</p>
                </div>
                <p className="text-black font-semibold text-xs text-left mt-6">email : {props.email}</p>
                <p className="text-black font-semibold text-xs text-left mt-1">{props.website}</p>
                <Link to={`/home/brand/${props.id}`} className="bg-[#01FFF4] font-medium inline-block mt-3 w-full text-sm py-2 rounded-md text-center text-primary">
                    View
                </Link>
            </div>
        </>
    );
}