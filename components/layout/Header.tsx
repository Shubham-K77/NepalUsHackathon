"use client";

import { useTranslations } from "next-intl";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import LanguageSwitcher from "./LanguageSwitcher";

interface HeaderProps {
  title?: string;
  showBack?: boolean;
  transparent?: boolean;
}

export default function Header({
  title,
  showBack = false,
  transparent = false,
}: HeaderProps) {
  const t = useTranslations("common");
  const router = useRouter();

  return (
    <header
      className={`sticky top-0 z-40 safe-top ${
        transparent
          ? "bg-transparent"
          : "bg-maroon-700 shadow-md"
      }`}
    >
      <div className="flex items-center justify-between px-4 py-3 max-w-2xl mx-auto">
        <div className="flex items-center gap-3 min-w-0">
          {showBack && (
            <button
              onClick={() => router.back()}
              className="flex items-center justify-center h-12 w-12 rounded-xl bg-white/15 text-white hover:bg-white/25 transition-colors shrink-0"
              aria-label={t("back")}
            >
              <ArrowLeft className="h-6 w-6" />
            </button>
          )}
          {title && (
            <h1 className="text-xl font-bold text-white truncate">{title}</h1>
          )}
          {!title && (
            <span className="text-2xl font-bold text-white">
              {t("appName")}
            </span>
          )}
        </div>
        <LanguageSwitcher />
      </div>
    </header>
  );
}
