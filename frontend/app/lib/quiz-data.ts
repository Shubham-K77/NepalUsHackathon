// GDS-15 Questions — mirrored from backend/questions/questions.constants.js
// These are the clinically validated questions — DO NOT modify text or scoring

export interface GDS15Question {
  id: number;
  question: string;
  options: {
    yes: { label: string; score: number };
    no: { label: string; score: number };
  };
  depressiveAnswer: "yes" | "no";
}

export const GDS15_QUESTIONS: GDS15Question[] = [
  { id: 1, question: "के तपाईं आफ्नो जीवनसँग सन्तुष्ट हुनुहुन्छ?", options: { yes: { label: "हो", score: 0 }, no: { label: "होइन", score: 1 } }, depressiveAnswer: "no" },
  { id: 2, question: "के तपाईंले आफ्ना धेरै चासो र गतिविधिहरू छोड्नुभएको छ?", options: { yes: { label: "हो", score: 1 }, no: { label: "होइन", score: 0 } }, depressiveAnswer: "yes" },
  { id: 3, question: "के तपाईंलाई लाग्छ कि तपाईंको जीवन खाली छ?", options: { yes: { label: "हो", score: 1 }, no: { label: "होइन", score: 0 } }, depressiveAnswer: "yes" },
  { id: 4, question: "के तपाईं प्रायः बोर हुनुहुन्छ?", options: { yes: { label: "हो", score: 1 }, no: { label: "होइन", score: 0 } }, depressiveAnswer: "yes" },
  { id: 5, question: "के तपाईं अधिकांश समय खुसी हुनुहुन्छ?", options: { yes: { label: "हो", score: 0 }, no: { label: "होइन", score: 1 } }, depressiveAnswer: "no" },
  { id: 6, question: "के तपाईंलाई डर लाग्छ कि तपाईंसँग केही नराम्रो हुने छ?", options: { yes: { label: "हो", score: 1 }, no: { label: "होइन", score: 0 } }, depressiveAnswer: "yes" },
  { id: 7, question: "के तपाईं अधिकांश समय खुसी महसुस गर्नुहुन्छ?", options: { yes: { label: "हो", score: 0 }, no: { label: "होइन", score: 1 } }, depressiveAnswer: "no" },
  { id: 8, question: "के तपाईं प्रायः असहाय महसुस गर्नुहुन्छ?", options: { yes: { label: "हो", score: 1 }, no: { label: "होइन", score: 0 } }, depressiveAnswer: "yes" },
  { id: 9, question: "के तपाईं घरबाट बाहिर जानुभन्दा घरमै बस्न रुचाउनुहुन्छ?", options: { yes: { label: "हो", score: 1 }, no: { label: "होइन", score: 0 } }, depressiveAnswer: "yes" },
  { id: 10, question: "के तपाईंलाई लाग्छ कि अरू मानिसहरूभन्दा तपाईंको सम्झनाशक्ति बढी कमजोर छ?", options: { yes: { label: "हो", score: 1 }, no: { label: "होइन", score: 0 } }, depressiveAnswer: "yes" },
  { id: 11, question: "के तपाईंलाई लाग्छ कि अहिले जिउनु राम्रो कुरा हो?", options: { yes: { label: "हो", score: 0 }, no: { label: "होइन", score: 1 } }, depressiveAnswer: "no" },
  { id: 12, question: "के तपाईंलाई आफू बेकार लाग्छ?", options: { yes: { label: "हो", score: 1 }, no: { label: "होइन", score: 0 } }, depressiveAnswer: "yes" },
  { id: 13, question: "के तपाईं ऊर्जावान महसुस गर्नुहुन्छ?", options: { yes: { label: "हो", score: 0 }, no: { label: "होइन", score: 1 } }, depressiveAnswer: "no" },
  { id: 14, question: "के तपाईंलाई लाग्छ कि तपाईंको अवस्था निराशाजनक छ?", options: { yes: { label: "हो", score: 1 }, no: { label: "होइन", score: 0 } }, depressiveAnswer: "yes" },
  { id: 15, question: "के तपाईंलाई लाग्छ कि अरू मानिसहरू तपाईंभन्दा धेरै राम्रो अवस्थामा छन्?", options: { yes: { label: "हो", score: 1 }, no: { label: "होइन", score: 0 } }, depressiveAnswer: "yes" },
];

// Segment definitions for gamification
export const SEGMENTS = [
  { start: 1, end: 5, label: "सुरुवात", emoji: "🌱", milestone: "राम्रो! ५ प्रश्न सकियो! 🎉", progress: "⅓ पूरा भयो!", encourage: "तपाईं राम्रो गर्दै हुनुहुन्छ! अलिकति बाँकी छ।" },
  { start: 6, end: 10, label: "बीचमा", emoji: "🌿", milestone: "शाबास! १० प्रश्न सके! 💪", progress: "⅔ पूरा भयो!", encourage: "अब ५ वटा मात्र बाँकी छ! हिम्मत!" },
  { start: 11, end: 15, label: "अन्तिम", emoji: "🌳", milestone: "बधाई छ! सबै प्रश्न सकियो! 🎊", progress: "सम्पूर्ण!", encourage: "तपाईंले सबै प्रश्नको जवाफ दिनुभयो!" },
];

// Quiz copy strings
export const QUIZ_COPY = {
  title: "मनको कुरा प्रश्नावली",
  subtitle: "हरेक प्रश्नको जवाफ \"हो\" वा \"होइन\" मा दिनुहोस्",
  yes: "हो",
  no: "होइन",
  continue: "जारी राख्नुहोस् →",
  submitting: "पठाउँदैछ...",
  listenAgain: "फेरि सुन्नुहोस्",
  questionOf: "प्रश्न",
  of: "मध्ये",
  segment: "भाग",
};

// localStorage keys
export const STORAGE_KEYS = {
  QUIZ_PROGRESS: "mankokura_quiz_progress",
  QUIZ_ANSWERS: "mankokura_quiz_answers",
};
