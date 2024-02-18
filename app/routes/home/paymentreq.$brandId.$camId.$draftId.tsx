import { LoaderArgs, LoaderFunction, json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { MdiDatabase } from "~/components/icons";
import { NOTICEAlerts, SUCCESSAlerts } from "~/components/utils/alert";
import { CusButton } from "~/components/utils/buttont";
import MyRating from "~/components/utils/raiting";
import { BaseUrl } from "~/const";
import { userPrefs } from "~/cookies";


/**
 * Loader function that retrieves data for a specific campaign.
 * @param {LoaderArgs} props - The loader arguments.
 * @returns {Promise<Response>} - A promise that resolves to a JSON response.
 */
export const loader: LoaderFunction = async (props: LoaderArgs) => {
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

  const [submit, setSubmit] = useState<boolean>(false);


  const [draftdata, setDraftdata] = useState<any>("");

  /**
   * Initializes the component by making API requests to retrieve data.
   * @returns None
   */
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
    }

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
          {
            (draftdata == null || draftdata == undefined || draftdata == "") ? null :
              <div
                className="bg-white rounded-lg shadow-lg w-72"
              >
                <img src={draftdata.influencer.pic} alt="influencer pic" className="w-full h-44 rounded-t-md object-top object-cover" />
                <div className="p-4">
                  <p className="text-xl font-medium mt-4">
                    {draftdata.influencer.name.split("@")[0]}
                  </p>
                  <p className="mt-2 text-xl font-medium">Campaign Draft Descriptin</p>
                  <p className="text-md font-medium mt-1">{draftdata.description}</p>
                  <p className="mt-4 text-lg font-medium">Platforms</p>
                  <div className="rounded-full p-[0.15rem] border-2 border-blue-500 h-10 w-10">
                    <img src={draftdata.handle.platform.logo} alt="platform" className="w-full h-full shrink-0 rounded-md object-fill object-center" />
                  </div>
                  <div className="mt-4">
                    <a
                      target="_blank"
                      className="mt-2 text-lg bg-[#fbca8e] font-semibold rounded-md inline-block my-2 py-2 px-4  text-black  w-full text-center"
                      href={draftdata.attach01}
                    >
                      View document
                    </a>
                    {draftdata.linkCampaign == null || draftdata.linkCampaign == undefined || draftdata.linkCampaign == "" ? null :
                      <a
                        target="_blank"
                        className="mt-2 text-lg bg-primary font-semibold rounded-md inline-block my-2 py-2 px-4  text-white  w-full text-center"
                        href={draftdata.linkCampaign.toString().startsWith("http") ? draftdata.linkCampaign : `https://${draftdata.linkCampaign}`}
                      >
                        View campaign
                      </a>
                    }
                  </div>
                </div>
              </div>
          }
        </div>
        <div>
          <Payments
            brandId={brandId}
            userId={userId}
            campaignId={campaignId}
            draftId={draftId}
            cpp={cpp}
            currency={currency}
            campname={campaignName}
          ></Payments>

        </div>
        <div>
          {!submit ? (
            <div>
              <MyRating
                campaignId={campaignId}
                brandId={brandId}
                influencerId={userId}
                reviewType="3"
              ></MyRating>
            </div>
          ) : null}
          <Dispute
            brandId={brandId}
            userId={userId}
            campaignId={campaignId}
          ></Dispute>
        </div>
      </div>
    </>
  );
};

export default PaymentRequest;

/**
 * Represents the properties of a payment.
 * @interface PaymentProps
 * @property {string} campaignId - The ID of the campaign.
 * @property {string} userId - The ID of the user.
 * @property {string} draftId - The ID of the draft.
 * @property {string} brandId - The ID of the brand.
 * @property {string} cpp - The cost per click.
 * @property {string} currency - The currency used for the payment.
 * @property {string} campname - The name of the campaign.
 */
interface PaymentProps {
  campaignId: string;
  userId: string;
  draftId: string;
  brandId: string;
  cpp: string;
  currency: string;
  campname: string;
}

