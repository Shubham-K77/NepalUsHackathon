import prisma from "../services/prisma.service.js";
import Groq from "groq-sdk";
import { buildVapiSystemPrompt } from "./vapi.prompt.js";

const getGroq = () => new Groq({ apiKey: process.env.GROQ_API_KEY });

const cleanAndParseGroq = (raw) => {
  let cleaned = raw.trim();
  cleaned = cleaned
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");
  if (start === -1 || end === -1)
    throw new Error("No valid JSON in Groq response");
  cleaned = cleaned.slice(start, end + 1);
  cleaned = cleaned.replace(/[\x00-\x1F\x7F]/g, (c) =>
    c === "\n" || c === "\r" || c === "\t" ? " " : "",
  );
  return JSON.parse(cleaned.replace(/\s+/g, " "));
};

//POST /api/v1/vapi/setup
export const createVapiAssistant = async () => {
  const VAPI_API_KEY = process.env.VAPI_API_KEY;
  const WEBHOOK_URL = process.env.WEBHOOK_URL;

  const res = await fetch("https://api.vapi.ai/assistant", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${VAPI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: "Chain - Nepali Mental Health Companion",
      // Google STT — best Nepali support
      transcriber: {
        provider: "google",
        language: "Multilingual",
      },
      model: {
        provider: "groq",
        model: "llama3-70b-8192",
        temperature: 0.7,
        maxTokens: 500,
        messages: [
          {
            role: "system",
            content:
              "तपाईं एक मैत्रीपूर्ण मानसिक स्वास्थ्य साथी हुनुहुन्छ। सधैं नेपालीमा कुरा गर्नुस्।",
          },
        ],
      },
      // Azure Hemlekha — Nepali female voice
      voice: {
        provider: "azure",
        voiceId: "ne-NP-HemkalaNeural",
      },
      maxDurationSeconds: 900,
      endCallPhrases: ["नमस्ते फेरि भेटौंला", "बिदाई", "धन्यवाद नमस्ते"],
      serverUrl: WEBHOOK_URL,
      serverUrlSecret: process.env.VAPI_WEBHOOK_SECRET,
    }),
  });
  const data = await res.json();
  if (!data.id)
    throw new Error("Assistant creation failed: " + JSON.stringify(data));
  console.log("Assistant created! Add to .env:");
  console.log(`VAPI_ASSISTANT_ID=${data.id}`);
  return data;
};

//2. Initiate web call
export const initiateWebCall = async (userId, assessmentId) => {
  const VAPI_API_KEY = process.env.VAPI_API_KEY;
  const VAPI_ASSISTANT_ID = process.env.VAPI_ASSISTANT_ID;
  // Fetch user
  const user = await prisma.userModule.findUnique({
    where: { id: userId },
    omit: { pinHash: true },
  });
  if (!user) throw new Error("User not found");
  // Fetch assessment
  const assessment = await prisma.assessment.findUnique({
    where: { id: assessmentId },
  });
  if (!assessment) throw new Error("Assessment not found");
  // Security — must belong to this user
  if (assessment.userId !== userId)
    throw new Error("Assessment does not belong to this user");
  // Prevent duplicate calls
  const existing = await prisma.vapiCall.findUnique({
    where: { assessmentId },
    select: { id: true },
  });
  if (existing) throw new Error("Call already exists for this assessment");
  // Build dynamic system prompt from GDS-15 answers
  const systemPrompt = buildVapiSystemPrompt(user, assessment);
  // Call VAPI web call API
  const response = await fetch("https://api.vapi.ai/call/web", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${VAPI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      assistantId: VAPI_ASSISTANT_ID,
      assistantOverrides: {
        maxDurationSeconds: 900,
        // Must include provider when overriding model
        model: {
          provider: "groq",
          model: "llama3-70b-8192",
          messages: [{ role: "system", content: systemPrompt }],
        },
      },
    }),
  });
  const data = await response.json();
  if (!data.id)
    throw new Error("Vapi web call failed: " + JSON.stringify(data));
  // Save call record
  const vapiCall = await prisma.vapiCall.create({
    data: {
      userId,
      assessmentId,
      vapiCallId: data.id,
      phoneNumber: data.phoneNumber ?? "unknown",
      status: "initiated",
    },
  });
  return {
    vapiCallId: data.id,
    dbRecordId: vapiCall.id,
    webCallUrl: data.webCallUrl ?? null,
    status: "initiated",
  };
};

