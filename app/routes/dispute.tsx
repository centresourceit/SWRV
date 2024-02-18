import { Footer } from "~/components/home/footer/footer";
import { IntroNavBar } from "~/components/home/navbar/intronavbar";
import DisputePage from "~/components/contact/dispute";
import { LoaderArgs, json, redirect } from "@remix-run/node";
import { userPrefs } from "~/cookies";
import { useLoadScript } from "@react-google-maps/api";
import { useLoaderData } from "@remix-run/react";

export async function loader({ request }: LoaderArgs) {
    const cookieHeader = request.headers.get("Cookie");
    const cookie = await userPrefs.parse(cookieHeader);
    return json({ user: cookie });
}

/**
 * Renders the contact page, which includes an introduction navigation bar, a dispute page component,
 * and a footer.
 * @returns The JSX elements representing the contact page.
 */
const contact = () => {
    const userid = useLoaderData().user.id;
    return (
        <>
            <IntroNavBar></IntroNavBar>
            <DisputePage userid={userid}></DisputePage>
            <Footer></Footer>
        </>
    );
}
export default contact;