/**
 * Functional component for handling payments.
 * @param {PaymentProps} props - The props for the Payments component.
 * @returns {JSX.Element} - The rendered Payments component.
 */
const Payments: React.FC<PaymentProps> = (props: PaymentProps): JSX.Element => {
  const [paymentBox, setPaymentBox] = useState<boolean>(false);
  const [paymentError, setPaymentError] = useState<String>("");
  const paymentRef = useRef<HTMLInputElement>(null);
  const [recived, setRecived] = useState<number>(0);
  const [requested, serRequested] = useState<number>(0);
  const [sus, setSus] = useState<string | null>(null);
  const init = async () => {
    const reqdata = await axios.post(`${BaseUrl}/api/get-received-payment`, {
      userId: props.userId,
      draftId: props.draftId,
    });

    if (reqdata.data.status) {
      setRecived(
        parseInt(reqdata.data.data.totalAmtReq.toString().split(".")[0])
      );
    } else {
      setRecived(0);
    }
    const reqdata1 = await axios.post(`${BaseUrl}/api/get-pending-payment`, {
      userId: props.userId,
      draftId: props.draftId,
    });

    if (reqdata1.data.status) {
      serRequested(
        parseInt(reqdata1.data.data.totalAmtReq.toString().split(".")[0])
      );
    } else {
      serRequested(0);
    }
  };
  useEffect(() => {
    init();
  }, []);




  const sendpayment = async () => {
    setPaymentError("");
    setSus(null);
    if (
      paymentRef.current?.value == null ||
      paymentRef.current?.value == undefined ||
      paymentRef.current?.value == ""
    ) {
      setPaymentError("Enter the amount");
    } else if (
      parseInt(paymentRef.current?.value) >
      parseInt(props.cpp) - requested
    ) {
      setPaymentError(
        "Your requested is higher then pending amount."
      );
    } else {
      let req = {
        userId: props.userId,
        campaignId: props.campaignId,
        amtReq: paymentRef.current?.value,
        draftId: props.draftId,
        brandId: props.brandId,
        paymentType: "1",
      };


      const paymentdata = await axios.post(
        `${BaseUrl}/api/new-pay-request`,
        req
      );
      if (!paymentdata.data.status) {
        setPaymentError(paymentdata.data.message);


      }
      else {
        setPaymentError("");
        paymentRef.current.value = "";
        setSus("Payment Request Sent Successfully");
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }
      setPaymentBox(false);
    }
  }

  return (
    <>
      <div className="rounded-xl shadow-xl bg-white p-4 w-80">
        <div className="flex">
          <MdiDatabase className="text-xl text-primary" />
          <h2 className="text-xl text-primary font-medium px-4">Payments</h2>
          <div className="grow"></div>
          <p className="text-md font-bold text-black">
            {props.cpp.toString().split(".")[0]} {props.currency}
          </p>
        </div>
        <div className="h-[1px] bg-gray-500 w-full my-2 "></div>
        <div className="flex my-2">
          <p className="text-md text-primary">Received</p>
          <div className="grow"></div>
          <p className="text-md font-normal text-black">
            {recived} {props.currency}
          </p>
        </div>
        <div className="flex my-2">
          <p className="text-md text-primary">Pending</p>
          <div className="grow"></div>
          <p className="text-md font-normal text-black">
            {parseInt(props.cpp.toString().split(".")[0]) - recived}{" "}
            {props.currency}
          </p>
        </div>
      </div>
      <div className="p-4 bg-white mt-2 rounded-md w-80">
        <p className="text-normal font-semibold py-1 text-primary text-lg">
          Payment request
        </p>
        <button
          onClick={() => {
            setPaymentBox(true);
          }}
          className={`text-black bg-[#01FFF4] rounded-lg w-full text-center py-2 font-semibold text-md mt-2 ${paymentBox ? "hidden" : ""
            }`}
        >
          Request
        </button>
        <div className={`${paymentBox ? "" : "hidden"}`}>
          <div className="flex gap-x-4">
            <p>Enter Amount : </p>{" "}
            <div>
              <input
                ref={paymentRef}
                type="number"
                className="text-black outline-none border-none rounded-md py-1 px-2 bg-gray-300 w-full"
              />
            </div>
          </div>
          {paymentError == "" ||
            paymentError == null ||
            paymentError == undefined ? null : (
            <div className="bg-red-500 bg-opacity-10 border-2 text-center border-red-500 rounded-md text-red-500 text-md font-normal text-md my-4">
              {paymentError}
            </div>
          )}
          <button
            onClick={sendpayment}
            className={`text-black bg-[#01FFF4] rounded-lg w-full text-center py-2 font-semibold text-md mt-2`}
          >
            Request Payment
          </button>
        </div>
        {sus == "" ||
          sus == null ||
          sus == undefined ? null : (
          <SUCCESSAlerts message={sus}></SUCCESSAlerts>
        )}
      </div>
    </>
  );
};

