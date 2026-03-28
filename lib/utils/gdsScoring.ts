import type {
  GDSQuestion,
  SurveyAnswer,
  ScoreCategory,
  SurveyResult,
} from "@/types/survey";
import { generateId } from "@/lib/utils";
import type { UserInfo } from "@/types/survey";

/**
 * GDS-15 Question metadata.
 * isPositive: true means "Yes" = 0 points (protective), "No" = 1 point
 * isPositive: false means "Yes" = 1 point (depressive), "No" = 0 points
 */
export const GDS_QUESTIONS: GDSQuestion[] = [
  { id: 1, isPositive: true },   // Satisfied with life?
  { id: 2, isPositive: false },  // Dropped activities?
  { id: 3, isPositive: false },  // Life feels empty?
  { id: 4, isPositive: false },  // Often bored?
  { id: 5, isPositive: true },   // Good spirits most of time?
  { id: 6, isPositive: false },  // Afraid something bad?
  { id: 7, isPositive: true },   // Happy most of time?
  { id: 8, isPositive: false },  // Often feel helpless?
  { id: 9, isPositive: false },  // Prefer staying home?
  { id: 10, isPositive: false }, // More memory problems?
  { id: 11, isPositive: true },  // Wonderful to be alive?
  { id: 12, isPositive: false }, // Feel worthless?
  { id: 13, isPositive: true },  // Full of energy?
  { id: 14, isPositive: false }, // Situation hopeless?
  { id: 15, isPositive: false }, // Others better off?
];

export function calculateScore(answers: SurveyAnswer[]): number {
  let score = 0;
  answers.forEach((answer) => {
    const question = GDS_QUESTIONS.find((q) => q.id === answer.questionId);
    if (!question) return;
    if (question.isPositive) {
      // "No" = 1 point (depressive indicator)
      if (!answer.answer) score++;
    } else {
      // "Yes" = 1 point (depressive indicator)
      if (answer.answer) score++;
    }
  });
  return score;
}

export function getScoreCategory(score: number): ScoreCategory {
  if (score <= 4) return "normal";
  if (score <= 8) return "mild";
  if (score <= 11) return "moderate";
  return "severe";
}

export function buildSurveyResult(
  userInfo: UserInfo,
  answers: SurveyAnswer[]
): SurveyResult {
  const score = calculateScore(answers);
  const category = getScoreCategory(score);
  return {
    id: generateId(),
    userInfo,
    answers,
    score,
    category,
    completedAt: new Date().toISOString(),
  };
}

export const SCORE_COLORS: Record<ScoreCategory, string> = {
  normal: "#5B8C5A",
  mild: "#C8962A",
  moderate: "#E07B39",
  severe: "#8B1A1A",
};

export const SCORE_BG_COLORS: Record<ScoreCategory, string> = {
  normal: "#EFF5EF",
  mild: "#FDF8ED",
  moderate: "#FEF3EC",
  severe: "#FDF0F0",
};
