import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { Disclaimer } from "~/components/layout/Disclaimer";
import { api, type AssessmentRecord, type VapiCallStatus } from "~/lib/api";
import { assertVapiPublicKey, getVapi } from "~/lib/vapi.sdk";

export function meta() {
  return [
    { title: "मनको कुरा — साथी वार्ता" },
    { name: "description", content: "साथीसँग फोन वार्ता पृष्ठ" },
  ];
}

function statusLabel(status: string) {
  if (status === "completed") return "कल सम्पन्न भयो";
  if (status === "failed") return "कल असफल भयो";
  if (status === "initiated") return "कल सुरु भएको छ";
  return "कल प्रगतिमा छ";
}

function statusColor(status: string) {
  if (status === "completed") return "bg-[#E8F5F0] text-[#3E7457]";
  if (status === "failed") return "bg-[#FFF0F0] text-[#8B1A1A]";
  return "bg-[#E8F5F0] text-[#1F7A7A]";
}

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

function toNepaliDigits(value: string | number) {
  return String(value).replace(/[0-9]/g, (digit) => EN_TO_NE[digit] || digit);
}

export default function CallPage() {
  const { assessmentId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [starting, setStarting] = useState(false);
  const [ending, setEnding] = useState(false);
  const [error, setError] = useState("");
  const [callId, setCallId] = useState<string | null>(null);
  const [aiSpeaking, setAiSpeaking] = useState(false);
  const [userSpeaking, setUserSpeaking] = useState(false);

  const [assessment, setAssessment] = useState<AssessmentRecord | null>(null);
  const [callStatus, setCallStatus] = useState<VapiCallStatus | null>(null);

  const transcriptRef = useRef<string[]>([]);
  const callIdRef = useRef<string | null>(null);
  const userSpeakingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );

  useEffect(() => {
    callIdRef.current = callId;
  }, [callId]);

  useEffect(() => {
    const loadData = async () => {
      if (!assessmentId) {
        navigate("/dashboard", { replace: true });
        return;
      }

      setLoading(true);
      setError("");

      try {
        const detail = await api.getHistoryById(assessmentId);

        if (detail.status === 401) {
          navigate("/", { replace: true });
          return;
        }

        if (detail.status !== 200 || !detail.data.success) {
          setError("परीक्षण विवरण फेला परेन।");
          return;
        }

        setAssessment(detail.data.data);

        if (detail.data.data.vapiCall) {
          setCallStatus({
            status: detail.data.data.vapiCall.status,
            summary: detail.data.data.vapiCall.summary,
            suggestions: detail.data.data.vapiCall.suggestions,
            crisisDetected: detail.data.data.vapiCall.crisisDetected,
            createdAt: detail.data.data.vapiCall.createdAt,
          });

          const statusRes = await api.getInterviewCallStatus(assessmentId);
          if (
            statusRes.status === 200 &&
            statusRes.data.success &&
            statusRes.data.data
          ) {
            setCallStatus(statusRes.data.data);
          }
        } else {
          const statusRes = await api.getInterviewCallStatus(assessmentId);
          if (
            statusRes.status === 200 &&
            statusRes.data.success &&
            statusRes.data.data
          ) {
            setCallStatus(statusRes.data.data);
          }
        }
      } catch {
        setError("डाटा लोड गर्न सकिएन।");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [assessmentId, navigate]);

  useEffect(() => {
    if (!assessmentId) return;

    const vapi = getVapi();
    if (!vapi) return;

    const onCallStart = () => {
      setCallStatus({
        status: "initiated",
        summary: null,
        suggestions: null,
        crisisDetected: false,
        createdAt: new Date().toISOString(),
      });
    };

    const onMessage = (message: any) => {
      const text =
        message?.transcript || message?.text || message?.content || "";
      const isFinalTranscript =
        message?.type === "transcript-final" ||
        message?.final === true ||
        message?.transcriptType === "final";

      if (text && isFinalTranscript) {
        transcriptRef.current.push(text);
      }

      if (message?.type === "end-of-call-report") {
        const summary = message?.artifact?.summary || null;
        if (summary) {
          setCallStatus((prev) =>
            prev
              ? { ...prev, summary }
              : {
                  status: "completed",
                  summary,
                  suggestions: null,
                  crisisDetected: false,
                  createdAt: new Date().toISOString(),
                },
          );
        }
      }
    };

    const onCallEnd = async () => {
      setEnding(false);
      setAiSpeaking(false);
      setUserSpeaking(false);
      const transcript = transcriptRef.current.join("\n").trim();

      if (callIdRef.current || transcript) {
        await api.completeInterviewCall(assessmentId, {
          vapiCallId: callIdRef.current || undefined,
          transcript,
          messages: [],
        });
      }

      const statusRes = await api.getInterviewCallStatus(assessmentId);
      if (
        statusRes.status === 200 &&
        statusRes.data.success &&
        statusRes.data.data
      ) {
        setCallStatus(statusRes.data.data);
        if (statusRes.data.data.status === "completed") {
          navigate(`/results?assessmentId=${assessmentId}`);
        }
      }
    };

    const onError = (event: any) => {
      setEnding(false);
      const message =
        event?.message || event?.error?.message || "साथी सेवा जडान गर्न सकिएन।";
      setError(message);
    };

    const onSpeechStart = () => {
      setAiSpeaking(true);
    };

    const onSpeechEnd = () => {
      setAiSpeaking(false);
    };

    const onVolumeLevel = (volume: number) => {
      if (volume > 0.08) {
        setUserSpeaking(true);
        if (userSpeakingTimerRef.current) {
          clearTimeout(userSpeakingTimerRef.current);
        }
        userSpeakingTimerRef.current = setTimeout(() => {
          setUserSpeaking(false);
        }, 350);
      }
    };

    vapi.on("call-start", onCallStart);
    vapi.on("message", onMessage);
    vapi.on("call-end", onCallEnd);
    vapi.on("error", onError);
    vapi.on("speech-start", onSpeechStart);
    vapi.on("speech-end", onSpeechEnd);
    vapi.on("volume-level", onVolumeLevel);

    return () => {
      vapi.off("call-start", onCallStart);
      vapi.off("message", onMessage);
      vapi.off("call-end", onCallEnd);
      vapi.off("error", onError);
      vapi.off("speech-start", onSpeechStart);
      vapi.off("speech-end", onSpeechEnd);
      vapi.off("volume-level", onVolumeLevel);

      if (userSpeakingTimerRef.current) {
        clearTimeout(userSpeakingTimerRef.current);
        userSpeakingTimerRef.current = null;
      }
    };
  }, [assessmentId, navigate]);

  useEffect(() => {
    if (!assessmentId || !callStatus) return;
    if (callStatus.status === "completed" || callStatus.status === "failed")
      return;

    const timer = setInterval(async () => {
      const statusRes = await api.getInterviewCallStatus(assessmentId);
      if (
        statusRes.status === 200 &&
        statusRes.data.success &&
        statusRes.data.data
      ) {
        setCallStatus(statusRes.data.data);
      }
    }, 8000);

    return () => clearInterval(timer);
  }, [assessmentId, callStatus]);

  const startCall = async () => {
    if (!assessmentId) return;

    setStarting(true);
    setError("");

    try {
      assertVapiPublicKey();
      const vapi = getVapi();
      if (!vapi) {
        setError("यो सुविधा ब्राउजरमा मात्र उपलब्ध छ।");
        return;
      }

      const cfg = await api.getInterviewStartConfig(assessmentId);
      if (cfg.status === 401) {
        navigate("/", { replace: true });
        return;
      }

      if (cfg.status === 404) {
        setError("यो परीक्षण फेला परेन।");
        return;
      }

      if (cfg.status === 503) {
        setError("साथी सेवा अहिले तयार छैन।");
        return;
      }

      if (cfg.status !== 200 || !cfg.data.success) {
        setError(cfg.data.message || "वार्ता सुरु गर्न सकिएन।");
        return;
      }

      const { assistantId, assistantOverrides } = cfg.data.data;
      const startedCall: any = await vapi.start(
        assistantId,
        assistantOverrides as any,
      );

      const immediateCallId =
        startedCall?.id || startedCall?.callId || startedCall?.call?.id || null;
      if (immediateCallId) {
        setCallId(immediateCallId);
        callIdRef.current = immediateCallId;
        await api.linkInterviewCall(assessmentId, immediateCallId);
      }

      setCallStatus({
        status: "initiated",
        summary: null,
        suggestions: null,
        crisisDetected: false,
        createdAt: new Date().toISOString(),
      });
    } catch (err: any) {
      setError(err?.message || "साथी सेवा जडान गर्न सकिएन।");
    } finally {
      setStarting(false);
    }
  };

  const endCall = () => {
    const vapi = getVapi();
    if (!vapi) {
      setError("यो सुविधा ब्राउजरमा मात्र उपलब्ध छ।");
      return;
    }

    try {
      setEnding(true);
      vapi.end();
    } catch (err: any) {
      setEnding(false);
      setError(err?.message || "कल बन्द गर्न सकिएन।");
    }
  };

  const isInCall = callStatus?.status === "initiated";

  const renderVoiceBars = (active: boolean, barColor: string) => (
    <div className="flex items-end gap-1 h-8" aria-hidden="true">
      {[0, 1, 2, 3].map((idx) => (
        <span
          key={idx}
          className={`w-1.5 rounded-full ${barColor} transition-all duration-200 ${
            active
              ? idx % 2 === 0
                ? "h-7"
                : "h-4"
              : idx % 2 === 0
                ? "h-2"
                : "h-3"
          }`}
        />
      ))}
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F2FBF7] pb-24">
        <div className="bg-white border-b border-[#E0E0E0] px-4 py-4 text-center sticky top-0 z-10 shadow-sm">
          <h1 className="text-[24px] font-bold text-[#1F7A7A]">मनको कुरा</h1>
          <p className="text-[14px] text-[#888888]">साथी वार्ता</p>
        </div>
        <div className="max-w-[520px] mx-auto px-4 pt-6 space-y-5">
          <div className="h-40 bg-white border border-[#E0E0E0] rounded-[16px] animate-pulse" />
          <div className="h-32 bg-white border border-[#E0E0E0] rounded-[16px] animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F2FBF7] pb-24">
      <div className="bg-white border-b border-[#E0E0E0] px-4 py-4 text-center sticky top-0 z-10 shadow-sm">
        <h1 className="text-[24px] font-bold text-[#1F7A7A]">मनको कुरा</h1>
        <p className="text-[14px] text-[#888888]">साथी वार्ता</p>
      </div>

      <div className="max-w-[520px] mx-auto px-4 pt-6 space-y-5">
        <div className="bg-white rounded-[16px] border border-[#E0E0E0] shadow-sm p-5">
          <p className="text-[18px] font-semibold text-[#1F7A7A] mb-2">
            📋 परीक्षण जानकारी
          </p>
          {assessment ? (
            <div className="space-y-2 text-[16px] text-[#3B3B3B]">
              <p>
                स्कोर: {toNepaliDigits(assessment.score)} / {toNepaliDigits(15)}
              </p>
              <p>
                अवस्था:{" "}
                {assessment.severity === "severe"
                  ? "गम्भीर अवसाद"
                  : assessment.severity === "moderate"
                    ? "मध्यम अवसाद"
                    : "सामान्य"}
              </p>
            </div>
          ) : (
            <p className="text-[16px] text-[#888888]">
              परीक्षण जानकारी उपलब्ध छैन।
            </p>
          )}
        </div>

        <div className="bg-white rounded-[16px] border border-[#E0E0E0] shadow-sm p-5 space-y-4">
          <p className="text-[20px] font-semibold text-[#1F7A7A]">💬 साथी कल</p>

          {isInCall && (
            <div className="bg-[#F8FAF9] rounded-[12px] p-4 border border-[#E4EEEA]">
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-[10px] bg-white border border-[#E0E0E0] p-3 text-center space-y-2">
                  <div
                    className={`w-14 h-14 mx-auto rounded-full flex items-center justify-center text-[26px] ${
                      aiSpeaking
                        ? "bg-[#DFF4EA] ring-4 ring-[#CDEBDD]"
                        : "bg-[#EDF3F1]"
                    }`}
                  >
                    🤖
                  </div>
                  <p className="text-[14px] font-semibold text-[#1F7A7A]">
                    नम्रता साथी
                  </p>
                  {renderVoiceBars(aiSpeaking, "bg-[#2B9B6F]")}
                </div>

                <div className="rounded-[10px] bg-white border border-[#E0E0E0] p-3 text-center space-y-2">
                  <div
                    className={`w-14 h-14 mx-auto rounded-full flex items-center justify-center text-[26px] ${
                      userSpeaking
                        ? "bg-[#FFF3DE] ring-4 ring-[#FFE8C4]"
                        : "bg-[#F6F3EE]"
                    }`}
                  >
                    🙂
                  </div>
                  <p className="text-[14px] font-semibold text-[#7A5A1F]">
                    तपाईं
                  </p>
                  {renderVoiceBars(userSpeaking, "bg-[#D4931E]")}
                </div>
              </div>
            </div>
          )}

          {callStatus && (
            <div className="space-y-2">
              <span
                className={`inline-flex px-3 py-1 rounded-full text-[14px] font-semibold ${statusColor(callStatus.status)}`}
              >
                {statusLabel(callStatus.status)}
              </span>
              {callStatus.crisisDetected && (
                <p className="text-[14px] font-semibold text-[#8B1A1A]">
                  संकट संकेत भेटिएको छ।
                </p>
              )}
              {callStatus.summary && (
                <div className="bg-[#F8FAF9] rounded-[10px] p-3">
                  <p className="text-[14px] text-[#111111] font-semibold mb-1">
                    सारांश
                  </p>
                  <p className="text-[14px] text-[#3B3B3B] leading-relaxed">
                    {callStatus.summary}
                  </p>
                </div>
              )}
            </div>
          )}

          {callStatus?.status === "initiated" && (
            <div className="bg-[#F8FAF9] rounded-[10px] p-3">
              <p className="text-[14px] text-[#3B3B3B] leading-relaxed">
                साथीसँग वार्ता चलिरहेको छ। यो पृष्ठमा लाइभ प्रतिलिपि देखाइँदैन।
              </p>
            </div>
          )}

          {callStatus?.status === "completed" && (
            <button
              type="button"
              onClick={() => navigate(`/results?assessmentId=${assessmentId}`)}
              className="w-full h-[54px] rounded-[12px] bg-[#1F7A7A] text-white text-[18px] font-semibold"
            >
              नतिजा हेर्नुहोस्
            </button>
          )}

          {error && (
            <p className="text-[15px] text-[#AB5338] font-medium">{error}</p>
          )}

          {!isInCall ? (
            <button
              type="button"
              onClick={startCall}
              disabled={starting}
              className="w-full h-[64px] rounded-[14px] border-2 border-[#1F7A7A] bg-white text-[#1F7A7A] text-[22px] font-bold disabled:opacity-60"
            >
              {starting ? "कुरा सुरु हुँदैछ..." : "साथीसँग कुरा सुरु गर्नुहोस्"}
            </button>
          ) : (
            <button
              type="button"
              onClick={endCall}
              disabled={ending}
              className="w-full h-[64px] rounded-[14px] border-2 border-[#B33A3A] bg-[#FFF4F4] text-[#B33A3A] text-[22px] font-bold disabled:opacity-60"
            >
              {ending ? "कल बन्द हुँदैछ..." : "कल बन्द गर्नुहोस्"}
            </button>
          )}
        </div>

        <button
          type="button"
          onClick={() => navigate("/dashboard")}
          className="w-full h-[54px] rounded-[14px] border-2 border-[#1F7A7A] bg-white text-[#1F7A7A] text-[18px] font-semibold"
        >
          ← ड्यासबोर्डमा फर्कनुहोस्
        </button>
      </div>

      <Disclaimer />
    </div>
  );
}
