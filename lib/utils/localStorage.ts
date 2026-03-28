import type { SurveyResult, SurveyHistoryEntry } from "@/types/survey";

const HISTORY_KEY = "manko-kura-history";
const LATEST_KEY = "manko-kura-latest-result";

export function saveResult(result: SurveyResult): void {
  if (typeof window === "undefined") return;
  // Save as latest
  localStorage.setItem(LATEST_KEY, JSON.stringify(result));

  // Append to history (keep max 20 entries)
  const history = getHistory();
  const entry: SurveyHistoryEntry = {
    id: result.id,
    score: result.score,
    category: result.category,
    completedAt: result.completedAt,
    userInfo: result.userInfo,
  };
  const updated = [entry, ...history].slice(0, 20);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
}

export function getHistory(): SurveyHistoryEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as SurveyHistoryEntry[];
  } catch {
    return [];
  }
}

export function getLatestResult(): SurveyResult | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(LATEST_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as SurveyResult;
  } catch {
    return null;
  }
}

export function clearHistory(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(HISTORY_KEY);
  localStorage.removeItem(LATEST_KEY);
}
