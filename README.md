# Manko Kura (मनको कुरा)

**Manko Kura** — meaning "Mind's Story" or "Thoughts of the Mind" in Nepali — is a bilingual mental health assessment web application designed for Nepal. It implements the **GDS-15 (Geriatric Depression Scale)** questionnaire to help older adults evaluate their depression levels and connect with culturally-relevant mental health resources.

---

## Features

- **GDS-15 Assessment** — 15-question validated depression screening tool with a 0–15 scoring system
- **Three-step survey flow** — personal info, questionnaire, and result display
- **Result history** — stores up to 20 past assessments in the browser with a progress chart
- **Community resources** — local mental health professionals, hospitals, hotlines, and support groups specific to Nepal
- **Bilingual UI** — fully translated in Nepali (default) and English
- **PWA support** — installable on mobile devices with offline capability
- **Accessible components** — built with Radix UI primitives

---

## Tech Stack

| Category      | Technology                        |
| ------------- | --------------------------------- |
| Framework     | Next.js 15 (App Router)           |
| Language      | TypeScript 5                      |
| Styling       | Tailwind CSS, shadcn/ui, Radix UI |
| State         | Zustand, Jotai                    |
| Forms         | React Hook Form + Zod             |
| Data fetching | TanStack React Query              |
| Charts        | Chart.js + react-chartjs-2        |
| Animation     | Framer Motion                     |
| i18n          | next-intl                         |
| PWA           | @ducanh2912/next-pwa              |

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Installation

```bash
git clone https://github.com/biratdevpoudel/manko-kura.git
cd manko-kura
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. The app defaults to the Nepali locale (`/ne`).

### Production Build

```bash
npm run build
npm start
```

### Linting

```bash
npm run lint
```

---

## Project Structure

```
manko-kura/
├── app/
│   ├── [locale]/               # Locale-scoped pages (ne, en)
│   │   ├── page.tsx            # Landing page
│   │   ├── layout.tsx          # Locale layout
│   │   ├── survey/             # Survey flow
│   │   ├── results/            # Results page
│   │   ├── community/          # Community resources
│   │   └── resources/          # Professional resources
│   ├── globals.css
│   └── layout.tsx              # Root layout
├── components/
│   ├── landing/                # Hero section
│   ├── layout/                 # Header, BottomNav, LanguageSwitcher
│   ├── survey/                 # PersonalInfoForm, QuestionCard, SurveyProgress
│   ├── results/                # ScoreResult, HistoryChart
│   ├── ui/                     # shadcn/ui primitives
│   └── providers/              # React context providers
├── lib/
│   ├── store/surveyStore.ts    # Zustand survey state
│   ├── atoms/surveyAtoms.ts    # Jotai atoms
│   ├── hooks/                  # Custom React hooks
│   └── utils/
│       ├── gdsScoring.ts       # GDS-15 scoring logic
│       └── localStorage.ts     # Result persistence
├── messages/
│   ├── ne.json                 # Nepali translations
│   └── en.json                 # English translations
├── i18n/                       # next-intl routing & request config
├── types/survey.ts             # TypeScript types
└── middleware.ts               # Locale detection & redirect
```

---

## GDS-15 Scoring

| Score   | Category            |
| ------- | ------------------- |
| 0 – 4   | Normal              |
| 5 – 8   | Mild Depression     |
| 9 – 11  | Moderate Depression |
| 12 – 15 | Severe Depression   |

Answers are scored based on positive/negative question indicators. Results are stored locally in the browser (`localStorage`) and are never sent to any server.

---

## Localization

The app supports two locales:

| Locale | Language                  |
| ------ | ------------------------- |
| `ne`   | Nepali (नेपाली) — default |
| `en`   | English                   |

Language can be switched at any time using the in-app language switcher. Routes are prefixed by locale (e.g., `/ne/survey`, `/en/survey`).

---

## Data Privacy

All assessment data is stored **only in your browser** using `localStorage`. No personal information or survey responses are transmitted to any server.

---

## Contributing

Contributions are welcome. Please open an issue first to discuss changes.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m 'Add your feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a pull request

---

## License

This project is open-source. See [LICENSE](LICENSE) for details.
