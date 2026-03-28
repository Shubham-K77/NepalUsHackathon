"use client";

import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, ClipboardList, Users, HeartHandshake } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", labelKey: "home", Icon: Home },
  { href: "/survey", labelKey: "survey", Icon: ClipboardList },
  { href: "/community", labelKey: "community", Icon: Users },
  { href: "/resources", labelKey: "resources", Icon: HeartHandshake },
] as const;

export default function BottomNav() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 safe-bottom bg-white border-t-2 border-cream-300 shadow-lg">
      <div className="flex items-center justify-around max-w-2xl mx-auto px-2">
        {navItems.map(({ href, labelKey, Icon }) => {
          const fullHref = `/${locale}${href}`;
          const isActive =
            href === "/"
              ? pathname === `/${locale}` || pathname === `/${locale}/`
              : pathname.startsWith(`/${locale}${href}`);

          return (
            <Link
              key={href}
              href={fullHref}
              className={cn(
                "flex flex-col items-center justify-center gap-1 py-3 px-4 min-h-[64px] min-w-[64px] rounded-xl transition-all duration-200",
                isActive
                  ? "text-maroon-700"
                  : "text-warmBrown/60 hover:text-warmBrown"
              )}
              aria-label={t(labelKey)}
              aria-current={isActive ? "page" : undefined}
            >
              <Icon
                className={cn(
                  "h-7 w-7 transition-all duration-200",
                  isActive && "scale-110"
                )}
                strokeWidth={isActive ? 2.5 : 2}
              />
              <span
                className={cn(
                  "text-sm font-semibold leading-none",
                  isActive && "font-bold"
                )}
              >
                {t(labelKey)}
              </span>
              {isActive && (
                <span className="absolute bottom-0 h-1 w-10 bg-maroon-700 rounded-t-full" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
