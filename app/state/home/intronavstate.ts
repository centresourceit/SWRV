import { create } from "zustand";

interface IntroNavState {
    isOpen: boolean
    change: (value: boolean) => void
}


/**
 * Creates a store for managing the state of the intro navigation.
 * @param {function} set - A function provided by the create function to update the state.
 * @returns An object with isOpen and change properties.
 */
const IntroNavStore = create<IntroNavState>()((set) => ({
    isOpen: false,
    change: (value) => set((state) => ({ isOpen: value })),
}));

export default IntroNavStore;

