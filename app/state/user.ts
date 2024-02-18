
import { create } from "zustand";

/**
 * Represents the state of a user.
 * @interface userState
 * @property {string | null} user - The user's name or null if no user is logged in.
 * @property {function} setUser - A function that sets the value of the user property.
 * @param {string | null} value - The value to set for the user property.
 * @returns None
 */
interface userState {
    user: string | null
    setUser: (value: string | null) => void
}

/**
 * Creates a UserStore using the create function from the Zustand library.
 * @param {Function} set - The set function provided by Zustand to update the state.
 * @returns An object representing the UserStore with the following properties:
 *   - user: The current user object, initialized as null.
 *   - setUser: A function to update the user object in the store.
 */
const UserStore = create<userState>()((set) => ({
    user: null,
    setUser: (value) => set((state) => ({ user: value })),
}));


export default UserStore;

