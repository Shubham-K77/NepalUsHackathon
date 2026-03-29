import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { Disclaimer } from "~/components/layout/Disclaimer";
import {
  api,
  type AssessmentRecord,
  type UserProfile,
  type VapiCallStatus,
} from "~/lib/api";

export function meta() {
  return [
    { title: "मनको कुरा — मेरो पृष्ठ" },
    { name: "description", content: "मेरो मानसिक स्वास्थ्य पृष्ठ" },
  ];
}

const SEVERITY_LABEL: Record<string, { label: string; color: string }> = {
  normal: {
    label: "सामान्य",
    color: "text-[#3E7457] bg-[#E8F5F0]",
  },
  moderate: {
    label: "मध्यम अवसाद",
    color: "text-[#AB5338] bg-[#FFF3EE]",
  },
  severe: {
    label: "गम्भीर अवसाद",
    color: "text-[#8B1A1A] bg-[#FFF0F0]",
  },
};

const EN_TO_NE: Record<string, string> = {
  "0": "०",
  "1": "१",
  "2": "२",
  "3": "३",
  "4": "४",
  "5": "५",
  "6": "६",
  "7": "७",
  "8": "८",
  "9": "९",
};

const MONTHS_NE = [
  "जनवरी",
  "फेब्रुअरी",
  "मार्च",
  "अप्रिल",
  "मे",
  "जुन",
  "जुलाई",
  "अगस्ट",
  "सेप्टेम्बर",
  "अक्टोबर",
  "नोभेम्बर",
  "डिसेम्बर",
];

function toNepaliDigits(value: string | number) {
  return String(value).replace(/[0-9]/g, (digit) => EN_TO_NE[digit] || digit);
}

function getAge(dob: string): number {
  return new Date().getFullYear() - new Date(dob).getFullYear();
}

function formatNepaliDate(iso: string): string {
  const d = new Date(iso);
  const day = toNepaliDigits(d.getDate());
  const month = MONTHS_NE[d.getMonth()] || "";
  const year = toNepaliDigits(d.getFullYear());
  return `${month} ${day}, ${year}`;
}

function getSuggestionMessage(historyItem: AssessmentRecord) {
  const suggestions = historyItem.feedback?.[0]?.suggestions as
    | { message?: string }
    | undefined;
  return suggestions?.message || "सामान्य निगरानी जारी राख्नुहोस्।";
}

