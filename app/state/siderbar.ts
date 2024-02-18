import { create } from "zustand";

/**
 * Enum representing the available tabs in the admin sidebar.
 * @enum {number}
 */
enum AdminSideBarTabs {
  None,
  HOME,
  USERHOME,
  CITY,
  CATEGORY,
  COUNTRY,
  MARKET,
  STATE,
  LANGUAGES,
  CURRENCY,
  PLATFORMS,
  CAMPAIGNTYPE,
  TEAM,
  BLOG,
  NEWS,
  EVENT,
  BRAND,
  USER,
  CAMPAIGN,
  DISPUTE,
  SUPPORT,
  CONTACT,
}

/**
 * Represents the state of the sidebar component.
 * @interface ASideBarState
 * @property {boolean} isOpen - Indicates whether the sidebar is open or closed.
 * @property {function} change - A function that takes a boolean value and updates the isOpen property.
 * @property {AdminSideBarTabs} currentIndex - The currently selected tab in the sidebar.
 * @property {function} changeTab - A function that takes an AdminSideBarTabs value and updates the currentIndex property.
 */
interface ASideBarState {
  isOpen: boolean;
  change: (value: boolean) => void;
  currentIndex: AdminSideBarTabs;
  changeTab: (value: AdminSideBarTabs) => void;
}

/**
 * Creates a store for managing the state of the aside bar.
 * @param {function} set - A function provided by the create function to update the state.
 * @returns An object representing the aside bar store with the following properties:
 *   - isOpen: A boolean indicating whether the aside bar is open or closed.
 *   - change: A function that can be used to update the isOpen property.
 *   - currentIndex: An enum value representing the current active tab in the aside bar.
 *   - changeTab: A function that can be used to update the currentIndex property.
 */
const AsideBarStore = create<ASideBarState>()((set) => ({
  isOpen: false,
  change: (value) => set((state) => ({ isOpen: value })),
  currentIndex: AdminSideBarTabs.None,
  changeTab: (value) => set((state) => ({ currentIndex: value })),
}));

export default AsideBarStore;

export { AdminSideBarTabs };
