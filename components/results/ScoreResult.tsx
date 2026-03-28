"use client";

import { useTranslations, useLocale } from "next-intl";
import { useEffect, useRef } from "react";
import { Chart, ArcElement, Tooltip, Legend, DoughnutController } from "chart.js";
import {
  Phone,
  RefreshCw,
  Home,
  Lightbulb,
  Leaf,
  CloudSun,
  Cloud,
  HeartHandshake,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useSurveyStore } from "@/lib/store/surveyStore";
import { SCORE_COLORS, SCORE_BG_COLORS } from "@/lib/utils/gdsScoring";
import { formatDate } from "@/lib/utils";
import type { ScoreCategory } from "@/types/survey";
import { useRouter } from "next/navigation";

Chart.register(ArcElement, Tooltip, Legend, DoughnutController);

const categoryToBadgeVariant: Record<ScoreCategory, "normal" | "mild" | "moderate" | "severe"> = {
  normal: "normal",
  mild: "mild",
  moderate: "moderate",
  severe: "severe",
};

const categoryIcons: Record<ScoreCategory, React.ComponentType<{ className?: string; style?: React.CSSProperties }>> = {
  normal: Leaf,
  mild: CloudSun,
  moderate: Cloud,
  severe: HeartHandshake,
};

export default function ScoreResult() {
  const t = useTranslations("results");
  const locale = useLocale();
  const router = useRouter();
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstanceRef = useRef<Chart | null>(null);

  const { result, retakeSurvey } = useSurveyStore();

  useEffect(() => {
    if (!result || !chartRef.current) return;

    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    const score = result.score;
    const remaining = 15 - score;
    const color = SCORE_COLORS[result.category];

    chartInstanceRef.current = new Chart(chartRef.current, {
      type: "doughnut",
      data: {
        datasets: [
          {
            data: [score, remaining],
            backgroundColor: [color, "#EDE4D0"],
            borderWidth: 0,
            borderRadius: 8,
          },
        ],
      },
      options: {
        cutout: "72%",
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: { display: false },
          tooltip: { enabled: false },
        },
        animation: { duration: 800, easing: "easeInOutQuart" },
      },
    });

    return () => {
      chartInstanceRef.current?.destroy();
    };
  }, [result]);

  if (!result) return null;

  const { score, category, userInfo, completedAt } = result;
  const color = SCORE_COLORS[category];
  const bgColor = SCORE_BG_COLORS[category];
  const interpretKey = `interpretation.${category}` as Parameters<typeof t>[0];
  const CategoryIcon = categoryIcons[category];

  const handleRetake = () => {
    retakeSurvey();
    router.push(`/${locale}/survey`);
  };

  const handleHome = () => {
    router.push(`/${locale}`);
  };

  return (
    <div className="space-y-6 px-4 pb-6 animate-slide-up">
      <div className="rounded-2xl p-6 text-center" style={{ backgroundColor: bgColor }}>
        <CategoryIcon
          className="h-14 w-14 mx-auto mb-3"
          style={{ color }}
        />
        <h2 className="text-2xl font-bold text-darkText mb-1">
          {t("greeting", { name: userInfo.name })}
        </h2>
        <p className="text-base text-warmBrown">{formatDate(completedAt, locale)}</p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-6">
            <div className="relative w-32 h-32 shrink-0">
              <canvas ref={chartRef} width={128} height={128} />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold" style={{ color }}>
                  {score}
                </span>
                <span className="text-sm text-warmBrown font-medium">
                  {t("outOf")}
                </span>
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <Badge variant={categoryToBadgeVariant[category]} className="mb-3 text-base">
                {t(`${interpretKey}.label` as Parameters<typeof t>[0])}
              </Badge>
              <p className="text-base text-darkText leading-relaxed">
                {t(`${interpretKey}.description` as Parameters<typeof t>[0])}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-l-4" style={{ borderLeftColor: color }}>
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <Lightbulb className="h-6 w-6 shrink-0 mt-0.5" style={{ color }} />
            <p className="text-lg font-semibold text-darkText leading-relaxed">
              {t(`${interpretKey}.advice` as Parameters<typeof t>[0])}
            </p>
          </div>
        </CardContent>
      </Card>

      {(category === "moderate" || category === "severe") && (
        <div className="rounded-2xl bg-maroon-50 border-2 border-maroon-200 p-5 flex items-start gap-4">
          <Phone className="h-7 w-7 text-maroon-700 shrink-0 mt-0.5" />
          <div>
            <p className="text-lg font-bold text-maroon-800 mb-1">
              {t("emergencyHelp")}
            </p>
            <p className="text-base font-semibold text-maroon-700">
              {t("emergencyNumber")}
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-3 pt-2">
        <Button size="lg" onClick={handleRetake} variant="outline">
          <RefreshCw className="h-5 w-5" />
          {t("retake")}
        </Button>
        <Button size="lg" onClick={handleHome} variant="ghost">
          <Home className="h-5 w-5" />
          {t("backHome")}
        </Button>
      </div>
    </div>
  );
}
