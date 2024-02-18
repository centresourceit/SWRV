import { faAdd, faCircleXmark, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ActionArgs, ActionFunction, LoaderArgs, LoaderFunction, json, redirect } from "@remix-run/node";
import { Form, useLoaderData, useNavigate } from "@remix-run/react";
import axios from "axios";
import he from "he";
import { useEffect, useRef, useState } from "react";
import { MaterialSymbolsArrowDropDownRounded } from "~/components/icons";
import { NOTICEAlerts } from "~/components/utils/alert";
import { BaseUrl } from "~/const";
import { userPrefs } from "~/cookies";
import UserInputStore from "~/state/user/firstinput";


export const loader: LoaderFunction = async (props: LoaderArgs) => {
    const cookieHeader = props.request.headers.get("Cookie");
    const cookie = await userPrefs.parse(cookieHeader);

    /**
     * Sends a POST request to the specified URL to retrieve currency information.
     * @param {string} BaseUrl - The base URL of the API.
     * @returns {Promise} A promise that resolves to the response from the API.
     */
    const accountRes = await axios({
        method: 'post',
        url: `${BaseUrl}/api/getcurrency`,
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


    /**
     * Sends a POST request to the specified URL to retrieve the category response.
     * @param {string} BaseUrl - The base URL of the API.
     * @returns {Promise} A promise that resolves to the category response.
     */
    const categoryRes = await axios({
        method: 'post',
        url: `${BaseUrl}/api/getcategory`,
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
    /**
     * Sends a POST request to the specified URL to retrieve the supported languages.
     * @param {string} BaseUrl - The base URL of the API.
     * @returns {Promise} A promise that resolves to the response containing the supported languages.
     */
    const languagesRes = await axios({
        method: 'post',
        url: `${BaseUrl}/api/getlanguage`,
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

    /**
     * Sends a POST request to the specified URL to retrieve market data.
     * @param {string} BaseUrl - The base URL of the API.
     * @returns {Promise} A promise that resolves to the response from the API.
     */
    const mainmarketRes = await axios({
        method: 'post',
        url: `${BaseUrl}/api/get-market`,
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


    const userdata = await axios({
        method: "post",
        url: `${BaseUrl}/api/getuser`,
        data: { id: cookie.user.id },
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "*",
            "Access-Control-Allow-Options": "*",
            "Access-Control-Allow-Methods": "*",
            "X-Content-Type-Options": "*",
            "Content-Type": "application/json",
            Accept: "*",
        },
    });


    const market = await axios({
        method: "post",
        url: `${BaseUrl}/api/get-market-byid`,
        data: { id: userdata.data.data[0]["marketId"] },
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "*",
            "Access-Control-Allow-Options": "*",
            "Access-Control-Allow-Methods": "*",
            "X-Content-Type-Options": "*",
            "Content-Type": "application/json",
            Accept: "*",
        },
    });


    return json({
        user: cookie.user,
        currency: accountRes.data.data,
        category: categoryRes.data.data,
        languages: languagesRes.data.data,
        market: mainmarketRes.data.data,
        userdata: userdata.data.data[0],
        usermarket: market.data.data
    });
}


const SecondPage = () => {

    const loaderData = useLoaderData();
    const userID: String = loaderData.user.id;

    const currency = loaderData.currency;
    const category = loaderData.category;
    const languages = loaderData.languages;
    const market = loaderData.market;


    const [isUpdating, setIsUpdating] = useState<boolean>(false);


    const index = UserInputStore((state) => state.index);

    const setIndex = UserInputStore((state) => state.setIndex);
    const navigator = useNavigate();
    const [error, setError] = useState<string | null>(null);

    const userdata = loaderData.userdata;
    const usermarket = loaderData.usermarket;




    const [selcurrency, setSelcurrency] = useState<any[]>([]);
    const [selcategory, setSelcategory] = useState<any[]>([]);
    const [sellanguages, setSellanguages] = useState<any[]>([]);
    const [selmarket, setSelmarket] = useState<any[]>([]);
    const [selorthermarket, setSelorthermarket] = useState<any[]>([]);

    const [cur, setcur] = useState<boolean>(false);
    const [cat, setcat] = useState<boolean>(false);
    const [lan, setlan] = useState<boolean>(false);
    const [mar, setmar] = useState<boolean>(false);
    const [ort, setort] = useState<boolean>(false);


    useEffect(() => {
        if (index == 1) {
            navigator("/home/profilecomplete/");
        }
        // set currency
        if (!(userdata.currency == null || userdata.currency == undefined || userdata.currency == "")) {
            setSelcurrency([{
                id: userdata.currency.id,
                currencyName: userdata.currency.name,
                currencyCode: userdata.currency.code,
                currencyAsciiSymbol: userdata.currency.currencyAsciiSymbol
            }]);

        }

        //set market
        if (!(usermarket == null || usermarket == undefined || usermarket == "")) {
            setSelmarket([{
                id: usermarket[0].id,
                name: usermarket[0].name,
                code: usermarket[0].code
            }]);
        }

        //set market
        if (!(userdata.market == null || userdata.market == undefined || userdata.market == "")) {
            for (let i = 0; i < userdata.market.length; i++) {
                setSelorthermarket((val: any[]) => [...val, {
                    id: userdata.market[i]["id"],
                    name: userdata.market[i]["name"],
                    code: userdata.market[i]["code"]
                }]);
            }
        }


        //set languages
        if (!(userdata.languages == null || userdata.languages == undefined || userdata.languages == "")) {
            for (let i = 0; i < userdata.languages.length; i++) {
                setSellanguages((val: any[]) => [...val, {
                    id: userdata.languages[i]["id"],
                    languageName: userdata.languages[i]["name"],
                    languageCode: userdata.languages[i]["code"],
                    languageAsciiSymbol: userdata.languages[i]["symbol"]
                }]);
            }
        }

        //set categories
        if (!(userdata.categories == null || userdata.categories == undefined || userdata.categories == "")) {
            for (let i = 0; i < userdata.categories.length; i++) {
                setSelcategory((val: any[]) => [...val, {
                    id: userdata.categories[i]["id"],
                    categoryName: userdata.categories[i]["name"],
                    categoryCode: userdata.categories[i]["code"]
                }]);
            }
        }

    }, []);


    const nextButton = useRef<HTMLButtonElement>(null);

    const gotoback = () => {
        setIndex(1);
        navigator("/home/profilecomplete/");
    }

    /**
     * Function to handle the "Next" button click event. It performs validation checks on the selected
     * currency, category, languages, main market, and other markets. If all the required fields are
     * selected, it sends a request to update the user's information with the selected values. If the
     * request is successful, it proceeds to the next step. If there is an error or the request fails,
     * it displays an error message. Finally, it resets the updating state to false.
     * @returns None
     */
    const gotonext = async () => {
        setIsUpdating(true);
        const ids = (myobj: any[]): String => {
            let res: String = "";
            for (let i = 0; i < myobj.length; i++) {
                if (i == myobj.length - 1) {
                    res += myobj[i]["id"];
                } else {
                    res += myobj[i]["id"] + ",";
                }
            }
            return res;
        }
        if (selcurrency.length == 0) {
            setError("Select the currency.");
        } else if (selcategory.length == 0) {
            setError("Select the category.")
        } else if (sellanguages.length == 0) {
            setError("Select the languages.")
        } else if (selmarket.length == 0) {
            setError("Select the main market.")
        } else if (selorthermarket.length == 0) {
            setError("Select the other market.");
        } else {
            let req = {
                "id": userID,
                "currencyId": selcurrency[0]["id"],
                "languages": ids(sellanguages),
                "categories": ids(selcategory),
                "marketId": selmarket[0]["id"],
                "markets": ids(selorthermarket)
            };

            const data = await axios({
                method: 'post',
                url: `${BaseUrl}/api/updateuser`,
                data: req,
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
            if (data.data.status == false) {

                if (data.data.message == "Oops, something went wrong") {
                    setIndex(3);
                    nextButton.current!.click();
                } else {
                    setError(data.data.message);
                }
            }
            setIndex(3);
            nextButton.current!.click();
        }
        setIsUpdating(false);
    }

    /**
     * Compares two objects to check if they have the same properties and values.
     * @param {any} obj1 - The first object to compare.
     * @param {any} obj2 - The second object to compare.
     * @returns {boolean} - True if the objects are equal, false otherwise.
     */
    function compareObjects(obj1: any, obj2: any): boolean {
        const keys1 = Object.keys(obj1);
        const keys2 = Object.keys(obj2);

        if (keys1.length !== keys2.length) {
            return false;
        }

        for (const key of keys1) {
            if (obj1[key] !== obj2[key]) {
                return false;
            }
        }
        return true;
    }
    /**
     * Renders a component that displays a list of markets and allows the user to select or deselect them.
     * @returns JSX element
     */
    return (
        <>
            <div className="p-8 w-full mx-auto">
                <div className="w-full min-w-full mx-auto">
                    {/* main market start here */}
                    <p className="text-black text-left font-normal text-lg mt-4">Main market <span className="text-rose-500 text-2xl font-semibold">&#42;</span></p>
                    <div className="bg-[#EEEEEE] h-10 rounded-lg  flex gap-1 pl-2 w-full relative items-start"
                        onClick={() => {
                            setmar((val: boolean) => !val);
                            setcur(false);
                            setcat(false);
                            setlan(false);
                            setort(false);
                        }}>
                        <div className="flex gap-x-2 flex-wrap relative">
                            {selmarket.map((value: any, i: number) => {
                                return (
                                    <div key={i} className="flex bg-white my-1 rounded-md py-1 px-2 items-center gap-x-4">
                                        <h1 className=" text-black font-semibold text-center">
                                            {`${value["name"]} - [${value["code"]}]`}
                                        </h1>
                                        <div className="grid place-items-center cursor-pointer" onClick={(e) => {
                                            e.stopPropagation();
                                            const ans = selmarket.filter((item) => item != value);
                                            setSelmarket(ans);
                                        }}>
                                            <FontAwesomeIcon icon={faCircleXmark} className="text-lg font-bold text-red-500"></FontAwesomeIcon>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        <div className="grow"></div>
                        <div
                            className="grid place-items-center px-2 w-12 text-primary rounded-lg relative h-10"
                        >
                            {mar ?
                                <FontAwesomeIcon className="cursor-pointer" icon={faXmark}></FontAwesomeIcon>
                                :
                                <MaterialSymbolsArrowDropDownRounded className="text-4xl cursor-pointer" />
                            }
                        </div>
                        <div className={`z-10 w-full  bg-[#eeeeee] absolute rounded-xl p-4 top-12 left-0 ${mar ? "" : "hidden"}`} onClick={(val) => setmar(false)}>
                            <div className="overflow-y-scroll no-scrollbar w-full" onClick={(e) => e.stopPropagation()}>
                                {market.map((val: any, i: number) => {
                                    return (
                                        <h1 onClick={() => {
                                            const value = {
                                                id: val["id"],
                                                name: val["name"],
                                                code: val["code"],
                                            }
                                            const serializedValue = JSON.stringify(value);
                                            const found = selmarket.some(data => JSON.stringify(data) === serializedValue);
                                            if (found) {
                                                let addcur = selmarket.filter((data) => !compareObjects(data, value));
                                                setSelmarket(addcur);
                                            } else {
                                                setSelmarket([value]);
                                            }
                                            setmar((val: boolean) => false);
                                        }} key={i} className={`text-lg text-left cursor-pointer font-normal rounded-md w-full px-4 py-2 my-1 border-2 hover:bg-gray-300  no-scrollbar`}>{val["code"]} - {val["name"]}</h1>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                    {/* <div className={`w-full h-screen bg-gray-300 bg-opacity-20 fixed top-0 left-0 ${mar ? "" : "hidden"} grid place-items-center bg-red-500`} onClick={(val) => setmar(false)}>
                        <div className="bg-white p-10 cursor-pointer" onClick={(e) => e.stopPropagation()}>
                            <div className="overflow-y-scroll no-scrollbar w-80 h-[350px]">
                                {market.map((val: any, i: number) => {
                                    return (
                                        <h1 onClick={() => {
                                            if (selmarket.includes(val)) {
                                                let addcur = selmarket.filter((data) => data != val);
                                                setSelmarket(addcur);
                                            } else {
                                                setSelmarket([val]);
                                            }
                                            setmar(false);
                                        }} key={i} className={`text-lg text-center font-normal rounded-md w-full my-2 border-2 ${selmarket.includes(val) ? "border-green-500 text-green-500" : "border-gray-800 text-black"}  no-scrollbar`}>{val["code"]} - {val["name"]}</h1>
                                    );
                                })}
                            </div>
                            <div onClick={() => {
                                setmar(false);
                            }} className="my-4 bg-red-500 bg-opacity-10 b-2 border-red-500 px-4 py-1 text-red-500 font-medium text-center cursor-pointer">Close</div>
                        </div>
                    </div> */}
                    {/* main market end here */}

                    /**
                     * Renders a section for other markets with a title and a clickable div.
                     * @returns JSX elements for the other markets section.
                     */
                    {/* other market start here */}
                    <p className="text-black text-left font-normal text-lg  mt-4">Other markets <span className="text-rose-500 text-2xl font-semibold">&#42;</span></p>
                    <div className="bg-[#EEEEEE] rounded-lg  flex gap-1 pl-2 w-full relative min-h-10"
                        onClick={() => {
                            setort((val: boolean) => !val);
                            setcur(false);
                            setcat(false);
                            setlan(false);
                            setmar(false);
                            // setort(false);
                        }}
                    >
                        <div className="flex gap-x-2 flex-wrap relative">
                            {selorthermarket.map((value: any, i: number) => {
                                return (
                                    <div key={i} className="flex bg-white my-1 rounded-md py-1 px-2 items-center gap-x-4">
                                        <h1 className=" text-black font-semibold text-center">
                                            {`${value["name"]} - [${value["code"]}]`}
                                        </h1>
                                        <div className="grid place-items-center cursor-pointer" onClick={(e) => {
                                            e.stopPropagation();
                                            const ans = selorthermarket.filter((item) => item != value);
                                            setSelorthermarket(ans);
                                        }}>
                                            <FontAwesomeIcon icon={faCircleXmark} className="text-lg font-bold text-red-500"></FontAwesomeIcon>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        <div className="grow"></div>
                        <div
                            className="grid place-items-center px-2 w-12 text-primary rounded-lg relative h-10"
                        >
                            {ort ?
                                <FontAwesomeIcon className="cursor-pointer" icon={faXmark}></FontAwesomeIcon>
                                :
                                <MaterialSymbolsArrowDropDownRounded className="text-4xl cursor-pointer" />
                            }
                        </div>

                        <div className={`z-10 w-full absolute top-12 bg-[#eeeeee]  left-0 ${ort ? "" : "hidden"} p-4`} onClick={val => setort(false)}>
                            <div className="overflow-y-scroll no-scrollbar max-h-[350px]" onClick={(e) => e.stopPropagation()}>
                                {market.map((val: any, i: number) => {
                                    return (
                                        <h1 onClick={() => {
                                            const value = {
                                                id: val["id"],
                                                name: val["name"],
                                                code: val["code"],
                                            }

                                            const serializedValue = JSON.stringify(value);
                                            const found = selorthermarket.some(data => JSON.stringify(data) === serializedValue);
                                            if (found) {
                                                let addcur = selorthermarket.filter((data) => !compareObjects(data, value));
                                                setSelorthermarket(addcur);
                                            } else {
                                                setSelorthermarket([...selorthermarket, value]);
                                            }
                                        }} key={i} className={`text-lg text-left font-normal hover:bg-gray-300 rounded-md w-full px-4 py-2 my-1 no-scrollbar`}>{val["code"]} - {val["name"]} </h1>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                    {/* <div className={`w-full h-screen bg-gray-300 bg-opacity-20 fixed top-0 left-0 ${ort ? "" : "hidden"} grid place-items-center`} onClick={val => setort(false)}>
                        <div className="bg-white p-10 cursor-pointer" onClick={(e) => e.stopPropagation()}>
                            <div className="w-80 overflow-y-scroll no-scrollbar h-[350px]">
                                {market.map((val: any, i: number) => {
                                    return (
                                        <h1 onClick={() => {
                                            if (selorthermarket.includes(val)) {
                                                let addcur = selorthermarket.filter((data) => data != val);
                                                setSelorthermarket(addcur);
                                            } else {
                                                setSelorthermarket([...selorthermarket, val]);
                                            }
                                        }} key={i} className={`text-lg text-center font-normal rounded-md w-full my-2 border-2 ${selorthermarket.includes(val) ? "border-green-500 text-green-500" : "border-gray-800 text-black"}  no-scrollbar`}>{val["code"]} - {val["name"]} </h1>
                                    );
                                })}
                            </div>
                            <div onClick={() => {
                                setort(false);
                            }} className="my-4 bg-red-500 bg-opacity-10 b-2 border-red-500 px-4 py-1 text-red-500 font-medium text-center cursor-pointer">Close</div>
                        </div>
                    </div> */}
                    {/* other market end here */}

                    {/* category start here */}
                    <p className="text-black text-left font-normal text-lg  mt-4">Category <span className="text-rose-500 text-2xl font-semibold">&#42;</span></p>
                    <div className="bg-[#EEEEEE] min-h-10 rounded-lg  flex gap-1 items-start pl-2 w-full relative" onClick={() => {
                        setcat((val: boolean) => !val);
                        setcur(false);
                        // setcat(false);
                        setlan(false);
                        setmar(false);
                        setort(false);
                    }}>
                        <div className="flex gap-x-2 flex-wrap relative">
                            {selcategory.map((value: any, i: number) => {
                                return (
                                    <div key={i} className="flex bg-white my-1 rounded-md py-1 px-2 items-center gap-x-4">
                                        <h1 className=" text-black font-semibold text-center">
                                            {`${value["categoryName"]} - [${value["categoryCode"]}]`}
                                        </h1>

                                        <div className="grid place-items-center cursor-pointer" onClick={(e) => {
                                            e.stopPropagation();
                                            const ans = selcategory.filter((item) => item != value);
                                            setSelcategory(ans);
                                        }}>
                                            <FontAwesomeIcon icon={faCircleXmark} className="text-lg font-bold text-red-500"></FontAwesomeIcon>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        <div className="grow"></div>
                        <div
                            className="grid place-items-center px-2 w-12 text-primary rounded-lg relative h-10"
                        >
                            {cat ?
                                <FontAwesomeIcon className="cursor-pointer" icon={faXmark}></FontAwesomeIcon>
                                :
                                <MaterialSymbolsArrowDropDownRounded className="text-4xl cursor-pointer" />
                            }
                        </div>


                        <div className={`z-10 w-full bg-[#eeeeee] absolute top-12 left-0 ${cat ? "" : "hidden"} p-4`} onClick={val => setcat(false)}>
                            <div className="overflow-y-scroll no-scrollbar h-[350px]" onClick={(e) => e.stopPropagation()}>
                                {category.map((val: any, i: number) => {
                                    return (
                                        <h1 onClick={() => {
                                            const value = {
                                                id: val["id"],
                                                categoryName: val["categoryName"],
                                                categoryCode: val["categoryCode"],
                                            }
                                            const serializedValue = JSON.stringify(value);
                                            const found = selcategory.some(data => JSON.stringify(data) === serializedValue);

                                            if (found) {
                                                let addcur = selcategory.filter((data) => !compareObjects(data, value));
                                                setSelcategory(addcur);
                                            } else {
                                                setSelcategory([...selcategory, value]);
                                            }
                                        }} key={i} className={`text-lg text-left font-normal rounded-md w-full hover:bg-gray-300 px-4 py-2 my-1 no-scrollbar`}>{val["categoryCode"]} - {val["categoryName"]}   </h1>
                                    );
                                })}
                            </div>
                        </div>
                    </div>


                    {/* <div className={`w-full h-screen bg-gray-300 bg-opacity-20 fixed top-0 left-0 ${cat ? "" : "hidden"} grid place-items-center`} onClick={val => setcat(false)}>
                        <div className="bg-white p-10 cursor-pointer" onClick={(e) => e.stopPropagation()}>
                            <div className="w-80 overflow-y-scroll no-scrollbar h-[350px]">
                                {category.map((val: any, i: number) => {
                                    return (
                                        <h1 onClick={() => {
                                            if (selcategory.includes(val)) {
                                                let addcur = selcategory.filter((data) => data != val);
                                                setSelcategory(addcur);
                                            } else {
                                                setSelcategory([...selcategory, val]);
                                            }
                                        }} key={i} className={`text-lg text-center font-normal rounded-md w-full my-2 border-2 ${selcategory.includes(val) ? "border-green-500 text-green-500" : "border-gray-800 text-black"}  no-scrollbar`}>{val["categoryCode"]} - {val["categoryName"]}   </h1>
                                    );
                                })}
                            </div>
                            <div onClick={() => {
                                setcat(false);
                            }} className="my-4 bg-red-500 bg-opacity-10 b-2 border-red-500 px-4 py-1 text-red-500 font-medium text-center cursor-pointer">Close</div>
                        </div>
                    </div> */}
                    {/* category end here */}



                    {/* currency start here */}
                    <p className="text-black text-left font-normal text-lg  mt-4">Account currency <span className="text-rose-500 text-2xl font-semibold">&#42;</span></p>
                    <div className="bg-[#EEEEEE] min-h-10 rounded-lg  flex gap-1 pl-2 w-full relative" onClick={() => {
                        setcur((val: boolean) => !val);
                        // setcur(false);
                        setcat(false);
                        setlan(false);
                        setmar(false);
                        setort(false);
                    }}>
                        <div className="flex gap-x-2 flex-wrap relative">
                            {selcurrency.map((value: any, i: number) => {
                                return (
                                    <div key={i} className="flex bg-white my-1 rounded-md py-1 px-2 items-center gap-x-4">
                                        <h1 className=" text-black font-semibold text-center w-32">
                                            {`${value["currencyName"]} - [${value["currencyCode"]}]`}
                                        </h1>
                                        <div className="grid place-items-center cursor-pointer" onClick={(e) => {
                                            e.stopPropagation();
                                            const ans = selcurrency.filter((item) => item != value);
                                            setSelcurrency(ans);
                                        }}>
                                            <FontAwesomeIcon icon={faCircleXmark} className="text-lg font-bold text-red-500"></FontAwesomeIcon>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        <div className="grow"></div>
                        <div
                            className="grid place-items-center px-2 w-12 text-primary rounded-lg relative h-10"
                        >
                            {cur ?
                                <FontAwesomeIcon className="cursor-pointer" icon={faXmark}></FontAwesomeIcon>
                                :
                                <MaterialSymbolsArrowDropDownRounded className="text-4xl cursor-pointer" />
                            }
                        </div>

                        <div className={`z-10 w-full bg-[#eeeeee] absolute top-12 left-0 ${cur ? "" : "hidden"} p-4`} onClick={val => setcur(false)}>
                            <div className="overflow-y-scroll no-scrollbar h-[300px]" onClick={(e) => e.stopPropagation()}>
                                {currency.map((val: any, i: number) => {
                                    return (
                                        <h1 onClick={() => {
                                            const value = {
                                                id: val["id"],
                                                currencyName: val["currencyName"],
                                                currencyCode: val["currencyCode"],
                                                currencyAsciiSymbol: val["currencyAsciiSymbol"],
                                            }
                                            const serializedValue = JSON.stringify(value);
                                            const found = selcurrency.some(data => JSON.stringify(data) === serializedValue);

                                            if (found) {
                                                let addcur = selcurrency.filter((data) => !compareObjects(data, value));
                                                setSelcurrency(addcur);
                                            } else {
                                                setSelcurrency([value]);
                                            }
                                            setcur(false);
                                        }} key={i} className={`text-lg text-left cursor-pointer font-normal rounded-md w-full hover:bg-gray-300 px-4 py-2 my-1`}>{val["currencyCode"]} - {val["currencyName"]}  {he.decode(val["currencyAsciiSymbol"])} </h1>
                                    );
                                })}
                            </div>
                        </div>

                    </div>
                    {/* <div className={`w-full h-screen bg-gray-300 bg-opacity-20 fixed top-0 left-0 ${cur ? "" : "hidden"} grid place-items-center`} onClick={val => setcur(false)}>
                        <div className="bg-white p-10 cursor-pointer" onClick={(e) => e.stopPropagation()}>
                            <div className="overflow-y-scroll no-scrollbar h-[350px]">
                                {currency.map((val: any, i: number) => {
                                    return (
                                        <h1 onClick={() => {
                                            if (selcurrency.includes(val)) {
                                                let addcur = selcurrency.filter((data) => data != val);
                                                setSelcurrency(addcur);
                                            } else {
                                                setSelcurrency([val]);
                                            }
                                            setcur(false);
                                        }} key={i} className={`text-lg text-center font-normal rounded-md w-full my-2 border-2 ${selcurrency.includes(val) ? "border-green-500 text-green-500" : "border-gray-800 text-black"}  no-scrollbar`}>{val["currencyCode"]} - {val["currencyName"]}  {he.decode(val["currencyAsciiSymbol"])} </h1>
                                    );
                                })}
                            </div>
                            <div onClick={() => {
                                setcur(false);
                            }} className="my-4 bg-red-500 bg-opacity-10 b-2 border-red-500 px-4 py-1 text-red-500 font-medium text-center cursor-pointer">Close</div>
                        </div>
                    </div> */}
                    {/* currency end here */}

                    {/* languages start here */}
                    <p className="text-black text-left font-normal text-lg  mt-4">Languages <span className="text-rose-500 text-2xl font-semibold">&#42;</span></p>
                    <div className="bg-[#EEEEEE] min-h-10 rounded-lg  flex gap-1 pl-2 w-full relative" onClick={() => {
                        setlan((val: boolean) => !val);
                        setcur(false);
                        setcat(false);
                        // setlan(false);
                        setmar(false);
                        setort(false);
                    }}>
                        <div className="flex gap-x-2 flex-wrap relative">
                            {sellanguages.map((value: any, i: number) => {
                                return (
                                    <div key={i} className="flex bg-white my-1 rounded-md py-1 px-2 items-center gap-x-4">
                                        <h1 className=" text-black font-semibold text-center w-32">
                                            {`${value["languageName"]} - [${value["languageCode"]}]`}
                                        </h1>
                                        <div className="grid place-items-center cursor-pointer" onClick={(e) => {
                                            e.stopPropagation();
                                            const ans = sellanguages.filter((item) => item != value);
                                            setSellanguages(ans);
                                        }}>
                                            <FontAwesomeIcon icon={faCircleXmark} className="text-lg font-bold text-red-500"></FontAwesomeIcon>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        <div className="grow"></div>
                        <div
                            className="grid place-items-center px-2 w-12 text-primary rounded-lg relative h-10"
                        >
                            {lan ?
                                <FontAwesomeIcon className="cursor-pointer" icon={faXmark}></FontAwesomeIcon>
                                :
                                <MaterialSymbolsArrowDropDownRounded className="text-4xl cursor-pointer" />
                            }
                        </div>

                        <div className={`z-10 w-full bg-[#eeeeee] absolute top-12 left-0 ${lan ? "" : "hidden"} p-4`} onClick={val => setlan(false)}>
                            <div className="overflow-y-scroll no-scrollbar h-[300px]" onClick={(e) => e.stopPropagation()}>
                                {languages.map((val: any, i: number) => {
                                    return (
                                        <h1 onClick={() => {
                                            const value = {
                                                id: val["id"],
                                                languageName: val["languageName"],
                                                languageCode: val["languageCode"],
                                                languageAsciiSymbol: val["languageAsciiSymbol"],
                                            }
                                            const serializedValue = JSON.stringify(value);
                                            const found = sellanguages.some(data => JSON.stringify(data) === serializedValue);
                                            if (found) {
                                                let addcur = sellanguages.filter((data) => !compareObjects(data, value));
                                                setSellanguages(addcur);
                                            } else {
                                                setSellanguages([...sellanguages, value]);
                                            }
                                        }} key={i} className={`text-lg text-left hover:bg-gray-300 font-normal cursor-pointer rounded-md w-full my-2`}>{val["languageCode"]} - {val["languageName"]}  {he.decode(val["languageAsciiSymbol"])} </h1>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                    {/* <div className={`w-full h-screen bg-gray-300 bg-opacity-20 fixed top-0 left-0 ${lan ? "" : "hidden"} grid place-items-center`} onClick={val => setlan(false)}>
                        <div className="bg-white p-10 cursor-pointer" onClick={(e) => e.stopPropagation()}>
                            <div className="w-80 overflow-y-scroll no-scrollbar h-[350px]">
                                {languages.map((val: any, i: number) => {
                                    return (
                                        <h1 onClick={() => {
                                            if (sellanguages.includes(val)) {
                                                let addcur = sellanguages.filter((data) => data != val);
                                                setSellanguages(addcur);
                                            } else {
                                                setSellanguages([...sellanguages, val]);
                                            }
                                        }} key={i} className={`text-lg text-center font-normal rounded-md w-full my-2 border-2 ${sellanguages.includes(val) ? "border-green-500 text-green-500" : "border-gray-800 text-black"}  no-scrollbar`}>{val["languageCode"]} - {val["languageName"]}  {he.decode(val["languageAsciiSymbol"])} </h1>
                                    );
                                })}
                            </div>
                            <div onClick={() => {
                                setlan(false);
                            }} className="my-4 bg-red-500 bg-opacity-10 b-2 border-red-500 px-4 py-1 text-red-500 font-medium text-center cursor-pointer">Close</div>
                        </div>
                    </div> */}
                    {/* languages end here */}
                    {(error == "" || error == null || error == undefined) ? null :
                        <NOTICEAlerts message={error}></NOTICEAlerts>
                    }

                    <div className="flex mt-4 gap-3">
                        <button className="bg-[#eeeeee] text-center rounded-lg text-black font-medium cusfont w-full py-2"
                            onClick={gotoback}
                        >
                            Back
                        </button>

                        {isUpdating ?
                            <div className="bg-primary text-center rounded-lg text-white font-medium cusfont w-full py-2">
                                Updating...
                            </div>
                            :
                            <button className="bg-primary text-center rounded-lg text-white font-medium cusfont w-full py-2"
                                onClick={gotonext}
                            >
                                Next
                            </button>}
                    </div>
                    <Form method="post" className="hidden">
                        <input type="hidden" name="id" value={userID.toString()} />
                        <button ref={nextButton} name="submit">Submit</button>
                    </Form>
                </div>
            </div>
        </>
    );
}

export default SecondPage;


export const action: ActionFunction = async ({ request }: ActionArgs) => {
    const formData = await request.formData();
    const value = Object.fromEntries(formData);

    const userdata = await axios({
        method: 'post',
        url: `${BaseUrl}/api/getuser`,
        data: { "id": value.id },
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
    } else {

        let userdatasave = userdata.data.data[0];
        delete userdatasave.languages;
        delete userdatasave.platforms;
        delete userdatasave.categories;
        delete userdatasave.market;

        return redirect("/home/profilecomplete/thirdpage", {
            headers: {
                "Set-Cookie": await userPrefs.serialize({ user: userdatasave, isLogin: true }),
            },
        });
    }
}
