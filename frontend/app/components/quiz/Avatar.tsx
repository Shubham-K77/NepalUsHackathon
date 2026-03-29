import { useEffect, useState } from "react";

export type AvatarMood = "happy" | "excited" | "thinking" | "celebrating" | "encouraging";

interface AvatarProps {
  mood?: AvatarMood;
  size?: "sm" | "md" | "lg";
  className?: string;
}

// A friendly elderly Nepali grandpa avatar using SVG
export function Avatar({ mood = "happy", size = "md", className = "" }: AvatarProps) {
  const [bounce, setBounce] = useState(false);

  useEffect(() => {
    setBounce(true);
    const t = setTimeout(() => setBounce(false), 600);
    return () => clearTimeout(t);
  }, [mood]);

  const sizes = { sm: 64, md: 96, lg: 128 };
  const s = sizes[size];

  // Body/skin color: warm brown
  const skin = "#D4956A";
  const skinDark = "#B87A50";
  const hair = "#6B5744"; // grey-brown for elderly
  const clothes = "#1F7A7A"; // teal - brand color

  // Eyes change by mood
  const getEyes = () => {
    switch (mood) {
      case "excited":
      case "celebrating":
        return (
          <>
            {/* Star eyes */}
            <text x="36" y="54" fontSize="10" textAnchor="middle" fill="#F59E0B">★</text>
            <text x="60" y="54" fontSize="10" textAnchor="middle" fill="#F59E0B">★</text>
          </>
        );
      case "thinking":
        return (
          <>
            <ellipse cx="36" cy="52" rx="4" ry="3" fill="#111" />
            <ellipse cx="60" cy="52" rx="4" ry="3" fill="#111" />
            {/* Thinking dots */}
            <circle cx="72" cy="38" r="2.5" fill="#888" opacity="0.7" />
            <circle cx="78" cy="33" r="2" fill="#888" opacity="0.5" />
            <circle cx="83" cy="29" r="1.5" fill="#888" opacity="0.3" />
          </>
        );
      case "happy":
      case "encouraging":
      default:
        return (
          <>
            <ellipse cx="36" cy="52" rx="4.5" ry="4" fill="#111" />
            <ellipse cx="60" cy="52" rx="4.5" ry="4" fill="#111" />
            {/* Eye shine */}
            <circle cx="38" cy="50" r="1.5" fill="white" />
            <circle cx="62" cy="50" r="1.5" fill="white" />
          </>
        );
    }
  };

  const getMouth = () => {
    switch (mood) {
      case "excited":
      case "celebrating":
        // Big open happy smile
        return <path d="M 34 66 Q 48 78 62 66" stroke="#111" strokeWidth="2.5" fill="#ffb3b3" strokeLinecap="round" />;
      case "thinking":
        return <path d="M 36 68 Q 48 65 60 68" stroke="#111" strokeWidth="2" fill="none" strokeLinecap="round" />;
      case "encouraging":
        return <path d="M 34 66 Q 48 76 62 66" stroke="#111" strokeWidth="2.5" fill="none" strokeLinecap="round" />;
      default:
        return <path d="M 36 66 Q 48 74 60 66" stroke="#111" strokeWidth="2.5" fill="none" strokeLinecap="round" />;
    }
  };

  const getHands = () => {
    if (mood === "celebrating") {
      return (
        <>
          {/* Raised arms */}
          <path d="M 28 100 Q 10 70 18 55" stroke={clothes} strokeWidth="10" strokeLinecap="round" fill="none" />
          <circle cx="16" cy="52" r="7" fill={skin} />
          <path d="M 68 100 Q 86 70 78 55" stroke={clothes} strokeWidth="10" strokeLinecap="round" fill="none" />
          <circle cx="80" cy="52" r="7" fill={skin} />
        </>
      );
    }
    if (mood === "encouraging") {
      return (
        <>
          {/* Thumbs up */}
          <path d="M 28 105 Q 14 95 20 80" stroke={clothes} strokeWidth="10" strokeLinecap="round" fill="none" />
          <circle cx="18" cy="77" r="7" fill={skin} />
          <path d="M 18 77 L 18 68" stroke={skin} strokeWidth="4" strokeLinecap="round" />
          <path d="M 68 105 Q 82 95 76 80" stroke={clothes} strokeWidth="10" strokeLinecap="round" fill="none" />
          <circle cx="78" cy="77" r="7" fill={skin} />
        </>
      );
    }
    return (
      <>
        {/* Resting arms */}
        <path d="M 30 100 Q 18 95 22 85" stroke={clothes} strokeWidth="10" strokeLinecap="round" fill="none" />
        <circle cx="21" cy="83" r="7" fill={skin} />
        <path d="M 66 100 Q 78 95 74 85" stroke={clothes} strokeWidth="10" strokeLinecap="round" fill="none" />
        <circle cx="75" cy="83" r="7" fill={skin} />
      </>
    );
  };

  const animClass = bounce
    ? "scale-110 transition-transform duration-300"
    : mood === "celebrating"
    ? "animate-bounce"
    : mood === "thinking"
    ? "animate-pulse"
    : "";

  return (
    <div
      className={`inline-flex flex-col items-center ${animClass} ${className}`}
      style={{ width: s, height: s }}
    >
      <svg
        viewBox="0 0 96 140"
        width={s}
        height={s}
        aria-label="मनको कुरा सहायक"
        role="img"
      >
        {/* Body */}
        <rect x="22" y="98" width="52" height="38" rx="10" fill={clothes} />

        {/* Neck */}
        <rect x="40" y="88" width="16" height="14" rx="4" fill={skin} />

        {/* Head */}
        <ellipse cx="48" cy="52" rx="34" ry="36" fill={skin} />

        {/* Hair / traditional topi */}
        <ellipse cx="48" cy="22" rx="32" ry="14" fill={hair} />
        <rect x="16" y="22" width="64" height="8" rx="4" fill={hair} />
        {/* Topi decoration */}
        <ellipse cx="48" cy="20" rx="30" ry="10" fill="#8B6F5E" />
        <rect x="18" y="20" width="60" height="5" rx="2.5" fill="#7A5C4A" />

        {/* Ears */}
        <ellipse cx="14" cy="52" rx="5" ry="7" fill={skinDark} />
        <ellipse cx="82" cy="52" rx="5" ry="7" fill={skinDark} />

        {/* Eyes */}
        {getEyes()}

        {/* Eyebrows */}
        <path d="M 29 44 Q 36 40 43 43" stroke="#6B5744" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        <path d="M 53 43 Q 60 40 67 44" stroke="#6B5744" strokeWidth="2.5" fill="none" strokeLinecap="round" />

        {/* Nose */}
        <ellipse cx="48" cy="60" rx="4" ry="3" fill={skinDark} opacity="0.5" />

        {/* Mouth */}
        {getMouth()}

        {/* Wrinkles (elderly) */}
        <path d="M 20 48 Q 24 45 26 48" stroke={skinDark} strokeWidth="1" fill="none" opacity="0.4" />
        <path d="M 70 48 Q 72 45 76 48" stroke={skinDark} strokeWidth="1" fill="none" opacity="0.4" />

        {/* Hands */}
        {getHands()}

        {/* Feet */}
        <ellipse cx="36" cy="137" rx="10" ry="5" fill={skinDark} />
        <ellipse cx="60" cy="137" rx="10" ry="5" fill={skinDark} />
      </svg>
    </div>
  );
}
