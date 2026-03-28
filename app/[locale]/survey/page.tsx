import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import SurveyClient from "./SurveyClient";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "survey" });
  return { title: t("title") };
}

export default function SurveyPage() {
  return <SurveyClient />;
}
