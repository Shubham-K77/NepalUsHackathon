import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { Disclaimer } from "~/components/layout/Disclaimer";
import { api, type AssessmentRecord, type VapiCallStatus } from "~/lib/api";

export function meta() {
  return [
    { title: "मनको कुरा — नतिजा" },
    { name: "description", content: "GDS-15 मानसिक स्वास्थ्य परीक्षण नतिजा" },
  ];
}

type Severity = "normal" | "moderate" | "severe";

const SEVERITY_CONFIG: Record<
  Severity,
  {
    label: string;
    bgGradient: string;
    borderColor: string;
    emoji: string;
    barColor: string;
    tagBg: string;
    message: string;
  }
> = {
  normal: {
    label: "सामान्य",
    bgGradient: "from-[#E8F5F0] to-[#F2FBF7]",
    borderColor: "border-[#3E7457]",
    emoji: "😊",
    barColor: "bg-[#3E7457]",
    tagBg: "bg-[#3E7457]",
    message: "तपाईंको मानसिक स्वास्थ्य राम्रो अवस्थामा छ।",
  },
  moderate: {
    label: "मध्यम अवसाद",
    bgGradient: "from-[#FFF3EE] to-[#FFF8F4]",
    borderColor: "border-[#AB5338]",
    emoji: "🌥️",
    barColor: "bg-[#AB5338]",
    tagBg: "bg-[#AB5338]",
    message: "विशेषज्ञसँग सल्लाह लिनु उचित हुन्छ।",
  },
  severe: {
    label: "गम्भीर अवसाद",
    bgGradient: "from-[#FFF0F0] to-[#FFF5F5]",
    borderColor: "border-[#8B1A1A]",
    emoji: "☁️",
    barColor: "bg-[#8B1A1A]",
    tagBg: "bg-[#8B1A1A]",
    message: "कृपया तुरुन्त मानसिक स्वास्थ्य विशेषज्ञसँग सम्पर्क गर्नुहोस्।",
  },
};

interface SupportItem {
  emoji: string;
  title: string;
  desc: string;
  action?: string;
  actionHref?: string;
}

interface SupportLevel {
  badge: string;
  badgeBg: string;
  icon: string;
  title: string;
  subtitle: string;
  items: SupportItem[];
}

const SUPPORT_LEVELS: Record<1 | 2 | 3, SupportLevel> = {
  1: {
    badge: "स्तर १",
    badgeBg: "bg-[#3E7457]",
    icon: "🌿",
    title: "स्व-सहायता",
    subtitle: "आफ्नो घरमै गर्न सकिने उपायहरू",
    items: [
      {
        emoji: "🌬️",
        title: "श्वास व्यायाम",
        desc: "४ सेकेन्ड श्वास लिनुहोस्, ४ सेकेन्ड रोक्नुहोस्, ४ सेकेन्ड छोड्नुहोस्।",
      },
      {
        emoji: "🎶",
        title: "भजन / मन्त्र",
        desc: "आफूलाई मन पर्ने भजन सुन्नुहोस् वा प्रार्थना गर्नुहोस्।",
      },
      {
        emoji: "🚶",
        title: "हल्का हिँडाइ",
        desc: "दिनमा १५-२० मिनेट बाहिर हिँड्नुहोस्।",
      },
    ],
  },
  2: {
    badge: "स्तर २",
    badgeBg: "bg-[#1F7A7A]",
    icon: "🤝",
    title: "निर्देशित सहायता",
    subtitle: "जागरूकता र समुदायसँग जोडिनुहोस्",
    items: [
      {
        emoji: "🧠",
        title: "जागरूकता सामग्री",
        desc: "TPO Nepal र WHO का सामग्री पढेर जानकारी बढाउनुहोस्।",
        action: "TPO Nepal सम्पर्क",
        actionHref: "https://tponepal.org",
      },
      {
        emoji: "👥",
        title: "समुदायसँग कुरा",
        desc: "विश्वासिलो व्यक्ति वा समुदायसँग भावना साझा गर्नुहोस्।",
      },
      {
        emoji: "📞",
        title: "सहायता हटलाइन",
        desc: "Marph Institute हटलाइन: 9840021600",
        action: "९८४०-०२१-६०० मा फोन गर्नुहोस्",
        actionHref: "tel:9840021600",
      },
    ],
  },
  3: {
    badge: "स्तर ३",
    badgeBg: "bg-[#8B1A1A]",
    icon: "🏥",
    title: "पेशेवर सहायता",
    subtitle: "विशेषज्ञसँग सम्पर्क गर्नुहोस्",
    items: [
      {
        emoji: "🩺",
        title: "मनोचिकित्सक / परामर्शदाता",
        desc: "नजिकैको मानसिक स्वास्थ्य विशेषज्ञसँग भेट गर्नुहोस्।",
      },
      {
        emoji: "🏨",
        title: "मानसिक स्वास्थ्य केन्द्र",
        desc: "TPO Nepal मार्फत औपचारिक सेवा लिन सकिन्छ।",
        action: "TPO Nepal वेबसाइट",
        actionHref: "https://tponepal.org",
      },
      {
        emoji: "📞",
        title: "आपतकालीन हटलाइन",
        desc: "तुरुन्त सहायता चाहिन्छ भने तलको नम्बरमा फोन गर्नुहोस्।",
        action: "TPO Nepal: 1660-01-11116",
        actionHref: "tel:16600111116",
      },
    ],
  },
};

