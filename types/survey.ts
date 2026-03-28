export type Gender = "male" | "female" | "other";

export interface UserInfo {
  name: string;
  age: number;
  gender: Gender;
}

export interface SurveyAnswer {
  questionId: number;
  answer: boolean; // true = Yes, false = No
}

export type ScoreCategory = "normal" | "mild" | "moderate" | "severe";

export interface SurveyResult {
  id: string;
  userId?: string;
  userInfo: UserInfo;
  answers: SurveyAnswer[];
  score: number;
  category: ScoreCategory;
  completedAt: string; // ISO date string
}

export interface SurveyHistoryEntry {
  id: string;
  score: number;
  category: ScoreCategory;
  completedAt: string;
  userInfo: UserInfo;
}

export type SurveyStep = "info" | "questions" | "results";

export interface GDSQuestion {
  id: number;
  /** True if "Yes" = 0 points (positive/protective question) */
  isPositive: boolean;
}
