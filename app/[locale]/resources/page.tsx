import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import { Phone, MapPin, Building2, Stethoscope, Globe, AlertTriangle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "resources" });
  return { title: t("title") };
}

export default async function ResourcesPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "resources" });

  const doctors = [
    {
      nameKey: "doctors.d1Name",
      specKey: "doctors.d1Spec",
      locationKey: "doctors.d1Location",
      phoneKey: "doctors.d1Phone",
      isFree: true,
    },
    {
      nameKey: "doctors.d2Name",
      specKey: "doctors.d2Spec",
      locationKey: "doctors.d2Location",
      phoneKey: "doctors.d2Phone",
      isFree: false,
    },
    {
      nameKey: "doctors.d3Name",
      specKey: "doctors.d3Spec",
      locationKey: "doctors.d3Location",
      phoneKey: "doctors.d3Phone",
      isFree: true,
    },
  ] as const;

  const hospitals = [
    {
      nameKey: "hospitals.h1Name",
      locationKey: "hospitals.h1Location",
      phoneKey: "hospitals.h1Phone",
    },
    {
      nameKey: "hospitals.h2Name",
      locationKey: "hospitals.h2Location",
      phoneKey: "hospitals.h2Phone",
    },
    {
      nameKey: "hospitals.h3Name",
      locationKey: "hospitals.h3Location",
      phoneKey: "hospitals.h3Phone",
    },
  ] as const;

  return (
    <>
      <Header title={t("title")} />
      <div className="px-4 pt-4 pb-6 space-y-8">
        {/* Subtitle */}
        <p className="text-lg text-warmBrown leading-relaxed">
          {t("subtitle")}
        </p>

        {/* Emergency alert */}
        <div className="rounded-2xl bg-maroon-50 border-2 border-maroon-200 p-4 flex items-start gap-3">
          <AlertTriangle className="h-6 w-6 text-maroon-700 shrink-0 mt-0.5" />
          <p className="text-base font-semibold text-maroon-800 leading-relaxed">
            {t("emergencyNote")}
          </p>
        </div>

        {/* Psychiatrists & Counselors */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <Stethoscope className="h-6 w-6 text-maroon-700" />
            <div>
              <h2 className="text-xl font-bold text-darkText">{t("psychiatrists")}</h2>
              <p className="text-sm text-warmBrown">{t("psychiatristsDesc")}</p>
            </div>
          </div>

          <div className="space-y-3">
            {doctors.map(({ nameKey, specKey, locationKey, phoneKey, isFree }) => {
              const phone = t(phoneKey as Parameters<typeof t>[0]);
              return (
                <Card key={nameKey}>
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start gap-2 flex-wrap mb-1">
                          <p className="text-lg font-bold text-darkText">
                            {t(nameKey as Parameters<typeof t>[0])}
                          </p>
                          {isFree && (
                            <Badge variant="sage" className="text-sm shrink-0">
                              {t("free")}
                            </Badge>
                          )}
                        </div>
                        <p className="text-base font-semibold text-maroon-600 mb-1">
                          {t(specKey as Parameters<typeof t>[0])}
                        </p>
                        <div className="flex items-center gap-1.5 text-sm text-warmBrown">
                          <MapPin className="h-4 w-4 shrink-0" />
                          <span>{t(locationKey as Parameters<typeof t>[0])}</span>
                        </div>
                      </div>
                    </div>
                    <a
                      href={`tel:${phone.replace(/-/g, "")}`}
                      className="flex items-center justify-center gap-2 w-full rounded-xl bg-maroon-700 text-white py-3 text-base font-bold min-h-[52px] hover:bg-maroon-800 transition-colors"
                    >
                      <Phone className="h-5 w-5" />
                      {phone} — {t("callNow")}
                    </a>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Hospitals */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <Building2 className="h-6 w-6 text-maroon-700" />
            <div>
              <h2 className="text-xl font-bold text-darkText">{t("hospitalsTitle")}</h2>
              <p className="text-sm text-warmBrown">{t("hospitalsDesc")}</p>
            </div>
          </div>

          <div className="space-y-3">
            {hospitals.map(({ nameKey, locationKey, phoneKey }) => {
              const phone = t(phoneKey as Parameters<typeof t>[0]);
              return (
                <Card key={nameKey} className="overflow-hidden">
                  <CardContent className="p-5">
                    <p className="text-lg font-bold text-darkText mb-1">
                      {t(nameKey as Parameters<typeof t>[0])}
                    </p>
                    <div className="flex items-center gap-1.5 text-sm text-warmBrown mb-4">
                      <MapPin className="h-4 w-4 shrink-0" />
                      <span>{t(locationKey as Parameters<typeof t>[0])}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <a
                        href={`tel:${phone.replace(/-/g, "")}`}
                        className="flex items-center justify-center gap-1.5 rounded-xl bg-maroon-700 text-white py-3 text-sm font-bold min-h-[48px] hover:bg-maroon-800 transition-colors"
                      >
                        <Phone className="h-4 w-4" />
                        {t("callNow")}
                      </a>
                      <button className="flex items-center justify-center gap-1.5 rounded-xl border-2 border-maroon-300 text-maroon-700 py-3 text-sm font-bold min-h-[48px] hover:bg-maroon-50 transition-colors">
                        <MapPin className="h-4 w-4" />
                        {t("getDirections")}
                      </button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Online Resources */}
        <section>
          <Card className="bg-gold-50 border-gold-200">
            <CardContent className="p-6">
              <div className="flex items-start gap-3 mb-3">
                <Globe className="h-7 w-7 text-gold-600 shrink-0 mt-0.5" />
                <div>
                  <h2 className="text-xl font-bold text-gold-900">
                    {t("onlineResources")}
                  </h2>
                  <p className="text-base text-gold-800 mt-1">
                    {t("onlineDesc")}
                  </p>
                </div>
              </div>
              <Badge variant="secondary" className="mt-2">
                {t("online")}
              </Badge>
            </CardContent>
          </Card>
        </section>
      </div>
    </>
  );
}
