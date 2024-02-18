import { LoaderArgs, LoaderFunction, json } from "@remix-run/node";
import { useLoaderData, useNavigate } from "@remix-run/react";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { NOTICEAlerts } from "~/components/utils/alert";
import { BaseUrl } from "~/const";

/**
 * Loader function that retrieves a campaign from the server based on the provided ID.
 * @param {LoaderArgs} props - The loader arguments.
 * @returns {Promise<LoaderResult>} A promise that resolves to the loader result.
 */
export const loader: LoaderFunction = async (props: LoaderArgs) => {
    const id = props.params.id;
    const camapaign = await axios.post(`${BaseUrl}/api/get-campaign`, { id: id });
    return json({ camapaign: camapaign.data.data, id: id });
};
const Home = () => {

    const camapaign = useLoaderData().camapaign;

    const id = useLoaderData().id;
    const [error, setError] = useState<string>("");

    const campaignNameRef = useRef<HTMLInputElement>(null);
    const campaignInfoRef = useRef<HTMLTextAreaElement>(null);
    const minEligibleRatingRef = useRef<HTMLInputElement>(null);
    const minReachRef = useRef<HTMLInputElement>(null);
    const maxReachRef = useRef<HTMLInputElement>(null);
    const costPerPostRef = useRef<HTMLInputElement>(null);
    const plannedBudgetRef = useRef<HTMLInputElement>(null);
    const minTargetRef = useRef<HTMLInputElement>(null);
    const totalTargetRef = useRef<HTMLInputElement>(null);
    const totalBudgetRef = useRef<HTMLInputElement>(null);

    const navigator = useNavigate();


    useEffect(() => {
        campaignNameRef!.current!.value = camapaign["name"];
        campaignInfoRef!.current!.value = camapaign["info"];
        minEligibleRatingRef!.current!.value = camapaign["minEligibleRating"];
        minReachRef!.current!.value = camapaign["minReach"];
        maxReachRef!.current!.value = camapaign["maxReach"];
        costPerPostRef!.current!.value = camapaign["costPerPost"];
        plannedBudgetRef!.current!.value = camapaign["plannedBudget"];
        minTargetRef!.current!.value = camapaign["minTarget"];
        totalTargetRef!.current!.value = camapaign["totalTarget"];
        totalBudgetRef!.current!.value = camapaign["totalBudget"];

    }, []);

    /**
     * Submits a request to edit a campaign by sending a POST request to the specified API endpoint.
     * @returns None
     * @throws {Error} If the request fails or returns an error status.
     */
    const submit = async () => {
        const userdata = await axios({
            method: "post",
            url: `${BaseUrl}/api/edit-campaign`,
            data: {
                id: id,
                update: {
                    campaignName: campaignNameRef!.current!.value,
                    campaignInfo: campaignInfoRef!.current!.value,
                    minEligibleRating: minEligibleRatingRef!.current!.value,
                    minReach: minReachRef!.current!.value,
                    maxReach: maxReachRef!.current!.value,
                    costPerPost: costPerPostRef!.current!.value,
                    plannedBudget: plannedBudgetRef!.current!.value,
                    minTarget: minTargetRef!.current!.value,
                    totalTarget: totalTargetRef!.current!.value,
                    totalBudget: totalBudgetRef!.current!.value,
                }
            },
        });

        if (userdata.data.status == false) {
            setError(userdata.data.message);
        } else {
            navigator(-1);
        }
    }

    /**
     * Renders a form for editing a campaign.
     * @returns {JSX.Element} - The rendered form component.
     */
    return (
        <div className="grow bg-[#1b2028] my-2 rounded-md p-4 w-full">
            <h1 className="text-white font-medium text-xl">Edit Campaign</h1>
            <div className="w-full bg-slate-400 h-[1px] my-2"></div>
            <p className="text-white font-semibold text-xl">Campaign Name</p>
            <input
                ref={campaignNameRef}
                className="p-2 w-96 outline-none bg-transparent text-white border-2 border-white block my-4 rounded-md"
            />
            <p className="text-white font-semibold text-xl">Campaign Info</p>
            <textarea
                ref={campaignInfoRef}
                className="p-2 w-96 outline-none bg-transparent text-white border-2 border-white block my-4 rounded-md resize-none h-32"
            ></textarea>
            <p className="text-white font-semibold text-xl">Min Eligible Rating</p>
            <input
                ref={minEligibleRatingRef}
                className="p-2 w-96 outline-none bg-transparent text-white border-2 border-white block my-4 rounded-md"
            />

            <p className="text-white font-semibold text-xl">Campaign Min Reach</p>
            <input
                ref={minReachRef}
                className="p-2 w-96 outline-none bg-transparent text-white border-2 border-white block my-4 rounded-md"
            />
            <p className="text-white font-semibold text-xl">Campaign Max Reach</p>
            <input
                ref={maxReachRef}
                className="p-2 w-96 outline-none bg-transparent text-white border-2 border-white block my-4 rounded-md"
            />
            <p className="text-white font-semibold text-xl">Campaign Cost per Post (USD)</p>
            <input
                ref={costPerPostRef}
                className="p-2 w-96 outline-none bg-transparent text-white border-2 border-white block my-4 rounded-md"
            />
            <p className="text-white font-semibold text-xl">Campaign Planned Budget</p>
            <input
                ref={plannedBudgetRef}
                className="p-2 w-96 outline-none bg-transparent text-white border-2 border-white block my-4 rounded-md"
            />
            <p className="text-white font-semibold text-xl">Campaign Min Target</p>
            <input
                ref={minTargetRef}
                className="p-2 w-96 outline-none bg-transparent text-white border-2 border-white block my-4 rounded-md"
            />.
            <p className="text-white font-semibold text-xl">Campaign Total Target</p>
            <input
                ref={totalTargetRef}
                className="p-2 w-96 outline-none bg-transparent text-white border-2 border-white block my-4 rounded-md"
            />
            <p className="text-white font-semibold text-xl">Campaign Total Budget</p>
            <input
                ref={totalBudgetRef}
                className="p-2 w-96 outline-none bg-transparent text-white border-2 border-white block my-4 rounded-md"
            />


            {error == "" || error == null || error == undefined ? null : (
                <NOTICEAlerts message={error}></NOTICEAlerts>
            )}
            <button className="text-white py-2 px-4 rounded-md bg-cyan-500 w-96 text-center" onClick={submit}>UPDATE</button>
        </div>
    );
};

export default Home;
