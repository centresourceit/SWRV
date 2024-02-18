import { LoaderArgs, LoaderFunction, json } from "@remix-run/node";
import { useLoaderData, useNavigate } from "@remix-run/react";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { NOTICEAlerts } from "~/components/utils/alert";
import { BaseUrl } from "~/const";

/**
 * Loader function that retrieves brand data from the server based on the provided ID.
 * @param {LoaderArgs} props - The loader arguments.
 * @returns {Promise<LoaderResult>} A promise that resolves to the brand data and ID.
 */
export const loader: LoaderFunction = async (props: LoaderArgs) => {
    const id = props.params.id;
    const brand = await axios.post(`${BaseUrl}/api/get-brand`, { id: id });
    return json({ brand: brand.data.data, id: id });
};

const EditBrand = () => {

    const brand = useLoaderData().brand;
    const id = useLoaderData().id;
    const [error, setError] = useState<string>("");


    const brandCodeRef = useRef<HTMLInputElement>(null);
    const brandNameRef = useRef<HTMLInputElement>(null);
    const brandFullRegisteredAddressRef = useRef<HTMLTextAreaElement>(null);
    const brandWebUrlRef = useRef<HTMLInputElement>(null);
    const brandSupportEmailRef = useRef<HTMLInputElement>(null);
    const brandSupportContactRef = useRef<HTMLInputElement>(null);
    const brandBioInfoRef = useRef<HTMLTextAreaElement>(null);
    const comapnyBioRef = useRef<HTMLTextAreaElement>(null);
    // const brandLogoUrlRef = useRef<HTMLInputElement>(null);
    const bannerRef = useRef<HTMLInputElement>(null);

    const navigator = useNavigate();

    useEffect(() => {
        brandCodeRef!.current!.value = brand["code"];
        brandNameRef!.current!.value = brand["name"];
        brandFullRegisteredAddressRef!.current!.value = brand["address"];
        brandWebUrlRef!.current!.value = brand["webUrl"];
        brandSupportEmailRef!.current!.value = brand["email"];
        brandSupportContactRef!.current!.value = brand["contact"];
        brandBioInfoRef!.current!.value = brand["info"];
        comapnyBioRef!.current!.value = brand["companyinfo"];
        // brandLogoUrlRef!.current!.value = brand["logo"];
        bannerRef!.current!.value = brand["banner"];

    }, []);

    /**
     * Submits the form data to update the brand information.
     * @returns None
     */
    const submit = async () => {
        const req = {
            id: id,
            update: {
                brandCode: brandCodeRef!.current!.value,
                brandName: brandNameRef!.current!.value,
                brandFullRegisteredAddress: brandFullRegisteredAddressRef!.current!.value,
                brandWebUrl: brandWebUrlRef!.current!.value,
                brandSupportEmail: brandSupportEmailRef!.current!.value,
                brandSupportContact: brandSupportContactRef!.current!.value,
                brandBioInfo: brandBioInfoRef!.current!.value,
                comapnyBio: comapnyBioRef!.current!.value,
                // brandLogoUrl: brandLogoUrlRef!.current!.value,
                banner: bannerRef!.current!.value,
            }
        };
        const branddata = await axios({
            method: "post",
            url: `${BaseUrl}/api/edit-brand`,
            data: req,
        });
        if (branddata.data.status == false) {
            setError(branddata.data.message);
        } else {
            navigator(-1);
        }
    }

    /**
     * Renders a form for editing brand information.
     * @returns JSX element representing the brand edit form.
     */
    return (
        <div className="grow bg-[#1b2028] my-2 rounded-md p-4 w-full">
            <h1 className="text-white font-medium text-xl">Edit brand</h1>
            <div className="w-full bg-slate-400 h-[1px] my-2"></div>
            <p className="text-white font-semibold text-xl">Brand Code</p>
            <input
                ref={brandCodeRef}
                className="p-2 w-96 outline-none bg-transparent text-white border-2 border-white block my-4 rounded-md"
            />
            <p className="text-white font-semibold text-xl">Brand Name</p>
            <input
                ref={brandNameRef}
                className="p-2 w-96 outline-none bg-transparent text-white border-2 border-white block my-4 rounded-md"
            />
            <p className="text-white font-semibold text-xl">Brand Address</p>
            <textarea
                ref={brandFullRegisteredAddressRef}
                className="p-2 w-96 outline-none bg-transparent text-white border-2 border-white block my-4 rounded-md resize-none h-32"
            ></textarea>
            <p className="text-white font-semibold text-xl">Brand Website url</p>
            <input
                ref={brandWebUrlRef}
                className="p-2 w-96 outline-none bg-transparent text-white border-2 border-white block my-4 rounded-md"
            />
            <p className="text-white font-semibold text-xl">Brand Support Email</p>
            <input
                ref={brandSupportEmailRef}
                className="p-2 w-96 outline-none bg-transparent text-white border-2 border-white block my-4 rounded-md"
            />
            <p className="text-white font-semibold text-xl">Brand Support Contact</p>
            <input
                ref={brandSupportContactRef}
                className="p-2 w-96 outline-none bg-transparent text-white border-2 border-white block my-4 rounded-md"
            />
            <p className="text-white font-semibold text-xl">Brand Bio</p>
            <textarea
                ref={brandBioInfoRef}
                className="p-2 w-96 outline-none bg-transparent text-white border-2 border-white block my-4 rounded-md resize-none h-32"
            ></textarea>
            <p className="text-white font-semibold text-xl">Brand company bio</p>
            <textarea
                ref={comapnyBioRef}
                className="p-2 w-96 outline-none bg-transparent text-white border-2 border-white block my-4 rounded-md resize-none h-32"
            ></textarea>
            {/* <p className="text-white font-semibold text-xl">Brand logo url</p>
            <input
                ref={brandLogoUrlRef}
                className="p-2 w-96 outline-none bg-transparent text-white border-2 border-white block my-4 rounded-md"
            /> */}
            <p className="text-white font-semibold text-xl">Brand banner url</p>
            <input
                ref={bannerRef}
                className="p-2 w-96 outline-none bg-transparent text-white border-2 border-white block my-4 rounded-md"
            />


            {error == "" || error == null || error == undefined ? null : (
                <NOTICEAlerts message={error}></NOTICEAlerts>
            )}
            <button className="text-white py-2 px-4 rounded-md bg-cyan-500 w-96 text-center" onClick={submit}>UPDATE</button>
        </div>
    );
};

export default EditBrand;
