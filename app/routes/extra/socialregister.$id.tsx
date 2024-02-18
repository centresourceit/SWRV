import { LoaderArgs, LoaderFunction, redirect } from "@remix-run/node";
import axios from "axios";
import { BaseUrl } from "~/const";
import { userPrefs } from "~/cookies";

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



    /**
     * Sends a verification email to the user with the provided user ID.
     * @param {string} id - The ID of the user to send the verification email to.
     * @returns {Promise<Object>} - A promise that resolves to an object with a message property.
     * If the status of the userdata or sendverificationmail data is false, the message property will contain
     * the corresponding error message. Otherwise, if the email is sent successfully, the user data is saved,
     * and a redirect to the home page is performed with the serialized user preferences in the Set-Cookie header.
     */
    const sendverificationmail = await axios({
        method: 'post',
        url: `${BaseUrl}/api/send-otp`,
        data: { "userId": id },
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
    } else if (sendverificationmail.data.status == false) {
        return { message: sendverificationmail.data.message };
    } else {
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
 * Renders a social register component.
 * @returns {JSX.Element} - The rendered social register component.
 */
const SocialRegister = () => {
    return (
        <>
        </>
    );
}
export default SocialRegister;