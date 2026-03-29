// ─── Nepali UI Copy Strings ───────────────────────────────────────────────────

export const COPY = {
  appTitle: "मनको कुरा",
  greeting: "🙏 नमस्कार!",
  nameQuestion: "तपाईंको नाम के हो?",
  namePlaceholder: "यहाँ नाम लेख्नुहोस्",
  dobQuestion: "तपाईंको जन्म मिति कहिले हो?",
  provinceQuestion: "तपाईं कुन प्रदेशमा बस्नुहुन्छ?",
  districtQuestion: "तपाईंको जिल्ला छान्नुहोस्",
  genderQuestion: "तपाईंको लिङ्ग?",
  pinCreate: "४ अंकको PIN बनाउनुहोस्",
  pinCreateSubtitle: "यो PIN सम्झिराख्नुहोस्, अंक देवनागरीमा देखिन्छ",
  pinEnter: "स्वागत छ! PIN हाल्नुहोस्",
  welcomeBack: "स्वागत छ, {name} हजुर! फेरि भेट भयो!",
  next: "अर्को →",
  back: "← पछाडि",
  submitNew: "सुरु गरौं 🙏",
  submitReturning: "भित्र जानुहोस् →",
  loading: "जाँच गर्दै...",
  errorName: "कृपया आफ्नो नाम लेख्नुहोस्",
  errorDate: "कृपया जन्म मिति चयन गर्नुहोस्",
  errorPin: "PIN मिलेन, फेरि प्रयास गर्नुहोस्",
  errorGeneral: "केही समस्या भयो, फेरि प्रयास गर्नुहोस्",
  disclaimer:
    "⚠ यो एक स्क्रिनिङ उपकरण हो। संकटमा TPO Nepal: 1660-01-11116 मा सम्पर्क गर्नुहोस्।",
};

// ─── Provinces (7 provinces of Nepal) ─────────────────────────────────────────

export const PROVINCES = [
  { value: "KOSHI", label: "कोशी प्रदेश" },
  { value: "MADHESH", label: "मधेश प्रदेश" },
  { value: "BAGMATI", label: "बागमती प्रदेश" },
  { value: "GANDAKI", label: "गण्डकी प्रदेश" },
  { value: "LUMBINI", label: "लुम्बिनी प्रदेश" },
  { value: "KARNALI", label: "कर्णाली प्रदेश" },
  { value: "SUDURPASHCHIM", label: "सुदूरपश्चिम प्रदेश" },
] as const;

// ─── Districts (77 districts grouped by province) ────────────────────────────

