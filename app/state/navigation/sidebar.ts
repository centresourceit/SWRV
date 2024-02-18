import { create } from "zustand";

/**
 * An enumeration representing the different tabs in a sidebar.
 * @enum {number}
 * @property {number} None - No tab selected.
 * @property {number} Home - Home tab selected.
 * @property {number} MyCampaigns - My Campaigns tab selected.
 * @property {number} FindCampaigns - Find Campaigns tab selected.
 * @property {number} Inbox - Inbox tab selected.
 * @property {number} MyEarnings - My Earnings tab selected.
 * @property {number} Drafts - Drafts tab selected.
 * @property {number} Favourite - Favourite tab selected.
 * @property {number} Invite - Invite tab selected.
 * @property {number} Help -
 */
enum SideBarTabs {
  None,
  Home,
  MyCampaigns,
  FindCampaigns,
  Inbox,
  MyEarnings,
  Drafts,
  Favourite,
  Invite,
  Help,
  EditProfile
}

/**
 * Represents the state of the sidebar component.
 * @interface SideBarState
 * @property {SideBarTabs} currentIndex - The currently selected tab in the sidebar.
 * @property {function} changeTab - A function that changes the selected tab in the sidebar.
 * @param {SideBarTabs} value - The value of the tab to change to.
 * @returns None
 */
interface SideBarState {
  currentIndex: SideBarTabs;
  changeTab: (value: SideBarTabs) => void;
}

/**
 * Creates a store for managing the state of the sidebar navigation.
 * @param {function} set - A function provided by the create function to update the state.
 * @returns An object containing the current index of the sidebar tab and a function to change the tab.
 */
const SideBarNavStore = create<SideBarState>()((set) => ({
  currentIndex: SideBarTabs.None,
  changeTab: (value) => set((state) => ({ currentIndex: value })),
}));

export default SideBarNavStore;

export { SideBarTabs };
