import { RemixBrowser } from "@remix-run/react";
import { startTransition, StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";

/**
 * Hydrates the root element with the RemixBrowser component.
 * @returns None
 */
function hydrate() {
  startTransition(() => {
    hydrateRoot(
      document,
      // <StrictMode>
      <RemixBrowser />
      // </StrictMode>
    );
  });
}

/**
 * Schedules the `hydrate` function to be called when the browser is idle using `requestIdleCallback`,
 * or falls back to `setTimeout` with a delay of 1ms if `requestIdleCallback` is not supported.
 * @param {Function} hydrate - The function to be called when the browser is idle.
 * @returns None
 */
if (window.requestIdleCallback) {
  window.requestIdleCallback(hydrate);
} else {
  // Safari doesn't support requestIdleCallback
  // https://caniuse.com/requestidlecallback
  window.setTimeout(hydrate, 1);
}
