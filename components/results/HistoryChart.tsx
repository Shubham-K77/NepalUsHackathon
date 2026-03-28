"use client";

import { useTranslations, useLocale } from "next-intl";
import { useEffect, useRef, useState } from "react";
import {
  Chart,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
  LineController,
  Filler,
} from "chart.js";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getHistory } from "@/lib/utils/localStorage";
import { formatDate } from "@/lib/utils";
import type { SurveyHistoryEntry } from "@/types/survey";
import { SCORE_COLORS } from "@/lib/utils/gdsScoring";

Chart.register(
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
  LineController,
  Filler
);

export default function HistoryChart() {
  const t = useTranslations("results");
  const locale = useLocale();
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstanceRef = useRef<Chart | null>(null);
  const [history, setHistory] = useState<SurveyHistoryEntry[]>([]);

  useEffect(() => {
    const h = getHistory();
    setHistory(h);
  }, []);

  useEffect(() => {
    if (!chartRef.current || history.length < 2) return;

    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    const sorted = [...history].reverse().slice(0, 10);
    const labels = sorted.map((e) => formatDate(e.completedAt, locale));
    const scores = sorted.map((e) => e.score);
    const pointColors = sorted.map((e) => SCORE_COLORS[e.category]);

    chartInstanceRef.current = new Chart(chartRef.current, {
      type: "line",
      data: {
        labels,
        datasets: [
          {
            label: t("scoreLabel"),
            data: scores,
            borderColor: "#8B1A1A",
            backgroundColor: "rgba(139, 26, 26, 0.08)",
            pointBackgroundColor: pointColors,
            pointBorderColor: "#fff",
            pointBorderWidth: 2,
            pointRadius: 8,
            pointHoverRadius: 10,
            fill: true,
            tension: 0.3,
            borderWidth: 2.5,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            min: 0,
            max: 15,
            ticks: {
              stepSize: 3,
              font: { size: 13, weight: "bold" },
              color: "#8B5E3C",
            },
            grid: { color: "#EDE4D0" },
          },
          x: {
            ticks: {
              maxRotation: 45,
              font: { size: 11 },
              color: "#8B5E3C",
            },
            grid: { display: false },
          },
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: "#2C1810",
            titleColor: "#FAF3E0",
            bodyColor: "#FAF3E0",
            padding: 12,
            cornerRadius: 10,
            callbacks: {
              label: (ctx) =>
                ` ${t("scoreLabel")}: ${ctx.parsed.y}/15`,
            },
          },
        },
        animation: { duration: 600 },
      },
    });

    return () => {
      chartInstanceRef.current?.destroy();
    };
  }, [history, locale, t]);

  if (history.length < 2) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t("progressChart")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-12 text-warmBrown/60">
            <p className="text-lg text-center">{t("noHistory")}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("progressChart")}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-56">
          <canvas ref={chartRef} />
        </div>
      </CardContent>
    </Card>
  );
}