interface DisputeProps {
  userId: string;
  brandId: string;
  campaignId: string;
}
/**
 * A functional component that renders a dispute form.
 * @param {DisputeProps} props - The props for the Dispute component.
 * @returns {JSX.Element} - The rendered Dispute component.
 */
const Dispute: React.FC<DisputeProps> = (props: DisputeProps): JSX.Element => {

  const [error, setError] = useState<string | null>(null);
  const [sus, setSus] = useState<string | null>(null);
  const messageRef = useRef<HTMLTextAreaElement | null>(null);
  const reasonRef = useRef<HTMLSelectElement | null>(null);
  const submit = async () => {
    if (
      messageRef.current?.value == null ||
      messageRef.current?.value == undefined ||
      messageRef.current?.value == ""
    ) {
      setError("Fill the message.");
    } else if (
      reasonRef.current?.value == null ||
      reasonRef.current?.value == undefined ||
      reasonRef.current?.value == "" ||
      reasonRef.current?.value == "0"
    ) {
      setError("Select one reason.");
    } else {

      const req = {
        type: reasonRef.current?.value,
        userId: props.userId,
        brandId: props.brandId,
        campaignId: props.campaignId,
        isBrand: 0,
        message: messageRef.current?.value,
      };

      const data = await axios({
        method: "post",
        url: `${BaseUrl}/api/add-dispute`,
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
        setError(null);
        setSus("Message sent!");
        reasonRef!.current!.value = "";
        messageRef!.current!.value = "";
      }
    }
  };
  return (
    <>
      <div>
        <div className="rounded-xl shadow-xl bg-white p-4 mt-6 w-80">
          <p className="text-xl text-gray-800 text-center font-semibold">
            Dispute
          </p>
          <div className="h-[2px] bg-gray-400 w-full my-2"></div>
          <select
            ref={reasonRef}
            name="reason"
            id="reason"
            className="w-full rounded-md border-none outline-none bg-gray-100 py-2 my-2 px-2 cursor-pointer"
          >
            <option value="1">Product or service issue</option>
            <option value="2">Billing or payment issue</option>
            <option value="3">Shipping or delivery issue</option>
            <option value="4">Customer service issue</option>
            <option value="5">Website or app issue</option>
            <option value="6">Other issue</option>
          </select>
          <textarea
            ref={messageRef}
            className="p-4 w-full h-40 outline-none border-2 border-gray-300 focus:border-gray-300 rounded-md resize-none"
            placeholder="Your message"
          ></textarea>
          {error == "" || error == null || error == undefined ? null : (
            <NOTICEAlerts message={error}></NOTICEAlerts>
          )}
          {sus == "" || sus == null || sus == undefined ? null : (
            <SUCCESSAlerts message={sus}></SUCCESSAlerts>
          )}
          <div onClick={submit}>
            <CusButton text="Send Message" background="bg-primary"></CusButton>
          </div>
        </div>
      </div>
    </>
  );
};