function ScoreBar({ score, barColor }: { score: number; barColor: string }) {
  const [width, setWidth] = useState(0);
  const pct = Math.round((score / 15) * 100);

  useEffect(() => {
    const t = setTimeout(() => setWidth(pct), 200);
    return () => clearTimeout(t);
  }, [pct]);

  return (
    <div className="w-full">
      <div className="flex justify-between mb-2 text-[15px] font-semibold text-[#888888]">
        <span>0</span>
        <span className="text-[#111111] text-[18px] font-bold">
          {score} / 15
        </span>
        <span>15</span>
      </div>
      <div className="w-full h-4 bg-[#E0E0E0] rounded-full overflow-hidden">
        <div
          className={`h-full ${barColor} rounded-full transition-all duration-1000 ease-out`}
          style={{ width: `${width}%` }}
        />
      </div>
    </div>
  );
}

function statusLabel(status: string) {
  if (status === "completed") return "कल सम्पन्न भयो";
  if (status === "failed") return "कल असफल भयो";
  return "कल प्रगतिमा छ";
}

function statusColor(status: string) {
  if (status === "completed") return "bg-[#E8F5F0] text-[#3E7457]";
  if (status === "failed") return "bg-[#FFF0F0] text-[#8B1A1A]";
  return "bg-[#E8F5F0] text-[#1F7A7A]";
}

