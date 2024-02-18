import { create } from "zustand";

/**
 * Represents the state of user input, including the current index and a function to update the index.
 * @interface userInputState
 * @property {number} index - The current index value.
 * @property {function} setIndex - A function to update the index value.
 * @param {number} value - The new value to set for the index.
 * @returns None
 */
interface userInputState {
    index: number
    setIndex: (value: number) => void
}

/**
 * Creates a UserInputStore using the create function from the Zustand library.
 * @param {function} set - The set function provided by Zustand to update the state.
 * @returns An object representing the UserInputStore with the following properties:
 *   - index: The current index value.
 *   - setIndex: A function to update the index value.
 */
const UserInputStore = create<userInputState>()((set) => ({
    index: 1,
    setIndex: (value) => set((state) => ({ index: value })),
}));


export default UserInputStore;

