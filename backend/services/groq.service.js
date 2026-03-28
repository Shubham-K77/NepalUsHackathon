//Imports
import Groq from "groq-sdk";
import { districtNames, provinceNames } from "../const.values.js";
//Config
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
//Exports
export const generateSuggestions = async (user, score, severity) => {
  const districtNepali = districtNames[user.district].ne;
  const provinceNepali = provinceNames[user.province].ne;
  const severityNepali =
    severity === "normal"
      ? "सामान्य"
      : severity === "mild"
        ? "हल्का अवसाद"
        : severity === "moderate"
          ? "मध्यम अवसाद"
          : "गम्भीर अवसाद";
  const prompt = `
    You are a compassionate mental health assistant for elderly Nepali people.

    User Information:
        - Name: ${user.name}
        - Age: ${new Date().getFullYear() - new Date(user.dob).getFullYear()}
        - District: ${districtNepali} (${user.district})
        - Province: ${provinceNepali}
        - GDS-15 Score: ${score} / 15
        - Severity: ${severityNepali} (${severity})

    Based on this information, generate personalized mental health suggestions.

    Return ONLY a valid JSON object in this exact structure, nothing else:

    {
        "message": "A warm, encouraging 2-sentence message in Nepali for this specific user based on their score",
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
        "emergency": "always include TPO Nepal: 1660-01-11116"
    }

    Rules:
        - message must be in Nepali, warm and specific to their score
        - suggest 3 activities appropriate for elderly people
        - suggest 2-3 real mental health resources available in ${user.district} district or nationwide in Nepal
        - always include TPO Nepal and Umang helpline in helplines
        - if severity is moderate or severe, add a strong but gentle message to seek professional help
        - all text fields must be in Nepali except resource names and phone numbers
        - return only JSON, no markdown, no backticks, no extra text
`;
  const response = await groq.chat.completions.create({
    model: "openai/gpt-oss-120b",
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
  // Strip backticks if model adds them anyway
  const clean = raw.replace(/```json|```/g, "").trim();
  const suggestions = JSON.parse(clean);
  return suggestions;
};