export default function Results() {
  const location = useLocation();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [assessment, setAssessment] = useState<AssessmentRecord | null>(null);

  const [callStatus, setCallStatus] = useState<VapiCallStatus | null>(null);

  const assessmentIdFromQuery = new URLSearchParams(location.search).get(
    "assessmentId",
  );
  const assessmentIdFromState =
    (
      location.state as {
        assessmentData?: { assessmentInfo?: { id?: string } };
      } | null
    )?.assessmentData?.assessmentInfo?.id || null;

  const targetAssessmentId = assessmentIdFromQuery || assessmentIdFromState;

  const preloadAssessment = useMemo(() => {
    const payload = (
      location.state as {
        assessmentData?: { assessmentInfo?: AssessmentRecord };
      } | null
    )?.assessmentData;

    if (!payload?.assessmentInfo) return null;

    return {
      ...payload.assessmentInfo,
      feedback: payload.assessmentInfo.feedback || [],
    } as AssessmentRecord;
  }, [location.state]);

  useEffect(() => {
    const fetchResult = async () => {
      setLoading(true);
      setError("");

      try {
        if (targetAssessmentId) {
          const { data, status } = await api.getHistoryById(targetAssessmentId);

          if (status === 200 && data.success) {
            setAssessment(data.data);
            if (data.data.vapiCall) {
              setCallStatus({
                status: data.data.vapiCall.status,
                summary: data.data.vapiCall.summary,
                suggestions: data.data.vapiCall.suggestions,
                crisisDetected: data.data.vapiCall.crisisDetected,
                createdAt: data.data.vapiCall.createdAt,
              });
            }
            return;
          }

          if (status === 401) {
            navigate("/", { replace: true });
            return;
          }

          if (status === 404) {
            setError("यो नतिजा फेला परेन।");
            return;
          }
        }

        if (preloadAssessment) {
          setAssessment(preloadAssessment);
          return;
        }

        const { data, status } = await api.getHistory();
        if (status === 200 && data.success && data.data.length > 0) {
          navigate(`/results?assessmentId=${data.data[0].id}`, {
            replace: true,
          });
          return;
        }

        if (status === 401) {
          navigate("/", { replace: true });
          return;
        }

        setError("नतिजा उपलब्ध छैन।");
      } catch {
        setError("नतिजा लोड गर्न सकिएन। फेरि प्रयास गर्नुहोस्।");
      } finally {
        setLoading(false);
      }
    };

    fetchResult();
  }, [navigate, targetAssessmentId, preloadAssessment]);

  const currentAssessmentId = assessment?.id;

  useEffect(() => {
    if (!currentAssessmentId || !callStatus) return;
    if (callStatus.status === "completed" || callStatus.status === "failed")
      return;

    const timer = setInterval(async () => {
      const { data, status } =
        await api.getInterviewCallStatus(currentAssessmentId);
      if (status === 200 && data.success && data.data) {
        setCallStatus(data.data);
      }
    }, 8000);

    return () => clearInterval(timer);
  }, [callStatus, currentAssessmentId]);

  const startCall = async () => {
    if (!currentAssessmentId) return;
    navigate(`/call/${currentAssessmentId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F2FBF7] pb-32">
        <div className="bg-white border-b border-[#E0E0E0] px-4 py-4 text-center sticky top-0 z-10 shadow-sm">
          <h1 className="text-[24px] font-bold text-[#1F7A7A]">मनको कुरा</h1>
          <p className="text-[14px] text-[#888888]">तपाईंको परीक्षण नतिजा</p>
        </div>
        <div className="max-w-[520px] mx-auto px-4 pt-6 space-y-5">
          <div className="h-48 bg-white rounded-[20px] border border-[#E0E0E0] animate-pulse" />
          <div className="h-28 bg-white rounded-[16px] border border-[#E0E0E0] animate-pulse" />
          <div className="h-40 bg-white rounded-[16px] border border-[#E0E0E0] animate-pulse" />
        </div>
      </div>
    );
  }

  if (!assessment) {
    return (
      <div className="min-h-screen bg-[#F2FBF7] flex items-center justify-center px-4">
        <div className="max-w-[460px] w-full bg-white rounded-[16px] border border-[#E0E0E0] p-6 text-center space-y-4">
          <p className="text-[22px] font-bold text-[#111111]">
            नतिजा उपलब्ध छैन
          </p>
          <p className="text-[17px] text-[#3B3B3B]">
            {error || "फेरि प्रयास गर्नुहोस्।"}
          </p>
          <button
            onClick={() => navigate("/dashboard")}
            className="h-[54px] px-6 rounded-[14px] bg-[#1F7A7A] text-white text-[18px] font-semibold"
          >
            ड्यासबोर्डमा फर्कनुहोस्
          </button>
        </div>
      </div>
    );
  }

  const severity: Severity =
    assessment.severity === "severe"
      ? "severe"
      : assessment.severity === "moderate"
        ? "moderate"
        : "normal";

  const score = assessment.score;
  const cfg = SEVERITY_CONFIG[severity];
  const supportLevel: 1 | 2 | 3 = score <= 5 ? 1 : score <= 10 ? 2 : 3;
  const support = SUPPORT_LEVELS[supportLevel];

  const baseSuggestions = (assessment.feedback?.[0]?.suggestions || null) as {
    message?: string;
    activities?: Array<{
      emoji?: string;
      title?: string;
      description?: string;
    }>;
    resources?: Array<{
      name?: string;
      phone?: string;
      availableIn?: string;
      description?: string;
    }>;
    helplines?: Array<{
      name?: string;
      phone?: string;
    }>;
    emergency?: string;
  } | null;

  return (
    <div className={`min-h-screen bg-gradient-to-b ${cfg.bgGradient} pb-32`}>
      <div className="bg-white border-b border-[#E0E0E0] px-4 py-4 text-center sticky top-0 z-10 shadow-sm">
        <h1 className="text-[24px] font-bold text-[#1F7A7A]">मनको कुरा</h1>
        <p className="text-[14px] text-[#888888]">तपाईंको परीक्षण नतिजा</p>
      </div>

      <div className="max-w-[520px] mx-auto px-4 pt-4">
        <button
          type="button"
          onClick={() => navigate("/dashboard")}
          className="h-[48px] px-4 rounded-[12px] border-2 border-[#1F7A7A] bg-white text-[#1F7A7A] text-[16px] font-semibold"
        >
          ← ड्यासबोर्डमा फर्कनुहोस्
        </button>
      </div>

      <div className="max-w-[520px] mx-auto px-4 pt-6 space-y-5">
        <div
          className={`bg-white rounded-[20px] border-2 ${cfg.borderColor} shadow-lg p-6`}
        >
          <div className="text-center mb-5">
            <div className="text-[56px] mb-2">{cfg.emoji}</div>
            <div
              className={`inline-flex items-center gap-2 px-4 py-1 rounded-full ${cfg.tagBg} mb-3`}
            >
              <span className="text-white font-bold text-[16px]">
                {cfg.label}
              </span>
            </div>
            <p className="text-[18px] text-[#3B3B3B] leading-relaxed">
              {cfg.message}
            </p>
          </div>
          <ScoreBar score={score} barColor={cfg.barColor} />
        </div>

        <div
          className={`rounded-[16px] ${support.badgeBg} p-5 text-white shadow-md`}
        >
          <div className="flex items-center gap-3 mb-1">
            <span className="text-[32px]">{support.icon}</span>
            <div>
              <span className="text-[13px] font-semibold opacity-80 uppercase tracking-wider">
                {support.badge} — सिफारिस
              </span>
              <h2 className="text-[22px] font-bold leading-tight">
                {support.title}
              </h2>
            </div>
          </div>
          <p className="text-[15px] opacity-90 mt-1">{support.subtitle}</p>
        </div>

        <div className="bg-white rounded-[16px] border border-[#E0E0E0] shadow-sm overflow-hidden">
          {support.items.map((item, i) => (
            <div
              key={`${item.title}-${i}`}
              className={`p-5 ${i < support.items.length - 1 ? "border-b border-[#F0F0F0]" : ""}`}
            >
              <div className="flex items-start gap-3">
                <span className="text-[30px] flex-shrink-0 mt-0.5">
                  {item.emoji}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-[17px] font-bold text-[#111111] leading-snug mb-1">
                    {item.title}
                  </p>
                  <p className="text-[15px] text-[#3B3B3B] leading-relaxed">
                    {item.desc}
                  </p>
                  {item.action && item.actionHref && (
                    <a
                      href={item.actionHref}
                      className="inline-flex items-center gap-1 mt-3 px-4 py-2 rounded-[10px] bg-[#1F7A7A] text-white text-[14px] font-semibold"
                    >
                      {item.action} →
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {baseSuggestions?.message && (
          <div className="bg-white rounded-[16px] border border-[#E0E0E0] shadow-sm p-5 space-y-3">
            <p className="text-[18px] font-semibold text-[#1F7A7A]">
              🩺 डाक्टर सुझाव
            </p>
            <p className="text-[16px] text-[#3B3B3B] leading-relaxed">
              {baseSuggestions.message}
            </p>
            {baseSuggestions.activities &&
              baseSuggestions.activities.length > 0 && (
                <div className="space-y-2">
                  {baseSuggestions.activities
                    .slice(0, 3)
                    .map((activity, idx) => (
                      <div
                        key={`activity-${idx}`}
                        className="bg-[#F8FAF9] rounded-[10px] p-3"
                      >
                        <p className="text-[16px] font-semibold text-[#111111]">
                          🩺 {activity.title || "सुझाव"}
                        </p>
                        <p className="text-[14px] text-[#3B3B3B]">
                          {activity.description || ""}
                        </p>
                      </div>
                    ))}
                </div>
              )}

            {baseSuggestions.resources &&
              baseSuggestions.resources.length > 0 && (
                <div className="space-y-2">
                  <p className="text-[16px] font-semibold text-[#1F7A7A]">
                    सेवा केन्द्र
                  </p>
                  {baseSuggestions.resources
                    .slice(0, 3)
                    .map((resource, idx) => (
                      <div
                        key={`resource-${idx}`}
                        className="bg-[#F8FAF9] rounded-[10px] p-3 space-y-1"
                      >
                        <p className="text-[15px] font-semibold text-[#111111]">
                          {resource.name || "सेवा"}
                        </p>
                        {resource.description && (
                          <p className="text-[14px] text-[#3B3B3B]">
                            {resource.description}
                          </p>
                        )}
                        {resource.availableIn && (
                          <p className="text-[14px] text-[#3B3B3B]">
                            स्थान: {resource.availableIn}
                          </p>
                        )}
                        {resource.phone && (
                          <a
                            href={`tel:${resource.phone}`}
                            className="text-[14px] font-semibold text-[#1F7A7A] underline underline-offset-2"
                          >
                            सम्पर्क: {resource.phone}
                          </a>
                        )}
                      </div>
                    ))}
                </div>
              )}

            {baseSuggestions.helplines &&
              baseSuggestions.helplines.length > 0 && (
                <div className="space-y-2">
                  <p className="text-[16px] font-semibold text-[#1F7A7A]">
                    सहायता नम्बर
                  </p>
                  {baseSuggestions.helplines.map((line, idx) => (
                    <a
                      key={`helpline-${idx}`}
                      href={line.phone ? `tel:${line.phone}` : undefined}
                      className="block bg-[#F8FAF9] rounded-[10px] p-3"
                    >
                      <p className="text-[15px] font-semibold text-[#111111]">
                        {line.name || "हेल्पलाइन"}
                      </p>
                      {line.phone && (
                        <p className="text-[14px] font-semibold text-[#1F7A7A]">
                          {line.phone}
                        </p>
                      )}
                    </a>
                  ))}
                </div>
              )}

            {baseSuggestions.emergency && (
              <div className="bg-[#FFF8F0] border border-[#AB5338] rounded-[10px] p-3">
                <p className="text-[14px] font-bold text-[#AB5338]">आपतकालीन</p>
                <p className="text-[14px] text-[#AB5338]">
                  {baseSuggestions.emergency}
                </p>
              </div>
            )}
          </div>
        )}

        <div className="bg-white rounded-[16px] border border-[#E0E0E0] shadow-sm p-5 space-y-4">
          <p className="text-[18px] font-semibold text-[#1F7A7A]">
            💬 साथीसँग फोनमा कुरा
          </p>

          {callStatus && (
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`px-3 py-1 rounded-full text-[14px] font-semibold ${statusColor(callStatus.status)}`}
              >
                {statusLabel(callStatus.status)}
              </span>
              {callStatus.crisisDetected && (
                <span className="px-3 py-1 rounded-full text-[14px] font-semibold bg-[#FFF0F0] text-[#8B1A1A]">
                  संकट संकेत भेटियो
                </span>
              )}
            </div>
          )}

          {callStatus?.summary && (
            <div className="bg-[#F8FAF9] rounded-[10px] p-3">
              <p className="text-[15px] font-semibold text-[#111111] mb-1">
                कल सारांश
              </p>
              <p className="text-[14px] text-[#3B3B3B] leading-relaxed">
                {callStatus.summary}
              </p>
            </div>
          )}

          <button
            type="button"
            onClick={startCall}
            className="w-full h-[54px] rounded-[14px] border-2 border-[#1F7A7A] bg-white text-[#1F7A7A] text-[18px] font-semibold"
          >
            साथीसँग कुरा सुरु गर्नुहोस्
          </button>
        </div>

        <div className="bg-[#FFF8F0] border-2 border-[#AB5338] rounded-[16px] p-4 flex items-center gap-3">
          <span className="text-[28px]">⚠️</span>
          <div>
            <p className="text-[15px] font-bold text-[#AB5338]">
              आपतकालीन सहायता
            </p>
            <a
              href="tel:16600111116"
              className="text-[16px] font-semibold text-[#AB5338] underline underline-offset-2"
            >
              TPO Nepal: 1660-01-11116
            </a>
          </div>
        </div>

        <div className="space-y-3 pt-2">
          {assessment.id && (
            <button
              id="go-call-page-btn"
              type="button"
              onClick={() => navigate(`/call/${assessment.id}`)}
              className="w-full h-[54px] rounded-[14px] border-2 border-[#1F7A7A] bg-white text-[#1F7A7A] text-[18px] font-semibold"
            >
              कुरा गर्ने पृष्ठ खोल्नुहोस्
            </button>
          )}
          <button
            id="retake-quiz-btn"
            type="button"
            onClick={() => navigate("/quiz")}
            className="w-full h-[60px] rounded-[14px] bg-[#1F7A7A] text-white text-[20px] font-semibold shadow-md"
          >
            फेरि परीक्षण गर्नुहोस्
          </button>
        </div>
      </div>

      <Disclaimer />
    </div>
  );
}
