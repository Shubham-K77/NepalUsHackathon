import { useEffect, useState } from "react";

interface ConfettiPiece {
  id: number;
  x: number;
  color: string;
  delay: number;
  size: number;
  duration: number;
  rotation: number;
}

interface ConfettiBurstProps {
  active: boolean;
  onComplete?: () => void;
}

const COLORS = ["#1F7A7A", "#3E7457", "#AB5338", "#F59E0B", "#EC4899", "#6366F1", "#10B981"];

export function ConfettiBurst({ active, onComplete }: ConfettiBurstProps) {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([]);

  useEffect(() => {
    if (!active) return;

    const newPieces: ConfettiPiece[] = Array.from({ length: 40 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      delay: Math.random() * 0.5,
      size: 6 + Math.random() * 8,
      duration: 1.2 + Math.random() * 0.8,
      rotation: Math.random() * 360,
    }));

    setPieces(newPieces);

    const timer = setTimeout(() => {
      setPieces([]);
      onComplete?.();
    }, 2500);

    return () => clearTimeout(timer);
  }, [active, onComplete]);

  if (!pieces.length) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {pieces.map((p) => (
        <div
          key={p.id}
          className="absolute top-0"
          style={{
            left: `${p.x}%`,
            animation: `confetti-fall ${p.duration}s ease-in ${p.delay}s forwards`,
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            borderRadius: Math.random() > 0.5 ? "50%" : "2px",
            transform: `rotate(${p.rotation}deg)`,
            opacity: 0,
          }}
        />
      ))}
    </div>
  );
}
