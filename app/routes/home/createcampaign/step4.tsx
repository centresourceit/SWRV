import { LoaderArgs, LoaderFunction, json } from "@remix-run/node";
import { useLoaderData, useNavigate } from "@remix-run/react";
import { useEffect, useRef, useState } from "react";
import ReactSwitch from "react-switch";
import { NOTICEAlerts } from "~/components/utils/alert";
import { CusButton } from "~/components/utils/buttont";
import { userPrefs } from "~/cookies";
import CreateCampaignStore from "~/state/campaign/createcampaign";
export const loader: LoaderFunction = async (props: LoaderArgs) => {
  const cookieHeader = props.request.headers.get("Cookie");
  const cookie = await userPrefs.parse(cookieHeader);
  return json({ user: cookie.user });
};

const Step4 = () => {
  const brand_name = useLoaderData().user;
  // brand name
  const [bn, setbn] = useState<string>("");
  // campaign name
  const [cn, setcn] = useState<string>("");
  //planed budget
  const [pb, setpb] = useState<string>("");
  //cost per post
  const [cpp, setcpp] = useState<string>("");
  //start date
  const [sd, setsd] = useState<string>("");
  // end date
  const [ed, seted] = useState<string>("");
  //   min reach
  const [minr, setminr] = useState<string>("");
  //   max reach
  const [maxr, setmaxr] = useState<string>("");

  const navigator = useNavigate();
  const [active, setActive] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const CampaignName = useRef<HTMLInputElement | null>(null);
  const campaignName = CreateCampaignStore((state) => state.campaignName);
  const setCampaignName = CreateCampaignStore((state) => state.setCampaignName);

  const PlanedBudget = useRef<HTMLInputElement | null>(null);
  const planedBudget = CreateCampaignStore((state) => state.planedBudget);
  const setPlanedBudget = CreateCampaignStore((state) => state.setPlanedBudget);

  const CostPerPost = useRef<HTMLInputElement | null>(null);
  const costPerPost = CreateCampaignStore((state) => state.costPerPost);
  const setCostPerPost = CreateCampaignStore((state) => state.setCostPerPost);

  const StartDate = useRef<HTMLInputElement | null>(null);
  const startDate = CreateCampaignStore((state) => state.startDate);
  const setStartDate = CreateCampaignStore((state) => state.setStartDate);

  const EndDate = useRef<HTMLInputElement | null>(null);
  const endDate = CreateCampaignStore((state) => state.endDate);
  const setEndDate = CreateCampaignStore((state) => state.setEndDate);

  const MinReach = useRef<HTMLInputElement | null>(null);
  const minReach = CreateCampaignStore((state) => state.minReach);
  const setMinReach = CreateCampaignStore((state) => state.setMinReach);

  const MaxReact = useRef<HTMLInputElement | null>(null);
  const maxReact = CreateCampaignStore((state) => state.maxReact);
  const setMaxReact = CreateCampaignStore((state) => state.setMaxReact);

  const publicGlobally = CreateCampaignStore((state) => state.publicGlobally);
  const setPublicGlobally = CreateCampaignStore(
    (state) => state.setPublicGlobally
  );

  useEffect(() => {
    setbn(brand_name.brand.name);
    if (CampaignName.current?.value != null) {
      CampaignName!.current!.value = campaignName;
    }
    if (PlanedBudget.current?.value != null) {
      PlanedBudget!.current!.value = planedBudget.toString();
    }
    if (CostPerPost.current?.value != null) {
      CostPerPost!.current!.value = costPerPost.toString();
    }
    if (StartDate.current?.value != null) {
      StartDate!.current!.value = startDate;
    }
    if (EndDate.current?.value != null) {
      EndDate!.current!.value = endDate;
    }
    if (MinReach.current?.value != null) {
      MinReach!.current!.value = minReach.toString();
    }
    if (MaxReact.current?.value != null) {
      MaxReact!.current!.value = maxReact.toString();
    }
    setActive(publicGlobally);
  }, []);

  /**
   * Renders a form for creating a campaign with various input fields and options.
   * @returns JSX elements representing the campaign creation form.
   */
  return (
    <>
      <div className="flex gap-x-4 flex-col lg:flex-row">
        <div className="bg-white shadow-xl rounded-xl px-8 py-4 mt-4">
          <h1 className="text-primary text-lg font-medium">Create campaign</h1>
          <p className="text-primary text-md font-normal">
            The term business demography is used to cover a set of variables
            which explain the characteristics and demography of the business
            population.
          </p>
          <h2 className="text-primary tect-xl font-medium text-left my-1">
            Campaign name  <span className="text-rose-500 text-2xl font-semibold">&#42;</span>
          </h2>
          <input
            ref={CampaignName}
            type={"text"}
            className="bg-[#EEEEEE]  outline-none border-none focus:border-gray-300 rounded-md w-full p-2"
            onChange={(val) => setcn(val.target.value)}
          />

          <div className="flex flex-col lg:flex-row">
            <div>
              <h2 className="text-primary tect-xl font-medium text-left my-1">
                Planned Budget (USD)  <span className="text-rose-500 text-2xl font-semibold">&#42;</span>
              </h2>
              <input
                ref={PlanedBudget}
                type={"number"}
                className="bg-[#EEEEEE]  outline-none border-none focus:border-gray-300 rounded-md w-full p-2  lg:w-72"
                onChange={(val) => setpb(val.target.value)}
              />
            </div>
            <div className="w-8"></div>
            <div>
              <h2 className="text-primary tect-xl font-medium text-left my-1">
                Cost per post (USD)  <span className="text-rose-500 text-2xl font-semibold">&#42;</span>
              </h2>
              <input
                ref={CostPerPost}
                type={"number"}
                className="bg-[#EEEEEE]  outline-none border-none focus:border-gray-300 rounded-md w-full p-2 lg:w-72"
                onChange={(val) => setcpp(val.target.value)}
              />
            </div>
          </div>
          <div className="flex flex-col lg:flex-row">
            <div>
              <h2 className="text-primary tect-xl font-medium text-left my-1">
                Start date  <span className="text-rose-500 text-2xl font-semibold">&#42;</span>
              </h2>
              <input
                type={"date"}
                ref={StartDate}
                className="bg-[#EEEEEE] outline-none border-none rounded-lg focus:border-gray-300 w-full p-2 lg:w-72"
                onChange={(val) => setsd(val.target.value)}
                min={new Date().toISOString().split('T')[0]}
              ></input>
            </div>
            <div className="w-8"></div>
            <div>
              <h2 className="text-primary tect-xl font-medium text-left my-1">
                End date  <span className="text-rose-500 text-2xl font-semibold">&#42;</span>
              </h2>
              <input
                ref={EndDate}
                type={"date"}
                className="bg-[#EEEEEE]  outline-none border-none focus:border-gray-300 rounded-md w-full p-2 lg:w-72"
                onChange={(val) => seted(val.target.value)}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
          </div>
          <div className="flex flex-col lg:flex-row">
            <div>
              <h2 className="text-primary tect-xl font-medium text-left my-1">
                Min reach  <span className="text-rose-500 text-2xl font-semibold">&#42;</span>
              </h2>
              <input
                ref={MinReach}
                type={"number"}
                className="bg-[#EEEEEE]  outline-none border-none focus:border-gray-300 rounded-md w-full p-2 lg:w-72"
                onChange={(val) => setminr(val.target.value)}
              />
            </div>
            <div className="w-8"></div>
            <div>
              <h2 className="text-primary tect-xl font-medium text-left my-1">
                Max reach  <span className="text-rose-500 text-2xl font-semibold">&#42;</span>
              </h2>
              <input
                ref={MaxReact}
                type={"number"}
                className="bg-[#EEEEEE]  outline-none border-none focus:border-gray-300 rounded-md w-full p-2 lg:w-72"
                onChange={(val) => setmaxr(val.target.value)}
              />
            </div>
          </div>
          <div className="flex items-center gap-x-4">
            <ReactSwitch
              onChange={() => setActive(!active)}
              checked={active}
              checkedIcon={false}
              uncheckedIcon={false}
              onColor="#03125E"
            ></ReactSwitch>
            <div className="grow">
              <h1 className="text-primary text-lg font-medium">
                Publish Globally
              </h1>
              <p className="text-primary text-md font-normal">
                The term business demography is used to cover a set of variables
                which explain the characteristics and demography of the business
                population.
              </p>
            </div>
          </div>
        </div>
        <div>
          <div className="lg:w-80 bg-white  shadow-lx rounded-xl p-4 mt-4">
            <h1 className="text-primary text-lg font-medium">
              Campaign Summary
            </h1>
            <div className="flex my-4 gap-3">
              <p className="text-sm text-primary font-normal flex-1">Brand name</p>
              <p className="text-sm text-primary font-medium flex-1 text-right">{bn}</p>
            </div>
            <div className="flex my-4 gap-3">
              <p className="text-sm text-primary font-normal flex-1">Campaign name</p>
              <p className="text-sm text-primary font-medium flex-1 text-right">
                {cn == "" ? "--------" : cn}
              </p>
            </div>
            <div className="flex my-4 gap-3">
              <p className="text-sm text-primary font-normal flex-1">Planned Budget</p>
              <p className="text-sm text-primary font-medium flex-1 text-right">
                {pb == "" ? "--------" : pb}
              </p>
            </div>
            <div className="flex my-4 gap-3">
              <p className="text-sm text-primary font-normal flex-1">Cost per post (USD)</p>
              <p className="text-sm text-primary font-medium flex-1 text-right">
                {cpp == "" ? "--------" : cpp}
              </p>
            </div>
            <div className="flex my-4 gap-3">
              <p className="text-sm text-primary font-normal flex-1">Start date</p>
              <p className="text-sm text-primary font-medium  flex-1 text-right">
                {sd == ""
                  ? "--------"
                  : new Date(sd).toLocaleDateString("en-US", {
                    weekday: "short",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
              </p>
            </div>
            <div className="flex my-4 gap-3">
              <p className="text-sm text-primary font-normal flex-1">End date</p>
              <p className="text-sm text-primary font-medium flex-1 text-right">
                {ed == ""
                  ? "--------"
                  : new Date(ed).toLocaleDateString("en-US", {
                    weekday: "short",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
              </p>
            </div>
            <div className="flex my-4 gap-3">
              <p className="text-sm text-primary font-normal flex-1">Min reach</p>
              <p className="text-sm text-primary font-medium flex-1 text-right">
                {minr == "" ? "--------" : minr}
              </p>
            </div>
            <div className="flex my-4 gap-3">
              <p className="text-sm text-primary font-normal flex-1">Max reach</p>
              <p className="text-sm text-primary font-medium flex-1 text-right">
                {maxr == "" ? "--------" : maxr}
              </p>
            </div>
            {error == "" || error == null || error == undefined ? null : (
              <NOTICEAlerts message={error}></NOTICEAlerts>
            )}
            <div className="flex w-full">
              <div
                onClick={() => {
                  navigator(-1);
                }}
                className="w-full"
              >
                <CusButton
                  text="Back"
                  textColor={"text-black"}
                  background="bg-gray-100"
                  width={"w-full"}
                  fontwidth={"font-bold"}
                ></CusButton>
              </div>
              <div className="w-10"></div>
              <div
                className="w-full"
                onClick={() => {
                  const x = new Date(StartDate!.current!.value);
                  const y = new Date(EndDate!.current!.value);
                  const pass_date: boolean = x > y;
                  if (
                    CampaignName.current?.value == null ||
                    CampaignName.current?.value == undefined ||
                    CampaignName.current?.value == ""
                  ) {
                    setError("Enter campaign name");
                  } else if (CampaignName.current?.value.length < 4) {
                    setError("Campaign should be more then 3 character.");
                  } else if (
                    PlanedBudget.current?.value == null ||
                    PlanedBudget.current?.value == undefined ||
                    PlanedBudget.current?.value == "" ||
                    parseInt(PlanedBudget.current?.value) == 0
                  ) {
                    setError("Enter planned budget");
                  } else if (
                    CostPerPost.current?.value == null ||
                    CostPerPost.current?.value == undefined ||
                    CostPerPost.current?.value == "" ||
                    parseInt(CostPerPost.current?.value) == 0
                  ) {
                    setError("Enter planned cost per post");
                  } else if (parseInt(CostPerPost.current?.value) > parseInt(PlanedBudget.current?.value)) {
                    setError("Cost per post should be less than Planned budget.");

                  } else if (
                    StartDate.current?.value == null ||
                    StartDate.current?.value == undefined ||
                    StartDate.current?.value == ""
                  ) {
                    setError("Enter planned starting date");
                  } else if (
                    EndDate.current?.value == null ||
                    EndDate.current?.value == undefined ||
                    EndDate.current?.value == ""
                  ) {
                    setError("Enter planned end date");
                  } else if (
                    MinReach.current?.value == null ||
                    MinReach.current?.value == undefined ||
                    MinReach.current?.value == "" ||
                    parseInt(MinReach.current?.value) == 0
                  ) {
                    setError("Enter planned min reach");
                  } else if (
                    MaxReact.current?.value == null ||
                    MaxReact.current?.value == undefined ||
                    MaxReact.current?.value == "" ||
                    parseInt(MaxReact.current?.value) == 0
                  ) {
                    setError("Enter planned max reach");
                  } else if (
                    parseInt(MinReach.current?.value) >
                    parseInt(MaxReact.current?.value)
                  ) {
                    setError("Max reach should be greater than min reach");
                  } else if (pass_date) {
                    setError("Start date should be less then end date");
                  } else {
                    setCampaignName(CampaignName!.current!.value);
                    setPlanedBudget(parseInt(PlanedBudget!.current!.value));
                    setCostPerPost(parseInt(CostPerPost!.current!.value));
                    setStartDate(StartDate!.current!.value);
                    setEndDate(EndDate!.current!.value);
                    setMinReach(parseInt(MinReach.current?.value));
                    setMaxReact(parseInt(MaxReact.current?.value));
                    setPublicGlobally(active);
                    navigator("/home/createcampaign/step5");
                  }
                }}
              >
                <CusButton
                  text="Next"
                  textColor={"text-white"}
                  background="bg-secondary"
                  width={"w-full"}
                  fontwidth={"font-bold"}
                ></CusButton>
              </div>
            </div>
          </div>
        </div>
      </div >
    </>
  );
};

export default Step4;
