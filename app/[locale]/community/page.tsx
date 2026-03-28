import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import {
  MapPin,
  Phone,
  Calendar,
  Users,
  PhoneCall,
  Sunrise,
  Handshake,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { LucideIcon } from "lucide-react";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "community" });
  return { title: t("title") };
}

export default async function CommunityPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "community" });

  const events: { key: string; color: string; bgColor: string; Icon: LucideIcon }[] = [
    { key: "e1", color: "#5B8C5A", bgColor: "#EFF5EF", Icon: Sunrise },
    { key: "e2", color: "#C8962A", bgColor: "#FDF8ED", Icon: Users },
    { key: "e3", color: "#8B1A1A", bgColor: "#FDF0F0", Icon: Handshake },
  ];

  const hotlines = [
    { label: t("hotlineNumbers.tpo"), urgent: true },
    { label: t("hotlineNumbers.cmcNepal"), urgent: false },
    { label: t("hotlineNumbers.suicidePrevention"), urgent: true },
  ];

  return (
    <>
      <Header title={t("title")} />
      <div className="px-4 pt-4 pb-6 space-y-6">
        <p className="text-lg text-warmBrown leading-relaxed">{t("subtitle")}</p>

        <section>
          <div className="flex items-center gap-3 mb-4">
            <Calendar className="h-6 w-6 text-maroon-700" />
            <div>
              <h2 className="text-xl font-bold text-darkText">{t("gatherings")}</h2>
              <p className="text-sm text-warmBrown">{t("gatheringsDesc")}</p>
            </div>
          </div>

          <div className="space-y-3">
            {events.map(({ key, color, bgColor, Icon }) => (
              <Card key={key} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="flex">
                    <div className="w-1.5 shrink-0" style={{ backgroundColor: color }} />
                    <div className="flex-1 p-5" style={{ backgroundColor: bgColor }}>
                      <div className="flex items-start gap-3">
                        <Icon className="h-8 w-8 shrink-0 mt-0.5" style={{ color }} />
                        <div className="flex-1 min-w-0">
                          <p className="text-lg font-bold text-darkText leading-snug mb-1">
                            {t(`events.${key}Title` as Parameters<typeof t>[0])}
                          </p>
                          <p className="text-base text-warmBrown leading-relaxed mb-2">
                            {t(`events.${key}Desc` as Parameters<typeof t>[0])}
                          </p>
                          <div className="flex items-center gap-2 text-sm font-semibold" style={{ color }}>
                            <MapPin className="h-4 w-4 shrink-0" />
                            <span>{t(`events.${key}Location` as Parameters<typeof t>[0])}</span>
                          </div>
                        </div>
                      </div>
                      <button
                        className="mt-4 flex items-center gap-2 rounded-xl px-4 py-3 text-base font-bold min-h-[48px] transition-all active:scale-95"
                        style={{ backgroundColor: color, color: "white" }}
                      >
                        <Phone className="h-5 w-5" />
                        {t("callJoin")}
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section>
          <div className="flex items-center gap-3 mb-4">
            <PhoneCall className="h-6 w-6 text-maroon-700" />
            <div>
              <h2 className="text-xl font-bold text-darkText">{t("hotlines")}</h2>
              <p className="text-sm text-warmBrown">{t("hotlinesDesc")}</p>
            </div>
          </div>

          <div className="space-y-3">
            {hotlines.map(({ label, urgent }) => {
              const [name, number] = label.split(": ");
              return (
                <Card key={label} className={urgent ? "border-maroon-200" : "border-cream-300"}>
                  <CardContent className="p-5 flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <p className="text-base font-bold text-darkText truncate">{name}</p>
                      <p className="text-xl font-bold text-maroon-700">{number}</p>
                    </div>
                    <a
                      href={`tel:${number?.replace(/-/g, "")}`}
                      className="flex items-center gap-2 rounded-xl bg-maroon-700 text-white px-4 py-3 text-base font-bold min-h-[52px] shrink-0 hover:bg-maroon-800 transition-colors"
                    >
                      <Phone className="h-5 w-5" />
                    </a>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        <section>
          <Card className="bg-sage-50 border-sage-200">
            <CardContent className="p-6 text-center">
              <Users className="h-12 w-12 text-sage-600 mx-auto mb-3" />
              <h2 className="text-xl font-bold text-sage-800 mb-2">{t("supportGroups")}</h2>
              <p className="text-base text-sage-700 leading-relaxed">{t("supportGroupsDesc")}</p>
            </CardContent>
          </Card>
        </section>
      </div>
    </>
  );
}
