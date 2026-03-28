import { atom } from "jotai";

// UI state atoms (transient, component-level)
export const showAnswerRequiredAtom = atom(false);
export const isAnimatingAtom = atom(false);
export const activeTabAtom = atom<"chart" | "history">("chart");
export const historyLoadedAtom = atom(false);
