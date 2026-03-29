import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router";
import { Card } from "~/components/ui/Card";
import { Disclaimer } from "~/components/layout/Disclaimer";
import { GamifiedProgressBar } from "~/components/quiz/ProgressBar";
import { QuestionCard } from "~/components/quiz/QuestionCard";
import { MilestoneScreen } from "~/components/quiz/MilestoneScreen";
import { Avatar, type AvatarMood } from "~/components/quiz/Avatar";
import { api, type QuizQuestion } from "~/lib/api";
import { SEGMENTS, STORAGE_KEYS, QUIZ_COPY } from "~/lib/quiz-data";

export function meta() {
  return [
    { title: "मनको कुरा — प्रश्नावली" },
    { name: "description", content: "GDS-15 मानसिक स्वास्थ्य प्रश्नावली" },
  ];
}

interface QuizAnswer {
  questionId: number;
  answer: "yes" | "no";
}

type QuizView = "question" | "milestone" | "submitting";

function saveProgress(questionIndex: number, answers: QuizAnswer[]) {
  try {
    localStorage.setItem(
      STORAGE_KEYS.QUIZ_PROGRESS,
      JSON.stringify(questionIndex),
    );
    localStorage.setItem(STORAGE_KEYS.QUIZ_ANSWERS, JSON.stringify(answers));
  } catch {
    /* localStorage may be unavailable */
  }
}

function loadProgress(): {
  questionIndex: number;
  answers: QuizAnswer[];
} | null {
  try {
    const idx = localStorage.getItem(STORAGE_KEYS.QUIZ_PROGRESS);
    const ans = localStorage.getItem(STORAGE_KEYS.QUIZ_ANSWERS);
    if (idx !== null && ans !== null) {
      return { questionIndex: JSON.parse(idx), answers: JSON.parse(ans) };
    }
  } catch {
    /* ignore */
  }
  return null;
}

function clearProgress() {
  try {
    localStorage.removeItem(STORAGE_KEYS.QUIZ_PROGRESS);
    localStorage.removeItem(STORAGE_KEYS.QUIZ_ANSWERS);
  } catch {
    /* ignore */
  }
}

// Get avatar mood based on progress & state
function getAvatarMood(questionIndex: number, view: QuizView): AvatarMood {
  if (view === "milestone") return "celebrating";
  if (view === "submitting") return "excited";
  if (questionIndex === 0) return "encouraging";
  if (questionIndex >= 12) return "excited";
  if (questionIndex >= 8) return "happy";
  return "thinking";
}