//3. Handle VAPI webhook
export const handleVapiWebhook = async (body) => {
  const message = body?.message ?? body;
  if (message?.type !== "end-of-call-report") return;
  const artifact = message?.artifact ?? {};
  const call = message?.call ?? {};
  const vapiCallId = call?.id;
  if (!vapiCallId) return;
  const transcript = artifact?.transcript || "";
  const summary = artifact?.summary || "";
  // Find call record
  const callRecord = await prisma.vapiCall.findUnique({
    where: { vapiCallId },
    select: {
      id: true,
      userId: true,
      assessmentId: true,
      vapiCallId: true,
      user: true,
      assessment: true,
    },
  });
  if (!callRecord) {
    console.error("Webhook: call record not found for", vapiCallId);
    return;
  }
  // Generate Groq suggestions
  let suggestions = null;
  let crisisDetected = false;
  try {
    const result = await generateSuggestionsFromCall(
      callRecord.user,
      callRecord.assessment,
      transcript,
    );
    suggestions = result.suggestions;
    crisisDetected = result.crisisDetected;
  } catch (err) {
    console.error("Groq failed for webhook:", err.message);
  }
  if (crisisDetected) {
    console.warn("CRISIS DETECTED for user:", callRecord.userId);
  }
  // Update call record
  await prisma.vapiCall.update({
    where: { vapiCallId },
    data: {
      transcript,
      summary,
      status: "completed",
      suggestions,
      crisisDetected,
    },
  });
  console.log("Webhook processed for call:", vapiCallId);
};

// 4. Groq — generate suggestions after call
export const generateSuggestionsFromCall = async (
  user,
  assessment,
  transcript,
) => {
  const age = new Date().getFullYear() - new Date(user.dob).getFullYear();

  const severityNepali =
    assessment?.severity === "normal"
      ? "सामान्य"
      : assessment?.severity === "moderate"
        ? "मध्यम अवसाद"
        : "गम्भीर अवसाद";

  const prompt = `
You are a compassionate mental health assistant for Nepali people.

User Information:
- Name: ${user.name}
- Age: ${age} years
- District: ${user.districtNe || user.district}
- GDS-15 Score: ${assessment?.score ?? "N/A"} / 15
- Severity: ${severityNepali} (${assessment?.severity})

Call Transcript:
${transcript || "Transcript not available"}

Using BOTH the GDS-15 score AND the call transcript, generate personalized suggestions.

Return ONLY valid JSON, no markdown, no backticks:

{
  "message": "2 warm sentence message in Nepali referencing both GDS score and something from the conversation",
  "keyThemes": ["one word theme in Nepali", "one word theme in Nepali"],
  "activities": [
    { "emoji": "🚶", "title": "activity title in Nepali", "description": "one line in Nepali" }
  ],
  "resources": [
    { "name": "resource name", "phone": "phone number", "description": "one line in Nepali", "availableIn": "Nationwide or district name" }
  ],
  "helplines": [
    { "name": "TPO Nepal", "phone": "1660-01-11116" },
    { "name": "Umang", "phone": "9840021600" }
  ],
  "emergency": "TPO Nepal: 1660-01-11116",
  "crisisDetected": false
}

Rules:
- crisisDetected = true if transcript has suicidal ideation, self-harm, or severe hopelessness
- suggest 3 activities appropriate for age ${age}
- suggest 2 real mental health resources in ${user.district} or nationwide Nepal
- always include TPO Nepal and Umang in helplines
- if severity is "moderate" or "severe" (Tier 2-3), encourage professional help and counseling
- all text in Nepali except resource names and phone numbers
`;
  const response = await getGroq().chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [{ role: "user", content: prompt }],
    max_tokens: 1000,
    temperature: 0.7,
  });
  const raw = response.choices[0].message.content.trim();
  const parsed = cleanAndParseGroq(raw);
  return {
    suggestions: parsed,
    crisisDetected: parsed.crisisDetected ?? false,
  };
};
