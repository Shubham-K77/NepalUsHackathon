// GDS-15 Questions
export const GDS15_QUESTIONS = [
  {
    id: 1,
    question: "के तपाईं आफ्नो जीवनसँग सन्तुष्ट हुनुहुन्छ?",
    options: {
      yes: { label: "हो", score: 0 },
      no: { label: "होइन", score: 1 },
    },
    depressiveAnswer: "no",
  },
  {
    id: 2,
    question: "के तपाईंले आफ्ना धेरै चासो र गतिविधिहरू छोड्नुभएको छ?",
    options: {
      yes: { label: "हो", score: 1 },
      no: { label: "होइन", score: 0 },
    },
    depressiveAnswer: "yes",
  },
  {
    id: 3,
    question: "के तपाईंलाई लाग्छ कि तपाईंको जीवन खाली छ?",
    options: {
      yes: { label: "हो", score: 1 },
      no: { label: "होइन", score: 0 },
    },
    depressiveAnswer: "yes",
  },
  {
    id: 4,
    question: "के तपाईं प्रायः बोर हुनुहुन्छ?",
    options: {
      yes: { label: "हो", score: 1 },
      no: { label: "होइन", score: 0 },
    },
    depressiveAnswer: "yes",
  },
  {
    id: 5,
    question: "के तपाईं अधिकांश समय खुसी हुनुहुन्छ?",
    options: {
      yes: { label: "हो", score: 0 },
      no: { label: "होइन", score: 1 },
    },
    depressiveAnswer: "no",
  },
  {
    id: 6,
    question: "के तपाईंलाई डर लाग्छ कि तपाईंसँग केही नराम्रो हुने छ?",
    options: {
      yes: { label: "हो", score: 1 },
      no: { label: "होइन", score: 0 },
    },
    depressiveAnswer: "yes",
  },
  {
    id: 7,
    question: "के तपाईं अधिकांश समय खुसी महसुस गर्नुहुन्छ?",
    options: {
      yes: { label: "हो", score: 0 },
      no: { label: "होइन", score: 1 },
    },
    depressiveAnswer: "no",
  },
  {
    id: 8,
    question: "के तपाईं प्रायः असहाय महसुस गर्नुहुन्छ?",
    options: {
      yes: { label: "हो", score: 1 },
      no: { label: "होइन", score: 0 },
    },
    depressiveAnswer: "yes",
  },
  {
    id: 9,
    question: "के तपाईं घरबाट बाहिर जानुभन्दा घरमै बस्न रुचाउनुहुन्छ?",
    options: {
      yes: { label: "हो", score: 1 },
      no: { label: "होइन", score: 0 },
    },
    depressiveAnswer: "yes",
  },
  {
    id: 10,
    question:
      "के तपाईंलाई लाग्छ कि अरू मानिसहरूभन्दा तपाईंको सम्झनाशक्ति बढी कमजोर छ?",
    options: {
      yes: { label: "हो", score: 1 },
      no: { label: "होइन", score: 0 },
    },
    depressiveAnswer: "yes",
  },
  {
    id: 11,
    question: "के तपाईंलाई लाग्छ कि अहिले जिउनु राम्रो कुरा हो?",
    options: {
      yes: { label: "हो", score: 0 },
      no: { label: "होइन", score: 1 },
    },
    depressiveAnswer: "no",
  },
  {
    id: 12,
    question: "के तपाईंलाई आफू बेकार लाग्छ?",
    options: {
      yes: { label: "हो", score: 1 },
      no: { label: "होइन", score: 0 },
    },
    depressiveAnswer: "yes",
  },
  {
    id: 13,
    question: "के तपाईं ऊर्जावान महसुस गर्नुहुन्छ?",
    options: {
      yes: { label: "हो", score: 0 },
      no: { label: "होइन", score: 1 },
    },
    depressiveAnswer: "no",
  },
  {
    id: 14,
    question: "के तपाईंलाई लाग्छ कि तपाईंको अवस्था निराशाजनक छ?",
    options: {
      yes: { label: "हो", score: 1 },
      no: { label: "होइन", score: 0 },
    },
    depressiveAnswer: "yes",
  },
  {
    id: 15,
    question:
      "के तपाईंलाई लाग्छ कि अरू मानिसहरू तपाईंभन्दा धेरै राम्रो अवस्थामा छन्?",
    options: {
      yes: { label: "हो", score: 1 },
      no: { label: "होइन", score: 0 },
    },
    depressiveAnswer: "yes",
  },
];
// Function to calculate severity based on score
export const calculateSeverity = (score) => {
  if (score <= 4) return "normal";
  if (score <= 9) return "moderate";
  return "severe";
};
