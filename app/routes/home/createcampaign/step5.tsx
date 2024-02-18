import { faAdd, faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, useNavigate } from "@remix-run/react";
import { useEffect, useRef, useState } from "react";
import { CusButton } from "~/components/utils/buttont";
import CreateCampaignStore from "~/state/campaign/createcampaign";

const Step5 = () => {
  //brand info
  const [bi, setbi] = useState<string>("");
  // campaign purpose
  const [cp, setcp] = useState<string>("");
  // mentions
  const mendtion: string[] = CreateCampaignStore((state) => state.mendtion);
  // hashtag
  const hashtag: string[] = CreateCampaignStore((state) => state.hashtag);
  // should do
  const dos: string[] = CreateCampaignStore((state) => state.dos);
  // should do not
  const donts: string[] = CreateCampaignStore((state) => state.donts);

  const [error, setErrot] = useState<string | null>(null);
  const [imgerror, setImgerror] = useState<string | null>(null);
  let image = CreateCampaignStore((state) => state.image);
  let addImage = CreateCampaignStore((state) => state.addImage);
  let removeImage = CreateCampaignStore((state) => state.removeImage);

  const brandInfo = useRef<HTMLTextAreaElement | null>(null);
  let BrandInfo = CreateCampaignStore((state) => state.brandinfo);
  let setBrandinfo = CreateCampaignStore((state) => state.setBrandinfo);

  const CampaignPurpose = useRef<HTMLTextAreaElement | null>(null);
  let campaignPurpose = CreateCampaignStore((state) => state.campaginPurpose);
  let setCampaginPurpose = CreateCampaignStore(
    (state) => state.setCampaginPurpose
  );

  let imgref = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    brandInfo!.current!.value = BrandInfo;

    CampaignPurpose!.current!.value = campaignPurpose;
  }, []);

  const navigator = useNavigate();
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
            Brand info  <span className="text-rose-500 text-2xl font-semibold">&#42;</span>
          </h2>
          <textarea
            ref={brandInfo}
            className="p-4 w-full h-40 outline-none bg-[#EEEEEE] focus:border-gray-300 rounded-md resize-none"
            onChange={(val) => setbi(val.target.value)}
          ></textarea>
          <h2 className="text-primary tect-xl font-medium text-left my-1">
            Campaign purpose  <span className="text-rose-500 text-2xl font-semibold">&#42;</span>
          </h2>
          <textarea
            ref={CampaignPurpose}
            className="p-4 w-full h-40 outline-none bg-[#EEEEEE] focus:border-gray-300 rounded-md resize-none"
            onChange={(val) => setcp(val.target.value)}
          ></textarea>
          <h2 className="text-primary tect-xl font-medium text-left my-1">
            Mood boards  <span className="text-rose-500 text-2xl font-semibold">&#42;</span>
          </h2>
          <div className="hidden">
            <input
              type="file"
              accept="image/*"
              ref={imgref}
              onChange={(value) => {
                let file_size = parseInt(
                  (value!.target.files![0].size / 1024 / 1024).toString()
                );
                if (file_size < 4) {
                  setImgerror(null);
                  addImage(value!.target.files![0]);
                } else {
                  setImgerror("Image file size must be less then 4 mb");
                }
              }}
            />
          </div>
          <div className="flex gap-x-4  overflow-x-scroll no-scrollbar w-[300px] lg:w-[600px] md:w-[400px]">
            {image.map((value: File, i: number) => {
              var url = URL.createObjectURL(value);
              return (
                <div key={i}>
                  <div className="w-32 h-32 bg-gray-200 rounded-xl grid place-items-center relative">
                    <div className="top-0 left-0 absolute h-full w-full">
                      <img
                        src={url}
                        alt="error"
                        className="w-full h-full rounded-xl object-cover"
                      />
                    </div>
                    <div
                      className="cursor-pointer"
                      onClick={() => {
                        removeImage(value);
                      }}
                    >
                      <FontAwesomeIcon
                        className="text-red-500 font-bold text-xl top-0 right-0 absolute"
                        icon={faCircleXmark}
                      ></FontAwesomeIcon>
                    </div>
                  </div>
                </div>
              );
            })}
            <div>
              <div
                className="w-32 h-32 bg-gray-200 rounded-xl grid place-items-center cursor-pointer"
                onClick={() => {
                  imgref.current?.click();
                }}
              >
                <FontAwesomeIcon
                  icon={faAdd}
                  className="text-gray-400 text-3xl font-bold text-center"
                ></FontAwesomeIcon>
              </div>
            </div>
          </div>
          {imgerror == "" ||
            imgerror == null ||
            imgerror == undefined ? null : (
            <div className="bg-red-500 bg-opacity-10 border-2 text-center border-red-500 rounded-md text-red-500 text-md font-normal text-md my-4">
              {imgerror}
            </div>
          )}
        </div>
        <div>
          <div className="lg:w-80 bg-white shadow-lx rounded-xl p-4 mt-4">
            <h1 className="text-primary text-lg font-medium">
              Campaign Summary
            </h1>
            <div className="flex flex-col my-6 gap-3">
              <p className="text-sm text-primary font-normal flex-1">Brand info</p>
              <p className="text-sm text-primary font-medium flex-1 text-right">
                {bi == "" ? "--------" : bi}
              </p>
            </div>
            <div className="flex flex-col my-6 gap-3">
              <p className="text-sm text-primary font-normal flex-1">
                Campaign purpose
              </p>
              <p className="text-sm text-primary font-medium  flex-1 text-right">
                {cp == "" ? "--------" : cp}
              </p>
            </div>
            <div className="flex my-4 gap-3">
              <p className="text-sm text-primary font-normal flex-1">Hashtags</p>
              <p className="text-sm text-primary font-medium flex-1 text-right">
                {hashtag.map(
                  (val: string, index: number, arr: string[]) =>
                    `${val}${arr.length == index ? "" : ", "}`
                )}
              </p>
            </div>
            <div className="flex my-4 gap-3">
              <p className="text-sm text-primary font-normal flex-1">Mentions</p>
              <div className="grow"></div>
              <p className="text-sm text-primary font-medium flex-1 text-right">
                {mendtion.map(
                  (val: string, index: number, arr: string[]) =>
                    `${val}${arr.length == index ? "" : ", "}`
                )}
              </p>
            </div>
            <div className="flex my-4 gap-3">
              <p className="text-sm text-primary font-normal flex-1">You should do:</p>
              <p className="text-sm text-primary font-medium flex-1 text-right">
                {dos.map(
                  (val: string, index: number, arr: string[]) =>
                    `${val}${arr.length == index ? "" : ", "}`
                )}
              </p>
            </div>
            <div className="flex my-4 gap-3">
              <p className="text-sm text-primary font-normal flex-1">
                You should not:
              </p>
              <div className="grow"></div>
              <p className="text-sm text-primary font-medium flex-1 text-right">
                {donts.map(
                  (val: string, index: number, arr: string[]) =>
                    `${val}${arr.length == index ? "" : ", "}`
                )}
              </p>
            </div>
            {error == "" || error == null || error == undefined ? null : (
              <div className="bg-red-500 bg-opacity-10 border-2 text-center border-red-500 rounded-md text-red-500 text-md font-normal text-md my-4">
                {error}
              </div>
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
                  if (
                    brandInfo.current?.value == null ||
                    brandInfo.current?.value == undefined ||
                    brandInfo.current?.value == ""
                  ) {
                    setErrot("Fill the Brand Info");
                  } else if (
                    CampaignPurpose.current?.value == null ||
                    CampaignPurpose.current?.value == undefined ||
                    CampaignPurpose.current?.value == ""
                  ) {
                    setErrot("Fill the Campaign Purpose.");
                  } else if (image.length == 0) {
                    setErrot("Select at least one image.");
                  } else {
                    setBrandinfo(brandInfo.current?.value);
                    setCampaginPurpose(CampaignPurpose.current?.value);
                    setErrot(null);
                    navigator("/home/createcampaign/step6");
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
      </div>
    </>
  );
};
export default Step5;
