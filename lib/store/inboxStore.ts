import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { AppError } from "../error";

export interface Issue {
  fingerprint: string;
  count: number;
  firstSeen: number;
  lastSeen: number;
  sample: AppError;
}

type InboxStore = {
  issues: Record<string, Issue>;
  events: AppError[];
  add: (newEvent: AppError) => void;
  removeEvent: (id: string) => void;
  clear: () => void;
};

export const useInboxStore = create<InboxStore>()(
  persist(
    (set) => ({
      issues: {},
      events: [],
      add: (newEvent: AppError) => {
        set((state) => {
          const fp = newEvent.fingerprint;
          const existing = state.issues[fp];
          
          const updatedIssue: Issue = existing
            ? {
                ...existing,
                count: existing.count + 1,
                lastSeen: newEvent.timestamp,
                sample: newEvent,
              }
            : {
                fingerprint: fp,
                count: 1,
                firstSeen: newEvent.timestamp,
                lastSeen: newEvent.timestamp,
                sample: newEvent,
              };

          return {
            events: [newEvent, ...state.events],
            issues: {
              ...state.issues,
              [fp]: updatedIssue,
            },
          };
        });
      },
      removeEvent: (id: string) => {
        set((state) => {
          const eventToRemove = state.events.find((e) => e.id === id);
          if (!eventToRemove) return state;

          const updatedEvents = state.events.filter((e) => e.id !== id);
          
          // Note: we don't necessarily want to decrement issue count here 
          // as the issue represents the occurrence, but if we wanted to be strict:
          const fp = eventToRemove.fingerprint;
          const existingIssue = state.issues[fp];
          
          const nextIssues = { ...state.issues };
          if (existingIssue) {
            if (existingIssue.count <= 1) {
              delete nextIssues[fp];
            } else {
              nextIssues[fp] = {
                ...existingIssue,
                count: existingIssue.count - 1,
              };
            }
          }

          return {
            events: updatedEvents,
            issues: nextIssues,
          };
        });
      },
      clear: () => set({ events: [], issues: {} }),
    }),
    {
      name: "inbox-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

