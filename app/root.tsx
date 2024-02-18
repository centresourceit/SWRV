import type { MetaFunction } from "@remix-run/node";
/**
 * Import the necessary modules from the specified library.
 * @module
 * @name importModules
 * @param {Link} Link - The Link module from the library.
 * @param {Links} Links - The Links module from the library.
 * @param {LiveReload} LiveReload - The LiveReload module from the library.
 * @param {Meta} Meta - The Meta module from the library.
 * @param {Outlet} Outlet - The Outlet module from the library.
 * @param {Scripts} Scripts - The Scripts module from the library.
 * @param {ScrollRestoration} ScrollRestoration - The ScrollRestoration module from the library.
 * @param {useCatch} useCatch - The useCatch module from
 */
import {
  Link,
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useCatch,
} from "@remix-run/react";


import styles from "./styles/app.css"

/**
 * Returns an array of link objects for including stylesheets in an HTML document.
 * @returns {Array} An array of link objects, each containing the "rel" and "href" properties.
 */
export function links() {
  return [{ rel: "stylesheet", href: styles }]
}

/**
 * Returns an object containing meta tags for the SWRV page.
 * @returns {Object} - An object with meta tags.
 */
export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "SWRV",
  viewport: "width=device-width,initial-scale=1",
});

/**
 * The main component of the application.
 * @returns {JSX.Element} - The JSX element representing the entire application.
 */
export default function App() {
  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html >
  );
}


/**
 * Renders an error page with different content based on the caught error status.
 * @returns JSX element representing the error page.
 */
export function CatchBoundary() {
  const caught = useCatch();

  return (
    <html>
      <head>
        <title>Error</title>
        <Meta />
        <Links />
      </head>
      <body className="h-screen w-full bg-[#000614] grid place-content-center">
        {
          (caught.status == 404) ?
            <div className="grid place-items-center">
              <h2 className="text-white text-[100px] text-center font-bold">404</h2>
              <p className="text-white text-3xl text-center font-semibold">oops!! page not found.</p>
              <Link to={"/"} className={"text-white font-medium text-center bg-slate-800 py-2 px-4 mt-4"}>Go to HomePage</Link>
            </div>
            :
            <h1>
              {caught.status} {caught.statusText}
            </h1>
        }

        <Scripts />
      </body>
    </html>
  );
}

/**
 * Renders an error boundary component that displays an error message and provides a link to go back to safety.
 * @param {any} error - The error object that occurred.
 * @returns The HTML markup for the error boundary component.
 */
export function ErrorBoundary({ error }: any) {
  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
        <title>This is an error</title>
      </head>
      <body>
        <main className="h-screen grid place-items-center w-full">
          <div className="bg-red-500 bg-opacity-10 w-96 rounded-md p-4">
            <h1 className="text-red-500 text-2xl font-medium  text-center">An Error occurred!</h1>
            <p className="text-red-500 text-lg  text-center">{error.message}</p>
            <p className="text-gray-500 text-lg text-center">Back to <Link to="/" className="text-blue-500 underline">safety!</Link></p>
          </div>
        </main>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );

}