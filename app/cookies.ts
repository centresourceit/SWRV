/**
 * Creates cookie objects for user preferences and admin user.
 * @module Cookie
 * @exports {Function} userPrefs - Creates a cookie object for user preferences.
 * @exports {Function} adminUser - Creates a cookie object for admin user.
 */
import { createCookie } from "@remix-run/node"; // or cloudflare/deno

export const userPrefs = createCookie("user-prefs");
export const adminUser = createCookie("admin-user");