export default function Dashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState<UserProfile | null>(null);
  const [history, setHistory] = useState<AssessmentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(false);
  const [error, setError] = useState("");

  const [callStatusById, setCallStatusById] = useState<
    Record<string, VapiCallStatus>
  >({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userRes, historyRes] = await Promise.all([
          api.getCurrentUser(),
          api.getHistory(),
        ]);

        if (userRes.status === 401 || historyRes.status === 401) {
          navigate("/", { replace: true });
          return;
        }

        if (userRes.status === 200 && userRes.data.success) {
          setUser(userRes.data.data);
        } else {
          navigate("/", { replace: true });
          return;
        }

        if (historyRes.status === 200 && historyRes.data.success) {
          setHistory(historyRes.data.data);

          const existingStatuses: Record<string, VapiCallStatus> = {};
          historyRes.data.data.forEach((item) => {
            if (item.vapiCall) {
              existingStatuses[item.id] = {
                status: item.vapiCall.status,
                summary: item.vapiCall.summary,
                suggestions: item.vapiCall.suggestions,
                crisisDetected: item.vapiCall.crisisDetected,
                createdAt: item.vapiCall.createdAt,
              };
            }
          });
          setCallStatusById(existingStatuses);
        }

        setTimeout(() => setVisible(true), 50);
      } catch {
        setError("डाटा लोड गर्न सकिएन।");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  useEffect(() => {
    const pollingIds = Object.entries(callStatusById)
      .filter(
        ([, val]) => val.status !== "completed" && val.status !== "failed",
      )
      .map(([id]) => id);

    if (pollingIds.length === 0) return;

    const timer = setInterval(async () => {
      for (const assessmentId of pollingIds) {
        const res = await api.getInterviewCallStatus(assessmentId);
        const statusData = res.data.data;
        if (res.status === 200 && res.data.success && statusData) {
          setCallStatusById((prev) => ({
            ...prev,
            [assessmentId]: statusData,
          }));
        }
      }
    }, 8000);

    return () => clearInterval(timer);
  }, [callStatusById]);

  const latestAssessment = useMemo(() => history[0], [history]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F2FBF7] pb-28">
        <div className="bg-white border-b border-[#E0E0E0] px-4 py-4 text-center sticky top-0 z-10 shadow-sm">
          <h1 className="text-[24px] font-bold text-[#1F7A7A]">मनको कुरा</h1>
          <p className="text-[18px] text-[#888888]">मेरो पृष्ठ</p>
        </div>
        <div className="max-w-[520px] mx-auto px-4 pt-6 space-y-5">
          <div className="h-32 bg-white border border-[#E0E0E0] rounded-[20px] animate-pulse" />
          <div className="h-56 bg-white border border-[#E0E0E0] rounded-[16px] animate-pulse" />
          <div className="h-56 bg-white border border-[#E0E0E0] rounded-[16px] animate-pulse" />
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const age = getAge(user.dob);
  const memberSince = formatNepaliDate(user.createdAt);

  return (
    <div
      className={`min-h-screen bg-[#F2FBF7] pb-28 transition-opacity duration-500 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="bg-white border-b border-[#E0E0E0] px-4 py-4 text-center sticky top-0 z-10 shadow-sm">
        <h1 className="text-[24px] font-bold text-[#1F7A7A]">मनको कुरा</h1>
        <p className="text-[18px] text-[#888888]">मेरो पृष्ठ</p>
      </div>

      <div className="max-w-[520px] mx-auto px-4 pt-6 space-y-5">
        <div className="bg-white rounded-[20px] border border-[#E0E0E0] shadow-md p-6">
          <div className="flex items-center gap-4">
            <div className="w-[72px] h-[72px] rounded-full bg-[#E8F5F0] border-2 border-[#1F7A7A] flex items-center justify-center flex-shrink-0">
              <span className="text-[32px]">
                {user.gender === "MALE"
                  ? "👴"
                  : user.gender === "FEMALE"
                    ? "👵"
                    : "🧑"}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[26px] font-bold text-[#111111] truncate">
                {user.name} हजुर
              </p>
              <p className="text-[20px] text-[#3B3B3B]">
                {toNepaliDigits(age)} वर्ष
              </p>
              <p className="text-[18px] text-[#888888]">
                {user.genderNe || user.gender}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-[16px] border border-[#E0E0E0] shadow-sm p-5">
          <p className="text-[22px] font-semibold text-[#1F7A7A] mb-4">
            मेरो जानकारी
          </p>
          <div className="space-y-3">
            <InfoRow label="जिल्ला" value={user.districtNe || user.district} />
            <InfoRow label="प्रदेश" value={user.provinceNe || user.province} />
            <InfoRow label="जन्म मिति" value={formatNepaliDate(user.dob)} />
            <InfoRow label="सदस्य भएको" value={memberSince} />
          </div>
        </div>

        <div className="bg-white rounded-[16px] border border-[#E0E0E0] shadow-sm p-5">
          <p className="text-[22px] font-semibold text-[#1F7A7A] mb-4">
            द्रुत कार्य
          </p>
          <div className="space-y-3">
            <ActionButton
              id="start-quiz-btn"
              label="नयाँ परीक्षण गर्नुहोस्"
              subtitle="१५ प्रश्नको परीक्षण"
              onClick={() => navigate("/quiz")}
              primary
            />
            <ActionButton
              id="latest-result-btn"
              label="अन्तिम नतिजा हेर्नुहोस्"
              subtitle={
                latestAssessment
                  ? formatNepaliDate(latestAssessment.createdAt)
                  : "अहिलेसम्म कुनै नतिजा छैन"
              }
              onClick={() =>
                latestAssessment &&
                navigate(`/results?assessmentId=${latestAssessment.id}`)
              }
              disabled={!latestAssessment}
            />
          </div>
        </div>

        <div className="bg-white rounded-[16px] border border-[#E0E0E0] shadow-sm p-5">
          <p className="text-[22px] font-semibold text-[#1F7A7A] mb-4">
            मेरो परीक्षण इतिहास
          </p>

          {error && <p className="text-[18px] text-[#AB5338] mb-3">{error}</p>}

          {history.length === 0 ? (
            <p className="text-[19px] text-[#888888]">
              अहिलेसम्म कुनै परीक्षण गरिएको छैन।
            </p>
          ) : (
            <div className="space-y-3">
              {history.map((item) => {
                const sev =
                  SEVERITY_LABEL[item.severity] || SEVERITY_LABEL.normal;
                const callStatus = callStatusById[item.id];

                return (
                  <div
                    key={item.id}
                    className="rounded-[14px] border border-[#E8E8E8] p-4 bg-[#FCFEFD] space-y-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-[19px] font-bold text-[#111111]">
                          अवस्था: {sev.label}
                        </p>
                        <p className="text-[17px] text-[#888888]">
                          {formatNepaliDate(item.createdAt)}
                        </p>
                      </div>
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-[15px] font-semibold ${sev.color}`}
                      >
                        {sev.label}
                      </span>
                    </div>

                    <p className="text-[17px] text-[#3B3B3B] leading-relaxed">
                      {getSuggestionMessage(item)}
                    </p>

                    {callStatus && (
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`px-3 py-1 rounded-full text-[15px] font-semibold ${
                            callStatus.status === "completed"
                              ? "bg-[#E8F5F0] text-[#3E7457]"
                              : callStatus.status === "failed"
                                ? "bg-[#FFF0F0] text-[#8B1A1A]"
                                : "bg-[#E8F5F0] text-[#1F7A7A]"
                          }`}
                        >
                          {callStatus.status === "completed"
                            ? "कल सम्पन्न"
                            : callStatus.status === "failed"
                              ? "कल असफल"
                              : "कल प्रगतिमा"}
                        </span>
                        {callStatus.crisisDetected && (
                          <span className="px-3 py-1 rounded-full text-[15px] font-semibold bg-[#FFF0F0] text-[#8B1A1A]">
                            संकट संकेत
                          </span>
                        )}
                      </div>
                    )}

                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          navigate(`/results?assessmentId=${item.id}`)
                        }
                        className="h-[52px] px-5 rounded-[10px] bg-[#1F7A7A] text-white text-[18px] font-semibold"
                      >
                        विवरण हेर्नुहोस्
                      </button>
                      <button
                        type="button"
                        onClick={() => navigate(`/call/${item.id}`)}
                        className="h-[52px] px-5 rounded-[10px] border-2 border-[#1F7A7A] bg-white text-[#1F7A7A] text-[18px] font-semibold"
                      >
                        साथीसँग कुरा गर्नुहोस्
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="bg-[#FFF8F0] border-2 border-[#AB5338] rounded-[16px] p-5">
          <p className="text-[22px] font-semibold text-[#AB5338] mb-3">
            संकट सहायता
          </p>
          <div className="space-y-2">
            <CrisisLine name="टिपिओ नेपाल" phone="1660-01-11116" />
            <CrisisLine name="उमंग सहायता" phone="9840021600" />
          </div>
        </div>
      </div>

      <Disclaimer />
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-2 py-3 border-b border-[#F0F0F0] last:border-0">
      <span className="text-[19px] text-[#666666]">{label}</span>
      <span className="text-[20px] font-semibold text-[#111111] text-right">
        {value}
      </span>
    </div>
  );
}

