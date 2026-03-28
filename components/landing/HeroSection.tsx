"use client";

import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { ArrowRight, Shield, Heart, Languages, PhoneCall } from "lucide-react";
import { Button } from "@/components/ui/button";

function DhakaPatternSVG() {
  return (
    <svg
      className="absolute inset-0 w-full h-full"
      style={{ opacity: 0.13 }}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <pattern
          id="dhaka-topi"
          x="0"
          y="0"
          width="48"
          height="48"
          patternUnits="userSpaceOnUse"
        >
          <polygon
            points="24,2 46,24 24,46 2,24"
            fill="none"
            stroke="rgba(255,255,255,0.9)"
            strokeWidth="1"
          />
          <polygon
            points="24,11 37,24 24,37 11,24"
            fill="none"
            stroke="rgba(200,150,42,0.85)"
            strokeWidth="0.75"
          />
          <polygon
            points="24,18 30,24 24,30 18,24"
            fill="rgba(200,150,42,0.5)"
            stroke="rgba(255,255,255,0.6)"
            strokeWidth="0.5"
          />
          <circle cx="24" cy="24" r="2.5" fill="rgba(255,255,255,0.8)" />
          <polygon points="24,0 27,3 24,6 21,3" fill="rgba(200,150,42,0.7)" />
          <polygon points="24,42 27,45 24,48 21,45" fill="rgba(200,150,42,0.7)" />
          <polygon points="0,24 3,21 6,24 3,27" fill="rgba(200,150,42,0.7)" />
          <polygon points="48,24 45,21 42,24 45,27" fill="rgba(200,150,42,0.7)" />
          <line x1="2" y1="24" x2="24" y2="2" stroke="rgba(255,255,255,0.2)" strokeWidth="0.4" />
          <line x1="24" y1="2" x2="46" y2="24" stroke="rgba(255,255,255,0.2)" strokeWidth="0.4" />
          <line x1="46" y1="24" x2="24" y2="46" stroke="rgba(255,255,255,0.2)" strokeWidth="0.4" />
          <line x1="24" y1="46" x2="2" y2="24" stroke="rgba(255,255,255,0.2)" strokeWidth="0.4" />
          <polygon points="0,0 6,0 0,6" fill="rgba(255,255,255,0.25)" />
          <polygon points="48,0 42,0 48,6" fill="rgba(255,255,255,0.25)" />
          <polygon points="0,48 6,48 0,42" fill="rgba(255,255,255,0.25)" />
          <polygon points="48,48 42,48 48,42" fill="rgba(255,255,255,0.25)" />
          <circle cx="7" cy="7" r="1" fill="rgba(255,255,255,0.3)" />
          <circle cx="41" cy="7" r="1" fill="rgba(255,255,255,0.3)" />
          <circle cx="7" cy="41" r="1" fill="rgba(255,255,255,0.3)" />
          <circle cx="41" cy="41" r="1" fill="rgba(255,255,255,0.3)" />
          <line x1="15" y1="11" x2="19" y2="7" stroke="rgba(255,255,255,0.25)" strokeWidth="0.6" />
          <line x1="29" y1="7" x2="33" y2="11" stroke="rgba(255,255,255,0.25)" strokeWidth="0.6" />
          <line x1="15" y1="37" x2="19" y2="41" stroke="rgba(255,255,255,0.25)" strokeWidth="0.6" />
          <line x1="29" y1="41" x2="33" y2="37" stroke="rgba(255,255,255,0.25)" strokeWidth="0.6" />
          <line x1="11" y1="15" x2="7" y2="19" stroke="rgba(255,255,255,0.25)" strokeWidth="0.6" />
          <line x1="7" y1="29" x2="11" y2="33" stroke="rgba(255,255,255,0.25)" strokeWidth="0.6" />
          <line x1="37" y1="15" x2="41" y2="19" stroke="rgba(255,255,255,0.25)" strokeWidth="0.6" />
          <line x1="41" y1="29" x2="37" y2="33" stroke="rgba(255,255,255,0.25)" strokeWidth="0.6" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#dhaka-topi)" />
    </svg>
  );
}

export default function HeroSection() {
  const t = useTranslations("landing");
  const locale = useLocale();
  const router = useRouter();

  return (
    <section className="relative overflow-hidden">
      <div className="gradient-hero min-h-[55vh] flex flex-col justify-end px-6 pt-16 pb-10 relative">
        <DhakaPatternSVG />

        <div className="absolute top-0 left-0 right-0 h-2 dhaka-border" />

        <div className="relative z-10">
          <div className="mb-2">
            <span className="text-5xl font-bold text-white drop-shadow-md tracking-tight leading-tight">
              {t("heroTitle")}
            </span>
          </div>
          <p className="text-2xl text-gold-200 font-semibold mb-4">
            {t("heroSubtitle")}
          </p>
          <p className="text-lg text-white/85 leading-relaxed mb-8 max-w-sm">
            {t("heroDescription")}
          </p>

          <div className="flex flex-wrap gap-2 mb-8">
            {[
              { icon: Shield, text: t("privacyBadge") },
              { icon: Heart, text: t("freeBadge") },
              { icon: Languages, text: t("nepaliBadge") },
            ].map(({ icon: Icon, text }) => (
              <span
                key={text}
                className="flex items-center gap-1.5 bg-white/15 backdrop-blur-sm text-white text-sm font-semibold rounded-full px-3 py-1.5"
              >
                <Icon className="h-4 w-4" />
                {text}
              </span>
            ))}
          </div>

          <Button
            size="xl"
            onClick={() => router.push(`/${locale}/survey`)}
            className="bg-white text-maroon-800 hover:bg-cream-200 shadow-xl font-bold text-xl px-8 py-5 h-auto rounded-2xl group"
          >
            {t("takeSurvey")}
            <ArrowRight className="h-6 w-6 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>
      </div>

      <div className="h-2 dhaka-border" />

      <div className="px-4 py-8 bg-cream-100">
        <h2 className="text-2xl font-bold text-darkText mb-6 text-center">
          {t("howItWorks")}
        </h2>
        <div className="space-y-4">
          {[
            { step: "1", title: t("step1Title"), desc: t("step1Desc") },
            { step: "2", title: t("step2Title"), desc: t("step2Desc") },
            { step: "3", title: t("step3Title"), desc: t("step3Desc") },
          ].map(({ step, title, desc }) => (
            <div
              key={step}
              className="flex items-start gap-4 bg-white rounded-2xl p-5 shadow-sm border border-cream-300"
            >
              <span className="flex items-center justify-center h-12 w-12 rounded-full bg-maroon-700 text-white text-xl font-bold shrink-0">
                {step}
              </span>
              <div>
                <p className="text-lg font-bold text-darkText">{title}</p>
                <p className="text-base text-warmBrown leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mx-4 mb-4 rounded-2xl bg-sage-50 border-2 border-sage-200 px-5 py-4 flex items-center gap-3">
        <Shield className="h-7 w-7 text-sage-600 shrink-0" />
        <p className="text-base font-semibold text-sage-800">{t("trustNote")}</p>
      </div>

      <div className="mx-4 mb-6 rounded-2xl bg-maroon-50 border border-maroon-200 px-5 py-4 flex items-start gap-3">
        <PhoneCall className="h-6 w-6 text-maroon-700 shrink-0 mt-0.5" />
        <div>
          <p className="text-base font-bold text-maroon-800 mb-0.5">{t("emergencyTitle")}</p>
          <p className="text-base text-maroon-700 font-semibold">{t("emergencyCall")}</p>
        </div>
      </div>
    </section>
  );
}
