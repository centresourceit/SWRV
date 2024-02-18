import { create } from "zustand";

/**
 * Represents the state of a sidebar component.
 * @interface SideBarState
 * @property {boolean} isOpen - Indicates whether the sidebar is open or closed.
 * @property {function} change - A function that takes a boolean value and updates the isOpen property.
 * @param {boolean} value - The new value for the isOpen property.
 * @returns None
 */
interface SideBarState {
  isOpen: boolean;
  change: (value: boolean) => void;
}

/**
 * Creates a store for managing the state of the sidebar.
 * @param {function} set - A function provided by the create function to update the state.
 * @returns An object representing the sidebar state and its associated actions.
 */
const SideBarStore = create<SideBarState>()((set) => ({
  isOpen: true,
  change: (value) => set((state) => ({ isOpen: value })),
}));

export default SideBarStore;
