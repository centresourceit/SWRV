
import { Link } from "@remix-run/react";
export const Footer = () => {
  const year = new Date().getFullYear();
  /**
   * Renders a footer component with various links and information.
   * @param {number} year - The current year.
   * @returns The rendered footer component.
   */
  return (
    <>
      <footer className="w-full grid place-items-center  bg-primary py-8 md:py-20 px-6 sm:px-16">
        <div className="w-full md:w-4/5 lg:w-4/5 flex flex-col md:flex-row border-b-2 border-gray-200 pb-4 mb-4">
          <div className="grow">
            <h1 className="text-white text-3xl font-semibold text-center md:text-left">
              SWRV
            </h1>
            <h3 className="text-white text-md font-normal text-center md:text-left">
              © {year} SWRV Licensing AB - All rights reserved.
            </h3>
          </div>
          <div className="grow flex justify-center">
            <div className="text-white text-3xl p-4 grid place-items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="28"
                height="28"
                viewBox="0 0 14 14"
              >
                <path
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M.5 12.5v-11a1 1 0 0 1 1-1h11a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1h-3V8.76h.71a.61.61 0 0 0 .61-.61v-.77a.61.61 0 0 0-.61-.61h-.67v-.94c0-.84.38-.84.76-.84h.49a.55.55 0 0 0 .43-.18a.58.58 0 0 0 .18-.43v-.74a.62.62 0 0 0-.6-.64H9.65a2.32 2.32 0 0 0-2.39 2.6v1.17h-.64a.61.61 0 0 0-.62.61v.77a.61.61 0 0 0 .62.61h.64v4.74H1.5a1 1 0 0 1-1-1Z"
                />
              </svg>
            </div>
            <div className="text-white text-3xl p-4 grid place-items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="38"
                height="38"
                viewBox="0 0 24 24"
              >
                <path
                  fill="currentColor"
                  d="M18.44 3.06H5.56a2.507 2.507 0 0 0-2.5 2.5v12.88a2.507 2.507 0 0 0 2.5 2.5h12.88a2.5 2.5 0 0 0 2.5-2.5V5.56a2.5 2.5 0 0 0-2.5-2.5Zm1.5 15.38a1.511 1.511 0 0 1-1.5 1.5H5.56a1.511 1.511 0 0 1-1.5-1.5V5.56a1.511 1.511 0 0 1 1.5-1.5h12.88a1.511 1.511 0 0 1 1.5 1.5Z"
                />
                <path
                  fill="currentColor"
                  d="M6.376 10.748a1 1 0 1 1 2 0v6.5a1 1 0 0 1-2 0Z"
                />
                <circle cx="7.376" cy="6.744" r="1" fill="currentColor" />
                <path
                  fill="currentColor"
                  d="M17.62 13.37v3.88a1 1 0 1 1-2 0v-3.88a1.615 1.615 0 1 0-3.23 0v3.88a1 1 0 0 1-2 0v-6.5a1.016 1.016 0 0 1 1-1a.94.94 0 0 1 .84.47a3.609 3.609 0 0 1 5.39 3.15Z"
                />
              </svg>
            </div>
            <div className="text-white text-3xl p-4 grid place-items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="38"
                height="38"
                viewBox="0 0 24 24"
              >
                <path
                  fill="currentColor"
                  d="M22.991 3.95a1 1 0 0 0-1.51-.86a7.48 7.48 0 0 1-1.874.794a5.152 5.152 0 0 0-3.374-1.242a5.232 5.232 0 0 0-5.223 5.063a11.032 11.032 0 0 1-6.814-3.924a1.012 1.012 0 0 0-.857-.365a.999.999 0 0 0-.785.5a5.276 5.276 0 0 0-.242 4.769l-.002.001a1.041 1.041 0 0 0-.496.89a3.042 3.042 0 0 0 .027.439a5.185 5.185 0 0 0 1.568 3.312a.998.998 0 0 0-.066.77a5.204 5.204 0 0 0 2.362 2.922a7.465 7.465 0 0 1-3.59.448A1 1 0 0 0 1.45 19.3a12.942 12.942 0 0 0 7.01 2.061a12.788 12.788 0 0 0 12.465-9.363a12.822 12.822 0 0 0 .535-3.646l-.001-.2a5.77 5.77 0 0 0 1.532-4.202Zm-3.306 3.212a.995.995 0 0 0-.234.702c.01.165.009.331.009.488a10.824 10.824 0 0 1-.454 3.08a10.685 10.685 0 0 1-10.546 7.93a10.938 10.938 0 0 1-2.55-.301a9.48 9.48 0 0 0 2.942-1.564a1 1 0 0 0-.602-1.786a3.208 3.208 0 0 1-2.214-.935q.224-.042.445-.105a1 1 0 0 0-.08-1.943a3.198 3.198 0 0 1-2.25-1.726a5.3 5.3 0 0 0 .545.046a1.02 1.02 0 0 0 .984-.696a1 1 0 0 0-.4-1.137a3.196 3.196 0 0 1-1.425-2.673c0-.066.002-.133.006-.198a13.014 13.014 0 0 0 8.21 3.48a1.02 1.02 0 0 0 .817-.36a1 1 0 0 0 .206-.867a3.157 3.157 0 0 1-.087-.729a3.23 3.23 0 0 1 3.226-3.226a3.184 3.184 0 0 1 2.345 1.02a.993.993 0 0 0 .921.298a9.27 9.27 0 0 0 1.212-.322a6.681 6.681 0 0 1-1.026 1.524Z"
                />
              </svg>
            </div>
            <div className="text-white text-3xl p-4 grid place-items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="38"
                height="38"
                viewBox="0 0 256 256"
              >
                <path
                  fill="currentColor"
                  d="M128 80a48 48 0 1 0 48 48a48.05 48.05 0 0 0-48-48Zm0 80a32 32 0 1 1 32-32a32 32 0 0 1-32 32Zm48-136H80a56.06 56.06 0 0 0-56 56v96a56.06 56.06 0 0 0 56 56h96a56.06 56.06 0 0 0 56-56V80a56.06 56.06 0 0 0-56-56Zm40 152a40 40 0 0 1-40 40H80a40 40 0 0 1-40-40V80a40 40 0 0 1 40-40h96a40 40 0 0 1 40 40ZM192 76a12 12 0 1 1-12-12a12 12 0 0 1 12 12Z"
                />
              </svg>
            </div>
          </div>
          <div className="grow flex md:justify-end justify-center">
            <div>
              <h3 className="text-white text-md font-normal text-center md:text-left">
                Head Office
              </h3>
              <h3 className="text-white text-md font-normal text-center md:text-left">
                Dockplatsen 1, 211 19 Malmö, Sweden
              </h3>
            </div>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row justify-center content-center text-white text-md font-semibold ">
          <Link to={"/pp"} className="text-center">
            Privacy Policy
          </Link>
          <div className="w-10"></div>
          <Link to={"/tos"} className="text-center">
            Term of service
          </Link>
          {/* <div className="w-10"></div> */}
          {/* <Link to={"/dispute"} className="text-center">
            Manage Dispute
          </Link> */}
          <div className="w-10"></div>
          <Link to={"/faq"} className="text-center">
            FAQ
          </Link>
          <div className="w-10"></div>
          <Link to={"/news"} className="text-center">
            Event & News
          </Link>
        </div>
      </footer>
    </>
  );
};
