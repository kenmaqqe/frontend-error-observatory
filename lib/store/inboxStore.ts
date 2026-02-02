import { create } from "zustand";
import { AppError } from "../error";

type inboxeStore = {
  events: AppError[];
  add: (newEvent: AppError) => void;
  clear: () => void;
};

export const useInboxStore = create<inboxeStore>((set) => ({
  events: [],
  add: (newEvent: AppError) => {
    set((state: { events: AppError[] }) => ({
      events: [newEvent, ...state.events],
    }));
  },
  clear: () => set({ events: [] }),
}));
