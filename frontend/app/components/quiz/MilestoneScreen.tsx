import { useEffect, useState } from "react";
import { Button } from "../ui/Button";
import { Avatar } from "./Avatar";
import { ConfettiBurst } from "./ConfettiBurst";

interface MilestoneScreenProps {
  segmentIndex: number;
  milestone: string;
  progress: string;
  encourage: string;
  emoji: string;
  onContinue: () => void;
}

const MILESTONE_DATA = [
  {
    bg: "from-[#E8F5F0] to-[#F2FBF7]",
    accent: "#1F7A7A",
    stars: ["★", "☆", "☆"],
    badge: "🌱 सुरुवात पार गर्नुभयो!",
    sticker: "५/१५",
  },
  {
    bg: "from-[#EDF7F0] to-[#F0FAF4]",
    accent: "#3E7457",
    stars: ["★", "★", "☆"],
    badge: "🌿 बीचमा पुग्नुभयो!",
    sticker: "१०/१५",
  },
  {
    bg: "from-[#FFF8F0] to-[#FFF3E8]",
    accent: "#AB5338",
    stars: ["★", "★", "★"],
    badge: "🌳 सम्पूर्ण!",
    sticker: "१५/१५",
  },
];

export function MilestoneScreen({
  segmentIndex,
  milestone,
  progress,
  encourage,
  onContinue,
}: MilestoneScreenProps) {
  const [showConfetti, setShowConfetti] = useState(false);
  const [visible, setVisible] = useState(false);
  const data = MILESTONE_DATA[segmentIndex] ?? MILESTONE_DATA[0];

  useEffect(() => {
    // Stagger entrance
    const t1 = setTimeout(() => setVisible(true), 100);
    const t2 = setTimeout(() => setShowConfetti(true), 300);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  return (
    <>
      <ConfettiBurst active={showConfetti} onComplete={() => setShowConfetti(false)} />

      <div
        className={`flex flex-col items-center text-center space-y-5 py-6 px-4 transition-all duration-500 ${
          visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        }`}
      >
        {/* Avatar celebrating */}
        <div className="relative">
          <Avatar mood="celebrating" size="lg" className="drop-shadow-md" />
          {/* Stars orbit */}
          {data.stars.map((star, i) => (
            <div
              key={i}
              className="absolute text-[20px]"
              style={{
                top: `${-10 + i * 5}%`,
                left: i === 0 ? "-30%" : i === 1 ? "50%" : "110%",
                animation: `float-star ${1.5 + i * 0.3}s ease-in-out infinite alternate`,
                color: "#F59E0B",
              }}
            >
              {star}
            </div>
          ))}
        </div>

        {/* Badge */}
        <div
          className={`bg-gradient-to-r ${data.bg} border-2 rounded-2xl px-5 py-2`}
          style={{ borderColor: data.accent }}
        >
          <span className="text-[18px] font-bold" style={{ color: data.accent }}>
            {data.badge}
          </span>
        </div>

        {/* Big celebration text */}
        <div className="space-y-2">
          <h2 className="text-[30px] font-bold text-[#111111] leading-tight">{milestone}</h2>
          <div
            className="text-[48px] font-black leading-none"
            style={{ color: data.accent }}
          >
            {data.sticker}
          </div>
          <p className="text-[18px] font-semibold text-[#3B3B3B]">{progress}</p>
        </div>

        {/* XP pill */}
        <div className="flex items-center gap-2 bg-[#FFF8F0] border border-[#E8DED4] rounded-full px-5 py-2">
          <span className="text-[22px]">⚡</span>
          <span className="text-[18px] font-bold text-[#AB5338]">
            +{(segmentIndex + 1) * 10} XP अर्जन गर्नुभयो!
          </span>
        </div>

        {/* Encouragement */}
        <p className="text-[20px] font-medium text-[#3B3B3B] max-w-[340px] leading-relaxed">
          {encourage}
        </p>

        {/* GIF */}
        {segmentIndex === 0 && (
          <img
            src="/gif/min.gif"
            alt="उत्सव GIF"
            className="w-full max-w-[280px] rounded-[16px] object-contain"
          />
        )}
        {segmentIndex === 1 && (
          <img
            src="/gif/balen.gif"
            alt="उत्सव GIF"
            className="w-full max-w-[280px] rounded-[16px] object-contain"
          />
        )}

        {/* Continue button */}
        <div className="w-full max-w-[380px]">
          <Button onClick={onContinue}>
            {segmentIndex < 2 ? "जारी राख्नुहोस् →" : "नतिजा हेर्नुहोस् 🎊"}
          </Button>
        </div>
      </div>
    </>
  );
}
