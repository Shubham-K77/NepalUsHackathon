import { Avatar, type AvatarMood } from "./Avatar";

interface GamifiedProgressBarProps {
  current: number;   // 0-based answered questions count
  total: number;     // 15
  avatarMood: AvatarMood;
}

export function GamifiedProgressBar({ current, total, avatarMood }: GamifiedProgressBarProps) {
  const percentage = Math.min((current / total) * 100, 100);

  // Convert number to Nepali numerals
  const toNepali = (n: number) =>
    n.toString().replace(/\d/g, (d) => "०१२३४५६७८९"[parseInt(d)]);

  const SEGMENT_EMOJIS = ["🌱", "🌿", "🌳"];
  const SEGMENT_LABELS = ["सुरुवात", "बीचमा", "अन्तिम"];

  return (
    <div className="w-full max-w-[480px] mx-auto mb-4 px-2">
      {/* Counter row */}
      <div className="flex justify-between items-center mb-3">
        <span className="text-[17px] font-semibold text-[#3B3B3B]">
          प्रश्न {toNepali(current)}/{toNepali(total)}
        </span>
        <div className="flex items-center gap-2">
          <div className="bg-[#E8F5F0] rounded-full px-3 py-0.5">
            <span className="text-[15px] font-bold text-[#1F7A7A]">
              {Math.round(percentage)}%
            </span>
          </div>
        </div>
      </div>

      {/* Track + avatar slider */}
      <div className="relative">
        {/* Avatar walking along the bar */}
        <div
          className="absolute -top-10 transition-all duration-700 ease-out"
          style={{
            left: `calc(${Math.max(0, Math.min(percentage, 95))}% - 24px)`,
          }}
        >
          <Avatar mood={avatarMood} size="sm" />
        </div>

        {/* Progress track */}
        <div className="w-full h-4 bg-[#E0E0E0] rounded-full overflow-visible relative mt-2">
          {/* Segment milestone markers */}
          {[33.3, 66.6].map((pos) => (
            <div
              key={pos}
              className="absolute top-1/2 -translate-y-1/2 w-1.5 h-6 bg-white rounded-full z-10 shadow-sm"
              style={{ left: `calc(${pos}% - 3px)` }}
            />
          ))}

          {/* Fill bar */}
          <div
            className="h-full relative overflow-hidden rounded-full transition-all duration-700 ease-out"
            style={{
              width: `${percentage}%`,
              background: "linear-gradient(90deg, #1F7A7A 0%, #3E7457 60%, #2D8A5E 100%)",
            }}
          >
            {/* Shimmer effect */}
            <div className="absolute inset-0 shimmer-bar" />
          </div>
        </div>

        {/* Segment labels below */}
        <div className="flex justify-between mt-2 px-1">
          {SEGMENT_EMOJIS.map((emoji, i) => (
            <div key={i} className="flex flex-col items-center gap-0.5">
              <span className="text-[16px]">{emoji}</span>
              <span className="text-[11px] text-[#888888] font-medium">{SEGMENT_LABELS[i]}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
