"use client";

import { useTranslations } from "next-intl";
import { useAtom } from "jotai";
import { CheckCircle2, XCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSurveyStore } from "@/lib/store/surveyStore";
import { showAnswerRequiredAtom } from "@/lib/atoms/surveyAtoms";
import { cn } from "@/lib/utils";
import { GDS_QUESTIONS } from "@/lib/utils/gdsScoring";

const TOTAL = GDS_QUESTIONS.length;

export default function QuestionCard() {
  const t = useTranslations("survey");
  const tCommon = useTranslations("common");
  const [showRequired, setShowRequired] = useAtom(showAnswerRequiredAtom);

  const { currentQuestion, answers, setAnswer, nextQuestion, prevQuestion, submitSurvey } =
    useSurveyStore();

  const currentAnswer = answers.find((a) => a.questionId === currentQuestion);
  const isLast = currentQuestion === TOTAL;

  const handleAnswer = (val: boolean) => {
    setAnswer(currentQuestion, val);
    setShowRequired(false);
  };

  const handleNext = () => {
    if (currentAnswer === undefined) {
      setShowRequired(true);
      return;
    }
    setShowRequired(false);
    if (isLast) {
      submitSurvey();
    } else {
      nextQuestion();
    }
  };

  const handlePrev = () => {
    setShowRequired(false);
    prevQuestion();
  };

  const questionKey = `questions.q${currentQuestion}` as Parameters<typeof t>[0];

  return (
    <div className="flex flex-col gap-6 animate-fade-in px-4 pb-6">
      {/* Question number badge */}
      <div className="flex items-center gap-3">
        <span className="flex items-center justify-center h-12 w-12 rounded-full bg-maroon-700 text-white text-lg font-bold shrink-0">
          {currentQuestion}
        </span>
        <span className="text-base text-warmBrown font-medium">
          {t("questionOf", { current: currentQuestion, total: TOTAL })}
        </span>
      </div>

      {/* Question text */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-cream-300 min-h-[120px] flex items-center">
        <p className="text-xl font-semibold text-darkText leading-relaxed">
          {t(questionKey)}
        </p>
      </div>

      {/* Answer buttons */}
      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => handleAnswer(true)}
          className={cn(
            "flex flex-col items-center justify-center gap-2 rounded-2xl border-2 p-5 min-h-[100px] transition-all duration-200 active:scale-95",
            currentAnswer?.answer === true
              ? "border-sage-500 bg-sage-50 shadow-md"
              : "border-cream-300 bg-white hover:border-sage-300 hover:bg-sage-50/50"
          )}
          aria-pressed={currentAnswer?.answer === true}
        >
          <CheckCircle2
            className={cn(
              "h-10 w-10 transition-colors",
              currentAnswer?.answer === true ? "text-sage-600" : "text-warmBrown/40"
            )}
          />
          <span
            className={cn(
              "text-xl font-bold",
              currentAnswer?.answer === true ? "text-sage-700" : "text-warmBrown/70"
            )}
          >
            {tCommon("yes")}
          </span>
        </button>

        <button
          onClick={() => handleAnswer(false)}
          className={cn(
            "flex flex-col items-center justify-center gap-2 rounded-2xl border-2 p-5 min-h-[100px] transition-all duration-200 active:scale-95",
            currentAnswer?.answer === false
              ? "border-maroon-500 bg-maroon-50 shadow-md"
              : "border-cream-300 bg-white hover:border-maroon-300 hover:bg-maroon-50/50"
          )}
          aria-pressed={currentAnswer?.answer === false}
        >
          <XCircle
            className={cn(
              "h-10 w-10 transition-colors",
              currentAnswer?.answer === false ? "text-maroon-600" : "text-warmBrown/40"
            )}
          />
          <span
            className={cn(
              "text-xl font-bold",
              currentAnswer?.answer === false ? "text-maroon-700" : "text-warmBrown/70"
            )}
          >
            {tCommon("no")}
          </span>
        </button>
      </div>

      {/* Validation message */}
      {showRequired && (
        <p className="text-base text-maroon-600 font-medium text-center bg-maroon-50 rounded-xl py-3 px-4">
          {t("answerRequired")}
        </p>
      )}

      {/* Navigation */}
      <div className="flex gap-3 mt-2">
        {currentQuestion > 1 && (
          <Button
            variant="outline"
            size="lg"
            onClick={handlePrev}
            className="flex-1"
          >
            <ChevronLeft className="h-5 w-5" />
            {t("previousQuestion")}
          </Button>
        )}
        <Button
          variant="default"
          size="lg"
          onClick={handleNext}
          className={cn(
            "flex-1",
            currentAnswer === undefined && "opacity-60"
          )}
        >
          {isLast ? t("finishSurvey") : t("nextQuestion")}
          {!isLast && <ChevronRight className="h-5 w-5" />}
        </Button>
      </div>
    </div>
  );
}
