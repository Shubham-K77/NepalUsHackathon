import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import HeroSection from "@/components/landing/HeroSection";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "common" });
  return { title: `${t("appName")} — ${t("appTagline")}` };
}

export default function HomePage() {
  return (
    <>
      <Header />
      <HeroSection />
    </>
  );
}
