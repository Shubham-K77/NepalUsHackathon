import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import ScoreResult from "@/components/results/ScoreResult";
import HistoryChart from "@/components/results/HistoryChart";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "results" });
  return { title: t("title") };
}

export default async function ResultsPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "results" });

  return (
    <>
      <Header title={t("title")} showBack />
      <div className="pt-4">
        <ScoreResult />
        <div className="px-4 pb-6">
          <HistoryChart />
        </div>
      </div>
    </>
  );
}
