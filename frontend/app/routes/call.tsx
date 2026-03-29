import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { Disclaimer } from "~/components/layout/Disclaimer";
import { api, type AssessmentRecord, type VapiCallStatus } from "~/lib/api";
import { assertVapiPublicKey, vapi } from "~/lib/vapi.sdk";

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

export default function CallPage() {
  const { assessmentId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [starting, setStarting] = useState(false);
  const [error, setError] = useState("");
  const [callId, setCallId] = useState<string | null>(null);
  const [liveTranscript, setLiveTranscript] = useState("");

  const [assessment, setAssessment] = useState<AssessmentRecord | null>(null);
  const [callStatus, setCallStatus] = useState<VapiCallStatus | null>(null);

  const transcriptRef = useRef<string[]>([]);
  const callIdRef = useRef<string | null>(null);

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
        setLiveTranscript(transcriptRef.current.join(" "));
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
      }
    };

    const onError = (event: any) => {
      const message =
        event?.message || event?.error?.message || "साथी सेवा जडान गर्न सकिएन।";
      setError(message);
    };

    vapi.on("call-start", onCallStart);
    vapi.on("message", onMessage);
    vapi.on("call-end", onCallEnd);
    vapi.on("error", onError);

    return () => {
      vapi.off("call-start", onCallStart);
      vapi.off("message", onMessage);
      vapi.off("call-end", onCallEnd);
      vapi.off("error", onError);
    };
  }, [assessmentId]);

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
              <p>स्कोर: {assessment.score} / 15</p>
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

          {callId && (
            <p className="text-[14px] text-[#888888]">Call ID: {callId}</p>
          )}

          {liveTranscript && (
            <div className="bg-[#F8FAF9] rounded-[10px] p-3">
              <p className="text-[14px] font-semibold text-[#111111] mb-1">
                प्रतिलिपि (लाइभ)
              </p>
              <p className="text-[14px] text-[#3B3B3B] leading-relaxed">
                {liveTranscript}
              </p>
            </div>
          )}

          {error && (
            <p className="text-[15px] text-[#AB5338] font-medium">{error}</p>
          )}

          <button
            type="button"
            onClick={startCall}
            disabled={starting}
            className="w-full h-[64px] rounded-[14px] border-2 border-[#1F7A7A] bg-white text-[#1F7A7A] text-[22px] font-bold disabled:opacity-60"
          >
            {starting ? "कुरा सुरु हुँदैछ..." : "साथीसँग कुरा सुरु गर्नुहोस्"}
          </button>
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
