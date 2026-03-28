"use client";

import { useTranslations } from "next-intl";
import Header from "@/components/layout/Header";
import PersonalInfoForm from "@/components/survey/PersonalInfoForm";
import QuestionCard from "@/components/survey/QuestionCard";
import SurveyProgress from "@/components/survey/SurveyProgress";
import ScoreResult from "@/components/results/ScoreResult";
import HistoryChart from "@/components/results/HistoryChart";
import { useSurveyStore } from "@/lib/store/surveyStore";
import { GDS_QUESTIONS } from "@/lib/utils/gdsScoring";

export default function SurveyClient() {
  const tSurvey = useTranslations("survey");
  const tPersonal = useTranslations("personalInfo");
  const tResults = useTranslations("results");
  const { step, currentQuestion } = useSurveyStore();

  if (step === "results") {
    return (
      <>
        <Header title={tResults("title")} showBack />
        <div className="pt-4">
          <ScoreResult />
          <div className="px-4 pb-6">
            <HistoryChart />
          </div>
        </div>
      </>
    );
  }

  if (step === "questions") {
    return (
      <>
        <Header title={tSurvey("title")} showBack />
        <SurveyProgress current={currentQuestion} total={GDS_QUESTIONS.length} />
        <div className="pt-6">
          <QuestionCard />
        </div>
      </>
    );
  }

  // Default: info step
  return (
    <>
      <Header title={tPersonal("title")} showBack />
      <div className="px-4 pt-6 pb-6">
        <p className="text-lg text-warmBrown mb-6 leading-relaxed">
          {tPersonal("subtitle")}
        </p>
        <PersonalInfoForm />
      </div>
    </>
  );
}
