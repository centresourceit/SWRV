import { Footer } from "~/components/home/footer/footer";
import AboutPage from "~/components/about/about";
import { IntroNavBar } from "~/components/home/navbar/intronavbar";
import UsersPage from "~/components/users/users";
import { LoaderArgs, LoaderFunction, json } from "@remix-run/node";
import { BaseUrl } from "~/const";
import axios from "axios";
import { useLoaderData } from "@remix-run/react";
export const loader: LoaderFunction = async (props: LoaderArgs) => {
    const user = await axios.post(`${BaseUrl}/api/user-search`, { "role": 10 });
    return json({ user: user.data.data });
}
/**
 * Renders the Users page component with the user data obtained from the loader.
 * @returns {JSX.Element} - The rendered Users page component.
 */
const users = () => {
    let userdata = useLoaderData().user;
    return (
        <>
            <IntroNavBar></IntroNavBar>
            <UsersPage userdata={userdata}></UsersPage>
            <Footer></Footer>
        </>
    );
}
export default users;