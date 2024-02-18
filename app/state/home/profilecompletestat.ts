import { create } from "zustand";

/**
 * Represents the state of a profile completion.
 * @interface ProfileCompleteState
 * @property {boolean} isOpen - Indicates whether the profile completion is open or not.
 * @property {function} change - A function that can be used to change the value of isOpen.
 * @param {boolean} value - The new value for isOpen.
 * @returns None
 */
interface ProfileCompleteState {
    isOpen: boolean
    change: (value: boolean) => void
}


/**
 * Creates a store for managing the state of the profile completion feature.
 * @param {function} set - A function provided by the create function to update the state.
 * @returns An object containing the state and a change function to update the state.
 */
const ProfileComleteStore = create<ProfileCompleteState>()((set) => ({
    isOpen: true,
    change: (value) => set((state) => ({ isOpen: value })),
}));

export default ProfileComleteStore;

