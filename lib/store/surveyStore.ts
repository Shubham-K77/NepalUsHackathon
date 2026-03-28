import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type { UserInfo, SurveyAnswer, SurveyResult, SurveyStep } from "@/types/survey";
import { buildSurveyResult } from "@/lib/utils/gdsScoring";
import { saveResult } from "@/lib/utils/localStorage";

interface SurveyState {
  step: SurveyStep;
  currentQuestion: number;
  userInfo: UserInfo | null;
  answers: SurveyAnswer[];
  result: SurveyResult | null;
  isSubmitting: boolean;

  // Actions
  setUserInfo: (info: UserInfo) => void;
  setAnswer: (questionId: number, answer: boolean) => void;
  nextQuestion: () => void;
  prevQuestion: () => void;
  submitSurvey: () => void;
  retakeSurvey: () => void;
  reset: () => void;
  goToStep: (step: SurveyStep) => void;
}

const initialState = {
  step: "info" as SurveyStep,
  currentQuestion: 1,
  userInfo: null,
  answers: [],
  result: null,
  isSubmitting: false,
};

export const useSurveyStore = create<SurveyState>()(
  devtools(
    (set, get) => ({
      ...initialState,

      setUserInfo: (info) =>
        set({ userInfo: info, step: "questions", currentQuestion: 1 }),

      setAnswer: (questionId, answer) =>
        set((state) => {
          const existing = state.answers.findIndex(
            (a) => a.questionId === questionId
          );
          const updated =
            existing >= 0
              ? state.answers.map((a) =>
                  a.questionId === questionId ? { ...a, answer } : a
                )
              : [...state.answers, { questionId, answer }];
          return { answers: updated };
        }),

      nextQuestion: () =>
        set((state) => ({
          currentQuestion: Math.min(state.currentQuestion + 1, 15),
        })),

      prevQuestion: () =>
        set((state) => ({
          currentQuestion: Math.max(state.currentQuestion - 1, 1),
        })),

      submitSurvey: () => {
        const { userInfo, answers } = get();
        if (!userInfo) return;
        set({ isSubmitting: true });
        const result = buildSurveyResult(userInfo, answers);
        saveResult(result);
        set({ result, step: "results", isSubmitting: false });
      },

      retakeSurvey: () =>
        set({
          step: "questions",
          currentQuestion: 1,
          answers: [],
          result: null,
        }),

      goToStep: (step) => set({ step }),

      reset: () => set(initialState),
    }),
    { name: "survey-store" }
  )
);
