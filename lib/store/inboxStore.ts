import { create } from "zustand";
import { AppError } from "../error";

type Issue = {
  fingerprint: string;
  count: number;
  firstSeen: number;
  lastSeen: number;
  sample: AppError;
}

type inboxStore = {
  issues: Record<string, Issue>
  events: AppError[];
  add: (newEvent: AppError) => void;
  clear: () => void;
};

export const useInboxStore = create<inboxStore>((set) => ({
  issues: {},
  fp: '',
  events: [],
  add: (newEvent: AppError) => {
    set((state) => ({
      events: [newEvent, ...state.events],
    }));
  },
  clear: () => set({ events: [] }),
}));