export const DISTRICTS: Record<string, { value: string; label: string }[]> = {
  KOSHI: [
    { value: "TAPLEJUNG", label: "ताप्लेजुङ" },
    { value: "SANKHUWASABHA", label: "सङ्खुवासभा" },
    { value: "SOLUKHUMBU", label: "सोलुखुम्बु" },
    { value: "OKHALDHUNGA", label: "ओखलढुङ्गा" },
    { value: "KHOTANG", label: "खोटाङ" },
    { value: "BHOJPUR", label: "भोजपुर" },
    { value: "DHANKUTA", label: "धनकुटा" },
    { value: "TERHATHUM", label: "तेह्रथुम" },
    { value: "PANCHTHAR", label: "पाँचथर" },
    { value: "ILAM", label: "इलाम" },
    { value: "JHAPA", label: "झापा" },
    { value: "MORANG", label: "मोरङ" },
    { value: "SUNSARI", label: "सुनसरी" },
    { value: "UDAYAPUR", label: "उदयपुर" },
  ],
  MADHESH: [
    { value: "SAPTARI", label: "सप्तरी" },
    { value: "SIRAHA", label: "सिरहा" },
    { value: "DHANUSHA", label: "धनुषा" },
    { value: "MAHOTTARI", label: "महोत्तरी" },
    { value: "SARLAHI", label: "सर्लाही" },
    { value: "RAUTAHAT", label: "रौतहट" },
    { value: "BARA", label: "बारा" },
    { value: "PARSA", label: "पर्सा" },
  ],
  BAGMATI: [
    { value: "SINDHULI", label: "सिन्धुली" },
    { value: "RAMECHHAP", label: "रामेछाप" },
    { value: "DOLAKHA", label: "दोलखा" },
    { value: "SINDHUPALCHOK", label: "सिन्धुपाल्चोक" },
    { value: "KAVREPALANCHOK", label: "काभ्रेपलाञ्चोक" },
    { value: "LALITPUR", label: "ललितपुर" },
    { value: "BHAKTAPUR", label: "भक्तपुर" },
    { value: "KATHMANDU", label: "काठमाडौं" },
    { value: "NUWAKOT", label: "नुवाकोट" },
    { value: "RASUWA", label: "रसुवा" },
    { value: "DHADING", label: "धादिङ" },
    { value: "MAKWANPUR", label: "मकवानपुर" },
    { value: "CHITWAN", label: "चितवन" },
  ],
  GANDAKI: [
    { value: "GORKHA", label: "गोरखा" },
    { value: "MANANG", label: "मनाङ" },
    { value: "MUSTANG", label: "मुस्ताङ" },
    { value: "MYAGDI", label: "म्याग्दी" },
    { value: "KASKI", label: "कास्की" },
    { value: "LAMJUNG", label: "लमजुङ" },
    { value: "TANAHU", label: "तनहुँ" },
    { value: "NAWALPUR", label: "नवलपुर" },
    { value: "SYANGJA", label: "स्याङ्जा" },
    { value: "PARBAT", label: "पर्वत" },
    { value: "BAGLUNG", label: "बागलुङ" },
  ],
  LUMBINI: [
    { value: "RUKUM_EAST", label: "रुकुम पूर्व" },
    { value: "ROLPA", label: "रोल्पा" },
    { value: "PYUTHAN", label: "प्युठान" },
    { value: "GULMI", label: "गुल्मी" },
    { value: "ARGHAKHANCHI", label: "अर्घाखाँची" },
    { value: "PALPA", label: "पाल्पा" },
    { value: "NAWALPARASI_EAST", label: "नवलपरासी पूर्व" },
    { value: "RUPANDEHI", label: "रुपन्देही" },
    { value: "KAPILVASTU", label: "कपिलवस्तु" },
    { value: "DANG", label: "दाङ" },
    { value: "BANKE", label: "बाँके" },
    { value: "BARDIYA", label: "बर्दिया" },
  ],
  KARNALI: [
    { value: "DOLPA", label: "डोल्पा" },
    { value: "MUGU", label: "मुगु" },
    { value: "HUMLA", label: "हुम्ला" },
    { value: "JUMLA", label: "जुम्ला" },
    { value: "KALIKOT", label: "कालिकोट" },
    { value: "DAILEKH", label: "दैलेख" },
    { value: "JAJARKOT", label: "जाजरकोट" },
    { value: "RUKUM_WEST", label: "रुकुम पश्चिम" },
    { value: "SALYAN", label: "सल्यान" },
    { value: "SURKHET", label: "सुर्खेत" },
  ],
  SUDURPASHCHIM: [
    { value: "BAJURA", label: "बाजुरा" },
    { value: "BAJHANG", label: "बझाङ" },
    { value: "ACHHAM", label: "अछाम" },
    { value: "DOTI", label: "डोटी" },
    { value: "KAILALI", label: "कैलाली" },
    { value: "KANCHANPUR", label: "कञ्चनपुर" },
    { value: "DADELDHURA", label: "डडेलधुरा" },
    { value: "BAITADI", label: "बैतडी" },
    { value: "DARCHULA", label: "दार्चुला" },
  ],
};

// ─── Genders ──────────────────────────────────────────────────────────────────

export const GENDERS = [
  { value: "MALE", label: "पुरुष" },
  { value: "FEMALE", label: "महिला" },
  { value: "OTHER", label: "अन्य" },
] as const;

// ─── Province to Nepali name lookup (for API submission) ──────────────────────

export const PROVINCE_NE: Record<string, string> = {
  KOSHI: "कोशी प्रदेश",
  MADHESH: "मधेश प्रदेश",
  BAGMATI: "बागमती प्रदेश",
  GANDAKI: "गण्डकी प्रदेश",
  LUMBINI: "लुम्बिनी प्रदेश",
  KARNALI: "कर्णाली प्रदेश",
  SUDURPASHCHIM: "सुदूरपश्चिम प्रदेश",
};

// ─── District to Nepali name lookup (for API submission) ──────────────────────

export const DISTRICT_NE: Record<string, string> = Object.fromEntries(
  Object.values(DISTRICTS)
    .flat()
    .map((d) => [d.value, d.label]),
);

// ─── Gender to Nepali name lookup (for API submission) ────────────────────────

export const GENDER_NE: Record<string, string> = {
  MALE: "पुरुष",
  FEMALE: "महिला",
  OTHER: "अन्य",
};
