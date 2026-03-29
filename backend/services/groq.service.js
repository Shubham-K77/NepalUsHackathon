//Imports
import Groq from "groq-sdk";
import { districtNames, provinceNames } from "../const.values.js";
//Config
// Lazy initialization - Groq client instantiated only when needed
const getGroq = () => new Groq({ apiKey: process.env.GROQ_API_KEY });
//Exports
export const generateSuggestions = async (user, score, severity) => {
  const districtNepali = districtNames[user.district].ne;
  const provinceNepali = provinceNames[user.province].ne;
  const severityNepali =
    severity === "normal"
      ? "सामान्य"
      : severity === "mild"
        ? "हल्का अवसाद"
        : "मध्यम अवसाद";

  let riskLevel, recommendationType, recommendationGuidelines;
  if (score <= 4) {
    // Tier 1: Low-risk (0-4)
    riskLevel = "TIER_1_LOW";
    recommendationType = "Basic Healthy Recommendations";
    recommendationGuidelines = `
    Focus on:
    - Daily wellness practices (yoga, walking, breathing exercises)
    - Spiritual activities (Bhajans, meditations, prayers)
    - Social engagement and family time
    - Healthy routines and self-care habits
    - Simple daily activities that bring joy
    `;
  } else if (score <= 9) {
    // Tier 2: Moderate-risk (5-9)
    riskLevel = "TIER_2_MODERATE";
    recommendationType = "Awareness and Community Engagement";
    recommendationGuidelines = `
    Focus on:
    - Awareness about depression and mental health
    - Community support groups and social connections
    - Structured activities and hobbies
    - Regular exercise and outdoor activities
    - Counseling or peer support opportunities
    - Family involvement and support
    `;
  } else {
    // Tier 3: High-risk (10-15)
    riskLevel = "TIER_3_HIGH";
    recommendationType = "Professional Support Required";
    recommendationGuidelines = `
    Focus on:
    - Immediate professional mental health counseling
    - Therapy and clinical support
    - Regular mental health monitoring
    - Crisis helplines and emergency contacts
    - Hospital or clinic referrals if needed
    - Family support and involvement
    - Crisis intervention resources
    `;
  }
  const prompt = `
    You are a compassionate mental health assistant for elderly Nepali people.

    User Information:
        - Name: ${user.name}
        - Age: ${new Date().getFullYear() - new Date(user.dob).getFullYear()}
        - District: ${districtNepali} (${user.district})
        - Province: ${provinceNepali}
        - GDS-15 Score: ${score} / 15
        - Severity: ${severityNepali} (${severity})

    CONTEXT: Risk Level is ${riskLevel} (GDS-15 Score: ${score}/15). 
    ${recommendationType}: ${recommendationGuidelines}

    Based on this information, generate personalized mental health suggestions tailored to the user's risk level.

    Return ONLY a valid JSON object in this exact structure, nothing else:

    {
        "message": "A warm, encouraging 2-3 sentence message in Nepali for this specific user based on their score and risk level",
        "activities": [
            {
                "emoji": "🚶",
                "title": "activity title in Nepali",
                "description": "one line description in Nepali"
            }
        ],
        "resources": [
            {
                "name": "resource name",
                "phone": "phone number",
                "description": "one line in Nepali",
                "availableIn": "district or nationwide"
            }
        ],
        "helplines": [
            {
                "name": "helpline name",
                "phone": "phone number"
            }
        ],
        "emergency": "TPO Nepal: 1660-01-11116"
    }

    Rules:
        - message must be in Nepali, warm and specific to their score and risk level
        - suggest 3 activities appropriate for elderly people and aligned with the ${recommendationType}
        ${
          riskLevel === "TIER_1_LOW"
            ? "- For TIER 1 (0-4): emphasize healthy daily habits, bhajans, meditation, and wellness activities"
            : riskLevel === "TIER_2_MODERATE"
              ? "- For TIER 2 (5-9): emphasize awareness, community engagement, social support groups, and counseling options"
              : "- For TIER 3 (10-15): emphasize urgent professional help, therapists, clinical support, and crisis resources"
        }
        - suggest 2-3 real mental health resources available in ${user.district} district or nationwide in Nepal
        - always include TPO Nepal (1660-01-11116) and Umang helpline in helplines
        - all text fields must be in Nepali except resource names and phone numbers
        - return only JSON, no markdown, no backticks, no extra text
`;
  const response = await getGroq().chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
    max_tokens: 1000,
    temperature: 0.7,
  });
  const raw = response.choices[0].message.content.trim();
  const cleanGroqResponse = (rawText) => {
    let cleaned = rawText.trim();
    // Remove markdown code blocks
    cleaned = cleaned.replace(/^```(?:json)?\s*/i, "");
    cleaned = cleaned.replace(/\s*```$/i, "");
    cleaned = cleaned.trim();
    // Extract JSON object
    const jsonStart = cleaned.indexOf("{");
    const jsonEnd = cleaned.lastIndexOf("}");
    if (jsonStart === -1 || jsonEnd === -1) {
      throw new Error("No valid JSON object found in Groq response");
    }
    cleaned = cleaned.slice(jsonStart, jsonEnd + 1);
    // Remove control characters
    cleaned = cleaned.replace(/[\x00-\x1F\x7F]/g, (char) => {
      if (char === "\n" || char === "\r" || char === "\t") return " ";
      return "";
    });
    // Collapse multiple spaces
    cleaned = cleaned.replace(/\s+/g, " ");
    return cleaned;
  };
  const clean = cleanGroqResponse(raw);
  const suggestions = JSON.parse(clean);
  return suggestions;
};
