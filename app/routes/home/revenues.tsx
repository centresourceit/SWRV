import { useLoadScript } from "@react-google-maps/api";
import { LoaderArgs, LoaderFunction, json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import axios from "axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import type { ChartData, ChartOptions } from "chart.js";
import { Bar } from "react-chartjs-2";
import { BaseUrl } from "~/const";
import { userPrefs } from "~/cookies";
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);
import { format } from "timeago.js";

/**
 * Loader function that retrieves user preferences, payment status, and payment graph data
 * from the server.
 * @param {LoaderArgs} props - The loader arguments.
 * @returns A JSON response containing user information, payment status, and payment graph data.
 */
export const loader: LoaderFunction = async (props: LoaderArgs) => {
  const cookieHeader = props.request.headers.get("Cookie");
  const cookie = await userPrefs.parse(cookieHeader);

  const status = await axios.post(
    `${BaseUrl}/api/payment-status`,
    { userId: cookie.user.id },
    {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Allow-Options": "*",
        "Access-Control-Allow-Methods": "*",
        "X-Content-Type-Options": "*",
        "Content-Type": "application/json",
        Accept: "*",
      },
    }
  );

  const graph = await axios.post(
    `${BaseUrl}/api/payment-graph`,
    { userId: cookie.user.id },
    {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Allow-Options": "*",
        "Access-Control-Allow-Methods": "*",
        "X-Content-Type-Options": "*",
        "Content-Type": "application/json",
        Accept: "*",
      },
    }
  );

  return json({
    user: cookie.user,
    status: status.data.data,
    graph: graph.data.data,
  });
};
/**
 * A React functional component that displays monthly revenue data and brand revenue data.
 * @returns {JSX.Element} - The rendered component.
 */
const Revenues: React.FC = (): JSX.Element => {
  const status = useLoaderData().status;
  const graph = useLoaderData().graph;

  const options = {
    responsive: true,
    elements: {
      bar: {
        borderWidth: 2,
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
      },
    },

    scales: {
      x: {
        barThickness: 40,
        grid: {
          display: true,
        },
      },
      y: {
        grid: {
          display: true,
        },
      },
    },
  };

  // get the current year and month
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;

  // create an array of the last 6 months
  const months = [];
  for (let i = 0; i < 6; i++) {
    const year = currentMonth - i > 0 ? currentYear : currentYear - 1;
    const month = ((currentMonth - i - 1) % 12) + 1;
    months.unshift({ year, month });
  }

  // extract the earnings data for the last 6 months
  const earningsData = months.map(({ year, month }) => {
    const matchingData = graph.find(
      (d: any) => d.year === year.toString() && d.month === month.toString()
    );
    if (matchingData == undefined) return 0;

    return matchingData ? Number(matchingData.total_earning) : 0;
  });

  const data = {
    labels: months.map(({ year, month }) => `${month}-${year}`),
    datasets: [
      {
        data: earningsData,
        borderColor: "rgb(53, 162, 235)",
        backgroundColor: "rgba(53, 162, 235, 0.5)",
        barThickness: 50,
      },
    ],
  };

  return (
    <>
      <div>
        <div className="bg-white py-2 rounded-md mt-4">
          <p className="font-semibold text-2xl text-gray-800 my-4 text-center">
            Monthly revenue
          </p>
          <div className=" h-auto lg:h-96 p-8">
            {graph.length == 0 ? (
              <p className="text-center font-semibold text-gray-600 text-2xl">
                There is nothing to show
              </p>
            ) : (
              <Bar data={data} options={options} />
            )}
          </div>
        </div>
        <div className="bg-white py-2 rounded-md p-6 mt-10 overflow-x-scroll">
          <p className="text-left font-semibold text-2xl text-gray-800 my-4">
            Brand revenue
          </p>
          {status.length == 0 ? (
            <p className="text-center font-semibold text-gray-600 text-2xl">
              There is nothing to show
            </p>
          ) : (
            <table className="md:w-full md:table-auto border-separate border-spacing-y-3 w-[700px]">
              <thead className="w-full bg-gray-100 rounded-xl p-2">
                <tr>
                  <th scope="col" className="mt-2 font-normal p-2 text-left">
                    Brand
                  </th>
                  <th scope="col" className="mt-2 font-normal p-2 text-left">
                    Campaign Name
                  </th>
                  <th scope="col" className="mt-2 font-normal p-2 text-left">
                    Earning
                  </th>
                  <th scope="col" className="mt-2 font-normal p-2 text-left">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="gap-y-4">
                {status.map((val: any, index: number) => (
                  <tr key={index}>
                    <td>
                      <img
                        src={val.brandLogoUrl}
                        alt="error"
                        className="w-12 h-12 rounded-md object-cover"
                      />
                    </td>
                    <td>{val.campaign_name}</td>
                    <td>
                      {" "}
                      {val.total_amount_requested.toString().split(".")[0]}
                    </td>
                    <td>
                      {format(
                        new Date(
                          Date.now() -
                            val.days_since_payment_made * 24 * 60 * 60 * 1000
                        )
                      )}
                    </td>

                    {/* <td>{val.days_since_payment_made} day ago</td> */}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
};
export default Revenues;