function ActionButton({
  id,
  label,
  subtitle,
  onClick,
  primary,
  disabled,
}: {
  id: string;
  label: string;
  subtitle: string;
  onClick: () => void;
  primary?: boolean;
  disabled?: boolean;
}) {
  return (
    <button
      id={id}
      onClick={onClick}
      disabled={disabled}
      className={`w-full p-5 rounded-[14px] text-left transition-all active:scale-[0.98] disabled:opacity-50 ${
        primary
          ? "bg-[#1F7A7A] text-white hover:brightness-95"
          : "bg-[#F2FBF7] border-2 border-[#E0E0E0] text-[#111111] hover:border-[#1F7A7A]"
      }`}
    >
      <div>
        <p
          className={`text-[22px] font-semibold ${primary ? "text-white" : "text-[#111111]"}`}
        >
          {label}
        </p>
        <p
          className={`text-[17px] ${primary ? "text-[#B2D8D8]" : "text-[#888888]"}`}
        >
          {subtitle}
        </p>
      </div>
    </button>
  );
}

function CrisisLine({ name, phone }: { name: string; phone: string }) {
  return (
    <a
      href={`tel:${phone}`}
      className="flex items-center justify-between p-4 bg-white rounded-[10px] border border-[#E8DED4] hover:bg-[#FFF3EE] transition-colors"
    >
      <span className="text-[19px] font-semibold text-[#111111]">{name}</span>
      <span className="text-[19px] font-bold text-[#AB5338]">
        {toNepaliDigits(phone)}
      </span>
    </a>
  );
}
