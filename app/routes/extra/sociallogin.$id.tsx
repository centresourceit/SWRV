import { LoaderArgs, LoaderFunction, redirect } from "@remix-run/node";
import axios from "axios";
import { BaseUrl } from "~/const";
import { userPrefs } from "~/cookies";

/**
 * Loader function that retrieves user data from the server and performs necessary operations.
 * @param {LoaderArgs} props - The loader arguments object.
 * @returns {Promise} A promise that resolves to an object containing the user data or an error message.
 */
export const loader: LoaderFunction = async (props: LoaderArgs) => {
    const id = props.params.id;
    const userdata = await axios({
        method: 'post',
        url: `${BaseUrl}/api/getuser`,
        data: { "id": id },
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': '*',
            'Access-Control-Allow-Options': '*',
            'Access-Control-Allow-Methods': '*',
            'X-Content-Type-Options': '*',
            'Content-Type': 'application/json',
            'Accept': '*'
        }
    });
    if (userdata.data.status == false) {
        return { message: userdata.data.message };
    }
    else {

        let userdatasave = userdata.data.data[0];
        delete userdatasave.languages;
        delete userdatasave.platforms;
        delete userdatasave.categories;
        delete userdatasave.market;

        return redirect("/home", {
            headers: {
                "Set-Cookie": await userPrefs.serialize({ user: userdatasave, isLogin: true }),
            },
        });
    }
}
/**
 * Renders a component for social login.
 * @returns {JSX.Element} - The rendered component for social login.
 */
const SocialLogin = () => {
    return (
        <>
        </>
    );
}
export default SocialLogin;