import { create } from "zustand";


/**
 * Represents the state of the mobile navigation.
 * @interface MobileNavState
 * @property {boolean} isOpen - Indicates whether the mobile navigation is open or closed.
 * @property {function} change - A function that can be used to change the state of the mobile navigation.
 * @param {boolean} value - The new value to set for the isOpen property.
 * @returns None
 */
interface MobileNavState {
    isOpen: boolean
    change: (value: boolean) => void
}


/**
 * Creates a MobX store for managing the state of the mobile navigation.
 * @param {function} set - A function provided by the create function from MobX that allows updating the store state.
 * @returns An object representing the mobile navigation store with isOpen and change properties.
 */
const MobileNavStore = create<MobileNavState>()((set) => ({
    isOpen: false,
    change: (value) => set((state) => ({ isOpen: value })),
}));

export default MobileNavStore;

