import { faThumbsDown, faThumbsUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { LoaderArgs, LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { BaseUrl } from "~/const";
import { userPrefs } from "~/cookies";

import Stripe from "stripe";
import { NOTICEAlerts, SUCCESSAlerts } from "~/components/utils/alert";

/**
 * Creates a new instance of the Stripe object with the provided API key and options.
 * @param {string} apiKey - The Stripe API key.
 * @param {object} options - Additional options for the Stripe object.
 * @returns {Stripe} A new instance of the Stripe object.
 */
const stripe = new Stripe(
  "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",
  { apiVersion: "2022-11-15" }
);

/**
 * Loader function that retrieves data for a specific campaign.
 * @param {LoaderArgs} props - The loader arguments.
 * @returns {Promise<Response>} - A promise that resolves to a JSON response containing campaign data.
 */
export const loader: LoaderFunction = async (props: LoaderArgs) => {
  const baseUrl = props.request.url.split("/").slice(0, 3).join("/");
  const camId = props.params.camId;
  const draftId = props.params.draftId;
  const brandId = props.params.brandId;

  const cookieHeader = props.request.headers.get("Cookie");
  const cookie = await userPrefs.parse(cookieHeader);

  const camp = await axios({
    method: "post",
    url: `${BaseUrl}/api/campaign-search`,
    data: { id: camId },
  });

  return json({
    campaignId: camId,
    userId: cookie.user.id,
    draftId: draftId,
    brandId: brandId,
    cpp: camp.data.data[0].costPerPost,
    // currency: cookie.user.currency.code,
    currency: "USD",
    name: camp.data.data[0].campaignName,
    baseUrl: baseUrl,
  });
};

/**
 * A React functional component that renders a payment request form.
 * @returns {JSX.Element} - The rendered payment request form.
 */
const PaymentRequest: React.FC = (): JSX.Element => {
  const loaderdata = useLoaderData();
  const brandId = loaderdata.brandId;
  const campaignId = loaderdata.campaignId;
  const userId = loaderdata.userId;
  const draftId = loaderdata.draftId;
  const cpp = loaderdata.cpp;
  const currency = loaderdata.currency;
  const campaignName = loaderdata.name;

  const baseUrl = loaderdata.baseUrl;

  const [submit, setSubmit] = useState<boolean>(false);

  const [draftdata, setDraftdata] = useState<any>("");

  const init = async () => {
    const req = {
      search: {
        type: "3",
        campaign: campaignId,
        brand: brandId,
        influencer: userId,
      },
    };
    const apireq = await axios({
      method: "post",
      url: `${BaseUrl}/api/search-review`,
      data: req,
    });
    if (apireq.data.data.length > 0) {
      setSubmit(true);
    }

    let req1 = {
      search: {
        status: "3",
        campaign: campaignId,
        toUser: userId,
      },
    };

    const apireq1 = await axios({
      method: "post",
      url: `${BaseUrl}/api/search-draft`,
      data: req1,
    });
    if (apireq1.data.status) {
      setDraftdata((val: any) => apireq1.data.data[0]);
    }
  };

  useEffect(() => {
    init();
  }, []);

  return (
    <>
      <div className="flex gap-4 flex-wrap flex-row pt-10">
        <div>
          {draftdata == null ||
          draftdata == undefined ||
          draftdata == "" ? null : (
            <div className="bg-white rounded-lg shadow-lg w-80">
              <img
                src={draftdata.influencer.pic}
                alt="influencer pic"
                className="w-full h-44 rounded-t-md object-top object-cover"
              />
              <div className="p-4">
                <p className="text-xl font-medium mt-4">
                  {draftdata.influencer.name.split("@")[0]}
                </p>

                <p className="mt-2 text-xl font-medium">
                  Campaign Draft Descriptin
                </p>
                <p className="text-md font-medium mt-1">
                  {draftdata.description}
                </p>
                <p className="mt-4 text-lg font-medium">Platforms</p>
                <div>
                  <div className="rounded-full p-[0.15rem] border-2 border-blue-500 h-10 w-10">
                    <img
                      src={draftdata.handle.platform.logo}
                      alt="platform"
                      className="w-full h-full shrink-0 rounded-md object-fill object-center"
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <a
                    target="_blank"
                    className="mt-2 text-lg bg-[#fbca8e] font-semibold rounded-md inline-block my-2 py-2 px-4  text-black  w-full text-center"
                    href={draftdata.attach01}
                  >
                    View document
                  </a>
                  {draftdata.linkCampaign == undefined ||
                  draftdata.linkCampaign == null ||
                  draftdata.linkCampaign == "" ? null : (
                    <a
                      target="_blank"
                      className="mt-2 text-lg bg-primary font-semibold rounded-md inline-block my-2 py-2 px-4  text-white  w-full text-center"
                      href={
                        draftdata.linkCampaign.toString().startsWith("http")
                          ? draftdata.linkCampaign
                          : `https://${draftdata.linkCampaign}`
                      }
                    >
                      View campaign
                    </a>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
        {}
        <div>
          <Schedule draftid={draftId}></Schedule>
        </div>
        <div>
          <UserPaymentRequest
            userid={userId}
            campaingid={campaignId}
            currency={currency}
            draft={draftId}
            baseUrl={baseUrl}
          ></UserPaymentRequest>
        </div>
      </div>
    </>
  );
};

export default PaymentRequest;

/**
 * Represents the properties required for a user payment request.
 * @typedef {Object} UserPaymentRequestProps
 * @property {string} campaingid - The ID of the campaign.
 * @property {string} userid - The ID of the user.
 * @property {string} currency - The currency for the payment.
 * @property {string} draft - The draft information for the payment.
 * @property {string} baseUrl - The base URL for the payment request.
 */
type UserPaymentRequestProps = {
  campaingid: string;
  userid: string;
  currency: string;
  draft: string;
  baseUrl: string;
};

/**
 * A functional component that displays a user payment request form.
 * @param {UserPaymentRequestProps} props - The props object containing the necessary data for the payment request.
 * @returns The rendered user payment request form.
 */
const UserPaymentRequest = (props: UserPaymentRequestProps) => {
  const [respayment, setRequestPayment] = useState<any[]>([]);

  const [acceptbox, setAcceptbox] = useState<boolean>(false);
  const [rejectbox, setrejectbox] = useState<boolean>(false);

  const [error, setError] = useState<string | null>(null);
  const [id, setId] = useState<string | null>(null);
  const [amount, setAmount] = useState<string | null>(null);

  const init = async () => {
    let req = {
      search: {
        campaigndraft: props.draft,
        campaign: props.campaingid,
        influencer: props.userid,
      },
    };
    const responseData = await axios.post(`${BaseUrl}/api/get-req-pay`, req);
    if (responseData.data.status == true) {
      setRequestPayment(responseData.data.data);
    }
  };

  useEffect(() => {
    init();
  }, []);

  const rejectRequest = async () => {
    let req = { id: id, status: "3" };
    const responseData = await axios.post(`${BaseUrl}/api/update-payment`, req);
    if (responseData.data.staus == false)
      return setError(responseData.data.message);
    setrejectbox(false);
    window.location.reload();
  };

  const handlepayment = async (amount: string, id: string) => {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Example Product",
              images: [
                "https://plus.unsplash.com/premium_photo-1684952849219-5a0d76012ed2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1032&q=80",
              ],
            },
            unit_amount: parseInt(amount) * 100, // Amount in cents
          },
          quantity: 1,
        },
      ],
      success_url: `${props.baseUrl}/success/${id}`,
      cancel_url: `${props.baseUrl}/cancel`,
    });
    window.location.assign(session.url == null ? "" : session.url);
  };

  
  return (
    <>
      <div
        className={`fixed top-0 left-0  h-screen w-full bg-slate-900 bg-opacity-10 place-items-center ${
          acceptbox ? "grid" : "hidden"
        }`}
      >
        <div className="bg-white w-72 shadow-lg p-4 rounded-lg">
          <p className="text-center font-medium text-2xl">Accept</p>
          <div className="w-full bg-gray-400 h-[1px] my-2"></div>
          <p className="text-center font-medium text-gray-800">
            Are you sure you want to accept this payment?
          </p>
          {error == "" || error == null || error == undefined ? null : (
            <NOTICEAlerts message={error}></NOTICEAlerts>
          )}
          <div className="flex mt-2">
            <button
              onClick={() => {
                setAcceptbox(false);
              }}
              className="bg-white rounded-xl text-red-500 font-normal border-2 border-red-500 py-1 px-2 w-28 hover:text-white hover:bg-red-500"
            >
              <FontAwesomeIcon
                className="mx-2"
                icon={faThumbsDown}
              ></FontAwesomeIcon>
              Cancel
            </button>
            <div className="grow"></div>
            <button
              onClick={() => handlepayment(amount!, id!)}
              className="bg-white rounded-xl text-green-500 font-normal border-2 border-green-500 py-1 px-2 w-28 hover:text-white hover:bg-green-500"
            >
              <FontAwesomeIcon
                className="mx-2"
                icon={faThumbsUp}
              ></FontAwesomeIcon>
              Accept
            </button>
          </div>
        </div>
      </div>
      <div
        className={`fixed top-0 left-0  h-screen w-full bg-slate-900 bg-opacity-10 place-items-center ${
          rejectbox ? "grid" : "hidden"
        }`}
      >
        <div className="bg-white w-72 shadow-lg p-4 rounded-lg">
          <p className="text-center font-medium text-2xl">Reject</p>
          <p className="text-center font-medium text-gray-800">
            Are you sure you want to reject this payment?
          </p>
          {error == "" || error == null || error == undefined ? null : (
            <NOTICEAlerts message={error}></NOTICEAlerts>
          )}
          <div className="flex mt-2">
            <button
              onClick={() => {
                setrejectbox(false);
              }}
              className="bg-white rounded-xl text-red-500 font-normal border-2 border-red-500 py-1 px-2 w-28 hover:text-white hover:bg-red-500"
            >
              <FontAwesomeIcon
                className="mx-2"
                icon={faThumbsDown}
              ></FontAwesomeIcon>
              Cancel
            </button>
            <div className="grow"></div>
            <button
              onClick={rejectRequest}
              className="bg-white rounded-xl text-green-500 font-normal border-2 border-green-500 py-1 px-2 w-28 hover:text-white hover:bg-green-500"
            >
              <FontAwesomeIcon
                className="mx-2"
                icon={faThumbsUp}
              ></FontAwesomeIcon>
              Reject
            </button>
          </div>
        </div>
      </div>
      <div className="p-4 rounded-xl shadow-xl bg-white w-80">
        {respayment.length == 0 ? (
          <>
            <div>No payment request is pending</div>
          </>
        ) : (
          <div>
            <p className="text-md font-medium">Requested Payment</p>
            <div className="w-full bg-gray-400 h-[1px] my-2"></div>
            <div className="flex flex-col flex-wrap gap-6">
              {respayment.map((val: any, index: number) => {
                return (
                  <div
                    key={index}
                    className="p-4 bg-white rounded-lg shadow-lg w-72"
                  >
                    <p className="text-lg font-semibold text-primary">
                      Scheduled
                    </p>
                    <div className="w-full h-[1px] bg-gray-400"></div>
                    <div className="w-full h-[2px] bg-gray-700"></div>
                    <div className="flex mt-4">
                      <img
                        src={val.influencer.pic}
                        alt="influencer pic"
                        className="w-10 h-10 shrink-0 rounded-md object-center object-cover"
                      />
                      <div className="ml-2">
                        <p className="text-md font-medium">
                          {val.influencer.name.split("@")[0]}
                        </p>
                        <p className="text-sm font-medium">
                          {val.influencer.email}
                        </p>
                      </div>
                    </div>
                    <p className="mt-2 text-md font-medium">Amount</p>
                    <p className="text-sm font-medium">
                      {val.amount.toString().split(".")[0]} {props.currency}
                    </p>
                    {parseInt(val.status.code) == 2 ? (
                      <p className="py-1 px-4 text-center text-white bg-green-500 rounded-md my-2">
                        Accepted
                      </p>
                    ) : parseInt(val.status.code) == 3 ? (
                      <p className="py-1 px-4 text-center text-white bg-red-500 rounded-md my-2">
                        Rejected
                      </p>
                    ) : (
                      <div className="flex gap-4 mt-2">
                        <button
                          onClick={() => {
                            setId(val.id);
                            setAmount(val.amount);
                            setAcceptbox(true);
                          }}
                          className="bg-white  text-green-500 font-normal border-2 border-green-500 py-1 px-2 w-28 hover:text-white hover:bg-green-500"
                        >
                          <FontAwesomeIcon
                            className="mx-2"
                            icon={faThumbsUp}
                          ></FontAwesomeIcon>
                          Accept
                        </button>
                        <button
                          onClick={() => {
                            setId(val.id);
                            setrejectbox(true);
                          }}
                          className="bg-white  text-red-500 font-normal border-2 border-red-500 py-1 px-2 w-28 hover:text-white hover:bg-red-500"
                        >
                          <FontAwesomeIcon
                            className="mx-2"
                            icon={faThumbsDown}
                          ></FontAwesomeIcon>
                          Reject
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

interface ScheduleProps {
  draftid: string;
}

/**
 * A functional component that renders a schedule form or schedule details based on the provided props.
 * @param {ScheduleProps} props - The props object containing the necessary data for rendering the component.
 * @returns {JSX.Element} - The rendered schedule form or schedule details.
 */
const Schedule: React.FC<ScheduleProps> = (
  props: ScheduleProps
): JSX.Element => {
  const type = useRef<HTMLInputElement>(null);
  const [react, setReact] = useState<number>();
  const handelreact = (e: any) => {
    setReact(e.target.value.replace(/\D/g, ""));
  };

  const time = useRef<HTMLInputElement>(null);
  const date = useRef<HTMLInputElement>(null);

  const [error, setError] = useState<string | null>(null);
  const [sus, setSus] = useState<string | null>(null);

  const [draft, setDraft] = useState<any>(null);

  const init = async () => {
    let req = {
      search: {
        id: props.draftid,
      },
    };
    const responseData = await axios.post(`${BaseUrl}/api/search-draft`, req);

    if (responseData.data.status == true) {
      setDraft(responseData.data.data[0]);
    }
  };

  useEffect(() => {
    init();
  }, []);

  const submit = async () => {
    setError(null);
    if (
      type.current?.value == null ||
      type.current?.value == undefined ||
      type.current?.value == ""
    ) {
      setError("Fill the publication type");
    } else if (react == null || react == undefined || react == 0) {
      setError("Fill the target reach");
    } else if (
      time.current?.value == null ||
      time.current?.value == undefined ||
      time.current?.value == ""
    ) {
      setError("Fill the Publication time");
    } else if (
      date.current?.value == null ||
      date.current?.value == undefined ||
      date.current?.value == ""
    ) {
      setError("Fill the publication date");
    } else {
      const responseData = await axios.post(`${BaseUrl}/api/update-draft`, {
        id: props.draftid,
        publication_type: type.current?.value,
        target_react: react,
        publication_time: time.current?.value,
        draft_approval: date.current?.value,
      });
      if (!responseData.data.status) {
        setError(responseData.data.message);
      } else {
        setSus("Schedule is updated.");
        window.location.reload();
      }
    }
  };

  function convertToAmPmTime(timeString: string) {
    // Split the time string into hours, minutes, and seconds
    const [hours, minutes, seconds] = timeString.split(":").map(Number);

    // Determine if it's AM or PM
    const period = hours >= 12 ? "PM" : "AM";

    // Convert hours to 12-hour format
    const twelveHourFormat = hours % 12 || 12;

    // Construct the formatted time string
    const amPmTimeString = `${twelveHourFormat}:${String(minutes).padStart(
      2,
      "0"
    )} ${period}`;

    return amPmTimeString;
  }

  return (
    <>
      <div className="p-4 rounded-xl shadow-xl bg-white w-80">
        {draft == null ||
        draft == undefined ||
        draft == "" ? null : draft.draft_approval == null ||
          draft.draft_approval == undefined ? (
          <>
            <div className="w-full p-4">
              <p className="text-lg font-semibold text-primary">Scheduled</p>
              <div className="w-full h-[1px] bg-gray-400 my-4"></div>
              <div className="mt-3">
                <input
                  ref={type}
                  type="text"
                  className="outline-none fill-none bg-[#eeeeee] w-full py-1 px-4 rounded-md border-2"
                  placeholder="Publication Type"
                />
              </div>
              <div className="mt-3">
                <input
                  onChange={handelreact}
                  value={react}
                  type="text"
                  className="outline-none fill-none bg-[#eeeeee] w-full py-1 px-4 rounded-md border-2"
                  placeholder="Target reach"
                />
              </div>
              <div className="mt-3">
                <input
                  ref={time}
                  type="time"
                  className="outline-none fill-none bg-[#eeeeee] w-full py-1 px-4 rounded-md border-2"
                  placeholder="Publication Time"
                />
              </div>
              <div className="mt-3">
                <input
                  ref={date}
                  type="date"
                  className="outline-none fill-none bg-[#eeeeee] w-full py-1 px-4 rounded-md border-2"
                  placeholder="Publication Date"
                />
              </div>
              {error == "" || error == null || error == undefined ? null : (
                <NOTICEAlerts message={error}></NOTICEAlerts>
              )}
              {sus == "" || sus == null || sus == undefined ? null : (
                <SUCCESSAlerts message={sus}></SUCCESSAlerts>
              )}
              <button
                onClick={submit}
                className="mt-4 text-xl px-4 text-white font-semibold bg-primary rounded-md shadow-lg py-1"
              >
                Submit
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="flex gap-4 flex-wrap flex-col w-full">
              <p className="text-lg font-semibold text-primary">Scheduled</p>
              <div className="w-full h-[1px] bg-gray-400"></div>
              <div className="flex">
                <p className="text-lg font-semibold text-gray-700">
                  Publication Type
                </p>
                <div className="grow"></div>
                <p className="text-lg font-semibold text-black">
                  {draft.publication_type}
                </p>
              </div>
              <div className="flex">
                <p className="text-lg font-semibold text-gray-700">
                  Target reach
                </p>
                <div className="grow"></div>
                <p className="text-lg font-semibold text-black">
                  {draft.target_react}
                </p>
              </div>
              <div className="flex">
                <p className="text-lg font-semibold text-gray-700">
                  Publication time
                </p>
                <div className="grow"></div>
                <p className="text-lg font-semibold text-black">
                  {convertToAmPmTime(draft.publication_time)}
                </p>
              </div>
              <div className="flex">
                <p className="text-lg font-semibold text-gray-700">
                  Publication Date
                </p>
                <div className="grow"></div>
                <p className="text-lg font-semibold text-black">
                  {new Date(draft.draft_approval).toLocaleDateString()}
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};
