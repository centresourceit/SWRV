import { LoaderArgs } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import axios from "axios";
import { BaseUrl } from "~/const";
import { userPrefs } from "~/cookies";


/**
 * Asynchronously loads data and updates payment information.
 * @param {LoaderArgs} params - The loader arguments object.
 * @returns {Promise<{ data: any }>} - A promise that resolves to an object containing the payment data.
 */
export async function loader(params: LoaderArgs) {
    const id = params.params.id;

    const cookieHeader = params.request.headers.get("Cookie");
    const cookie: any = await userPrefs.parse(cookieHeader);

    let req = {
        id: id,
        status: "2",
        refNo: `${new Date().toLocaleDateString()}_${cookie.user.id}`,
    };
    const payment = await axios.post(`${BaseUrl}/api/update-payment`, req);
    return ({ data: payment });
}
/**
 * A React functional component that renders a cancellation message based on the payment status.
 * @returns {JSX.Element} - The JSX element representing the cancellation message.
 */
const Cencel: React.FC = (): JSX.Element => {
    const payment = useLoaderData().data.data;
    return (
        <div className="bg-[#eeeeee] h-screen w-full grid place-items-center">
            {payment.status ?
                <div className="w-80 bg-white rounded-md shadow-md p-6">
                    <h1 className="text-green-500  text-xl font-semibold">SUCCESS</h1>
                    <h1 className="my-4 text-green-500 bg-green-500 bg-opacity-10 rounded-md border-l-2 border-green-500 p-2">Payment not completed Somethign went wrong. Try Again!</h1>
                    <Link to={"/home"} className="py-2 rounded-md shadow-md bg-green-500 text-white font-semibold px-4">Go Back Home</Link>
                </div> :
                <div className="w-80 bg-white rounded-md shadow-md p-6">
                    <h1 className="text-rose-500  text-xl font-semibold">Error</h1>
                    <h1 className="my-4 text-rose-500 bg-rose-500 bg-opacity-10 rounded-md border-l-2 border-rose-500 p-2">Payment not completed Somethign went wrong. Try Again!</h1>
                    <Link to={"/home"} className="py-2 rounded-md shadow-md bg-rose-500 text-white font-semibold px-4">Go Back Home</Link>
                </div>

            }
        </div>
    )
}

export default Cencel;