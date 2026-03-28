"use client";

import { useTranslations } from "next-intl";
import { Progress } from "@/components/ui/progress";

interface SurveyProgressProps {
  current: number;
  total: number;
}

export default function SurveyProgress({ current, total }: SurveyProgressProps) {
  const t = useTranslations("survey");
  const percentage = Math.round((current / total) * 100);

  return (
    <div className="space-y-2 px-4 pt-4">
      <div className="flex items-center justify-between">
        <span className="text-base font-semibold text-warmBrown">
          {t("progressLabel")}
        </span>
        <span className="text-base font-bold text-maroon-700">
          {t("questionOf", { current, total })}
        </span>
      </div>
      <Progress value={percentage} className="h-3" />
      <p className="text-sm text-warmBrown/70 text-right">{percentage}%</p>
    </div>
  );
}
