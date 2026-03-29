const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3001/api/v1";

interface ApiResponse<T = unknown> {
  message: string;
  success: boolean;
  data: T;
}

export interface UserProfile {
  id: string;
  name: string;
  dob: string;
  gender: string;
  genderNe?: string;
  district: string;
  districtNe?: string;
  province: string;
  provinceNe?: string;
  createdAt: string;
}

export interface AssessmentAnswer {
  questionId: number;
  answer: "yes" | "no";
}

export interface AssessmentRecord {
  id: string;
  userId: string;
  answers: boolean[];
  score: number;
  severity: "normal" | "moderate" | "severe";
  createdAt: string;
  feedback?: Array<{
    id: string;
    suggestions: unknown;
    comment?: string | null;
  }>;
  vapiCall?: {
    status: string;
    summary: string | null;
    suggestions: unknown;
    crisisDetected: boolean;
    createdAt: string;
  } | null;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: {
    yes: { label: string; score: number };
    no: { label: string; score: number };
  };
  depressiveAnswer: "yes" | "no";
}

export interface VapiCallStartResponse {
  vapiCallId: string;
  dbRecordId: string;
  webCallUrl: string | null;
  status: string;
}

export interface VapiCallStatus {
  status: string;
  summary: string | null;
  suggestions: unknown;
  crisisDetected: boolean;
  createdAt: string;
}

export interface InterviewStartConfig {
  assistantId: string;
  assistantOverrides: {
    maxDurationSeconds?: number;
    model?: {
      provider: string;
      model: string;
      messages: Array<{ role: string; content: string }>;
    };
    metadata?: Record<string, string>;
  };
}

interface SignupData {
  name: string;
  dob: string;
  gender: string;
  genderNe?: string;
  district: string;
  districtNe?: string;
  province: string;
  provinceNe?: string;
  pin: string;
}

interface LoginData {
  name: string;
  dob: string;
  pin: string;
}

async function apiCall<T>(
  endpoint: string,
  options?: RequestInit,
): Promise<{ data: ApiResponse<T>; status: number }> {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  let data: ApiResponse<T>;
  try {
    data = (await res.json()) as ApiResponse<T>;
  } catch {
    data = {
      success: false,
      message: "Invalid response from server",
      data: {} as T,
    };
  }
  return { data, status: res.status };
}

export const api = {
  signup: (data: SignupData) =>
    apiCall("/users/signup", { method: "POST", body: JSON.stringify(data) }),

  login: (data: LoginData) =>
    apiCall("/users/login", { method: "POST", body: JSON.stringify(data) }),

  logout: () => apiCall("/users/logout", { method: "POST" }),

  getCurrentUser: () => apiCall<UserProfile>("/users/"),

  getQuestions: () => apiCall<QuizQuestion[]>("/questions/"),

  submitAssessment: (answers: AssessmentAnswer[]) =>
    apiCall<{
      assessmentInfo: AssessmentRecord;
      feedbackInfo: {
        id: string;
        suggestions: unknown;
        comment: string | null;
      };
    }>("/questions/", {
      method: "POST",
      body: JSON.stringify({ answers }),
    }),

  getHistory: () => apiCall<AssessmentRecord[]>("/questions/history"),

  getHistoryById: (assessmentId: string) =>
    apiCall<AssessmentRecord>(`/questions/history/${assessmentId}`),

  setupInterviewAssistant: () =>
    apiCall<{ assistantId: string }>("/interviews/setup", { method: "POST" }),

  startInterviewCall: (assessmentId: string) =>
    apiCall<VapiCallStartResponse>("/interviews/call", {
      method: "POST",
      body: JSON.stringify({ assessmentId }),
    }),

  getInterviewCallStatus: (assessmentId: string) =>
    apiCall<VapiCallStatus | null>(`/interviews/call/${assessmentId}`),

  getInterviewStartConfig: (assessmentId: string) =>
    apiCall<InterviewStartConfig>(`/interviews/start/${assessmentId}`),

  linkInterviewCall: (assessmentId: string, vapiCallId: string) =>
    apiCall<{ linked: boolean }>(`/interviews/link/${assessmentId}`, {
      method: "POST",
      body: JSON.stringify({ vapiCallId }),
    }),

  completeInterviewCall: (
    assessmentId: string,
    payload: {
      vapiCallId?: string;
      transcript?: string;
      summary?: string;
      messages?: unknown[];
    },
  ) =>
    apiCall<{ completed: boolean }>(`/interviews/complete/${assessmentId}`, {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  checkUserExists: async (name: string, dob: string): Promise<boolean> => {
    const { status, data } = await apiCall<{ exists: boolean }>(
      "/users/exists",
      {
        method: "POST",
        body: JSON.stringify({ name, dob }),
      },
    );
    if (status === 200 && data.success) {
      return Boolean(data.data?.exists);
    }
    throw new Error(`Unexpected status ${status} from user check`);
  },
};
