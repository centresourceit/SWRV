import { create } from "zustand";


/**
 * Represents the state of a notification.
 * @interface NotificationState
 * @property {boolean} isOpen - Indicates whether the notification is open or not.
 * @property {function} change - A function that can be used to change the value of isOpen.
 * @param {boolean} value - The new value for isOpen.
 * @returns None
 */
interface NotificationState {
    isOpen: boolean
    change: (value: boolean) => void
}


/**
 * Creates a notification store using Zustand library.
 * @param {function} set - The setter function provided by Zustand.
 * @returns An object representing the notification store with isOpen and change properties.
 */
const NotificationStore = create<NotificationState>()((set) => ({
    isOpen: false,
    change: (value) => set((state) => ({ isOpen: value })),
}));

export default NotificationStore;

