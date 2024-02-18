import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { DownloadApp } from "../utils/downloadapp";
import {
  faLocationDot,
  faMailBulk,
  faPhone,
} from "@fortawesome/free-solid-svg-icons";
import { CusButton } from "../utils/buttont";
import { useRef, useState } from "react";
import { BaseUrl } from "~/const";
import axios from "axios";
import { NOTICEAlerts, SUCCESSAlerts } from "../utils/alert";

interface ContactPageProps {
  address_1: string;
  address_2: string;
  address_3: string;
}

const ContactPage: React.FC<ContactPageProps> = (props: ContactPageProps) => {
  const nameRef = useRef<HTMLInputElement | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [sus, setSus] = useState<string | null>(null);
  const messageRef = useRef<HTMLTextAreaElement | null>(null);
  const [contactnumber, setContactnumber] = useState<number>();
  const [isBrand, setIsBrand] = useState<boolean>(false);

  const handelcontent = (e: any) => {
    setContactnumber(e.target.value.replace(/\D/g, ""));
  };
  /**
   * Submits a form with user input data to the server.
   * @returns None
   */
  const submit = async () => {
    setSus(null);
    setError(null);
    if (
      nameRef.current?.value == null ||
      nameRef.current?.value == undefined ||
      nameRef.current?.value == ""
    ) {
      setError("Fill the name");
    } else if (
      contactnumber == null ||
      contactnumber == undefined ||
      contactnumber == 0
    ) {
      setError("Fill the contact number");
    }
    // else if (contactnumber.toString().length != 10) {
    //   setError("Enter a 10 digit valid contact number");
    // }
    else if (
      messageRef.current?.value == null ||
      messageRef.current?.value == undefined ||
      messageRef.current?.value == ""
    ) {
      setError("Fill the message.");
    } else {
      const req = {
        name: nameRef.current?.value,
        number: contactnumber,
        isBrand: isBrand ? 1 : 0,
        message: messageRef.current?.value,
      };

      const data = await axios({
        method: "post",
        url: `${BaseUrl}/api/add-contact`,
        data: req,
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
      if (data.data.status == false) {
        return setError(data.data.message);
      } else {
        nameRef.current!.value = "";
        messageRef.current!.value = "";
        setContactnumber(undefined);
        setError(null);
        setSus("Message sent!");
      }
    }
  };

  /**
   * Renders a contact form with input fields for name, phone number, and message.
   * @returns JSX elements representing the contact form.
   */
  return (
    <>
      <div className="w-full px-6 sm:px-16">
        <div className="bg-[#EFEFEF] rounded-2xl sm:p-0 p-4">
          <div className="w-full md:w-3/5 lg:w-4/6 mx-auto mb-10 pt-20 pb-40">
            <h1 className="text-5xl font-bold text-primary flex">
              Love to hear from you
            </h1>
            <h1 className="text-5xl  font-bold text-primary flex">
              Get in touch <img src="./images/icons/hand.png" alt="error" />
            </h1>
            <div className="flex gap-4 flex-col lg:flex-row items-center w-full">
              <div className=" w-60 py-2 px-4 rounded-md shadow-xl bg-white text-center text-primary font-medium flex gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="currentColor"
                    d="M12 4c2.2 0 4 1.8 4 4c0 2.1-2.1 5.5-4 7.9c-1.9-2.5-4-5.8-4-7.9c0-2.2 1.8-4 4-4m0-2C8.7 2 6 4.7 6 8c0 4.5 6 11 6 11s6-6.6 6-11c0-3.3-2.7-6-6-6m0 4c-1.1 0-2 .9-2 2s.9 2 2 2s2-.9 2-2s-.9-2-2-2m8 13c0 2.2-3.6 4-8 4s-8-1.8-8-4c0-1.3 1.2-2.4 3.1-3.2l.6.9c-1 .5-1.7 1.1-1.7 1.8c0 1.4 2.7 2.5 6 2.5s6-1.1 6-2.5c0-.7-.7-1.3-1.8-1.8l.6-.9c2 .8 3.2 1.9 3.2 3.2Z"
                  />
                </svg>{" "}
                {props.address_1}
              </div>
              <div className="w-60 py-2 px-4 rounded-md shadow-xl bg-white text-center text-primary font-medium flex gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="currentColor"
                    d="M19 12q0-2.925-2.038-4.963T12 5V3q1.875 0 3.513.713t2.85 1.924q1.212 1.213 1.925 2.85T21 12h-2Zm-4 0q0-1.25-.875-2.125T12 9V7q2.075 0 3.538 1.463T17 12h-2Zm4.95 9q-3.225 0-6.288-1.438t-5.425-3.8q-2.362-2.362-3.8-5.425T3 4.05q0-.45.3-.75t.75-.3H8.1q.35 0 .625.225t.325.575l.65 3.5q.05.35-.013.638T9.4 8.45L6.975 10.9q1.05 1.8 2.638 3.375T13.1 17l2.35-2.35q.225-.225.588-.338t.712-.062l3.45.7q.35.075.575.338T21 15.9v4.05q0 .45-.3.75t-.75.3ZM6.025 9l1.65-1.65L7.25 5H5.025q.125 1.025.35 2.025T6.025 9Zm8.95 8.95q.975.425 1.988.675T19 18.95v-2.2l-2.35-.475l-1.675 1.675ZM6.025 9Zm8.95 8.95Z"
                  />
                </svg>{" "}
                {props.address_2}
              </div>
              <div className="w-60 py-2 px-4 rounded-md shadow-xl bg-white text-center text-primary font-medium flex gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="currentColor"
                    d="M22 6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6zm-2 0l-8 5l-8-5h16zm0 12H4V8l8 5l8-5v10z"
                  />
                </svg>{" "}
                {props.address_3}
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl my-10 shadow-xl">
              <div className="flex">
                <button
                  onClick={() => setIsBrand(true)}
                  className={`w-40 rounded-md font-semibold text-lg border-2 border-primary py-1 ${isBrand ? "text-white bg-primary" : "text-primary bg-white"
                    }`}
                >
                  I'm a brand
                </button>
                <div className="w-10"></div>
                <button
                  onClick={() => setIsBrand(false)}
                  className={`w-40 rounded-md font-semibold text-lg border-secondary border-2 py-2 ${isBrand
                    ? "text-secondary bg-white"
                    : "text-white bg-secondary"
                    }`}
                >
                  I'm a Influencer
                </button>
                {/* <CusButton
                  text="I'am a brand"
                  textColor={isBrand ? "text-white" : "text-primary"}
                  background={isBrand ? "bg-primary" : "bg-white"}
                  border="border-primary border-2"
                ></CusButton>
                <div className="w-10"></div>
                <CusButton
                  text="I'am a Influencer"
                  background="bg-secondary"
                ></CusButton> */}
              </div>
              <div className="flex">
                <div className="grow">
                  <h2 className="text-left text-md font-semibold text-primary py-2">
                    Your Name
                  </h2>
                  <div className="flex gap-2 py-1 px-2 border-2 border-gray-300 focus:border-gray-300 rounded-md h-12 items-center">
                    <svg
                      className="opacity-50"
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 14 14"
                    >
                      <g
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <circle cx="7" cy="3.75" r="3.25" />
                        <path d="M13.18 13.5a6.49 6.49 0 0 0-12.36 0Z" />
                      </g>
                    </svg>
                    <input
                      ref={nameRef}
                      type={"text"}
                      className="outline-none w-full"
                      placeholder="Enter your name"
                    />
                  </div>
                </div>
                <div className="w-10"></div>
                <div className="grow">
                  <h2 className="text-left text-md font-semibold text-primary py-2">
                    Phone
                  </h2>
                  <div className="flex gap-2 py-1 px-2 border-2 border-gray-300 focus:border-gray-300 rounded-md h-12 items-center">
                    <svg
                      className="opacity-50"
                      xmlns="http://www.w3.org/2000/svg"
                      width="28"
                      height="28"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fill="currentColor"
                        d="M16.73 2.065H7.27a2.386 2.386 0 0 0-2.24 2.5v14.87a2.386 2.386 0 0 0 2.24 2.5h9.46a2.386 2.386 0 0 0 2.24-2.5V4.565a2.386 2.386 0 0 0-2.24-2.5Zm1.24 17.37a1.391 1.391 0 0 1-1.24 1.5H7.27a1.391 1.391 0 0 1-1.24-1.5V4.565a1.391 1.391 0 0 1 1.24-1.5H8.8v.51a1 1 0 0 0 1 1h4.4a1 1 0 0 0 1-1v-.51h1.53a1.391 1.391 0 0 1 1.24 1.5Z"
                      />
                      <path
                        fill="currentColor"
                        d="M10 18.934h4a.5.5 0 0 0 0-1h-4a.5.5 0 0 0 0 1Z"
                      />
                    </svg>
                    <input
                      onChange={handelcontent}
                      value={contactnumber}
                      type={"text"}
                      className="outline-none w-full"
                      placeholder="Enter your phone number"
                    />
                  </div>
                </div>
              </div>
              <h2 className="text-left text-md font-semibold text-primary py-2">
                Message
              </h2>
              <textarea
                ref={messageRef}
                className="p-4 w-full h-60 outline-none border-2 border-gray-300 focus:border-gray-300 rounded-md resize-none"
                placeholder="Your message"
              ></textarea>
              {error == "" || error == null || error == undefined ? null : (
                <NOTICEAlerts message={error}></NOTICEAlerts>
              )}
              {sus == "" || sus == null || sus == undefined ? null : (
                <SUCCESSAlerts message={sus}></SUCCESSAlerts>
              )}
              <div onClick={submit}>
                <CusButton
                  text="Send Message"
                  background="bg-primary"
                ></CusButton>
              </div>
            </div>
          </div>
        </div>
        <div className="w-full md:w-3/5 lg:w-4/6 mx-auto -translate-y-40">
          <DownloadApp></DownloadApp>
        </div>
      </div>
    </>
  );
};
export default ContactPage;