export default function Quiz() {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [questionsLoading, setQuestionsLoading] = useState(true);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);
  const [view, setView] = useState<QuizView>("question");
  const [currentMilestoneIdx, setCurrentMilestoneIdx] = useState(0);
  const [error, setError] = useState("");
  const [animKey, setAnimKey] = useState(0);
  const [resumePrompt, setResumePrompt] = useState(false);
  const [savedProgress, setSavedProgress] = useState<{
    questionIndex: number;
    answers: QuizAnswer[];
  } | null>(null);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const { data, status } = await api.getQuestions();
        if (status === 200 && data.success) {
          setQuestions(data.data || []);
          return;
        }

        if (status === 401) {
          navigate("/", { replace: true });
          return;
        }

        setError("प्रश्नहरू लोड गर्न सकिएन। फेरि प्रयास गर्नुहोस्।");
      } catch {
        setError("प्रश्नहरू लोड गर्न सकिएन। फेरि प्रयास गर्नुहोस्।");
      } finally {
        setQuestionsLoading(false);
      }
    };

    fetchQuestions();
  }, [navigate]);

  // Load saved progress on mount — show resume prompt
  useEffect(() => {
    if (!questions.length) return;

    const saved = loadProgress();
    if (
      saved &&
      saved.questionIndex > 0 &&
      saved.questionIndex < questions.length
    ) {
      setSavedProgress(saved);
      setResumePrompt(true);
    }
  }, [questions]);

  const handleResume = useCallback(() => {
    if (savedProgress) {
      setQuestionIndex(savedProgress.questionIndex);
      setAnswers(savedProgress.answers);
    }
    setResumePrompt(false);
  }, [savedProgress]);

  const handleStartFresh = useCallback(() => {
    clearProgress();
    setResumePrompt(false);
  }, []);

  // Handle answer
  const handleAnswer = useCallback(
    (answer: "yes" | "no") => {
      const question = questions[questionIndex];
      if (!question) return;
      const newAnswers = [...answers, { questionId: question.id, answer }];
      const nextIndex = questionIndex + 1;

      setAnswers(newAnswers);

      const completedQuestionId = question.id;
      const segmentEndIds = [5, 10];

      if (segmentEndIds.includes(completedQuestionId)) {
        const milestoneIdx = completedQuestionId === 5 ? 0 : 1;
        setCurrentMilestoneIdx(milestoneIdx);
        setView("milestone");
        saveProgress(nextIndex, newAnswers);
        return;
      }

      if (nextIndex >= questions.length) {
        submitQuiz(newAnswers);
        return;
      }

      setQuestionIndex(nextIndex);
      setAnimKey((k) => k + 1);
      saveProgress(nextIndex, newAnswers);
    },
    [questionIndex, answers, questions],
  );

  const handleMilestoneContinue = useCallback(() => {
    setQuestionIndex((prev) => prev + 1);
    setView("question");
    setAnimKey((k) => k + 1);
  }, []);

  const submitQuiz = useCallback(
    async (finalAnswers: QuizAnswer[]) => {
      setView("submitting");
      setError("");

      try {
        const { data, status } = await api.submitAssessment(finalAnswers);

        if (status === 201 && data.success) {
          clearProgress();
          const assessmentId = data.data?.assessmentInfo?.id;
          if (assessmentId) {
            navigate(`/results?assessmentId=${assessmentId}`, {
              state: { assessmentData: data.data },
            });
            return;
          }

          navigate("/results");
          return;
        }

        if (status === 401) {
          navigate("/", { replace: true });
          return;
        }

        setView("question");
        setError(data.message || "नतिजा पठाउन सकिएन। फेरि प्रयास गर्नुहोस्।");
      } catch {
        setView("question");
        setError("नतिजा पठाउन सकिएन। फेरि प्रयास गर्नुहोस्।");
      }
    },
    [navigate],
  );

  const currentQuestion = questions[questionIndex];
  const currentSegment = SEGMENTS.find(
    (s) =>
      currentQuestion &&
      currentQuestion.id >= s.start &&
      currentQuestion.id <= s.end,
  );
  const avatarMood = getAvatarMood(questionIndex, view);

  if (questionsLoading) {
    return (
      <div className="min-h-screen bg-[#F2FBF7] flex flex-col items-center pt-6 pb-24 px-4">
        <h1 className="text-[26px] font-bold text-[#1F7A7A] mb-2">
          {QUIZ_COPY.title}
        </h1>
        <div className="w-full max-w-[480px] mt-4 space-y-4">
          <div className="h-5 w-40 bg-[#E0E0E0] rounded-full animate-pulse mx-auto" />
          <Card className="!p-0 overflow-hidden">
            <div className="h-20 bg-[#DCEFEA] animate-pulse" />
            <div className="px-6 py-6 space-y-4">
              <div className="h-7 w-full bg-[#EAEAEA] rounded-xl animate-pulse" />
              <div className="h-7 w-[85%] bg-[#EAEAEA] rounded-xl animate-pulse mx-auto" />
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="h-[72px] bg-[#EAEAEA] rounded-[14px] animate-pulse" />
                <div className="h-[72px] bg-[#EAEAEA] rounded-[14px] animate-pulse" />
              </div>
            </div>
          </Card>
        </div>
        <Disclaimer />
      </div>
    );
  }

  if (!questions.length) {
    return (
      <div className="min-h-screen bg-[#F2FBF7] flex flex-col items-center justify-center px-4 pb-24">
        <Card className="max-w-[420px] w-full text-center">
          <div className="space-y-4 py-4">
            <p className="text-[24px] font-bold text-[#111111]">
              प्रश्नहरू उपलब्ध छैनन्
            </p>
            <p className="text-[18px] text-[#3B3B3B]">
              केही बेरपछि फेरि प्रयास गर्नुहोस्।
            </p>
            <button
              type="button"
              onClick={() => navigate("/dashboard")}
              className="h-[54px] px-6 rounded-[14px] bg-[#1F7A7A] text-white text-[18px] font-semibold"
            >
              ड्यासबोर्डमा जानुहोस्
            </button>
          </div>
        </Card>
        <Disclaimer />
      </div>
    );
  }

  // Resume prompt
  if (resumePrompt && savedProgress) {
    return (
      <div className="min-h-screen bg-[#F2FBF7] flex flex-col items-center justify-center pb-24 px-4">
        <Card className="max-w-[420px] w-full text-center">
          <div className="space-y-5 py-4">
            <Avatar mood="encouraging" size="md" className="mx-auto" />
            <h2 className="text-[26px] font-bold text-[#111111]">
              स्वागत छ फेरि! 🙏
            </h2>
            <p className="text-[20px] font-medium text-[#3B3B3B]">
              तपाईंले <strong>{savedProgress.questionIndex}</strong> वटा
              प्रश्नको जवाफ दिइसक्नुभएको छ। जहाँबाट छोड्नुभएको थियो त्यहींबाट
              जारी राख्ने?
            </p>
            <div className="flex flex-col gap-3">
              <button
                id="resume-quiz-btn"
                onClick={handleResume}
                className="h-[60px] w-full rounded-[14px] bg-[#1F7A7A] text-white text-[22px] font-semibold hover:brightness-95 active:scale-[0.97] transition-all"
              >
                जारी राख्नुहोस् →
              </button>
              <button
                id="restart-quiz-btn"
                onClick={handleStartFresh}
                className="h-[52px] w-full rounded-[14px] border-2 border-[#E0E0E0] text-[#3B3B3B] text-[20px] font-medium hover:bg-[#F2FBF7] transition-all"
              >
                नयाँ सुरुवात गर्नुहोस्
              </button>
            </div>
          </div>
        </Card>
        <Disclaimer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F2FBF7] flex flex-col items-center pt-6 pb-24 px-4">
      {/* Header */}
      <h1 className="text-[26px] font-bold text-[#1F7A7A] mb-1">
        {QUIZ_COPY.title}
      </h1>

      {/* Segment label */}
      {currentSegment && view === "question" && (
        <p className="text-[15px] font-medium text-[#3B3B3B] mb-3">
          {currentSegment.emoji} भाग {SEGMENTS.indexOf(currentSegment) + 1}:{" "}
          {currentSegment.label}
        </p>
      )}

      {/* Gamified Progress Bar with avatar */}
      {view === "question" && (
        <GamifiedProgressBar
          current={questionIndex + 1}
          total={questions.length || 15}
          avatarMood={avatarMood}
        />
      )}

      {/* Main Content */}
      {view === "question" && currentQuestion && (
        <div
          key={animKey}
          className="w-full max-w-[480px] animate-slide-in-right mt-2"
        >
          <QuestionCard
            question={currentQuestion}
            questionNumber={currentQuestion.id}
            onAnswer={handleAnswer}
          />
        </div>
      )}

      {view === "milestone" && (
        <div className="w-full max-w-[480px] animate-slide-in-right mt-4">
          <Card className="!px-4 !py-2">
            <MilestoneScreen
              segmentIndex={currentMilestoneIdx}
              milestone={SEGMENTS[currentMilestoneIdx].milestone}
              progress={SEGMENTS[currentMilestoneIdx].progress}
              encourage={SEGMENTS[currentMilestoneIdx].encourage}
              emoji={SEGMENTS[currentMilestoneIdx].emoji}
              onContinue={handleMilestoneContinue}
            />
          </Card>
        </div>
      )}

      {view === "submitting" && (
        <div className="w-full max-w-[480px] mt-8">
          <Card>
            <div className="flex flex-col items-center gap-6 py-8">
              <Avatar mood="excited" size="md" className="animate-bounce" />
              <div className="w-12 h-12 border-4 border-[#1F7A7A] border-t-transparent rounded-full animate-spin" />
              <p className="text-[22px] font-medium text-[#3B3B3B]">
                {QUIZ_COPY.submitting}
              </p>
              <p className="text-[18px] text-[#888888]">
                तपाईंको जवाफ पठाउँदैछौं...
              </p>
            </div>
          </Card>
        </div>
      )}

      {/* Error toast */}
      {error && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-[#AB5338] text-white px-6 py-3 rounded-[12px] shadow-lg z-50 text-[18px] font-medium animate-slide-in-right">
          {error}
        </div>
      )}

      <Disclaimer />
    </div>
  );
}
