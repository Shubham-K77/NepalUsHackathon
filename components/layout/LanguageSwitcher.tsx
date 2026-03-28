"use client";

import { useLocale, useTranslations } from "next-intl";
import { useRouter, usePathname } from "next/navigation";
import { Globe } from "lucide-react";

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations("common");

  const toggleLocale = () => {
    const nextLocale = locale === "ne" ? "en" : "ne";
    // Replace current locale prefix in path
    const newPath = pathname.replace(`/${locale}`, `/${nextLocale}`);
    router.push(newPath);
  };

  return (
    <button
      onClick={toggleLocale}
      className="flex items-center gap-2 rounded-xl border-2 border-white/30 bg-white/10 px-3 py-2 text-white backdrop-blur-sm hover:bg-white/20 transition-all duration-200 min-h-[48px]"
      aria-label={t("switchLanguage")}
    >
      <Globe className="h-5 w-5 shrink-0" />
      <span className="text-base font-semibold">{t("language")}</span>
    </button>
  );
}
