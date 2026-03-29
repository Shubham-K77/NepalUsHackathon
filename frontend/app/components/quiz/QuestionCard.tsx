import { useState } from "react";
import type { GDS15Question } from "~/lib/quiz-data";
import { Card } from "../ui/Card";
import { AudioButton } from "./AudioButton";

interface QuestionCardProps {
  question: GDS15Question;
  questionNumber: number;
  onAnswer: (answer: "yes" | "no") => void;
}

export function QuestionCard({ question, questionNumber, onAnswer }: QuestionCardProps) {
  const audioSrc = `/audio/que_${questionNumber}.mp3`;
  const [pressed, setPressed] = useState<"yes" | "no" | null>(null);

  const handleAnswer = (answer: "yes" | "no") => {
    setPressed(answer);
    // Small haptic-feel delay before advancing
    setTimeout(() => {
      setPressed(null);
      onAnswer(answer);
    }, 200);
  };

  return (
    <Card className="!p-0 overflow-hidden">
      {/* Coloured top strip with question number badge */}
      <div className="bg-gradient-to-r from-[#1F7A7A] to-[#3E7457] px-6 pt-5 pb-6">
        <div className="flex items-center justify-between">
          <div className="bg-white/20 rounded-full px-3 py-1">
            <span className="text-[15px] font-bold text-white">
              प्रश्न #{questionNumber}
            </span>
          </div>
          <AudioButton src={audioSrc} autoPlay={true} compact />
        </div>
      </div>

      {/* Card body */}
      <div className="px-6 pt-4 pb-6 space-y-5">
        {/* Question text */}
        <h2 className="text-[24px] sm:text-[26px] font-bold text-[#111111] leading-relaxed text-center">
          {question.question}
        </h2>


        {/* Yes / No buttons */}
        <div className="grid grid-cols-2 gap-4">
          {/* YES */}
          <button
            type="button"
            id={`answer-yes-q${questionNumber}`}
            onClick={() => handleAnswer("yes")}
            disabled={pressed !== null}
            className={`
              h-[72px] rounded-[14px] text-[26px] font-bold
              transition-all duration-150 touch-manipulation select-none
              flex items-center justify-center gap-2
              ${pressed === "yes"
                ? "scale-95 bg-[#155F5F] text-white shadow-inner"
                : "bg-[#1F7A7A] text-white hover:brightness-95 active:brightness-90 active:scale-[0.97] shadow-md"
              }
            `}
          >
            <span>✓</span>
            {question.options.yes.label}
          </button>

          {/* NO */}
          <button
            type="button"
            id={`answer-no-q${questionNumber}`}
            onClick={() => handleAnswer("no")}
            disabled={pressed !== null}
            className={`
              h-[72px] rounded-[14px] text-[26px] font-bold
              transition-all duration-150 touch-manipulation select-none
              flex items-center justify-center gap-2
              ${pressed === "no"
                ? "scale-95 bg-[#E8F5F0] text-[#155F5F] shadow-inner border-3 border-[#155F5F]"
                : "bg-white text-[#1F7A7A] border-[3px] border-[#1F7A7A] hover:bg-[#E8F5F0] active:bg-[#d0ede4] active:scale-[0.97] shadow-md"
              }
            `}
          >
            <span>✗</span>
            {question.options.no.label}
          </button>
        </div>

        {/* Hint text */}
        <p className="text-center text-[15px] text-[#888888] font-medium">
          एउटा जवाफ छान्नुहोस्
        </p>
      </div>
    </Card>
  );
}
