import { LoaderArgs, LoaderFunction, json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { BaseUrl } from "~/const";
import { userPrefs } from "~/cookies";
import { longtext } from "~/utils";


export const loader: LoaderFunction = async (props: LoaderArgs) => {


    const cookieHeader = props.request.headers.get("Cookie");
    const cookie = await userPrefs.parse(cookieHeader);
    return json({ user: cookie.user });
}

const UserDrafts = () => {
    const userid = useLoaderData().user.id;
    const [resDarft, setResDarft] = useState<any[]>([]);

    /**
     * Initializes the search draft by sending a POST request to the server with the provided user ID.
     * @async
     * @returns None
     */
    const init = async () => {
        let req = {
            "search": {
                "fromUser": userid,
                "influencer": userid,
            }
        };

        const responseData = await axios.post(`${BaseUrl}/api/search-draft`, req);

        if (responseData.data.status == true) {
            setResDarft(responseData.data.data);
        }
    }


    useEffect(() => {
        init();
    }, []);

    /**
     * Renders a list of user-created drafts with their corresponding information.
     * @param {Array} resDarft - An array of draft objects.
     * @returns JSX elements representing the list of drafts.
     */
    return (
        <>
            <div className="p-4 rounded-xl shadow-xl bg-white my-4">
                {
                    resDarft.length == 0 ?
                        <div>You haven't created any drafts yet.</div>
                        :
                        <div>
                            <p className="text-md font-medium">User Created draft</p>
                            <div className="w-full bg-gray-400 h-[1px] my-2"></div>
                            <div className="flex flex-nowrap overflow-x-scroll md:overflow-auto md:grid xs:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 w-full px-2">
                                {
                                    resDarft.map((val: any, index: number) => {
                                        let image = val["brand"].length == 0 || val["brand"] == undefined || val["brand"] == null || val["brand"] == "" ? "/images/avatar/user.png" : val["brand"]["logo"] == "0" || val["brand"]["logo"] == undefined || val["brand"]["logo"] == null || val["brand"]["logo"] == "" ? "/images/avatar/user.png" : val["brand"]["logo"];
                                        return <div key={index} className="my-2 bg-white rounded-lg shadow-[0_0_4px_0_rgb(0,0,0,0.3)] w-60 md:w-auto">
                                            <div>
                                                <img
                                                    src={image}
                                                    alt="influencer pic"
                                                    className="w-full h-44 shrink-0 rounded-t-md object-center object-cover"
                                                />
                                            </div>
                                            <div className="p-4">
                                                <p className="mt-4 text-sm font-semibold cusfont">{val.brand.name}</p>
                                                <p className="text-xs font-medium">{val.brand.email}</p>
                                                <p className="mt-4 text-sm font-semibold cusfont">Description</p>
                                                <p className="text-xs font-medium">{longtext(val.description, 35)}</p>
                                                <p className="mt-4 text-sm font-semibold cusfont">Platforms</p>
                                                <div className="rounded-full p-[0.15rem] border-2 border-blue-500 h-10 w-10">
                                                    <img src={val.handle.platform.logo} alt="platform" className="w-full h-full shrink-0 rounded-md object-fill object-center" />
                                                </div>
                                                <p className="mt-4 text-sm font-semiboldm cusfont">Publication Time</p>
                                                {val.draft_approval != null ?
                                                    <p className="text-sm font-medium">{new Date(val.draft_approval.toString()).toLocaleString()}</p> :
                                                    <p className="text-sm font-medium">No Publication Time is set</p>
                                                }
                                                <a
                                                    target="_blank"
                                                    className="rounded-md mt-4 w-full text-sm text-center font-semibold  inline-block my-2 py-2  text-black bg-[#fbca8e]"
                                                    href={val.attach01}
                                                >
                                                    View attachment
                                                </a>
                                                {val.status.name == "REJECTED" ?
                                                    <>
                                                        <p className="mt-2 text-md font-medium">Rejection Reason</p>
                                                        <p className="text-sm font-medium">{val.status.message}</p>
                                                    </>
                                                    : null}
                                                <p
                                                    className={`mt-2 py-2 text-md text-black text-sm font-semibold text-center rounded-md ${val.status.name == "ACCEPTED"
                                                        ? "bg-[#beff80]"
                                                        : val.status.name == "PENDING"
                                                            ? "bg-[#80fffa]"
                                                            : "bg-[#ff88bb]"
                                                        }`}
                                                >
                                                    {val.status.name}
                                                </p>
                                            </div>
                                        </div>
                                    })
                                }
                            </div>
                        </div>
                }
            </div>
        </>
    );
}


export default UserDrafts;